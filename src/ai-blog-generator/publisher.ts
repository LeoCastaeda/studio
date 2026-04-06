/**
 * Auto Publisher - Handles publishing generated articles to the blog
 * 
 * This module manages:
 * - Generating unique slugs from titles
 * - Formatting frontmatter with metadata
 * - Saving markdown files to content/blog/
 * - Managing publication vs draft status
 * - Registering articles in the database
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Repository } from './database/repository';
import { GeneratedArticle, PublishConfig, PublishedArticle } from './types';
import { getBlogContentPath } from './config';
import { getLogger, Logger } from './logger';

export class AutoPublisher {
  private logger: Logger;

  constructor(
    private repository: Repository,
    private config: PublishConfig
  ) {
    this.logger = getLogger().child({ component: 'AutoPublisher' });
  }

  /**
   * Generate a unique slug from a title
   * Converts to lowercase, replaces spaces with hyphens, removes special characters
   */
  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD') // Normalize unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    // Add date prefix for uniqueness
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}-${baseSlug}`;
  }

  /**
   * Format frontmatter for the markdown file
   */
  private formatFrontmatter(
    article: GeneratedArticle,
    slug: string,
    status: 'draft' | 'published'
  ): string {
    const date = new Date();
    const publishedAt = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    const frontmatter = {
      title: article.title,
      excerpt: article.excerpt,
      publishedAt,
      author: 'Equipo GlassNou',
      category: article.suggestedCategory,
      tags: article.suggestedTags,
      featuredImage: '/images/blog/fallback.svg', // Default image
      seo: {
        metaTitle: article.seoMetadata.metaTitle,
        metaDescription: article.seoMetadata.metaDescription,
        keywords: article.seoMetadata.keywords,
      },
      published: status === 'published',
    };

    return `---\n${this.stringifyYaml(frontmatter)}---\n\n`;
  }

  /**
   * Simple YAML stringifier for frontmatter
   */
  private stringifyYaml(obj: any, indent: number = 0): string {
    const spaces = ' '.repeat(indent);
    let result = '';

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        result += `${spaces}${key}:\n`;
        for (const item of value) {
          if (typeof item === 'string') {
            result += `${spaces}  - "${item}"\n`;
          } else {
            result += `${spaces}  - ${item}\n`;
          }
        }
      } else if (typeof value === 'object') {
        result += `${spaces}${key}:\n`;
        result += this.stringifyYaml(value, indent + 2);
      } else if (typeof value === 'string') {
        // Escape quotes in strings
        const escaped = value.replace(/"/g, '\\"');
        result += `${spaces}${key}: "${escaped}"\n`;
      } else {
        result += `${spaces}${key}: ${value}\n`;
      }
    }

    return result;
  }

  /**
   * Save article as markdown file
   */
  private async saveMarkdownFile(
    slug: string,
    frontmatter: string,
    content: string
  ): Promise<string> {
    const blogPath = getBlogContentPath();
    const fileName = `${slug}.md`;
    const filePath = path.join(blogPath, fileName);

    // Ensure directory exists
    await fs.mkdir(blogPath, { recursive: true });

    // Combine frontmatter and content
    const fullContent = frontmatter + content;

    // Write file
    await fs.writeFile(filePath, fullContent, 'utf-8');

    return filePath;
  }

  /**
   * Publish or save as draft an article
   */
  async publishArticle(
    article: GeneratedArticle,
    topicId: string,
    qualityScore?: number
  ): Promise<PublishedArticle> {
    this.logger.startOperation('publishArticle', {
      topicId,
      articleTitle: article.title,
      wordCount: article.wordCount,
      qualityScore,
    });

    // Determine status based on configuration
    const shouldAutoPublish = this.config.autoPublish && !this.config.requireManualReview;
    const status: 'draft' | 'published' = shouldAutoPublish ? 'published' : 'draft';
    const reviewStatus = this.config.requireManualReview ? 'pending' : undefined;

    // Generate unique slug
    const slug = this.generateSlug(article.title);

    this.logger.info('Generated slug for article', {
      operation: 'publishArticle',
      slug,
      status,
      reviewStatus,
    });

    // Check if slug already exists
    const existing = await this.repository.getGeneratedArticleBySlug(slug);
    if (existing) {
      this.logger.error('Article with slug already exists', {
        operation: 'publishArticle',
        slug,
      });
      throw new Error(`Article with slug "${slug}" already exists`);
    }

    // Format frontmatter
    const frontmatter = this.formatFrontmatter(article, slug, status);

    // Save markdown file
    const filePath = await this.saveMarkdownFile(slug, frontmatter, article.content);

    this.logger.info('Saved markdown file', {
      operation: 'publishArticle',
      slug,
      filePath,
    });

    // Register in database
    const now = new Date().toISOString();
    await this.repository.createGeneratedArticle({
      slug,
      topic_id: topicId,
      title: article.title,
      file_path: filePath,
      status,
      review_status: reviewStatus || null,
      quality_score: qualityScore || null,
      word_count: article.wordCount,
      generated_at: now,
      published_at: status === 'published' ? now : null,
    });

    // Create initial metrics entry for published articles
    if (status === 'published') {
      await this.repository.createArticleMetrics({
        slug,
        views: 0,
        avg_time_on_page: 0,
        bounce_rate: 0,
        shares: 0,
        comments: 0,
        last_tracked: now,
      });
      
      this.logger.info('Created initial metrics entry', {
        operation: 'publishArticle',
        slug,
      });
    }

    const result: PublishedArticle = {
      slug,
      filePath,
      publishedAt: new Date(now),
      status,
      reviewStatus: reviewStatus as 'pending' | 'approved' | 'rejected' | undefined,
    };

    // Send notification
    if (status === 'published') {
      await this.sendNotification(result, 'published');
    } else if (reviewStatus === 'pending') {
      await this.sendNotification(result, 'pending_review');
    }

    this.logger.completeOperation('publishArticle', {
      slug,
      status,
      reviewStatus,
    });

    return result;
  }

  /**
   * Save article as draft (convenience method)
   */
  async saveDraft(
    article: GeneratedArticle,
    topicId: string,
    qualityScore?: number
  ): Promise<PublishedArticle> {
    // Temporarily override config to force draft
    const originalConfig = { ...this.config };
    this.config.autoPublish = false;
    this.config.requireManualReview = true;

    try {
      return await this.publishArticle(article, topicId, qualityScore);
    } finally {
      // Restore original config
      this.config = originalConfig;
    }
  }

  /**
   * Approve a draft and publish it
   */
  async approveDraft(slug: string): Promise<void> {
    const article = await this.repository.getGeneratedArticleBySlug(slug);
    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    if (article.status !== 'draft') {
      throw new Error(`Article "${slug}" is not a draft`);
    }

    // Update article status
    const now = new Date().toISOString();
    await this.repository.updateGeneratedArticle(article.id, {
      status: 'published',
      review_status: 'approved',
      published_at: now,
    });

    // Update markdown file to set published: true
    const content = await fs.readFile(article.file_path, 'utf-8');
    const updatedContent = content.replace(
      /published:\s*false/,
      'published: true'
    );
    await fs.writeFile(article.file_path, updatedContent, 'utf-8');

    // Create metrics entry
    await this.repository.createArticleMetrics({
      slug,
      views: 0,
      avg_time_on_page: 0,
      bounce_rate: 0,
      shares: 0,
      comments: 0,
      last_tracked: now,
    });

    // Send notification
    await this.sendNotification({
      slug,
      filePath: article.file_path,
      publishedAt: new Date(now),
      status: 'published',
      reviewStatus: 'approved',
    }, 'published');
  }

  /**
   * Reject a draft
   */
  async rejectDraft(slug: string, reason: string): Promise<void> {
    const article = await this.repository.getGeneratedArticleBySlug(slug);
    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    if (article.status !== 'draft') {
      throw new Error(`Article "${slug}" is not a draft`);
    }

    // Update article status
    await this.repository.updateGeneratedArticle(article.id, {
      review_status: 'rejected',
    });

    // Optionally delete the file
    try {
      await fs.unlink(article.file_path);
    } catch (error) {
      // File might not exist, ignore error
    }
  }

  /**
   * Get all articles pending review
   */
  async getPendingReviews(): Promise<PublishedArticle[]> {
    const articles = await this.repository.getArticlesPendingReview();
    
    return articles.map(article => ({
      slug: article.slug,
      filePath: article.file_path,
      publishedAt: new Date(article.generated_at),
      status: article.status,
      reviewStatus: article.review_status as 'pending' | 'approved' | 'rejected' | undefined,
    }));
  }

  /**
   * Send notification about article status
   */
  async sendNotification(article: PublishedArticle, type: 'pending_review' | 'published'): Promise<void> {
    if (!this.config.notifyOnPublish || !this.config.notificationEmail) {
      return; // Notifications disabled or no email configured
    }

    const subject = type === 'pending_review'
      ? `[GlassNou Blog] Artículo pendiente de revisión: ${article.slug}`
      : `[GlassNou Blog] Artículo publicado: ${article.slug}`;

    const body = type === 'pending_review'
      ? this.formatPendingReviewEmail(article)
      : this.formatPublishedEmail(article);

    // Log notification (actual email sending would require SMTP configuration)
    this.logger.info('Sending notification', {
      operation: 'sendNotification',
      to: this.config.notificationEmail,
      subject,
      type,
      articleSlug: article.slug,
    });

    // TODO: Implement actual email sending using nodemailer or similar
    // For now, we just log the notification
  }

  /**
   * Format email for pending review notification
   */
  private formatPendingReviewEmail(article: PublishedArticle): string {
    return `
Hola,

Se ha generado un nuevo artículo que requiere revisión:

Slug: ${article.slug}
Archivo: ${article.filePath}
Generado: ${article.publishedAt.toISOString()}

Por favor, revisa el artículo y apruébalo o recházalo usando el CLI:
- Aprobar: npm run blog:approve ${article.slug}
- Rechazar: npm run blog:reject ${article.slug} "razón"

Saludos,
Sistema de Generación Automática de Blog
    `.trim();
  }

  /**
   * Format email for published notification
   */
  private formatPublishedEmail(article: PublishedArticle): string {
    return `
Hola,

Se ha publicado un nuevo artículo en el blog:

Slug: ${article.slug}
Archivo: ${article.filePath}
Publicado: ${article.publishedAt.toISOString()}

El artículo ya está disponible en el sitio web.

Saludos,
Sistema de Generación Automática de Blog
    `.trim();
  }
}
