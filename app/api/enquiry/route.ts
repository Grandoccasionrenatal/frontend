import { NextRequest, NextResponse } from 'next/server';

const NOTION_DATABASE_ID = '34b22911-78c3-4c8e-a860-de396a0d96a2';

async function syncEnquiryToNotion(data: Record<string, string>) {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return;

  const details = [
    data.event_time ? `Time: ${data.event_time}` : '',
    data.floor_type ? `Floor: ${data.floor_type}` : '',
    data.accessibility ? `Access: ${data.accessibility}` : '',
    data.items ? `Details: ${data.items}` : '',
    data.notes ? `Notes: ${data.notes}` : '',
  ].filter(Boolean).join('\n');

  const props: Record<string, unknown> = {
    'Customer Name': { title: [{ text: { content: data.customer_name || '' } }] },
    'Event Location': { rich_text: [{ text: { content: data.postcode || '' } }] },
    'Items Booked': { rich_text: [{ text: { content: details } }] },
    'Status': { status: { name: 'Enquiry' } },
  };

  if (data.customer_email) props['Email Address'] = { rich_text: [{ text: { content: data.customer_email } }] };
  if (data.phone) props['Phone'] = { phone_number: data.phone };
  if (data.event_date) props['Rental Dates'] = { date: { start: data.event_date } };
  if (data.booking_type) props['Booking Type'] = { select: { name: data.booking_type } };
  if (data.source) props['Source'] = { select: { name: data.source } };

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ parent: { database_id: NOTION_DATABASE_ID }, properties: props }),
  });

  if (!res.ok) {
    console.error('Notion enquiry sync error:', await res.text());
  }
}

function buildNotificationEmail(data: Record<string, string>): string {
  const rows = [
    ['Name', data.customer_name],
    ['Phone / WhatsApp', data.phone],
    ['Email', data.customer_email],
    ['Postcode', data.postcode],
    ['Event Date', data.event_date],
    ['Event Time', data.event_time],
    ['Booking Type', data.booking_type],
    ['Floor Type', data.floor_type],
    ['Accessibility', data.accessibility],
    ['Event Details', data.items],
    ['How they heard', data.source],
    ['Additional Notes', data.notes],
  ].filter(([, v]) => v).map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#888;width:160px;border-bottom:1px solid #f2ede8;">${label}</td>
      <td style="padding:8px 12px;font-size:14px;font-weight:600;border-bottom:1px solid #f2ede8;">${value}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#d96f00;padding:24px 32px;border-radius:10px 10px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:20px;">New Booking Enquiry</h1>
            <p style="margin:4px 0 0;color:#ffd9b0;font-size:13px;">Via grandoccasionrental.ie/enquiry</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:24px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          </td>
        </tr>
        <tr>
          <td style="background:#fff8f0;padding:16px 32px;border:1px solid #f0e4d0;border-top:none;border-radius:0 0 10px 10px;">
            <p style="margin:0;font-size:13px;color:#888;">Reply to this email or WhatsApp <strong>${data.phone}</strong> to follow up.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAutoReplyEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;">We've got your enquiry!</h1>
            <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">Grand Occasion Rentals — Ireland's trusted event hire</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <p style="margin:0;font-size:16px;">Hi <strong>${name}</strong>,</p>
            <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
              Thank you for reaching out to Grand Occasion Rentals! We've received your enquiry and will get back to you <strong>within 24 hours</strong> to confirm availability and let you know the deposit amount to secure your booking.
            </p>
            <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
              In the meantime, if you need to reach us urgently, feel free to WhatsApp or call us on
              <a href="tel:+353851563498" style="color:#d96f00;text-decoration:none;font-weight:600;">085 156 3498</a>.
            </p>
            <p style="margin:16px 0 0;font-size:14px;color:#444;">We look forward to helping make your event a memorable one!</p>
            <p style="margin:12px 0 0;font-size:14px;font-weight:600;">Warm regards,<br/>Grand Occasion Rentals</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff8f0;padding:16px 32px;border:1px solid #f0e4d0;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">© Grand Occasion Rentals · <a href="https://www.grandoccasionrental.ie" style="color:#aaa;">grandoccasionrental.ie</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    await syncEnquiryToNotion(data);
  } catch (err) {
    console.error('Notion enquiry sync failed:', err);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    // Notify Grand Occasion Rentals
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
          to: ['info@grandoccasionrental.ie'],
          reply_to: data.customer_email || undefined,
          subject: `New enquiry from ${data.customer_name} — ${data.booking_type || 'General'}`,
          html: buildNotificationEmail(data),
        }),
      });
    } catch (err) {
      console.error('Notification email failed:', err);
    }

    // Auto-reply to customer
    if (data.customer_email) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
            to: [data.customer_email],
            subject: `We've received your enquiry — Grand Occasion Rentals`,
            html: buildAutoReplyEmail(data.customer_name),
          }),
        });
      } catch (err) {
        console.error('Auto-reply email failed:', err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
