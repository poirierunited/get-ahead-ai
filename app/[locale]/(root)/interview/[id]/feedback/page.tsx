import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { ArrowLeft, RotateCcw } from 'lucide-react';

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
    console.error('Error fetching interview:', error);
    redirect(`/${locale}`);
  }

  // Fetch feedback from API
  let feedback = null;
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
    if (data.success && data.feedback) {
      feedback = data.feedback;
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
  }

  return (
    <section className='section-feedback'>
      <div className='flex flex-row justify-center'>
        <h1 className='text-4xl font-semibold'>
          {t('feedback.title')} -{' '}
          <span className='capitalize'>{interview.role}</span>
        </h1>
      </div>

      <div className='flex flex-row justify-center '>
        <div className='flex flex-row gap-5'>
          {/* Overall Impression */}
          <div className='flex flex-row gap-2 items-center'>
            <Image src='/star.svg' width={22} height={22} alt='star' />
            <p>
              {t('feedback.overallImpression')}:{' '}
              <span className='text-primary-200 font-bold'>
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className='flex flex-row gap-2'>
            <Image src='/calendar.svg' width={22} height={22} alt='calendar' />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className='flex flex-col gap-4'>
        <h2>{t('feedback.breakdown')}:</h2>
        {feedback?.categoryScores?.map((category: any, index: number) => (
          <div key={index}>
            <p className='font-bold'>
              {index + 1}. {t(`feedback.categories.${category.name}`)} (
              {category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-3'>
        <h3>{t('feedback.strengths')}</h3>
        <ul>
          {feedback?.strengths?.map((strength: string, index: number) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-3'>
        <h3>{t('feedback.areasForImprovement')}</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className='buttons'>
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
