import CurveCut from '@/components/animations/CurveCut';
import Discover from '@/components/sections/discover';
import CONSTANTS from '@/constant';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/shimmer';
import comm1 from '@/assets/svg/comm-1.svg';
import comm2 from '@/assets/svg/comm-2.svg';
import comm3 from '@/assets/svg/comm-3.svg';
import NavBottomLine from '@/components/navBottomLine';
import otherServices from '@/adapters/others';
import qs from 'qs';
import {
  advertisementInterface,
  apiInterface,
  bannerInterface,
  heroStatInterface,
  productCategoryInterface,
  productInterface
} from '@/types/api.types';
import StrapiImage from '@/components/StrapiImage';
import productService from '@/adapters/products';
import { sluggify } from '@/utils';
import dynamic from 'next/dynamic';
import ProductCarousel from '@/components/ProductCarousel';
import AdsCarousel from '@/components/AdsCarousel';
const Reviews = dynamic(() => import('@/components/sections/Reviews'), { ssr: false });

export const revalidate = 60;

const page = async () => {



  
  const heroStatisticsData: Promise<apiInterface<heroStatInterface[]>> =
    otherServices.getHeroStatistic(
      qs.stringify({
        populate: '*'
      })
    );
  const bannersData: Promise<apiInterface<bannerInterface[]>> = otherServices.getBanners(
    qs.stringify({
      populate: '*'
    })
  );
  const productCategoriesData: Promise<apiInterface<productCategoryInterface[]>> =
    productService.getProductCategories(
      qs.stringify({
        populate: '*'
      })
    );

  const advertisementsData: Promise<apiInterface<advertisementInterface[]>> =
    otherServices.getAdvertisements(qs.stringify({ populate: '*' }));

  const initDiscoverData: Promise<apiInterface<productInterface[]>> = productService.getProducts(
    qs.stringify(
      {
        populate: '*',
        filters: {
          product_categories: {
            name: {
              $contains: 'outdoor furniture for sale'
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

  const initDiscoverDataV2: Promise<apiInterface<productInterface[]>> = productService.getProducts(
    qs.stringify(
      {
        populate: '*',
        filters: {
          product_categories: {
            name: {
              $contains: 'event accessories for sale'
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

  const [heroStatistics, banners, productCategories, initDiscover, initDiscoverV2, advertisements] =
    await Promise.all([
      heroStatisticsData,
      bannersData,
      productCategoriesData,
      initDiscoverData,
      initDiscoverDataV2,
      advertisementsData
    ]);

  return (
    <main className="container h-full w-full flex flex-col gap-8">
      {/* Top */}
      <NavBottomLine />

      {/* <section className="relative w-full">
        <div className="absolute  w-full h-full flex flex-col items-center justify-center z-[1]">
          <h3 className=" text-[32px] leading-[42px] text-center w-full md:text-[60px] font-[700] max-w-[330px] md:max-w-[32rem] md:leading-[64px] mb-4 tracking-tighter">
            Elevate Your <br className="md:hidden" /> Events and Occasions.
          </h3>
          <p className="text-[18px] leading-[20px] font-[600] mb-8 max-w-[300px] text-center">
            Discover Premium Equipment Rentals for Every Occasion.
          </p>
          <Link href={`/${CONSTANTS.ROUTES.products}`}>
            <button className="w-max h-[3rem] px-4 font-sans rounded-[23px] border bg-orange-1 text-white hover:opacity-90 transition-opacity duration-300 ease-in-out font-[500]">
              Browse Products
            </button>
          </Link>
        </div> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-[35vh] md:h-[70vh] rounded-custom overflow-hidden bg-slate-300">
            <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 overflow-hidden before:absolute before:w-full before:h-full before:bg-black-1/50 rounded-custom ">
              <StrapiImage
                src={banners?.data?.[0]?.attributes?.image?.data?.attributes?.url}
                blurDataUrl={
                  banners?.data?.[0]?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url
                }
              />
            </div>

            <CurveCut
              containerClassName="hidden md:block w-[4rem] h-[4rem] top-0 left-[20rem]"
              childClassName="top-0 left-0 rotate-180"
            />
            <CurveCut
              containerClassName=" hidden md:block w-[4rem] h-[4rem] top-[6rem] left-0"
              childClassName="top-0 left-0 rotate-180"
            />
            <BannerLinks
              link={`/products?category=${sluggify(
                banners?.data?.[0]?.attributes?.category?.data?.attributes?.name
              )}`}
            />
            <div className="absolute px-4 py2 md:p-0 bg-gradient-to-t from-transparent to-black-1  md:bg-white md:to-transparent top-0 left-0 w-full md:w-[20rem] md:rounded-br-custom h-[6rem]">
              <h5 className="text-[28px] text-white md:text-black-1 max-w-[85%] md:max-w-full md:text-[32px] font-[700] leading-tight">
                {banners?.data?.[0]?.attributes?.title}
              </h5>
            </div>
          </div>
          <div className="w-full h-[70vh] grid grid-rows-2 gap-4">
            <div className="relative rounded-custom bg-slate-300 overflow-hidden">
              <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 overflow-hidden before:absolute before:w-full before:h-full before:bg-orange-1/20 rounded-custom ">
                <StrapiImage
                  src={banners?.data?.[1]?.attributes?.image?.data?.attributes?.url}
                  blurDataUrl={
                    banners?.data?.[1]?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url
                  }
                />
              </div>
              <div className="absolute bottom-0 px-4 py-2 left-0 bg-gradient-to-b from-transparent to-black-1 w-full pr-[8rem]">
                <h5 className="text-[24px] text-white  md:max-w-[70%] md:text-[28px] font-[700]">
                  {banners?.data?.[1]?.attributes?.title}
                </h5>
              </div>
              <BannerLinks
                link={`/products?category=${sluggify(
                  banners?.data?.[1]?.attributes?.category?.data?.attributes?.name
                )}`}
              />
            </div>
            <div className="relative rounded-custom bg-slate-300 overflow-hidden">
              <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 overflow-hidden before:absolute before:w-full before:h-full before:bg-orange-1/20 rounded-custom ">
                <StrapiImage
                  src={banners?.data?.[2]?.attributes?.image?.data?.attributes?.url}
                  blurDataUrl={
                    banners?.data?.[2]?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url
                  }
                />
              </div>
              <div className="absolute bottom-0 px-4 py-2 left-0 bg-gradient-to-b from-transparent to-black-1 w-full pr-[8rem]">
                <h5 className="text-[24px] text-white md:max-w-[70%] md:text-[28px] font-[700]">
                  {banners?.data?.[2]?.attributes?.title}
                </h5>
              </div>
              <BannerLinks
                link={`/products?category=${sluggify(
                  banners?.data?.[2]?.attributes?.category?.data?.attributes?.name
                )}`}
              />
            </div>
          </div>
        </div> */}
      {/* </section> */}
      <section className="relative w-full flex flex-col gap-16 md:gap-8">
        <div className="grid w-full h-max max-w-full overflow-auto py-1 no-scrollbar">
          <div className="flex py-1 lg:py-0 gap-2 items-center justify-center whitespace-nowrap lg:whitespace-normal lg:flex-wrap">
            {banners?.data?.map((i, idx) => (
              <Link
                className=" border rounded-custom-small px-4 md:px-8 py-1 font-giliran font-[600] hover:bg-orange-1 text-black-1/80 hover:text-white cursor-pointer transition-colors ease-in-out duration-100"
                key={idx}
                href={`/products?category=${sluggify(
                  i?.attributes?.category?.data?.attributes?.name
                )}`}
              >
                {i?.attributes?.title}
              </Link>
            ))}
          </div>
        </div>
        {/* <div className="w-full h-[8rem] md:h-[12rem] bg-white rounded-tl-custom">
          <div className="w-full h-full -mt-[2rem] md:mt-0 grid grid-cols-3 px-4 bg-slate-50 rounded-custom-small">
            {heroStatistics?.data?.map((i, idx) => (
              <div
                key={idx}
                className="grid grid-rows-2 lg:flex  items-center gap-1 md:gap-2 text-black-1/90 font-sans mx-auto my-auto"
              >
                <span className="text-[22px] lg:text-[40px] font-[700] text-center md:text-start">
                  +{i?.attributes.total}
                </span>
                <p className="max-w-[8rem] text-[10px] leading-[12px] md:text-[14px] md:leading-[18px] text-center md:text-start">
                  {i?.attributes?.title}
                </p>
              </div>
            ))}
          </div>
        </div> */}
      </section>

      <section
        className={`relative h-[70vh] w-full container px-container-base lg:px-container-lg overflow-hidden`}
      >
        <div className="absolute top-[20%] text-white md:top-[10%] w-full h-full flex flex-col z-[1]">
          <h3 className=" text-[32px] leading-[42px] w-full md:text-[60px] font-[700] max-w-[330px] md:max-w-[32rem] md:leading-[64px] mb-4 tracking-tighter">
            Elevate Your <br className="md:hidden" /> Events and Occasions.
          </h3>
          <p className="text-[18px] leading-[20px] font-[600] mb-8 max-w-[300px]">
            Discover Premium Equipment Rentals for Every Occasion.
          </p>
          <Link href={`/${CONSTANTS.ROUTES.products}`}>
            <button className="w-max h-[3rem] px-4 font-sans rounded-[23px] border bg-orange-1 text-white hover:opacity-90 transition-opacity duration-300 ease-in-out font-[500]">
              Browse Products
            </button>
          </Link>
        </div>
        <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 overflow-hidden before:absolute before:w-full before:h-full before:bg-orange-1/40 rounded-custom ">
          {/* <Image
            className="w-full h-[calc(100vh-8rem) md:h-full bg-cover bg-center"
            src="https://images.unsplash.com/photo-1665072462642-f51a6b108f9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt=""
            fill={true}
            objectFit="cover"
            objectPosition="left"
            placeholder={`blur`}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          /> */}
          <ProductCarousel items={banners?.data} />
        </div>
        <CurveCut
          containerClassName="hidden md:block w-[20%] h-[8rem] md:h-[12rem] bottom-0 left-0"
          childClassName="bottom-0 right-0"
        />
        <CurveCut
          containerClassName="w-[2rem] h-[2rem] bottom-[8rem] md:bottom-[12rem] right-0"
          childClassName="bottom-0 right-0"
        />
        <CurveCut
          containerClassName="w-[2rem] h-[2rem] bottom-[8rem] md:bottom-[12rem] left-0"
          childClassName="bottom-0 left-0 scale-x-[-1] md:hidden"
        />
        <div className="absolute bottom-0 right-0 px-2 md:px-0  w-full md:w-[80%] h-[8rem] md:h-[12rem] bg-white rounded-tl-custom pt-6 md:pl-6">
          <div className="w-full h-full -mt-[2rem] md:mt-0 grid grid-cols-3 px-4 bg-orange-1 rounded-custom-small">
            {heroStatistics?.data?.map((i, idx) => (
              <div
                key={idx}
                className="grid grid-rows-2 lg:flex  items-center gap-1 md:gap-2 text-white font-sans mx-auto my-auto"
              >
                <span className="text-[22px] lg:text-[40px] font-[700] text-center md:text-start">
                  +{i?.attributes.total}
                </span>
                <p className="max-w-[8rem] text-[10px] leading-[12px] md:text-[14px] md:leading-[18px] text-center md:text-start">
                  {i?.attributes?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ads Section */}
      {advertisements?.data?.length ? (
        <section
          className={`relative h-[40vh] w-full container px-container-base lg:px-container-lg overflow-hidden`}
        >
          <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 overflow-hidden before:absolute before:w-full before:h-full before:bg-orange-1/40 rounded-custom ">
            <AdsCarousel items={advertisements?.data} />
          </div>
        </section>
      ) : (
        <></>
      )}

      {/* Product Range */}
      <section className="relative w-full py-12 px-container-base lg:px-nav-container-lg rounded-custom">
        <div className="w-full flex flex-col ">
          <h4 className="text-center text-[32px] font-[700] mb-4">Product Range</h4>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1rem] font-sans">
            {productCategories?.data?.map((i, idx) => (
              <div
                key={idx}
                className="relative w-full h-[25rem] bg-slate-300 rounded-custom overflow-hidden"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <StrapiImage src={i?.attributes?.image?.data?.attributes?.url} />
                </div>
                <div className="absolute bottom-0 px-4 py-2 left-0 bg-gradient-to-b from-transparent to-black-1 w-full pr-[8rem]">
                  <h5 className="text-[24px] text-white font-giliran md:max-w-[70%] md:text-[28px] font-[700]">
                    {i?.attributes?.name}
                  </h5>
                </div>
                <BannerLinks link={`/products?category=${sluggify(i?.attributes?.name)}`} />
              </div>
            ))}
            <Link href={`/${CONSTANTS.ROUTES.products}`}>
              <div className="relative w-full flex items-center gap-[.5rem] justify-center h-[25rem] bg-slate-50 hover:bg-slate-100 text-black-1/70 hover:text-black-1 transition-colors ease-in-out duration-300 group cursor-pointer  rounded-custom overflow-hidden">
                <span className="text-[20px] font-[600] ">View more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 ease-in-out mt-[2px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Discover */}
      <section className="relative w-full py-12  rounded-custom ">
        <div className="w-full flex flex-col ">
          <h4 className="text-center text-[32px] font-[700] mb-4">
            Discover Outdoor Furniture for Sale
          </h4>
          <Discover tabs={['outdoor furniture for sale']} intitialData={initDiscover} />
        </div>
      </section>

      {/* Discover */}
      {/* <section className="relative w-full py-12  rounded-custom ">
        <div className="w-full flex flex-col ">
          <h4 className="text-center text-[32px] font-[700] mb-4">Event Accesories for Sale</h4>
          <Discover tabs={['event accessories for sale']} intitialData={initDiscoverV2} />
        </div>
      </section> */}

      {/* Commentary */}
      <section className="relative w-full py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-max">
          {(
            [
              {
                icon: (
                  <Image
                    width={170}
                    height={170}
                    src={comm1}
                    objectFit="cover"
                    objectPosition="top"
                    alt=""
                  />
                ),
                description: `At Grand Occasions we take pride in offering you exquisite essential equipment
                for all your occasions. We curate a collection that ensures all your events are up-to-the-mark
                 from kids soft playground equipment to event accessories and tables so you can rest assured that our unbeatable selection will transform your vision into reality.
                `,
                title: 'Unbeatable Selection'
              },
              {
                icon: (
                  <Image
                    width={150}
                    height={150}
                    src={comm2}
                    objectFit="cover"
                    objectPosition="top"
                    alt=""
                  />
                ),
                description: `At Grand Occasions we believe what our clients say about us truly depicts our work and their experience speaks louder than any words.
                `,
                title: 'Client Satisfaction'
              },
              {
                icon: (
                  <Image
                    width={100}
                    height={100}
                    src={comm3}
                    objectFit="cover"
                    objectPosition="top"
                    alt=""
                  />
                ),
                description: `Once you place your order with us count on us for punctual, hassle-free event equipment deliveries that ensure your special occasion runs smoothly every time..

                We off a next-day delivery. Within 12-24 hours. Grand Occasions make your events truly grand.
                `,
                title: 'On Time Delivery'
              }
            ] as { icon: JSX.Element; title: string; description: string }[]
          )?.map((i, idx) => (
            <div
              key={idx}
              className="w-full flex flex-col items-center p-4 rounded-custom h-full bg-orange-1/[0.085]"
            >
              <div className="relative w-full h-[10rem] bg-white rounded-custom grid place-items-center overflow-hidden mb-6">
                {i?.icon}
              </div>
              <h4 className="text-center text-[24px] font-[700] text-black-1 mb-2">{i?.title}</h4>
              <p className="text-center px-4  text-[16px] font-[600] text-black-1/[0.87]">
                {i?.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <Reviews />
    </main>
  );
};

export default page;

const BannerLinks = ({ link }: { link?: string }) => {
  return (
    <Link href={`${link}`}>
      <div className="absolute bottom-0 right-0 h-[6rem] rounded-tl-custom w-[6rem] bg-white pt-5 pl-5">
        <div className="w-full grid place-items-center group h-full rounded-custom bg-orange-1 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="text-white w-6 h-6 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform ease-in-out duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </div>
      </div>
      <CurveCut
        containerClassName="block w-[4rem] h-[4rem] bottom-[6rem] right-0"
        childClassName="bottom-0 right-0 before:shadow-[0_20px_0_0_white]"
      />
      <CurveCut
        containerClassName="block w-[4rem] h-[4rem] bottom-0 right-[6rem]"
        childClassName="bottom-0 right-0 before:shadow-[0_15px_0_0_white]"
      />
    </Link>
  );
};
