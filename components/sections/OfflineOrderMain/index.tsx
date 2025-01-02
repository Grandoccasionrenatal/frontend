'use client';

import useCartStore from '@/store/useCartStore';
import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import Login from '@/components/Login';
import useAuthStore from '@/store/useAuthStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { OrderSummary } from '../checkoutMain';
import CONSTANTS from '@/constant';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { offlineOrderFormSchemaInterface, offlineOrderFormSchema } from './offline-order.model';
import InputErrorWrapper from '@/components/hocs/InputErrorWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-google-places-autocomplete';
import { AddressObject, extractAddressComponents, getUserDistanceOffsetInKm } from '@/utils';
import { offlineTransactionInterface, transactionInterface } from '@/types/api.types';
import { useMutation } from '@tanstack/react-query';
import transactionService from '@/adapters/transactions';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OfflineOrderMain = () => {
  const { cart, clearCart } = useCartStore((store) => store);
  const { authDetails, loggedIn, setLoginOpen, loginOpen } = useAuthStore((store) => store);
  const [userAddress, setUserAddress] = useState<transactionInterface['address'] | null>(null);
  const router = useRouter();

  const {
    trigger,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset
  } = useForm<offlineOrderFormSchemaInterface>({
    resolver: zodResolver(offlineOrderFormSchema),
    mode: 'all',
    defaultValues: {}
  });

  const { mutate, isLoading } = useMutation<any, any, offlineTransactionInterface>({
    mutationFn: (data) => transactionService.createOfflineOrder(data),
    onSuccess: () => {
      toast.success(`Your order has been recorded`);
      clearCart();
      router.push(`/?success=true`);
    },
    onError: () => toast.error(`Something happened! pls try again`)
  });

  const aggregate = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => {
      const price = item.product.attributes.price_per_day;
      const withVATPrice = item?.product?.attributes?.excl_vat
        ? price
        : price + (Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE!) / 100) * price;
      const discount = item.product.attributes.discount || 0;
      const discountedPrice = withVATPrice - (withVATPrice * discount) / 100;
      return acc + discountedPrice * item.quantity;
    }, 0);

    const total = subTotal;
    return { subTotal, total };
  }, [cart]);

  const handleAddressSelect = (v: any) => {
    geocodeByAddress(v?.value?.description)
      .then((results) => {
        const { city, country, line1, state } = extractAddressComponents(
          results[0] as unknown as AddressObject
        );
        setUserAddress({
          country,
          city,
          state,
          line1
        });
        return getLatLng(results[0]);
      })
      .then(({ lat, lng }) => {
        const res = getUserDistanceOffsetInKm([lat.toString(), lng.toString()]);
        setValue('user_location', res);
        trigger();
      });
  };

  const onSubmit: SubmitHandler<offlineOrderFormSchemaInterface> = (data) => {
    mutate({
      address: userAddress
        ? Object.values(userAddress)
            ?.map((i) => i)
            .join(',')
        : ``,
      customer_name: data?.customer_name,
      details: data?.more_order_details,
      transaction_items: [
        ...cart?.map((i) => {
          const price = i.product.attributes.price_per_day;
          const withVATPrice = i?.product?.attributes?.excl_vat
            ? price
            : price + (Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE!) / 100) * price;
          const discount = i.product.attributes.discount || 0;
          const discountedPrice = withVATPrice - (withVATPrice * discount) / 100;
          const total_price = discountedPrice;
          return {
            product: i?.product,
            units: i?.quantity,
            total_price: Number(total_price.toFixed(2))
          };
        })
      ],
      customer_email: data?.email,
      phone_number: `${data?.phone_number}`
    });
  };

  useEffect(() => {
    if (!loggedIn) {
      setLoginOpen(true);
    } else {
      reset({
        customer_name: `${authDetails?.user?.first_name} ${authDetails?.user?.last_name}`,
        email: authDetails?.user?.email
      });
    }
  }, [loggedIn]);

  return (
    <>
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogTrigger className="block w-full cursor-pointer"></DialogTrigger>
        <DialogContent className="w-full min-h-full md:!w-max md:max-w-full md:min-h-[50vh]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Login into your Grand Occasion account</DialogDescription>
            <Login />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <section className="w-full relative font-sans">
        <div className="w-full md:hidden mb-4">
          <Accordion className=" w-full max-w-[50rem]" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline flex flex-col gap-1 bg-orange-1/20 rounded-[4px] px-2">
                <div className=" flex items-end justify-center flex-wrap gap-x-4 gap-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  <span>Show order summary</span>
                  <span className="text-[14px]">
                    ({CONSTANTS.CURRENCY}
                    {Number(aggregate.total)?.toFixed(2)})
                  </span>
                </div>
                <div className="w-full font-serif font-[500] text-[12px] md:text-[16px] flex items-center justify-center gap-1">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 inline text-orange-1 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <span className="text-center">
                    {' '}
                    Half to be paid now and half on delivery/ pickup.
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <OrderSummary subtotal={0} shipping={0} total={aggregate?.total} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="w-full md:max-w-[25rem]  flex flex-col gap-8">
            <InputErrorWrapper error={errors?.customer_name?.message}>
              <div className="w-full flex flex-col gap-1.5">
                <Label htmlFor="customer_name">
                  <span className="font-[700]">Name</span>
                </Label>
                <Input
                  id="customer_name"
                  placeholder="Enter your first and last name"
                  {...register('customer_name')}
                />
              </div>
            </InputErrorWrapper>
            <InputErrorWrapper error={errors?.email?.message}>
              <div className="w-full flex flex-col gap-1.5">
                <Label htmlFor="email">
                  <span className="font-[700]">Email</span>
                </Label>
                <Input id="email" placeholder="johnd@gmail.com" {...register('email')} />
              </div>
            </InputErrorWrapper>
            <InputErrorWrapper error={errors?.user_location?.message}>
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                selectProps={{
                  onChange: (v) => {
                    handleAddressSelect(v);
                  },
                  placeholder: `Find and select address`,
                  classNames: {
                    control: (props) =>
                      `${props.className} flex h-9 w-full rounded-md border border-input bg-background px-3  text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`
                  }
                }}
              />
            </InputErrorWrapper>
            <InputErrorWrapper error={errors?.phone_number?.message}>
              <div className="w-full flex flex-col gap-1.5">
                <Label htmlFor="phone_number">
                  <span className="font-[700]">Phone Number</span>
                </Label>
                <Input id="phone_number" placeholder="+94444444444" type='tel' {...register('phone_number')} />
              </div>
            </InputErrorWrapper>
            <InputErrorWrapper error={errors?.more_order_details?.message}>
              <div className="w-full flex flex-col gap-1.5">
                <Label htmlFor="more_order_details">
                  <span className="font-[700]">More details about this order</span>
                </Label>
                <Input id="more_order_details" placeholder="" {...register('more_order_details')} />
              </div>
            </InputErrorWrapper>
            <button
              type="submit"
              className="bg-orange-1 h-[2.5rem] px-2 rounded-[4px] text-[14px]  hover:opacity-90 transition-opacity ease-in-out duration-300"
            >
              {isLoading ? `Loading...` : `Submit Order`}
            </button>
          </div>
          <div className="w-full hidden md:flex md:border-l border-l-slate-300 px-12">
            <OrderSummary subtotal={0} shipping={0} total={aggregate?.total} />
          </div>
        </form>
      </section>
    </>
  );
};

export default OfflineOrderMain;
