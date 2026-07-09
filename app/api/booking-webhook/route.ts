import { NextRequest, NextResponse } from 'next/server';

function buildConfirmationEmail(data: Record<string, string>): string {
  const {
    customer_name,
    reference_code,
    items,
    event_date,
    delivery_date,
    pickup_date,
    event_location,
    total_amount,
    deposit_amount,
  } = data;

  const balance = (parseFloat(total_amount || '0') - parseFloat(deposit_amount || '0')).toFixed(2);

  function fmtDate(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  const itemLines = (items || '')
    .split('\n').map(l => l.trim()).filter(Boolean)
    .flatMap(l => l.split(',').map(x => x.trim()).filter(Boolean))
    .map(l => `<li style="margin-bottom:4px;">${l}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:-0.5px;">Your Booking is Confirmed!</h1>
            <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">Grand Occasion Rentals — Ireland's trusted event hire</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:28px 32px 16px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <p style="margin:0;font-size:16px;">Hello <strong>${customer_name}</strong>,</p>
            <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.6;">
              We're delighted to confirm your rental booking with us! Your deposit of <strong>€${parseFloat(deposit_amount || '0').toFixed(2)}</strong> has been received and your booking is secured. Please find your invoice attached to this email.
            </p>
          </td>
        </tr>

        ${reference_code ? `
        <tr>
          <td style="background:#fff8f0;padding:12px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;border-top:1px solid #f0e4d0;">
            <p style="margin:0;font-size:13px;color:#888;">Booking Reference</p>
            <p style="margin:2px 0 0;font-size:20px;font-weight:700;color:#d96f00;letter-spacing:1px;">${reference_code}</p>
          </td>
        </tr>` : ''}

        <tr>
          <td style="background:#ffffff;padding:20px 32px 8px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#d96f00;">Items Rented</p>
            <ul style="margin:0;padding-left:20px;font-size:14px;color:#333;line-height:1.8;">${itemLines}</ul>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:20px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#d96f00;">Event Details</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f2ede8;font-size:13px;color:#888;width:160px;">Event Date</td>
                <td style="padding:8px 0;border-bottom:1px solid #f2ede8;font-size:14px;font-weight:600;">${fmtDate(event_date)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0 8px;border-bottom:1px solid #f2ede8;font-size:13px;color:#888;vertical-align:top;">Delivery Date</td>
                <td style="padding:10px 0 8px;border-bottom:1px solid #f2ede8;">
                  <span style="font-size:14px;font-weight:600;">${fmtDate(delivery_date)}</span><br/>
                  <span style="font-size:12px;color:#d96f00;font-style:italic;">Tentatively — exact time of delivery will be communicated closer to the date</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f2ede8;font-size:13px;color:#888;">Pick-up Date</td>
                <td style="padding:8px 0;border-bottom:1px solid #f2ede8;font-size:14px;font-weight:600;">${fmtDate(pickup_date)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#888;">Delivery Address</td>
                <td style="padding:8px 0;font-size:14px;font-weight:600;">${event_location}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#fff8f0;padding:20px 32px;border:1px solid #f0e4d0;border-top:none;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#d96f00;">Payment Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:5px 0;color:#555;">Total Cost</td>
                <td style="padding:5px 0;text-align:right;font-weight:600;">€${parseFloat(total_amount || '0').toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#555;">Deposit Paid</td>
                <td style="padding:5px 0;text-align:right;color:#2a9d4e;font-weight:600;">− €${parseFloat(deposit_amount || '0').toFixed(2)}</td>
              </tr>
              <tr><td colspan="2" style="border-top:2px solid #e8d8c0;padding-top:8px;"></td></tr>
              <tr>
                <td style="padding:4px 0;font-weight:700;font-size:15px;">Balance Due on Delivery</td>
                <td style="padding:4px 0;text-align:right;font-weight:700;font-size:15px;color:#d96f00;">€${balance}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:20px 32px 28px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;border-bottom:1px solid #e8e0d8;border-radius:0 0 10px 10px;">
            <p style="margin:0;font-size:14px;color:#444;line-height:1.6;">
              Your invoice is attached to this email. If you have any questions, reach out at
              <a href="mailto:info@grandoccasionrental.ie" style="color:#d96f00;text-decoration:none;">info@grandoccasionrental.ie</a>
              or call/WhatsApp <a href="tel:+353851563498" style="color:#d96f00;text-decoration:none;">085 156 3498</a>.
            </p>
            <p style="margin:16px 0 0;font-size:14px;color:#444;">We look forward to helping make your event a memorable one!</p>
            <p style="margin:12px 0 0;font-size:14px;font-weight:600;">Best regards,<br/>Grand Occasion Rentals</p>
            <hr style="border:none;border-top:1px solid #f0e4d0;margin:20px 0 16px;"/>
            <p style="margin:0;font-size:12px;text-align:center;">
              <a href="https://www.grandoccasionrental.ie/cancellation-policy" style="color:#d96f00;font-weight:600;text-decoration:none;">Cancellation Policy</a> &nbsp;|&nbsp;
              <a href="https://www.grandoccasionrental.ie/delivery-policy" style="color:#d96f00;font-weight:600;text-decoration:none;">Delivery Policy</a> &nbsp;|&nbsp;
              <a href="https://www.grandoccasionrental.ie/terms-of-service" style="color:#d96f00;font-weight:600;text-decoration:none;">Terms of Service</a>
            </p>
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

const NOTION_DATABASE_ID = '34b22911-78c3-4c8e-a860-de396a0d96a2';

// Check if a booking already exists for this email + event date to prevent duplicates
async function bookingAlreadyExists(notionKey: string, email: string, eventDate: string): Promise<boolean> {
  if (!email || !eventDate) return false;
  try {
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
    const data = await res.json();
    return (data.results?.length || 0) > 0;
  } catch {
    return false;
  }
}

async function syncToNotion(data: Record<string, string>): Promise<'duplicate' | string | undefined> {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return;

  // Idempotency: skip if booking already exists for this email + event date
  if (data.customer_email && data.event_date) {
    const exists = await bookingAlreadyExists(notionKey, data.customer_email, data.event_date);
    if (exists) {
      console.log(`Duplicate booking skipped for ${data.customer_email} on ${data.event_date}`);
      return 'duplicate';
    }
  }

  const props: Record<string, unknown> = {
    'Customer Name': { title: [{ text: { content: data.customer_name || '' } }] },
    'Event Location': { rich_text: [{ text: { content: data.event_location || '' } }] },
    'Items Booked': { rich_text: [{ text: { content: data.items || '' } }] },
    'Source': { select: { name: data.source || 'Other' } },
    'Reference Code': { rich_text: [{ text: { content: data.reference_code || '' } }] },
  };

  if (data.customer_email) {
    props['Email Address'] = { rich_text: [{ text: { content: data.customer_email } }] };
  }
  if (data.phone) {
    props['Phone'] = { phone_number: data.phone };
  }
  if (data.event_date) {
    props['Rental Dates'] = {
      date: { start: data.event_date },
    };
  }
  if (data.total_amount) {
    props['Total Amount'] = { number: parseFloat(data.total_amount) };
  }
  if (data.deposit_amount) {
    props['Deposit Amount'] = { number: parseFloat(data.deposit_amount) };
    props['Deposit Paid'] = { checkbox: true };
  }
  if (data.booking_type) {
    props['Booking Type'] = { select: { name: data.booking_type } };
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: props,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion sync error:', err);
    return;
  }

  const page = await res.json();
  return page.id as string;
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Sync to Notion — returns page ID on success, 'duplicate' if already exists
  let notionPageId: string | undefined;
  try {
    const notionResult = await syncToNotion(data);
    if (notionResult === 'duplicate') {
      console.log('Duplicate webhook call detected — skipping email for', data.customer_email);
      return NextResponse.json({ ok: true, duplicate: true });
    }
    notionPageId = notionResult;
  } catch (err) {
    console.error('Notion sync failed:', err);
  }

  // Send styled confirmation email + PDF invoice via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && data.customer_email && !data.skip_email) {
    const today = new Date().toISOString().split('T')[0];
    const invoiceNum = data.reference_code
      ? `INV-${data.reference_code.toUpperCase()}`
      : `INV-${today.replace(/-/g, '')}`;

    // Dynamic import avoids webpack bundling @react-pdf/renderer at build time
    let attachments: { filename: string; content: string }[] = [];
    try {
      const [{ renderToBuffer }, { InvoicePDF }, React] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/lib/invoice'),
        import('react'),
      ]);
      const pdfBuffer = await renderToBuffer(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.createElement(InvoicePDF, { data, invoiceDate: today }) as any
      );
      attachments = [{ filename: `${invoiceNum}.pdf`, content: pdfBuffer.toString('base64') }];
    } catch (pdfErr) {
      console.error('PDF generation failed, sending email without attachment:', pdfErr);
    }

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
          to: [data.customer_email],
          bcc: ['info@grandoccasionrental.ie'],
          subject: `Your booking has been confirmed — Grand Occasion Rentals`,
          html: buildConfirmationEmail(data),
          ...(attachments.length > 0 ? { attachments } : {}),
        }),
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }
  }

  // Schedule the 4-email sequence around the event date
  if (apiKey && data.auto_review && data.customer_email && data.event_date && !data.skip_email) {
    try {
      const now = new Date();
      const eventDate = new Date(`${data.event_date}T10:00:00`);

      const sevenDaysBefore = new Date(eventDate);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

      const threeDaysBefore = new Date(eventDate);
      threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

      const oneDayAfter = new Date(eventDate);
      oneDayAfter.setDate(oneDayAfter.getDate() + 1);

      const eightDaysAfter = new Date(eventDate);
      eightDaysAfter.setDate(eightDaysAfter.getDate() + 8);

      const GOOGLE_REVIEW_URL = 'https://g.page/r/CWa1-VxQj7mIEBM/review';
      const FACEBOOK_REVIEW_URL = 'https://www.facebook.com/p/Grand-Occasion-Rental-61552746878438/reviews';

      const emailHeader = (title: string, subtitle: string) => `
        <tr>
          <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;">${title}</h1>
            <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">${subtitle}</p>
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

      const scheduledEmails: { id: string; subject: string }[] = [];

      // Minimum gap: don't schedule anything firing within the next 24 hours
      const minScheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const scheduleEmail = async (payload: Record<string, unknown>) => {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await r.json();
        if (json.id) scheduledEmails.push({ id: json.id, subject: payload.subject as string });
      };

      // Email 1 — 7 days before event: upsell
      if (sevenDaysBefore > minScheduleTime) {
        const upsellHtml = wrapEmail(`
          ${emailHeader('Your event is 1 week away! 🎉', 'Grand Occasion Rentals — Ireland\'s trusted event hire')}
          <tr>
            <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
              <p style="margin:0;font-size:16px;">Hi <strong>${data.customer_name}</strong>,</p>
              <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
                Your event is just <strong>one week away</strong> — how exciting! We hope everything is coming together beautifully.
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
        await scheduleEmail({
          from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
          to: [data.customer_email],
          subject: `Your event is 1 week away — anything to add? 🎉`,
          html: upsellHtml,
          scheduledAt: sevenDaysBefore.toISOString(),
        });
      }

      // Email 2 — 3 days before event: delivery notice + balance payment option
      if (threeDaysBefore > minScheduleTime) {
        const fmtEventDate = (() => {
          const [y, m, d] = data.event_date.split('-');
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
        })();
        const balance = (parseFloat(data.total_amount || '0') - parseFloat(data.deposit_amount || '0')).toFixed(2);
        const balancePayUrl = `https://www.grandoccasionrental.ie/api/pay-balance?name=${encodeURIComponent(data.customer_name)}&email=${encodeURIComponent(data.customer_email)}&amount=${balance}&date=${data.event_date}`;
        const deliveryHtml = wrapEmail(`
          ${emailHeader(`Your event on ${fmtEventDate} is almost here!`, 'Grand Occasion Rentals — Ireland\'s trusted event hire')}
          <tr>
            <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
              <p style="margin:0;font-size:16px;">Hi <strong>${data.customer_name}</strong>,</p>
              <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
                Just a friendly reminder that your booking with us is confirmed for <strong>${fmtEventDate}</strong>. We're looking forward to helping make it a great day!
              </p>
              <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
                We'll be in touch <strong>the day before your event</strong> to confirm your exact delivery time and let you know when we're on our way.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#fff8f0;padding:20px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;border-top:1px solid #f0e4d0;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#d96f00;">Remaining Balance</p>
              <p style="margin:0 0 4px;font-size:24px;font-weight:800;color:#1a1a1a;">€${balance}</p>
              <p style="margin:0 0 16px;font-size:13px;color:#888;">Due on delivery — cash or card accepted. You can also pay securely online before your event:</p>
              <a href="${balancePayUrl}" style="display:inline-block;background:#d96f00;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Pay Balance Online →</a>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">If you prefer to pay cash on delivery, no action needed — we'll collect it when we arrive. If you have already paid your balance, please disregard this — there is no cause for alarm and no further action is required.</p>
            </td>
          </tr>
          ${emailFooter}
        `);
        await scheduleEmail({
          from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
          to: [data.customer_email],
          subject: `Your Grand Occasion event on ${data.event_date} is almost here!`,
          html: deliveryHtml,
          scheduledAt: threeDaysBefore.toISOString(),
        });
      }

      // Email 3 — 8 days after event: gentle follow-up / review request
      if (eightDaysAfter > minScheduleTime) {
        const followUpHtml = wrapEmail(`
          ${emailHeader('Just a gentle nudge — we\'d love your feedback!', 'Grand Occasion Rentals — Ireland\'s trusted event hire')}
          <tr>
            <td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e0d8;border-right:1px solid #e8e0d8;">
              <p style="margin:0;font-size:16px;">Hi <strong>${data.customer_name}</strong>,</p>
              <p style="margin:12px 0 0;font-size:14px;color:#444;line-height:1.7;">
                We hope you're still enjoying the memories from your recent event! We reached out a week ago — if you haven't had a chance to leave a review yet, we'd still really appreciate it.
              </p>
              <p style="margin:16px 0 0;font-size:14px;color:#444;line-height:1.7;">
                It only takes 2 minutes and means the world to a small family business like ours.
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
        await scheduleEmail({
          from: 'Grand Occasion Rentals <info@grandoccasionrental.ie>',
          to: [data.customer_email],
          subject: `A gentle reminder — we'd love your feedback! — Grand Occasion Rentals`,
          html: followUpHtml,
          scheduledAt: eightDaysAfter.toISOString(),
        });
      }

      // Save scheduled email IDs to Notion so they can be cancelled if needed
      if (notionPageId && scheduledEmails.length > 0) {
        const notionKey = process.env.NOTION_API_KEY;
        if (notionKey) {
          await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${notionKey}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
              properties: {
                'Scheduled Email IDs': {
                  rich_text: [{ text: { content: JSON.stringify(scheduledEmails) } }],
                },
              },
            }),
          }).catch(err => console.error('Failed to save email IDs to Notion:', err));
        }
      }

    } catch (reviewErr) {
      console.error('Email sequence scheduling failed:', reviewErr);
    }
  }

  return NextResponse.json({ ok: true });
}
