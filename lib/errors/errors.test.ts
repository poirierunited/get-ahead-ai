import { BadRequestError, toHttpResponse } from '../errors';

describe('errors', () => {
  it('maps custom error to http response', () => {
    const e = new BadRequestError('bad');
    const res = toHttpResponse(e);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, error: 'bad' });
  });

  it('maps unknown error to 500', () => {
    const e = new Error('oops');
    const res = toHttpResponse(e);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: 'Failed to generate questions',
    });
  });
});
