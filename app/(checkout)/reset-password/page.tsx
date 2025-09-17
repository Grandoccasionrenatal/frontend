import ResetPasswordMain from '@/components/ResetPasswordMain';
import CONSTANTS from '@/constant';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const ResetPassword = () => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', `w-full h-screen p-8`)}>
      <h1 className="text-[24px]">Reset Password</h1>
      <ResetPasswordMain />
      <Link href={`/${CONSTANTS.ROUTES['']}`}>
        <span className="text-orange-1 hover:underline cursor-pointer">Go back home</span>
      </Link>
    </div>
  );
};

export default ResetPassword;
