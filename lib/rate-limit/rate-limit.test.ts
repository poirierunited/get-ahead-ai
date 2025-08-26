import { isRateLimited } from '../rate-limit';

function mockRequest(headers: Record<string, string>) {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as any;
}

describe('isRateLimited', () => {
  it('allows initial requests and rate-limits after threshold', () => {
    const req = mockRequest({ 'x-forwarded-for': '1.1.1.1' });
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(req)).toBe(false);
    }
    expect(isRateLimited(req)).toBe(true);
  });
});
