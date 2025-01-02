'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import CONSTANTS from '@/constant';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { orderFormSchema, orderFormSchemaInterface } from './order.model';
import { zodResolver } from '@hookform/resolvers/zod';
import InputErrorWrapper from '@/components/hocs/InputErrorWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { add, format, intervalToDuration } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  AddressObject,
  capitalizeText,
  extractAddressComponents,
  getUserDistanceOffsetInKm
} from '@/utils';
import useCartStore from '@/store/useCartStore';
import StrapiImage from '@/components/StrapiImage';
import { loadStripe } from '@stripe/stripe-js';
import transactionService from '@/adapters/transactions';
import moment from 'moment';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useAuthStore from '@/store/useAuthStore';
import { transactionInterface } from '@/types/api.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import Login from '@/components/Login';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-google-places-autocomplete';

type checkoutviews = 'order' | 'invoice';

const views: checkoutviews[] = ['order', 'invoice'];

const CheckoutMain = () => {
  const [currView, setCurrView] = useState<checkoutviews>('order');
  const [redirectLoading, setRedirectLoading] = useState(false);

  const [userAddress, setUserAddress] = useState<transactionInterface['address'] | null>(null);

  const { cart } = useCartStore((store) => store);
  const { authDetails, loggedIn, setLoginOpen, loginOpen } = useAuthStore((store) => store);

  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`);

  const {
    trigger,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    getValues,
    setValue,
    reset
  } = useForm<orderFormSchemaInterface>({
    resolver: zodResolver(orderFormSchema),
    mode: 'all',
    defaultValues: {
      shipping: false,
      start_date: new Date(),
      return_date: add(new Date(), {
        days: 1
      })
    }
  });

  const cartContainsRentals = useMemo(() => {
    const res = cart?.find((i) => i?.product?.attributes?.for === 'hire');
    return res ? true : false;
  }, [cart]);

  const rentalDays = useMemo(() => {
    const res = intervalToDuration({
      start: getValues('start_date'),
      end: getValues('return_date')
    })?.days;
    return res ? res : 1;
  }, [getValues('return_date')]);

  const shippingTokens = useMemo(() => {
    if (watch('user_location') && watch('user_location') > 10) {
      return {
        isBaseFixedPrice: false,
        total: watch('user_location') * Number(`${process.env.NEXT_PUBLIC_SHIPPING_FEE}`)
      };
    } else {
      return { isBaseFixedPrice: true, total: 10 };
    }
  }, [watch('user_location')]);

  const aggregate = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => {
      const price = item.product.attributes.price_per_day;
      const withVATPrice = item?.product?.attributes?.excl_vat
        ? price
        : price + (Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE!) / 100) * price;
      const discount = item.product.attributes.discount || 0;
      const discountedPrice = withVATPrice - (withVATPrice * discount) / 100;
      return acc + discountedPrice * item.quantity * rentalDays;
    }, 0);

    const total = shippingTokens?.total + subTotal;
    return { subTotal, shipping: shippingTokens?.total, total };
  }, [cart, watch('shipping'), rentalDays, watch('user_location'), shippingTokens]);

  const onSubmit: SubmitHandler<orderFormSchemaInterface> = (data) => {
    setCurrView('invoice');
  };

  const handlePayment = async () => {
    setRedirectLoading(true);
    try {
      const stripe = await stripePromise;
      const transactionData: transactionInterface = {
        customer_name: getValues('customer_name'),
        return_date: moment(getValues('return_date')).format('YYYY-MM-DD')?.split('T')[0],
        shipping: getValues('shipping'),
        total_price: Number(aggregate?.total?.toFixed(2)),
        transaction_date: moment(getValues('start_date')).format('YYYY-MM-DD')?.split('T')[0],
        transaction_items: [
          ...cart?.map((i) => {
            const price = i.product.attributes.price_per_day;
            const withVATPrice = i?.product?.attributes?.excl_vat
              ? price
              : price + (Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE!) / 100) * price;
            const discount = i.product.attributes.discount || 0;
            const discountedPrice = withVATPrice - (withVATPrice * discount) / 100;
            const total_price = discountedPrice * rentalDays; //total price per unit
            return {
              product: i?.product,
              units: i?.quantity,
              total_price: Number(total_price.toFixed(2))
            };
          })
        ],
        distance: parseInt(`${watch('user_location')}`),
        address: {
          country: ``,
          city: ``,
          state: ``,
          line1: ``
        }
      };
      const res = await transactionService.createTransaction(
        loggedIn
          ? { ...transactionData, customer_email: authDetails?.user?.email }
          : { ...transactionData }
      );
      await stripe?.redirectToCheckout({
        sessionId: res?.stripeSession.id
      });
    } catch (err) {
      console.log('err', err);
    } finally {
      setRedirectLoading(false);
    }
  };

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

  useEffect(() => {
    if (!loggedIn) {
      setLoginOpen(true);
    } else {
      reset({
        shipping: false,
        start_date: new Date(),
        return_date: add(new Date(), {
          days: 1
        }),
        customer_name: `${authDetails?.user?.first_name} ${authDetails?.user?.last_name}`
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
                    ( {CONSTANTS.CURRENCY}
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
                <CheckoutMain.Summary
                  subtotal={aggregate?.subTotal}
                  shipping={aggregate?.shipping}
                  total={aggregate?.total}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex items-center gap-1 mb-4">
          {views?.map((i, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span
                className={`text-[14px] cursor-pointer ${i === currView ? `text-orange-1` : ``}`}
              >
                {capitalizeText(i, 'firstWord')}
              </span>
              {idx < views.length - 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-2 h-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full md:max-w-[25rem]  flex flex-col gap-8">
            {currView === 'order' ? (
              <>
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
                {/* <InputErrorWrapper error={errors?.customer_contact?.message}>
                <div className="w-full flex flex-col gap-1.5">
                  <Label htmlFor="customer_contact">
                    <span className="font-[700]">Contact</span>
                  </Label>
                  <Input
                    id="customer_contact"
                    placeholder="Please enter your contact details"
                    {...register('customer_contact')}
                  />
                </div>
                </InputErrorWrapper> */}
                <div className="w-max flex flex-col gap-1.5">
                  <Label htmlFor="customer_address">
                    <span className="font-[700]">Delivery Option</span>
                  </Label>
                  <TooltipProvider delayDuration={1}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-4">
                          <span>Pick up</span>
                          <Switch
                            checked={getValues('shipping')}
                            onCheckedChange={(i) => {
                              setValue('shipping', i);
                              trigger();
                            }}
                          />
                          <span>Delivery</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        sideOffset={10}
                        side="top"
                        className="w-[10rem] bg-orange-100 border border-orange-1 border-dashed text-black-1"
                      >
                        <span>
                          {getValues('shipping')
                            ? `Toggle to deactivate delivery`
                            : `Toggle this to activate our delivery service for you order`}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-orange-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                    <span className="text-[12px] md:text-[14px]">
                      {process.env.NEXT_PUBLIC_SHIPPING_FEE_FIXED}
                      {CONSTANTS.CURRENCY} for addresses within a 10km distance and{' '}
                      {process.env.NEXT_PUBLIC_SHIPPING_FEE}
                      {CONSTANTS.CURRENCY}/km for other addresses
                    </span>
                  </div>
                </div>
                {/* <InputErrorWrapper error={errors?.customer_address?.message}>
                <div className="w-full flex flex-col gap-1.5">
                  <Label htmlFor="customer_address">
                    <span className="font-[700]">Address</span>
                  </Label>
                  <Textarea
                    rows={6}
                    {...register('customer_address')}
                    id="customer_address"
                    placeholder="Please enter detailed address"
                  />
                </div>
              </InputErrorWrapper> */}
                {cartContainsRentals ? (
                  <div className="w-full flex flex-col gap-1.5">
                    <Label htmlFor="start_date">
                      <span className="font-[700]">Rental Start Date</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !getValues('start_date') && 'text-muted-foreground'
                          )}
                        >
                          {getValues('start_date') ? (
                            format(getValues('start_date'), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={getValues('start_date')}
                          onSelect={(i) => {
                            !!i ? setValue('start_date', i) : null;
                            trigger();
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <></>
                )}
                {cartContainsRentals ? (
                  <div className="w-full flex flex-col gap-1.5">
                    <Label htmlFor="customer_address">
                      <span className="font-[700]">Rental Return Date</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !getValues('return_date') && 'text-muted-foreground'
                          )}
                        >
                          {getValues('return_date') ? (
                            format(getValues('return_date'), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={getValues('return_date')}
                          onSelect={(i) => {
                            !!i ? setValue('return_date', i) : null;
                            trigger();
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <></>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="bg-orange-1 h-[2.5rem] px-2 rounded-[4px] text-[14px]  hover:opacity-90 transition-opacity ease-in-out duration-300"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : currView === 'invoice' ? (
              <>
                <div className="flex p-4 flex-col gap-4 border border-slate-300 rounded-[4px]">
                  {/* <div className="grid grid-cols-[4rem_auto] items-end py-2 gap-4 ">
                  <span className="text-[14px]">Contact:</span>
                  <span className="font-bold text-[14px]">{getValues('customer_contact')}</span>
                </div> */}

                  <div className="grid grid-cols-[4rem_auto] items-end py-2 gap-4 ">
                    <span className="text-[14px]">Delivery:</span>
                    <span className="font-bold text-[14px]">
                      {getValues('shipping') ? `Yes` : `No`}
                    </span>
                  </div>

                  {cartContainsRentals ? (
                    <div className="grid grid-cols-[4rem_auto] items-end py-2 gap-4 ">
                      <span className="text-[14px]">Rental Duration: </span>
                      <span className="font-bold text-[14px]">{rentalDays} days</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {!getValues('shipping') && (
                  <p className="text-[13px]">
                    <span className="font-[600]">NB: </span>You still need to fill an address on the
                    stripe payment section, so we can keep in touch incase your pick up is delayed
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrView('order')}
                    className="flex items-center gap-2 hover:text-orange-1 transition-colors ease-in-out duration-300 cursor-pointer z-[1]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                      />
                    </svg>

                    <span className="text-[14px]">Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={redirectLoading}
                    onClick={() => handlePayment()}
                    className="bg-orange-1 h-[2.5rem] px-2 rounded-[4px] text-[14px]  hover:opacity-90 transition-opacity ease-in-out duration-300 z-[1]"
                  >
                    {redirectLoading ? `Redirecting to Stripe...` : `Continue`}
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full hidden md:flex md:border-l border-l-slate-300 px-12">
            <CheckoutMain.Summary
              subtotal={aggregate?.subTotal}
              shipping={aggregate?.shipping}
              total={aggregate?.total}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutMain;

interface ISummary {
  subtotal: number;
  shipping?: number;
  total: number;
}

export const OrderSummary = ({ subtotal, total, shipping }: ISummary) => {
  const { cart } = useCartStore((store) => store);

  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {cart?.map((i, idx) => (
        <div key={idx} className="flex items-start justify-between h-max ">
          <div className="flex gap-[4px]">
            <div className="relative w-[5rem] h-[5rem]  rounded-[.5rem] bg-slate-300 overflow-hidden">
              <div className="absolute z-10 min-w-6 w-6 h-6 rounded-[50px] bg-orange-1 grid place-items-center top-0 right-0 cursor-pointer">
                <span className="text-[12px] font-bold">{i?.quantity}</span>
              </div>
              <StrapiImage src={`${i?.product?.attributes?.images?.data[0]?.attributes?.url}`} />
            </div>
            <p className="max-w-[8rem] flex flex-col overflow-hidden truncate text-ellipsis">
              <span> {i?.product?.attributes?.name}</span>
              <span>({i?.product?.attributes?.for})</span>
            </p>
          </div>
          <div className="flex flex-col justify-start h-full gap-1">
            <p className="flex items-center gap-2">
              <span
                className={`${
                  i?.product?.attributes?.discount ? `line-through text-black-1/50` : ``
                }`}
              >
                {CONSTANTS.CURRENCY}
                {i?.product?.attributes?.price_per_day}
              </span>
              {i?.product?.attributes?.discount ? (
                <span>
                  {`${CONSTANTS.CURRENCY}${
                    i?.product?.attributes?.price_per_day -
                    (i?.product?.attributes?.price_per_day * i?.product?.attributes?.discount) / 100
                  }`}
                </span>
              ) : (
                <></>
              )}
              {!i?.product?.attributes?.excl_vat ? (
                <span>+{process.env.NEXT_PUBLIC_VAT_PERCENTAGE}% VAT</span>
              ) : (
                <></>
              )}
            </p>
          </div>
        </div>
      ))}
      <div className="w-full flex items-center justify-between bg-orange-1/20 rounded-[4px] p-2">
        <div className="flex flex-col">
          <span className="text-[14px]">Subtotal</span>
        </div>
        <span className="font-[600]">
          {CONSTANTS.CURRENCY}
          {Number(subtotal)?.toFixed(2)}
        </span>
      </div>
      <div
        className={`w-full 
      ${shipping ? `flex` : `hidden`}
      items-center justify-between bg-orange-1/20 rounded-[4px] p-2`}
      >
        <div className="flex flex-col">
          <span className="text-[14px]">Delivery</span>
        </div>
        <span className="font-[600]">
          {CONSTANTS.CURRENCY}
          {Number(shipping)?.toFixed(2)}
        </span>
      </div>
      <div className="w-full flex items-center justify-between bg-orange-1/20 rounded-[4px] p-2">
        <div className="flex flex-col">
          <span className="text-[14px]">Total</span>
        </div>
        <span className="font-[600]">
          {CONSTANTS.CURRENCY}
          {Number(total)?.toFixed(2)}
        </span>
      </div>
      <p className="font-serif font-[500] text-[14px] md:text-[16px] inline-flex gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 inline text-orange-1 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        You will be required to pay half ( {CONSTANTS.CURRENCY}
        {Number(total / 2)?.toFixed(2)}) of the total to initiate this order, the last half of
        payment would be recieved on delivery/pickup.
      </p>
    </div>
  );
};

CheckoutMain.Summary = OrderSummary;
