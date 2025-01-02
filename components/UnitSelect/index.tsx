'use client';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputErrorWrapper from '../hocs/InputErrorWrapper';
import { useEffect } from 'react';

interface IUnitSelect {
  count?: number;
  setCount?: (i: number) => void;
  max: number;
  setErrors?: (i: boolean) => void;
}

const UnitSelect = ({ setCount, max, setErrors }: IUnitSelect) => {
  const unitSelectSchema = z.object({
    max: z.coerce
      .number()
      .max(max, { message: `${max} max` })
      .min(1, { message: '1 min' })
  });

  const {
    register,
    watch,
    formState: { errors },
    getValues,
    setValue,
    clearErrors
  } = useForm<z.infer<typeof unitSelectSchema>>({
    resolver: zodResolver(unitSelectSchema),
    mode: 'onChange',
    defaultValues: {
      max: 1
    }
  });

  useEffect(() => {
    const val = watch('max');
    setCount?.(val);
    errors?.max?.message ? setErrors?.(true) : setErrors?.(false);
  }, [watch('max')]);

  return (
    <InputErrorWrapper error={errors?.max?.message} className="items-center">
      <div className="h-max px-1 flex items-center gap-[2px] w-[5rem] rounded-custom border border-slate-300">
        <button
          onClick={() =>
            setValue('max', getValues('max') < 1 ? getValues('max') : getValues('max') - 1)
          }
          className="min-w-6 min-h-6 rounded-[50px] bg-slate-100 hover:bg-slate-300 active:bg-slate-100 transition-colors ease-in-out duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        </button>
        <div className="flex-grow">
          <Input
            type="number"
            {...register('max')}
            className="max-w-full p-0 border-0 outline-0 ring-0 shadow-none focus:ring-0 focus-visible:ring-0"
          />
        </div>
        <button
          onClick={() => {
            setValue('max', getValues('max') > max - 1 ? max : getValues('max') + 1);
            clearErrors();
          }}
          className="min-w-6 min-h-6 rounded-[50px] bg-slate-100 hover:bg-slate-300 active:bg-slate-100 transition-colors ease-in-out duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </button>
      </div>
    </InputErrorWrapper>
  );
};

export default UnitSelect;
