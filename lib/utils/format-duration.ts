/**
 * Formats a duration in seconds to a human-readable string.
 *
 * @param seconds - The duration in seconds
 * @returns A formatted string like "3m 25s" or "45s"
 * @example
 * formatDuration(185) // "3m 5s"
 * formatDuration(45) // "45s"
 * formatDuration(0) // "0s"
 */
export function formatDuration(seconds: number | undefined | null): string {
  if (seconds === null || seconds === undefined || seconds === 0) {
    return '0s';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}
