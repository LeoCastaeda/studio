/**
 * Type definitions for the AI Blog Generator system
 */

import { BlogCategorySlug } from '@/lib/blog/blog-types';

// ============================================================================
// Scheduler Types
// ============================================================================

export interface SchedulerConfig {
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number;
  publishTime: string; // HH:MM formato 24h
  timezone: string;
  enabled: boolean;
}

export interface ScheduledTask {
  id: string;
  type: 'generate' | 'update';
  scheduledFor: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  topicId?: string;
  articleSlug?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

// ============================================================================
// Topic Manager Types
// ============================================================================

export interface Topic {
  id: string;
  title: string;
  category: BlogCategorySlug;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  seasonal?: {
    months: number[]; // 1-12
  };
  keywords: string[];
  lastUsed?: Date;
  timesUsed: number;
  status: 'active' | 'used' | 'archived';
  createdAt: Date;
}

export interface TopicSelectionCriteria {
  avoidRecentTopics: boolean;
  preferSeasonal: boolean;
  preferHighPriority: boolean;
  categoryDistribution: boolean;
}

// ============================================================================
// AI Generator Types
// ============================================================================

export interface GenerationPrompt {
  topic: Topic;
  targetWordCount: number;
  tone: 'professional' | 'casual' | 'technical';
  includeCallToAction: boolean;
  relatedServices: string[];
  context?: string;
}

export interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string; // Markdown format
  suggestedTags: string[];
  suggestedCategory: BlogCategorySlug;
  seoMetadata: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  internalLinks: Array<{
    text: string;
    url: string;
  }>;
  callToAction: string;
  wordCount: number;
  generatedAt: Date;
}

export interface AIProviderConfig {
  provider: 'openai' | 'anthropic' | 'gemini';
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

// ============================================================================
// Quality Checker Types
// ============================================================================

export interface QualityCheckResult {
  passed: boolean;
  score: number; // 0-100
  issues: QualityIssue[];
  warnings: string[];
  suggestions: string[];
}

export interface QualityIssue {
  type: 'plagiarism' | 'factual_error' | 'poor_structure' | 'seo_issue' | 'tone_mismatch';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: string;
}

export interface QualityCheckConfig {
  minWordCount: number;
  maxWordCount: number;
  requireCallToAction: boolean;
  requireInternalLinks: boolean;
  minReadabilityScore: number;
  checkPlagiarism: boolean;
  checkFactualAccuracy: boolean;
}

// ============================================================================
// Publisher Types
// ============================================================================

export interface PublishConfig {
  autoPublish: boolean;
  requireManualReview: boolean;
  notifyOnPublish: boolean;
  notificationEmail?: string;
}

export interface PublishedArticle {
  slug: string;
  filePath: string;
  publishedAt: Date;
  status: 'draft' | 'published';
  reviewStatus?: 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// Update Manager Types
// ============================================================================

export interface UpdateCandidate {
  slug: string;
  title: string;
  publishedAt: Date;
  lastUpdated?: Date;
  ageInDays: number;
  category: BlogCategorySlug;
  needsUpdate: boolean;
  updateReason: string;
}

export interface ArticleUpdate {
  slug: string;
  originalContent: string;
  updatedContent: string;
  changes: Array<{
    section: string;
    type: 'added' | 'modified' | 'removed';
    description: string;
  }>;
  updatedAt: Date;
}

// ============================================================================
// Metrics Tracker Types
// ============================================================================

export interface ArticleMetrics {
  slug: string;
  views: number;
  avgTimeOnPage: number; // segundos
  bounceRate: number; // porcentaje
  shares: number;
  comments: number;
  lastTracked: Date;
}

export interface PerformanceAnalysis {
  topPerformingArticles: Array<{
    slug: string;
    score: number;
    metrics: ArticleMetrics;
  }>;
  commonPatterns: {
    successfulTopics: string[];
    successfulCategories: BlogCategorySlug[];
    optimalWordCount: number;
    bestPublishTimes: string[];
  };
}

// ============================================================================
// Error Handling Types
// ============================================================================

export interface ErrorRecoveryConfig {
  maxRetries: number;
  retryDelay: number; // milliseconds
  backoffMultiplier: number;
  notifyOnFailure: boolean;
  fallbackBehavior: 'skip' | 'retry_later' | 'manual_intervention';
}
