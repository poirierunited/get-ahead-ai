import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from 'next-intl/server';
import { getRandomInterviewCover } from '@/lib/utils';
import { generateInterviewSchema } from '@/lib/schemas/interview';
import { isRateLimited } from '@/lib/rate-limit';
import {
  toHttpResponse,
  TooManyRequestsError,
  BadRequestError,
} from '@/lib/errors';
import { generateAndStoreInterview } from '@/lib/services/interview';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request)) throw new TooManyRequestsError();

    const body = await request.json();
    const { title, role, level, techstack, type, amount, userid } =
      generateInterviewSchema.parse(body);

    if (!userid || userid.trim().length === 0) {
      throw new BadRequestError('userid is required');
    }

    // Get the locale from the URL path
    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1]; // Extract locale from /[locale]/api/...

    // Get messages for the current locale
    const messages = await getMessages({ locale });

    const { interview, questions, documentId } =
      await generateAndStoreInterview({
        title,
        role,
        level,
        techstack,
        type,
        amount,
        userId: userid,
        promptTemplate: messages.api.generateInterview.prompt,
        systemTemplate: messages.api.generateInterview.systemPrompt,
        language: locale === 'es' ? 'Spanish' : 'English',
      });

    // enrich interview with cover image (UI concern) before responding
    interview.coverImage = getRandomInterviewCover();

    logger.info('generate_interview_success', {
      userId: userid,
      questionsCount: Array.isArray(questions) ? questions.length : 0,
    });

    return NextResponse.json(
      {
        success: true,
        questions: questions,
        interview: interview,
        documentId: documentId,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error('generate_interview_error', { message: error.message });
    }
    const { status, body } = toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];
  return NextResponse.json({
    message: 'Endpoint working, language: ' + locale,
  });
}
