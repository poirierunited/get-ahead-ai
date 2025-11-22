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
import {
  generateAndStoreInterview,
  getInterviewByIdService,
  getLatestInterviewsService,
  getInterviewsByUserIdService,
} from '@/lib/services/interview';
import { logger, generateRequestId, LogCategory } from '@/lib/logger';

/**
 * Creates a new interview session using AI generation.
 *
 * This endpoint accepts interview parameters (role, tech stack, etc.),
 * generates interview questions using the AI service, and stores the
 * interview session in the database.
 *
 * @param request - The NextRequest object containing the JSON body with interview details.
 * @returns A NextResponse containing the created interview, questions, and document ID.
 *
 * @throws {TooManyRequestsError} If the user has exceeded the rate limit.
 * @throws {BadRequestError} If the user ID is missing or invalid.
 * @throws {ZodError} If the request body does not match the expected schema.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1];

    if (isRateLimited(request)) {
      logger.warn('Rate limit exceeded for interview generation', {
        category: LogCategory.RATE_LIMIT,
        requestId,
        ip:
          request.headers.get('x-real-ip') ??
          request.headers.get('x-forwarded-for') ??
          'unknown',
      });
      throw new TooManyRequestsError();
    }

    const body = await request.json();
    const {
      title,
      role,
      level,
      techstack,
      type,
      amount,
      userid,
      jobDescription,
    } = generateInterviewSchema.parse(body);

    if (!userid || userid.trim().length === 0) {
      logger.error('Missing userId in interview request', {
        category: LogCategory.VALIDATION_ERROR,
        requestId,
      });
      throw new BadRequestError('userid is required');
    }

    const messages = await getMessages({ locale });
    const language = locale === 'es' ? 'Spanish' : 'English';

    const { interview, questions, documentId } =
      await generateAndStoreInterview({
        title,
        role,
        level,
        techstack,
        type,
        amount,
        jobDescription,
        userId: userid,
        promptTemplate: messages.api.generateInterview.prompt,
        systemTemplate: messages.api.generateInterview.systemPrompt,
        language,
        requestId,
      });

    interview.coverImage = getRandomInterviewCover();

    const duration = Date.now() - startTime;
    logger.info('Interview generated successfully', {
      category: LogCategory.API_RESPONSE,
      requestId,
      userId: userid,
      interviewId: documentId,
      questionsCount: Array.isArray(questions) ? questions.length : 0,
      duration,
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
    const duration = Date.now() - startTime;

    if (error instanceof Error) {
      logger.error('Interview generation failed', {
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
 * Retrieves interview data based on search parameters.
 *
 * Supports three modes:
 * 1. Get single interview by `id`.
 * 2. Get all interviews for a specific user (`userId` + `type=user`).
 * 3. Get latest public interviews (`userId` + no type).
 *
 * @param request - The NextRequest object containing URL search parameters.
 * @returns A NextResponse containing the requested interview(s) or an error.
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const { searchParams, pathname } = request.nextUrl;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const type = searchParams.get('type');
    const locale = pathname.split('/')[1];

    // Get single interview by ID
    if (id) {
      const interview = await getInterviewByIdService(id);

      if (!interview) {
        logger.warn('Interview not found', {
          category: LogCategory.INTERVIEW_FETCH,
          requestId,
          interviewId: id,
        });

        return NextResponse.json(
          { success: false, error: 'Interview not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, interview, locale },
        { status: 200 }
      );
    }

    // Get latest interviews or user interviews
    if (userId) {
      if (type === 'user') {
        const interviews = await getInterviewsByUserIdService(userId);

        return NextResponse.json(
          { success: true, interviews, locale },
          { status: 200 }
        );
      } else {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const interviews = await getLatestInterviewsService(userId, limitNum);

        return NextResponse.json(
          { success: true, interviews, locale },
          { status: 200 }
        );
      }
    }

    logger.error('Missing required parameters', {
      category: LogCategory.VALIDATION_ERROR,
      requestId,
    });

    return NextResponse.json(
      { success: false, error: 'id or userId is required' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Interview fetch failed', {
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
