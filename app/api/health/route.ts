import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

async function checkStrapi(): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(`${STRAPI_URL}/api/products?pagination[limit]=1`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, latency: Date.now() - start };
  } catch (err: any) {
    return { ok: false, latency: Date.now() - start, error: err?.message };
  }
}

async function checkNotion(): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return { ok: false, latency: 0, error: 'NOTION_API_KEY not set' };
  try {
    const res = await fetch('https://api.notion.com/v1/databases/34b22911-78c3-4c8e-a860-de396a0d96a2', {
      headers: {
        Authorization: `Bearer ${notionKey}`,
        'Notion-Version': '2022-06-28',
      },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, latency: Date.now() - start };
  } catch (err: any) {
    return { ok: false, latency: Date.now() - start, error: err?.message };
  }
}

async function checkResend(): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, latency: 0, error: 'RESEND_API_KEY not set' };
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, latency: Date.now() - start };
  } catch (err: any) {
    return { ok: false, latency: Date.now() - start, error: err?.message };
  }
}

export async function GET() {
  const [strapi, notion, resend] = await Promise.all([
    checkStrapi(),
    checkNotion(),
    checkResend(),
  ]);

  const allOk = strapi.ok && notion.ok && resend.ok;

  const result = {
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      strapi: { ...strapi, label: 'Strapi CMS / Stripe payments' },
      notion: { ...notion, label: 'Notion booking database' },
      resend: { ...resend, label: 'Email delivery' },
    },
  };

  return NextResponse.json(result, { status: allOk ? 200 : 503 });
}
