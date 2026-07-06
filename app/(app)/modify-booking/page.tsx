import ModifyBookingForm from './ModifyBookingForm';

export const metadata = {
  title: 'Modify My Booking — Grand Occasion Rentals',
};

export default function ModifyBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Modify My Booking</h1>
          <p className="text-sm text-gray-500 mt-1">
            Need to add or remove items? We'll update your order and send you a revised invoice.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ModifyBookingForm />
        </div>
      </div>
    </div>
  );
}
