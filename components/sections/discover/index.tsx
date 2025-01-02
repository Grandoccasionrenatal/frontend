'use client';

import PillTabs from '@/components/PillTabs';
import Carousel from '@/components/hocs/Carousel';
import React, { useState } from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/shimmer';
import { apiInterface, productInterface } from '@/types/api.types';
import productService from '@/adapters/products';
import qs from 'qs';
import { useInfiniteQuery } from '@tanstack/react-query';
import StrapiImage from '@/components/StrapiImage';
import CONSTANTS from '@/constant';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore';
import { formatPrice } from '@/utils';

type pillTabTypes =
  | 'outdoor furniture for sale'
  | 'event accessories for sale'
  | 'soft playground equipment';

interface IDiscover {
  intitialData?: apiInterface<productInterface[]>;
  tabs: pillTabTypes[];
}

const Discover = ({ intitialData, tabs }: IDiscover) => {
  const [currTab, setCurrTab] = useState<pillTabTypes>(tabs[0]);
  const { addToCart, setOpen } = useCartStore((store) => store);

  const getProducts = async ({ pageParam = 1 }) => {
    const page = pageParam;
    const res = await productService.getProducts(
      qs.stringify(
        {
          populate: '*',
          filters: {
            product_categories: {
              name: {
                $contains: currTab
              }
            }
          },
          pagination: {
            page: page,
            pageSize: 4,
            withCount: true
          }
        },
        {
          encodeValuesOnly: true
        }
      )
    );
    return res;
  };

  const {
    data: products,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status
  } = useInfiniteQuery<any, any, apiInterface<productInterface[]>>({
    queryKey: ['get-products', currTab],
    queryFn: getProducts,
    getNextPageParam: (lastPageRes) => {
      const lastPage = lastPageRes as apiInterface<productInterface[]>;
      const res =
        lastPage?.meta?.pagination?.pageCount > lastPage?.meta?.pagination.page
          ? lastPage?.meta.pagination.page + 1
          : undefined;
      return res;
    },
    getPreviousPageParam: (firstPageRes) => {
      const firstPage = firstPageRes as apiInterface<productInterface[]>;
      return 1;
    },
    onError: (err) => {
      console.log('err: Something happened while loading products', err);
    },
    initialData: {
      pages: [intitialData],
      pageParams: [null]
    },
    cacheTime: 0
  });

  return (
    <div className="w-full flex flex-col gap-8 font-sans">
      <PillTabs tabs={tabs} currTab={currTab} setCurrTab={(i) => setCurrTab(i)} />
      <Carousel
        totalPages={products?.pages[0]?.meta?.pagination?.pageCount ?? 1}
        perPage={2}
        spacing={20}
        total={products?.pages[0]?.meta?.pagination?.total}
        currPge={products?.pages?.length}
        nextPageLoading={isFetchingNextPage || isFetching}
        onNextPage={() => (hasNextPage ? fetchNextPage() : null)}
        loader={
          <div className="!min-w-[16rem] h-[20rem] mt-4 animate-pulse bg-slate-300 rounded-[13px]" />
        }
      >
        {products?.pages?.map((page) => (
          <React.Fragment key={page?.meta?.pagination?.page}>
            {page?.data?.map((i, idx) => (
              <Carousel.Child
                key={idx}
                className={`w-max pt-4 ${i?.attributes?.is_available ? `` : `hidden`}`}
              >
                <div className=" relative !min-w-[16rem]   group cursor-pointer w-full flex flex-col gap-[.5rem] items-center">
                  <div
                    className={`absolute top-0 -mt-[10px] -rotate-[20deg] min-w-[3rem] h-[1.5rem] bg-orange-1 ${
                      i?.attributes?.discount ? `flex` : `hidden`
                    }  items-center justify-center rounded-[23px] z-[1]`}
                  >
                    <span className={`text-[12px] font-bold`}>-{i?.attributes?.discount}%</span>
                  </div>
                  <div className=" relative w-full h-[20rem] rounded-[13px] bg-slate-300 overflow-hidden">
                    <StrapiImage src={`${i?.attributes?.images?.data?.[0]?.attributes?.url}`} />
                    <div className="absolute px-1 grid grid-cols-2 items-center justify-between gap-2 w-full bottom-0 h-[3rem] bg-gradient-to-b from-black-1/20 to-black-1 md:translate-y-full group-hover:translate-y-0 transition-transform ease-in-out duration-300">
                      <Link href={`/${CONSTANTS.ROUTES.products}/${i?.id}`}>
                        <div className="px-4 py-1 w-full flex justify-center border hover:bg-white/20 border-white rounded-[8px] text-white">
                          view
                        </div>
                      </Link>
                      <div
                        onClick={() => {
                          addToCart({
                            product: i,
                            quantity: 1
                          });
                          setOpen(true);
                        }}
                        className="px-4 py-1 w-full flex justify-center border hover:bg-white/20 border-white rounded-[8px] text-white"
                      >
                        cart
                      </div>
                    </div>
                  </div>
                  <p className="font-[600] text-[16px] text-center font-giliran">
                    {i?.attributes?.name}
                  </p>
                  <span className="font-[500] text-[18px] font-sans ">
                    {CONSTANTS.CURRENCY}
                    {formatPrice(i?.attributes?.price_per_day)}{' '}
                    {i?.attributes?.excl_vat ? <span>(Excl VAT)</span> : <></>}
                  </span>
                </div>
              </Carousel.Child>
            ))}
          </React.Fragment>
        ))}
      </Carousel>
    </div>
  );
};

export default Discover;
