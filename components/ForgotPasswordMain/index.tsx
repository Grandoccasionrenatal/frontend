'use client';
import InputErrorWrapper from '@/components/hocs/InputErrorWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  forgotPasswordScehma,
  forgotPasswordScehmaInterface
} from '@/app/(checkout)/forgot-password/forgot-password.model';
import authService from '@/adapters/auth';
import { toast } from 'react-hot-toast';

const ForgotPasswordMain = () => {
  const { isLoading, mutate } = useMutation<any, any, forgotPasswordScehmaInterface>({
    mutationFn: ({ email }) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success(`A reset password link has been sent to your mail, pls confrim`);
    }
  });

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<forgotPasswordScehmaInterface>({
    resolver: zodResolver(forgotPasswordScehma),
    mode: 'all'
  });

  const onSubmit: SubmitHandler<forgotPasswordScehmaInterface> = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label className="text-start" htmlFor="email">
            Email
          </Label>
          <InputErrorWrapper error={errors?.email?.message}>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              {...register('email')}
            />
          </InputErrorWrapper>
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="mt-2 bg-orange-1 flex gap-2  text-black-1 font-sans hover:bg-orange-1 hover:contrast-75"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white border-r-white rounded-full animate-spin" />
          ) : (
            <></>
          )}{' '}
          Send Reset Link
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordMain;
