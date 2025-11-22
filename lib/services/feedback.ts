import 'server-only';
import { z } from 'zod';
import { db } from '@/firebase/admin';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { feedbackSchema as feedbackZod } from '@/constants';
import { savedMessageSchema } from '@/lib/schemas/feedback';
import { BadRequestError } from '@/lib/errors';
import {
  getFeedbackByInterviewId as repoGetFeedbackByInterviewId,
  getAllFeedbacksByInterviewId as repoGetAllFeedbacksByInterviewId,
} from '@/lib/repositories/interviews';
import { logger, LogCategory } from '@/lib/logger';

interface GenerateFeedbackServiceParams {
  interviewId: string;
  userId: string;
  transcript: Array<z.infer<typeof savedMessageSchema>>;
  promptTemplate: string; // messages.api.generateFeedback.prompt
  systemTemplate: string; // messages.api.generateFeedback.systemPrompt
  language: 'English' | 'Spanish';
  requestId?: string;
}

interface GenerateFeedbackServiceResult {
  feedbackId: string;
}

/**
 * Generates structured feedback from a transcript using LLM and stores it.
 *
 * This service:
 * 1. Validates input parameters.
 * 2. Calculates the attempt number.
 * 3. Formats the transcript for the LLM.
 * 4. Calls the AI model to generate feedback.
 * 5. Stores the feedback in the database.
 *
 * @param params - The parameters for generating feedback.
 * @returns The ID of the created feedback document.
 * @throws {BadRequestError} If userId or interviewId is missing.
 */
export async function generateAndStoreFeedbackService(
  params: GenerateFeedbackServiceParams
): Promise<GenerateFeedbackServiceResult> {
  const {
    interviewId,
    userId,
    transcript,
    promptTemplate,
    systemTemplate,
    language,
    requestId,
  } = params;

  const startTime = Date.now();

  try {
    if (!userId) {
      logger.error('Missing userId in feedback service', {
        category: LogCategory.VALIDATION_ERROR,
        requestId,
        interviewId,
      });
      throw new BadRequestError('userid is required');
    }

    if (!interviewId) {
      logger.error('Missing interviewId in feedback service', {
        category: LogCategory.VALIDATION_ERROR,
        requestId,
        userId,
      });
      throw new BadRequestError('interviewId is required');
    }

    const existingFeedbacks = await repoGetAllFeedbacksByInterviewId(
      interviewId,
      userId
    );
    const attemptNumber = existingFeedbacks.length + 1;

    const formattedTranscript = transcript
      .map((s) => `- ${s.role}: ${s.content}\n`)
      .join('');

    const prompt = promptTemplate.replace('{transcript}', formattedTranscript);
    const system = systemTemplate.replace('{language}', language);

    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001', { structuredOutputs: false }),
      schema: feedbackZod,
      prompt,
      system,
    });

    const feedback = {
      interviewId,
      userId,
      attemptNumber,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      starEvaluation: object.starEvaluation,
      createdAt: new Date().toISOString(),
    } as const;

    const feedbackRef = db.collection('feedback').doc();
    await feedbackRef.set(feedback);

    const totalDuration = Date.now() - startTime;
    logger.info('Feedback stored successfully', {
      category: LogCategory.FEEDBACK_GENERATE,
      requestId,
      userId,
      interviewId,
      feedbackId: feedbackRef.id,
      duration: totalDuration,
    });

    return { feedbackId: feedbackRef.id };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof Error) {
      logger.error('Feedback service failed', {
        category: LogCategory.SYSTEM_ERROR,
        requestId,
        userId,
        interviewId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
        duration,
      });
    }

    throw error;
  }
}

/**
 * Get the most recent feedback by interview ID and user ID.
 * Optimized for list/card views where only the latest score is needed.
 *
 * @param interviewId - The ID of the interview.
 * @param userId - The ID of the user.
 * @returns The most recent feedback or null if none exists.
 */
export async function getFeedbackByInterviewIdService(
  interviewId: string,
  userId: string
) {
  try {
    const feedback = await repoGetFeedbackByInterviewId(interviewId, userId);
    return feedback;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch latest feedback', {
        category: LogCategory.DB_ERROR,
        interviewId,
        userId,
        error: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Get all feedbacks by interview ID and user ID, ordered by creation date (newest first).
 *
 * @param interviewId - The ID of the interview.
 * @param userId - The ID of the user.
 * @returns A list of feedback objects.
 */
export async function getAllFeedbacksByInterviewIdService(
  interviewId: string,
  userId: string
): Promise<Feedback[]> {
  try {
    const feedbacks = await repoGetAllFeedbacksByInterviewId(
      interviewId,
      userId
    );
    return feedbacks;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch all feedbacks', {
        category: LogCategory.DB_ERROR,
        interviewId,
        userId,
        error: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}
