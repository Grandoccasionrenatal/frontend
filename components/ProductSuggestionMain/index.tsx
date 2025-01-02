'use client';

import React from 'react';
import useCartStore from '@/store/useCartStore';
import { productInterface } from '@/types/api.types';
import { Skeleton } from '../ui/skeleton';
import CartLink from '../cartLink';
import StrapiImage from '../StrapiImage';
import Link from 'next/link';
import CONSTANTS from '@/constant';
import EmptyContentWrapper from '../hocs/EmptyContentWrapper';
import { formatPrice } from '@/utils';

interface IProductSuggestionMain {
  products: productInterface[];
}

const ProductSuggestionMain = ({ products }: IProductSuggestionMain) => {
  const { addToCart, setOpen } = useCartStore((store) => store);
  return (
    <EmptyContentWrapper isEmpty={!products?.length}>
      <div className="max-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1rem]">
        {false
          ? [...Array(3)]?.map((i, idx) => (
              <Skeleton key={idx} className="h-[20rem] relative !rounded-custom">
                <CartLink className=" bg-white  before:absolute before:w-full before:h-full before:bg-[#e19e000d]" />
              </Skeleton>
            ))
          : products?.map((i, idx) => (
              <div
                key={idx}
                className={`relative group cursor-pointer w-full h-[20rem] bg-slate-300 rounded-custom overflow-hidden ${
                  i?.attributes?.is_available ? `` : `hidden`
                }`}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <StrapiImage src={`${i?.attributes?.images?.data?.[0]?.attributes?.url}`} />
                </div>
                <Link href={`/${CONSTANTS.ROUTES.products}/${i?.id}`}>
                  <div className="absolute md:opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 top-4 left-4 w-max text-white font-sans text-[14px] h-[2.5rem] grid place-items-center px-4 rounded-custom border border-white  font-bold bg-black-1/50 hover:bg-black-1/30 ">
                    View
                  </div>
                </Link>
                <div className="absolute flex flex-col  gap-1 bottom-0 px-4 py-2 pt-8 left-0 bg-gradient-to-b from-transparent to-black-1 text-white w-full pr-[8rem]">
                  <h6 className="text-[16px] md:text-[18px] font-giliran font-[700]">
                    {i?.attributes?.name} {`(${i?.attributes?.for})`}
                  </h6>
                  <span className="text-[12px] md:text-[14px] ">Starts from</span>
                  <h4>
                    {CONSTANTS.CURRENCY}
                    {formatPrice(i?.attributes?.price_per_day)}
                  </h4>
                </div>
                <CartLink
                  onClick={() => {
                    addToCart({
                      product: i,
                      quantity: 1
                    });
                    setOpen(true);
                  }}
                  className=" bg-white  before:absolute before:w-full before:h-full before:bg-[#e19e000d]"
                />
              </div>
            ))}
      </div>
    </EmptyContentWrapper>
  );
};

export default ProductSuggestionMain;
