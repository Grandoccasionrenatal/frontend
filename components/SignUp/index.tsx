import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signUpInterface, signUpSchema } from './signUp.model';
import { zodResolver } from '@hookform/resolvers/zod';
import InputErrorWrapper from '../hocs/InputErrorWrapper';
import { useMutation } from '@tanstack/react-query';
import authService from '@/adapters/auth';
import { userDetailsInterface } from '@/types/api.types';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const { setAuthDetails, setLoggedIn, setSignUpOpen } = useAuthStore((store) => store);

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<signUpInterface>({
    resolver: zodResolver(signUpSchema),
    mode: 'all'
  });

  const { isLoading, mutate } = useMutation<userDetailsInterface, any, signUpInterface>({
    mutationFn: (params) => authService.createAccount(params),
    onSuccess: (data) => {
      if (!!data) {
        setAuthDetails(data);
        setLoggedIn(true);
        setSignUpOpen(false);
        toast.success(
          `Your Account is registered, Please check your email for a verification link to login in the future`,
          { duration: 10000 }
        );
      }
    }
  });

  const onSubmit: SubmitHandler<signUpInterface> = (data) => {
    mutate(data);
  };

  return (
    <div className={cn('grid gap-6', `w-full md:w-[30rem] py-8`)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="text-start" htmlFor="username">
              Username
            </Label>
            <InputErrorWrapper error={errors?.username?.message}>
              <Input
                id="username"
                placeholder="jhonny"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                {...register('username')}
              />
            </InputErrorWrapper>
          </div>
          <div className="grid gap-1">
            <Label className="text-start" htmlFor="first_name">
              First name
            </Label>
            <InputErrorWrapper error={errors?.first_name?.message}>
              <Input
                id="first_name"
                placeholder="jhon"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                {...register('first_name')}
              />
            </InputErrorWrapper>
          </div>
          <div className="grid gap-1">
            <Label className="text-start" htmlFor="last_name">
              Last name
            </Label>
            <InputErrorWrapper error={errors?.last_name?.message}>
              <Input
                id="last_name"
                placeholder="doe"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                {...register('last_name')}
              />
            </InputErrorWrapper>
          </div>
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
                autoComplete="email"
                autoCorrect="off"
                {...register('email')}
              />
            </InputErrorWrapper>
          </div>
          <div className="grid gap-1">
            <Label className="text-start" htmlFor="password">
              Password
            </Label>
            <InputErrorWrapper error={errors?.password?.message}>
              <Input
                id="password"
                placeholder="password"
                type="password"
                autoCapitalize="none"
                autoComplete=""
                autoCorrect="off"
                {...register('password')}
              />
            </InputErrorWrapper>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="my-2 bg-orange-1 flex gap-2  text-black-1 font-sans hover:bg-orange-1 hover:contrast-75"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white border-r-white rounded-full animate-spin" />
            ) : (
              <></>
            )}{' '}
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
