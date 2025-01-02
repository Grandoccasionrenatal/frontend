import HeroTitle from '@/components/HeroTitle';
import Link from 'next/link';

const page = () => {
  return (
    <main className="container h-full w-full flex flex-col gap-2 px-container-base lg:px-container-lg">
      <div className="flex flex-col py-4">

        <HeroTitle/>
        {/* <Link href={`/`}>
          <h3 className="text-[22px] sm:text-[32px] leading-[40px] font-giliran font-[700]">
            Grand Occasion <span className="text-[16px] font-sans text-start"> ™ </span>
          </h3>
        </Link> */}
        <h3 className="text-[18px] text-center sm:text-[28px] leading-[40px] font-giliran font-[700] py-4">
          Privacy Policy
        </h3>
      </div>
      <div className="w-full h-screen flex-grow p-8">
        <iframe className="w-full h-full" src="/docs/privacy_policy.html" />
      </div>
    </main>
  );
};

export default page;
