'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import useCartStore from '@/store/useCartStore';
import Link from 'next/link';

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const status = useMemo(() => {
    const res = searchParams.get('success') as 'true' | 'false';
    if (res === 'true') clearCart();
    return res;
  }, [searchParams]);

  if (status === 'true') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-500 text-sm mt-1">Your booking deposit has been received.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Thank you for booking with <strong>Grand Occasion Rentals</strong>! A confirmation email with your invoice has been sent to your email address.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your deposit is secured and your date is reserved.</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>The remaining balance is due on delivery.</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Our team will be in touch to confirm your delivery details.</span>
              </div>
            </div>
          </div>

          <Link href="/"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors mb-3">
            Back to Home
          </Link>

          <p className="text-center text-xs text-gray-400">
            Questions? WhatsApp <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your payment did not go through. No charge has been made. Please try again or contact us if the problem persists.
        </p>
        <Link href="/"
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors mb-3">
          Try Again
        </Link>
        <p className="text-xs text-gray-400">
          Need help? WhatsApp <a href="tel:+353851563498" className="text-orange-500 font-medium">085 156 3498</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
