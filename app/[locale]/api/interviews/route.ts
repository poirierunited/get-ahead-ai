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
import { logger } from '@/lib/logger';

// document this function.
export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request)) throw new TooManyRequestsError();

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
      throw new BadRequestError('userid is required');
    }

    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1];

    const messages = await getMessages({ locale });

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
        language: locale === 'es' ? 'Spanish' : 'English',
      });

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
  try {
    const { searchParams, pathname } = request.nextUrl;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const locale = pathname.split('/')[1];

    // Get single interview by ID
    if (id) {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'id is required' },
          { status: 400 }
        );
      }

      const interview = await getInterviewByIdService(id);
      if (!interview) {
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
      const type = searchParams.get('type');

      if (type === 'user') {
        // Get user's own interviews
        const interviews = await getInterviewsByUserIdService(userId);
        return NextResponse.json(
          { success: true, interviews, locale },
          { status: 200 }
        );
      } else {
        // Get latest interviews (excluding user's own)
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const interviews = await getLatestInterviewsService(userId, limitNum);
        return NextResponse.json(
          { success: true, interviews, locale },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'id or userId is required' },
      { status: 400 }
    );
  } catch (error) {
    const { status, body } = toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
