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

import { getInitials } from '@/utils';

const ProfileDrop = () => {
  const { loggedIn, setLoginOpen, setSignUpOpen, setLogoutOpen, authDetails } = useAuthStore(
    (store) => store
  );

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
          <DropdownMenuItem onSelect={() => setLogoutOpen(true)}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default ProfileDrop;
