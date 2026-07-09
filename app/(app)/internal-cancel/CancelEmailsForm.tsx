'use client';

import { useState } from 'react';

interface ScheduledEmail {
  id: string;
  subject: string;
}

export default function CancelEmailsForm() {
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [pageId, setPageId] = useState('');
  const [emails, setEmails] = useState<ScheduledEmail[] | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState<Set<string>>(new Set());

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmails(null);
    setCustomerName('');
    setCancelled(new Set());

    try {
      const res = await fetch(`/api/cancel-scheduled-emails?email=${encodeURIComponent(email)}&date=${date}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Booking not found'); return; }
      setPageId(data.pageId);
      setCustomerName(data.customerName);
      setEmails(data.scheduledEmails);
    } catch {
      setError('Failed to look up booking');
    } finally {
      setLoading(false);
    }
  }

  async function cancelEmail(emailId: string) {
    setCancelling(emailId);
    try {
      const res = await fetch('/api/cancel-scheduled-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, pageId }),
      });
      if (res.ok) {
        setCancelled(prev => new Set([...prev, emailId]));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel email');
      }
    } catch {
      alert('Failed to cancel email');
    } finally {
      setCancelling(null);
    }
  }

  const activeEmails = emails?.filter(e => !cancelled.has(e.id)) ?? [];
  const allCancelled = emails !== null && activeEmails.length === 0;

  return (
    <div className="space-y-5">
      <form onSubmit={lookup} className="space-y-4">
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
          {loading ? 'Looking up…' : 'Look Up Booking'}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      {emails !== null && (
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <p className="text-sm font-medium text-gray-800">
            Booking for <strong>{customerName}</strong>
          </p>

          {allCancelled && (
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700">
              All scheduled emails have been cancelled.
            </div>
          )}

          {emails.length === 0 && !allCancelled && (
            <p className="text-sm text-gray-500">No scheduled emails found for this booking.</p>
          )}

          {activeEmails.map(email => (
            <div key={email.id} className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-700 flex-1 min-w-0 truncate">{email.subject}</p>
              <button
                onClick={() => cancelEmail(email.id)}
                disabled={cancelling === email.id}
                className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {cancelling === email.id ? 'Cancelling…' : 'Cancel'}
              </button>
            </div>
          ))}

          {cancelled.size > 0 && !allCancelled && (
            <p className="text-xs text-gray-400">{cancelled.size} email{cancelled.size > 1 ? 's' : ''} cancelled successfully.</p>
          )}
        </div>
      )}
    </div>
  );
}
