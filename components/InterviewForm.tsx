'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateInterviewSchema } from '@/lib/schemas/interview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

interface InterviewFormProps {
  locale: string;
  userId: string;
}

const clientSchema = generateInterviewSchema;
type FormValues = z.infer<typeof clientSchema>;

export function InterviewForm({ locale, userId }: InterviewFormProps) {
  const t = useTranslations('interviewForm');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      title: '',
      role: '',
      level: '',
      techstack: '',
      type: 'technical',
      amount: 1,
      userid: userId,
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/${locale}/api/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Request failed');
      }

      toast.success(t('success'));
      startTransition(() => router.push(`/${locale}`));
    } catch (err: any) {
      toast.error(err?.message || t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-xl p-4 sm:p-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='title'>{t('title')}</Label>
                <FormControl>
                  <Input
                    id='title'
                    placeholder={t('titlePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='role'>{t('role')}</Label>
                <FormControl>
                  <Input
                    id='role'
                    placeholder={t('rolePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='level'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='level'>{t('level')}</Label>
                <FormControl>
                  <Input
                    id='level'
                    placeholder={t('levelPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='techstack'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='techstack'>{t('techstack')}</Label>
                <FormControl>
                  <Input
                    id='techstack'
                    placeholder={t('techstackPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='type'>{t('type')}</Label>
                <FormControl>
                  <select
                    id='type'
                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none'
                    value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value='' disabled>
                      {t('typePlaceholder')}
                    </option>
                    <option value='technical'>{t('typeTechnical')}</option>
                    <option value='behavioral'>{t('typeBehavioral')}</option>
                    <option value='mixed'>{t('typeMixed')}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='amount'>{t('amount')}</Label>
                <FormControl>
                  <select
                    id='amount'
                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none'
                    value={String(field.value)}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-2'>
            <Button
              type='submit'
              disabled={submitting || isPending}
              className='w-full'
            >
              {submitting || isPending ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default InterviewForm;
