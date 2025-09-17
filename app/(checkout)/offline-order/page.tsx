import HeroTitle from '@/components/HeroTitle';
import OfflineOrderMain from '@/components/sections/OfflineOrderMain';
import Link from 'next/link';

const OfflineOrder = () => {
  return (
    <main className="container h-full w-full flex flex-col gap-8 px-container-base lg:px-container-lg">

      <HeroTitle/>
      <OfflineOrderMain />
    </main>
  );
};

export default OfflineOrder;
