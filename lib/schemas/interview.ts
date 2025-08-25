import { z } from 'zod';

export const generateInterviewSchema = z.object({
  role: z.string().min(1, 'role is required'),
  level: z.string().min(1, 'level is required'),
  techstack: z.string().min(1, 'techstack is required'),
  type: z.string().min(1, 'type is required'),
  amount: z.coerce.number().int().positive().max(50),
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
  role: z.string(),
  type: z.string(),
  level: z.string(),
  techstack: z.array(z.string().min(1)),
  questions: z.array(interviewQuestionSchema),
  userId: z.string(),
  finalized: z.boolean().default(true),
  coverImage: z.string().optional(),
  createdAt: z.string(),
});

export type InterviewEntity = z.infer<typeof interviewEntitySchema>;
