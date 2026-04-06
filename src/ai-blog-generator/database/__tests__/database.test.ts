/**
 * Database tests
 * 
 * Tests for database connection and repository operations.
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DatabaseConnection } from '../connection';
import { Repository } from '../repository';
import * as fs from 'fs';
import * as path from 'path';

describe('Database', () => {
  const testDbPath = path.join(__dirname, 'test.db');
  let db: DatabaseConnection;
  let repo: Repository;

  beforeEach(async () => {
    // Clean up any existing test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    db = new DatabaseConnection(testDbPath);
    await db.initialize();
    repo = new Repository(db);
  });

  afterEach(async () => {
    await db.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('Connection', () => {
    it('should initialize database and create tables', async () => {
      const tables = await db.query<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );
      
      const tableNames = tables.map(t => t.name);
      expect(tableNames).toContain('topics');
      expect(tableNames).toContain('scheduled_tasks');
      expect(tableNames).toContain('generated_articles');
      expect(tableNames).toContain('article_metrics');
      expect(tableNames).toContain('article_updates');
      expect(tableNames).toContain('config');
    });
  });

  describe('Topics Repository', () => {
    it('should create and retrieve a topic', async () => {
      const topic = await repo.createTopic({
        title: 'Test Topic',
        category: 'reparacion',
        tags: JSON.stringify(['test', 'example']),
        priority: 'high',
        seasonal_months: null,
        keywords: JSON.stringify(['keyword1', 'keyword2']),
        last_used: null,
        times_used: 0,
        status: 'active',
      });

      expect(topic.id).toBeDefined();
      expect(topic.title).toBe('Test Topic');

      const retrieved = await repo.getTopic(topic.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('Test Topic');
    });

    it('should update a topic', async () => {
      const topic = await repo.createTopic({
        title: 'Original Title',
        category: 'reparacion',
        tags: JSON.stringify(['test']),
        priority: 'low',
        seasonal_months: null,
        keywords: JSON.stringify(['keyword']),
        last_used: null,
        times_used: 0,
        status: 'active',
      });

      await repo.updateTopic(topic.id, { title: 'Updated Title', priority: 'high' });

      const updated = await repo.getTopic(topic.id);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.priority).toBe('high');
    });

    it('should mark topic as used', async () => {
      const topic = await repo.createTopic({
        title: 'Test Topic',
        category: 'reparacion',
        tags: JSON.stringify(['test']),
        priority: 'medium',
        seasonal_months: null,
        keywords: JSON.stringify(['keyword']),
        last_used: null,
        times_used: 0,
        status: 'active',
      });

      await repo.markTopicAsUsed(topic.id);

      const updated = await repo.getTopic(topic.id);
      expect(updated?.times_used).toBe(1);
      expect(updated?.last_used).not.toBeNull();
    });
  });

  describe('Scheduled Tasks Repository', () => {
    it('should create and retrieve a scheduled task', async () => {
      const task = await repo.createScheduledTask({
        type: 'generate',
        scheduled_for: new Date().toISOString(),
        status: 'pending',
        topic_id: null,
        article_slug: null,
        completed_at: null,
        error: null,
      });

      expect(task.id).toBeDefined();
      expect(task.type).toBe('generate');

      const retrieved = await repo.getScheduledTask(task.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.type).toBe('generate');
    });

    it('should get pending tasks', async () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      const futureDate = new Date(Date.now() + 10000).toISOString();

      await repo.createScheduledTask({
        type: 'generate',
        scheduled_for: pastDate,
        status: 'pending',
        topic_id: null,
        article_slug: null,
        completed_at: null,
        error: null,
      });

      await repo.createScheduledTask({
        type: 'generate',
        scheduled_for: futureDate,
        status: 'pending',
        topic_id: null,
        article_slug: null,
        completed_at: null,
        error: null,
      });

      const pending = await repo.getPendingTasks();
      expect(pending.length).toBe(1);
      expect(pending[0].scheduled_for).toBe(pastDate);
    });
  });

  describe('Generated Articles Repository', () => {
    it('should create and retrieve an article', async () => {
      // Create a topic first (foreign key constraint)
      const topic = await repo.createTopic({
        title: 'Test Topic',
        category: 'reparacion',
        tags: JSON.stringify(['test']),
        priority: 'medium',
        seasonal_months: null,
        keywords: JSON.stringify(['keyword']),
        last_used: null,
        times_used: 0,
        status: 'active',
      });

      const article = await repo.createGeneratedArticle({
        slug: 'test-article',
        topic_id: topic.id,
        title: 'Test Article',
        file_path: '/path/to/article.md',
        status: 'draft',
        review_status: 'pending',
        quality_score: 85,
        word_count: 1200,
        generated_at: new Date().toISOString(),
        published_at: null,
      });

      expect(article.id).toBeDefined();
      expect(article.slug).toBe('test-article');

      const retrieved = await repo.getGeneratedArticleBySlug('test-article');
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('Test Article');
    });

    it('should get articles pending review', async () => {
      // Create topics first (foreign key constraint)
      const topic1 = await repo.createTopic({
        title: 'Topic 1',
        category: 'reparacion',
        tags: JSON.stringify(['test']),
        priority: 'medium',
        seasonal_months: null,
        keywords: JSON.stringify(['keyword']),
        last_used: null,
        times_used: 0,
        status: 'active',
      });

      const topic2 = await repo.createTopic({
        title: 'Topic 2',
        category: 'mantenimiento',
        tags: JSON.stringify(['test']),
        priority: 'medium',
        seasonal_months: null,
        keywords: JSON.stringify(['keyword']),
        last_used: null,
        times_used: 0,
        status: 'active',
      });

      await repo.createGeneratedArticle({
        slug: 'article-1',
        topic_id: topic1.id,
        title: 'Article 1',
        file_path: '/path/1.md',
        status: 'draft',
        review_status: 'pending',
        quality_score: 80,
        word_count: 1000,
        generated_at: new Date().toISOString(),
        published_at: null,
      });

      await repo.createGeneratedArticle({
        slug: 'article-2',
        topic_id: topic2.id,
        title: 'Article 2',
        file_path: '/path/2.md',
        status: 'published',
        review_status: 'approved',
        quality_score: 90,
        word_count: 1500,
        generated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      });

      const pending = await repo.getArticlesPendingReview();
      expect(pending.length).toBe(1);
      expect(pending[0].slug).toBe('article-1');
    });
  });

  describe('Article Metrics Repository', () => {
    it('should create and retrieve metrics', async () => {
      const metrics = await repo.createArticleMetrics({
        slug: 'test-article',
        views: 100,
        avg_time_on_page: 120,
        bounce_rate: 0.3,
        shares: 5,
        comments: 2,
        last_tracked: new Date().toISOString(),
      });

      expect(metrics.slug).toBe('test-article');

      const retrieved = await repo.getArticleMetrics('test-article');
      expect(retrieved).toBeDefined();
      expect(retrieved?.views).toBe(100);
    });

    it('should get top articles by views', async () => {
      await repo.createArticleMetrics({
        slug: 'article-1',
        views: 50,
        avg_time_on_page: 100,
        bounce_rate: 0.4,
        shares: 1,
        comments: 0,
        last_tracked: new Date().toISOString(),
      });

      await repo.createArticleMetrics({
        slug: 'article-2',
        views: 200,
        avg_time_on_page: 150,
        bounce_rate: 0.2,
        shares: 10,
        comments: 5,
        last_tracked: new Date().toISOString(),
      });

      const top = await repo.getTopArticlesByViews(1);
      expect(top.length).toBe(1);
      expect(top[0].slug).toBe('article-2');
      expect(top[0].views).toBe(200);
    });
  });

  describe('Config Repository', () => {
    it('should set and get config', async () => {
      await repo.setConfig('test_key', 'test_value');

      const config = await repo.getConfig('test_key');
      expect(config).toBeDefined();
      expect(config?.value).toBe('test_value');
    });

    it('should update existing config', async () => {
      await repo.setConfig('test_key', 'original_value');
      await repo.setConfig('test_key', 'updated_value');

      const config = await repo.getConfig('test_key');
      expect(config?.value).toBe('updated_value');
    });
  });

  describe('Transactions', () => {
    it('should execute operations in a transaction', async () => {
      await db.transaction(() => {
        db.getDb().prepare(
          `INSERT INTO topics (id, title, category, tags, priority, keywords, times_used, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run('test-id', 'Test', 'test', '[]', 'low', '[]', 0, 'active', new Date().toISOString());
      });

      const topic = await repo.getTopic('test-id');
      expect(topic).toBeDefined();
    });
  });
});
