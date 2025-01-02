import HeroTitle from '@/components/HeroTitle';
import CheckoutMain from '@/components/sections/checkoutMain';
import Link from 'next/link';

const Order = () => {
  return (
    <main className="container h-full w-full flex flex-col gap-8 px-container-base lg:px-container-lg">

      <HeroTitle/>
      {/* <Link href={`/`}>
        <h3 className="text-[22px] sm:text-[32px] leading-[40px] font-giliran font-[700] py-4">
          Grand Occasion <span className="text-[16px] font-sans text-start"> ™ </span>
        </h3>
      </Link> */}
      <CheckoutMain />
    </main>
  );
};

export default Order;
