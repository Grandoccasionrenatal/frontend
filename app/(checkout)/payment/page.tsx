import dynamic from 'next/dynamic';

const PaymentStatus = dynamic(() => import('../../../components/PaymentStatus'));

const Payment = () => {
  return (
    <main className="container h-full w-full flex flex-col">
      <PaymentStatus />
    </main>
  );
};

export default Payment;
