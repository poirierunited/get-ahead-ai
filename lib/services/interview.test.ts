import { generateAndStoreInterview } from './interview';
import { BadRequestError } from '@/lib/errors';

jest.mock('@/lib/ai/client', () => ({
  models: { geminiFlash: jest.fn(() => ({})) },
  generateTextWithModel: jest.fn(async ({ prompt }: any) => {
    // default mock returns valid JSON array of strings
    return JSON.stringify([
      'Q1: Describe your experience with React.',
      'Q2: How do you manage state in large apps?',
    ]);
  }),
}));

jest.mock('@/lib/repositories/interviews', () => ({
  createInterview: jest.fn(async () => 'doc-123'),
}));

describe('generateAndStoreInterview', () => {
  const baseParams = {
    role: 'Frontend Engineer',
    level: 'Senior',
    techstack: 'React,TypeScript,Next.js',
    type: 'technical',
    amount: 3,
    userId: 'user-1',
    promptTemplate:
      'Role: {role}, Level: {level}, Tech: {techstack}, Type: {type}, Amount: {amount}',
    systemTemplate: 'Language: {language}',
    language: 'English' as const,
  };

  it('generates questions, builds entity and stores it', async () => {
    const result = await generateAndStoreInterview(baseParams);

    expect(result.documentId).toBe('doc-123');
    expect(Array.isArray(result.questions)).toBe(true);
    expect(result.questions.length).toBe(2);

    const interview = result.interview;
    expect(interview.role).toBe('Frontend Engineer');
    expect(interview.level).toBe('Senior');
    expect(interview.type).toBe('technical');
    expect(interview.userId).toBe('user-1');
    expect(interview.techstack).toEqual(['React', 'TypeScript', 'Next.js']);
    expect(interview.finalized).toBe(true);
    expect(typeof interview.createdAt).toBe('string');
  });

  it('throws BadRequestError when AI returns invalid JSON', async () => {
    const { generateTextWithModel } = jest.requireMock('@/lib/ai/client');
    (generateTextWithModel as jest.Mock).mockResolvedValueOnce('not-json');

    await expect(generateAndStoreInterview(baseParams)).rejects.toBeInstanceOf(
      BadRequestError
    );
  });
});
