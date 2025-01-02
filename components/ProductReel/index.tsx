'use client';
import React, { useState } from 'react';
import StrapiImage from '../StrapiImage';
import { strapiImageInterfaceimageMultiMedia } from '@/types/api.types';
import { cn } from '@/lib/utils';
import { useInterval } from 'usehooks-ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

interface IProductReel {
  images?: strapiImageInterfaceimageMultiMedia;
}

const ProductReel = ({ images }: IProductReel) => {
  const [currImage, setCurrImage] = useState(0);
  const [isPlaying, setPlaying] = useState<boolean>(true);
  const [expandOpen, setExpandOpen] = useState(false);

  useInterval(
    () => {
      if (images && currImage === images?.data.length - 1) {
        setCurrImage(0);
      } else {
        setCurrImage((prev) => prev + 1);
      }
    },
    isPlaying ? 3000 : null
  );

  return (
    <>
      <Dialog open={expandOpen} onOpenChange={setExpandOpen}>
        <DialogContent
          onMouseEnter={() => {
            setPlaying(false);
          }}
          onMouseLeave={() => setPlaying(true)}
          className="!w-full min-h-full h-full md:h-[70vh] md:max-w-[600px]"
        >
          <div className="w-full h-full relative">
            <StrapiImage
              className="!bg-contain"
              objectFit="contain"
              src={`${images?.data?.[currImage]?.attributes?.url}`}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div
        onMouseEnter={() => {
          setPlaying(false);
        }}
        onMouseLeave={() => setPlaying(true)}
        className="relative w-full h-full flex flex-col gap-6 md:gap-12"
      >
        <div className="bg-transparent min-h-[15rem] md:min-h-[25rem] flex-grow h-full w-full max-w-[34rem] relative mx-auto overflow-hidden rounded-custom">
          <div
            onClick={() => setExpandOpen(true)}
            className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-[50px] bg-white hover:bg-white/80 transition-colors ease-in-out duration-300 z-[5] cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </div>
          <StrapiImage src={`${images?.data?.[currImage]?.attributes?.url}`} />
        </div>
        <div className="h-[8rem] overflow-x-auto max-w-full">
          <div className="flex gap-4 justify-center h-full">
            {images?.data?.map((i, idx) => (
              <div
                onClick={() => setCurrImage(idx)}
                key={idx}
                className={cn(
                  'relative overflow-hidden cursor-pointer w-[6rem] min-w-[6rem] border border-transparent hover:border-orange-1 transition-colors ease-in-out duration-300 h-[6rem] rounded-custom bg-slate-100',
                  i?.attributes?.url === images?.data?.[currImage]?.attributes?.url
                    ? `border-orange-1`
                    : ``
                )}
              >
                <StrapiImage
                  src={`${i?.attributes?.url}`}
                  className="hover:scale-105 transition-transform ease-in-out duration-300 "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductReel;
