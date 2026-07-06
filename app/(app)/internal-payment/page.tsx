import PaymentLinkForm from './PaymentLinkForm';

export const metadata = {
  title: 'Generate Payment Link — Grand Occasion Rentals',
  robots: 'noindex, nofollow',
};

export default function InternalPaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Generate Payment Link</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the customer details and quote amount. A 30% deposit link will be created — copy it or send directly via WhatsApp or email.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <PaymentLinkForm />
        </div>
      </div>
    </div>
  );
}
