'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface FeedbackCardProps {
  feedback: Feedback;
  index: number;
  isLatest?: boolean;
  interviewId: string;
}

/**
 * FeedbackCard component displays a single feedback entry in a card format.
 * Shows score, date, and key metrics with visual indicators.
 */
export function FeedbackCard({
  feedback,
  index,
  isLatest = false,
  interviewId,
}: FeedbackCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <Link
      href={`/${locale}/interview/${interviewId}/feedback/${feedback.id}`}
      className={cn(
        'relative rounded-lg border p-6 transition-all hover:shadow-lg cursor-pointer block',
        isLatest && 'ring-2 ring-primary-200',
        getScoreBgColor(feedback.totalScore)
      )}
    >
      {isLatest && (
        <div className='absolute -top-3 left-4 bg-primary-200 text-white px-3 py-1 rounded-full text-xs font-semibold'>
          {t('feedback.latest')}
        </div>
      )}

      <div className='flex flex-col gap-4'>
        {/* Header with attempt number and date */}
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary-200/20 text-primary-200 font-bold'>
              #{feedback.attemptNumber}
            </div>
            <div>
              <p className='font-semibold text-lg'>
                {t('feedback.attempt')} {feedback.attemptNumber}
              </p>
              <div className='flex flex-row items-center gap-2 text-sm text-gray-500'>
                <Image
                  src='/calendar.svg'
                  width={16}
                  height={16}
                  alt='calendar'
                />
                <span>
                  {dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')}
                </span>
              </div>
            </div>
          </div>

          {/* Total Score */}
          <div className='flex flex-col items-end'>
            <p className='text-xs text-gray-500 mb-1'>
              {t('feedback.totalScore')}
            </p>
            <div
              className={cn(
                'text-3xl font-bold',
                getScoreColor(feedback.totalScore)
              )}
            >
              {feedback.totalScore}
              <span className='text-lg text-gray-500'>/100</span>
            </div>
          </div>
        </div>

        <hr className='border-gray-200' />

        {/* Category Scores */}
        <div className='grid grid-cols-2 gap-3'>
          {feedback.categoryScores.map((category, catIndex) => (
            <div key={catIndex} className='flex flex-col gap-1'>
              <div className='flex flex-row items-center justify-between'>
                <p className='text-sm font-medium text-gray-700'>
                  {t(`feedback.categories.${category.name}`)}
                </p>
                <span
                  className={cn(
                    'text-sm font-bold',
                    getScoreColor(category.score)
                  )}
                >
                  {category.score}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    category.score >= 80
                      ? 'bg-green-500'
                      : category.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  )}
                  style={{ width: `${category.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Summary */}
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-center gap-2'>
            <Image src='/star.svg' width={18} height={18} alt='star' />
            <p className='text-sm font-semibold'>
              {t('feedback.overallImpression')}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {feedback.finalAssessment}
          </p>
        </div>

        {/* Strengths and Areas for Improvement Preview */}
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='font-semibold text-green-700 mb-1'>
              {t('feedback.strengths')} ({feedback.strengths.length})
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-1'>
              {feedback.strengths.slice(0, 2).map((strength, idx) => (
                <li key={idx} className='line-clamp-1'>
                  {strength}
                </li>
              ))}
              {feedback.strengths.length > 2 && (
                <li className='text-gray-400'>
                  +{feedback.strengths.length - 2} {t('feedback.more')}
                </li>
              )}
            </ul>
          </div>
          <div>
            <p className='font-semibold text-orange-700 mb-1'>
              {t('feedback.areasForImprovement')} (
              {feedback.areasForImprovement.length})
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-1'>
              {feedback.areasForImprovement.slice(0, 2).map((area, idx) => (
                <li key={idx} className='line-clamp-1'>
                  {area}
                </li>
              ))}
              {feedback.areasForImprovement.length > 2 && (
                <li className='text-gray-400'>
                  +{feedback.areasForImprovement.length - 2}{' '}
                  {t('feedback.more')}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
}
