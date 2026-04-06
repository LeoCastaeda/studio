/**
 * Logger Module
 * 
 * Provides comprehensive structured logging with:
 * - Multiple log levels (error, warn, info, debug)
 * - Contextual logging with metadata
 * - Log rotation
 * - Console and file transports
 * - Stack trace capture for errors
 */

import winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Log context for structured logging
 */
export interface LogContext {
  component?: string;
  operation?: string;
  userId?: string;
  articleSlug?: string;
  topicId?: string;
  taskId?: string;
  [key: string]: any;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  logDir: string;
  enableConsole: boolean;
  enableFile: boolean;
  maxFileSize: number; // in bytes
  maxFiles: number; // number of rotated files to keep
  datePattern: string; // for daily rotation
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  logDir: './logs',
  enableConsole: true,
  enableFile: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 14, // Keep 2 weeks of logs
  datePattern: 'YYYY-MM-DD',
};

/**
 * Custom log format
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.printf((info) => {
    const { timestamp, level, message } = info;
    const metadata = (info.metadata || {}) as Record<string, any>;
    
    let log = `[${timestamp}] [${level.toUpperCase()}]`;
    
    // Add component and operation if present
    if (metadata.component) {
      log += ` [${metadata.component}]`;
    }
    if (metadata.operation) {
      log += ` [${metadata.operation}]`;
    }
    
    log += ` ${message}`;
    
    // Add additional metadata
    const { component, operation, stack, ...rest } = metadata;
    if (Object.keys(rest).length > 0) {
      log += ` ${JSON.stringify(rest)}`;
    }
    
    // Add stack trace if present
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

/**
 * JSON format for file logging
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Logger class
 */
export class Logger {
  private logger: winston.Logger;
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Ensure log directory exists
    if (this.config.enableFile) {
      this.ensureLogDirectory();
    }
    
    this.logger = this.createLogger();
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  /**
   * Create Winston logger instance
   */
  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.enableConsole) {
      transports.push(
        new winston.transports.Console({
          format: customFormat,
        })
      );
    }

    // File transports with rotation
    if (this.config.enableFile) {
      // Combined log (all levels)
      transports.push(
        new winston.transports.File({
          filename: path.join(this.config.logDir, 'combined.log'),
          format: jsonFormat,
          maxsize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
        })
      );

      // Error log (errors only)
      transports.push(
        new winston.transports.File({
          filename: path.join(this.config.logDir, 'error.log'),
          level: 'error',
          format: jsonFormat,
          maxsize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
        })
      );

      // Info log (info and above)
      transports.push(
        new winston.transports.File({
          filename: path.join(this.config.logDir, 'info.log'),
          level: 'info',
          format: jsonFormat,
          maxsize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
        })
      );
    }

    return winston.createLogger({
      level: this.config.level,
      transports,
      exitOnError: false,
    });
  }

  /**
   * Log an error message
   */
  error(message: string, context?: LogContext, error?: Error): void {
    const metadata: any = { ...context };
    
    if (error) {
      metadata.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    
    this.logger.error(message, metadata);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context || {});
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    this.logger.info(message, context || {});
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context || {});
  }

  /**
   * Log the start of an operation
   */
  startOperation(operation: string, context?: LogContext): void {
    this.info(`Starting operation: ${operation}`, {
      ...context,
      operation,
      phase: 'start',
    });
  }

  /**
   * Log the completion of an operation
   */
  completeOperation(operation: string, context?: LogContext, durationMs?: number): void {
    const metadata: LogContext = {
      ...context,
      operation,
      phase: 'complete',
    };
    
    if (durationMs !== undefined) {
      metadata.durationMs = durationMs;
    }
    
    this.info(`Completed operation: ${operation}`, metadata);
  }

  /**
   * Log the failure of an operation
   */
  failOperation(operation: string, error: Error, context?: LogContext): void {
    this.error(`Failed operation: ${operation}`, {
      ...context,
      operation,
      phase: 'failed',
    }, error);
  }

  /**
   * Create a child logger with default context
   */
  child(defaultContext: LogContext): Logger {
    const childLogger = new Logger(this.config);
    
    // Wrap all logging methods to include default context
    const originalError = childLogger.error.bind(childLogger);
    const originalWarn = childLogger.warn.bind(childLogger);
    const originalInfo = childLogger.info.bind(childLogger);
    const originalDebug = childLogger.debug.bind(childLogger);
    
    childLogger.error = (message: string, context?: LogContext, error?: Error) => {
      originalError(message, { ...defaultContext, ...context }, error);
    };
    
    childLogger.warn = (message: string, context?: LogContext) => {
      originalWarn(message, { ...defaultContext, ...context });
    };
    
    childLogger.info = (message: string, context?: LogContext) => {
      originalInfo(message, { ...defaultContext, ...context });
    };
    
    childLogger.debug = (message: string, context?: LogContext) => {
      originalDebug(message, { ...defaultContext, ...context });
    };
    
    return childLogger;
  }

  /**
   * Measure and log operation duration
   */
  async measureOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    this.startOperation(operation, context);
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.completeOperation(operation, context, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.failOperation(operation, error as Error, {
        ...context,
        durationMs: duration,
      });
      throw error;
    }
  }

  /**
   * Close the logger and flush all transports
   */
  close(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.close();
      resolve();
    });
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger | null = null;

/**
 * Initialize the global logger
 */
export function initializeLogger(config?: Partial<LoggerConfig>): Logger {
  globalLogger = new Logger(config);
  return globalLogger;
}

/**
 * Get the global logger instance
 */
export function getLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new Logger();
  }
  return globalLogger;
}

/**
 * Convenience functions using global logger
 */
export function error(message: string, context?: LogContext, err?: Error): void {
  getLogger().error(message, context, err);
}

export function warn(message: string, context?: LogContext): void {
  getLogger().warn(message, context);
}

export function info(message: string, context?: LogContext): void {
  getLogger().info(message, context);
}

export function debug(message: string, context?: LogContext): void {
  getLogger().debug(message, context);
}
