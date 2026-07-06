'use client';

import { useState } from 'react';

type Booking = {
  notion_page_id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  event_date: string;
  items: string;
  total_amount: number;
  deposit_amount: number;
  booking_type: string;
  reference_code: string;
};

type Step = 'lookup' | 'modify' | 'submitted';

export default function ModifyBookingForm() {
  const [step, setStep] = useState<Step>('lookup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [requestDetails, setRequestDetails] = useState('');

  function fmtDate(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  const handleLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);

    const res = await fetch(
      `/api/find-booking?email=${encodeURIComponent(fd.get('email') as string)}&event_date=${fd.get('event_date')}`
    );
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Booking not found. Please check your email and event date.');
      setLoading(false);
      return;
    }

    setBooking(data);
    setStep('modify');
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!booking || !requestDetails.trim()) return;
    setLoading(true);
    setError('');

    // Send modification request notification to admin
    const res = await fetch('/api/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        phone_number: booking.phone,
        address: `Event date: ${fmtDate(booking.event_date)}`,
        details: `BOOKING MODIFICATION REQUEST\n\nRef: ${booking.reference_code}\nCurrent items: ${booking.items}\nCurrent total: €${booking.total_amount.toFixed(2)}\n\nCustomer request:\n${requestDetails}`,
        items: [],
        total: booking.total_amount,
      }),
    });

    if (res.ok) {
      setStep('submitted');
    } else {
      setError('Failed to submit request. Please call us on 085 156 3498.');
    }
    setLoading(false);
  };

  if (step === 'submitted') {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          We'll review your request and get back to you within 24 hours to confirm the changes and send an updated invoice.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Questions? WhatsApp <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
        </p>
      </div>
    );
  }

  if (step === 'modify' && booking) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Current booking summary */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-3">Your Current Booking</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-400">Name</span>
            <span className="font-semibold">{booking.customer_name}</span>
            <span className="text-gray-400">Event Date</span>
            <span className="font-semibold">{fmtDate(booking.event_date)}</span>
            <span className="text-gray-400">Type</span>
            <span className="font-semibold">{booking.booking_type}</span>
            <span className="text-gray-400">Items</span>
            <span className="font-semibold whitespace-pre-line">{booking.items}</span>
            <span className="text-gray-400">Total</span>
            <span className="font-semibold">€{booking.total_amount.toFixed(2)}</span>
            <span className="text-gray-400">Deposit Paid</span>
            <span className="font-semibold text-green-600">€{booking.deposit_amount.toFixed(2)}</span>
            <span className="text-gray-400">Balance Due</span>
            <span className="font-semibold text-orange-500">
              €{(booking.total_amount - booking.deposit_amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">What would you like to change? <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={5}
            value={requestDetails}
            onChange={e => setRequestDetails(e.target.value)}
            placeholder="e.g. Add 2 extra round tables and 10 chairs. Remove the ivory table covers."
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
          <p className="text-xs text-gray-400">Be as specific as possible. We'll confirm availability and send you an updated invoice within 24 hours.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep('lookup')}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Back
          </button>
          <button type="submit" disabled={loading || !requestDetails.trim()}
            className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleLookup} className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">Enter the email address you used when booking and your event date to find your booking.</p>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Email Address <span className="text-red-500">*</span></label>
        <input name="email" type="email" required placeholder="jane@example.com"
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Event Date <span className="text-red-500">*</span></label>
        <input name="event_date" type="date" required
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}
      <button type="submit" disabled={loading}
        className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
        {loading ? 'Looking up…' : 'Find My Booking'}
      </button>
    </form>
  );
}
