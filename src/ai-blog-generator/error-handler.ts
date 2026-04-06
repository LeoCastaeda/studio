/**
 * Error Handler
 * 
 * Handles errors with retry logic and notifications.
 */

import { ErrorRecoveryConfig } from './types';
import { getLogger, Logger } from './logger';

/**
 * Error types for contextual handling
 */
export enum ErrorType {
  API = 'API',
  DATABASE = 'DATABASE',
  FILESYSTEM = 'FILESYSTEM',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Classify error based on error message and properties
 */
function classifyError(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  // API errors
  if (
    message.includes('api') ||
    message.includes('rate limit') ||
    message.includes('quota') ||
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('fetch') ||
    name.includes('apierror')
  ) {
    return ErrorType.API;
  }

  // Database errors
  if (
    message.includes('database') ||
    message.includes('sqlite') ||
    message.includes('sql') ||
    message.includes('constraint') ||
    message.includes('unique') ||
    name.includes('sqlerror')
  ) {
    return ErrorType.DATABASE;
  }

  // Filesystem errors
  if (
    message.includes('enoent') ||
    message.includes('eacces') ||
    message.includes('eperm') ||
    message.includes('file') ||
    message.includes('directory') ||
    message.includes('path') ||
    name.includes('systemerror')
  ) {
    return ErrorType.FILESYSTEM;
  }

  // Validation errors
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required') ||
    name.includes('validationerror')
  ) {
    return ErrorType.VALIDATION;
  }

  return ErrorType.UNKNOWN;
}

/**
 * Determine if an error is retryable based on its type
 */
function isRetryable(errorType: ErrorType): boolean {
  switch (errorType) {
    case ErrorType.API:
    case ErrorType.DATABASE:
    case ErrorType.FILESYSTEM:
      return true;
    case ErrorType.VALIDATION:
    case ErrorType.UNKNOWN:
      return false;
  }
}

/**
 * Get retry configuration based on error type
 */
function getRetryConfigForErrorType(
  errorType: ErrorType,
  baseConfig: ErrorRecoveryConfig
): ErrorRecoveryConfig {
  switch (errorType) {
    case ErrorType.API:
      // API errors: more retries with longer delays (rate limiting)
      return {
        ...baseConfig,
        maxRetries: Math.max(baseConfig.maxRetries, 5),
        retryDelay: Math.max(baseConfig.retryDelay, 2000),
        backoffMultiplier: Math.max(baseConfig.backoffMultiplier, 2),
      };
    
    case ErrorType.DATABASE:
      // Database errors: moderate retries with shorter delays
      return {
        ...baseConfig,
        maxRetries: Math.max(baseConfig.maxRetries, 3),
        retryDelay: Math.max(baseConfig.retryDelay, 500),
        backoffMultiplier: 1.5,
      };
    
    case ErrorType.FILESYSTEM:
      // Filesystem errors: fewer retries with short delays
      return {
        ...baseConfig,
        maxRetries: Math.max(baseConfig.maxRetries, 2),
        retryDelay: Math.max(baseConfig.retryDelay, 100),
        backoffMultiplier: 1.5,
      };
    
    default:
      return baseConfig;
  }
}

export class ErrorHandler {
  private logger: Logger;

  constructor(private config: ErrorRecoveryConfig) {
    this.logger = getLogger().child({ component: 'ErrorHandler' });
  }

  /**
   * Handle an error with contextual information
   * Logs the error and optionally notifies admin based on configuration
   */
  async handleError(error: Error, context: string, config: ErrorRecoveryConfig): Promise<void> {
    const errorType = classifyError(error);
    
    // Log the error with full context
    this.logger.error('Error occurred', {
      operation: context,
      errorType,
      retryable: isRetryable(errorType),
    }, error);
    
    // Notify admin if configured
    if (config.notifyOnFailure) {
      try {
        await this.notifyAdmin(error, context);
      } catch (notifyError) {
        // Don't let notification errors break the flow
        this.logger.error('Failed to notify admin', {
          operation: context,
          originalError: error.message,
        }, notifyError as Error);
      }
    }
  }

  /**
   * Retry a function with exponential backoff
   * Automatically classifies errors and adjusts retry strategy
   */
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    config: ErrorRecoveryConfig
  ): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= config.maxRetries) {
      try {
        // First attempt or retry
        const result = await fn();
        
        // Log success if this was a retry
        if (attempt > 0) {
          this.logger.info('Operation succeeded after retries', {
            operation: 'retryWithBackoff',
            attempts: attempt,
          });
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;

        // Classify the error
        const errorType = classifyError(lastError);
        
        // Check if error is retryable
        if (!isRetryable(errorType)) {
          this.logger.error('Non-retryable error, failing immediately', {
            operation: 'retryWithBackoff',
            errorType,
            attempt,
          }, lastError);
          throw lastError;
        }

        // Check if we've exhausted retries
        if (attempt > config.maxRetries) {
          this.logger.error('Max retries exceeded', {
            operation: 'retryWithBackoff',
            maxRetries: config.maxRetries,
            errorType,
          }, lastError);
          break;
        }

        // Get adjusted config for this error type
        const adjustedConfig = getRetryConfigForErrorType(errorType, config);
        
        // Calculate delay with exponential backoff
        const delay = adjustedConfig.retryDelay * Math.pow(adjustedConfig.backoffMultiplier, attempt - 1);
        
        this.logger.warn('Retry attempt failed, retrying', {
          operation: 'retryWithBackoff',
          attempt,
          maxRetries: adjustedConfig.maxRetries,
          errorType,
          delayMs: delay,
          errorMessage: lastError.message,
        });

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw lastError || new Error('Operation failed after retries');
  }

  /**
   * Log an error with context
   */
  async logError(error: Error, context: string): Promise<void> {
    this.logger.error('Error logged', {
      operation: context,
    }, error);
  }

  /**
   * Notify admin about an error
   * Currently logs to console, can be extended to send emails
   */
  async notifyAdmin(error: Error, context: string): Promise<void> {
    const errorType = classifyError(error);
    const severity = this.getSeverity(errorType);
    
    // Log admin notification
    this.logger.error('ADMIN NOTIFICATION', {
      operation: context,
      errorType,
      severity,
      notificationType: 'admin_alert',
    }, error);

    // TODO: Implement email notification using nodemailer
    // This would require SMTP configuration in environment variables
  }

  /**
   * Get severity level for an error type
   */
  private getSeverity(errorType: ErrorType): 'low' | 'medium' | 'high' {
    switch (errorType) {
      case ErrorType.VALIDATION:
        return 'low';
      case ErrorType.FILESYSTEM:
      case ErrorType.DATABASE:
        return 'medium';
      case ErrorType.API:
      case ErrorType.UNKNOWN:
        return 'high';
    }
  }

  /**
   * Sleep for a specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
