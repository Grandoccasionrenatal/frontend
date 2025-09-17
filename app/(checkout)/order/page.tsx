import HeroTitle from '@/components/HeroTitle';
import CheckoutMain from '@/components/sections/checkoutMain';
import Link from 'next/link';

const Order = () => {
  return (
    <main className="container h-full w-full flex flex-col gap-8 px-container-base lg:px-container-lg">

      <HeroTitle/>
      <CheckoutMain />
    </main>
  );
};



export default Order;
