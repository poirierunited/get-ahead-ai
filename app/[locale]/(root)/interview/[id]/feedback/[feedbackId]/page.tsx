import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { logger, LogCategory } from '@/lib/logger';

const FeedbackDetail = async ({
  params,
}: {
  params: Promise<{ id: string; feedbackId: string; locale: string }>;
}) => {
  const { id, feedbackId, locale } = await params;
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
    logger.error('Failed to fetch interview for feedback detail page', {
      category: LogCategory.CLIENT_ERROR,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
      interviewId: id,
      feedbackId,
      userId: user?.id,
      locale,
    });
    redirect(`/${locale}`);
  }

  // Fetch all feedbacks to find the specific one
  let feedback: Feedback | null = null;
  let totalAttempts = 0;
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
      const feedbacks = data.feedbacks;
      totalAttempts = feedbacks.length;
      feedback = feedbacks.find((f: Feedback) => f.id === feedbackId) || null;
    }
  } catch (error) {
    logger.error('Failed to fetch feedbacks for feedback detail page', {
      category: LogCategory.CLIENT_ERROR,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
      interviewId: id,
      feedbackId,
      userId: user?.id,
      locale,
    });
  }

  // If feedback not found, redirect to feedback list
  if (!feedback) {
    redirect(`/${locale}/interview/${id}/feedback`);
  }

  return (
    <section className='section-feedback'>
      <div className='flex flex-row justify-center mb-6'>
        <h1 className='text-4xl font-semibold'>
          {t('feedback.title')} -{' '}
          <span className='capitalize'>{interview.role}</span>
        </h1>
      </div>

      <div className='flex flex-row justify-center mb-2'>
        <p className='text-lg text-gray-600 dark:text-gray-300'>
          <span className='font-semibold'>
            {t('feedback.attempt')} {feedback.attemptNumber}
          </span>{' '}
          {t('feedback.of')} {totalAttempts}
        </p>
      </div>

      <div className='flex flex-row justify-center mb-6'>
        <div className='flex flex-row gap-5'>
          {/* Overall Impression */}
          <div className='flex flex-row gap-2 items-center'>
            <Image src='/star.svg' width={22} height={22} alt='star' />
            <p>
              {t('feedback.overallImpression')}:{' '}
              <span className='text-primary-200 font-bold'>
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className='flex flex-row gap-2'>
            <Image src='/calendar.svg' width={22} height={22} alt='calendar' />
            <p>{dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')}</p>
          </div>
        </div>
      </div>

      <hr />

      <p className='mb-6'>{feedback.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className='flex flex-col gap-4 mb-6'>
        <h2 className='text-2xl font-semibold'>{t('feedback.breakdown')}:</h2>
        {feedback.categoryScores?.map((category: any, index: number) => (
          <div key={index} className='border rounded-lg p-4'>
            <p className='font-bold text-lg mb-2'>
              {index + 1}. {t(`feedback.categories.${category.name}`)} (
              {category.score}/100)
            </p>
            <div className='text-gray-700 dark:text-gray-300 whitespace-pre-line'>
              {category.comment}
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-3 mb-6'>
        <h3 className='text-xl font-semibold'>{t('feedback.strengths')}</h3>
        <ul className='list-disc list-inside space-y-2'>
          {feedback.strengths?.map((strength: string, index: number) => (
            <li key={index} className='text-gray-700 dark:text-gray-300'>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-3 mb-8'>
        <h3 className='text-xl font-semibold'>
          {t('feedback.areasForImprovement')}
        </h3>
        <ul className='list-disc list-inside space-y-2'>
          {feedback.areasForImprovement?.map((area: string, index: number) => (
            <li key={index} className='text-gray-700 dark:text-gray-300'>
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* STAR Evaluation Section */}
      {feedback.starEvaluation && (
        <div className='flex flex-col gap-4 mb-8 border-t pt-6'>
          <h2 className='text-2xl font-semibold flex items-center gap-2'>
            {t('feedback.starEvaluation')}
          </h2>

          <div className='border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20'>
            <div className='flex items-center gap-3 mb-3'>
              <Image src='/star.svg' width={20} height={20} alt='star' />
              <p className='font-bold text-lg'>
                {t('feedback.starScore')}:{' '}
                <span className='text-primary-200'>
                  {feedback.starEvaluation.overallScore}
                </span>
                /100
              </p>
            </div>
            <p className='text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line'>
              {feedback.starEvaluation.comment}
            </p>

            {/* Missing STAR Elements */}
            {feedback.starEvaluation.missingElements &&
              feedback.starEvaluation.missingElements.length > 0 && (
                <div className='mb-4'>
                  <h4 className='font-semibold mb-2'>
                    {t('feedback.missingElements')}:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {feedback.starEvaluation.missingElements.map(
                      (element: string, index: number) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium'
                        >
                          {element === 'S' && t('feedback.starElementS')}
                          {element === 'T' && t('feedback.starElementT')}
                          {element === 'A' && t('feedback.starElementA')}
                          {element === 'R' && t('feedback.starElementR')}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Actionable STAR Examples */}
            {feedback.starEvaluation.actionableExamples &&
              feedback.starEvaluation.actionableExamples.length > 0 && (
                <div>
                  <h4 className='font-semibold mb-2'>
                    {t('feedback.actionableExamples')}:
                  </h4>
                  <ul className='list-decimal list-inside space-y-3'>
                    {feedback.starEvaluation.actionableExamples.map(
                      (example: string, index: number) => (
                        <li
                          key={index}
                          className='text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-blue-500'
                        >
                          <span className='whitespace-pre-line'>{example}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        </div>
      )}

      <div className='buttons'>
        <Button className='btn-secondary flex-1'>
          <Link
            href={`/${locale}/interview/${id}/feedback`}
            className='flex w-full items-center justify-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            {t('feedback.backToHistory')}
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

export default FeedbackDetail;
