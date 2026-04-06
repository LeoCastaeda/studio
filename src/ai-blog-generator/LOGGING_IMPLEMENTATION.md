# Comprehensive Logging Implementation

## Overview

The AI Blog Generator system now has a comprehensive logging infrastructure using Winston, providing structured logging with multiple transports, log rotation, and contextual information tracking.

## Features Implemented

### ✅ 1. Winston Logger Installation
- **Package**: `winston@3.19.0`
- **Type Definitions**: `@types/winston@2.4.4`
- Already installed and configured

### ✅ 2. Structured Logging
- **Multiple Log Levels**: error, warn, info, debug
- **Contextual Metadata**: All logs include component, operation, and custom context
- **JSON Format**: File logs use JSON for easy parsing and analysis
- **Human-Readable Console**: Console logs use custom formatting for readability

### ✅ 3. Log Rotation
- **Max File Size**: 10MB per log file
- **Max Files**: 14 files kept (2 weeks of logs)
- **Automatic Rotation**: Files rotate automatically when size limit is reached

### ✅ 4. Multiple Transports
- **Console Transport**: Human-readable format for development
- **File Transports**:
  - `logs/combined.log` - All log levels
  - `logs/error.log` - Errors only
  - `logs/info.log` - Info level and above

### ✅ 5. Stack Trace Capture
- Errors automatically capture and log full stack traces
- Stack traces included in both console and file logs
- Error context preserved with metadata

### ✅ 6. Component-Level Logging
All major components now use the logger:
- ✅ **TopicManager** - Topic selection and management operations
- ✅ **QualityChecker** - Article quality validation
- ✅ **UpdateManager** - Article update operations
- ✅ **MetricsTracker** - Performance metrics tracking
- ✅ **AIContentGenerator** - AI content generation
- ✅ **AutoPublisher** - Article publishing
- ✅ **ContentScheduler** - Task scheduling
- ✅ **ErrorHandler** - Error handling and retries

## Usage Examples

### Basic Logging

```typescript
import { getLogger } from './logger';

const logger = getLogger();

// Info logging
logger.info('Operation started', {
  component: 'MyComponent',
  operation: 'myOperation',
  userId: 'user-123'
});

// Warning logging
logger.warn('Potential issue detected', {
  component: 'MyComponent',
  issue: 'low-quality-score'
});

// Error logging with stack trace
try {
  // ... some operation
} catch (error) {
  logger.error('Operation failed', {
    component: 'MyComponent',
    operation: 'myOperation'
  }, error as Error);
}
```

### Child Logger with Default Context

```typescript
import { getLogger } from './logger';

const logger = getLogger().child({
  component: 'MyComponent',
  userId: 'user-123'
});

// All logs from this logger will include the default context
logger.info('Message'); // Automatically includes component and userId
```

### Operation Measurement

```typescript
import { getLogger } from './logger';

const logger = getLogger();

const result = await logger.measureOperation(
  'generateArticle',
  async () => {
    // Your operation here
    return await generateArticle();
  },
  { component: 'AIGenerator', topicId: 'topic-123' }
);
// Automatically logs start, completion with duration, or failure
```

### Component Integration Example

```typescript
import { getLogger, Logger } from './logger';

export class MyComponent {
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child({ component: 'MyComponent' });
  }

  async myOperation(param: string): Promise<void> {
    this.logger.info('Starting operation', {
      operation: 'myOperation',
      param
    });

    try {
      // ... do work
      
      this.logger.info('Operation completed', {
        operation: 'myOperation',
        result: 'success'
      });
    } catch (error) {
      this.logger.error('Operation failed', {
        operation: 'myOperation',
        param
      }, error as Error);
      throw error;
    }
  }
}
```

## Log Format

### Console Format (Human-Readable)
```
[2025-12-12 07:53:52] [INFO] [ComponentName] [operationName] Message {"key":"value"}
```

### File Format (JSON)
```json
{
  "level": "info",
  "message": "Operation completed",
  "timestamp": "2025-12-12T06:53:52.950Z",
  "component": "ComponentName",
  "operation": "operationName",
  "customKey": "customValue"
}
```

### Error Format (with Stack Trace)
```json
{
  "level": "error",
  "message": "Operation failed",
  "timestamp": "2025-12-12T06:53:52.950Z",
  "component": "ComponentName",
  "operation": "operationName",
  "error": {
    "name": "Error",
    "message": "Something went wrong",
    "stack": "Error: Something went wrong\n    at ..."
  }
}
```

## Configuration

### Environment Variables
The logger can be configured via environment variables or programmatically:

```typescript
import { initializeLogger, LogLevel } from './logger';

const logger = initializeLogger({
  level: LogLevel.DEBUG, // or INFO, WARN, ERROR
  logDir: './logs',
  enableConsole: true,
  enableFile: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 14, // Keep 2 weeks
  datePattern: 'YYYY-MM-DD'
});
```

### Default Configuration
- **Log Level**: INFO
- **Log Directory**: `./logs`
- **Console**: Enabled
- **File Logging**: Enabled
- **Max File Size**: 10MB
- **Max Files**: 14
- **Date Pattern**: YYYY-MM-DD

## Log Files

### Location
All logs are stored in the `logs/` directory at the project root.

### Files
1. **combined.log** - All log levels (info, warn, error, debug)
2. **error.log** - Only error logs
3. **info.log** - Info level and above (info, warn, error)

### Rotation
- Files automatically rotate when they reach 10MB
- Rotated files are named with a number suffix (e.g., `combined.log.1`)
- Maximum of 14 files are kept (approximately 2 weeks of logs)
- Older files are automatically deleted

## Testing

A comprehensive test script is available to verify logging functionality:

```bash
npx tsx src/ai-blog-generator/scripts/test-logging.ts
```

This test covers:
- ✅ Basic logging at all levels
- ✅ Contextual logging with metadata
- ✅ Error logging with stack traces
- ✅ Child loggers with default context
- ✅ Operation measurement
- ✅ Component-level logging
- ✅ Failed operation logging
- ✅ High-volume stress testing

## Best Practices

### 1. Always Include Context
```typescript
// Good
logger.info('Article generated', {
  operation: 'generateArticle',
  articleSlug: 'my-article',
  wordCount: 1200
});

// Bad
logger.info('Article generated');
```

### 2. Use Appropriate Log Levels
- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error events that might still allow the application to continue

### 3. Log Operation Boundaries
```typescript
// Log start
logger.info('Starting operation', { operation: 'myOp' });

// ... do work

// Log completion
logger.info('Operation completed', { operation: 'myOp', duration: 123 });
```

### 4. Use Child Loggers for Components
```typescript
// Create once in constructor
this.logger = getLogger().child({ component: 'MyComponent' });

// Use throughout the class
this.logger.info('Message'); // Automatically includes component
```

### 5. Always Log Errors with Stack Traces
```typescript
try {
  // ... operation
} catch (error) {
  logger.error('Operation failed', {
    operation: 'myOp'
  }, error as Error); // Pass error as third parameter
  throw error;
}
```

## Performance Considerations

- **Async Operations**: Winston handles logging asynchronously to minimize performance impact
- **Log Levels**: Use appropriate log levels to control verbosity in production
- **File I/O**: Log rotation happens automatically without blocking operations
- **Memory**: Old log files are automatically cleaned up to prevent disk space issues

## Monitoring and Analysis

### Viewing Logs
```bash
# View all logs
type logs\combined.log

# View errors only
type logs\error.log

# Search for specific component
type logs\combined.log | findstr "TopicManager"

# Search for errors
type logs\error.log | findstr "error"
```

### Log Analysis
Since logs are in JSON format, they can be easily parsed and analyzed:

```typescript
import fs from 'fs';

const logs = fs.readFileSync('logs/combined.log', 'utf8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => JSON.parse(line));

// Analyze errors
const errors = logs.filter(log => log.level === 'error');

// Find slow operations
const slowOps = logs.filter(log => 
  log.durationMs && log.durationMs > 1000
);
```

## Future Enhancements

Potential improvements for the logging system:

1. **Remote Logging**: Send logs to external services (e.g., CloudWatch, Datadog)
2. **Log Aggregation**: Centralized log collection for distributed systems
3. **Alerting**: Automatic alerts for critical errors
4. **Metrics Integration**: Combine logs with performance metrics
5. **Log Sampling**: Sample high-volume logs to reduce storage

## Troubleshooting

### Logs Not Appearing
1. Check log directory exists: `logs/`
2. Verify file permissions
3. Check log level configuration (DEBUG shows all logs)

### Log Files Too Large
1. Reduce `maxFileSize` in configuration
2. Reduce `maxFiles` to keep fewer rotated files
3. Increase log level to reduce verbosity (INFO instead of DEBUG)

### Performance Issues
1. Disable console logging in production
2. Increase log level to reduce I/O
3. Use async logging (already enabled by default)

## Summary

The comprehensive logging system is now fully implemented and integrated across all components of the AI Blog Generator. All operations are logged with appropriate context, errors include stack traces, and logs are automatically rotated to prevent disk space issues.

**Key Benefits:**
- ✅ Complete visibility into system operations
- ✅ Easy debugging with contextual information
- ✅ Automatic log rotation and cleanup
- ✅ Structured logs for easy analysis
- ✅ Production-ready error tracking
