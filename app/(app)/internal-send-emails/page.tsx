import SendEmailsForm from './SendEmailsForm';

export const metadata = {
  title: 'Send Emails — Grand Occasion Rentals',
  robots: 'noindex, nofollow',
};

export default function InternalSendEmailsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Send Customer Emails</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manually trigger the email sequence for any booking — useful for manual bookings or when a customer missed their scheduled emails.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SendEmailsForm />
        </div>
      </div>
    </div>
  );
}
