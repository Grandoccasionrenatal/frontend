'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import UnitSelect from '../UnitSelect';
import useCartStore from '@/store/useCartStore';
import CONSTANTS from '@/constant';
import StrapiImage from '../StrapiImage';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/utils';

const Cart = () => {
  const { cart, open, setOpen, updateQuantity, removeFromCart } = useCartStore((store) => store);
  const [verifiedInput, setVerifiedInput] = useState(true);
  const router = useRouter();

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.product.attributes.price_per_day;
      const discount = item.product.attributes.discount || 0;
      const discountedPrice = price - (price * discount) / 100;
      return acc + discountedPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartContainsRentals = useMemo(() => {
    const res = cart?.find((i) => i?.product?.attributes?.for === 'hire');
    return res ? true : false;
  }, [cart]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="relative flex items-center">
          <div
            className={`absolute top-0 right-0 -mt-[12px] -mr-[8px] min-w-[1.2rem] h-[1.2rem] px-1 ${
              !cart.length ? `hidden` : `grid`
            } place-items-center rounded-[50px] bg-red-600`}
          >
            <span className="text-white font-sans text-[12px]">{cart?.length}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
      </SheetTrigger>
      <SheetContent className="py-2 flex flex-col w-full md:w-[50rem]">
        <SheetHeader>
          <SheetTitle className="text-[24px]">My Cart</SheetTitle>
          <SheetDescription className="sm:text-[16px]">
            All your selected products, select how much unit you want, then procced to checkout
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow w-full overflow-auto flex flex-col justify-between  gap-8">
          <div className="flex-grow w-full flex flex-col gap-4 ">
            {cart?.map((i, idx) => (
              <div key={idx} className="flex items-start justify-between h-max ">
                <div className="flex gap-[4px]">
                  <div className="relative w-[5rem] h-[5rem]  rounded-[.5rem] bg-slate-300 overflow-hidden">
                    <div
                      onClick={() => removeFromCart(i?.product?.id)}
                      className="absolute z-10 w-6 h-6 rounded-[50px] bg-slate-100 grid place-items-center top-0 right-0 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-black-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <StrapiImage
                      src={`${i?.product?.attributes?.images?.data[0]?.attributes?.url}`}
                    />
                  </div>
                  <p className="max-w-[8rem] flex flex-col">
                    <span className=" overflow-hidden truncate text-ellipsis">
                      {i?.product?.attributes?.name}
                    </span>
                    <span>({i?.product?.attributes?.for})</span>
                  </p>
                </div>
                <div className="flex flex-col justify-start h-full gap-1">
                  <p className="flex items-center gap-2">
                    <span
                      className={`${
                        i?.product?.attributes?.discount ? `line-through text-black-1/50` : ``
                      }`}
                    >
                      {CONSTANTS.CURRENCY}
                      {formatPrice(i?.product?.attributes?.price_per_day)}
                    </span>
                    {i?.product?.attributes?.discount ? (
                      `${CONSTANTS.CURRENCY}${
                        i?.product?.attributes?.price_per_day -
                        (i?.product?.attributes?.price_per_day * i?.product?.attributes?.discount) /
                          100
                      }`
                    ) : (
                      <></>
                    )}
                  </p>
                  <UnitSelect
                    setErrors={(i) => setVerifiedInput(!i)}
                    setCount={(num) => updateQuantity(i?.product?.id, num)}
                    max={i?.product?.attributes?.available_units}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between border-b border-b-slate-300 py-1">
              <span>Single Day Total</span>
              <span className="font-[600]">
                {CONSTANTS.CURRENCY}
                {total?.toFixed(2)}
              </span>
            </div>
            {cartContainsRentals ? (
              <div className="w-full flex items-center justify-between border-b border-b-slate-300 py-1">
                <div className="flex flex-col">
                  <span>Multiple Days Total</span>
                  <span>(for rentals)</span>
                </div>
                <span className="font-[600] text-right">Calculated at Chekout</span>
              </div>
            ) : (
              <></>
            )}
            <div className="w-full flex items-center justify-between border-b border-b-slate-300 py-1">
              <span>Shipping</span>
              <span className="font-[600] text-right">Calculated At Checkout</span>
            </div>
            <div className="w-full mb-4 flex flex-col gap-2">
              <Link href={`/${CONSTANTS.ROUTES.order}`}>
                <button
                  disabled={!(verifiedInput && cart.length)}
                  className="relative w-full h-[3rem] rounded-custom border border-slate-300 hover:bg-orange-1 transition-colors ease-in-out duration-300 "
                >
                  <span className="font-[600] uppercase">Proceed to Checkout</span>
                </button>
              </Link>
              <Link href={`/${CONSTANTS.ROUTES['offline-order']}`}>
                <button
                  disabled={!(verifiedInput && cart.length)}
                  className="relative w-full h-[3rem] rounded-custom border border-slate-300 hover:bg-orange-1 transition-colors ease-in-out duration-300 "
                >
                  <span className="font-[600] uppercase">Continue this order offline</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
