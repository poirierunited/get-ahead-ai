'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from './ui/button';
import DisplayTechIcons from './DisplayTechIcons';

import { cn, getRandomInterviewCover } from '@/lib/utils';

interface InterviewCardProps {
  interviewId: string;
  userId: string;
  title: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

const InterviewCard = ({
  interviewId,
  userId,
  title,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [feedback, setFeedback] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fetch feedback data on client side
    const fetchFeedback = async () => {
      if (userId && interviewId) {
        try {
          const response = await fetch(
            `/${locale}/api/feedback?interviewId=${interviewId}&userId=${userId}`
          );
          const data = await response.json();
          if (data.success && data.feedback) {
            setFeedback(data.feedback);
          }
        } catch (error) {
          console.error('Error fetching feedback:', error);
        }
      }
    };

    fetchFeedback();
  }, [userId, interviewId]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className='card-border w-[360px] max-sm:w-full min-h-96'>
        <div className='card-interview'>
          <div className='animate-pulse'>
            <div className='w-20 h-6 bg-gray-200 rounded absolute top-0 right-0'></div>
            <div className='w-[90px] h-[90px] bg-gray-200 rounded-full'></div>
            <div className='h-6 bg-gray-200 rounded mt-5 w-3/4'></div>
            <div className='h-4 bg-gray-200 rounded mt-3 w-1/2'></div>
            <div className='h-4 bg-gray-200 rounded mt-5 w-full'></div>
          </div>
        </div>
      </div>
    );
  }

  const typeKey = /mix/gi.test(type)
    ? 'mixed'
    : /behav/gi.test(type)
    ? 'behavioral'
    : 'technical';

  const badgeColor =
    {
      behavioral: 'badge-behavioral',
      mixed: 'badge-mixed',
      technical: 'badge-technical',
    }[typeKey] || 'badge-mixed';

  const typeLabel = t(`interview.types.${typeKey}`);

  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now())
    .locale(locale)
    .format('MMM D, YYYY');

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview flex flex-col'>
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              'absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg',
              badgeColor
            )}
          >
            <p className='badge-text '>{typeLabel}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomInterviewCover()}
            alt='cover-image'
            width={90}
            height={90}
            className='rounded-full object-fit size-[90px]'
          />

          {/* Tech Stack Pills */}
          <div className='mt-4 flex justify-start'>
            <DisplayTechIcons techStack={techstack} />
          </div>

          {/* Interview Title and Role */}
          <h3 className='mt-3'>{title}</h3>
          <p className='text-sm text-muted-foreground capitalize'>{role}</p>

          {/* Date & Score */}
          <div className='flex flex-row gap-5 mt-3'>
            <div className='flex flex-row gap-2'>
              <Image
                src='/calendar.svg'
                width={22}
                height={22}
                alt='calendar'
              />
              <p>{formattedDate}</p>
            </div>

            <div className='flex flex-row gap-2 items-center'>
              <Image src='/star.svg' width={22} height={22} alt='star' />
              <p>{feedback?.totalScore || '---'}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className='line-clamp-3 mt-5 text-sm'>
            {feedback?.finalAssessment || t('interview.notTakenYet')}
          </p>
        </div>

        <div className='mt-6'>
          <Button className='btn-primary w-full'>
            <Link
              href={
                feedback
                  ? `/${locale}/interview/${interviewId}/feedback`
                  : `/${locale}/interview/${interviewId}`
              }
            >
              {feedback
                ? t('interview.checkFeedback')
                : t('interview.viewInterview')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
