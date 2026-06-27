import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  await fetch('https://hook.eu1.make.com/l1io5pc6yidrlbcqtmgmdxrpyyygho4y', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return NextResponse.json({ ok: true });
}
