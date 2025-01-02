'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import useCartStore from '@/store/useCartStore';

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const status = useMemo(() => {
    const res = searchParams.get('success') as 'true' | 'false';
    if (res) {
      clearCart();
      return res;
    } else {
      return res;
    }
  }, [searchParams]);

  return (
    <div className="w-full h-[100vh]">
      <Dialog defaultOpen={true} open={true}>
        <DialogContent className="h-full w-full md:h-[40vh] md:max-w-[40rem] font-sans">
          <DialogHeader>
            <DialogTitle className="text-[16px]">PAYMENT STATUS !</DialogTitle>

            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
              {status === 'true' ? (
                <h5 className="text-[14px]">SUCCESS</h5>
              ) : (
                <h5 className="text-[14px]">FAILED</h5>
              )}
              {status === 'true' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-20 h-20 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-20 h-20 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>
              )}
              {status === 'true' ? (
                <p className="text-center text-[14px] font-giliran font-[700]">
                  Your order is been processed, <br /> our representative will contact you in a
                  short while.
                </p>
              ) : (
                <p className="text-center text-[14px] font-giliran font-[700]">
                  Your order was not successful, please try again
                </p>
              )}
              <Link href="/">
                <Button className="bg-white text-black-1 hover:bg-black-1/10 ">
                  <span>Back to home</span>
                </Button>
              </Link>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentStatus;
