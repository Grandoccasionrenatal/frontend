import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { amount, customerName, customerEmail, bookingType, eventDate } = await req.json();

    const depositAmount = parseFloat((amount * 0.3).toFixed(2));

    const body = {
      customer_name: customerName,
      customer_email: customerEmail || undefined,
      total_price: depositAmount,
      shipping: false,
      transaction_date: eventDate || new Date().toISOString().split('T')[0],
      return_date: eventDate || new Date().toISOString().split('T')[0],
      distance: 0,
      address: { line1: '', city: '', state: '', country: 'IE' },
      details: `Enquiry deposit — ${bookingType || 'Event Hire'}`,
      transaction_items: [],
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

    return NextResponse.json({ sessionId: data.stripeSession.id });
  } catch (err: any) {
    console.error('Enquiry deposit error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Failed to create payment session' }, { status: 500 });
  }
}
