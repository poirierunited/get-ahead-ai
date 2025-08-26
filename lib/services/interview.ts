import 'server-only';
import {
  buildGenerateInterviewPrompt,
  buildSystemPrompt,
} from '@/lib/ai/prompts';
import { generateTextWithModel, models } from '@/lib/ai/client';
import { createInterview } from '@/lib/repositories/interviews';
import type { InterviewEntity, InterviewQuestion } from '@/types/interview';
import { BadRequestError } from '@/lib/errors';
// import { logger } from '@/lib/logger';

interface GenerateInterviewServiceParams {
  role: string;
  level: string;
  techstack: string; // comma-separated
  type: string;
  amount: number;
  userId: string;
  promptTemplate: string;
  systemTemplate: string;
  language: 'English' | 'Spanish';
}

interface GenerateInterviewServiceResult {
  interview: InterviewEntity;
  questions: InterviewQuestion[];
  documentId: string;
}

/**
 * Orchestrates interview generation: builds prompts, calls the AI, parses the JSON,
 * builds the entity, persists it, and returns the stored entity and generated questions.
 */
export async function generateAndStoreInterview(
  params: GenerateInterviewServiceParams
): Promise<GenerateInterviewServiceResult> {
  const {
    role,
    level,
    techstack,
    type,
    amount,
    userId,
    promptTemplate,
    systemTemplate,
    language,
  } = params;

  const prompt = buildGenerateInterviewPrompt({
    template: promptTemplate,
    role,
    level,
    techstack,
    type,
    amount,
  });

  const system = buildSystemPrompt(systemTemplate, language);

  // logger.debug('ai_generate_start', { role, level, type, amount });
  const text = await generateTextWithModel({
    model: models.geminiFlash(),
    prompt,
    system,
  });
  // logger.debug('ai_generate_done', { textLength: text.length });

  let questions: InterviewQuestion[];
  try {
    questions = JSON.parse(text);
    if (!Array.isArray(questions)) throw new Error('Questions is not an array');
  } catch {
    // logger.warn('ai_invalid_json', { sample: text.slice(0, 80) });
    throw new BadRequestError('AI returned invalid JSON');
  }

  const entity: InterviewEntity = {
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
  // logger.info('interview_persisted', { documentId });

  return { interview: entity, questions, documentId };
}
