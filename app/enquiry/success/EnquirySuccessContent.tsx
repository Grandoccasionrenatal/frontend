'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function EnquirySuccessContent() {
  const params = useSearchParams();
  const [emailSent] = useState(true); // Email is now sent by Stripe webhook, not this page

  const name = params.get('name') || '';
  const email = params.get('email') || '';
  const phone = params.get('phone') || '';
  const postcode = params.get('postcode') || '';
  const booking = params.get('booking') || '';
  const date = params.get('date') || '';
  const total = params.get('total') || '0';
  const deposit = params.get('deposit') || '0';
  const items = params.get('items') || '';
  const source = params.get('source') || '';
  const sessionId = params.get('session_id') || '';

  const pickupDate = (() => {
    if (!date) return '';
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  // Email confirmation is now triggered by Stripe webhook (stripe-webhook route)
  // This page just displays the success UI

  const balance = (parseFloat(total) - parseFloat(deposit)).toFixed(2);

  function fmtDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Deposit Received!</h1>
          <p className="text-gray-500 text-sm mt-1">Your booking is now secured.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="bg-orange-500 px-6 py-4">
            <p className="text-orange-100 text-xs font-medium uppercase tracking-wide">Booking Reference</p>
            <p className="text-white text-xl font-bold tracking-widest mt-0.5">{postcode?.toUpperCase() || '—'}</p>
          </div>

          <div className="px-6 py-4 divide-y divide-gray-50">
            {name && (
              <div className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-400">Name</span>
                <span className="font-semibold text-gray-800">{name}</span>
              </div>
            )}
            {booking && (
              <div className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-400">Booking Type</span>
                <span className="font-semibold text-gray-800">{booking}</span>
              </div>
            )}
            {date && (
              <div className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-400">Event Date</span>
                <span className="font-semibold text-gray-800">{fmtDate(date)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl px-6 py-4 mb-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-3">Payment Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Cost</span>
              <span className="font-semibold">€{parseFloat(total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Deposit Paid</span>
              <span className="font-semibold">− €{parseFloat(deposit).toFixed(2)}</span>
            </div>
            <div className="border-t border-orange-200 pt-2 flex justify-between">
              <span className="font-bold text-gray-800">Balance Due on Delivery</span>
              <span className="font-bold text-orange-500">€{balance}</span>
            </div>
          </div>
        </div>

        {email && (
          <p className="text-center text-sm text-gray-500 mb-6">
            {emailSent
              ? <>A confirmation email with your invoice has been sent to <strong>{email}</strong></>
              : <>Sending confirmation to <strong>{email}</strong>…</>}
          </p>
        )}

        <Link href="/" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors">
          Back to Home
        </Link>

        <p className="text-center text-xs text-gray-400 mt-4">
          Questions? WhatsApp <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
        </p>
      </div>
    </div>
  );
}
