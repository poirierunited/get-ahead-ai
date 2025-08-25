import {
  buildGenerateInterviewPrompt,
  buildSystemPrompt,
} from './prompts';

describe('AI prompt builders', () => {
  it('builds generate prompt with replacements', () => {
    const template =
      'Role: {role}, Level: {level}, Tech: {techstack}, Type: {type}, Amount: {amount}';
    const prompt = buildGenerateInterviewPrompt({
      template,
      role: 'FE',
      level: 'Senior',
      techstack: 'React,TS',
      type: 'technical',
      amount: 3,
    });
    expect(prompt).toBe(
      'Role: FE, Level: Senior, Tech: React,TS, Type: technical, Amount: 3'
    );
  });

  it('builds system prompt with language', () => {
    const sys = buildSystemPrompt('Language: {language}', 'Spanish');
    expect(sys).toBe('Language: Spanish');
  });
});
