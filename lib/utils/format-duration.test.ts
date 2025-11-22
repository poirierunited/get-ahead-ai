import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('should format seconds only when less than 60', () => {
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(1)).toBe('1s');
  });

  it('should format minutes and seconds when >= 60 seconds', () => {
    expect(formatDuration(185)).toBe('3m 5s');
    expect(formatDuration(125)).toBe('2m 5s');
    expect(formatDuration(90)).toBe('1m 30s');
  });

  it('should format minutes only when seconds are exact multiples of 60', () => {
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(120)).toBe('2m');
    expect(formatDuration(300)).toBe('5m');
  });

  it('should handle zero duration', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('should handle null and undefined', () => {
    expect(formatDuration(null)).toBe('0s');
    expect(formatDuration(undefined)).toBe('0s');
  });

  it('should handle large durations', () => {
    expect(formatDuration(900)).toBe('15m'); // 15 minutes
    expect(formatDuration(3600)).toBe('60m'); // 1 hour
    expect(formatDuration(3661)).toBe('61m 1s'); // 1 hour 1 minute 1 second
  });
});
