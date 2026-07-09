import { NextRequest, NextResponse } from 'next/server';

const NOTION_DATABASE_ID = '34b22911-78c3-4c8e-a860-de396a0d96a2';

// GET ?email=&date= — returns scheduled email IDs stored on the Notion booking
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const date = req.nextUrl.searchParams.get('date');

  if (!email || !date) {
    return NextResponse.json({ error: 'email and date required' }, { status: 400 });
  }

  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return NextResponse.json({ error: 'Notion not configured' }, { status: 500 });

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
          { property: 'Rental Dates', date: { equals: date } },
        ],
      },
    }),
  });

  const data = await res.json();
  const page = data.results?.[0];
  if (!page) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const raw = page.properties?.['Scheduled Email IDs']?.rich_text?.[0]?.text?.content || '[]';
  let scheduledEmails: { id: string; subject: string }[] = [];
  try { scheduledEmails = JSON.parse(raw); } catch { scheduledEmails = []; }

  return NextResponse.json({
    pageId: page.id,
    customerName: page.properties?.['Customer Name']?.title?.[0]?.text?.content || '',
    scheduledEmails,
  });
}

// POST { emailId, pageId } — cancels the email in Resend and removes it from Notion
export async function POST(req: NextRequest) {
  const { emailId, pageId } = await req.json();
  if (!emailId || !pageId) {
    return NextResponse.json({ error: 'emailId and pageId required' }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });

  // Cancel the email in Resend
  const cancelRes = await fetch(`https://api.resend.com/emails/${emailId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}` },
  });

  if (!cancelRes.ok) {
    const err = await cancelRes.text();
    // Resend returns error if email already sent — treat as success (nothing to cancel)
    console.warn('Resend cancel response:', err);
  }

  // Remove this ID from the Notion page
  const notionKey = process.env.NOTION_API_KEY;
  if (notionKey) {
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: { Authorization: `Bearer ${notionKey}`, 'Notion-Version': '2022-06-28' },
    });
    const pageData = await pageRes.json();
    const raw = pageData.properties?.['Scheduled Email IDs']?.rich_text?.[0]?.text?.content || '[]';
    let emails: { id: string; subject: string }[] = [];
    try { emails = JSON.parse(raw); } catch { emails = []; }

    const updated = emails.filter(e => e.id !== emailId);
    await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${notionKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        properties: {
          'Scheduled Email IDs': {
            rich_text: updated.length > 0
              ? [{ text: { content: JSON.stringify(updated) } }]
              : [],
          },
        },
      }),
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
