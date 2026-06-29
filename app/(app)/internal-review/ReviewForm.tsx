'use client';

import { useState } from 'react';

const PLATFORMS = [
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'both', label: 'Both (Google & Facebook)' },
];

export default function ReviewForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reminder, setReminder] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const fd = new FormData(e.currentTarget);
    const data = {
      customer_name: fd.get('customer_name'),
      customer_email: fd.get('customer_email'),
      event_description: fd.get('event_description'),
      platform: fd.get('platform'),
      custom_message: fd.get('custom_message'),
      send_reminder: reminder,
    };

    try {
      const res = await fetch('/api/review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      setReminder(true);
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
          <label className="text-sm font-semibold">Customer Email <span className="text-red-500">*</span></label>
          <input name="customer_email" type="email" required placeholder="jane@example.com"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Event / Items Hired <span className="text-red-500">*</span></label>
        <input name="event_description" required placeholder="e.g. 30th Birthday – Marquee & Soft Play"
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Review Platform <span className="text-red-500">*</span></label>
        <select name="platform" required
          className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">Select platform</option>
          {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Personal Message (optional)</label>
        <textarea name="custom_message" rows={3}
          placeholder="e.g. It was lovely meeting you at your daughter's birthday! Hope everyone had a great time."
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            className="sr-only"
            checked={reminder}
            onChange={e => setReminder(e.target.checked)}
          />
          <div
            onClick={() => setReminder(r => !r)}
            className={`w-10 h-6 rounded-full transition-colors duration-200 ${reminder ? 'bg-orange-500' : 'bg-gray-300'}`}
          />
          <div
            onClick={() => setReminder(r => !r)}
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${reminder ? 'translate-x-5' : 'translate-x-1'}`}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Send 7-day reminder</p>
          <p className="text-xs text-gray-500">If they haven't reviewed yet, a gentle follow-up will be sent automatically after 7 days.</p>
        </div>
      </label>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm font-medium">
          Review request sent! {reminder && 'A reminder will follow in 7 days.'}
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
        {status === 'loading' ? 'Sending...' : 'Send Review Request'}
      </button>
    </form>
  );
}
