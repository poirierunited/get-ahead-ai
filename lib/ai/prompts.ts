import 'server-only';

interface GeneratePromptParams {
  template: string;
  role: string;
  level: string;
  techstack: string;
  type: string;
  amount: number;
}

/**
 * Build the user-visible prompt for interview generation using a localized template.
 * Mirrors the replacement logic used in the route to keep behavior unchanged.
 */
export function buildGenerateInterviewPrompt(
  params: GeneratePromptParams
): string {
  const { template, role, level, techstack, type, amount } = params;
  return template
    .replace('{role}', role)
    .replace('{level}', level)
    .replace('{techstack}', techstack)
    .replace('{type}', type)
    .replace('{amount}', String(amount));
}

/**
 * Build the system prompt, injecting the language label.
 */
export function buildSystemPrompt(
  template: string,
  language: 'English' | 'Spanish'
): string {
  return template.replace('{language}', language);
}
