import { z } from 'zod';

export const savedMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
});

export const generateFeedbackSchema = z.object({
  interviewId: z.string().min(1, 'interviewId is required'),
  transcript: z.array(savedMessageSchema).min(1, 'transcript is required'),
  userid: z.string().optional(),
});

export type GenerateFeedbackInput = z.infer<typeof generateFeedbackSchema>;
