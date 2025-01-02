'use client';

import { cn } from '@/lib/utils';
import CurveCut from '../animations/CurveCut';

const CartLink = ({ onClick, className }: { onClick?: () => void; className?: string }) => {
  return (
    <>
      <div
        onClick={() => onClick?.()}
        className={cn(
          'absolute bottom-0 right-0 h-[6rem] rounded-tl-custom  w-[6rem] bg-white cursor-pointer pt-5 pl-5',
          className
        )}
      >
        <div className="w-full grid place-items-center group h-full rounded-custom bg-black-1 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
      </div>
      <CurveCut
        containerClassName="block w-[4rem] h-[4rem] bottom-[6rem] md:bottom-[6rem] right-0"
        childClassName="bottom-0 right-0 before:shadow-[0_20px_0_0_white]"
      />
      <CurveCut
        containerClassName="block w-[4rem] h-[4rem] bottom-0 right-[6rem] md:right-[6rem]"
        childClassName="bottom-0 right-0 before:shadow-[0_15px_0_0_white]"
      />
    </>
  );
};

export default CartLink;
