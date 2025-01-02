'use client';

import otherServices from '@/adapters/others';
import { cn } from '@/lib/utils';
import { advertisementInterface, apiInterface, reviewInterface } from '@/types/api.types';
import { useKeenSlider } from 'keen-slider/react';
import qs from 'qs';
import { useState } from 'react';

const Reviews = () => {
  const [currentSlide, setCurrentSlide] = useState<any>(0);
  const [reviews, setReviews] = useState<reviewInterface[]>([]);
  const [loaded, setLoaded] = useState<any>(false);

  const reviewsData: Promise<apiInterface<reviewInterface[]>> = otherServices.getReviews();

  reviewsData.then((res) => {
    console.log(res.data);

    setReviews(res.data);
  });



  const [sliderRef, instanceRef] = useKeenSlider(
    {
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
    },
    [
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
          }, 5000);
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
    ]
  );

  return (
    <section className="container relative w-full py-12 bg-slate-100 rounded-custom">
      <div className="relative max-h-[400px]">
        <div ref={sliderRef} className="keen-slider">
          {/* {(
            [
              {
                name: `Sarah and Michael`,
                review: `The team at Grand Occasions turned our daughter’s first birthday into a reality. The equipment they provided was of top-notch quality and they paid attention to details`
              },
              {
                name: `Damilola Afolabi`,
                review: `As an event planner, we have worked with many companies but Grand Occasions goes above and beyond to satisfy their customers. They have exceptional service and the selection of equipment is unmatchable. `
              }
            ] as { name: string; review: string }[]
          ) ?.map((i, idx) => ( */}
          {reviews?.map((i, idx) => ( 
            <div key={i?.id} className={cn(`keen-slider__slide`, `w-full`)}>
              <div className="w-full flex flex-col gap-[2rem] items-center justify-center min-h-[30vh] overflow-hidden">
                <svg
                  height="64px"
                  width="64px"
                  version="1.1"
                  id="_x32_"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  fill="#FF9E00"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <style type="text/css"> </style>{' '}
                    <g>
                      {' '}
                      <path
                        className="st0"
                        d="M148.57,63.619H72.162C32.31,63.619,0,95.929,0,135.781v76.408c0,39.852,32.31,72.161,72.162,72.161h7.559 c6.338,0,12.275,3.128,15.87,8.362c3.579,5.234,4.365,11.898,2.074,17.811L54.568,422.208c-2.291,5.92-1.505,12.584,2.074,17.81 c3.595,5.234,9.532,8.362,15.87,8.362h50.738c7.157,0,13.73-3.981,17.041-10.318l61.257-117.03 c12.609-24.09,19.198-50.881,19.198-78.072v-107.18C220.748,95.929,188.422,63.619,148.57,63.619z"
                      />{' '}
                      <path
                        className="st0"
                        d="M439.84,63.619h-76.41c-39.852,0-72.16,32.31-72.16,72.162v76.408c0,39.852,32.309,72.161,72.16,72.161h7.543 c6.338,0,12.291,3.128,15.87,8.362c3.596,5.234,4.365,11.898,2.091,17.811l-43.113,111.686c-2.291,5.92-1.505,12.584,2.09,17.81 c3.579,5.234,9.516,8.362,15.871,8.362h50.722c7.157,0,13.73-3.981,17.058-10.318l61.24-117.03 C505.411,296.942,512,270.152,512,242.96v-107.18C512,95.929,479.691,63.619,439.84,63.619z"
                      />{' '}
                    </g>{' '}
                  </g>
                </svg>
                <p className="max-w-[40rem] font-[600] text-center">{i?.attributes?.review}</p>
                <div className="flex items-center gap-2">
                  {/* <div className="w-[60px] relative h-[60px] overflow-hidden rounded-[50px]">
                  <Image
                    placeholder={`blur`}
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    fill={true}
                    alt=""
                    className="w-full h-auto bg-center bg-contain"
                    src="https://i0.wp.com/africavarsities.com/wp-content/uploads/2019/07/Hamamat-photo.jpg?resize=713%2C983&ssl=1"
                  />
                </div> */}
                  <div className="flex flex-col items-center">
                    <span className="font-[700] text-[18px]">{i?.attributes?.name}</span>
                    <div className="flex items-center gap-[4px]">
                      {[...Array(5)]?.map((i, idx) => (
                        <svg
                          key={idx}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentcolor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-orange-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loaded && instanceRef.current && (
          <>
            <span
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
              className="w-[50px] h-[50px] grid place-items-center absolute top-[100%] sm:top-[50%] translate-y-[-50px] cursor-pointer bg-black-1/30 rounded-[50px] hover:bg-black-1/50 active:bg-black-1/30 transition-colors duration-300 ease-in-out left-2  md:left-[20px] text-white"
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </span>
            <span
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
              className="w-[50px] h-[50px] grid place-items-center absolute top-[100%] sm:top-[50%] translate-y-[-50px] cursor-pointer bg-black-1/30 rounded-[50px]  hover:bg-black-1/50 active:bg-black-1/30 transition-colors duration-300 ease-in-out left-auto right-2 md:right-[20px] text-white"
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
      </div>
    </section>
  );
};

export default Reviews;
