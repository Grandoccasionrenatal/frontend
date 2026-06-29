import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CdNyLqiuS_PVEAE/review';
const FACEBOOK_REVIEW_URL = 'https://www.facebook.com/p/Grand-Occasion-Rental-61552746878438/reviews';

function buildReviewEmail(data: {
  customer_name: string;
  event_description: string;
  platform: string;
  custom_message?: string;
  isReminder?: boolean;
}): string {
  const { customer_name, event_description, platform, custom_message, isReminder } = data;

  const showGoogle = platform === 'google' || platform === 'both';
  const showFacebook = platform === 'facebook' || platform === 'both';

  const reviewButtons = `
    <table cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        ${showGoogle ? `
        <td style="padding-right:12px;">
          <a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background:#d96f00;color:#ffffff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            ⭐ Review on Google
          </a>
        </td>` : ''}
        ${showFacebook ? `
        <td>
          <a href="${FACEBOOK_REVIEW_URL}" style="display:inline-block;background:#1877f2;color:#ffffff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            👍 Review on Facebook
          </a>
        </td>` : ''}
      </tr>
    </table>`;

  const subject_line = isReminder
    ? `Just a gentle nudge — we'd love your feedback!`
    : `How did we do? We'd love your review!`;

  const intro = isReminder
    ? `We hope you're still enjoying everything from your <strong>${event_description}</strong>! We sent you a message a week ago asking for your thoughts — if you haven't had a chance yet, we'd still really appreciate it.`
    : `Thank you so much for choosing us for your <strong>${event_description}</strong>! We truly hope everything went smoothly and that you and your guests had a wonderful time.`;

  const cta = isReminder
    ? `If you have just a couple of minutes, leaving us a review would mean the world to a small business like ours.`
    : `If you enjoyed our service, we'd be so grateful if you could spare 2 minutes to leave us a review. It helps other families find us and keeps us going!`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:-0.5px;">${subject_line}</h1>
            <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">Grand Occasion Rentals — Ireland's trusted event hire</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <p style="margin:0;font-size:16px;">Hi <strong>${customer_name}</strong>,</p>
            <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">${intro}</p>
            ${custom_message ? `<p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;font-style:italic;">${custom_message}</p>` : ''}
            <p style="margin:16px 0 8px;font-size:14px;color:#444;line-height:1.7;">${cta}</p>
            ${reviewButtons}
          </td>
        </tr>

        <tr>
          <td style="background:#fff8f0;padding:20px 32px;border:1px solid #f0e4d0;border-top:none;border-radius:0 0 10px 10px;">
            <p style="margin:0;font-size:14px;color:#444;line-height:1.6;">
              ${isReminder ? `(If you've already left us a review — thank you so much! You can ignore this message.)<br/><br/>` : ''}
              If you have any questions or feedback to share privately, feel free to reach out at
              <a href="mailto:info@grandoccasionrental.ie" style="color:#d96f00;text-decoration:none;">info@grandoccasionrental.ie</a>
              or call/WhatsApp <a href="tel:+353851563498" style="color:#d96f00;text-decoration:none;">085 156 3498</a>.
            </p>
            <p style="margin:16px 0 0;font-size:14px;font-weight:600;">Thank you,<br/>Grand Occasion Rentals</p>
            <hr style="border:none;border-top:1px solid #f0e4d0;margin:20px 0 16px;"/>
            <p style="margin:8px 0 0;font-size:12px;color:#aaa;text-align:center;">
              © Grand Occasion Rentals · <a href="https://www.grandoccasionrental.ie" style="color:#aaa;">grandoccasionrental.ie</a>
            </p>
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
  const { customer_name, customer_email, event_description, platform, custom_message, send_reminder } = data;

  if (!customer_email || !customer_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
  }

  const emailPayload = (isReminder: boolean, scheduledAt?: string) => ({
    from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
    to: [customer_email],
    subject: isReminder
      ? `A gentle reminder — we'd love your feedback! — Grand Occasion Rentals`
      : `How did we do? We'd love your review! — Grand Occasion Rentals`,
    html: buildReviewEmail({ customer_name, event_description, platform, custom_message, isReminder }),
    ...(scheduledAt ? { scheduledAt } : {}),
  });

  // Send the immediate review request
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(emailPayload(false)),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  // Schedule 7-day reminder if requested
  if (send_reminder) {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 7);

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload(true, reminderDate.toISOString())),
    });
  }

  return NextResponse.json({ ok: true });
}
