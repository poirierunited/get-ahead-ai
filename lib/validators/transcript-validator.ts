import 'server-only';

interface TranscriptMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface TranscriptValidationResult {
  isValid: boolean;
  reason?: string;
  userMessageCount?: number;
  userWordCount?: number;
  averageUserMessageLength?: number;
}

/**
 * Validates a transcript to ensure it contains meaningful user participation.
 *
 * This validator checks for various edge cases that indicate a failed or invalid interview:
 * - Empty or missing transcripts
 * - No user messages (microphone issues)
 * - Minimal user participation (very short responses)
 * - Generic/meaningless responses only
 * - Imbalanced conversation (user barely spoke)
 *
 * @param transcript - Array of conversation messages
 * @returns Validation result with details about why it's invalid (if applicable)
 *
 * @example
 * ```typescript
 * const result = validateTranscript([
 *   { role: 'assistant', content: 'Tell me about yourself' },
 *   { role: 'user', content: 'ok' }
 * ]);
 * // result.isValid === false, reason: 'Insufficient user participation'
 * ```
 */
export function validateTranscript(
  transcript: TranscriptMessage[]
): TranscriptValidationResult {
  // Check 1: Empty transcript
  if (!transcript || transcript.length === 0) {
    return {
      isValid: false,
      reason: 'Transcript is empty',
      userMessageCount: 0,
      userWordCount: 0,
    };
  }

  // Extract user messages only
  const userMessages = transcript.filter((msg) => msg.role === 'user');

  // Check 2: No user participation (microphone issues)
  if (userMessages.length === 0) {
    return {
      isValid: false,
      reason: 'No user messages found - possible microphone issue',
      userMessageCount: 0,
      userWordCount: 0,
    };
  }

  // Check 3: Very few user messages (less than 2)
  if (userMessages.length < 2) {
    return {
      isValid: false,
      reason: 'Insufficient user participation - only 1 message',
      userMessageCount: userMessages.length,
    };
  }

  // Calculate user participation metrics
  const userWordCounts = userMessages.map((msg) => {
    const words = msg.content.trim().split(/\s+/);
    return words.length;
  });

  const totalUserWords = userWordCounts.reduce((sum, count) => sum + count, 0);
  const averageUserMessageLength =
    userWordCounts.reduce((sum, count) => sum + count, 0) / userMessages.length;

  // Check 4: User messages are too short (average less than 3 words)
  if (averageUserMessageLength < 3) {
    return {
      isValid: false,
      reason:
        'User responses are too short - average less than 3 words per message',
      userMessageCount: userMessages.length,
      userWordCount: totalUserWords,
      averageUserMessageLength,
    };
  }

  // Check 5: Total user word count is too low (less than 20 words total)
  if (totalUserWords < 20) {
    return {
      isValid: false,
      reason: 'Insufficient user content - less than 20 words total',
      userMessageCount: userMessages.length,
      userWordCount: totalUserWords,
      averageUserMessageLength,
    };
  }

  // Check 6: Generic/meaningless responses
  const genericResponses = [
    'ok',
    'okay',
    'yes',
    'no',
    'si',
    'sí',
    'yeah',
    'nope',
    'sure',
    'fine',
    'yep',
    'nah',
    'uh huh',
    'uh-huh',
    'mmm',
    'hmm',
  ];

  const meaningfulMessages = userMessages.filter((msg) => {
    const content = msg.content.toLowerCase().trim();
    // Check if the entire message is just a generic response
    if (genericResponses.includes(content)) {
      return false;
    }
    // Check if message has at least 5 words (more substantial)
    const wordCount = content.split(/\s+/).length;
    return wordCount >= 5;
  });

  // If less than 30% of messages are meaningful, reject
  const meaningfulRatio = meaningfulMessages.length / userMessages.length;
  if (meaningfulRatio < 0.3 || meaningfulMessages.length < 2) {
    return {
      isValid: false,
      reason: 'Most user responses are generic or too brief',
      userMessageCount: userMessages.length,
      userWordCount: totalUserWords,
      averageUserMessageLength,
    };
  }

  // Check 7: Conversation balance - user should speak at least 15% of total words
  const assistantMessages = transcript.filter(
    (msg) => msg.role === 'assistant'
  );
  const totalAssistantWords = assistantMessages.reduce((sum, msg) => {
    return sum + msg.content.trim().split(/\s+/).length;
  }, 0);

  const totalWords = totalUserWords + totalAssistantWords;
  const userParticipationRatio = totalUserWords / totalWords;

  if (userParticipationRatio < 0.15) {
    return {
      isValid: false,
      reason: 'User spoke less than 15% of the conversation',
      userMessageCount: userMessages.length,
      userWordCount: totalUserWords,
      averageUserMessageLength,
    };
  }

  // All checks passed
  return {
    isValid: true,
    userMessageCount: userMessages.length,
    userWordCount: totalUserWords,
    averageUserMessageLength,
  };
}
