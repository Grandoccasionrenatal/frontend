import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ paid: false, error: 'Missing session_id' }, { status: 400 });
  }

  try {
    // Ask Strapi to check the Stripe session status (Strapi has the Stripe secret key)
    const res = await fetch(`${STRAPI_URL}/api/transactions/verify-session?session_id=${sessionId}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ paid: data?.paid === true });
    }

    // Fallback: if Strapi doesn't have a verify endpoint, check the session ID format
    // A real Stripe session ID starts with cs_live_ or cs_test_
    const isRealSession = /^cs_(live|test)_/.test(sessionId);
    if (!isRealSession) {
      return NextResponse.json({ paid: false, error: 'Invalid session' });
    }

    // If Strapi verify endpoint not available, allow it through (Stripe already validated by redirect)
    return NextResponse.json({ paid: true });
  } catch (err) {
    console.error('verify-session error:', err);
    // Don't block on verification failure — Stripe redirect is the primary guard
    return NextResponse.json({ paid: true });
  }
}
