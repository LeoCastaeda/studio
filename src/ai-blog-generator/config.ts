/**
 * Configuration management for AI Blog Generator
 * 
 * This module handles loading and validating configuration from environment variables.
 */

import { AIProviderConfig, SchedulerConfig, PublishConfig, QualityCheckConfig, ErrorRecoveryConfig } from './types';

/**
 * Load AI provider configuration from environment variables
 */
export function loadAIConfig(): AIProviderConfig {
  const provider = (process.env.AI_PROVIDER || 'openai') as 'openai' | 'anthropic' | 'gemini';
  
  let apiKey: string | undefined;
  let defaultModel: string;
  
  if (provider === 'openai') {
    apiKey = process.env.OPENAI_API_KEY;
    defaultModel = 'gpt-4o-mini';
  } else if (provider === 'anthropic') {
    apiKey = process.env.ANTHROPIC_API_KEY;
    defaultModel = 'claude-3-opus-20240229';
  } else if (provider === 'gemini') {
    apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    defaultModel = 'gemini-2.5-flash';
  } else {
    throw new Error(`Unknown AI provider: ${provider}`);
  }
  
  if (!apiKey) {
    throw new Error(`Missing API key for provider: ${provider}`);
  }

  return {
    provider,
    model: process.env.AI_MODEL || defaultModel,
    apiKey,
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4000', 10),
  };
}

/**
 * Load scheduler configuration from environment variables
 */
export function loadSchedulerConfig(): SchedulerConfig {
  const frequency = (process.env.SCHEDULE_FREQUENCY || 'custom') as 'daily' | 'weekly' | 'custom';
  
  return {
    frequency,
    customDays: frequency === 'custom' ? parseInt(process.env.SCHEDULE_CUSTOM_DAYS || '5', 10) : undefined,
    publishTime: process.env.SCHEDULE_PUBLISH_TIME || '09:00',
    timezone: process.env.SCHEDULE_TIMEZONE || 'Europe/Madrid',
    enabled: process.env.SCHEDULE_ENABLED === 'true',
  };
}

/**
 * Load publisher configuration from environment variables
 */
export function loadPublishConfig(): PublishConfig {
  return {
    autoPublish: process.env.AUTO_PUBLISH === 'true',
    requireManualReview: process.env.REQUIRE_MANUAL_REVIEW === 'true',
    notifyOnPublish: process.env.NOTIFICATION_EMAIL !== undefined,
    notificationEmail: process.env.NOTIFICATION_EMAIL,
  };
}

/**
 * Load quality check configuration from environment variables
 */
export function loadQualityConfig(): QualityCheckConfig {
  return {
    minWordCount: parseInt(process.env.MIN_WORD_COUNT || '800', 10),
    maxWordCount: parseInt(process.env.MAX_WORD_COUNT || '2000', 10),
    requireCallToAction: true,
    requireInternalLinks: true,
    minReadabilityScore: parseInt(process.env.MIN_QUALITY_SCORE || '75', 10),
    checkPlagiarism: process.env.CHECK_PLAGIARISM === 'true',
    checkFactualAccuracy: true,
  };
}

/**
 * Load error recovery configuration from environment variables
 */
export function loadErrorRecoveryConfig(): ErrorRecoveryConfig {
  return {
    maxRetries: parseInt(process.env.ERROR_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.ERROR_RETRY_DELAY || '1000', 10),
    backoffMultiplier: parseFloat(process.env.ERROR_BACKOFF_MULTIPLIER || '2', 10),
    notifyOnFailure: process.env.ERROR_NOTIFY_ON_FAILURE === 'true',
    fallbackBehavior: (process.env.ERROR_FALLBACK_BEHAVIOR || 'retry_later') as 'skip' | 'retry_later' | 'manual_intervention',
  };
}

/**
 * Get database path from environment variables
 */
export function getDatabasePath(): string {
  return process.env.DATABASE_PATH || './data/ai-blog-generator.db';
}

/**
 * Get blog content path from environment variables
 */
export function getBlogContentPath(): string {
  return process.env.BLOG_CONTENT_PATH || './content/blog';
}

/**
 * Validate all required environment variables are set
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Check AI provider configuration
  try {
    loadAIConfig();
  } catch (error) {
    errors.push(`AI Config: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validate scheduler config
  const schedulerConfig = loadSchedulerConfig();
  if (schedulerConfig.frequency === 'custom' && !schedulerConfig.customDays) {
    errors.push('SCHEDULE_CUSTOM_DAYS is required when SCHEDULE_FREQUENCY is "custom"');
  }

  // Validate publish config
  const publishConfig = loadPublishConfig();
  if (publishConfig.notifyOnPublish && !publishConfig.notificationEmail) {
    errors.push('NOTIFICATION_EMAIL is required when notifications are enabled');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Export aliases for convenience
export const getAIProviderConfig = loadAIConfig;
export const getSchedulerConfig = loadSchedulerConfig;
export const getPublishConfig = loadPublishConfig;
export const getQualityCheckConfig = loadQualityConfig;
export const getErrorRecoveryConfig = loadErrorRecoveryConfig;
