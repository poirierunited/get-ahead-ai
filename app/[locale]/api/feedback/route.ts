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
import { logger } from '@/lib/logger';

// document this function.
export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request)) throw new TooManyRequestsError();

    const body = await request.json();
    const { interviewId, transcript, userid } =
      generateFeedbackSchema.parse(body);

    if (!userid || userid.trim().length === 0) {
      throw new BadRequestError('userid is required');
    }

    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1];

    const messages = await getMessages({ locale });

    const language = locale === 'es' ? 'Spanish' : 'English';

    const { feedbackId } = await generateAndStoreFeedbackService({
      interviewId,
      userId: userid,
      transcript,
      promptTemplate: messages.api.generateFeedback.prompt,
      systemTemplate: messages.api.generateFeedback.systemPrompt,
      language,
    });

    logger.info('generate_feedback_success', { userId: userid, interviewId });

    return NextResponse.json(
      {
        success: true,
        feedbackId,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error('generate_feedback_error', { message: error.message });
    }
    const { status, body } = toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const interviewId = searchParams.get('interviewId');
    const userId = searchParams.get('userId');
    const latest = searchParams.get('latest') === 'true';

    if (!interviewId || !userId) {
      return NextResponse.json(
        { success: false, error: 'interviewId and userId are required' },
        { status: 400 }
      );
    }

    // If latest=true, return only the most recent feedback (optimized for cards/list views)
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

    // Otherwise, return all feedbacks (for detail pages)
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
      logger.error('get_feedback_error', { message: error.message });
    }
    const { status, body } = toHttpResponse(error);
    return NextResponse.json(body, { status });
  }
}
