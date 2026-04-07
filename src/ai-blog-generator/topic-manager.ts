/**
 * Topic Manager - Manages blog topics and selection logic
 * 
 * Handles topic selection, filtering, and management for the AI blog generator.
 * Implements Requirements 2.1, 2.2, 2.3
 */

import { Repository, Topic as DbTopic } from './database/repository';
import { Topic, TopicSelectionCriteria } from './types';
import { BlogCategorySlug } from '@/lib/blog/blog-types';
import { getLogger, Logger } from './logger';

export class TopicManager {
  private logger: Logger;

  constructor(private repository: Repository) {
    this.logger = getLogger().child({ component: 'TopicManager' });
  }

  /**
   * Add a new topic to the database
   * Requirement 2.1: Maintain a list of topics related to automotive glass
   */
  async addTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'timesUsed' | 'status'>): Promise<Topic> {
    this.logger.info('Adding new topic', { 
      operation: 'addTopic',
      topicTitle: topic.title,
      category: topic.category,
      priority: topic.priority
    });

    const dbTopic: Omit<DbTopic, 'id' | 'created_at'> = {
      title: topic.title,
      category: topic.category,
      tags: JSON.stringify(topic.tags),
      priority: topic.priority,
      seasonal_months: topic.seasonal ? JSON.stringify(topic.seasonal.months) : null,
      keywords: JSON.stringify(topic.keywords),
      last_used: topic.lastUsed ? topic.lastUsed.toISOString() : null,
      times_used: 0,
      status: 'active',
    };

    const created = await this.repository.createTopic(dbTopic);
    const result = this.mapDbTopicToTopic(created);
    
    this.logger.info('Topic added successfully', {
      operation: 'addTopic',
      topicId: result.id,
      topicTitle: result.title
    });
    
    return result;
  }

  /**
   * Get all available topics (active status)
   * Requirement 2.1: Maintain a list of topics
   */
  async getAvailableTopics(): Promise<Topic[]> {
    const dbTopics = await this.repository.getTopicsByStatus('active');
    return dbTopics.map(t => this.mapDbTopicToTopic(t));
  }

  /**
   * Mark a topic as used, updating last_used timestamp and incrementing times_used
   * Requirement 2.2: Track topic usage to avoid repetitions
   */
  async markTopicAsUsed(topicId: string): Promise<void> {
    await this.repository.markTopicAsUsed(topicId);
  }

  /**
   * Select the next topic based on selection criteria
   * Requirements 2.2, 2.3: Select varied topics, prioritize seasonal and high-priority topics
   */
  async selectNextTopic(criteria: TopicSelectionCriteria): Promise<Topic | null> {
    this.logger.info('Selecting next topic', {
      operation: 'selectNextTopic',
      criteria
    });

    let availableTopics = await this.getAvailableTopics();

    if (availableTopics.length === 0) {
      this.logger.warn('No available topics found', { operation: 'selectNextTopic' });
      return null;
    }

    const initialCount = availableTopics.length;

    // Apply filters based on criteria
    if (criteria.avoidRecentTopics) {
      availableTopics = this.filterRecentTopics(availableTopics);
      this.logger.debug('Filtered recent topics', {
        operation: 'selectNextTopic',
        beforeCount: initialCount,
        afterCount: availableTopics.length
      });
    }

    if (criteria.preferSeasonal) {
      const seasonalTopics = this.filterSeasonalTopics(availableTopics);
      if (seasonalTopics.length > 0) {
        availableTopics = seasonalTopics;
        this.logger.debug('Applied seasonal filter', {
          operation: 'selectNextTopic',
          seasonalCount: seasonalTopics.length
        });
      }
    }

    if (criteria.preferHighPriority) {
      availableTopics = this.sortByPriority(availableTopics);
      this.logger.debug('Sorted by priority', { operation: 'selectNextTopic' });
    }

    if (criteria.categoryDistribution) {
      availableTopics = await this.balanceByCategory(availableTopics);
      this.logger.debug('Balanced by category', { operation: 'selectNextTopic' });
    }

    // If no topics remain after filtering, return null
    if (availableTopics.length === 0) {
      this.logger.warn('No topics remain after filtering', { operation: 'selectNextTopic' });
      return null;
    }

    // Select the first topic (already sorted/filtered)
    const selected = availableTopics[0];
    this.logger.info('Topic selected', {
      operation: 'selectNextTopic',
      topicId: selected.id,
      topicTitle: selected.title,
      category: selected.category
    });
    
    return selected;
  }

  /**
   * Get topics by category
   */
  async getTopicsByCategory(category: BlogCategorySlug): Promise<Topic[]> {
    const dbTopics = await this.repository.getTopicsByCategory(category);
    return dbTopics.map(t => this.mapDbTopicToTopic(t));
  }

  /**
   * Get seasonal topics for a specific month
   */
  async getSeasonalTopics(month: number): Promise<Topic[]> {
    const allTopics = await this.getAvailableTopics();
    return allTopics.filter(topic => {
      if (!topic.seasonal) return false;
      return topic.seasonal.months.includes(month);
    });
  }

  // ==========================================================================
  // Private Helper Methods
  // ==========================================================================

  /**
   * Filter out topics used in the last 30 days
   * Requirement 2.2: Avoid repetitions of recent topics
   */
  private filterRecentTopics(topics: Topic[]): Topic[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return topics.filter(topic => {
      if (!topic.lastUsed) return true;
      return topic.lastUsed < thirtyDaysAgo;
    });
  }

  /**
   * Filter topics that are seasonal for the current month
   * Requirement 2.3: Prioritize seasonal topics
   */
  private filterSeasonalTopics(topics: Topic[]): Topic[] {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    return topics.filter(topic => {
      if (!topic.seasonal) return false;
      return topic.seasonal.months.includes(currentMonth);
    });
  }

  /**
   * Sort topics by priority (high > medium > low)
   * Requirement 2.3: Prioritize high-priority topics
   */
  private sortByPriority(topics: Topic[]): Topic[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...topics].sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Balance topic selection by category to ensure variety
   * Requirement 2.2: Select varied topics
   */
  private async balanceByCategory(topics: Topic[]): Promise<Topic[]> {
    // Get all generated articles to analyze category distribution
    const articles = await this.repository.getAllGeneratedArticles();
    
    // Count recent articles by category (last 10 articles)
    const recentArticles = articles.slice(0, 10);
    const categoryCounts: Record<string, number> = {};
    
    for (const article of recentArticles) {
      const topic = await this.repository.getTopic(article.topic_id);
      if (topic) {
        categoryCounts[topic.category] = (categoryCounts[topic.category] || 0) + 1;
      }
    }

    // Sort topics by least-used categories first
    return [...topics].sort((a, b) => {
      const countA = categoryCounts[a.category] || 0;
      const countB = categoryCounts[b.category] || 0;
      return countA - countB;
    });
  }

  /**
   * Map database topic to application topic type
   */
  private mapDbTopicToTopic(dbTopic: DbTopic): Topic {
    return {
      id: dbTopic.id,
      title: dbTopic.title,
      category: dbTopic.category as BlogCategorySlug,
      tags: JSON.parse(dbTopic.tags),
      priority: dbTopic.priority,
      seasonal: dbTopic.seasonal_months ? { months: JSON.parse(dbTopic.seasonal_months) } : undefined,
      keywords: JSON.parse(dbTopic.keywords),
      lastUsed: dbTopic.last_used ? new Date(dbTopic.last_used) : undefined,
      timesUsed: dbTopic.times_used,
      status: dbTopic.status,
      createdAt: new Date(dbTopic.created_at),
    };
  }
}
