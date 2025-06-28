/**
 * ErrorHandling.ts
 * A centralized system for robust error handling across the application
 */

// Standard error types to categorize errors
export enum ErrorType {
  API = 'api_error',
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'auth_error',
  NETWORK = 'network_error',
  DATABASE = 'database_error',
  UNKNOWN = 'unknown_error',
}

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning', 
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Structured error interface
export interface AppError {
  type: ErrorType;
  message: string;
  severity: ErrorSeverity;
  originalError?: unknown;
  context?: Record<string, unknown>;
  timestamp: Date;
}

// Error logging options
interface ErrorLogOptions {
  silent?: boolean;
  context?: Record<string, unknown>;
}

/**
 * Creates a standardized error object
 */
export function createAppError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  originalError?: unknown,
  context?: Record<string, unknown>
): AppError {
  return {
    type,
    message,
    severity,
    originalError,
    context,
    timestamp: new Date(),
  };
}

/**
 * Logs an error to the console and potentially to monitoring services
 */
export function logError(
  error: AppError | Error | string,
  options: ErrorLogOptions = {}
): void {
  const { silent = false, context = {} } = options;
  
  // Convert to AppError if it's not already
  const appError = typeof error === 'string'
    ? createAppError(error)
    : error instanceof Error
    ? createAppError(error.message, ErrorType.UNKNOWN, ErrorSeverity.ERROR, error)
    : error;
  
  // Add additional context if provided
  const errorWithContext = {
    ...appError,
    context: {
      ...appError.context,
      ...context,
    },
  };
  
  // Log to console unless silent is true
  if (!silent) {
    console.error('Application Error:', errorWithContext);
  }
  
  // Here you could add reporting to a monitoring service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   reportErrorToMonitoring(errorWithContext);
  // }
}

/**
 * Safe try/catch wrapper for async operations
 */
export async function safeAsync<T>(
  promise: Promise<T>,
  errorMessage = 'Operation failed'
): Promise<[T | null, AppError | null]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    const appError = createAppError(
      errorMessage,
      ErrorType.UNKNOWN,
      ErrorSeverity.ERROR,
      error
    );
    logError(appError);
    return [null, appError];
  }
}

/**
 * Safe function execution wrapper
 */
export function safeExecute<T>(
  fn: () => T,
  errorMessage = 'Operation failed'
): [T | null, AppError | null] {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    const appError = createAppError(
      errorMessage,
      ErrorType.UNKNOWN,
      ErrorSeverity.ERROR,
      error
    );
    logError(appError);
    return [null, appError];
  }
}

/**
 * Handles API errors in a standardized way
 */
export function handleApiError(
  error: unknown,
  fallbackMessage = 'An error occurred while communicating with the server'
): AppError {
  let message = fallbackMessage;
  let type = ErrorType.API;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  if (message.includes('network') || message.includes('Failed to fetch')) {
    type = ErrorType.NETWORK;
  } else if (message.toLowerCase().includes('auth') || message.includes('401') || message.includes('403')) {
    type = ErrorType.AUTHENTICATION;
  }
  
  const appError = createAppError(
    message,
    type,
    ErrorSeverity.ERROR,
    error
  );
  
  logError(appError);
  return appError;
}
