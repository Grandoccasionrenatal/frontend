'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';

import { getInitials } from '@/utils';

const ProfileDrop = () => {
  const { loggedIn, setLoginOpen, setSignUpOpen, setLogoutOpen, authDetails } = useAuthStore(
    (store) => store
  );

  const ADMIN_EMAILS = ['info@grandoccasionrental.ie', 'adedejioluwaseun65@gmail.com'];
  const isAdmin = ADMIN_EMAILS.includes(authDetails?.user?.email ?? '');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:flex">
        <Avatar className="outline-none focus:outline-none focus:ring-0 grid place-items-center w-max">
          {!loggedIn ? (
            <div className="group">
              <span className="font-sans text-[14px] group-hover:text-orange-1 transition-colors ease-in-out duration-200">
                Login
              </span>
            </div>
          ) : (
            <AvatarFallback className="font-sans px-2 py-1 h-max">
              {getInitials(`${authDetails?.user?.username}`)}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      {!loggedIn ? (
        <DropdownMenuContent>
          <DropdownMenuLabel>Guest</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setLoginOpen(true)}>Login</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSignUpOpen(true)}>Sign up</DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent>
          <DropdownMenuLabel>{authDetails?.user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/internal-booking">Record Booking</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/internal-payment">Generate Payment Link</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/internal-modify">Modify Booking</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/internal-review">Send Review Request</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/internal-send-emails">Send Customer Emails</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/internal-cancel">Cancel Scheduled Emails</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/enquiry" target="_blank">Booking Details Form</Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setLogoutOpen(true)}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default ProfileDrop;
