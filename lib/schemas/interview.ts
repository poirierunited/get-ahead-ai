import { z } from 'zod';

export const generateInterviewSchema = z.object({
  title: z.string().min(1, 'title is required'),
  role: z.string().min(1, 'role is required'),
  level: z.string().min(1, 'level is required'),
  techstack: z.string().min(1, 'techstack is required'),
  type: z.enum(['technical', 'behavioral', 'mixed']),
  amount: z.coerce.number().int().min(1).max(5),
  jobDescription: z.string().optional(),
  userid: z.string().optional(),
});

export type GenerateInterviewInput = z.infer<typeof generateInterviewSchema>;

export const interviewQuestionSchema = z.union([
  z.string().min(1),
  z.object({
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).optional(),
    answer: z.string().optional(),
  }),
]);

export const interviewEntitySchema = z.object({
  title: z.string(),
  role: z.string(),
  type: z.string(),
  level: z.string(),
  techstack: z.array(z.string().min(1)),
  questions: z.array(interviewQuestionSchema),
  userId: z.string(),
  finalized: z.boolean().default(true),
  coverImage: z.string().optional(),
  createdAt: z.string(),
  durationSeconds: z.number().int().positive().optional(),
});

export type InterviewEntity = z.infer<typeof interviewEntitySchema>;
