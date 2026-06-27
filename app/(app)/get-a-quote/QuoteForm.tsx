'use client';

import { useState } from 'react';
import { trackEvent } from '@/components/GoogleTagManager';

const SERVICES = [
  'Marquee',
  'Tables & Chairs',
  'Linen & Tablecloths',
  'Flower Wall',
  'Bouncy Castle',
  'Soft Play',
  'Glassware',
  'Other / Not sure yet',
];

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) =>
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;
    const event_date = fd.get('event_date') as string;
    const location = fd.get('location') as string;
    const guests = fd.get('guests') as string;
    const notes = fd.get('notes') as string;

    const details = [
      event_date ? `Event Date: ${event_date}` : '',
      guests ? `Guests: ${guests}` : '',
      selected.length ? `Items: ${selected.join(', ')}` : '',
      notes ? `Notes: ${notes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
      const strapiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
      const res = await fetch(`${strapiUrl}/api/offline-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${strapiToken}`
        },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          phone_number: phone,
          address: location,
          details,
          transaction_items: [],
        }),
      });

      if (!res.ok) throw new Error('Failed');

      // Send email notification
      await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          phone_number: phone,
          address: location,
          details,
          items: selected.map((s) => ({ name: s, quantity: 1, price: 0 })),
          total: 0,
        }),
      });

      trackEvent('quote_request', { services: selected.join(','), source: 'quote_page' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">Quote Request Received!</h2>
        <p className="text-green-700 text-sm">
          Thanks! We&apos;ll get back to you within a few hours on <strong>085 156 3498</strong> or by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
          <input
            id="name" name="name" required placeholder="Jane Murphy"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="phone">Phone / WhatsApp <span className="text-red-500">*</span></label>
          <input
            id="phone" name="phone" required placeholder="085 123 4567" type="tel"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Email + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="email">Email Address</label>
          <input
            id="email" name="email" placeholder="jane@example.com" type="email"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="event_date">Event Date <span className="text-red-500">*</span></label>
          <input
            id="event_date" name="event_date" required type="date"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Location + Guests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="location">Event Location / Town <span className="text-red-500">*</span></label>
          <input
            id="location" name="location" required placeholder="e.g. Naas, Co. Kildare"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="guests">Approx. Number of Guests</label>
          <input
            id="guests" name="guests" placeholder="e.g. 80" type="number" min="1"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Services */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">What do you need? <span className="text-gray-400 font-normal">(select all that apply)</span></label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s} type="button" onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors duration-150 ${
                selected.includes(s)
                  ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold" htmlFor="notes">Anything else we should know? <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          id="notes" name="notes" rows={3}
          placeholder="e.g. garden party, marquee on grass, need setup by 12pm..."
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please call us on <a href="tel:0851563498" className="underline">085 156 3498</a>.</p>
      )}

      <button
        type="submit" disabled={status === 'loading'}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-[15px]"
      >
        {status === 'loading' ? 'Sending...' : 'Request My Free Quote →'}
      </button>

      <p className="text-xs text-gray-400">We respond within a few hours, 7 days a week. No spam, no obligation.</p>
    </form>
  );
}
