import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from 'next-intl/server';
import { isRateLimited } from '@/lib/rate-limit';
import {
  toHttpResponse,
  TooManyRequestsError,
  BadRequestError,
} from '@/lib/errors';
import { generateFeedbackSchema } from '@/lib/schemas/feedback';
import {
  generateAndStoreFeedbackService,
  getFeedbackByInterviewIdService,
  getAllFeedbacksByInterviewIdService,
} from '@/lib/services/feedback';
import { logger, generateRequestId, LogCategory } from '@/lib/logger';

/**
 * Generates and stores feedback for a completed interview.
 *
 * This endpoint accepts the interview transcript and ID, uses AI to generate
 * constructive feedback, and stores the result in the database.
 *
 * @param request - The NextRequest object containing the JSON body with transcript and interview ID.
 * @returns A NextResponse containing the created feedback ID.
 *
 * @throws {TooManyRequestsError} If the user has exceeded the rate limit.
 * @throws {BadRequestError} If the user ID is missing.
 * @throws {ZodError} If the request body does not match the expected schema.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1];

    if (isRateLimited(request)) {
      logger.warn('Rate limit exceeded for feedback generation', {
        category: LogCategory.RATE_LIMIT,
        requestId,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      throw new TooManyRequestsError();
    }

    const body = await request.json();
    const { interviewId, transcript, userid, durationSeconds } =
      generateFeedbackSchema.parse(body);

    if (!userid || userid.trim().length === 0) {
      logger.error('Missing userId in feedback request', {
        category: LogCategory.VALIDATION_ERROR,
        requestId,
        interviewId,
      });
      throw new BadRequestError('userid is required');
    }

    const messages = await getMessages({ locale });
    const language = locale === 'es' ? 'Spanish' : 'English';

    const { feedbackId } = await generateAndStoreFeedbackService({
      interviewId,
      userId: userid,
      transcript,
      promptTemplate: messages.api.generateFeedback.prompt,
      systemTemplate: messages.api.generateFeedback.systemPrompt,
      language,
      requestId,
      durationSeconds,
    });

    const duration = Date.now() - startTime;
    logger.info('Feedback generated successfully', {
      category: LogCategory.API_RESPONSE,
      requestId,
      userId: userid,
      interviewId,
      feedbackId,
      duration,
    });

    return NextResponse.json(
      {
        success: true,
        feedbackId,
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof Error) {
      logger.error('Feedback generation failed', {
        category: LogCategory.API_ERROR,
        requestId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
        duration,
      });
    }

    const { status, body } = toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

/**
 * Retrieves feedback for a specific interview.
 *
 * Supports two modes:
 * 1. Latest: Returns only the most recent feedback entry (`latest=true`).
 * 2. All: Returns a list of all feedback entries for the interview.
 *
 * @param request - The NextRequest object containing URL search parameters (interviewId, userId, latest).
 * @returns A NextResponse containing the requested feedback data.
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const { searchParams } = request.nextUrl;
    const interviewId = searchParams.get('interviewId');
    const userId = searchParams.get('userId');
    const latest = searchParams.get('latest') === 'true';

    if (!interviewId || !userId) {
      logger.error('Missing required parameters for feedback fetch', {
        category: LogCategory.VALIDATION_ERROR,
        requestId,
        interviewId: interviewId || undefined,
        userId: userId || undefined,
      });

      return NextResponse.json(
        { success: false, error: 'interviewId and userId are required' },
        { status: 400 }
      );
    }

    if (latest) {
      const feedback = await getFeedbackByInterviewIdService(
        interviewId,
        userId
      );

      return NextResponse.json(
        { success: true, feedback, latest: true },
        { status: 200 }
      );
    }

    const feedbacks = await getAllFeedbacksByInterviewIdService(
      interviewId,
      userId
    );

    return NextResponse.json(
      { success: true, feedbacks, count: feedbacks.length },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Feedback fetch failed', {
        category: LogCategory.API_ERROR,
        requestId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }

    const { status, body } = toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
