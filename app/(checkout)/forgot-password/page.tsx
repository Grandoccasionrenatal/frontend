import ForgotPasswordMain from '@/components/ForgotPasswordMain';
import CONSTANTS from '@/constant';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ForgotPassword = () => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', `w-full h-screen p-8`)}>
      <h4 className="text-[24px]">Forgot Password</h4>
      <ForgotPasswordMain />
      <Link href={`/${CONSTANTS.ROUTES['']}`}>
        <span className="text-orange-1 hover:underline cursor-pointer">Go back home</span>
      </Link>
    </div>
  );
};

export default ForgotPassword;
