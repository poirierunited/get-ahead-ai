import 'server-only';
import {
  buildGenerateInterviewPrompt,
  buildSystemPrompt,
} from '@/lib/ai/prompts';
import { generateTextWithModel, models } from '@/lib/ai/client';
import {
  createInterview,
  getInterviewById as repoGetInterviewById,
  getLatestInterviews as repoGetLatestInterviews,
  getInterviewsByUserId as repoGetInterviewsByUserId,
} from '@/lib/repositories/interviews';
import type { InterviewEntity, InterviewQuestion } from '@/types/interview';
import { BadRequestError } from '@/lib/errors';
import { logger, LogCategory } from '@/lib/logger';

interface GenerateInterviewServiceParams {
  title: string;
  role: string;
  level: string;
  techstack: string; // comma-separated
  type: string;
  amount: number;
  jobDescription?: string;
  userId: string;
  promptTemplate: string;
  systemTemplate: string;
  language: 'English' | 'Spanish';
  requestId?: string;
}

interface GenerateInterviewServiceResult {
  interview: InterviewEntity;
  questions: InterviewQuestion[];
  documentId: string;
}

/**
 * Orchestrates interview generation: builds prompts, calls the AI, parses the JSON,
 * builds the entity, persists it, and returns the stored entity and generated questions.
 *
 * @param params - The parameters for generating an interview.
 * @returns The generated interview entity, questions, and document ID.
 * @throws {BadRequestError} If the AI returns invalid JSON.
 */
export async function generateAndStoreInterview(
  params: GenerateInterviewServiceParams
): Promise<GenerateInterviewServiceResult> {
  const {
    title,
    role,
    level,
    techstack,
    type,
    amount,
    jobDescription,
    userId,
    promptTemplate,
    systemTemplate,
    language,
    requestId,
  } = params;

  const startTime = Date.now();

  try {
    const prompt = buildGenerateInterviewPrompt({
      template: promptTemplate,
      role,
      level,
      techstack,
      type,
      amount,
      jobDescription,
    });

    const system = buildSystemPrompt(systemTemplate, language);

    const text = await generateTextWithModel({
      model: models.geminiFlash(),
      prompt,
      system,
    });

    let questions: InterviewQuestion[];
    try {
      questions = JSON.parse(text);
      if (!Array.isArray(questions))
        throw new Error('Questions is not an array');
    } catch (parseError) {
      logger.error('AI returned invalid JSON', {
        category: LogCategory.AI_ERROR,
        requestId,
        userId,
        sample: text.slice(0, 100),
        error:
          parseError instanceof Error ? parseError.message : 'Unknown error',
      });
      throw new BadRequestError('AI returned invalid JSON');
    }

    const entity: InterviewEntity = {
      title,
      role,
      type,
      level,
      techstack: techstack.split(','),
      questions,
      userId,
      finalized: true,
      coverImage: '', // to be set by caller if needed
      createdAt: new Date().toISOString(),
    };

    const documentId = await createInterview(entity);

    const totalDuration = Date.now() - startTime;
    logger.info('Interview created successfully', {
      category: LogCategory.INTERVIEW_GENERATE,
      requestId,
      userId,
      interviewId: documentId,
      questionsCount: questions.length,
      duration: totalDuration,
    });

    return { interview: entity, questions, documentId };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof Error) {
      logger.error('Interview service failed', {
        category: LogCategory.SYSTEM_ERROR,
        requestId,
        userId,
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
 * Retrieves a single interview by its ID.
 *
 * @param id - The ID of the interview to retrieve.
 * @returns The interview entity or null if not found.
 */
export async function getInterviewByIdService(id: string) {
  try {
    const interview = await repoGetInterviewById(id);
    return interview;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch interview by ID', {
        category: LogCategory.DB_ERROR,
        interviewId: id,
        error: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Get latest interviews excluding user's own interviews.
 *
 * @param userId - The ID of the current user (to exclude their interviews).
 * @param limit - The maximum number of interviews to return (default: 20).
 * @returns A list of interview entities.
 */
export async function getLatestInterviewsService(
  userId: string,
  limit: number = 20
) {
  try {
    const interviews = await repoGetLatestInterviews(userId, limit);
    return interviews;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch latest interviews', {
        category: LogCategory.DB_ERROR,
        userId,
        limit,
        error: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Get interviews by user ID.
 *
 * @param userId - The ID of the user.
 * @returns A list of interview entities belonging to the user.
 */
export async function getInterviewsByUserIdService(userId: string) {
  try {
    const interviews = await repoGetInterviewsByUserId(userId);
    return interviews;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to fetch user interviews', {
        category: LogCategory.DB_ERROR,
        userId,
        error: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}
