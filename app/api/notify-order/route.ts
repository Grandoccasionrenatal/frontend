import { NextRequest, NextResponse } from 'next/server';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface NotifyOrderPayload {
  customer_name: string;
  customer_email: string;
  phone_number: string;
  address: string;
  details: string;
  items: OrderItem[];
  total: number;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  let body: NotifyOrderPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { customer_name, customer_email, phone_number, address, details, items, total } = body;

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8df;">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8df;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8df;text-align:right;">€${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#e97900;padding:20px 24px;border-radius:8px 8px 0 0;">
    <h1 style="color:white;margin:0;font-size:22px;">New Booking Enquiry</h1>
    <p style="color:#fff3e5;margin:4px 0 0;">Grand Occasion Rental</p>
  </div>
  <div style="background:#fff8f3;padding:24px;border:1px solid #f0e8df;border-top:none;border-radius:0 0 8px 8px;">

    <h2 style="font-size:16px;color:#e97900;margin-top:0;">Customer Details</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">Name</td><td style="padding:6px 0;font-weight:600;">${customer_name}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${customer_email}" style="color:#e97900;">${customer_email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;"><a href="tel:${phone_number}" style="color:#e97900;">${phone_number}</a></td></tr>
      <tr><td style="padding:6px 0;color:#666;">Address</td><td style="padding:6px 0;">${address}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Details</td><td style="padding:6px 0;">${details}</td></tr>
    </table>

    <h2 style="font-size:16px;color:#e97900;">Items Ordered</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
      <thead>
        <tr style="background:#e97900;color:white;">
          <th style="padding:8px 12px;text-align:left;">Item</th>
          <th style="padding:8px 12px;text-align:center;">Qty</th>
          <th style="padding:8px 12px;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr style="background:#fff3e5;">
          <td colspan="2" style="padding:10px 12px;font-weight:700;">Total</td>
          <td style="padding:10px 12px;font-weight:700;text-align:right;">€${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <p style="font-size:13px;color:#888;margin-bottom:0;">
      Reply directly to this email to contact the customer, or call <strong>${phone_number}</strong>.
      This enquiry was submitted at ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })} Irish time.
    </p>
  </div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Grand Occasion Rental <bookings@grandoccasionrental.ie>',
        to: ['info@grandoccasionrental.ie'],
        reply_to: customer_email,
        subject: `New Booking Enquiry — ${customer_name}`,
        html
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('notify-order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
