'use client';

import useCartStore from '@/store/useCartStore';
import { useMemo, useState } from 'react';
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
  const [userAddress, setUserAddress] = useState<transactionInterface['address'] | null>(null);
  const [fullAddressText, setFullAddressText] = useState('');
  const router = useRouter();

  const {
    trigger,
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm<offlineOrderFormSchemaInterface>({
    resolver: zodResolver(offlineOrderFormSchema),
    mode: 'all',
    defaultValues: {}
  });

  const sendNotification = async (orderData: offlineTransactionInterface, total: number) => {
    try {
      await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          phone_number: orderData.phone_number,
          address: orderData.address,
          details: orderData.details,
          items: orderData.transaction_items.map((i) => ({
            name: i.product.attributes.name ?? 'Item',
            quantity: i.units,
            price: i.total_price
          })),
          total
        })
      });
    } catch {
      // notification failure is non-fatal
    }
  };

  const { mutate, isLoading } = useMutation<any, any, offlineTransactionInterface>({
    mutationFn: (data) => transactionService.createOfflineOrder(data),
    onSuccess: (_, variables) => {
      sendNotification(variables, aggregate.total);
      toast.success(`Your enquiry has been submitted! We'll be in touch shortly.`);
      clearCart();
      router.push(`/?success=true`);
    },
    onError: () => toast.error(`Something went wrong. Please try again or call us on 085 156 3498.`)
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
    return { subTotal, total: subTotal };
  }, [cart]);

  const handleAddressSelect = (v: any) => {
    setFullAddressText(v?.value?.description ?? '');
    geocodeByAddress(v?.value?.description)
      .then((results) => {
        const { city, country, line1, state } = extractAddressComponents(
          results[0] as unknown as AddressObject
        );
        setUserAddress({ country, city, state, line1 });
        return getLatLng(results[0]);
      })
      .then(({ lat, lng }) => {
        const res = getUserDistanceOffsetInKm([lat.toString(), lng.toString()]);
        setValue('user_location', res);
        trigger();
      })
      .catch(() => {
        toast.error('Could not look up this address. Please try selecting it again.');
      });
  };

  const onSubmit: SubmitHandler<offlineOrderFormSchemaInterface> = (data) => {
    const addressLine = fullAddressText || (userAddress
      ? [userAddress.line1, userAddress.city, userAddress.state, userAddress.country]
          .filter(Boolean)
          .join(', ')
      : '');
    const eircode = data.eircode ? ` | Eircode: ${data.eircode.toUpperCase()}` : '';

    mutate({
      address: addressLine + eircode,
      customer_name: data.customer_name,
      details: `Event Date: ${data.event_date}${data.more_order_details ? ` | Notes: ${data.more_order_details}` : ''}`,
      transaction_items: cart.map((i) => {
        const price = i.product.attributes.price_per_day;
        const withVATPrice = i?.product?.attributes?.excl_vat
          ? price
          : price + (Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE!) / 100) * price;
        const discount = i.product.attributes.discount || 0;
        const discountedPrice = withVATPrice - (withVATPrice * discount) / 100;
        return {
          product: i.product,
          units: i.quantity,
          total_price: Number(discountedPrice.toFixed(2))
        };
      }),
      customer_email: data.email,
      phone_number: data.phone_number
    });
  };

  return (
    <section className="w-full relative font-sans">
      {/* Mobile order summary */}
      <div className="w-full md:hidden mb-4">
        <Accordion className="w-full max-w-[50rem]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="no-underline hover:no-underline flex flex-col gap-1 bg-orange-1/20 rounded-[4px] px-2">
              <div className="flex items-end justify-center flex-wrap gap-x-4 gap-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>Show order summary</span>
                <span className="text-[14px]">({CONSTANTS.CURRENCY}{Number(aggregate.total)?.toFixed(2)})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <OrderSummary subtotal={0} shipping={0} total={aggregate.total} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full md:max-w-[25rem] flex flex-col gap-5">

          {/* Name */}
          <InputErrorWrapper error={errors?.customer_name?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label htmlFor="customer_name"><span className="font-[700]">Full Name <span className="text-red-500">*</span></span></Label>
              <Input id="customer_name" placeholder="Jane Smith" {...register('customer_name')} />
            </div>
          </InputErrorWrapper>

          {/* Email */}
          <InputErrorWrapper error={errors?.email?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label htmlFor="email"><span className="font-[700]">Email Address <span className="text-red-500">*</span></span></Label>
              <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} />
            </div>
          </InputErrorWrapper>

          {/* Phone */}
          <InputErrorWrapper error={errors?.phone_number?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label htmlFor="phone_number"><span className="font-[700]">Phone Number <span className="text-red-500">*</span></span></Label>
              <Input id="phone_number" type="tel" placeholder="085 123 4567" {...register('phone_number')} />
            </div>
          </InputErrorWrapper>

          {/* Event Date */}
          <InputErrorWrapper error={errors?.event_date?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label htmlFor="event_date"><span className="font-[700]">Event Date <span className="text-red-500">*</span></span></Label>
              <Input id="event_date" type="date" {...register('event_date')} />
            </div>
          </InputErrorWrapper>

          {/* Delivery Address */}
          <InputErrorWrapper error={errors?.user_location?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label><span className="font-[700]">Delivery / Event Address <span className="text-red-500">*</span></span></Label>
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                selectProps={{
                  onChange: (v) => handleAddressSelect(v),
                  placeholder: 'Start typing your address...',
                  classNames: {
                    control: (props) =>
                      `${props.className} flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`
                  }
                }}
              />
            </div>
          </InputErrorWrapper>

          {/* Eircode */}
          <InputErrorWrapper error={errors?.eircode?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label htmlFor="eircode"><span className="font-[700]">Eircode</span> <span className="text-[12px] text-gray-400">(optional but helps with delivery)</span></Label>
              <Input id="eircode" placeholder="e.g. R93 R7Y5" {...register('eircode')} />
            </div>
          </InputErrorWrapper>

          {/* Extra notes */}
          <InputErrorWrapper error={errors?.more_order_details?.message}>
            <div className="w-full flex flex-col gap-1.5">
              <Label htmlFor="more_order_details"><span className="font-[700]">Additional Notes</span> <span className="text-[12px] text-gray-400">(optional)</span></Label>
              <Input id="more_order_details" placeholder="e.g. number of guests, setup time, special requests..." {...register('more_order_details')} />
            </div>
          </InputErrorWrapper>

          <p className="text-[12px] text-gray-500">
            <span className="text-red-500">*</span> Required fields. We&apos;ll contact you within 24 hours to confirm your booking and arrange payment.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-1 h-[2.5rem] px-4 rounded-[4px] text-[14px] font-semibold text-white hover:opacity-90 transition-opacity ease-in-out duration-300 disabled:opacity-60"
          >
            {isLoading ? `Submitting...` : `Send Booking Enquiry`}
          </button>
        </div>

        <div className="w-full hidden md:flex md:border-l border-l-slate-300 px-12">
          <OrderSummary subtotal={0} shipping={0} total={aggregate.total} />
        </div>
      </form>
    </section>
  );
};

export default OfflineOrderMain;
