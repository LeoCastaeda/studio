/**
 * Metrics Tracker
 * 
 * Tracks and analyzes performance metrics for published articles.
 */

import { ArticleMetrics, PerformanceAnalysis } from './types';
import { Repository } from './database/repository';
import { getLogger, Logger } from './logger';

export class MetricsTracker {
  private logger: Logger;

  constructor(private repository: Repository) {
    this.logger = getLogger().child({ component: 'MetricsTracker' });
  }

  /**
   * Track or update metrics for an article
   * Creates new metrics entry if it doesn't exist, updates if it does
   */
  async trackArticleMetrics(slug: string, metrics: Partial<ArticleMetrics>): Promise<void> {
    this.logger.info('Tracking article metrics', {
      operation: 'trackArticleMetrics',
      articleSlug: slug,
      metricsProvided: Object.keys(metrics)
    });

    const existing = await this.repository.getArticleMetrics(slug);
    
    if (existing) {
      // Update existing metrics
      const updates = {
        ...metrics,
        last_tracked: new Date().toISOString(),
      };
      await this.repository.updateArticleMetrics(slug, updates);
      this.logger.debug('Metrics updated', {
        operation: 'trackArticleMetrics',
        articleSlug: slug,
        action: 'update'
      });
    } else {
      // Create new metrics entry with defaults
      const newMetrics = {
        slug,
        views: metrics.views ?? 0,
        avg_time_on_page: metrics.avgTimeOnPage ?? 0,
        bounce_rate: metrics.bounceRate ?? 0,
        shares: metrics.shares ?? 0,
        comments: metrics.comments ?? 0,
        last_tracked: new Date().toISOString(),
      };
      await this.repository.createArticleMetrics(newMetrics);
      this.logger.debug('Metrics created', {
        operation: 'trackArticleMetrics',
        articleSlug: slug,
        action: 'create'
      });
    }
  }

  /**
   * Get metrics for a specific article
   */
  async getArticleMetrics(slug: string): Promise<ArticleMetrics | null> {
    const dbMetrics = await this.repository.getArticleMetrics(slug);
    
    if (!dbMetrics) {
      return null;
    }

    // Convert database format to application format
    return {
      slug: dbMetrics.slug,
      views: dbMetrics.views,
      avgTimeOnPage: dbMetrics.avg_time_on_page,
      bounceRate: dbMetrics.bounce_rate,
      shares: dbMetrics.shares,
      comments: dbMetrics.comments,
      lastTracked: new Date(dbMetrics.last_tracked),
    };
  }

  /**
   * Get top performing articles by views
   */
  async getTopArticles(limit: number): Promise<ArticleMetrics[]> {
    const dbMetrics = await this.repository.getTopArticlesByViews(limit);
    
    return dbMetrics.map(m => ({
      slug: m.slug,
      views: m.views,
      avgTimeOnPage: m.avg_time_on_page,
      bounceRate: m.bounce_rate,
      shares: m.shares,
      comments: m.comments,
      lastTracked: new Date(m.last_tracked),
    }));
  }

  /**
   * Analyze performance patterns across all articles
   */
  async analyzePerformance(): Promise<PerformanceAnalysis> {
    this.logger.info('Starting performance analysis', {
      operation: 'analyzePerformance'
    });

    // Get all metrics and articles
    const allMetrics = await this.repository.getAllArticleMetrics();
    const allArticles = await this.repository.getAllGeneratedArticles();
    const allTopics = await this.repository.getAllTopics();

    this.logger.debug('Data retrieved for analysis', {
      operation: 'analyzePerformance',
      metricsCount: allMetrics.length,
      articlesCount: allArticles.length,
      topicsCount: allTopics.length
    });

    // Calculate performance scores for each article
    const scoredArticles = allMetrics.map(m => {
      // Performance score based on multiple factors
      // Higher views, lower bounce rate, more shares = better score
      const viewScore = Math.min(m.views / 100, 100); // Cap at 100
      const bounceScore = 100 - m.bounce_rate; // Lower bounce is better
      const shareScore = Math.min(m.shares * 10, 100); // Cap at 100
      const timeScore = Math.min(m.avg_time_on_page / 3, 100); // 3 seconds = 1 point, cap at 100
      
      const score = (viewScore * 0.4 + bounceScore * 0.3 + shareScore * 0.2 + timeScore * 0.1);
      
      return {
        slug: m.slug,
        score,
        metrics: {
          slug: m.slug,
          views: m.views,
          avgTimeOnPage: m.avg_time_on_page,
          bounceRate: m.bounce_rate,
          shares: m.shares,
          comments: m.comments,
          lastTracked: new Date(m.last_tracked),
        },
      };
    });

    // Sort by score and get top performers
    const topPerformingArticles = scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Analyze patterns from top performers
    const topSlugs = new Set(topPerformingArticles.map(a => a.slug));
    const topArticles = allArticles.filter(a => topSlugs.has(a.slug));

    // Extract successful topics
    const topicIds = topArticles.map(a => a.topic_id);
    const successfulTopics = allTopics
      .filter(t => topicIds.includes(t.id))
      .map(t => t.title);

    // Extract successful categories
    const categoryCount = new Map<string, number>();
    topArticles.forEach(a => {
      const article = allArticles.find(art => art.slug === a.slug);
      if (article) {
        const topic = allTopics.find(t => t.id === article.topic_id);
        if (topic) {
          categoryCount.set(topic.category, (categoryCount.get(topic.category) || 0) + 1);
        }
      }
    });
    
    const successfulCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category as any);

    // Calculate optimal word count from top performers
    const wordCounts = topArticles
      .filter(a => a.word_count !== null)
      .map(a => a.word_count as number);
    const optimalWordCount = wordCounts.length > 0
      ? Math.round(wordCounts.reduce((sum, wc) => sum + wc, 0) / wordCounts.length)
      : 1200; // Default

    // Analyze best publish times
    const publishHours = topArticles
      .filter(a => a.published_at !== null)
      .map(a => {
        const date = new Date(a.published_at!);
        return date.getHours();
      });
    
    const hourCount = new Map<number, number>();
    publishHours.forEach(hour => {
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });
    
    const bestPublishTimes = Array.from(hourCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => `${hour.toString().padStart(2, '0')}:00`);

    const result = {
      topPerformingArticles,
      commonPatterns: {
        successfulTopics,
        successfulCategories,
        optimalWordCount,
        bestPublishTimes: bestPublishTimes.length > 0 ? bestPublishTimes : ['09:00', '14:00', '18:00'],
      },
    };

    this.logger.info('Performance analysis completed', {
      operation: 'analyzePerformance',
      topPerformersCount: topPerformingArticles.length,
      successfulTopicsCount: successfulTopics.length,
      successfulCategoriesCount: successfulCategories.length,
      optimalWordCount
    });

    return result;
  }
}
