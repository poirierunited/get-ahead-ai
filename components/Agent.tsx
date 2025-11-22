'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicLogo } from './DynamicLogo';

import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { getInterviewerConfig } from '@/constants';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { logger, LogCategory } from '@/lib/logger';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
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

  // Heuristic: a question is considered answered if there is at least one
  // meaningful user message between two assistant questions (or before the call ends).
  function countAnsweredQuestions(conversation: SavedMessage[]) {
    let inQuestion = false; // we saw an assistant question and are awaiting user reply
    let userReplied = false; // we saw at least one meaningful user message while inQuestion
    let answered = 0;

    const isLikelyQuestion = (text: string) => text.trim().endsWith('?');
    const hasMeaningfulContent = (text: string) => text.trim().length > 1;

    for (const message of conversation) {
      if (message.role === 'assistant') {
        if (isLikelyQuestion(message.content)) {
          // Starting a new question: finalize the previous one if user replied
          if (inQuestion && userReplied) answered += 1;
          inQuestion = true;
          userReplied = false;
        }
        // Non-question assistant messages do not change state
      } else if (message.role === 'user') {
        if (inQuestion && hasMeaningfulContent(message.content)) {
          userReplied = true; // count only once until the next assistant question
        }
      }
    }

    // If the conversation ended while still in the same question, count it if user replied
    if (inQuestion && userReplied) answered += 1;

    return answered;
  }

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
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

      // Guard: only generate feedback when at least 50% of questions were answered
      const totalQuestions = Array.isArray(questions) ? questions.length : 0;
      const answeredCount = countAnsweredQuestions(messages);
      const minRequired = Math.ceil(totalQuestions * 0.5);
      const meetsThreshold = totalQuestions > 0 && answeredCount >= minRequired;

      if (!meetsThreshold) {
        logger.warn('Skipping feedback: below 50% answered threshold', {
          totalQuestions,
          answeredCount,
          minRequired,
          interviewId,
          userId,
        });
        router.push(`/${locale}`);
        return;
      }

      // Set status to generating feedback before making the API call
      setCallStatus(CallStatus.GENERATING_FEEDBACK);

      try {
        const res = await fetch(`/${locale}/api/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interviewId: interviewId!,
            transcript: messages,
            userid: userId,
          }),
        });

        const data = await res.json();
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
      const totalQuestions = Array.isArray(questions) ? questions.length : 0;
      const answeredCount = countAnsweredQuestions(messages);
      const minRequired = Math.ceil(totalQuestions * 0.5);
      const meetsThreshold = totalQuestions > 0 && answeredCount >= minRequired;

      if (!meetsThreshold) {
        router.push(`/${locale}`);
        return;
      }

      handleGenerateFeedback(messages);
    } else if (callStatus === CallStatus.CANCELLED) {
      // Interview was cancelled by user - do NOT generate feedback
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

      <div className='w-full flex justify-center'>
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className='relative btn-call'
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
                ? t('interview.call')
                : callStatus === CallStatus.GENERATING_FEEDBACK
                ? t('interview.generatingFeedback')
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className='btn-disconnect' onClick={() => handleDisconnect()}>
            {t('interview.end')}
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
