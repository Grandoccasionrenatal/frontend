'use client';
import React, { useMemo } from 'react';
import InputErrorWrapper from '@/components/hocs/InputErrorWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ResetPasswordScehmaInterface,
  resetPasswordScehma
} from '@/app/(checkout)/reset-password/reset-password.model';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/adapters/auth';
import CONSTANTS from '@/constant';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

const ResetPasswordMain = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoginOpen } = useAuthStore((store) => store);

  const code = useMemo(() => {
    const res = searchParams.get('code') as string;
    return res;
  }, [searchParams]);

  const { isLoading, mutate } = useMutation<any, any, ResetPasswordScehmaInterface>({
    mutationFn: ({ passwordConfirmation: confirm_password, password }) =>
      authService.resetPassword({
        code,
        passwordConfirmation: confirm_password,
        password
      }),
    onSuccess: () => {
      router.push(`/${CONSTANTS.ROUTES['']}`);
    }
  });

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<ResetPasswordScehmaInterface>({
    resolver: zodResolver(resetPasswordScehma),
    mode: 'all'
  });

  const onSubmit: SubmitHandler<ResetPasswordScehmaInterface> = (data) => {
    mutate(data);
  };

  return (
    <form className="w-full max-w-[30rem]" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label className="text-start" htmlFor="email">
            Password
          </Label>
          <InputErrorWrapper error={errors?.password?.message}>
            <Input
              id="password"
              placeholder="jhondoe123"
              type="password"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              {...register('password')}
            />
          </InputErrorWrapper>
        </div>
        <div className="grid gap-1">
          <Label className="text-start" htmlFor="email">
            Confirm Password
          </Label>
          <InputErrorWrapper error={errors?.passwordConfirmation?.message}>
            <Input
              id="confirm_password"
              placeholder="jhondoe123"
              type="password"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              {...register('passwordConfirmation')}
            />
          </InputErrorWrapper>
        </div>
        <Button
          type="submit"
          className="mt-2 bg-orange-1 flex gap-2  text-black-1 font-sans hover:bg-orange-1 hover:contrast-75"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white border-r-white rounded-full animate-spin" />
          ) : (
            <></>
          )}{' '}
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordMain;
