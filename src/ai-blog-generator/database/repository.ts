/**
 * Data Access Layer - Repository pattern for database operations
 * 
 * Provides CRUD operations for all database tables.
 */

import { DatabaseConnection } from './connection';
import { Topic as TopicType } from '../types';

// ============================================================================
// Type Definitions
// ============================================================================

// Database row type (snake_case)
export interface Topic {
  id: string;
  title: string;
  category: string;
  tags: string; // JSON string
  priority: 'low' | 'medium' | 'high';
  seasonal_months: string | null; // JSON string
  keywords: string; // JSON string
  last_used: string | null; // ISO datetime string
  times_used: number;
  status: 'active' | 'used' | 'archived';
  created_at: string; // ISO datetime string
}

export interface ScheduledTask {
  id: string;
  type: 'generate' | 'update';
  scheduled_for: string; // ISO datetime string
  status: 'pending' | 'running' | 'completed' | 'failed';
  topic_id: string | null;
  article_slug: string | null;
  created_at: string; // ISO datetime string
  completed_at: string | null; // ISO datetime string
  error: string | null;
}

export interface GeneratedArticle {
  id: string;
  slug: string;
  topic_id: string;
  title: string;
  file_path: string;
  status: 'draft' | 'published';
  review_status: 'pending' | 'approved' | 'rejected' | null;
  quality_score: number | null;
  word_count: number | null;
  generated_at: string; // ISO datetime string
  published_at: string | null; // ISO datetime string
}

export interface ArticleMetrics {
  slug: string;
  views: number;
  avg_time_on_page: number;
  bounce_rate: number;
  shares: number;
  comments: number;
  last_tracked: string; // ISO datetime string
}

export interface ArticleUpdate {
  id: string;
  slug: string;
  changes: string; // JSON string
  updated_at: string; // ISO datetime string
}

export interface Config {
  key: string;
  value: string;
  updated_at: string; // ISO datetime string
}

// ============================================================================
// Repository Class
// ============================================================================

export class Repository {
  constructor(private db: DatabaseConnection) {}

  // ==========================================================================
  // Topics CRUD
  // ==========================================================================

  async createTopic(topic: Omit<Topic, 'id' | 'created_at'>): Promise<Topic> {
    const id = this.generateId();
    const created_at = new Date().toISOString();
    
    await this.db.execute(
      `INSERT INTO topics (id, title, category, tags, priority, seasonal_months, keywords, last_used, times_used, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        topic.title,
        topic.category,
        topic.tags,
        topic.priority,
        topic.seasonal_months,
        topic.keywords,
        topic.last_used,
        topic.times_used,
        topic.status,
        created_at,
      ]
    );

    return { id, ...topic, created_at };
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    return this.db.queryOne<Topic>('SELECT * FROM topics WHERE id = ?', [id]);
  }

  async getAllTopics(): Promise<Topic[]> {
    return this.db.query<Topic>('SELECT * FROM topics');
  }

  async getTopicsByStatus(status: Topic['status']): Promise<Topic[]> {
    return this.db.query<Topic>('SELECT * FROM topics WHERE status = ?', [status]);
  }

  async getTopicsByCategory(category: string): Promise<Topic[]> {
    return this.db.query<Topic>('SELECT * FROM topics WHERE category = ?', [category]);
  }

  async updateTopic(id: string, updates: Partial<Omit<Topic, 'id' | 'created_at'>>): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return;

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await this.db.execute(
      `UPDATE topics SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  }

  async deleteTopic(id: string): Promise<void> {
    await this.db.execute('DELETE FROM topics WHERE id = ?', [id]);
  }

  async markTopicAsUsed(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.execute(
      'UPDATE topics SET last_used = ?, times_used = times_used + 1 WHERE id = ?',
      [now, id]
    );
  }

  // ==========================================================================
  // Scheduled Tasks CRUD
  // ==========================================================================

  async createScheduledTask(task: Omit<ScheduledTask, 'id' | 'created_at'>): Promise<ScheduledTask> {
    const id = this.generateId();
    const created_at = new Date().toISOString();
    
    await this.db.execute(
      `INSERT INTO scheduled_tasks (id, type, scheduled_for, status, topic_id, article_slug, created_at, completed_at, error)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        task.type,
        task.scheduled_for,
        task.status,
        task.topic_id,
        task.article_slug,
        created_at,
        task.completed_at,
        task.error,
      ]
    );

    return { id, ...task, created_at };
  }

  async getScheduledTask(id: string): Promise<ScheduledTask | undefined> {
    return this.db.queryOne<ScheduledTask>('SELECT * FROM scheduled_tasks WHERE id = ?', [id]);
  }

  async getScheduledTasksByStatus(status: ScheduledTask['status']): Promise<ScheduledTask[]> {
    return this.db.query<ScheduledTask>('SELECT * FROM scheduled_tasks WHERE status = ?', [status]);
  }

  async getPendingTasks(): Promise<ScheduledTask[]> {
    const now = new Date().toISOString();
    return this.db.query<ScheduledTask>(
      'SELECT * FROM scheduled_tasks WHERE status = ? AND scheduled_for <= ? ORDER BY scheduled_for ASC',
      ['pending', now]
    );
  }

  async getUpcomingTasks(limit: number = 10): Promise<ScheduledTask[]> {
    return this.db.query<ScheduledTask>(
      'SELECT * FROM scheduled_tasks WHERE status = ? ORDER BY scheduled_for ASC LIMIT ?',
      ['pending', limit]
    );
  }

  async updateScheduledTask(id: string, updates: Partial<Omit<ScheduledTask, 'id' | 'created_at'>>): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return;

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await this.db.execute(
      `UPDATE scheduled_tasks SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  }

  async deleteScheduledTask(id: string): Promise<void> {
    await this.db.execute('DELETE FROM scheduled_tasks WHERE id = ?', [id]);
  }

  // ==========================================================================
  // Generated Articles CRUD
  // ==========================================================================

  async createGeneratedArticle(article: Omit<GeneratedArticle, 'id'>): Promise<GeneratedArticle> {
    const id = this.generateId();
    
    await this.db.execute(
      `INSERT INTO generated_articles (id, slug, topic_id, title, file_path, status, review_status, quality_score, word_count, generated_at, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        article.slug,
        article.topic_id,
        article.title,
        article.file_path,
        article.status,
        article.review_status,
        article.quality_score,
        article.word_count,
        article.generated_at,
        article.published_at,
      ]
    );

    return { id, ...article };
  }

  async getGeneratedArticle(id: string): Promise<GeneratedArticle | undefined> {
    return this.db.queryOne<GeneratedArticle>('SELECT * FROM generated_articles WHERE id = ?', [id]);
  }

  async getGeneratedArticleBySlug(slug: string): Promise<GeneratedArticle | undefined> {
    return this.db.queryOne<GeneratedArticle>('SELECT * FROM generated_articles WHERE slug = ?', [slug]);
  }

  async getAllGeneratedArticles(): Promise<GeneratedArticle[]> {
    return this.db.query<GeneratedArticle>('SELECT * FROM generated_articles ORDER BY generated_at DESC');
  }

  async getGeneratedArticlesByStatus(status: GeneratedArticle['status']): Promise<GeneratedArticle[]> {
    return this.db.query<GeneratedArticle>(
      'SELECT * FROM generated_articles WHERE status = ? ORDER BY generated_at DESC',
      [status]
    );
  }

  async getArticlesPendingReview(): Promise<GeneratedArticle[]> {
    return this.db.query<GeneratedArticle>(
      'SELECT * FROM generated_articles WHERE review_status = ? ORDER BY generated_at DESC',
      ['pending']
    );
  }

  async updateGeneratedArticle(id: string, updates: Partial<Omit<GeneratedArticle, 'id'>>): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return;

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await this.db.execute(
      `UPDATE generated_articles SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  }

  async deleteGeneratedArticle(id: string): Promise<void> {
    await this.db.execute('DELETE FROM generated_articles WHERE id = ?', [id]);
  }

  // ==========================================================================
  // Article Metrics CRUD
  // ==========================================================================

  async createArticleMetrics(metrics: ArticleMetrics): Promise<ArticleMetrics> {
    await this.db.execute(
      `INSERT INTO article_metrics (slug, views, avg_time_on_page, bounce_rate, shares, comments, last_tracked)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        metrics.slug,
        metrics.views,
        metrics.avg_time_on_page,
        metrics.bounce_rate,
        metrics.shares,
        metrics.comments,
        metrics.last_tracked,
      ]
    );

    return metrics;
  }

  async getArticleMetrics(slug: string): Promise<ArticleMetrics | undefined> {
    return this.db.queryOne<ArticleMetrics>('SELECT * FROM article_metrics WHERE slug = ?', [slug]);
  }

  async getAllArticleMetrics(): Promise<ArticleMetrics[]> {
    return this.db.query<ArticleMetrics>('SELECT * FROM article_metrics ORDER BY views DESC');
  }

  async updateArticleMetrics(slug: string, updates: Partial<Omit<ArticleMetrics, 'slug'>>): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return;

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await this.db.execute(
      `UPDATE article_metrics SET ${setClause} WHERE slug = ?`,
      [...values, slug]
    );
  }

  async deleteArticleMetrics(slug: string): Promise<void> {
    await this.db.execute('DELETE FROM article_metrics WHERE slug = ?', [slug]);
  }

  async getTopArticlesByViews(limit: number = 10): Promise<ArticleMetrics[]> {
    return this.db.query<ArticleMetrics>(
      'SELECT * FROM article_metrics ORDER BY views DESC LIMIT ?',
      [limit]
    );
  }

  // ==========================================================================
  // Article Updates CRUD
  // ==========================================================================

  async createArticleUpdate(update: Omit<ArticleUpdate, 'id'>): Promise<ArticleUpdate> {
    const id = this.generateId();
    
    await this.db.execute(
      `INSERT INTO article_updates (id, slug, changes, updated_at)
       VALUES (?, ?, ?, ?)`,
      [id, update.slug, update.changes, update.updated_at]
    );

    return { id, ...update };
  }

  async getArticleUpdate(id: string): Promise<ArticleUpdate | undefined> {
    return this.db.queryOne<ArticleUpdate>('SELECT * FROM article_updates WHERE id = ?', [id]);
  }

  async getArticleUpdatesBySlug(slug: string): Promise<ArticleUpdate[]> {
    return this.db.query<ArticleUpdate>(
      'SELECT * FROM article_updates WHERE slug = ? ORDER BY updated_at DESC',
      [slug]
    );
  }

  async getAllArticleUpdates(): Promise<ArticleUpdate[]> {
    return this.db.query<ArticleUpdate>('SELECT * FROM article_updates ORDER BY updated_at DESC');
  }

  async deleteArticleUpdate(id: string): Promise<void> {
    await this.db.execute('DELETE FROM article_updates WHERE id = ?', [id]);
  }

  // ==========================================================================
  // Config CRUD
  // ==========================================================================

  async setConfig(key: string, value: string): Promise<Config> {
    const updated_at = new Date().toISOString();
    
    await this.db.execute(
      `INSERT INTO config (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?`,
      [key, value, updated_at, value, updated_at]
    );

    return { key, value, updated_at };
  }

  async getConfig(key: string): Promise<Config | undefined> {
    return this.db.queryOne<Config>('SELECT * FROM config WHERE key = ?', [key]);
  }

  async getAllConfig(): Promise<Config[]> {
    return this.db.query<Config>('SELECT * FROM config');
  }

  async deleteConfig(key: string): Promise<void> {
    await this.db.execute('DELETE FROM config WHERE key = ?', [key]);
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Convert database Topic (snake_case) to application Topic (camelCase)
   */
  static mapTopicToApp(dbTopic: Topic): TopicType {
    return {
      id: dbTopic.id,
      title: dbTopic.title,
      category: dbTopic.category as any,
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

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
