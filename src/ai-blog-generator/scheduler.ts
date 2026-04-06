/**
 * Content Scheduler
 * 
 * Manages the scheduling and execution of article generation tasks.
 * Implements Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */

import * as cron from 'node-cron';
import { Repository } from './database/repository';
import { TopicManager } from './topic-manager';
import { AIContentGenerator } from './ai-generator';
import { QualityChecker } from './quality-checker';
import { AutoPublisher } from './publisher';
import { ScheduledTask, SchedulerConfig, TopicSelectionCriteria, GenerationPrompt } from './types';
import { getLogger, Logger } from './logger';

export class ContentScheduler {
  private cronJob?: cron.ScheduledTask;
  private isRunning = false;
  private logger: Logger;

  constructor(
    private config: SchedulerConfig,
    private repository: Repository,
    private topicManager: TopicManager,
    private aiGenerator: AIContentGenerator,
    private qualityChecker: QualityChecker,
    private publisher: AutoPublisher
  ) {
    this.logger = getLogger().child({ component: 'ContentScheduler' });
  }

  /**
   * Start the cron job for automatic article generation
   * Requirement 1.1: Generate articles automatically every X days
   * Requirement 1.2: Allow configurable frequency
   * Requirement 1.4: Respect optimal publishing times
   */
  start(): void {
    if (!this.config.enabled) {
      this.logger.info('Scheduler is disabled in configuration', {
        operation: 'start',
      });
      return;
    }

    if (this.cronJob) {
      this.logger.warn('Scheduler is already running', {
        operation: 'start',
      });
      return;
    }

    const cronExpression = this.buildCronExpression();
    this.logger.info('Starting scheduler', {
      operation: 'start',
      cronExpression,
      frequency: this.config.frequency,
      publishTime: this.config.publishTime,
      timezone: this.config.timezone,
    });

    this.cronJob = cron.schedule(
      cronExpression,
      async () => {
        if (this.isRunning) {
          this.logger.warn('Previous task still running, skipping execution', {
            operation: 'cronTrigger',
          });
          return;
        }

        try {
          this.isRunning = true;
          this.logger.info('Executing scheduled generation task', {
            operation: 'cronTrigger',
          });
          await this.scheduleNextGeneration();
        } catch (error) {
          this.logger.error('Error during scheduled execution', {
            operation: 'cronTrigger',
          }, error as Error);
        } finally {
          this.isRunning = false;
        }
      },
      {
        timezone: this.config.timezone,
      }
    );

    this.logger.info('Scheduler started successfully', {
      operation: 'start',
    });
  }

  /**
   * Stop the cron job
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = undefined;
      this.logger.info('Scheduler stopped', {
        operation: 'stop',
      });
    }
  }

  /**
   * Build cron expression based on configuration
   * Requirement 1.2: Configurable frequency
   * Requirement 1.4: Respect optimal publishing times
   */
  private buildCronExpression(): string {
    const [hours, minutes] = this.config.publishTime.split(':').map(Number);

    switch (this.config.frequency) {
      case 'daily':
        // Every day at specified time
        return `${minutes} ${hours} * * *`;
      
      case 'weekly':
        // Every Monday at specified time
        return `${minutes} ${hours} * * 1`;
      
      case 'custom':
        if (!this.config.customDays) {
          throw new Error('customDays is required when frequency is "custom"');
        }
        // Every N days at specified time
        // Note: cron doesn't support "every N days" directly, so we'll use a different approach
        // We'll run daily and check if enough days have passed since last generation
        return `${minutes} ${hours} * * *`;
      
      default:
        throw new Error(`Unknown frequency: ${this.config.frequency}`);
    }
  }

  /**
   * Check if enough time has passed since last generation (for custom frequency)
   */
  private async shouldGenerateToday(): Promise<boolean> {
    if (this.config.frequency !== 'custom') {
      return true; // For daily/weekly, cron handles the scheduling
    }

    // Get the last completed generation task
    const tasks = await this.repository.getScheduledTasksByStatus('completed');
    const generationTasks = tasks.filter(t => t.type === 'generate');
    
    if (generationTasks.length === 0) {
      return true; // No previous generations, should generate
    }

    // Sort by completion date descending
    generationTasks.sort((a, b) => {
      const dateA = new Date(a.completed_at || a.created_at);
      const dateB = new Date(b.completed_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    const lastTask = generationTasks[0];
    const lastCompletedDate = new Date(lastTask.completed_at || lastTask.created_at);
    const daysSinceLastGeneration = Math.floor(
      (Date.now() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastGeneration >= (this.config.customDays || 0);
  }

  /**
   * Schedule the next article generation
   * Requirement 1.1: Generate articles automatically
   * Requirement 1.3: Avoid multiple articles on same day
   */
  async scheduleNextGeneration(): Promise<ScheduledTask> {
    // Check if we should generate today (for custom frequency)
    if (this.config.frequency === 'custom') {
      const shouldGenerate = await this.shouldGenerateToday();
      if (!shouldGenerate) {
        this.logger.info('Not enough days passed since last generation, skipping', {
          operation: 'scheduleNextGeneration',
          frequency: this.config.frequency,
          customDays: this.config.customDays,
        });
        throw new Error('Not enough days passed since last generation');
      }
    }

    // Check if there's already a pending or running task for today
    // Requirement 1.3: Avoid multiple articles on same day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pendingTasks = await this.repository.getPendingTasks();
    const todayTasks = pendingTasks.filter(task => {
      const taskDate = new Date(task.scheduled_for);
      return taskDate >= today && taskDate < tomorrow;
    });

    if (todayTasks.length > 0) {
      this.logger.info('Task already scheduled for today, skipping', {
        operation: 'scheduleNextGeneration',
        existingTasksCount: todayTasks.length,
      });
      throw new Error('Task already scheduled for today');
    }

    // Create a new scheduled task
    const scheduledFor = new Date();
    const task = await this.repository.createScheduledTask({
      type: 'generate',
      scheduled_for: scheduledFor.toISOString(),
      status: 'pending',
      topic_id: null,
      article_slug: null,
      completed_at: null,
      error: null,
    });

    this.logger.info('Created scheduled task', {
      operation: 'scheduleNextGeneration',
      taskId: task.id,
      scheduledFor: scheduledFor.toISOString(),
    });

    // Execute the task immediately
    await this.executeTask(task.id);

    return this.mapDbTaskToTask(task);
  }

  /**
   * Schedule an article update
   * Requirement 1.1: Schedule update tasks
   */
  async scheduleArticleUpdate(articleSlug: string): Promise<ScheduledTask> {
    const scheduledFor = new Date();
    
    const task = await this.repository.createScheduledTask({
      type: 'update',
      scheduled_for: scheduledFor.toISOString(),
      status: 'pending',
      topic_id: null,
      article_slug: articleSlug,
      completed_at: null,
      error: null,
    });

    this.logger.info('Created update task for article', {
      operation: 'scheduleArticleUpdate',
      taskId: task.id,
      articleSlug,
      scheduledFor: scheduledFor.toISOString(),
    });

    return this.mapDbTaskToTask(task);
  }

  /**
   * Execute all pending tasks
   * Requirement 1.5: Execute pending tasks
   */
  async executePendingTasks(): Promise<void> {
    const pendingTasks = await this.repository.getPendingTasks();
    
    this.logger.info('Found pending tasks', {
      operation: 'executePendingTasks',
      count: pendingTasks.length,
    });

    for (const task of pendingTasks) {
      try {
        await this.executeTask(task.id);
      } catch (error) {
        this.logger.error('Error executing task', {
          operation: 'executePendingTasks',
          taskId: task.id,
        }, error as Error);
        // Continue with next task
      }
    }
  }

  /**
   * Execute a specific task
   * Requirement 1.5: Handle errors in execution
   */
  private async executeTask(taskId: string): Promise<void> {
    const task = await this.repository.getScheduledTask(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status !== 'pending') {
      this.logger.info('Task is not pending, skipping', {
        operation: 'executeTask',
        taskId,
        status: task.status,
      });
      return;
    }

    // Mark task as running
    await this.repository.updateScheduledTask(taskId, {
      status: 'running',
    });

    this.logger.startOperation('executeTask', {
      taskId,
      taskType: task.type,
    });

    const startTime = Date.now();

    try {
      if (task.type === 'generate') {
        await this.executeGenerationTask(task);
      } else if (task.type === 'update') {
        await this.executeUpdateTask(task);
      }

      // Mark task as completed
      await this.repository.updateScheduledTask(taskId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

      const duration = Date.now() - startTime;
      this.logger.completeOperation('executeTask', {
        taskId,
        taskType: task.type,
      }, duration);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Mark task as failed
      await this.repository.updateScheduledTask(taskId, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        error: errorMessage,
      });

      const duration = Date.now() - startTime;
      this.logger.failOperation('executeTask', error as Error, {
        taskId,
        taskType: task.type,
        durationMs: duration,
      });
      throw error;
    }
  }

  /**
   * Execute a generation task (full workflow)
   * This implements the complete generation flow:
   * Select topic → Generate content → Validate → Publish
   */
  private async executeGenerationTask(task: any): Promise<void> {
    this.logger.info('Executing generation task', {
      operation: 'executeGenerationTask',
      taskId: task.id,
    });

    // Step 1: Select topic
    const criteria: TopicSelectionCriteria = {
      avoidRecentTopics: true,
      preferSeasonal: true,
      preferHighPriority: true,
      categoryDistribution: true,
    };

    const topic = await this.topicManager.selectNextTopic(criteria);
    if (!topic) {
      throw new Error('No available topics for generation');
    }

    this.logger.info('Selected topic', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
      topicTitle: topic.title,
      category: topic.category,
    });

    // Update task with topic_id
    await this.repository.updateScheduledTask(task.id, {
      topic_id: topic.id,
    });

    // Step 2: Generate content
    const prompt: GenerationPrompt = {
      topic,
      targetWordCount: 1200,
      tone: 'professional',
      includeCallToAction: true,
      relatedServices: ['reparacion-parabrisas', 'sustitucion-parabrisas', 'calibracion-adas'],
    };

    this.logger.info('Generating article content', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
      targetWordCount: 1200,
    });
    
    const article = await this.aiGenerator.generateArticle(prompt);
    
    this.logger.info('Article generated', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
      articleTitle: article.title,
      wordCount: article.wordCount,
    });

    // Step 3: Validate quality
    this.logger.info('Checking article quality', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
    });
    
    const qualityResult = await this.qualityChecker.checkArticle(article);
    
    this.logger.info('Quality check complete', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
      qualityScore: qualityResult.score,
      issuesCount: qualityResult.issues.length,
      passed: qualityResult.passed,
    });

    if (qualityResult.issues.length > 0) {
      qualityResult.issues.forEach(issue => {
        this.logger.warn('Quality issue detected', {
          operation: 'executeGenerationTask',
          taskId: task.id,
          topicId: topic.id,
          issueType: issue.type,
          severity: issue.severity,
          description: issue.description,
        });
      });
    }

    // Step 4: Publish (or save as draft)
    this.logger.info('Publishing article', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
    });
    
    const published = await this.publisher.publishArticle(
      article,
      topic.id,
      qualityResult.score
    );

    this.logger.info('Article published', {
      operation: 'executeGenerationTask',
      taskId: task.id,
      topicId: topic.id,
      articleSlug: published.slug,
      status: published.status,
      reviewStatus: published.reviewStatus,
    });

    // Update task with article slug
    await this.repository.updateScheduledTask(task.id, {
      article_slug: published.slug,
    });

    // Mark topic as used
    await this.topicManager.markTopicAsUsed(topic.id);
  }

  /**
   * Execute an update task
   * Calls UpdateManager to update the article
   */
  private async executeUpdateTask(task: any): Promise<void> {
    this.logger.info('Executing update task', {
      operation: 'executeUpdateTask',
      taskId: task.id,
      articleSlug: task.article_slug,
    });
    
    if (!task.article_slug) {
      throw new Error('Update task missing article_slug');
    }

    // Import UpdateManager dynamically to avoid circular dependency
    const { UpdateManager } = await import('./update-manager');
    const updateManager = new UpdateManager(
      this.repository,
      this.aiGenerator,
      this
    );

    // Execute the update
    const result = await updateManager.updateArticle(task.article_slug);
    
    this.logger.info('Article updated successfully', {
      operation: 'executeUpdateTask',
      taskId: task.id,
      articleSlug: result.slug,
      changesCount: result.changes.length,
    });
  }

  /**
   * Get upcoming tasks
   * Requirement 1.5: List scheduled tasks
   */
  async getUpcomingTasks(limit: number = 10): Promise<ScheduledTask[]> {
    const tasks = await this.repository.getUpcomingTasks(limit);
    return tasks.map(t => this.mapDbTaskToTask(t));
  }

  /**
   * Cancel a scheduled task
   * Requirement 1.5: Cancel tasks
   */
  async cancelTask(taskId: string): Promise<void> {
    const task = await this.repository.getScheduledTask(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status === 'running') {
      throw new Error('Cannot cancel a running task');
    }

    if (task.status === 'completed' || task.status === 'failed') {
      throw new Error('Cannot cancel a completed or failed task');
    }

    await this.repository.deleteScheduledTask(taskId);
    
    this.logger.info('Task cancelled', {
      operation: 'cancelTask',
      taskId,
      taskType: task.type,
    });
  }

  /**
   * Map database task to application task type
   */
  private mapDbTaskToTask(dbTask: any): ScheduledTask {
    return {
      id: dbTask.id,
      type: dbTask.type,
      scheduledFor: new Date(dbTask.scheduled_for),
      status: dbTask.status,
      topicId: dbTask.topic_id || undefined,
      articleSlug: dbTask.article_slug || undefined,
      createdAt: new Date(dbTask.created_at),
      completedAt: dbTask.completed_at ? new Date(dbTask.completed_at) : undefined,
      error: dbTask.error || undefined,
    };
  }
}
