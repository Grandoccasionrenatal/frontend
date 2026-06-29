import type { Metadata } from 'next';
import EnquiryForm from './EnquiryForm';

export const metadata: Metadata = {
  title: 'Secure Your Booking — Grand Occasion Rentals',
  description: 'Fill in your details to secure your booking with Grand Occasion Rentals.',
  robots: { index: false },
};

export default function EnquiryPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Your Booking</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Please fill in the details below so we can get everything ready for your event. Once we receive this, we'll send you the deposit details to confirm your booking.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <EnquiryForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Need help? WhatsApp or call us on{' '}
          <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
        </p>

      </div>
    </main>
  );
}
