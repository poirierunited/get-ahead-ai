export const INVALID_REQUEST_BODY_ERROR = 'Invalid request body' as const;
export const ZOD_ERROR = 'ZodError' as const;

export function toHttpResponse(error: unknown): {
  status: number;
  body: {
    success: false;
    error: string;
    message?: string;
    details?: any;
  };
} {
  if (
    typeof error === 'object' &&
    error &&
    'status' in error &&
    typeof (error as any).status === 'number'
  ) {
    const err = error as any;
    return {
      status: err.status,
      body: {
        success: false,
        error: err.name || 'Error',
        message: err.message,
      },
    };
  }
  if ((error as any)?.name === ZOD_ERROR) {
    const { message, details } = formatZodError(error);
    return {
      status: 400,
      body: {
        success: false,
        error: INVALID_REQUEST_BODY_ERROR,
        message,
        details,
      },
    };
  }
  return {
    status: 500,
    body: {
      success: false,
      error: 'Internal Server Error',
      message: (error as any)?.message,
    },
  };
}

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

export function formatZodError(error: unknown): {
  message?: string;
  details?: any;
} {
  const issues = (error as any)?.issues || [];
  const message = Array.isArray(issues)
    ? issues
        .map((i: any) => {
          const path = Array.isArray(i?.path) ? i.path.join('.') : '';
          return path ? `${path}: ${i?.message}` : String(i?.message || '');
        })
        .filter(Boolean)
        .join('; ')
    : undefined;
  return { message, details: (error as any)?.issues };
}
