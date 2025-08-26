import 'server-only';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const models = {
  geminiFlash: () => google('gemini-2.0-flash-001'),
};

/**
 * Execute a text generation call against the configured model.
 * Thin wrapper to ease testing and future model swaps.
 */
export async function generateTextWithModel(args: {
  model: ReturnType<typeof models.geminiFlash>;
  prompt: string;
  system: string;
}): Promise<string> {
  const { text } = await generateText({
    model: args.model,
    prompt: args.prompt,
    system: args.system,
  });
  return text;
}
