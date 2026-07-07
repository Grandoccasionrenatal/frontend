import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
const SITE_URL = 'https://www.grandoccasionrental.ie';

async function verifyStripeSignature(body: string, signature: string): Promise<boolean> {
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

  if (computedSig.length !== expectedSig.length) return false;
  let diff = 0;
  for (let i = 0; i < computedSig.length; i++) {
    diff |= computedSig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  return diff === 0;
}

// Look up transaction in Strapi by Stripe session token
async function getTransactionFromStrapi(sessionId: string) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/transactions?filters[token][$eq]=${sessionId}&populate=transaction_items.product`,
      { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0] || null;
  } catch {
    return null;
  }
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
    const sessionId = session.id;
    const customerEmail = session.customer_details?.email || session.customer_email || '';
    const customerName = session.customer_details?.name || '';

    let webhookPayload: Record<string, any> | null = null;

    // ── Enquiry flow: metadata was set when session was created ──
    if (meta.customer_name || meta.booking_type) {
      const { customer_name, customer_email, phone, postcode, booking_type,
              event_date, total_amount, deposit_amount, items, source } = meta;

      const pickupDate = (() => {
        if (!event_date) return '';
        const d = new Date(event_date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      })();

      webhookPayload = {
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
      };

    // ── Main checkout flow: look up transaction in Strapi by session ID ──
    } else {
      const transaction = await getTransactionFromStrapi(sessionId);

      if (transaction) {
        const attrs = transaction.attributes;
        const items = (attrs.transaction_items?.data || [])
          .map((ti: any) => {
            const name = ti.attributes?.product?.data?.attributes?.name || 'Item';
            const units = ti.attributes?.units || 1;
            return `${name} x${units}`;
          })
          .join(', ');

        const totalPrice = attrs.total_price || 0;
        const depositAmount = parseFloat((totalPrice * 0.3).toFixed(2));
        const eventDate = attrs.transaction_date?.split('T')[0] || '';
        const pickupDate = attrs.return_date?.split('T')[0] || '';

        webhookPayload = {
          customer_name: attrs.customer_name || customerName,
          customer_email: customerEmail,
          reference_code: sessionId.slice(-8).toUpperCase(),
          items,
          event_date: eventDate,
          delivery_date: eventDate,
          pickup_date: pickupDate,
          event_location: '',
          total_amount: String(totalPrice),
          deposit_amount: String(depositAmount),
          booking_type: 'Website Checkout',
          source: 'Website',
          auto_review: true,
        };
      } else {
        // No transaction found — notify admin so no booking falls through the cracks
        console.warn(`Stripe webhook: no Strapi transaction found for session ${sessionId}. Customer: ${customerEmail}`);

        // Still send an admin alert
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && customerEmail) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
              to: ['info@grandoccasionrental.ie'],
              subject: `⚠️ Payment received but booking not found — ${customerEmail}`,
              html: `<p>A payment was received from <strong>${customerName || customerEmail}</strong> (${customerEmail}) for session <code>${sessionId}</code> but no matching transaction was found in Strapi.</p><p>Please follow up manually.</p>`,
            }),
          }).catch(console.error);
        }
      }
    }

    if (webhookPayload) {
      try {
        const webhookRes = await fetch(`${SITE_URL}/api/booking-webhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
        if (!webhookRes.ok) {
          console.error('booking-webhook failed:', await webhookRes.text());
        }
      } catch (err) {
        console.error('Failed to trigger booking-webhook:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
