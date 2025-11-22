'use client';

import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { DynamicLogo } from './DynamicLogo';
import { auth } from '@/firebase/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { signIn, signUp } from '@/lib/actions/auth.action';
import { handleAuthError } from '@/lib/auth.utils';
import { logger, LogCategory } from '@/lib/logger';
import FormField from './FormField';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === 'sign-up') {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(t('auth.accountCreatedSuccess'));
        router.push(`/${locale}/sign-in`);
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error(t('auth.signInFailed'));
          return;
        }

        const result = await signIn({
          email,
          idToken,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(t('auth.signedInSuccess'));
        router.push(`/${locale}`);
      }
    } catch (error: any) {
      logger.error('Authentication error', {
        category: LogCategory.AUTH_FAILURE,
        error: error.message || 'Unknown error',
        errorCode: error.code,
        errorName: error.name,
        type,
        email: form.getValues('email'),
      });
      const errorMessage = handleAuthError(error, t);
      toast.error(errorMessage);
    }
  };

  const isSignIn = type === 'sign-in';

  return (
    <div className='card-border lg:min-w-[566px]'>
      <div className='flex flex-col gap-6 card py-14 px-10'>
        <div className='flex flex-row gap-3 justify-center items-center group'>
          <div className='logo-container'>
            <DynamicLogo
              alt='logo'
              width={32}
              height={32}
              className='transition-transform duration-200 group-hover:scale-105'
            />
          </div>
          <h2 className='header-title'>Project Clara</h2>
        </div>

        <h3>{t('auth.practiceInterviews')}</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-6 mt-4 form'
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name='name'
                label={t('auth.name')}
                placeholder={t('auth.namePlaceholder')}
                type='text'
              />
            )}

            <FormField
              control={form.control}
              name='email'
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              type='email'
            />

            <FormField
              control={form.control}
              name='password'
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              type='password'
            />

            <Button className='btn' type='submit'>
              {isSignIn ? t('auth.signIn') : t('auth.createAccount')}
            </Button>
          </form>
        </Form>

        <p className='text-center'>
          {isSignIn ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
          <Link
            href={!isSignIn ? `/${locale}/sign-in` : `/${locale}/sign-up`}
            className='font-bold text-user-primary ml-1'
          >
            {!isSignIn ? t('auth.signIn') : t('auth.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
