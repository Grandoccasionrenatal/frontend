import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const notionKey = process.env.NOTION_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!notionKey || !resendKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const {
    notion_page_id,
    customer_name,
    customer_email,
    phone,
    event_date,
    booking_type,
    reference_code,
    original_items,
    updated_items,
    original_total,
    new_total,
    deposit_amount,
  } = await req.json();

  if (!notion_page_id || !new_total) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newBalance = (parseFloat(new_total) - parseFloat(deposit_amount)).toFixed(2);

  // 1. Update Notion
  const notionRes = await fetch(`https://api.notion.com/v1/pages/${notion_page_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${notionKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      properties: {
        'Items Booked': { rich_text: [{ text: { content: updated_items } }] },
        'Total Amount': { number: parseFloat(new_total) },
      },
    }),
  });

  if (!notionRes.ok) {
    console.error('Notion update failed:', await notionRes.text());
    return NextResponse.json({ error: 'Failed to update Notion' }, { status: 500 });
  }

  // 2. Send updated invoice email to customer
  function fmtDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;">Booking Updated</h1>
            <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">Grand Occasion Rentals</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <p style="margin:0;font-size:15px;">Hi <strong>${customer_name}</strong>,</p>
            <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
              Your booking has been updated as requested. Here's a summary of your revised order:
            </p>

            <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 12px;color:#888;width:160px;">Event Date</td>
                <td style="padding:10px 12px;font-weight:600;">${fmtDate(event_date)}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;color:#888;">Booking Type</td>
                <td style="padding:10px 12px;font-weight:600;">${booking_type}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 12px;color:#888;">Items</td>
                <td style="padding:10px 12px;">${updated_items.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
              <tr style="border-bottom:1px solid #f0e8df;">
                <td style="padding:10px 0;color:#666;">New Total</td>
                <td style="padding:10px 0;text-align:right;font-weight:600;">€${parseFloat(new_total).toFixed(2)}</td>
              </tr>
              <tr style="border-bottom:1px solid #f0e8df;">
                <td style="padding:10px 0;color:#666;">Deposit Paid</td>
                <td style="padding:10px 0;text-align:right;color:#16a34a;font-weight:600;">− €${parseFloat(deposit_amount).toFixed(2)}</td>
              </tr>
              <tr style="background:#fff8f0;">
                <td style="padding:12px;font-weight:700;font-size:15px;">Balance Due on Delivery</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:15px;color:#d96f00;">€${newBalance}</td>
              </tr>
            </table>

            <p style="font-size:13px;color:#666;">Any questions? WhatsApp or call us on
              <a href="tel:+353851563498" style="color:#d96f00;font-weight:600;">085 156 3498</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff8f0;padding:16px 32px;border:1px solid #f0e4d0;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">© Grand Occasion Rentals ·
              <a href="https://www.grandoccasionrental.ie" style="color:#aaa;">grandoccasionrental.ie</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
      to: [customer_email],
      bcc: ['info@grandoccasionrental.ie'],
      subject: `Your booking has been updated — Grand Occasion Rentals`,
      html,
    }),
  });

  return NextResponse.json({ ok: true, new_balance: newBalance });
}
