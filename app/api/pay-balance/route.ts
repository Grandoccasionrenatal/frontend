import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
const SITE_URL = 'https://www.grandoccasionrental.ie';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const eventDate = searchParams.get('date') || '';

  if (!email || !amount || amount <= 0) {
    return NextResponse.redirect(`${SITE_URL}/?error=invalid-link`);
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          customer_name: name,
          customer_email: email,
          total_price: amount,
          transaction_date: eventDate || new Date().toISOString().split('T')[0],
          metadata: {
            customer_name: name,
            customer_email: email,
            booking_type: 'Balance Payment',
            event_date: eventDate,
            total_amount: String(amount),
            deposit_amount: '0',
            source: 'Balance Payment Link',
          },
          success_url: `${SITE_URL}/payment?success=true`,
          cancel_url: `${SITE_URL}/payment?success=false`,
        },
      }),
    });

    const data = await res.json();
    const checkoutUrl = data?.stripeSession?.url || data?.data?.stripeSession?.url;

    if (!checkoutUrl) {
      console.error('No checkout URL returned:', JSON.stringify(data));
      return NextResponse.redirect(`${SITE_URL}/?error=payment-unavailable`);
    }

    return NextResponse.redirect(checkoutUrl);
  } catch (err) {
    console.error('pay-balance error:', err);
    return NextResponse.redirect(`${SITE_URL}/?error=payment-unavailable`);
  }
}
