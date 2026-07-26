import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
const CLIENT_URL = 'https://www.grandoccasionrental.ie';

export async function POST(req: NextRequest) {
  try {
    const { amount, customerName, customerEmail, bookingType, eventDate, phone, postcode, items, source, totalAmount } = await req.json();

    // amount = actual charge (deposit or full); totalAmount = full booking value
    const chargeAmount = parseFloat(parseFloat(amount).toFixed(2));
    const fullTotal = parseFloat(parseFloat(totalAmount || amount).toFixed(2));
    const depositAmount = parseFloat((fullTotal * 0.3).toFixed(2));
    const isFullPayment = Math.abs(chargeAmount - fullTotal) < 0.01;

    const successParams = new URLSearchParams({
      name: customerName || '',
      email: customerEmail || '',
      phone: phone || '',
      postcode: postcode || '',
      booking: bookingType || '',
      date: eventDate || '',
      total: String(fullTotal),
      deposit: String(isFullPayment ? fullTotal : depositAmount),
      full_payment: isFullPayment ? '1' : '0',
      items: (items || '').substring(0, 300),
      source: source || '',
    });
    const success_url = `${CLIENT_URL}/enquiry/success?session_id={CHECKOUT_SESSION_ID}&${successParams.toString()}`;

    const body = {
      customer_name: customerName,
      customer_email: customerEmail || undefined,
      total_price: chargeAmount,
      shipping: false,
      transaction_date: eventDate || new Date().toISOString().split('T')[0],
      return_date: eventDate || new Date().toISOString().split('T')[0],
      distance: 0,
      address: { line1: '', city: '', state: '', country: 'IE' },
      details: `Enquiry deposit — ${bookingType || 'Event Hire'}`,
      transaction_items: [],
      success_url,
      // Booking metadata stored on Stripe session — used by webhook to send confirmation
      metadata: {
        customer_name: customerName || '',
        customer_email: customerEmail || '',
        phone: phone || '',
        postcode: postcode || '',
        booking_type: bookingType || '',
        event_date: eventDate || '',
        total_amount: String(fullTotal),
        deposit_amount: String(isFullPayment ? fullTotal : depositAmount),
        full_payment: isFullPayment ? 'true' : 'false',
        items: (items || '').substring(0, 200),
        source: source || 'Website Enquiry',
      },
    };

    const res = await fetch(`${STRAPI_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data?.stripeSession?.id) {
      console.error('Strapi transaction error:', JSON.stringify(data));
      return NextResponse.json({ error: data?.error?.message || 'Failed to create payment session' }, { status: 500 });
    }

    return NextResponse.json({ sessionId: data.stripeSession.id, checkoutUrl: data.stripeSession.url });
  } catch (err: any) {
    console.error('Enquiry deposit error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Failed to create payment session' }, { status: 500 });
  }
}
