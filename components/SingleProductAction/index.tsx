'use client';

import useCartStore from '@/store/useCartStore';
import { productInterface } from '@/types/api.types';

const SingleProductAction = ({ p }: { p: productInterface }) => {
  const { addToCart, setOpen } = useCartStore((store) => store);

  return (
    <div className="w-full">
      <button
        onClick={() => {
          addToCart({
            product: p,
            quantity: 1
          });
          setOpen(true);
        }}
        className="relative w-full h-[3rem] rounded-custom border border-slate-300 hover:bg-orange-1 transition-colors ease-in-out duration-300 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 absolute left-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
        <span className="font-[600]">Add To Cart</span>
      </button>
    </div>
  );
};

export default SingleProductAction;
