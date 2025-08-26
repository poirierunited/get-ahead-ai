import Image from 'next/image';
import { redirect } from 'next/navigation';

import Agent from '@/components/Agent';
import { getRandomInterviewCover } from '@/lib/utils';

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getTranslations } from 'next-intl/server';

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

  const interview = await getInterviewById(id);
  if (!interview) redirect(`/${locale}`);

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <>
      <div className='flex flex-row gap-4 justify-between'>
        <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
          <div className='flex flex-row gap-4 items-center'>
            <Image
              src={getRandomInterviewCover()}
              alt='cover-image'
              width={40}
              height={40}
              className='rounded-full object-cover size-[40px]'
            />
            <h3 className='capitalize'>
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
            <div className={`w-fit px-4 py-2 rounded-md ${badgeColor}`}>
              <p className='badge-text'>{t(`interview.types.${typeKey}`)}</p>
            </div>
          );
        })()}
      </div>

      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={id}
        type='interview'
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default InterviewDetails;
