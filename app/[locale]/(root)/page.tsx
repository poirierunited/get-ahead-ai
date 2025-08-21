import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ params: { userId: user?.id!, limit: 20 } }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>{t('home.title')}</h2>
          <p className='text-lg'>{t('home.subtitle')}</p>

          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href={`/${locale}/interview`}>
              {hasPastInterviews
                ? t('home.createInterview')
                : t('home.createFirstInterview')}
            </Link>
          </Button>
        </div>

        <Image
          src='/hr-woman.png'
          alt='robo-dude'
          width={400}
          height={400}
          className='max-sm:hidden'
        />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>{t('home.yourInterviews')}</h2>

        <div className='interviews-section'>
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id!}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>{t('home.noInterviews')}</p>
          )}
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>{t('home.takeInterviews')}</h2>

        <div className='interviews-section'>
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id!}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>{t('home.noAvailableInterviews')}</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
