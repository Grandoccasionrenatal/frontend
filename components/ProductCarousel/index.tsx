'use client';
import { bannerInterface } from '@/types/api.types';
import React, { useEffect, useState } from 'react';
import CurveCut from '../animations/CurveCut';
import StrapiImage from '../StrapiImage';
import { cn } from '@/lib/utils';
import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';
import { sluggify } from '@/utils';

interface IProductCarousel {
  items: bannerInterface[];
}

const ProductCarousel = ({ items }: IProductCarousel) => {
  const [currentSlide, setCurrentSlide] = useState<any>(0);
  const [loaded, setLoaded] = useState<any>(false);

  const sliderOptions: KeenSliderOptions = {
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    mode: 'snap',
    slides: {
      perView: 1,
      spacing: 20,
      origin: 'auto'
    },
    initial: 0,
    created() {
      setLoaded(true);
    }
  };

  const [sliderRef, instanceRef] = useKeenSlider(sliderOptions, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;

      function clearNextTimeout() {
        clearTimeout(timeout);
      }

      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider?.next();
        }, 3000);
      }

      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on('dragStarted', clearNextTimeout);
      slider.on('animationEnded', nextTimeout);
      slider.on('updated', nextTimeout);
    }
  ]);

  useEffect(() => {
    instanceRef.current?.update({
      ...sliderOptions
    });
  }, [instanceRef, sliderOptions]);

  return (
    <div className="w-full relative h-full bg-slate-100 rounded-custom overflow-hidden">
      <div ref={sliderRef} className={cn('keen-slider h-full')}>
        {items?.map((i, idx) => (
          <div
            // href={`/products?category=${sluggify(i?.attributes?.category?.data?.attributes?.name)}`}
            key={idx}
            className={cn(`keen-slider__slide`, `w-full h-full relative`)}
          >
            <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 overflow-hidden after:absolute after:w-full after:h-full after:bg-black-1/25 rounded-custom ">
              <StrapiImage
                src={i?.attributes?.image?.data?.attributes?.url}
                blurDataUrl={i?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url}
              />
            </div>
            {/* <div className="absolute px-8 py-8 bg-gradient-to-b from-transparent to-black-1   bottom-0 left-0 w-full  md:rounded-br-custom">
              <h5 className="text-[28px] text-white  max-w-[400px] md:text-[32px] font-[700] leading-tight">
                {i?.attributes?.title}
              </h5>
            </div> */}
          </div>
        ))}
      </div>
      {loaded && instanceRef.current && (
        <>
          <span
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            className="w-[20px] md:w-[40px] h-[20px] md:h-[40px] grid place-items-center absolute top-[50%] translate-y-[-50px] cursor-pointer bg-black-1/30 rounded-[50px] hover:bg-black-1/50 active:bg-black-1/30 transition-colors duration-300 ease-in-out left-2  md:left-[20px] text-white z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 md:w-4 h-3 md:h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </span>
          <span
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            className="w-[20px] md:w-[40px] h-[20px] md:h-[40px] grid place-items-center absolute top-[50%] translate-y-[-50px] cursor-pointer bg-black-1/30 rounded-[50px]  hover:bg-black-1/50 active:bg-black-1/30 transition-colors duration-300 ease-in-out left-auto right-2 md:right-[20px] text-white z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 md:w-4 h-3 md:h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </>
      )}
      {/* <div className="hidden md:block absolute bottom-0 right-0  h-[4rem] w-[15rem]  rounded-tl-custom bg-white pl-4 pt-4 pr-2 pb-2">
        <div className="w-full h-full grid place-items-center  border  rounded-custom-small"></div>
      </div>
      <div className="absolute top-0 left-0 h-[4rem] w-[15rem] rounded-br-custom bg-white pl-2 pt-2 pr-2 pb-4">
        <div className="w-full h-full grid place-items-center  border  rounded-custom-small"></div>
      </div>
      <CurveCut
        containerClassName="hidden md:block w-[15rem]  h-[1rem] bottom-[4rem] right-0"
        childClassName="bottom-0 right-0 after:shadow-[0_16px_0_0_white]"
      />
      <CurveCut
        containerClassName="hidden md:block w-[15rem]  h-[2rem] right-[15rem]  bottom-0"
        childClassName="bottom-0 right-0  "
      />
      <CurveCut
        containerClassName="w-[15rem]  h-[2rem] top-0 left-[15rem]"
        childClassName="top-0 left-0 rotate-180"
      />
      <CurveCut
        containerClassName=" w-[15rem] h-[2rem] top-[4rem] left-0"
        childClassName="top-0 left-0 rotate-180  after:shadow-[0_16px_0_0_white]"
      /> */}
    </div>
  );
};

export default ProductCarousel;
