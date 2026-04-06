/**
 * Test script for Content Scheduler
 * 
 * This script tests the scheduler functionality including:
 * - Creating scheduled tasks
 * - Executing pending tasks
 * - Managing task lifecycle
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
} from '../config';

async function testScheduler() {
  console.log('=== Testing Content Scheduler ===\n');

  // Initialize database
  const dbPath = getDatabasePath();
  const db = new DatabaseConnection(dbPath);
  await db.initialize();
  const repository = new Repository(db);

  // Initialize components
  const topicManager = new TopicManager(repository);
  const aiConfig = loadAIConfig();
  const aiGenerator = new AIContentGenerator(aiConfig);
  const qualityConfig = loadQualityConfig();
  const qualityChecker = new QualityChecker(qualityConfig);
  const publishConfig = loadPublishConfig();
  const publisher = new AutoPublisher(repository, publishConfig);

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

  try {
    // Test 1: Get upcoming tasks
    console.log('Test 1: Get upcoming tasks');
    const upcomingTasks = await scheduler.getUpcomingTasks();
    console.log(`Found ${upcomingTasks.length} upcoming tasks`);
    upcomingTasks.forEach(task => {
      console.log(`  - ${task.id}: ${task.type} (${task.status}) scheduled for ${task.scheduledFor}`);
    });
    console.log();

    // Test 2: Schedule a new generation task
    console.log('Test 2: Schedule a new generation task');
    try {
      const task = await scheduler.scheduleNextGeneration();
      console.log(`Created task: ${task.id}`);
      console.log(`  Type: ${task.type}`);
      console.log(`  Status: ${task.status}`);
      console.log(`  Scheduled for: ${task.scheduledFor}`);
      if (task.topicId) {
        console.log(`  Topic ID: ${task.topicId}`);
      }
      if (task.articleSlug) {
        console.log(`  Article slug: ${task.articleSlug}`);
      }
      console.log();
    } catch (error) {
      console.error('Error scheduling task:', error instanceof Error ? error.message : error);
      console.log();
    }

    // Test 3: Get upcoming tasks again
    console.log('Test 3: Get upcoming tasks after scheduling');
    const updatedTasks = await scheduler.getUpcomingTasks();
    console.log(`Found ${updatedTasks.length} upcoming tasks`);
    updatedTasks.forEach(task => {
      console.log(`  - ${task.id}: ${task.type} (${task.status}) scheduled for ${task.scheduledFor}`);
    });
    console.log();

    // Test 4: Test cron expression building
    console.log('Test 4: Scheduler configuration');
    console.log(`  Enabled: ${schedulerConfig.enabled}`);
    console.log(`  Frequency: ${schedulerConfig.frequency}`);
    if (schedulerConfig.customDays) {
      console.log(`  Custom days: ${schedulerConfig.customDays}`);
    }
    console.log(`  Publish time: ${schedulerConfig.publishTime}`);
    console.log(`  Timezone: ${schedulerConfig.timezone}`);
    console.log();

    console.log('=== Scheduler Tests Complete ===');
  } catch (error) {
    console.error('Error during scheduler tests:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Run tests
testScheduler().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
