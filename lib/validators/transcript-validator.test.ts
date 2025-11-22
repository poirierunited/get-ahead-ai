import { validateTranscript } from './transcript-validator';

describe('validateTranscript', () => {
  describe('Empty or missing transcript', () => {
    it('should reject empty array', () => {
      const result = validateTranscript([]);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('empty');
    });

    it('should reject null/undefined transcript', () => {
      const result = validateTranscript(null as any);
      expect(result.isValid).toBe(false);
    });
  });

  describe('No user participation', () => {
    it('should reject transcript with only assistant messages', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'Hello, tell me about yourself' },
        { role: 'assistant' as const, content: 'Are you there?' },
        { role: 'system' as const, content: 'Connection established' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('No user messages');
      expect(result.userMessageCount).toBe(0);
    });

    it('should reject transcript with only one user message', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'Tell me about yourself' },
        { role: 'user' as const, content: 'I am a developer' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('only 1 message');
    });
  });

  describe('Too short responses', () => {
    it('should reject when user messages are too short on average', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'Tell me about your experience' },
        { role: 'user' as const, content: 'ok' },
        { role: 'assistant' as const, content: 'Can you elaborate?' },
        { role: 'user' as const, content: 'yes' },
        { role: 'assistant' as const, content: 'Please share more details' },
        { role: 'user' as const, content: 'no' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('too short');
    });

    it('should reject when total word count is too low', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'Tell me about yourself' },
        { role: 'user' as const, content: 'I work here' },
        { role: 'assistant' as const, content: 'What do you do?' },
        { role: 'user' as const, content: 'Code things' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.userWordCount).toBeLessThan(20);
    });
  });

  describe('Generic responses', () => {
    it('should reject mostly generic responses', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'How are you?' },
        { role: 'user' as const, content: 'ok' },
        { role: 'assistant' as const, content: 'Ready to start?' },
        { role: 'user' as const, content: 'yes' },
        { role: 'assistant' as const, content: 'Should we continue?' },
        { role: 'user' as const, content: 'yeah' },
        { role: 'assistant' as const, content: 'Is that clear?' },
        { role: 'user' as const, content: 'sure' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('generic');
    });
  });

  describe('Imbalanced conversation', () => {
    it('should reject when user speaks less than 15% of conversation', () => {
      const transcript = [
        {
          role: 'assistant' as const,
          content:
            'Tell me about your experience with React. I want to understand your background and how you approach frontend development. Can you share some specific projects you have worked on?',
        },
        { role: 'user' as const, content: 'I worked on some projects' },
        {
          role: 'assistant' as const,
          content:
            'That is interesting. Can you elaborate on the technical challenges you faced and how you overcame them? I would like to hear about your problem solving approach.',
        },
        { role: 'user' as const, content: 'Had some bugs to fix' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('less than 15%');
    });
  });

  describe('Valid transcripts', () => {
    it('should accept good quality transcript', () => {
      const transcript = [
        {
          role: 'assistant' as const,
          content: 'Tell me about your experience with React',
        },
        {
          role: 'user' as const,
          content:
            'I have been working with React for over three years now. I started with class components and then migrated to hooks when they were released.',
        },
        {
          role: 'assistant' as const,
          content: 'What was the biggest challenge in that migration?',
        },
        {
          role: 'user' as const,
          content:
            'The biggest challenge was understanding the mental model shift from lifecycle methods to effects. We had to refactor a lot of existing code.',
        },
        {
          role: 'assistant' as const,
          content: 'How did you handle state management?',
        },
        {
          role: 'user' as const,
          content:
            'We used Redux initially but then moved to Context API and custom hooks for simpler state. For complex features we still use Redux Toolkit.',
        },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(true);
      expect(result.reason).toBeUndefined();
      expect(result.userMessageCount).toBe(3);
      expect(result.userWordCount).toBeGreaterThan(20);
    });

    it('should accept transcript with meaningful participation', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'What interests you about this role?' },
        {
          role: 'user' as const,
          content: 'I am really excited about the opportunity to work on scalable systems',
        },
        { role: 'assistant' as const, content: 'Can you give an example?' },
        {
          role: 'user' as const,
          content: 'In my previous role I worked on a microservices architecture handling millions of requests',
        },
        { role: 'assistant' as const, content: 'What was your role specifically?' },
        {
          role: 'user' as const,
          content: 'I was the lead backend engineer responsible for the API gateway and service orchestration',
        },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(true);
      expect(result.userMessageCount).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle mixed generic and meaningful responses', () => {
      const transcript = [
        { role: 'assistant' as const, content: 'Ready to start?' },
        { role: 'user' as const, content: 'yes' },
        { role: 'assistant' as const, content: 'Tell me about your background' },
        {
          role: 'user' as const,
          content: 'I have five years of experience in software development focusing on web technologies',
        },
        { role: 'assistant' as const, content: 'What frameworks have you used?' },
        {
          role: 'user' as const,
          content: 'Primarily React and Next.js for frontend and Node.js with Express for backend services',
        },
        { role: 'assistant' as const, content: 'That sounds good' },
        { role: 'user' as const, content: 'thanks' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(true);
    });

    it('should handle Spanish generic responses', () => {
      const transcript = [
        { role: 'assistant' as const, content: '¿Listo para comenzar?' },
        { role: 'user' as const, content: 'sí' },
        { role: 'assistant' as const, content: 'Cuéntame sobre tu experiencia' },
        { role: 'user' as const, content: 'ok' },
        { role: 'assistant' as const, content: '¿Puedes dar más detalles?' },
        { role: 'user' as const, content: 'claro' },
      ];
      const result = validateTranscript(transcript);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('generic');
    });
  });
});

