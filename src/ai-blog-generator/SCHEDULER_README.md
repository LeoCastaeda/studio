# Content Scheduler

The Content Scheduler manages the automatic generation and scheduling of blog articles. It uses cron jobs to execute tasks at configured intervals and orchestrates the complete article generation workflow.

## Features

- **Automatic Scheduling**: Generate articles automatically based on configurable frequency (daily, weekly, or custom intervals)
- **Cron-based Execution**: Uses node-cron for reliable scheduled task execution
- **Task Management**: Create, list, execute, and cancel scheduled tasks
- **Complete Workflow**: Orchestrates the full generation pipeline: topic selection → content generation → quality validation → publishing
- **Error Handling**: Robust error handling with task status tracking
- **Timezone Support**: Respects configured timezone for scheduling

## Configuration

The scheduler is configured through environment variables:

```env
# Enable/disable scheduler
SCHEDULE_ENABLED=true

# Frequency: 'daily', 'weekly', or 'custom'
SCHEDULE_FREQUENCY=custom

# For custom frequency: number of days between generations
SCHEDULE_CUSTOM_DAYS=5

# Time to publish (24-hour format)
SCHEDULE_PUBLISH_TIME=09:00

# Timezone for scheduling
SCHEDULE_TIMEZONE=Europe/Madrid
```

## Usage

### Starting the Scheduler

```typescript
import { ContentScheduler } from './scheduler';
import { Repository } from './database/repository';
import { TopicManager } from './topic-manager';
import { AIContentGenerator } from './ai-generator';
import { QualityChecker } from './quality-checker';
import { AutoPublisher } from './publisher';

// Initialize dependencies
const repository = new Repository(db);
const topicManager = new TopicManager(repository);
const aiGenerator = new AIContentGenerator(aiConfig);
const qualityChecker = new QualityChecker(qualityConfig);
const publisher = new AutoPublisher(repository, publishConfig);

// Create scheduler
const scheduler = new ContentScheduler(
  schedulerConfig,
  repository,
  topicManager,
  aiGenerator,
  qualityChecker,
  publisher
);

// Start automatic scheduling
scheduler.start();

// Stop when needed
scheduler.stop();
```

### Manual Task Scheduling

```typescript
// Schedule a new article generation
const task = await scheduler.scheduleNextGeneration();
console.log(`Scheduled task: ${task.id}`);

// Schedule an article update
const updateTask = await scheduler.scheduleArticleUpdate('article-slug');
console.log(`Scheduled update: ${updateTask.id}`);
```

### Task Management

```typescript
// Get upcoming tasks
const tasks = await scheduler.getUpcomingTasks(10);
tasks.forEach(task => {
  console.log(`${task.id}: ${task.type} at ${task.scheduledFor}`);
});

// Execute all pending tasks manually
await scheduler.executePendingTasks();

// Cancel a task
await scheduler.cancelTask('task-id');
```

## Scheduling Logic

### Frequency Modes

1. **Daily**: Generates an article every day at the specified time
   - Cron expression: `MM HH * * *`
   - Example: `0 9 * * *` (9:00 AM daily)

2. **Weekly**: Generates an article every Monday at the specified time
   - Cron expression: `MM HH * * 1`
   - Example: `0 9 * * 1` (9:00 AM every Monday)

3. **Custom**: Generates an article every N days at the specified time
   - Cron expression: `MM HH * * *` (runs daily but checks if enough days passed)
   - Example: Every 5 days at 9:00 AM

### Task Execution Flow

When a scheduled task runs:

1. **Check Conditions**:
   - For custom frequency: verify enough days have passed since last generation
   - Check no other task is scheduled for today (prevents duplicates)

2. **Select Topic**:
   - Apply selection criteria (avoid recent, prefer seasonal, prioritize high-priority)
   - Balance category distribution

3. **Generate Content**:
   - Create generation prompt with topic and configuration
   - Call AI provider to generate article content
   - Parse and structure the response

4. **Validate Quality**:
   - Check content length, structure, and formatting
   - Validate SEO metadata
   - Calculate quality score

5. **Publish or Draft**:
   - If auto-publish enabled and quality passed: publish immediately
   - Otherwise: save as draft for manual review
   - Create metrics entry for published articles

6. **Update Records**:
   - Mark topic as used
   - Update task status to completed
   - Record article slug in task

## Task States

Tasks progress through the following states:

- **pending**: Task is scheduled but not yet executed
- **running**: Task is currently being executed
- **completed**: Task finished successfully
- **failed**: Task encountered an error during execution

## Error Handling

The scheduler includes comprehensive error handling:

- **Task Isolation**: Errors in one task don't affect others
- **Status Tracking**: Failed tasks are marked with error messages
- **Logging**: All operations are logged for debugging
- **Retry Logic**: AI generator includes automatic retry with exponential backoff
- **Graceful Degradation**: Scheduler continues running even if individual tasks fail

## Testing

Run the scheduler test script:

```bash
npm run blog:test-scheduler
```

This will:
- Initialize the scheduler with current configuration
- List upcoming tasks
- Attempt to schedule a new generation task
- Display scheduler configuration

## Requirements Validation

The scheduler implements the following requirements:

- **Requirement 1.1**: Generate articles automatically every X days
- **Requirement 1.2**: Allow configurable frequency
- **Requirement 1.3**: Avoid multiple articles on same day
- **Requirement 1.4**: Respect optimal publishing times
- **Requirement 1.5**: Maintain registry of scheduled publications

## Integration with Other Components

The scheduler integrates with:

- **TopicManager**: Selects topics for generation
- **AIContentGenerator**: Generates article content
- **QualityChecker**: Validates content quality
- **AutoPublisher**: Publishes or saves articles
- **Repository**: Manages database operations
- **ErrorHandler**: Handles errors and retries (future)

## Future Enhancements

Planned improvements:

- Dashboard for monitoring scheduled tasks
- Email notifications for task completion/failure
- Advanced scheduling rules (e.g., avoid weekends, holidays)
- Task priority and queue management
- Parallel task execution for updates
- Integration with metrics for optimal scheduling times
