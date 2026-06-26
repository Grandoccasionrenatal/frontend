import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Grand Occasion Rentals',
  description:
    'Read our full cancellation and rescheduling policy, including bad weather, force majeure, and unforeseen circumstances — Grand Occasion Rentals, Kildare.'
};

const CancellationPolicyPage = () => {
  return (
    <section className="w-full py-8 px-4 container">
      <iframe
        src="/docs/cancellation_policy.html"
        className="w-full min-h-screen rounded-xl border-0"
        title="Cancellation Policy"
      />
    </section>
  );
};

export default CancellationPolicyPage;
