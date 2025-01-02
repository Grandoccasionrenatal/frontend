import productService from '@/adapters/products';
import NavBottomLine from '@/components/navBottomLine';
import React from 'react';
import qs from 'qs';
import { apiInterface, productInterface } from '@/types/api.types';
import CONSTANTS from '@/constant';
import SingleProductAction from '@/components/SingleProductAction';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import ProductReel from '@/components/ProductReel';
import dynamic from 'next/dynamic';
import ProductSuggestionMain from '@/components/ProductSuggestionMain';
import { formatPrice } from '@/utils';

const Markdown = dynamic(() => import('@/components/markdown'), { ssr: false });

interface Props {
  params: { id: string };
}

// export const revalidate = 60;

export async function generateStaticParams() {
  const products = (await productService.getProducts(
    qs.stringify({
      populate: '*'
    })
  )) as apiInterface<productInterface[]>;

  return products?.data?.map((i) => ({
    id: `${i?.id}`
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = (await productService.getSingleProduct({
    id: params?.id,
    params: qs.stringify({
      populate: '*'
    })
  })) as apiInterface<productInterface>;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.data?.attributes?.name,
    openGraph: {
      images: [`${product?.data?.attributes?.images?.data?.[0]?.attributes.url}`, ...previousImages]
    },
    keywords: [
      ...(product?.data?.attributes?.product_categories?.data?.map((i) => i?.attributes?.name) ??
        [])
    ],
    description: product?.data?.attributes?.details,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_CLIENT_URL}`)
  };
}



const SingleProduct = async ({ params }: Props) => {
  const product = (await productService.getSingleProduct({
    id: params?.id,
    params: qs.stringify(
      {
        populate: {
          suggestions: {
            populate: ['images']
          },
          images: {
            populate: '*'
          },
          product_categories: {
            populate: '*'
          }
        }
      },
      {
        encodeValuesOnly: true
      }
    )
  })) as apiInterface<productInterface>;

  if (!product?.data?.id || !product?.data?.attributes?.is_available) {
    notFound();
  }

  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />
      <section className="relative w-full py-6 md:py-12">
        <div className="w-full min-h-[70vh] rounded-custom grid grid-rows-2 grid-cols-1 md:grid-rows-1 lg:grid-cols-[60%_auto] px-container-base lg:px-container-lg md:py-12 gap-12">
          <ProductReel images={product?.data?.attributes?.images} />
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-[18px] md:text-[2rem] font-[600]">
                {product?.data?.attributes?.name}
              </h4>
              <span className="font-sans text-[14px]">{`(for ${product?.data?.attributes?.for})`}</span>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex items-center gap-2">
                <div className="w-max px-4 py-[6px] rounded-custom bg-orange-1 min-w-[6rem] grid place-items-center font-[600]">
                  {CONSTANTS.CURRENCY}
                  {formatPrice(product?.data?.attributes?.price_per_day)}{' '}
                </div>
                {product?.data?.attributes?.excl_vat ? <span>(Excl VAT)</span> : <></>}
              </div>
              <span
                className={`text-[12px] font-sans ${
                  product?.data?.attributes?.discount ? `flex` : `hidden`
                }`}
              >
                With {product?.data?.attributes?.discount}% discount
              </span>
            </div>
            <div
              className={`w-full py-2 border-b border-b-slate-300 transition-opacity duration-300 ease-in-out`}
            />
            <p className="font-sans text-black-1/50">
              <Markdown md={product?.data?.attributes?.details} />
            </p>
            <p className="font-sans text-black-1/50">
              <Markdown md={product?.data?.attributes?.advanced_details as string} />
            </p>
            <SingleProductAction p={product?.data} />
            <div></div>
          </div>
        </div>
      </section>
      <section className="relative w-full py-6 min-h-[12rem]">
        <div className="w-full flex flex-col gap-6 relative">
          <h5 className="mx-auto mb-2 font-[700] text-center text-black-1/[0.87] md:text-[28px]">
            Suggestions
          </h5>
          <ProductSuggestionMain products={product?.data?.attributes?.suggestions?.data} />
        </div>
      </section>
    </main>
  );
};

export default SingleProduct;
