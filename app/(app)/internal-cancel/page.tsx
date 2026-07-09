import CancelEmailsForm from './CancelEmailsForm';

export const metadata = {
  title: 'Cancel Scheduled Emails — Grand Occasion Rentals',
  robots: 'noindex, nofollow',
};

export default function InternalCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cancel Scheduled Emails</h1>
          <p className="text-sm text-gray-500 mt-1">
            Look up a booking by email and event date to view and cancel any pending scheduled emails — useful when a customer cancels their event.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CancelEmailsForm />
        </div>
      </div>
    </div>
  );
}
