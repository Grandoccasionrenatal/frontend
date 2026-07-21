'use client';

import { useState } from 'react';

export default function SendEmailsForm() {
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ sent: string[]; scheduled: string[] } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/trigger-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, date }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setResult(data);
    } catch {
      setError('Failed to trigger emails');
    } finally {
      setLoading(false);
    }
  }

  const total = (result?.sent.length ?? 0) + (result?.scheduled.length ?? 0);

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="customer@example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Sending…' : 'Send Emails'}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      {result && (
        <div className="pt-2 border-t border-gray-100 space-y-3">
          {total === 0 ? (
            <p className="text-sm text-gray-500">No emails were applicable for this booking at this time.</p>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 space-y-2">
              <p className="text-sm font-semibold text-green-800">{total} email{total > 1 ? 's' : ''} triggered successfully.</p>
              {result.sent.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Sent now</p>
                  {result.sent.map(e => (
                    <p key={e} className="text-sm text-green-700">✓ {e}</p>
                  ))}
                </div>
              )}
              {result.scheduled.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Scheduled</p>
                  {result.scheduled.map(e => (
                    <p key={e} className="text-sm text-green-700">🕐 {e}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400 space-y-1 pt-1 border-t border-gray-100">
        <p><strong>How it works:</strong></p>
        <p>• Event &gt;7 days away → schedules upsell email for 7 days before</p>
        <p>• Event 2–4 days away → sends 3-day reminder immediately</p>
        <p>• Event already passed → sends review email immediately</p>
      </div>
    </div>
  );
}
