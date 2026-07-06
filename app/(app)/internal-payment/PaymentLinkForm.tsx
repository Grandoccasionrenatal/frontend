'use client';

import { useState } from 'react';

const BOOKING_TYPES = ['Marquee', 'Softplay', 'Bouncy Castle and/or Bubble House', 'Chairs & Tables', 'Decoration', 'Mixed'];

export default function PaymentLinkForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ checkoutUrl: string; deposit: number; total: number; customerName: string; customerEmail: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const fd = new FormData(e.currentTarget);
    const total = parseFloat(fd.get('total_amount') as string);
    const customerName = fd.get('customer_name') as string;
    const customerEmail = fd.get('customer_email') as string;

    if (isNaN(total) || total <= 0) {
      setError('Please enter a valid total amount.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/enquiry-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName,
          customerEmail,
          phone: fd.get('phone'),
          bookingType: fd.get('booking_type'),
          eventDate: fd.get('event_date'),
          postcode: fd.get('postcode'),
          items: fd.get('items'),
          source: 'Internal Payment Link',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || 'Failed to generate payment link. Please try again.');
        setLoading(false);
        return;
      }

      setResult({
        checkoutUrl: data.checkoutUrl,
        deposit: parseFloat((total * 0.3).toFixed(2)),
        total,
        customerName,
        customerEmail,
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.checkoutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappLink = result
    ? `https://wa.me/?text=${encodeURIComponent(`Hi ${result.customerName},\n\nThank you for choosing Grand Occasion Rentals! Please use the link below to pay your 30% deposit (€${result.deposit.toFixed(2)}) to secure your booking:\n\n${result.checkoutUrl}\n\nOnce paid, you'll receive a confirmation email with your invoice.\n\nAny questions, reply here or call 085 156 3498.\n\nThanks,\nGrand Occasion Rentals`)}`
    : '';

  const emailLink = result
    ? `mailto:${result.customerEmail}?subject=Your booking deposit — Grand Occasion Rentals&body=${encodeURIComponent(`Hi ${result.customerName},\n\nThank you for choosing Grand Occasion Rentals! Please use the link below to pay your 30% deposit (€${result.deposit.toFixed(2)}) to secure your booking:\n\n${result.checkoutUrl}\n\nOnce paid, you'll receive a confirmation email with your invoice.\n\nAny questions, feel free to reply to this email or call us on 085 156 3498.\n\nWarm regards,\nGrand Occasion Rentals`)}`
    : '';

  if (result) {
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-green-800">Payment link created</span>
          </div>
          <p className="text-sm text-green-700">
            For <strong>{result.customerName}</strong> · Total €{result.total.toFixed(2)} · Deposit €{result.deposit.toFixed(2)}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={result.checkoutUrl}
              className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm bg-gray-50 text-gray-700 truncate"
            />
            <button
              onClick={copyLink}
              className="h-10 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send via WhatsApp
          </a>
          <a
            href={emailLink}
            className="flex items-center justify-center gap-2 h-11 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send via Email
          </a>
        </div>

        <button
          onClick={() => setResult(null)}
          className="text-sm text-gray-400 hover:text-gray-600 underline text-center"
        >
          Generate another link
        </button>
      </div>
    );
  }

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
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold">Customer Email <span className="text-red-500">*</span></label>
          <input name="customer_email" type="email" required placeholder="jane@example.com"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Event Date <span className="text-red-500">*</span></label>
          <input name="event_date" type="date" required
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Booking Type <span className="text-red-500">*</span></label>
          <select name="booking_type" required
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="">Select type…</option>
            {BOOKING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Total Amount (€) <span className="text-red-500">*</span></label>
          <input name="total_amount" type="number" step="0.01" min="1" required placeholder="1500.00"
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <p className="text-xs text-gray-400">30% deposit (€<span id="dep">—</span>) will be charged</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Postcode / Area</label>
          <input name="postcode" placeholder="R93, Naas, etc."
            className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold">Items / Notes</label>
          <textarea name="items" rows={3} placeholder="5x14m Marquee, 50 chairs, 10 tables…"
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
      >
        {loading ? 'Generating link…' : 'Generate Payment Link'}
      </button>
    </form>
  );
}
