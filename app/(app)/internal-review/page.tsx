import ReviewForm from './ReviewForm';

export const metadata = {
  robots: 'noindex, nofollow',
};

export default function InternalReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Send Review Request</h1>
          <p className="text-sm text-gray-500 mt-1">Send a personalised review link to a customer after their event.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
