import type { Metadata } from 'next';
import EnquiryForm from './EnquiryForm';

export const metadata: Metadata = {
  title: 'Book an Event — Grand Occasion Rentals',
  description: 'Fill in your event details and we\'ll get back to you within 24 hours.',
  robots: { index: false },
};

export default function EnquiryPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Booking</h1>
          <p className="text-gray-500 text-sm">
            Fill in your details below and we'll get back to you within 24 hours to confirm availability and arrange your deposit.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <EnquiryForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Prefer to chat? WhatsApp or call us on{' '}
          <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
        </p>

      </div>
    </main>
  );
}
