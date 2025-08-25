export class BadRequestError extends Error {
  readonly status = 400 as const;
  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends Error {
  readonly status = 401 as const;
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class TooManyRequestsError extends Error {
  readonly status = 429 as const;
  constructor(message = 'Too Many Requests') {
    super(message);
    this.name = 'TooManyRequestsError';
  }
}

export class InternalServerError extends Error {
  readonly status = 500 as const;
  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

export function toHttpResponse(error: unknown): {
  status: number;
  body: { success: false; error: string };
} {
  if (
    typeof error === 'object' &&
    error &&
    'status' in error &&
    typeof (error as any).status === 'number'
  ) {
    return {
      status: (error as any).status,
      body: { success: false, error: (error as any).message },
    };
  }
  if ((error as any)?.name === 'ZodError') {
    return {
      status: 400,
      body: { success: false, error: 'Invalid request body' },
    };
  }
  return {
    status: 500,
    body: { success: false, error: 'Failed to generate questions' },
  };
}
