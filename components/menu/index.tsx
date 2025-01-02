'use client';

import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { navItems } from '../nav/nav.data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cart from '../cart';
import useAuthStore from '@/store/useAuthStore';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const { loggedIn, setLoginOpen, setSignUpOpen, setLogoutOpen, authDetails } = useAuthStore(
    (store) => store
  );

  useLockBodyScroll(menuOpen);

  return (
    <div className="flex lg:hidden">
      <svg
        onClick={() => setMenuOpen(true)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      {createPortal(
        <div
          className={`fixed flex flex-col gap-8 h-[100vh] px-4 py-8 w-[100vw]
           top-0 bottom-0 right-0 left-0 bg-white z-[20] transition-transform duration-300 ease-in-out delay-100
           ${!menuOpen ? `-translate-x-full` : `translate-x-0`}
           `}
        >
          <div className="w-full flex justify-end items-center gap-4">
            <div className="flex font-bold text-black-1/70 gap-1">
              <span className="">{authDetails?.user?.email}</span> (
              <span>{authDetails?.user?.username}</span> )
            </div>
            <Cart />
            <div
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 cursor-pointer rounded-[50px] bg-slate-100 grid place-items-center hover:bg-slate-300 active:bg-slate-100 transition-colors ease-in-out duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <ul className="flex flex-col gap-6 items-center">
            {navItems?.map((i, idx) => (
              <li
                onClick={() => setMenuOpen(false)}
                key={idx}
                className={`font-[500]  text-[40px] relative group w-max overflow-y-hidden overflow-x-hidden`}
              >
                <Link href={`/${i?.link}`} key={idx}>
                  {i?.title}
                  <span
                    className={`absolute bottom-0 mb-[-2px] ${
                      pathname === `/${i?.link}` ? `translate-x-0` : ` -translate-x-full`
                    } group-hover:!translate-x-0 transition-transform duration-300 ease-in-out rounded-sm right-0 h-[4px] w-full bg-orange-1`}
                  ></span>
                </Link>
              </li>
            ))}
            {!loggedIn ? (
              <>
                <li
                  onClick={() => {
                    setMenuOpen(false);
                    setLoginOpen(true);
                  }}
                  key={10000}
                  className={`font-[500] mt-12 border border-slate-200 px-4  text-[30px] relative group w-max overflow-y-hidden overflow-x-hidden`}
                >
                  Login
                  <span
                    className={`absolute bottom-0 mb-[-2px] -translate-x-full  group-hover:!translate-x-0 transition-transform duration-300 ease-in-out rounded-sm right-0 h-[4px] w-full bg-orange-1`}
                  ></span>
                </li>
                <li
                  onClick={() => {
                    setMenuOpen(false);
                    setSignUpOpen(true);
                  }}
                  key={100002}
                  className={`font-[500] border border-slate-200 px-4  text-[30px] relative group w-max overflow-y-hidden overflow-x-hidden`}
                >
                  Sign Up
                  <span
                    className={`absolute bottom-0 mb-[-2px] -translate-x-full group-hover:!translate-x-0 transition-transform duration-300 ease-in-out rounded-sm right-0 h-[4px] w-full bg-orange-1`}
                  ></span>
                </li>
              </>
            ) : (
              <li
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutOpen(true);
                }}
                key={100002}
                className={`font-[500] border border-slate-200 px-4  text-[30px] relative group w-max overflow-y-hidden overflow-x-hidden`}
              >
                Logout
                <span
                  className={`absolute bottom-0 mb-[-2px] -translate-x-full group-hover:!translate-x-0 transition-transform duration-300 ease-in-out rounded-sm right-0 h-[4px] w-full bg-orange-1`}
                ></span>
              </li>
            )}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Menu;
