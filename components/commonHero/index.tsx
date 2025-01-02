'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import CurveCut from '../animations/CurveCut';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/shimmer';

interface ICommonHero {
  className?: string;
  tag: string;
  title: string;
  description: string;
  linkedSection: string;
  image: string;
}
export const scrollToElement = (i: string) => {
  const element = document.getElementById(i);
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
};

const CommonHero = ({ className, tag, description, linkedSection, title, image }: ICommonHero) => {
  return (
    <div className={cn('relative w-full h-[60vh] rounded-custom overflow-hidden', className)}>
      <div className="absolute w-full h-full before:absolute before:w-full before:h-full before:bg-orange-1/20 ">
        <Image
          placeholder={`blur`}
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          fill={true}
          objectFit="cover"
          objectPosition="center"
          src={image}
          alt=""
          className="w-full h-[80vh] bg-center bg-cover "
        />
      </div>
      <div className="relative px-2  w-full h-full flex flex-col mt-[7rem] items-center gap-4">
        <h2 className="text-[32px] md:text-[40px] text-center font-[700] leading-[26px]">
          {title}
        </h2>
        <p className="text-[14px] md:text-[16px] text-center max-w-[40rem] font-[600]">
          {description}
        </p>
      </div>
      <div className="absolute bottom-0 right-0 h-[4rem] w-[15rem] md:w-[20rem] rounded-tl-custom bg-white pl-4 pt-4 pr-2 pb-2">
        <div className="w-full h-full grid place-items-center  border border-black-1 rounded-custom-small">
          <span className="text-[12px] md:text-[14px]">{tag}</span>
        </div>
      </div>
      <CurveCut
        containerClassName="w-[15rem] md:w-[20rem] h-[1rem] bottom-[4rem] right-0"
        childClassName="bottom-0 right-0 before:shadow-[0_16px_0_0_white]"
      />
      <CurveCut
        containerClassName="w-[15rem] md:w-[20rem] h-[2rem] right-[15rem] md:right-[20rem] bottom-0"
        childClassName="bottom-0 right-0  "
      />
      <div
        onClick={() => scrollToElement(linkedSection)}
        className="absolute bottom-20 animate-bounce cursor-pointer lg:bottom-4 left-[50%] translate-x-[-50%]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 hover:text-orange-1 transition-colors ease-in-out duration-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default CommonHero;
