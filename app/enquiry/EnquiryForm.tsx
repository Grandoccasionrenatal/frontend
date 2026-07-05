'use client';

import { useState } from 'react';

const BOOKING_TYPES = ['Marquee', 'Softplay', 'Bouncy Castle and/or Bubble House', 'Chairs & Tables', 'Decoration', 'Mixed'];
const SOURCES = ['WhatsApp', 'Instagram', 'Softplay Instagram', 'Facebook', 'Facebook Marketplace', 'Gmail', 'Google', 'Friend/Family', 'Walk-in', 'Other'];
const ACCESSIBILITY = ['Open access', 'Side gate', 'Elevator', 'Staircase', 'Other'];

export default function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingType, setBookingType] = useState('');
  const [submittedData, setSubmittedData] = useState<Record<string, string>>({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  const showFloorType = bookingType === 'Marquee' || bookingType === 'Mixed';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      customer_name: fd.get('customer_name') as string,
      phone: fd.get('phone') as string,
      customer_email: fd.get('customer_email') as string,
      postcode: fd.get('postcode') as string,
      event_date: fd.get('event_date') as string,
      event_time: fd.get('event_time') as string,
      booking_type: fd.get('booking_type') as string,
      floor_type: fd.get('floor_type') as string,
      accessibility: fd.get('accessibility') as string,
      items: fd.get('items') as string,
      source: fd.get('source') as string,
      notes: fd.get('notes') as string,
      total_amount: fd.get('total_amount') as string,
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmittedData(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleStripePayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/enquiry-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(submittedData.total_amount),
          customerName: submittedData.customer_name,
          customerEmail: submittedData.customer_email,
          bookingType: submittedData.booking_type,
          eventDate: submittedData.event_date,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        alert(`Payment error: ${data.error || 'Could not create payment session. Please contact us on 085 156 3498.'}`);
        setPaymentLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      alert('Something went wrong. Please contact us on 085 156 3498 or info@grandoccasionrental.ie');
      setPaymentLoading(false);
    }
  };

  if (status === 'success') {
    const total = parseFloat(submittedData.total_amount || '0');
    const deposit = (total * 0.3).toFixed(2);

    return (
      <div className="flex flex-col gap-6">
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Details received!</h2>
          <p className="text-gray-500 text-sm">To secure your booking, please pay your 30% non-refundable deposit.</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Deposit Amount (30% of €{total.toFixed(2)})</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">€{deposit}</p>
          <p className="text-xs text-gray-400 mt-1">Non-refundable · Remaining balance due on delivery</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleStripePayment}
            disabled={paymentLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {paymentLoading ? 'Redirecting...' : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay €{deposit} by Card (Stripe)
              </>
            )}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 bg-white">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              Bank Transfer
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-1">
              <span className="text-gray-400">Account Name</span>
              <span className="font-medium text-gray-800">Grand Occasion Rental Ltd</span>
              <span className="text-gray-400">IBAN</span>
              <span className="font-medium text-gray-800">IE19 BOFI 9009 6547 7115 71</span>
              <span className="text-gray-400">Bank</span>
              <span className="font-medium text-gray-800">Bank of Ireland</span>
              <span className="text-gray-400">Reference</span>
              <span className="font-medium text-gray-800">{submittedData.customer_name?.split(' ')[0]} {submittedData.event_date}</span>
              <span className="text-gray-400">Amount</span>
              <span className="font-bold text-orange-500">€{deposit}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Please use your name and event date as the payment reference. Send proof of payment to <a href="mailto:info@grandoccasionrental.ie" className="text-orange-500 underline">info@grandoccasionrental.ie</a></p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Need help? WhatsApp <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <input name="customer_name" required placeholder="Jane Murphy"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Phone / WhatsApp <span className="text-red-500">*</span></label>
          <input name="phone" required placeholder="085 123 4567"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
          <input name="customer_email" type="email" required placeholder="jane@example.com"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Postcode <span className="text-red-500">*</span></label>
          <input name="postcode" required placeholder="e.g. W91 X2Y3"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Event Date <span className="text-red-500">*</span></label>
          <input name="event_date" type="date" required
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Event Time <span className="text-red-500">*</span></label>
          <input name="event_time" required placeholder="e.g. 2pm – 8pm"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">What are you looking to hire? <span className="text-red-500">*</span></label>
        <select name="booking_type" required value={bookingType} onChange={e => setBookingType(e.target.value)}
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">Select type</option>
          {BOOKING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {showFloorType && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Floor Type <span className="text-red-500">*</span></label>
          <select name="floor_type" required
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="">Select floor type</option>
            <option value="Grass">Grass</option>
            <option value="Concrete">Concrete</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Accessibility to venue <span className="text-red-500">*</span></label>
        <select name="accessibility" required
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">Select access type</option>
          {ACCESSIBILITY.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Items / What you're hiring (optional)</label>
        <textarea name="items" rows={3} placeholder="e.g. 6x9m Marquee, 30 chairs, soft play package..."
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Total Agreed Price (€) <span className="text-red-500">*</span></label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          <input name="total_amount" type="number" required min="1" step="0.01" placeholder="500.00"
            className="h-10 w-full rounded-md border border-gray-200 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <p className="text-xs text-gray-400">A 30% non-refundable deposit will be required to confirm your booking.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">How did you hear about us?</label>
        <select name="source"
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">Select an option</option>
          {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Anything else we should know? (optional)</label>
        <textarea name="notes" rows={2} placeholder="e.g. narrow driveway, pet on site, any special requests..."
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again or WhatsApp us on 085 156 3498.</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-2">
        {status === 'loading' ? 'Sending...' : 'Submit & Pay Deposit'}
      </button>

      <p className="text-xs text-gray-400 text-center">30% non-refundable deposit required to secure your booking.</p>

    </form>
  );
}
