// 'use client';
// import CartLink from '@/components/cartLink';
// import { Input } from '@/components/ui/input';
// import React, { useEffect, useState } from 'react';
// import { apiInterface, productCategoryInterface, productInterface } from '@/types/api.types';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import productService from '@/adapters/products';
// import qs from 'qs';
// import { capitalizeText, desluggify, formatPrice } from '@/utils';
// import StrapiImage from '@/components/StrapiImage';
// import CONSTANTS from '@/constant';
// import useCartStore from '@/store/useCartStore';
// import { Skeleton } from '@/components/ui/skeleton';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import { scrollToElement } from '@/components/commonHero';
// import { useDebounce } from 'usehooks-ts';
// import EmptyContentWrapper from '@/components/hocs/EmptyContentWrapper';
// import { productTypeSchemaInterface } from '@/types';
// import { productTypeLabelsMap } from './product-main.data';

// interface IProductMain {
//   categories?: apiInterface<productCategoryInterface[]>;
//   initialData?: apiInterface<productInterface[]>;
// }

// const ProductMain = ({ categories, initialData }: IProductMain) => {
//   const [currFilter, setCurrFilter] = useState<string>('All Items');
//   const [searchFilter, setSearchFilter] = useState('');
//   const [currType, setCurrType] = useState<productTypeSchemaInterface | 'all'>('all');
//   const debouncedSearchFilter = useDebounce<string>(searchFilter, 500);

//   const { addToCart, setOpen } = useCartStore((store) => store);
//   const searchParams = useSearchParams();

//   // ------------ NEW getProducts with EXACT category match & partial search ------------
//   const getProducts = async ({ pageParam = 1 }) => {
//     const page = pageParam;

//     // We'll build the `filters` object dynamically
//     const filters: any = {};

//     // 1) If user typed something into search, use partial match on product name:
//     if (debouncedSearchFilter) {
//       filters.name = { $containsi: debouncedSearchFilter };
//     }
//     // 2) Else if user selected a category that isn't "All Items", do exact match on product_categories.name:
//     else if (currFilter !== 'All Items') {
//       filters.product_categories = {
//         name: { $eq: currFilter },
//       };
//     }
//     // 3) Otherwise ("All Items"), no category-based filtering needed
//     //    (just fetch all items — optionally we can skip adding anything here)

//     // -- Always filter by "is_available = true"
//     filters.is_available = { $eq: true };

//     // -- Also handle "for" (hire or sale) if not "all"
//     if (currType !== 'all') {
//       filters.for = { $eq: currType };
//     }

//     // Final query
//     const queryString = qs.stringify(
//       {
//         populate: '*',
//         filters,
//         pagination: {
//           page,
//           pageSize: 6,
//           withCount: true
//         }
//       },
//       {
//         encodeValuesOnly: true
//       }
//     );

//     return productService.getProducts(queryString);
//   };
//   // -----------------------------------------------------------------------------------

//   const {
//     data: products,
//     isFetching,
//     isFetchingNextPage,
//     fetchNextPage,
//     hasNextPage
//   } = useInfiniteQuery<any, any, apiInterface<productInterface[]>>({
//     queryKey: ['get-products', currFilter, debouncedSearchFilter, currType],
//     queryFn: getProducts,
//     getNextPageParam: (lastPageRes) => {
//       const lastPage = lastPageRes as apiInterface<productInterface[]>;
//       const res =
//         lastPage?.meta?.pagination?.pageCount > lastPage?.meta?.pagination.page
//           ? lastPage?.meta?.pagination.page + 1
//           : undefined;
//       return res;
//     },
//     initialData: {
//       pages: [initialData],
//       pageParams: [null]
//     },
//     cacheTime: 0
//   });

//   useEffect(() => {
//     const category = searchParams.get('category');
//     const search = searchParams.get('search');
//     const type = searchParams.get('type');

//     if (type) {
//       setSearchFilter('');
//       setCurrFilter('All Items');
//       setCurrType(type as productTypeSchemaInterface);
//       scrollToElement('browse');
//     }

//     if (category) {
//       setSearchFilter('');
//       setCurrFilter(desluggify(category));
//       scrollToElement('browse');
//     }

//     if (search) {
//       setSearchFilter(desluggify(search));
//       scrollToElement('browse');
//     }
//   }, [searchParams]);

//   return (
//     <div className="w-full flex flex-col gap-4">
//       <h4 className="text-center text-[24px] md:text-[32px] font-[700] mb-4">
//         Browse Products - {productTypeLabelsMap[currType]}
//       </h4>
//       <div className="w-full flex flex-col lg:flex-row gap-8 font-sans relative">
//         {/* Left column (Search & Category filters) */}
//         <div className="w-full lg:max-w-[18rem] mx-auto flex-col">
//           <h5 className="hidden lg:flex mb-1 font-[600]  text-black-1/[0.87] text-[14px]">
//             Search
//           </h5>
//           <div className="w-full  mb-4 flex items-center relative">
//             <Input
//               value={searchFilter}
//               onChange={(e) => setSearchFilter(e?.target?.value)}
//               placeholder="Search For Products..."
//               className="text-[14px] placeholder:!text-[14px] placeholder:text-black-1"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-4 h-4 text-black-1/50 absolute right-2"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//               />
//             </svg>
//           </div>

//           <h5 className="hidden lg:flex mb-1 font-[600] text-black-1/[0.87] text-[14px]">
//             Categories
//           </h5>
//           <div className="w-full h-max max-w-full overflow-auto py-1 no-scrollbar">
//             <div className="flex py-1 lg:py-0 gap-2 items-center whitespace-nowrap lg:whitespace-normal lg:flex-wrap">
//               {/* "All Items" pill */}
//               <Link href={`${CONSTANTS.ROUTES.products}?type=${currType}`}>
//                 <div
//                   onClick={() => setCurrFilter('All Items')}
//                   className={`px-4 py-1 font-sans w-full text-[12px] lg:text-[14px] rounded-custom bg-white border border-input
//                     cursor-pointer hover:border-black-1 hover:bg-black-1 hover:text-white ${
//                       currFilter === 'All Items' ? '!bg-black-1 text-white' : ''
//                     } transition-colors ease-in-out duration-300`}
//                 >
//                   All Items
//                 </div>
//               </Link>

//               {/* Dynamic categories */}
//               {categories?.data?.map((cat, idx) => (
//                 <Link
//                   key={idx}
//                   href={`${CONSTANTS.ROUTES.products}?category=${cat?.attributes?.name
//                     ?.toLowerCase()
//                     ?.replaceAll(' ', '-')}&type=${currType}`}
//                 >
//                   <div
//                     className={`px-4 py-1 font-sans w-full text-[12px] lg:text-[14px] rounded-custom bg-white border border-input
//                       cursor-pointer hover:border-black-1 hover:bg-black-1 hover:text-white ${
//                         currFilter.toLowerCase() === cat?.attributes?.name?.toLowerCase()
//                           ? '!bg-black-1 text-white'
//                           : ''
//                       }
//                       transition-colors ease-in-out duration-300`}
//                   >
//                     {capitalizeText(cat?.attributes?.name, 'allWords')}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right column (Products) */}
//         <div className="flex-grow flex flex-col gap-8">
//           <EmptyContentWrapper isEmpty={!isFetching && !products?.pages[0]?.data?.length}>
//             <div className="max-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1rem]">
//               {isFetching && !isFetchingNextPage
//                 ? [...Array(6)].map((_, idx) => (
//                     <Skeleton key={idx} className="h-[20rem] relative !rounded-custom">
//                       <CartLink className=" bg-white  before:absolute before:w-full before:h-full before:bg-[#e19e000d]" />
//                     </Skeleton>
//                   ))
//                 : products?.pages?.map((page) => (
//                     <React.Fragment key={page.meta?.pagination.page}>
//                       {page.data.map((p, pIdx) => (
//                         <div
//                           key={pIdx}
//                           className={`relative group cursor-pointer w-full h-[20rem] bg-slate-300 rounded-custom overflow-hidden ${
//                             p?.attributes?.is_available ? '' : 'hidden'
//                           }`}
//                         >
//                           <div className="relative h-full w-full overflow-hidden">
//                             <StrapiImage 
                            
//                             src={`${p?.attributes?.images?.data?.[0]?.attributes?.url}`}
//                             />
//                           </div>

//                           {/* On hover "View" button */}
//                           <Link href={`/${CONSTANTS.ROUTES.products}/${p?.id}`}>
//                             <div className="absolute md:opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 top-4 left-4 w-max text-white font-sans text-[14px] h-[2.5rem] grid place-items-center px-4 rounded-custom border border-white font-bold bg-black-1/50 hover:bg-black-1/30">
//                               View
//                             </div>
//                           </Link>

//                           {/* Product info */}
//                           <div className="absolute flex flex-col gap-1 bottom-0 px-4 py-2 pt-8 left-0 bg-gradient-to-b from-transparent to-black-1 text-white w-full pr-[6rem] lg:pr-[8rem]">
//                             <h6 className="text-[16px] lg:text-[18px] font-giliran font-[700]">
//                               {p?.attributes?.name} ({p?.attributes?.for})
//                             </h6>
//                             <span className="text-[12px] md:text-[14px]">Starts from</span>
//                             <h4>
//                               {CONSTANTS.CURRENCY}
//                               {formatPrice(p?.attributes?.price_per_day)}{' '}
//                               {p?.attributes?.excl_vat ? <span>(Excl VAT)</span> : null}
//                             </h4>
//                           </div>

//                           {/* Cart link button */}
//                           <CartLink
//                             onClick={() => {
//                               addToCart({ product: p, quantity: 1 });
//                               setOpen(true);
//                             }}
//                             className=" bg-white  before:absolute before:w-full before:h-full before:bg-[#e19e000d]"
//                           />
//                         </div>
//                       ))}
//                     </React.Fragment>
//                   ))}
//             </div>
//           </EmptyContentWrapper>

//           {/* "Load More" button if there are more pages */}
//           <button
//             onClick={() => fetchNextPage()}
//             disabled={!hasNextPage || isFetchingNextPage}
//             className={`w-full ${
//               !hasNextPage ? 'hidden' : 'flex'
//             } justify-center items-center h-[4rem] border border-slate-300 cursor-pointer rounded-custom hover:bg-slate-50 transition-colors ease-in-out duration-300`}
//           >
//             <span className="font-sans text-[13px]">
//               {isFetchingNextPage ? 'LOADING MORE...' : 'VIEW MORE'}
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductMain;
'use client';
import CartLink from '@/components/cartLink';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { apiInterface, productCategoryInterface, productInterface } from '@/types/api.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import productService from '@/adapters/products';
import qs from 'qs';
import { capitalizeText, desluggify, formatPrice } from '@/utils';
import StrapiImage from '@/components/StrapiImage';
import CONSTANTS from '@/constant';
import useCartStore from '@/store/useCartStore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { scrollToElement } from '@/components/commonHero';
import { useDebounce } from 'usehooks-ts';
import EmptyContentWrapper from '@/components/hocs/EmptyContentWrapper';
import { productTypeSchemaInterface } from '@/types';
import { productTypeLabelsMap } from './product-main.data';

interface IProductMain {
  categories?: apiInterface<productCategoryInterface[]>;
  initialData?: apiInterface<productInterface[]>;
}

const ProductMain = ({ categories, initialData }: IProductMain) => {
  const [currFilter, setCurrFilter] = useState<string>('All Items');
  const [searchFilter, setSearchFilter] = useState('');
  const [currType, setCurrType] = useState<productTypeSchemaInterface | 'all'>('all');
  
  // For debouncing the search input (prevents too many requests)
  const debouncedSearchFilter = useDebounce<string>(searchFilter, 500);

  const { addToCart, setOpen } = useCartStore((store) => store);
  const searchParams = useSearchParams();

  // ----------------- getProducts with CASE-INSENSITIVE logic -----------------
  const getProducts = async ({ pageParam = 1 }) => {
    const page = pageParam;

    // Build up our filters object
    const filters: any = {};

    // 1) If user typed a search string, do a case-insensitive partial match on product name
    if (debouncedSearchFilter) {
      filters.name = { $containsi: debouncedSearchFilter };
    }
    // 2) Otherwise, if the user picked a category (and not "All Items"), do exact (but case-insensitive) match
    else if (currFilter !== 'All Items') {
      filters.product_categories = {
        name: { $eqi: currFilter },
      };
    }
    // 3) Always ensure is_available = true
    filters.is_available = { $eq: true };

    // 4) If user picked a product type (rent/sale), do a case-insensitive exact match on `for`
    if (currType !== 'all') {
      filters.for = { $eqi: currType };
    }

    const queryString = qs.stringify(
      {
        populate: '*',
        filters,
        pagination: {
          page,
          pageSize: 6,
          withCount: true
        }
      },
      {
        encodeValuesOnly: true
      }
    );

    return productService.getProducts(queryString);
  };
  // ---------------------------------------------------------------------------

  const {
    data: products,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<any, any, apiInterface<productInterface[]>>({
    queryKey: ['get-products', currFilter, debouncedSearchFilter, currType],
    queryFn: getProducts,
    getNextPageParam: (lastPageRes) => {
      const lastPage = lastPageRes as apiInterface<productInterface[]>;
      const res =
        lastPage?.meta?.pagination?.pageCount > lastPage?.meta?.pagination.page
          ? lastPage?.meta?.pagination.page + 1
          : undefined;
      return res;
    },
    initialData: {
      pages: [initialData],
      pageParams: [null]
    },
    cacheTime: 0
  });

  // Watch for changes to query params (e.g., user clicks a category or changes the product type)
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const type = searchParams.get('type');

    if (type) {
      setSearchFilter('');
      setCurrFilter('All Items');
      setCurrType(type as productTypeSchemaInterface);
      scrollToElement('browse');
    }

    if (category) {
      setSearchFilter('');
      setCurrFilter(desluggify(category));
      scrollToElement('browse');
    }

    if (search) {
      setSearchFilter(desluggify(search));
      scrollToElement('browse');
    }
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col gap-4">
      <h4 className="text-center text-[24px] md:text-[32px] font-[700] mb-4">
        Browse Products - {productTypeLabelsMap[currType]}
      </h4>

      <div className="w-full flex flex-col lg:flex-row gap-8 font-sans relative">
        {/* LEFT COLUMN: search + category pills */}
        <div className="w-full lg:max-w-[18rem] mx-auto flex-col">
          <h5 className="hidden lg:flex mb-1 font-[600] text-black-1/[0.87] text-[14px]">
            Search
          </h5>
          <div className="w-full mb-4 flex items-center relative">
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search For Products..."
              className="text-[14px] placeholder:!text-[14px] placeholder:text-black-1"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-black-1/50 absolute right-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          <h5 className="hidden lg:flex mb-1 font-[600] text-black-1/[0.87] text-[14px]">
            Categories
          </h5>
          <div className="w-full h-max max-w-full overflow-auto py-1 no-scrollbar">
            <div className="flex py-1 lg:py-0 gap-2 items-center whitespace-nowrap lg:whitespace-normal lg:flex-wrap">
              {/* Pill for "All Items" */}
              <Link href={`${CONSTANTS.ROUTES.products}?type=${currType}`}>
                <div
                  onClick={() => setCurrFilter('All Items')}
                  className={`px-4 py-1 font-sans w-full text-[12px] lg:text-[14px] rounded-custom bg-white border border-input cursor-pointer
                    hover:border-black-1 hover:bg-black-1 hover:text-white ${
                      currFilter === 'All Items' ? '!bg-black-1 text-white' : ''
                    }
                    transition-colors ease-in-out duration-300
                  `}
                >
                  All Items
                </div>
              </Link>

              {categories?.data?.map((cat, idx) => {
                const catName = cat?.attributes?.name || '';
                return (
                  <Link
                    key={idx}
                    href={`${CONSTANTS.ROUTES.products}?category=${catName
                      .toLowerCase()
                      .replaceAll(' ', '-')}&type=${currType}`}
                  >
                    <div
                      className={`
                        px-4 py-1 font-sans w-full text-[12px] lg:text-[14px]
                        rounded-custom bg-white border border-input cursor-pointer
                        hover:border-black-1 hover:bg-black-1 hover:text-white
                        ${
                          currFilter.toLowerCase() === catName.toLowerCase()
                            ? '!bg-black-1 text-white'
                            : ''
                        }
                        transition-colors ease-in-out duration-300
                      `}
                    >
                      {capitalizeText(catName, 'allWords')}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: product listings */}
        <div className="flex-grow flex flex-col gap-8">
          <EmptyContentWrapper isEmpty={!isFetching && !products?.pages[0]?.data?.length}>
            <div className="max-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1rem]">
              {isFetching && !isFetchingNextPage
                ? [...Array(6)].map((_, idx) => (
                    <Skeleton key={idx} className="h-[20rem] relative !rounded-custom">
                      <CartLink className="bg-white before:absolute before:w-full before:h-full before:bg-[#e19e000d]" />
                    </Skeleton>
                  ))
                : products?.pages?.map((page) => (
                    <React.Fragment key={page.meta?.pagination.page}>
                      {page.data.map((product, pIdx) => {
                        const attr = product?.attributes;
                        if (!attr?.is_available) return null; // or hidden

                        return (
                          <div
                            key={pIdx}
                            className="relative group cursor-pointer w-full h-[20rem] bg-slate-300 rounded-custom overflow-hidden"
                          >
                            <div className="relative w-full h-full overflow-hidden">
                              <StrapiImage src={`${attr?.images?.data?.[0]?.attributes?.url}`} />
                            </div>
                            {/* "View" Button on Hover */}
                            <Link href={`/${CONSTANTS.ROUTES.products}/${product.id}`}>
                              <div
                                className="absolute md:opacity-0 group-hover:opacity-100
                                  transition-all ease-in-out duration-300 top-4 left-4 w-max
                                  text-white font-sans text-[14px] h-[2.5rem] grid place-items-center
                                  px-4 rounded-custom border border-white font-bold
                                  bg-black-1/50 hover:bg-black-1/30
                                "
                              >
                                View
                              </div>
                            </Link>
                            {/* Product Info */}
                            <div
                              className="absolute flex flex-col gap-1 bottom-0 px-4 py-2 pt-8 left-0
                                bg-gradient-to-b from-transparent to-black-1 text-white w-full
                                pr-[6rem] lg:pr-[8rem]
                              "
                            >
                              <h6 className="text-[16px] lg:text-[18px] font-giliran font-[700]">
                                {attr?.name} ({attr?.for})
                              </h6>
                              <span className="text-[12px] md:text-[14px]">Starts from</span>
                              <h4>
                                {CONSTANTS.CURRENCY}
                                {formatPrice(attr?.price_per_day)}{' '}
                                {attr?.excl_vat && <span>(Excl VAT)</span>}
                              </h4>
                            </div>
                            {/* Cart button */}
                            <CartLink
                              onClick={() => {
                                addToCart({ product, quantity: 1 });
                                setOpen(true);
                              }}
                              className="bg-white before:absolute before:w-full before:h-full before:bg-[#e19e000d]"
                            />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
            </div>
          </EmptyContentWrapper>

          {/* "Load More" Button if more pages exist */}
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className={`w-full ${
              !hasNextPage ? 'hidden' : 'flex'
            } justify-center items-center h-[4rem] border border-slate-300 cursor-pointer rounded-custom hover:bg-slate-50 transition-colors ease-in-out duration-300`}
          >
            <span className="font-sans text-[13px]">
              {isFetchingNextPage ? 'LOADING MORE...' : 'VIEW MORE'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductMain;
