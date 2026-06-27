import dynamic from 'next/dynamic';
import Nav from '@/components/nav';
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });
const FloatingContact = dynamic(() => import('@/components/FloatingContact'), { ssr: false });

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full relative p-2 sm:p-4 font-giliran">
      <Nav />
      {children}
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default AppLayout;
