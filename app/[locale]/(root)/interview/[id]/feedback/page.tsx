import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { FeedbackCard } from '@/components/FeedbackCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { logger } from '@/lib/logger';

const Feedback = async ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) => {
  const { id, locale } = await params;
  const user = await getCurrentUser();
  const t = await getTranslations({ locale });
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  // Fetch interview from API
  let interview;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/api/interviews?id=${id}`,
      {
        cache: 'no-store',
      }
    );
    const data = await response.json();
    if (!data.success || !data.interview) {
      redirect(`/${locale}`);
    }
    interview = data.interview;
  } catch (error) {
    logger.error('error_fetching_interview', { error });
    redirect(`/${locale}`);
  }

  // Fetch all feedbacks from API
  let feedbacks: Feedback[] = [];
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/${locale}/api/feedback?interviewId=${id}&userId=${user?.id!}`,
      {
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (data.success && data.feedbacks && Array.isArray(data.feedbacks)) {
      feedbacks = data.feedbacks;
      logger.info('feedbacks_loaded', { count: feedbacks.length });
    } else {
      logger.warn('no_feedbacks_found_or_invalid_response', { data });
    }
  } catch (error) {
    logger.error('error_fetching_feedbacks', { error });
  }

  return (
    <section className='section-feedback'>
      <div className='flex flex-row justify-center mb-6'>
        <h1 className='text-4xl font-semibold'>
          {t('feedback.title')} -{' '}
          <span className='capitalize'>{interview.role}</span>
        </h1>
      </div>

      {feedbacks.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-lg text-gray-500 mb-4'>
            {t('feedback.noFeedbacks')}
          </p>
          <Button className='btn-primary'>
            <Link
              href={`/${locale}/interview/${id}`}
              className='flex items-center justify-center gap-2'
            >
              <RotateCcw className='h-4 w-4' />
              {t('navigation.retakeInterview')}
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold mb-2'>
              {t('feedback.allFeedbacks')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              <b>{t('feedback.totalAttemptsDone')}: </b>
              {feedbacks.length}{' '}
              {feedbacks.length === 1
                ? t('feedback.attempt')
                : t('feedback.attempt') + 's'}
            </p>
          </div>

          <div className='flex flex-col gap-6'>
            {feedbacks.map((feedback, index) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                index={index}
                isLatest={index === 0}
                interviewId={id}
              />
            ))}
          </div>
        </>
      )}

      <div className='buttons mt-8'>
        <Button className='btn-secondary flex-1'>
          <Link
            href={`/${locale}`}
            className='flex w-full items-center justify-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            {t('navigation.backToDashboard')}
          </Link>
        </Button>

        <Button className='btn-primary flex-1'>
          <Link
            href={`/${locale}/interview/${id}`}
            className='flex w-full items-center justify-center gap-2'
          >
            <RotateCcw className='h-4 w-4' />
            {t('navigation.retakeInterview')}
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
