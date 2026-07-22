import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const LOCAL_AREAS = [
  'Carlow', 'Kildare', 'Kilkenny', 'Laois', 'Portlaoise',
  'Athy', 'Abbeyleix', 'Castlecomer', 'Naas', 'Newbridge'
];

function getSeasonalContext(month: number): string {
  if (month === 1) return 'Valentine\'s Day coming up, engagement parties and anniversary dinners';
  if (month === 2) return 'Valentine\'s Day this month, romantic dinners and engagement parties';
  if (month === 3) return 'St Patrick\'s Day celebrations, spring parties getting started';
  if (month === 4) return 'Easter gatherings, First Communion season beginning soon';
  if (month === 5) return 'First Communion season in full swing — one of the busiest times of year';
  if (month === 6) return 'Communion and Confirmation season, summer weddings and garden parties';
  if (month === 7) return 'Summer wedding season, garden parties, outdoor events';
  if (month === 8) return 'Late summer events, bank holiday gatherings, end-of-summer parties';
  if (month === 9) return 'Autumn events, harvest gatherings, corporate end-of-year planning begins';
  if (month === 10) return 'Halloween parties, autumn corporate events';
  if (month === 11) return 'Christmas party season — book early to avoid disappointment';
  if (month === 12) return 'Christmas and New Year celebrations, festive family gatherings';
  return 'upcoming events and celebrations';
}

function getWeekArea(weekNumber: number): string {
  return LOCAL_AREAS[weekNumber % LOCAL_AREAS.length];
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const weekNumber = getISOWeekNumber(now);
    const area = getWeekArea(weekNumber);
    const seasonal = getSeasonalContext(month);
    const dateStr = now.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: `You are writing a Google Business Profile post for Grand Occasion Rental, an event equipment hire company based in Carlow, Ireland.

Business details:
- Services: marquee hire, Chiavari chair hire, folding chair hire, trestle tables, round tables, table linens, soft play equipment, flower walls, backdrops, props
- Areas served: Carlow, Kildare, Kilkenny, Laois and surrounding areas
- Website: grandoccasionrental.ie
- Phone: 085 156 3498
- Sample prices: folding chairs €2.20, Chiavari chairs from €5.50, round tables €9.45, trestle tables €8.15, delivery from €70

Write ONE Google Business Profile post following these rules:
- 150–300 words
- Warm, friendly, professional tone — not salesy
- Feature the local area: ${area}
- Reference the seasonal context: ${seasonal}
- Mention 1–2 specific products with hire price
- End with: "Get a free quote at grandoccasionrental.ie or call 085 156 3498"
- End with 4–5 relevant hashtags (e.g. #ChairHireCarlow #MarqueeHireKildare #EventHireIreland)

Output the post text only — no intro, no explanation, just the post.`
        }
      ]
    });

    const postText = (message.content[0] as { type: string; text: string }).text.trim();

    const emailHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#d96f00;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;">Your Google Post for This Week</h1>
            <p style="margin:6px 0 0;color:#ffd9b0;font-size:14px;">${dateStr} · Featuring: ${area}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:28px 32px;border:1px solid #f0e4d0;border-top:none;">
            <p style="margin:0 0 16px;font-size:15px;">Hi,</p>
            <p style="margin:0 0 20px;font-size:15px;">Here is your Google Business Profile post for this week. Copy and paste it directly into your GBP dashboard.</p>

            <div style="background:#fff8f0;border-left:4px solid #d96f00;padding:20px 24px;border-radius:4px;margin:0 0 24px;">
              <p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap;">${postText}</p>
            </div>

            <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#d96f00;">How to post it (2 minutes):</p>
            <ol style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:2;">
              <li>Go to <a href="https://business.google.com" style="color:#d96f00;">business.google.com</a></li>
              <li>Click <strong>"Add update"</strong></li>
              <li>Paste the text above</li>
              <li>Add a photo of your equipment if you have one</li>
              <li>Click <strong>Publish</strong></li>
            </ol>
          </td>
        </tr>
        <tr>
          <td style="background:#fff8f0;padding:16px 32px;border:1px solid #f0e4d0;border-top:none;border-radius:0 0 10px 10px;">
            <p style="margin:0;font-size:13px;color:#888;">Questions? Reach us at <a href="mailto:info@grandoccasionrental.ie" style="color:#d96f00;">info@grandoccasionrental.ie</a> or WhatsApp <a href="tel:+353851563498" style="color:#d96f00;">085 156 3498</a>.</p>
            <p style="margin:12px 0 0;font-size:13px;color:#aaa;">This post was auto-generated by your Grand Occasion marketing assistant.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    await resend.emails.send({
      from: 'Grand Occasion Marketing <info@grandoccasionrental.ie>',
      to: 'info@grandoccasionrental.ie',
      subject: `📅 Your Google Post for this week — ${dateStr}`,
      html: emailHtml
    });

    return NextResponse.json({ success: true, area, week: weekNumber });
  } catch (error: any) {
    console.error('GBP post cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
