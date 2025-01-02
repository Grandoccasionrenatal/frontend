import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

const Logout = () => {
  const { setLogoutOpen, setLoggedIn, setAuthDetails } = useAuthStore();

  const handleLogout = () => {
    setLoggedIn(false);
    setAuthDetails({});
    toast.success(`You have been logged out`);
    setLogoutOpen(false);
  };

  return (
    <div className={cn('grid grid-cols-2 gap-6', `w-full md:w-[30rem] py-4`)}>
      <Button
        onClick={() => setLogoutOpen(false)}
        className="my-2 bg-orange-1  text-black-1 font-sans hover:bg-orange-1 hover:contrast-75"
      >
        Cancel
      </Button>
      <Button
        onClick={() => handleLogout()}
        className="my-2 bg-orange-1  text-black-1 font-sans hover:bg-orange-1 hover:contrast-75"
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;
