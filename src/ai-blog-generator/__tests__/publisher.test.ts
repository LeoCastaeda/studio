/**
 * Tests for AutoPublisher
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AutoPublisher } from '../publisher';
import { Repository } from '../database/repository';
import { DatabaseConnection } from '../database/connection';
import { GeneratedArticle, PublishConfig } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('AutoPublisher', () => {
  let db: DatabaseConnection;
  let repository: Repository;
  let publisher: AutoPublisher;
  let testBlogPath: string;

  beforeEach(async () => {
    // Use in-memory database for testing
    db = new DatabaseConnection(':memory:');
    await db.initialize();
    repository = new Repository(db);

    // Create temporary test directory
    testBlogPath = path.join(process.cwd(), 'test-blog-content');
    await fs.mkdir(testBlogPath, { recursive: true });

    // Override blog path for testing
    process.env.BLOG_CONTENT_PATH = testBlogPath;

    const config: PublishConfig = {
      autoPublish: false,
      requireManualReview: true,
      notifyOnPublish: false,
    };

    publisher = new AutoPublisher(repository, config);
  });

  afterEach(async () => {
    await db.close();
    // Clean up test directory
    try {
      await fs.rm(testBlogPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should generate unique slug from title', async () => {
    const article: GeneratedArticle = {
      title: 'Cómo Reparar Parabrisas',
      excerpt: 'Test excerpt',
      content: '# Test Content\n\nThis is test content.',
      suggestedTags: ['test'],
      suggestedCategory: 'reparaciones',
      seoMetadata: {
        metaTitle: 'Test Meta Title',
        metaDescription: 'Test meta description',
        keywords: ['test'],
      },
      internalLinks: [],
      callToAction: 'Contact us',
      wordCount: 100,
      generatedAt: new Date(),
    };

    // Create a test topic first
    const topic = await repository.createTopic({
      title: 'Test Topic',
      category: 'reparaciones',
      tags: JSON.stringify(['test']),
      priority: 'medium',
      seasonal_months: null,
      keywords: JSON.stringify(['test']),
      last_used: null,
      times_used: 0,
      status: 'active',
    });

    const result = await publisher.publishArticle(article, topic.id);

    expect(result.slug).toMatch(/^\d{4}-\d{2}-\d{2}-como-reparar-parabrisas$/);
    expect(result.status).toBe('draft');
    expect(result.reviewStatus).toBe('pending');
  });

  it('should save article as draft when requireManualReview is true', async () => {
    const article: GeneratedArticle = {
      title: 'Test Article',
      excerpt: 'Test excerpt',
      content: '# Test Content',
      suggestedTags: ['test'],
      suggestedCategory: 'reparaciones',
      seoMetadata: {
        metaTitle: 'Test',
        metaDescription: 'Test description',
        keywords: ['test'],
      },
      internalLinks: [],
      callToAction: 'Contact us',
      wordCount: 50,
      generatedAt: new Date(),
    };

    const topic = await repository.createTopic({
      title: 'Test Topic',
      category: 'reparaciones',
      tags: JSON.stringify(['test']),
      priority: 'medium',
      seasonal_months: null,
      keywords: JSON.stringify(['test']),
      last_used: null,
      times_used: 0,
      status: 'active',
    });

    const result = await publisher.publishArticle(article, topic.id);

    expect(result.status).toBe('draft');
    expect(result.reviewStatus).toBe('pending');

    // Verify file was created
    const fileExists = await fs.access(result.filePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);

    // Verify database entry
    const dbArticle = await repository.getGeneratedArticleBySlug(result.slug);
    expect(dbArticle).toBeDefined();
    expect(dbArticle?.status).toBe('draft');
    expect(dbArticle?.review_status).toBe('pending');
  });

  it('should publish article when autoPublish is true', async () => {
    const autoPublishConfig: PublishConfig = {
      autoPublish: true,
      requireManualReview: false,
      notifyOnPublish: false,
    };

    const autoPublisher = new AutoPublisher(repository, autoPublishConfig);

    const article: GeneratedArticle = {
      title: 'Auto Published Article',
      excerpt: 'Test excerpt',
      content: '# Test Content',
      suggestedTags: ['test'],
      suggestedCategory: 'reparaciones',
      seoMetadata: {
        metaTitle: 'Test',
        metaDescription: 'Test description',
        keywords: ['test'],
      },
      internalLinks: [],
      callToAction: 'Contact us',
      wordCount: 50,
      generatedAt: new Date(),
    };

    const topic = await repository.createTopic({
      title: 'Test Topic',
      category: 'reparaciones',
      tags: JSON.stringify(['test']),
      priority: 'medium',
      seasonal_months: null,
      keywords: JSON.stringify(['test']),
      last_used: null,
      times_used: 0,
      status: 'active',
    });

    const result = await autoPublisher.publishArticle(article, topic.id);

    expect(result.status).toBe('published');
    expect(result.reviewStatus).toBeUndefined();

    // Verify metrics were created
    const metrics = await repository.getArticleMetrics(result.slug);
    expect(metrics).toBeDefined();
    expect(metrics?.views).toBe(0);
  });

  it('should approve draft and update status', async () => {
    const article: GeneratedArticle = {
      title: 'Draft to Approve',
      excerpt: 'Test excerpt',
      content: '# Test Content',
      suggestedTags: ['test'],
      suggestedCategory: 'reparaciones',
      seoMetadata: {
        metaTitle: 'Test',
        metaDescription: 'Test description',
        keywords: ['test'],
      },
      internalLinks: [],
      callToAction: 'Contact us',
      wordCount: 50,
      generatedAt: new Date(),
    };

    const topic = await repository.createTopic({
      title: 'Test Topic',
      category: 'reparaciones',
      tags: JSON.stringify(['test']),
      priority: 'medium',
      seasonal_months: null,
      keywords: JSON.stringify(['test']),
      last_used: null,
      times_used: 0,
      status: 'active',
    });

    const draft = await publisher.publishArticle(article, topic.id);
    expect(draft.status).toBe('draft');

    await publisher.approveDraft(draft.slug);

    const approved = await repository.getGeneratedArticleBySlug(draft.slug);
    expect(approved?.status).toBe('published');
    expect(approved?.review_status).toBe('approved');

    // Verify metrics were created
    const metrics = await repository.getArticleMetrics(draft.slug);
    expect(metrics).toBeDefined();
  });

  it('should get pending reviews', async () => {
    const article: GeneratedArticle = {
      title: 'Pending Review Article',
      excerpt: 'Test excerpt',
      content: '# Test Content',
      suggestedTags: ['test'],
      suggestedCategory: 'reparaciones',
      seoMetadata: {
        metaTitle: 'Test',
        metaDescription: 'Test description',
        keywords: ['test'],
      },
      internalLinks: [],
      callToAction: 'Contact us',
      wordCount: 50,
      generatedAt: new Date(),
    };

    const topic = await repository.createTopic({
      title: 'Test Topic',
      category: 'reparaciones',
      tags: JSON.stringify(['test']),
      priority: 'medium',
      seasonal_months: null,
      keywords: JSON.stringify(['test']),
      last_used: null,
      times_used: 0,
      status: 'active',
    });

    await publisher.publishArticle(article, topic.id);

    const pending = await publisher.getPendingReviews();
    expect(pending.length).toBe(1);
    expect(pending[0].reviewStatus).toBe('pending');
  });
});
