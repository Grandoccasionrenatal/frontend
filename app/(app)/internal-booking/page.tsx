import BookingForm from './BookingForm';

export const metadata = {
  robots: 'noindex, nofollow',
};

export default function InternalBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Record New Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Fill this in when a deposit is received from any source.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <BookingForm webhookUrl="https://hook.eu1.make.com/l1io5pc6yidrlbcqtmgmdxrpyyygho4y" />
        </div>
      </div>
    </div>
  );
}
