'use client';

import { useState } from 'react';

const SOURCES = ['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Walk-in', 'Phone Call'];

export default function BookingForm({ webhookUrl }: { webhookUrl: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const fd = new FormData(e.currentTarget);
    const data = {
      customer_name: fd.get('customer_name'),
      customer_email: fd.get('customer_email'),
      phone: fd.get('phone'),
      event_date: fd.get('event_date'),
      event_location: fd.get('event_location'),
      items: fd.get('items'),
      source: fd.get('source'),
      total_amount: fd.get('total_amount'),
      deposit_amount: fd.get('deposit_amount'),
      reference_code: fd.get('reference_code'),
      notes: fd.get('notes'),
    };

    try {
      await fetch('/api/booking-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Customer Name <span className="text-red-500">*</span></label>
          <input name="customer_name" required placeholder="Jane Murphy"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Phone / WhatsApp <span className="text-red-500">*</span></label>
          <input name="phone" required placeholder="085 123 4567"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Customer Email</label>
          <input name="customer_email" type="email" placeholder="jane@example.com"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Event Date <span className="text-red-500">*</span></label>
          <input name="event_date" type="date" required
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Event Location <span className="text-red-500">*</span></label>
          <input name="event_location" required placeholder="e.g. Naas, Co. Kildare"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Booking Source <span className="text-red-500">*</span></label>
          <select name="source" required
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="">Select source</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Items Booked <span className="text-red-500">*</span></label>
        <textarea name="items" required rows={3} placeholder="e.g. 5x10m Marquee, 20 Folding Chairs, 5 Trestle Tables..."
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Total Amount (€) <span className="text-red-500">*</span></label>
          <input name="total_amount" type="number" required min="0" step="0.01" placeholder="500.00"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Deposit Paid (€) <span className="text-red-500">*</span></label>
          <input name="deposit_amount" type="number" required min="0" step="0.01" placeholder="100.00"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Reference Code</label>
          <input name="reference_code" placeholder="e.g. D15RH92"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Notes (optional)</label>
        <textarea name="notes" rows={2} placeholder="Any extra details..."
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm font-medium">
          Booking recorded! Confirmation email sent and Notion updated.
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
        {status === 'loading' ? 'Saving...' : 'Record Booking & Send Confirmation'}
      </button>
    </form>
  );
}
