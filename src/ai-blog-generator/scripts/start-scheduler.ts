/**
 * Start the Content Scheduler
 * 
 * This script starts the scheduler in daemon mode, running continuously
 * and executing scheduled tasks based on the configured frequency.
 * 
 * Usage:
 *   tsx src/ai-blog-generator/scripts/start-scheduler.ts
 * 
 * The scheduler will:
 * - Run according to the configured schedule (daily/weekly/custom)
 * - Generate articles automatically at the specified time
 * - Handle errors gracefully and continue running
 * - Log all operations to console
 * 
 * Press Ctrl+C to stop the scheduler.
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { ContentScheduler } from '../scheduler';
import { TopicManager } from '../topic-manager';
import { AIContentGenerator } from '../ai-generator';
import { QualityChecker } from '../quality-checker';
import { AutoPublisher } from '../publisher';
import {
  getDatabasePath,
  loadSchedulerConfig,
  loadAIConfig,
  loadPublishConfig,
  loadQualityConfig,
  validateConfig,
} from '../config';
import { initializeLogger, LogLevel, getLogger } from '../logger';

// Initialize logger
const logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
initializeLogger({
  level: logLevel,
  logDir: './logs',
  enableConsole: true,
  enableFile: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 14, // Keep 2 weeks of logs
  datePattern: 'YYYY-MM-DD',
});

const logger = getLogger();

async function startScheduler() {
  logger.info('Starting AI Blog Generator - Content Scheduler', {
    operation: 'startScheduler',
  });

  // Validate configuration
  try {
    validateConfig();
    console.log('✓ Configuration validated\n');
  } catch (error) {
    console.error('Configuration error:', error);
    process.exit(1);
  }

  // Initialize database
  console.log('Initializing database...');
  const dbPath = getDatabasePath();
  const db = new DatabaseConnection(dbPath);
  await db.initialize();
  const repository = new Repository(db);
  console.log('✓ Database initialized\n');

  // Initialize components
  console.log('Initializing components...');
  const topicManager = new TopicManager(repository);
  const aiConfig = loadAIConfig();
  const aiGenerator = new AIContentGenerator(aiConfig);
  const qualityConfig = loadQualityConfig();
  const qualityChecker = new QualityChecker(qualityConfig);
  const publishConfig = loadPublishConfig();
  const publisher = new AutoPublisher(repository, publishConfig);
  console.log('✓ Components initialized\n');

  // Initialize scheduler
  const schedulerConfig = loadSchedulerConfig();
  const scheduler = new ContentScheduler(
    schedulerConfig,
    repository,
    topicManager,
    aiGenerator,
    qualityChecker,
    publisher
  );

  // Display configuration
  console.log('Scheduler Configuration:');
  console.log(`  Enabled: ${schedulerConfig.enabled}`);
  console.log(`  Frequency: ${schedulerConfig.frequency}`);
  if (schedulerConfig.customDays) {
    console.log(`  Custom days: ${schedulerConfig.customDays}`);
  }
  console.log(`  Publish time: ${schedulerConfig.publishTime}`);
  console.log(`  Timezone: ${schedulerConfig.timezone}`);
  console.log(`  Auto-publish: ${publishConfig.autoPublish}`);
  console.log(`  Require review: ${publishConfig.requireManualReview}`);
  console.log();

  if (!schedulerConfig.enabled) {
    console.log('⚠ Scheduler is disabled in configuration');
    console.log('Set SCHEDULE_ENABLED=true to enable automatic scheduling');
    process.exit(0);
  }

  // Start scheduler
  console.log('Starting scheduler...');
  scheduler.start();
  console.log('✓ Scheduler started successfully\n');

  // Display upcoming tasks
  const upcomingTasks = await scheduler.getUpcomingTasks(5);
  if (upcomingTasks.length > 0) {
    console.log('Upcoming tasks:');
    upcomingTasks.forEach(task => {
      console.log(`  - ${task.id}: ${task.type} at ${task.scheduledFor.toISOString()}`);
    });
    console.log();
  } else {
    console.log('No upcoming tasks scheduled\n');
  }

  console.log('Scheduler is now running. Press Ctrl+C to stop.\n');

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\nShutting down scheduler...');
    scheduler.stop();
    await db.close();
    console.log('✓ Scheduler stopped');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\nShutting down scheduler...');
    scheduler.stop();
    await db.close();
    console.log('✓ Scheduler stopped');
    process.exit(0);
  });

  // Keep process alive
  await new Promise(() => {});
}

// Start the scheduler
startScheduler().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
