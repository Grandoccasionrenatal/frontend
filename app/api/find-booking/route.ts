import { NextRequest, NextResponse } from 'next/server';

const NOTION_DATABASE_ID = '34b22911-78c3-4c8e-a860-de396a0d96a2';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const eventDate = req.nextUrl.searchParams.get('event_date');

  if (!email || !eventDate) {
    return NextResponse.json({ error: 'Email and event date are required' }, { status: 400 });
  }

  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) {
    return NextResponse.json({ error: 'Notion not configured' }, { status: 500 });
  }

  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Email Address', rich_text: { equals: email } },
          { property: 'Rental Dates', date: { equals: eventDate } },
        ],
      },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to search bookings' }, { status: 500 });
  }

  const data = await res.json();
  const page = data.results?.[0];

  if (!page) {
    return NextResponse.json({ error: 'No booking found for that email and event date.' }, { status: 404 });
  }

  const props = page.properties;
  return NextResponse.json({
    notion_page_id: page.id,
    customer_name: props['Customer Name']?.title?.[0]?.text?.content || '',
    customer_email: props['Email Address']?.rich_text?.[0]?.text?.content || '',
    phone: props['Phone']?.phone_number || '',
    event_date: props['Rental Dates']?.date?.start || '',
    items: props['Items Booked']?.rich_text?.[0]?.text?.content || '',
    total_amount: props['Total Amount']?.number || 0,
    deposit_amount: props['Deposit Amount']?.number || 0,
    booking_type: props['Booking Type']?.select?.name || '',
    reference_code: props['Reference Code']?.rich_text?.[0]?.text?.content || '',
  });
}
