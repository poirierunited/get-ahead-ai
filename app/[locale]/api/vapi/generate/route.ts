import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from 'next-intl/server';
import { getRandomInterviewCover } from '@/lib/utils';
import { generateInterviewSchema } from '@/lib/schemas/interview';
import { getUserIdFromRequest } from '@/lib/auth/server';
import { isRateLimited } from '@/lib/rate-limit';
import { toHttpResponse, TooManyRequestsError } from '@/lib/errors';
import { generateAndStoreInterview } from '@/lib/services/interview';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request)) throw new TooManyRequestsError();

    const body = await request.json();
    const { role, level, techstack, type, amount, userid } =
      generateInterviewSchema.parse(body);

    // Get the locale from the URL path
    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1]; // Extract locale from /[locale]/api/...

    // Get messages for the current locale
    const messages = await getMessages({ locale });

    const derivedUserId = (await getUserIdFromRequest(request)) ?? userid;
    const finalUserId = derivedUserId ?? 'unknown';

    const { interview, questions } = await generateAndStoreInterview({
      role,
      level,
      techstack,
      type,
      amount,
      userId: finalUserId,
      promptTemplate: messages.api.generateInterview.prompt,
      systemTemplate: messages.api.generateInterview.systemPrompt,
      language: locale === 'es' ? 'Spanish' : 'English',
    });

    // enrich interview with cover image (UI concern) before responding
    interview.coverImage = getRandomInterviewCover();

    logger.info('generate_interview_success', {
      userId: finalUserId,
      questionsCount: Array.isArray(questions) ? questions.length : 0,
    });

    return NextResponse.json(
      {
        success: true,
        questions: questions,
        interview: interview,
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
