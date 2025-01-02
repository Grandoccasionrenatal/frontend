import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginInterface, loginSchema } from './login.model';
import { zodResolver } from '@hookform/resolvers/zod';
import InputErrorWrapper from '../hocs/InputErrorWrapper';
import { useMutation } from '@tanstack/react-query';
import authService from '@/adapters/auth';
import { userDetailsInterface } from '@/types/api.types';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import CONSTANTS from '@/constant';

const Login = () => {
  const { setAuthDetails, setLoggedIn, setLoginOpen, setSignUpOpen } = useAuthStore(
    (store) => store
  );

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<loginInterface>({
    resolver: zodResolver(loginSchema),
    mode: 'all'
  });

  const { isLoading, mutate } = useMutation<userDetailsInterface, any, loginInterface>({
    mutationFn: (params) => authService.login(params),
    onSuccess: (data) => {
      if (!!data) {
        setAuthDetails(data);
        setLoggedIn(true);
        setLoginOpen(false);
        toast.success(`Welcome! you've been logged in `);
      }
    }
  });

  const onSubmit: SubmitHandler<loginInterface> = (data) => {
    mutate(data);
  };

  return (
    <div className={cn('grid gap-6', `w-full md:w-[30rem] py-8`)}>
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
          <div className="grid gap-1">
            <Label className="text-start" htmlFor="email">
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
            <p>
              Forgot Password?
              <Link
                className="px-2"
                onClick={() => setLoginOpen(false)}
                href={`/${CONSTANTS.ROUTES['forgot-password']}`}
              >
                <span className="text-orange-1 hover:underline cursor-pointer">Reset</span>
              </Link>
            </p>
          </div>
          <Button
            type="submit"
            className="mt-2 bg-orange-1 flex gap-2  text-black-1 font-sans hover:bg-orange-1 hover:contrast-75"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white border-r-white rounded-full animate-spin" />
            ) : (
              <></>
            )}
            Sign In
          </Button>
          <p className="text-center">
            Dont have an account?
            <span
              onClick={() => {
                setLoginOpen(false);
                setSignUpOpen(true);
              }}
              className="text-orange-1 px-1 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
            or
            <span
              onClick={() => {
                setLoginOpen(false);
              }}
              className="text-orange-1 px-1 hover:underline cursor-pointer"
            >
              Continue as Guest
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
