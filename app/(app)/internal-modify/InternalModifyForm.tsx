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

export default function InternalModifyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [updatedItems, setUpdatedItems] = useState('');
  const [newTotal, setNewTotal] = useState('');
  const [done, setDone] = useState<{ new_balance: string } | null>(null);

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
      setError(data.error || 'Booking not found.');
      setLoading(false);
      return;
    }

    setBooking(data);
    setUpdatedItems(data.items);
    setNewTotal(String(data.total_amount));
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!booking) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/approve-modification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notion_page_id: booking.notion_page_id,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        phone: booking.phone,
        event_date: booking.event_date,
        booking_type: booking.booking_type,
        reference_code: booking.reference_code,
        original_items: booking.items,
        updated_items: updatedItems,
        original_total: booking.total_amount,
        new_total: newTotal,
        deposit_amount: booking.deposit_amount,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to approve modification.');
    } else {
      setDone(data);
    }
    setLoading(false);
  };

  if (done && booking) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Booking Updated</h2>
        <p className="text-gray-500 text-sm">Notion updated · Updated invoice sent to <strong>{booking.customer_email}</strong></p>
        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm inline-block">
          <span className="text-gray-500">New balance due on delivery: </span>
          <span className="font-bold text-orange-500 text-lg">€{done.new_balance}</span>
        </div>
        <div className="mt-6">
          <button onClick={() => { setBooking(null); setDone(null); setError(''); }}
            className="text-sm text-orange-500 underline">Modify another booking</button>
        </div>
      </div>
    );
  }

  if (booking) {
    const newBalance = newTotal ? (parseFloat(newTotal) - booking.deposit_amount).toFixed(2) : '—';

    return (
      <div className="flex flex-col gap-5">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-3">Current Booking</p>
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-400">Name</span><span className="font-semibold">{booking.customer_name}</span>
            <span className="text-gray-400">Email</span><span className="font-semibold">{booking.customer_email}</span>
            <span className="text-gray-400">Event Date</span><span className="font-semibold">{fmtDate(booking.event_date)}</span>
            <span className="text-gray-400">Deposit Paid</span><span className="font-semibold text-green-600">€{booking.deposit_amount.toFixed(2)}</span>
            <span className="text-gray-400">Old Total</span><span className="font-semibold">€{booking.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Updated Items</label>
          <textarea rows={5} value={updatedItems} onChange={e => setUpdatedItems(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">New Total Amount (€)</label>
          <input type="number" step="0.01" value={newTotal} onChange={e => setNewTotal(e.target.value)}
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-sm flex justify-between items-center">
          <span className="text-gray-500">New balance due on delivery</span>
          <span className="font-bold text-orange-500 text-lg">€{newBalance}</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => setBooking(null)}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Back
          </button>
          <button onClick={handleApprove} disabled={loading || !newTotal}
            className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
            {loading ? 'Updating…' : 'Approve & Send Updated Invoice'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleLookup} className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">Look up the customer booking to approve their modification request.</p>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Customer Email <span className="text-red-500">*</span></label>
        <input name="email" type="email" required placeholder="customer@example.com"
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
        {loading ? 'Looking up…' : 'Find Booking'}
      </button>
    </form>
  );
}
