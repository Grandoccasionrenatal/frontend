import InternalModifyForm from './InternalModifyForm';

export const metadata = {
  title: 'Approve Booking Modification — Grand Occasion Rentals',
  robots: 'noindex, nofollow',
};

export default function InternalModifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Approve Booking Modification</h1>
          <p className="text-sm text-gray-500 mt-1">
            Look up a booking, update the items and total, then approve — Notion updates and the customer gets a revised invoice automatically.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <InternalModifyForm />
        </div>
      </div>
    </div>
  );
}
