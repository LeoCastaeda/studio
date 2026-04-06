# Logging System Documentation

## Overview

The AI Blog Generator uses Winston for comprehensive structured logging. All operations are logged with contextual information, making it easy to debug issues and monitor system behavior.

## Features

- **Multiple Log Levels**: error, warn, info, debug
- **Structured Logging**: All logs include contextual metadata
- **Log Rotation**: Automatic rotation based on file size
- **Multiple Transports**: Console and file outputs
- **Stack Traces**: Automatic capture for errors
- **Operation Tracking**: Start, complete, and fail operations with duration tracking

## Log Levels

- **ERROR**: Critical errors that require attention
- **WARN**: Warning messages for non-critical issues
- **INFO**: General informational messages about system operations
- **DEBUG**: Detailed debugging information

## Configuration

The logger can be configured via environment variables or programmatically:

### Environment Variables

```bash
LOG_LEVEL=info  # error, warn, info, or debug
```

### Programmatic Configuration

```typescript
import { initializeLogger, LogLevel } from './logger';

initializeLogger({
  level: LogLevel.INFO,
  logDir: './logs',
  enableConsole: true,
  enableFile: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 14, // Keep 2 weeks of logs
  datePattern: 'YYYY-MM-DD',
});
```

## Log Files

Logs are written to the `./logs` directory:

- **combined.log**: All log levels
- **error.log**: Error logs only
- **info.log**: Info and above

Files are automatically rotated when they reach the configured size limit.

## Usage

### Basic Logging

```typescript
import { getLogger } from './logger';

const logger = getLogger();

logger.info('Operation started', {
  operation: 'generateArticle',
  topicId: '123',
});

logger.error('Operation failed', {
  operation: 'generateArticle',
  topicId: '123',
}, error);
```

### Child Loggers

Create child loggers with default context:

```typescript
const logger = getLogger().child({ component: 'AIGenerator' });

// All logs from this logger will include component: 'AIGenerator'
logger.info('Generating content');
```

### Operation Tracking

Track operations with automatic duration measurement:

```typescript
const logger = getLogger();

// Manual tracking
logger.startOperation('generateArticle', { topicId: '123' });
// ... do work ...
logger.completeOperation('generateArticle', { topicId: '123' }, durationMs);

// Or use measureOperation for automatic tracking
const result = await logger.measureOperation(
  'generateArticle',
  async () => {
    // ... do work ...
    return result;
  },
  { topicId: '123' }
);
```

## Log Format

### Console Format

```
[2024-12-11 15:30:45] [INFO] [ContentScheduler] [executeTask] Task completed successfully {"taskId":"abc123","durationMs":1234}
```

### File Format (JSON)

```json
{
  "timestamp": "2024-12-11T15:30:45.123Z",
  "level": "info",
  "message": "Task completed successfully",
  "metadata": {
    "component": "ContentScheduler",
    "operation": "executeTask",
    "taskId": "abc123",
    "durationMs": 1234
  }
}
```

## Best Practices

### 1. Always Include Context

```typescript
// Good
logger.info('Article generated', {
  operation: 'generateArticle',
  topicId: topic.id,
  wordCount: article.wordCount,
});

// Bad
logger.info('Article generated');
```

### 2. Use Appropriate Log Levels

- **ERROR**: System failures, exceptions, critical issues
- **WARN**: Recoverable errors, deprecated features, configuration issues
- **INFO**: Normal operations, state changes, important events
- **DEBUG**: Detailed information for debugging

### 3. Include Error Objects

```typescript
// Good
logger.error('Failed to generate article', {
  operation: 'generateArticle',
  topicId: topic.id,
}, error);

// Bad
logger.error('Failed to generate article: ' + error.message);
```

### 4. Use Child Loggers for Components

```typescript
export class AIContentGenerator {
  private logger: Logger;

  constructor(config: AIProviderConfig) {
    this.logger = getLogger().child({ component: 'AIContentGenerator' });
  }

  async generateArticle(prompt: GenerationPrompt) {
    this.logger.info('Generating article', {
      operation: 'generateArticle',
      topicId: prompt.topic.id,
    });
    // ...
  }
}
```

### 5. Track Operation Duration

```typescript
const startTime = Date.now();
try {
  // ... do work ...
  const duration = Date.now() - startTime;
  logger.completeOperation('operation', context, duration);
} catch (error) {
  const duration = Date.now() - startTime;
  logger.failOperation('operation', error, { ...context, durationMs: duration });
}
```

## Monitoring and Debugging

### View Recent Logs

```bash
# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# View info and above
tail -f logs/info.log
```

### Search Logs

```bash
# Find all logs for a specific operation
grep "generateArticle" logs/combined.log

# Find all errors
grep "ERROR" logs/combined.log

# Find logs for a specific task
grep "taskId.*abc123" logs/combined.log
```

### Parse JSON Logs

```bash
# Pretty print JSON logs
cat logs/combined.log | jq '.'

# Filter by component
cat logs/combined.log | jq 'select(.metadata.component == "ContentScheduler")'

# Filter by operation
cat logs/combined.log | jq 'select(.metadata.operation == "generateArticle")'
```

## Log Rotation

Logs are automatically rotated based on file size:

- Maximum file size: 10MB (configurable)
- Maximum files kept: 14 (configurable)
- Older files are automatically deleted

## Performance Considerations

- Logging is asynchronous and non-blocking
- File writes are buffered for performance
- Console logging can be disabled in production if needed
- Debug logs should be disabled in production for performance

## Troubleshooting

### Logs Not Appearing

1. Check log level configuration
2. Verify log directory exists and is writable
3. Check console/file transport configuration

### Log Files Growing Too Large

1. Reduce maxFileSize configuration
2. Reduce maxFiles to keep fewer rotated files
3. Increase log level to reduce verbosity

### Performance Issues

1. Disable console logging in production
2. Increase log level to reduce log volume
3. Use async file writes (enabled by default)
