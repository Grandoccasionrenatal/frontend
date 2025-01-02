'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Search from '../search';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useScreen } from 'usehooks-ts';
import { useScroll } from '@/hooks/useScroll';
import { usePathname } from 'next/navigation';
import { navItems } from './nav.data';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { useQuery } from '@tanstack/react-query';
import productService from '@/adapters/products';
import qs from 'qs';
import { apiInterface, productCategoryInterface } from '@/types/api.types';
import { Skeleton } from '../ui/skeleton';
import { capitalizeText, getUserDistanceOffsetInKm, sluggify } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import Login from '../Login';
import SignUp from '../SignUp';
import Logout from '../Logout';
import useAuthStore from '@/store/useAuthStore';
import CONSTANTS from '@/constant';
import HeroTitle from '../HeroTitle';

const Menu = dynamic(() => import('../menu'), { ssr: false });
const Cart = dynamic(() => import('../cart'), { ssr: false });
const ProfileDrop = dynamic(() => import('../ProfileDrop'), { ssr: false });

const Nav = () => {
  const pathname = usePathname();
  const { scrollY, setScrollY, scrollDirection } = useScroll();
  const [navWithBg, setNavWithBg] = useState(false);
  const screen = useScreen();

  const { setLoginOpen, setSignUpOpen, loginOpen, signUpOpen, setLogoutOpen, logoutOpen } =
    useAuthStore((store) => store);

  const navWithBgFn = useCallback(() => {
    const res = scrollY > 100;
    setNavWithBg(res);
  }, [screen?.height, scrollY, pathname]);

  const hidden = useMemo(() => {
    const res = false;
    return res;
  }, [scrollY, screen?.height]);

  const { data, isLoading } = useQuery<any, any, apiInterface<productCategoryInterface[]>>({
    queryKey: ['fetch-nav-categories'],
    queryFn: () =>
      productService.getProductCategories(
        qs.stringify({
          populate: '*'
        })
      ),
    onError: (err) => {
      console.log('error: error fetching nav categories ');
    }
  });

  useEffect(() => {
    navWithBgFn();
  }, [navWithBgFn]);

  useEffect(() => {
    setScrollY(0);
    setNavWithBg(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`w-full container fixed px-nav-container-base lg:px-nav-container-lg  py-2 sm:py-4
      top-0 right-0 left-0 h-[4rem] transition-all duration-300 ease-in-out z-10 
      `}
      >
        <div
          className={`w-full flex justify-between items-center py-2 sm:py-4 px-2
        ${hidden ? `-translate-y-[1000px] opacity-0` : `translate-y-0 opacity-100`}
        ${navWithBg ? `bg-white/20 backdrop-blur rounded-custom` : `bg-transparent`}
        transition-all duration-500 ease-in-out `}
        >
          <div className="flex items-center gap-20 lg:gap-x-48 ">

            <HeroTitle/>
            {/* <Link href={`/`}>
              <h3 className="text-[22px] sm:text-[32px] leading-[40px] font-giliran font-[700] ">
                Grand Occasion <span className="text-[16px] font-sans text-start"> ™ </span>
              </h3>
            </Link> */}
            <ul className="items-center gap-12 hidden xm:flex">
              {navItems?.map((i, idx) => (
                <li key={idx} className={`font-[600] `}>
                  {i?.title === 'Products' ? (
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem className="bg-transparent hover:bg-transparent group-hover:bg-transparent focus:bg-transparent group-focus:bg-transparent">
                          <NavigationMenuTrigger className="p-0 m-0 h-full bg-transparent hover:bg-transparent group-hover:bg-transparent focus:bg-transparent group-focus:bg-transparent leading-normal">
                            <Link
                              href={`/${i?.link}`}
                              key={idx}
                              className="flex flex-row h-max items-center gap-1 relative group w-max overflow-x-hidden"
                            >
                              <span className="font-[600] text-[16px]">{i?.title}</span>
                              <span
                                className={`absolute bottom-0  ${
                                  pathname === `/${i?.link}` ? `translate-x-0` : `-translate-x-full`
                                } group-hover:!translate-x-0 transition-transform duration-300 ease-in-out rounded-sm right-0 h-[2px] w-full bg-orange-1`}
                              ></span>
                            </Link>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="w-max min-w-[22rem] flex flex-col p-4 gap-4">
                              <div className="flex flex-row  items-center gap-2 ">
                                <span>Rentals (Hire)</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 text-black-1/80"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                  />
                                </svg>
                              </div>
                              <ul className="w-full grid grid-cols-2 gap-1 bg-white ">
                                {isLoading
                                  ? [...Array(6)]?.map((_, idx) => (
                                      <li key={idx} className="h-[4rem]">
                                        <Skeleton className="w-full h-full" />
                                      </li>
                                    ))
                                  : data?.data
                                      ?.filter((i) => i?.attributes?.type === 'hire')
                                      ?.map((i, idx) => (
                                        <li key={idx} className="h-[4rem] group">
                                          <NavigationMenuLink asChild className="w-full h-full">
                                            <Link
                                              href={`/products?category=${sluggify(
                                                i?.attributes?.name
                                              )}`}
                                              className="flex flex-row justify-center items-center gap-2 bg-orange-1/[0.05] group-hover:bg-orange-1/10 rounded-sm py-2 px-4 transition-colors ease-in-out duration-300"
                                            >
                                              <span className="text-[14px] w-max whitespace-nowrap">
                                                {capitalizeText(i?.attributes?.name, 'allWords')}
                                              </span>
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                />
                                              </svg>
                                            </Link>
                                          </NavigationMenuLink>
                                        </li>
                                      ))}
                              </ul>
                              <div className="flex flex-row   items-center gap-2 ">
                                <span>Sale</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 text-black-1/80"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                                  />
                                </svg>
                              </div>
                              <ul className="w-full grid grid-cols-2 gap-1 bg-white ">
                                {isLoading
                                  ? [...Array(6)]?.map((_, idx) => (
                                      <li key={idx} className="h-[4rem]">
                                        <Skeleton className="w-full h-full" />
                                      </li>
                                    ))
                                  : data?.data
                                      ?.filter((i) => i?.attributes?.type === 'sale')
                                      ?.map((i, idx) => (
                                        <li key={idx} className="h-[4rem] group">
                                          <NavigationMenuLink asChild className="w-full h-full">
                                            <Link
                                              href={`/products?category=${sluggify(
                                                i?.attributes?.name
                                              )}`}
                                              className="flex flex-row justify-center items-center gap-2 bg-orange-1/[0.05] group-hover:bg-orange-1/10 rounded-sm py-2 px-4 transition-colors ease-in-out duration-300"
                                            >
                                              <span className="text-[14px] w-max whitespace-nowrap">
                                                {capitalizeText(i?.attributes?.name, 'allWords')}
                                              </span>
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                />
                                              </svg>
                                            </Link>
                                          </NavigationMenuLink>
                                        </li>
                                      ))}
                              </ul>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  ) : (
                    <Link
                      href={`/${i?.link}`}
                      key={idx}
                      className="flex flex-row items-center gap-1 relative group w-max overflow-x-hidden"
                    >
                      <span>{i?.title}</span>
                      <span
                        className={`absolute bottom-0  ${
                          pathname === `/${i?.link}` ? `translate-x-0` : ` -translate-x-full`
                        } group-hover:!translate-x-0 transition-transform duration-300 ease-in-out rounded-sm right-0 h-[2px] w-full bg-orange-1`}
                      ></span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <Cart />
            <Search />
            <ProfileDrop />
            <Menu />
          </div>
        </div>
      </nav>
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogTrigger className="block w-full cursor-pointer"></DialogTrigger>
        <DialogContent className="w-full min-h-full md:!w-max md:max-w-full md:min-h-[50vh]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Login into your Grand Occasion account</DialogDescription>
            <Login />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
        <DialogTrigger className="block w-full cursor-pointer"></DialogTrigger>
        <DialogContent className="w-full min-h-full md:w-max md:max-w-full  md:min-h-[50vh]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>Create a new Grand Occasion Account</DialogDescription>
            <SignUp />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogTrigger className="block w-full cursor-pointer"></DialogTrigger>
        <DialogContent className="w-full  md:w-max md:max-w-full  md:min-h-[20vh]">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>Click Logout to continue to Guest Mode</DialogDescription>
            <Logout />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Nav;
