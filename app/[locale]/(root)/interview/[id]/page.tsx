import Image from 'next/image';
import { redirect } from 'next/navigation';

import Agent from '@/components/Agent';
import { getRandomInterviewCover } from '@/lib/utils';

import { getCurrentUser } from '@/lib/actions/auth.action';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getTranslations } from 'next-intl/server';
import { logger } from '@/lib/logger';

const InterviewDetails = async ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) => {
  const { id, locale } = await params;
  const t = await getTranslations({ locale });

  const user = await getCurrentUser();
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

  // Fetch feedback from API
  let feedback = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/api/feedback?interviewId=${id}&userId=${user.id}`,
      {
        cache: 'no-store',
      }
    );
    const data = await response.json();
    if (data.success && data.feedback) {
      feedback = data.feedback;
    }
  } catch (error) {
    logger.error('error_fetching_feedback', { error });
  }

  return (
    <>
      <div className='flex flex-col md:flex-row gap-3 md:gap-4 md:justify-between md:items-center'>
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center'>
          <div className='flex flex-row gap-3 items-center'>
            <Image
              src={getRandomInterviewCover()}
              alt='cover-image'
              width={40}
              height={40}
              className='rounded-full object-cover size-[40px]'
            />
            <h3 className='capitalize text-base md:text-lg'>
              {interview.role} {t('interviewDetails.interview')}
            </h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        {(() => {
          const type = String(interview.type || '').toLowerCase();
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
          return (
            <div className={`w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-md ${badgeColor} self-start md:self-auto`}>
              <p className='badge-text text-sm'>{t(`interview.types.${typeKey}`)}</p>
            </div>
          );
        })()}
      </div>

      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={id}
        questions={interview.questions}
        feedbackId={feedback?.id}
        interviewType={interview.type as 'technical' | 'behavioral' | 'mixed'}
      />
    </>
  );
};

export default InterviewDetails;
