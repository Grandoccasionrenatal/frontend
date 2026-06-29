'use client';

import { useState } from 'react';

const BOOKING_TYPES = ['Marquee', 'Softplay', 'Bouncy Castle and/or Bubble House', 'Chairs & Tables', 'Decoration', 'Mixed'];
const SOURCES = ['WhatsApp', 'Instagram', 'Softplay Instagram', 'Facebook', 'Facebook Marketplace', 'Gmail', 'Google', 'Friend/Family', 'Walk-in', 'Other'];
const ACCESSIBILITY = ['Open access', 'Side gate', 'Elevator', 'Staircase', 'Other'];

export default function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingType, setBookingType] = useState('');

  const showFloorType = bookingType === 'Marquee' || bookingType === 'Mixed';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const fd = new FormData(e.currentTarget);
    const data = {
      customer_name: fd.get('customer_name'),
      phone: fd.get('phone'),
      customer_email: fd.get('customer_email'),
      postcode: fd.get('postcode'),
      event_date: fd.get('event_date'),
      event_time: fd.get('event_time'),
      booking_type: fd.get('booking_type'),
      floor_type: fd.get('floor_type'),
      accessibility: fd.get('accessibility'),
      items: fd.get('items'),
      source: fd.get('source'),
      notes: fd.get('notes'),
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Details received!</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Thank you! We'll be in touch shortly with your deposit details to confirm and secure your booking.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Need us sooner? WhatsApp <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
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
        {status === 'loading' ? 'Sending...' : 'Submit Booking Details'}
      </button>

      <p className="text-xs text-gray-400 text-center">We'll send you deposit details shortly to confirm your booking.</p>

    </form>
  );
}
