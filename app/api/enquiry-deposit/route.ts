import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: NextRequest) {
  const { amount, customerName, customerEmail, bookingType, eventDate } = await req.json();

  const depositAmount = Math.round(amount * 0.3 * 100); // 30% in cents

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: customerEmail || undefined,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `30% Deposit — ${bookingType || 'Event Hire'}`,
            description: `Non-refundable deposit for ${customerName}${eventDate ? ` on ${eventDate}` : ''}. Remaining balance due on delivery.`,
          },
          unit_amount: depositAmount,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grandoccasionrental.ie'}/enquiry?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grandoccasionrental.ie'}/enquiry?payment=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
