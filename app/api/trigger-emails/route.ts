import { NextRequest, NextResponse } from 'next/server';

const NOTION_DATABASE_ID = '34b22911-78c3-4c8e-a860-de396a0d96a2';
const GOOGLE_REVIEW_URL = 'https://g.page/r/CWa1-VxQj7mIEBM/review';
const FACEBOOK_REVIEW_URL = 'https://www.facebook.com/p/Grand-Occasion-Rental-61552746878438/reviews';

function fmtDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

const emailHeader = (title: string) => `
  <tr>
    <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;">${title}</h1>
      <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">Grand Occasion Rentals — Ireland's trusted event hire</p>
    </td>
  </tr>`;

const emailFooter = `
  <tr>
    <td style="background:#fff8f0;padding:16px 32px;border:1px solid #f0e4d0;border-top:none;border-radius:0 0 10px 10px;">
      <p style="margin:0;font-size:13px;color:#888;">Questions? Reach us at <a href="mailto:info@grandoccasionrental.ie" style="color:#d96f00;">info@grandoccasionrental.ie</a> or WhatsApp <a href="tel:+353851563498" style="color:#d96f00;">085 156 3498</a>.</p>
      <p style="margin:12px 0 0;font-size:13px;font-weight:600;">Warm regards,<br/>Grand Occasion Rentals</p>
    </td>
  </tr>`;

const wrapEmail = (rows: string) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${rows}
      </table>
    </td></tr>
  </table>
</body></html>`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const notionKey = process.env.NOTION_API_KEY;
  if (!apiKey || !notionKey) {
    return NextResponse.json({ error: 'Missing API keys' }, { status: 500 });
  }

  const { email, date } = await req.json();
  if (!email || !date) {
    return NextResponse.json({ error: 'Missing email or date' }, { status: 400 });
  }

  // Look up booking in Notion
  const searchRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${notionKey}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Email Address', rich_text: { equals: email } },
          { property: 'Rental Dates', date: { equals: date } },
        ],
      },
    }),
  });
  const searchData = await searchRes.json();
  const page = searchData.results?.[0];
  if (!page) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const props = page.properties;
  const customerName = props['Customer Name']?.title?.[0]?.plain_text || 'there';
  const customerEmail = props['Email Address']?.rich_text?.[0]?.plain_text || email;
  const totalAmount = props['Total Price (€)']?.number || 0;
  const depositAmount = props['Deposit Amount']?.number || 0;
  const balance = (totalAmount - depositAmount).toFixed(2);
  const pageId = page.id;

  const now = new Date();
  const eventDate = new Date(`${date}T10:00:00`);
  const daysUntilEvent = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceEvent = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));

  const sent: string[] = [];
  const scheduled: string[] = [];

  const sendEmail = async (payload: Record<string, unknown>) => {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return r.json();
  };

  // ── Upsell email (7 days before) ──
  if (daysUntilEvent > 1) {
    const scheduledAt = daysUntilEvent > 7
      ? new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      : null; // send now if within 7 days but still before event

    const html = wrapEmail(`
      ${emailHeader('Your event is coming up!')}
      <tr>
        <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
          <p style="margin:0;font-size:16px;">Hi <strong>${customerName}</strong>,</p>
          <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
            Your event on <strong>${fmtDate(date)}</strong> is coming up soon — how exciting! We hope everything is coming together beautifully.
          </p>
          <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
            Is there anything else you'd like to add to your order? We have a wide range available — from extra chairs and tables to decorations, soft play packages, and more.
          </p>
          <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
            Just WhatsApp or call us on <a href="tel:+353851563498" style="color:#d96f00;font-weight:600;">085 156 3498</a> and we'll sort it out for you!
          </p>
          <div style="margin-top:20px;">
            <a href="https://www.grandoccasionrental.ie" style="display:inline-block;background:#d96f00;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Browse Our Full Range</a>
          </div>
        </td>
      </tr>
      ${emailFooter}
    `);

    const result = await sendEmail({
      from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
      to: [customerEmail],
      subject: `Your event is coming up — anything to add?`,
      html,
      ...(scheduledAt ? { scheduledAt } : {}),
    });
    if (result.id) {
      scheduledAt ? scheduled.push('Upsell email') : sent.push('Upsell email');
    }
  }

  // ── 3-day reminder (3 days before) ──
  if (daysUntilEvent > 1 && daysUntilEvent <= 4) {
    const balancePayUrl = `https://www.grandoccasionrental.ie/api/pay-balance?name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(customerEmail)}&amount=${balance}&date=${date}`;
    const html = wrapEmail(`
      ${emailHeader(`Your event on ${fmtDate(date)} is almost here!`)}
      <tr>
        <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
          <p style="margin:0;font-size:16px;">Hi <strong>${customerName}</strong>,</p>
          <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
            Just a friendly reminder that your booking with us is confirmed for <strong>${fmtDate(date)}</strong>. We're looking forward to helping make it a great day!
          </p>
          <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
            We'll be in touch <strong>the day before your event</strong> to confirm your exact delivery time.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#fff8f0;padding:20px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;border-top:1px solid #f0e4d0;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#d96f00;">Remaining Balance</p>
          <p style="margin:0 0 4px;font-size:24px;font-weight:800;color:#1a1a1a;">€${balance}</p>
          <p style="margin:0 0 16px;font-size:13px;color:#888;">Due on delivery — cash or card accepted. You can also pay securely online:</p>
          <a href="${balancePayUrl}" style="display:inline-block;background:#d96f00;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Pay Balance Online →</a>
          <p style="margin:12px 0 0;font-size:12px;color:#aaa;">If you have already paid your balance, please disregard this — there is no cause for alarm.</p>
        </td>
      </tr>
      ${emailFooter}
    `);

    const threeDaysBefore = new Date(eventDate.getTime() - 3 * 24 * 60 * 60 * 1000);
    const useScheduled = threeDaysBefore > new Date(now.getTime() + 60 * 60 * 1000);

    const result = await sendEmail({
      from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
      to: [customerEmail],
      subject: `Your Grand Occasion event on ${date} is almost here!`,
      html,
      ...(useScheduled ? { scheduledAt: threeDaysBefore.toISOString() } : {}),
    });
    if (result.id) {
      useScheduled ? scheduled.push('3-day reminder') : sent.push('3-day reminder');
    }
  }

  // ── Review email (after event) ──
  if (daysSinceEvent >= 0) {
    const html = wrapEmail(`
      ${emailHeader("We'd love your feedback!")}
      <tr>
        <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
          <p style="margin:0;font-size:16px;">Hi <strong>${customerName}</strong>,</p>
          <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
            We hope you're still enjoying the memories from your recent event on <strong>${fmtDate(date)}</strong>! Thank you so much for choosing Grand Occasion Rentals.
          </p>
          <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
            If you have a moment, we'd really appreciate a quick review — it only takes 2 minutes and means the world to a small family business like ours.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td style="padding-right:12px;">
                <a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background:#d96f00;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">⭐ Review on Google</a>
              </td>
              <td>
                <a href="${FACEBOOK_REVIEW_URL}" style="display:inline-block;background:#1877f2;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">👍 Review on Facebook</a>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:13px;color:#aaa;">(If you've already left us a review — thank you so much! You can ignore this message.)</p>
        </td>
      </tr>
      ${emailFooter}
    `);

    const result = await sendEmail({
      from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
      to: [customerEmail],
      subject: `A gentle reminder — we'd love your feedback! — Grand Occasion Rentals`,
      html,
    });
    if (result.id) sent.push('Review email');
  }

  // Save any newly scheduled email IDs to Notion
  if (scheduled.length > 0 || sent.length > 0) {
    await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${notionKey}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
      body: JSON.stringify({
        properties: {
          'Scheduled Email IDs': {
            rich_text: [{ text: { content: `Manually triggered: ${[...sent, ...scheduled].join(', ')}` } }],
          },
        },
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ sent, scheduled });
}
