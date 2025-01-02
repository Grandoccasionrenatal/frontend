'use client';
import { cn } from '@/lib/utils';
import 'keen-slider/keen-slider.min.css';
import { KeenSliderPlugin, useKeenSlider } from 'keen-slider/react';
import { useEffect, useState } from 'react';

interface ICarousel {
  total?: number;
  totalPages: number;
  perPage?: number;
  currPge?: number;
  onNextPage?: () => void;
  nextPageLoading?: boolean;
  className?: string;
  autoPlay?: boolean;
  spacing?: number;
  loader?: JSX.Element;
  children: React.ReactNode;
}

const MutationPlugin: KeenSliderPlugin = (slider) => {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      slider.update({
        slides: {
          perView: 'auto',
          spacing: 20,
          origin: 'auto'
        }
      });
    });
  });
  const config = { childList: true };
  slider.on('created', () => {
    observer.observe(slider.container, config);
  });
  slider.on('destroyed', () => {
    observer.disconnect();
  });
};

const Carousel = ({
  nextPageLoading,
  onNextPage,
  perPage,
  totalPages,
  total,
  className,
  currPge,
  autoPlay,
  loader,
  spacing = 20,
  children
}: ICarousel) => {
  const [currentSlide, setCurrentSlide] = useState<any>(0);
  const [loaded, setLoaded] = useState<any>(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      detailsChanged: (s) => {},
      mode: 'free-snap',
      slides: {
        perView: 'auto',
        spacing,
        origin: 'auto'
      },
      initial: 0,
      created() {
        setLoaded(true);
      }
    },
    [MutationPlugin]
  );

  const handleNext = () => {
    instanceRef.current?.next();
    if (
      instanceRef?.current?.track?.details?.progress &&
      instanceRef?.current?.track?.details?.progress >= 1
    ) {
      onNextPage?.();
    }
  };

  return (
    <div className={cn('relative pt-6', className)}>
      <div ref={sliderRef} className="keen-slider">
        {children}
        {nextPageLoading &&
          [...Array(perPage)]?.map((_, idx) => (
            <div key={idx + 1000000} className="keen-slider__slide !min-w-max !min-h-max">
              {loader}
            </div>
          ))}
      </div>
      {loaded && instanceRef.current && (
        <>
          <span
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            className="w-[50px] h-[50px] grid place-items-center absolute top-[50%] translate-y-[-50px] cursor-pointer bg-black-1/30 rounded-[50px] hover:bg-black-1/50 active:bg-black-1/30 transition-colors duration-300 ease-in-out left-[5px] text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </span>
          <span
            onClick={(e: any) => e.stopPropagation() || handleNext()}
            className="w-[50px] h-[50px] grid place-items-center absolute top-[50%] translate-y-[-50px] cursor-pointer bg-black-1/30 rounded-[50px]  hover:bg-black-1/50 active:bg-black-1/30 transition-colors duration-300 ease-in-out left-auto right-[5px] text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </>
      )}

      {loaded && instanceRef.current && (
        <div className="absolute top-0 right-0 flex gap-[1px]">
          {[...Array(totalPages)]?.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                `w-[3rem] h-[4px] rounded-[13px]`,
                currPge === idx + 1 ? `bg-black-1/80` : `bg-black-1/40`
              )}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;

const Child = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn(`keen-slider__slide !min-w-max`, className)}>{children}</div>;
};

Carousel.Child = Child;
