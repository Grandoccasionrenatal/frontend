import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Must use raw body for Stripe signature verification — disable body parsing
export const config = { api: { bodyParser: false } };

async function verifyStripeSignature(body: string, signature: string): Promise<boolean> {
  // Manual HMAC-SHA256 verification without the Stripe SDK
  const encoder = new TextEncoder();
  const parts = signature.split(',');
  const tPart = parts.find(p => p.startsWith('t='));
  const v1Part = parts.find(p => p.startsWith('v1='));
  if (!tPart || !v1Part) return false;

  const timestamp = tPart.slice(2);
  const expectedSig = v1Part.slice(3);
  const payload = `${timestamp}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const computedSig = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison
  if (computedSig.length !== expectedSig.length) return false;
  let diff = 0;
  for (let i = 0; i < computedSig.length; i++) {
    diff |= computedSig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature || !WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  const body = await req.text();

  const valid = await verifyStripeSignature(body, signature);
  if (!valid) {
    console.error('Stripe webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, any> } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};

    // Only process enquiry deposits (website checkout has its own flow)
    if (!meta.booking_type && !meta.customer_name) {
      return NextResponse.json({ received: true });
    }

    const {
      customer_name,
      customer_email,
      phone,
      postcode,
      booking_type,
      event_date,
      total_amount,
      deposit_amount,
      items,
      source,
    } = meta;

    const pickupDate = (() => {
      if (!event_date) return '';
      const d = new Date(event_date);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    })();

    try {
      const webhookRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grandoccasionrental.ie'}/api/booking-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name,
          customer_email,
          phone,
          reference_code: postcode?.toUpperCase(),
          items: items || booking_type,
          event_date,
          delivery_date: event_date,
          pickup_date: pickupDate,
          event_location: postcode,
          total_amount,
          deposit_amount,
          booking_type,
          source: source || 'Website Enquiry',
          auto_review: true,
        }),
      });

      if (!webhookRes.ok) {
        console.error('booking-webhook failed:', await webhookRes.text());
      }
    } catch (err) {
      console.error('Failed to trigger booking-webhook from Stripe webhook:', err);
    }
  }

  // Always return 200 quickly so Stripe doesn't retry
  return NextResponse.json({ received: true });
}
