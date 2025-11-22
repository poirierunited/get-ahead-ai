'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicLogo } from './DynamicLogo';

import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { getInterviewerConfig } from '@/constants';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { logger, LogCategory } from '@/lib/logger';
import { ArrowLeft } from 'lucide-react';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  GENERATING_FEEDBACK = 'GENERATING_FEEDBACK',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  questions,
  profileImage,
  interviewType = 'mixed',
}: AgentProps) => {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [terminationReason, setTerminationReason] = useState<string | null>(
    null
  );
  const callStartTimeRef = useRef<number | null>(null);
  const callDurationSecondsRef = useRef<number | null>(null);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      callStartTimeRef.current = Date.now();
    };

    const onCallEnd = () => {
      if (callStartTimeRef.current) {
        const durationMs = Date.now() - callStartTimeRef.current;
        const durationSec = Math.round(durationMs / 1000);
        callDurationSecondsRef.current = durationSec;
      }
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }

      // Detect when the AI uses the end_interview_early function
      if (
        message.type === 'function-call' &&
        message.functionCall?.name === 'end_interview_early'
      ) {
        const reason = (message.functionCall.parameters as any)?.reason;
        setTerminationReason(reason);
        setCallStatus(CallStatus.CANCELLED);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      logger.error('Vapi error', {
        category: LogCategory.CLIENT_ERROR,
        error: error.message,
        errorName: error.name,
        interviewId,
        userId,
      });
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      // Ensure the ongoing call is stopped if the component unmounts
      try {
        vapi.stop();
      } catch {}
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  // Stop audio/call when user navigates away (back button, refresh, tab close)
  useEffect(() => {
    const stopCall = () => {
      try {
        vapi.stop();
      } catch {}
    };

    window.addEventListener('beforeunload', stopCall); //  when refreshing or closing the tab/window
    window.addEventListener('pagehide', stopCall); //  when closing the tab/window
    window.addEventListener('popstate', stopCall); //  when navigating back or forward

    return () => {
      window.removeEventListener('beforeunload', stopCall);
      window.removeEventListener('pagehide', stopCall);
      window.removeEventListener('popstate', stopCall);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      if (!userId) {
        logger.error('userId is missing for feedback generation', {
          category: LogCategory.CLIENT_ERROR,
          interviewId,
        });
        router.push(`/${locale}`);
        return;
      }

      // Set status to generating feedback before making the API call
      setCallStatus(CallStatus.GENERATING_FEEDBACK);

      try {
        const durationSeconds = callDurationSecondsRef.current;

        const res = await fetch(`/${locale}/api/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interviewId: interviewId!,
            transcript: messages,
            userid: userId,
            durationSeconds: durationSeconds || 0, // Always send a number, default to 0 if null
          }),
        });

        const data = await res.json();

        // Handle invalid transcript error (422)
        if (res.status === 422 && data?.error === 'InvalidTranscriptError') {
          logger.warn('Invalid transcript - redirecting to home', {
            category: LogCategory.CLIENT_ERROR,
            interviewId,
            userId,
            reason: data?.message,
            details: data?.details,
          });
          // Redirect to home without feedback
          router.push(`/${locale}`);
          return;
        }

        if (res.ok && data?.success && data?.feedbackId) {
          router.push(`/${locale}/interview/${interviewId}/feedback`);
          return;
        }
      } catch (err) {
        logger.error('Error saving feedback', {
          category: LogCategory.CLIENT_ERROR,
          error: err instanceof Error ? err.message : 'Unknown error',
          errorName: err instanceof Error ? err.name : 'Unknown',
          interviewId,
          userId,
        });
      }

      {
        router.push(`/${locale}/interview/${interviewId}/feedback`);
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      // Always generate feedback when interview finishes naturally
      handleGenerateFeedback(messages);
    } else if (
      callStatus === CallStatus.CANCELLED ||
      callStatus === CallStatus.CANCELLED_BY_USER
    ) {
      // Interview was cancelled - do NOT generate feedback, redirect to home
      router.push(`/${locale}`);
    }
  }, [
    messages,
    callStatus,
    feedbackId,
    interviewId,
    router,
    userId,
    locale,
    terminationReason,
  ]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    let formattedQuestions = '';
    if (questions) {
      formattedQuestions = questions
        .map((question) => `- ${question}`)
        .join('\n');
    }

    // Normalize locale to supported set
    const lang = (locale === 'es' ? 'es' : 'en') as 'en' | 'es';
    const interviewerConfig = getInterviewerConfig(lang, interviewType);
    await vapi.start(interviewerConfig, {
      variableValues: {
        questions: formattedQuestions,
      },
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const handleBackToHome = () => {
    // If call is active, stop it first
    if (callStatus === CallStatus.ACTIVE) {
      vapi.stop();
    }
    setCallStatus(CallStatus.CANCELLED_BY_USER);
  };

  return (
    <>
      <div className='call-view'>
        {/* AI Interviewer Card */}
        <div className='card-interviewer'>
          <div className='avatar'>
            <DynamicLogo
              alt='AI Interviewer'
              width={65}
              height={54}
              className='object-cover'
            />
            {isSpeaking && <span className='animate-speak' />}
          </div>
          <h3>{t('ai.interviewer')}</h3>
        </div>

        {/* User Profile Card */}
        <div className='card-border'>
          <div className='card-content'>
            <Image
              src={profileImage || '/user-avatar.png'}
              alt='profile-image'
              width={539}
              height={539}
              className='rounded-full object-cover size-[120px]'
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* Messages container */}
      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p
              key={lastMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100'
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className='w-full flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4'>
        {/* Back button - bottom on mobile, left on desktop */}
        <button
          className='btn-secondary flex items-center justify-center gap-2 w-full md:w-auto'
          onClick={() => handleBackToHome()}
          disabled={callStatus === CallStatus.GENERATING_FEEDBACK}
        >
          <ArrowLeft className='h-4 w-4' />
          {t('common.back')}
        </button>

        {/* Call control button - top on mobile (more prominent), right-aligned on desktop */}
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className='relative btn-call w-full md:w-auto'
            onClick={() => handleCall()}
            disabled={callStatus === CallStatus.GENERATING_FEEDBACK}
          >
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING &&
                  callStatus !== CallStatus.GENERATING_FEEDBACK &&
                  'hidden'
              )}
            />

            <span className='relative'>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? t('interview.startInterview')
                : callStatus === CallStatus.GENERATING_FEEDBACK
                ? t('interview.generatingFeedback')
                : '. . .'}
            </span>
          </button>
        ) : (
          <button
            className='btn-disconnect w-full md:w-auto'
            onClick={() => handleDisconnect()}
          >
            {t('interview.end')}
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
