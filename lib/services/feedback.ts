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

interface GenerateFeedbackServiceParams {
  interviewId: string;
  userId: string;
  transcript: Array<z.infer<typeof savedMessageSchema>>;
  promptTemplate: string; // messages.api.generateFeedback.prompt
  systemTemplate: string; // messages.api.generateFeedback.systemPrompt
  language: 'English' | 'Spanish';
}

interface GenerateFeedbackServiceResult {
  feedbackId: string;
}

/**
 * Generates structured feedback from a transcript using LLM and stores it.
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
  } = params;

  if (!userId) throw new BadRequestError('userid is required');
  if (!interviewId) throw new BadRequestError('interviewId is required');

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
    totalScore: object.totalScore,
    categoryScores: object.categoryScores,
    strengths: object.strengths,
    areasForImprovement: object.areasForImprovement,
    finalAssessment: object.finalAssessment,
    createdAt: new Date().toISOString(),
  } as const;

  const feedbackRef = db.collection('feedback').doc();
  await feedbackRef.set(feedback);

  return { feedbackId: feedbackRef.id };
}

/**
 * Get the most recent feedback by interview ID and user ID.
 * Optimized for list/card views where only the latest score is needed.
 */
export async function getFeedbackByInterviewIdService(
  interviewId: string,
  userId: string
) {
  return repoGetFeedbackByInterviewId(interviewId, userId);
}

/**
 * Get all feedbacks by interview ID and user ID, ordered by creation date (newest first).
 */
export async function getAllFeedbacksByInterviewIdService(
  interviewId: string,
  userId: string
): Promise<Feedback[]> {
  return repoGetAllFeedbacksByInterviewId(interviewId, userId);
}
