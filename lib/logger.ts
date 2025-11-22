/**
 * Supported logging levels for structured logging.
 * Used to categorize log entries by severity and purpose.
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Standard log categories for consistent event tracking.
 * These categories help with log filtering, monitoring, and alerting.
 */
export enum LogCategory {
  // API Operations
  API_REQUEST = 'api:request',
  API_RESPONSE = 'api:response',
  API_ERROR = 'api:error',

  // Authentication & Authorization
  AUTH_SUCCESS = 'auth:success',
  AUTH_FAILURE = 'auth:failure',
  AUTH_SESSION = 'auth:session',

  // Business Logic
  INTERVIEW_GENERATE = 'interview:generate',
  INTERVIEW_FETCH = 'interview:fetch',
  FEEDBACK_GENERATE = 'feedback:generate',
  FEEDBACK_FETCH = 'feedback:fetch',

  // AI/ML Operations
  AI_REQUEST = 'ai:request',
  AI_RESPONSE = 'ai:response',
  AI_ERROR = 'ai:error',

  // Database Operations
  DB_QUERY = 'db:query',
  DB_INSERT = 'db:insert',
  DB_ERROR = 'db:error',

  // Rate Limiting & Security
  RATE_LIMIT = 'security:rate_limit',
  VALIDATION_ERROR = 'security:validation',

  // Client Actions
  CLIENT_ERROR = 'client:error',
  CLIENT_ACTION = 'client:action',

  // System
  SYSTEM_ERROR = 'system:error',
  SYSTEM_INFO = 'system:info',
}

/**
 * Additional metadata that can be attached to log entries.
 * Accepts any key-value pairs for contextual information.
 */
interface LogMeta {
  [key: string]: unknown;
  category?: LogCategory | string;
  requestId?: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
}

/**
 * Internal logging function that outputs structured JSON log entries.
 * Automatically includes timestamp and routes to appropriate console method based on level.
 *
 * @param level - The severity level of the log entry
 * @param message - The primary log message describing the event
 * @param meta - Optional metadata to include in the log entry for additional context
 *
 * @example
 * ```typescript
 * log('info', 'User logged in', {
 *   category: LogCategory.AUTH_SUCCESS,
 *   userId: '123',
 *   email: 'user@example.com'
 * });
 * // Output: {"level":"info","message":"User logged in","timestamp":"2025-11-22T10:30:00.000Z","category":"auth:success","userId":"123","email":"user@example.com"}
 * ```
 */
function log(level: LogLevel, message: string, meta?: LogMeta) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta?.category && { category: meta.category }),
    ...(meta?.requestId && { requestId: meta.requestId }),
    ...(meta?.userId && { userId: meta.userId }),
    ...meta,
  };

  const line = JSON.stringify(entry);
  switch (level) {
    case 'info':
      console.log(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    case 'debug':
      console.debug(line);
      break;
    case 'error':
    default:
      console.error(line);
  }
}

/**
 * Generate a unique request ID for tracking operations across services.
 * Uses timestamp and random string for uniqueness.
 *
 * @returns A unique request ID string
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Structured logger utility for consistent, JSON-formatted logging across the application.
 * Provides methods for different log levels with automatic timestamping.
 *
 * All log entries are output as JSON strings with the following structure:
 * - `level`: The log level (info, warn, error, debug)
 * - `message`: The primary log message
 * - `timestamp`: ISO 8601 formatted timestamp
 * - Additional metadata fields as provided
 *
 * @example
 * ```typescript
 * // Basic logging
 * logger.info('Application started');
 *
 * // Logging with metadata
 * logger.error('Database connection failed', {
 *   error: err.message,
 *   connectionString: config.db.host,
 *   retryAttempt: 3
 * });
 *
 * // Debug logging
 * logger.debug('Processing request', { requestId, userId, endpoint });
 * ```
 */
export const logger = {
  /**
   * Logs an informational message.
   * Use for general application events and flow tracking.
   *
   * @param message - The informational message to log
   * @param meta - Optional additional context metadata
   */
  info: (message: string, meta?: LogMeta) => log('info', message, meta),

  /**
   * Logs a warning message.
   * Use for potentially harmful situations that don't prevent normal operation.
   *
   * @param message - The warning message to log
   * @param meta - Optional additional context metadata
   */
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),

  /**
   * Logs an error message.
   * Use for error events that might still allow the application to continue.
   *
   * @param message - The error message to log
   * @param meta - Optional additional context metadata (commonly includes error details)
   */
  error: (message: string, meta?: LogMeta) => log('error', message, meta),

  /**
   * Logs a debug message.
   * Use for detailed diagnostic information useful during development.
   *
   * @param message - The debug message to log
   * @param meta - Optional additional context metadata
   */
  debug: (message: string, meta?: LogMeta) => log('debug', message, meta),
};
