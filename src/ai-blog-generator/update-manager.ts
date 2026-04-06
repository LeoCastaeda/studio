/**
 * Update Manager
 * 
 * Manages the updating of existing blog articles with new information.
 * Implements Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Repository } from './database/repository';
import { AIContentGenerator } from './ai-generator';
import { ContentScheduler } from './scheduler';
import { UpdateCandidate, ArticleUpdate, GenerationPrompt, Topic } from './types';
import { BlogCategorySlug } from '@/lib/blog/blog-types';
import { generateSlugFromFilename } from '@/lib/blog/markdown';
import { getLogger, Logger } from './logger';

const BLOG_CONTENT_PATH = path.join(process.cwd(), 'content', 'blog');

export class UpdateManager {
  private logger: Logger;

  constructor(
    private repository: Repository,
    private aiGenerator: AIContentGenerator,
    private scheduler?: ContentScheduler
  ) {
    this.logger = getLogger().child({ component: 'UpdateManager' });
  }

  /**
   * Find articles that are candidates for updating
   * Requirement 6.1: Identify articles with more than X days
   */
  async findUpdateCandidates(minAgeInDays: number): Promise<UpdateCandidate[]> {
    this.logger.info('Finding update candidates', {
      operation: 'findUpdateCandidates',
      minAgeInDays
    });

    const candidates: UpdateCandidate[] = [];

    // Check if blog content directory exists
    if (!fs.existsSync(BLOG_CONTENT_PATH)) {
      this.logger.warn('Blog content directory not found', {
        operation: 'findUpdateCandidates',
        path: BLOG_CONTENT_PATH
      });
      return candidates;
    }

    // Read all markdown files from content/blog/
    const files = fs.readdirSync(BLOG_CONTENT_PATH)
      .filter(file => file.endsWith('.md') && file !== '.gitkeep');

    this.logger.info('Analyzing blog articles', {
      operation: 'findUpdateCandidates',
      fileCount: files.length
    });

    // Get all article metrics for prioritization
    const allMetrics = await this.repository.getAllArticleMetrics();
    const metricsMap = new Map(allMetrics.map(m => [m.slug, m]));

    for (const filename of files) {
      try {
        const filePath = path.join(BLOG_CONTENT_PATH, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Parse frontmatter
        const { data: frontmatter } = matter(fileContent);
        
        // Extract slug from filename
        const slug = generateSlugFromFilename(filename);
        
        // Get published date
        const publishedAt = new Date(frontmatter.publishedAt);
        const lastUpdated = frontmatter.updatedAt ? new Date(frontmatter.updatedAt) : undefined;
        
        // Calculate age in days
        const referenceDate = lastUpdated || publishedAt;
        const ageInDays = Math.floor((Date.now() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Check if article needs update
        const needsUpdate = ageInDays >= minAgeInDays;
        
        // Get metrics for this article
        const metrics = metricsMap.get(slug);
        
        // Calculate update priority score
        let updateReason = '';
        if (needsUpdate) {
          updateReason = `Article is ${ageInDays} days old`;
          if (metrics && metrics.views > 100) {
            updateReason += ` and has ${metrics.views} views (high traffic)`;
          }
        }
        
        const candidate: UpdateCandidate = {
          slug,
          title: frontmatter.title,
          publishedAt,
          lastUpdated,
          ageInDays,
          category: frontmatter.category as BlogCategorySlug,
          needsUpdate,
          updateReason,
        };
        
        candidates.push(candidate);
      } catch (error) {
        this.logger.error('Error processing file', {
          operation: 'findUpdateCandidates',
          filename
        }, error as Error);
        // Continue with next file
      }
    }

    // Filter to only candidates that need update
    const needsUpdateCandidates = candidates.filter(c => c.needsUpdate);
    
    // Sort by priority: high-traffic articles first, then by age
    needsUpdateCandidates.sort((a, b) => {
      const metricsA = metricsMap.get(a.slug);
      const metricsB = metricsMap.get(b.slug);
      
      const viewsA = metricsA?.views || 0;
      const viewsB = metricsB?.views || 0;
      
      // Prioritize high-traffic articles
      if (viewsA !== viewsB) {
        return viewsB - viewsA;
      }
      
      // Then by age (older first)
      return b.ageInDays - a.ageInDays;
    });

    this.logger.info('Update candidates identified', {
      operation: 'findUpdateCandidates',
      totalCandidates: candidates.length,
      needsUpdateCount: needsUpdateCandidates.length
    });
    
    return needsUpdateCandidates;
  }

  /**
   * Update an existing article with new content
   * Requirements 6.2, 6.3, 6.4: Update article, add new sections, update date
   */
  async updateArticle(slug: string): Promise<ArticleUpdate> {
    this.logger.info('Starting article update', {
      operation: 'updateArticle',
      articleSlug: slug
    });

    // Find the article file
    const files = fs.readdirSync(BLOG_CONTENT_PATH)
      .filter(file => file.endsWith('.md'));
    
    const filename = files.find(file => generateSlugFromFilename(file) === slug);
    
    if (!filename) {
      this.logger.error('Article not found', {
        operation: 'updateArticle',
        articleSlug: slug
      });
      throw new Error(`Article not found: ${slug}`);
    }

    const filePath = path.join(BLOG_CONTENT_PATH, filename);
    
    // Read existing article
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: originalContent } = matter(fileContent);
    
    this.logger.info('Read existing article', {
      operation: 'updateArticle',
      articleSlug: slug,
      articleTitle: frontmatter.title,
      originalWordCount: originalContent.split(/\s+/).length
    });

    // Create a topic-like object from the existing article
    const topic: Topic = {
      id: `update-${slug}`,
      title: `Actualización: ${frontmatter.title}`,
      category: frontmatter.category as BlogCategorySlug,
      tags: frontmatter.tags || [],
      priority: 'medium',
      keywords: frontmatter.seo?.keywords || [],
      lastUsed: new Date(),
      timesUsed: 0,
      status: 'active',
      createdAt: new Date(),
    };

    // Generate updated content using AI
    const prompt: GenerationPrompt = {
      topic,
      targetWordCount: 1200,
      tone: 'professional',
      includeCallToAction: true,
      relatedServices: ['reparacion-parabrisas', 'sustitucion-parabrisas', 'calibracion-adas'],
      context: `Este es un artículo existente que necesita ser actualizado con información nueva y relevante. 
      
CONTENIDO ORIGINAL:
${originalContent.substring(0, 2000)}...

Por favor, actualiza el contenido manteniendo la estructura general pero:
- Añade información nueva y actualizada
- Mejora las secciones existentes con más detalles
- Actualiza estadísticas o datos que puedan estar desactualizados
- Mantén el tono y estilo del artículo original
- Asegúrate de que el contenido sea relevante para ${new Date().getFullYear()}`,
    };

    this.logger.info('Generating updated content', {
      operation: 'updateArticle',
      articleSlug: slug
    });
    const updatedArticle = await this.aiGenerator.generateArticle(prompt);
    
    // Identify changes between original and updated content
    const changes = this.identifyChanges(originalContent, updatedArticle.content);
    
    this.logger.info('Changes identified', {
      operation: 'updateArticle',
      articleSlug: slug,
      changeCount: changes.length,
      updatedWordCount: updatedArticle.wordCount
    });

    // Update frontmatter with new updatedAt date
    const updatedFrontmatter = {
      ...frontmatter,
      updatedAt: new Date().toISOString(),
      // Optionally update SEO metadata if significantly improved
      seo: {
        ...frontmatter.seo,
        metaTitle: updatedArticle.seoMetadata.metaTitle,
        metaDescription: updatedArticle.seoMetadata.metaDescription,
        keywords: updatedArticle.seoMetadata.keywords,
      },
    };

    // Create updated file content
    const updatedFileContent = matter.stringify(updatedArticle.content, updatedFrontmatter);
    
    // Write updated content back to file
    fs.writeFileSync(filePath, updatedFileContent, 'utf8');
    
    this.logger.info('Article updated successfully', {
      operation: 'updateArticle',
      articleSlug: slug,
      filePath,
      changeCount: changes.length
    });

    const articleUpdate: ArticleUpdate = {
      slug,
      originalContent,
      updatedContent: updatedArticle.content,
      changes,
      updatedAt: new Date(),
    };

    // Register update in database
    await this.repository.createArticleUpdate({
      slug,
      changes: JSON.stringify(changes),
      updated_at: new Date().toISOString(),
    });

    return articleUpdate;
  }

  /**
   * Identify changes between original and updated content
   * This is a simplified diff that identifies major structural changes
   */
  private identifyChanges(
    originalContent: string,
    updatedContent: string
  ): Array<{ section: string; type: 'added' | 'modified' | 'removed'; description: string }> {
    const changes: Array<{ section: string; type: 'added' | 'modified' | 'removed'; description: string }> = [];

    // Extract sections (headers) from both versions
    const originalSections = this.extractSections(originalContent);
    const updatedSections = this.extractSections(updatedContent);

    // Find added sections
    for (const section of updatedSections) {
      if (!originalSections.some(s => s.title === section.title)) {
        changes.push({
          section: section.title,
          type: 'added',
          description: `Nueva sección añadida: "${section.title}"`,
        });
      }
    }

    // Find removed sections
    for (const section of originalSections) {
      if (!updatedSections.some(s => s.title === section.title)) {
        changes.push({
          section: section.title,
          type: 'removed',
          description: `Sección eliminada: "${section.title}"`,
        });
      }
    }

    // Find modified sections (same title but different content)
    for (const originalSection of originalSections) {
      const updatedSection = updatedSections.find(s => s.title === originalSection.title);
      if (updatedSection && originalSection.content !== updatedSection.content) {
        // Calculate content change percentage
        const originalLength = originalSection.content.length;
        const updatedLength = updatedSection.content.length;
        const lengthDiff = Math.abs(updatedLength - originalLength);
        const changePercent = Math.round((lengthDiff / originalLength) * 100);

        changes.push({
          section: originalSection.title,
          type: 'modified',
          description: `Sección modificada: "${originalSection.title}" (${changePercent}% de cambio)`,
        });
      }
    }

    // If no specific changes detected, add a general update note
    if (changes.length === 0) {
      changes.push({
        section: 'General',
        type: 'modified',
        description: 'Contenido general actualizado y mejorado',
      });
    }

    return changes;
  }

  /**
   * Extract sections from markdown content
   */
  private extractSections(content: string): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = [];
    
    // Split by headers (## or ###)
    const headerRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headerRegex));
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const title = match[2].trim();
      const startIndex = match.index! + match[0].length;
      const endIndex = i < matches.length - 1 ? matches[i + 1].index! : content.length;
      const sectionContent = content.substring(startIndex, endIndex).trim();
      
      sections.push({ title, content: sectionContent });
    }
    
    return sections;
  }

  /**
   * Get update history for an article
   * Requirement 6.5: Maintain history of changes
   */
  async getUpdateHistory(slug: string): Promise<ArticleUpdate[]> {
    this.logger.info('Retrieving update history', {
      operation: 'getUpdateHistory',
      articleSlug: slug
    });

    // Get all updates from database
    const dbUpdates = await this.repository.getArticleUpdatesBySlug(slug);
    
    // Map database updates to ArticleUpdate type
    const updates: ArticleUpdate[] = dbUpdates.map(dbUpdate => ({
      slug: dbUpdate.slug,
      originalContent: '', // Not stored in DB for space reasons
      updatedContent: '', // Not stored in DB for space reasons
      changes: JSON.parse(dbUpdate.changes),
      updatedAt: new Date(dbUpdate.updated_at),
    }));

    this.logger.info('Update history retrieved', {
      operation: 'getUpdateHistory',
      articleSlug: slug,
      updateCount: updates.length
    });
    
    return updates;
  }

  /**
   * Schedule updates for articles that need updating
   * Requirement 6.1: Automate update scheduling
   */
  async scheduleUpdates(minAgeInDays: number = 180, maxUpdatesPerRun: number = 5): Promise<void> {
    this.logger.info('Scheduling article updates', {
      operation: 'scheduleUpdates',
      minAgeInDays,
      maxUpdatesPerRun
    });

    if (!this.scheduler) {
      this.logger.error('ContentScheduler not provided', {
        operation: 'scheduleUpdates'
      });
      throw new Error('ContentScheduler not provided to UpdateManager');
    }

    // Find candidates for update
    const candidates = await this.findUpdateCandidates(minAgeInDays);
    
    if (candidates.length === 0) {
      this.logger.info('No articles need updating', {
        operation: 'scheduleUpdates'
      });
      return;
    }

    // Limit the number of updates to schedule
    const candidatesToSchedule = candidates.slice(0, maxUpdatesPerRun);
    
    this.logger.info('Scheduling updates', {
      operation: 'scheduleUpdates',
      candidateCount: candidatesToSchedule.length
    });

    // Schedule update tasks for each candidate
    let successCount = 0;
    for (const candidate of candidatesToSchedule) {
      try {
        await this.scheduler.scheduleArticleUpdate(candidate.slug);
        this.logger.info('Update scheduled', {
          operation: 'scheduleUpdates',
          articleSlug: candidate.slug,
          reason: candidate.updateReason
        });
        successCount++;
      } catch (error) {
        this.logger.error('Error scheduling update', {
          operation: 'scheduleUpdates',
          articleSlug: candidate.slug
        }, error as Error);
        // Continue with next candidate
      }
    }

    this.logger.info('Update scheduling completed', {
      operation: 'scheduleUpdates',
      successCount,
      totalAttempted: candidatesToSchedule.length
    });
  }
}
