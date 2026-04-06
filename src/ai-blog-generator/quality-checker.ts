/**
 * Quality Checker - Validates the quality of generated articles
 * 
 * This module implements comprehensive quality checks for AI-generated content,
 * including content validation, SEO validation, and quality scoring.
 */

import {
  GeneratedArticle,
  QualityCheckResult,
  QualityCheckConfig,
  QualityIssue,
} from './types';
import { getLogger, Logger } from './logger';

/**
 * QualityChecker class
 * 
 * Validates generated articles against quality standards including:
 * - Content length and structure
 * - SEO metadata compliance
 * - Markdown formatting
 * - Overall quality scoring
 */
export class QualityChecker {
  private config: QualityCheckConfig;
  private logger: Logger;

  constructor(config: QualityCheckConfig) {
    this.config = config;
    this.logger = getLogger().child({ component: 'QualityChecker' });
  }

  /**
   * Main method to check article quality
   * Validates: Requirements 4.1, 4.2, 5.1, 5.2
   */
  async checkArticle(article: GeneratedArticle): Promise<QualityCheckResult> {
    this.logger.info('Starting quality check', {
      operation: 'checkArticle',
      articleTitle: article.title,
      wordCount: article.wordCount
    });

    const issues: QualityIssue[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Run all validation checks
    issues.push(...this.validateContentLength(article));
    issues.push(...this.validateStructure(article));
    issues.push(...this.validateMarkdownFormat(article));
    issues.push(...await this.validateSEO(article));

    // Generate warnings and suggestions
    this.generateWarningsAndSuggestions(article, warnings, suggestions);

    // Calculate quality score
    const score = this.calculateQualityScore(article, issues);

    // Determine if article passed quality checks
    const passed = score >= this.config.minReadabilityScore && 
                   !issues.some(issue => issue.severity === 'high');

    this.logger.info('Quality check completed', {
      operation: 'checkArticle',
      articleTitle: article.title,
      passed,
      score,
      issueCount: issues.length,
      highSeverityIssues: issues.filter(i => i.severity === 'high').length
    });

    if (!passed) {
      this.logger.warn('Article failed quality check', {
        operation: 'checkArticle',
        articleTitle: article.title,
        score,
        issues: issues.map(i => ({ type: i.type, severity: i.severity, description: i.description }))
      });
    }

    return {
      passed,
      score,
      issues,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate content length
   * Validates: Requirements 4.1
   */
  private validateContentLength(article: GeneratedArticle): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const wordCount = article.wordCount;

    if (wordCount < this.config.minWordCount) {
      issues.push({
        type: 'poor_structure',
        severity: 'high',
        description: `El artículo tiene ${wordCount} palabras, pero se requieren al menos ${this.config.minWordCount} palabras`,
        location: 'content',
      });
    }

    if (wordCount > this.config.maxWordCount) {
      issues.push({
        type: 'poor_structure',
        severity: 'medium',
        description: `El artículo tiene ${wordCount} palabras, excediendo el máximo recomendado de ${this.config.maxWordCount} palabras`,
        location: 'content',
      });
    }

    return issues;
  }

  /**
   * Validate article structure
   * Validates: Requirements 4.2
   */
  private validateStructure(article: GeneratedArticle): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const content = article.content;

    // Check for required sections
    const hasHeadings = /^#{1,3}\s+.+$/m.test(content);
    if (!hasHeadings) {
      issues.push({
        type: 'poor_structure',
        severity: 'high',
        description: 'El artículo no contiene encabezados (headings) para estructurar el contenido',
        location: 'content',
      });
    }

    // Check for introduction (content before first heading)
    const firstHeadingIndex = content.search(/^#{1,3}\s+/m);
    if (firstHeadingIndex > 0) {
      const intro = content.substring(0, firstHeadingIndex).trim();
      if (intro.length < 100) {
        issues.push({
          type: 'poor_structure',
          severity: 'medium',
          description: 'La introducción es demasiado corta (menos de 100 caracteres)',
          location: 'introduction',
        });
      }
    }

    // Check for call to action if required
    if (this.config.requireCallToAction && !article.callToAction) {
      issues.push({
        type: 'poor_structure',
        severity: 'medium',
        description: 'El artículo no incluye una llamada a la acción (call to action)',
        location: 'callToAction',
      });
    }

    // Check for internal links if required
    if (this.config.requireInternalLinks && article.internalLinks.length === 0) {
      issues.push({
        type: 'poor_structure',
        severity: 'low',
        description: 'El artículo no incluye enlaces internos',
        location: 'internalLinks',
      });
    }

    return issues;
  }

  /**
   * Validate Markdown format
   * Validates: Requirements 4.2
   */
  private validateMarkdownFormat(article: GeneratedArticle): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const content = article.content;

    // Check for common Markdown issues
    
    // Malformed links: [text](url should be [text](url)
    const malformedLinks = content.match(/\[([^\]]+)\]\([^\)]*$/gm);
    if (malformedLinks) {
      issues.push({
        type: 'poor_structure',
        severity: 'high',
        description: 'El contenido contiene enlaces Markdown mal formados',
        location: 'content',
      });
    }

    // Malformed headings: multiple # without space
    const malformedHeadings = content.match(/^#{1,6}[^#\s]/gm);
    if (malformedHeadings) {
      issues.push({
        type: 'poor_structure',
        severity: 'medium',
        description: 'El contenido contiene encabezados Markdown mal formados (falta espacio después de #)',
        location: 'content',
      });
    }

    // Check for unescaped HTML that might break rendering
    const dangerousHTML = /<script|<iframe|<object|<embed/gi;
    if (dangerousHTML.test(content)) {
      issues.push({
        type: 'poor_structure',
        severity: 'high',
        description: 'El contenido contiene HTML potencialmente peligroso',
        location: 'content',
      });
    }

    return issues;
  }

  /**
   * Validate SEO metadata
   * Validates: Requirements 5.1, 5.2
   */
  async validateSEO(article: GeneratedArticle): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    const { metaTitle, metaDescription, keywords } = article.seoMetadata;

    // Validate meta title length (≤60 characters)
    if (!metaTitle || metaTitle.trim().length === 0) {
      issues.push({
        type: 'seo_issue',
        severity: 'high',
        description: 'El meta title está vacío',
        location: 'seoMetadata.metaTitle',
      });
    } else if (metaTitle.length > 60) {
      issues.push({
        type: 'seo_issue',
        severity: 'high',
        description: `El meta title tiene ${metaTitle.length} caracteres, excediendo el límite de 60 caracteres`,
        location: 'seoMetadata.metaTitle',
      });
    } else if (metaTitle.length < 30) {
      issues.push({
        type: 'seo_issue',
        severity: 'medium',
        description: `El meta title tiene ${metaTitle.length} caracteres, se recomienda al menos 30 caracteres`,
        location: 'seoMetadata.metaTitle',
      });
    }

    // Validate meta description length (150-160 characters)
    if (!metaDescription || metaDescription.trim().length === 0) {
      issues.push({
        type: 'seo_issue',
        severity: 'high',
        description: 'La meta description está vacía',
        location: 'seoMetadata.metaDescription',
      });
    } else if (metaDescription.length < 150) {
      issues.push({
        type: 'seo_issue',
        severity: 'medium',
        description: `La meta description tiene ${metaDescription.length} caracteres, se recomienda al menos 150 caracteres`,
        location: 'seoMetadata.metaDescription',
      });
    } else if (metaDescription.length > 160) {
      issues.push({
        type: 'seo_issue',
        severity: 'high',
        description: `La meta description tiene ${metaDescription.length} caracteres, excediendo el límite de 160 caracteres`,
        location: 'seoMetadata.metaDescription',
      });
    }

    // Validate presence of keywords
    if (!keywords || keywords.length === 0) {
      issues.push({
        type: 'seo_issue',
        severity: 'medium',
        description: 'No se han definido keywords para el artículo',
        location: 'seoMetadata.keywords',
      });
    } else if (keywords.length < 3) {
      issues.push({
        type: 'seo_issue',
        severity: 'low',
        description: `Solo se han definido ${keywords.length} keywords, se recomienda al menos 3`,
        location: 'seoMetadata.keywords',
      });
    }

    return issues;
  }

  /**
   * Generate warnings and suggestions based on article analysis
   */
  private generateWarningsAndSuggestions(
    article: GeneratedArticle,
    warnings: string[],
    suggestions: string[]
  ): void {
    // Check word count optimization
    if (article.wordCount < 1000) {
      suggestions.push('Considera expandir el contenido a al menos 1000 palabras para mejor SEO');
    }

    // Check for tags
    if (article.suggestedTags.length < 3) {
      suggestions.push('Añade más tags para mejorar la categorización del artículo');
    }

    // Check for internal links
    if (article.internalLinks.length < 2) {
      suggestions.push('Añade más enlaces internos para mejorar la navegación y SEO');
    }

    // Check excerpt
    if (article.excerpt.length < 100) {
      warnings.push('El excerpt es corto, considera expandirlo para mejor engagement');
    }

    // Check for images (basic check in markdown)
    const hasImages = /!\[.*?\]\(.*?\)/.test(article.content);
    if (!hasImages) {
      suggestions.push('Considera añadir imágenes para mejorar el engagement visual');
    }

    // Check for lists (better readability)
    const hasLists = /^[\*\-\+]\s+/m.test(article.content) || /^\d+\.\s+/m.test(article.content);
    if (!hasLists) {
      suggestions.push('Considera usar listas para mejorar la legibilidad');
    }
  }

  /**
   * Calculate overall quality score (0-100)
   * Validates: Requirements 4.2, 4.4
   */
  private calculateQualityScore(
    article: GeneratedArticle,
    issues: QualityIssue[]
  ): number {
    let score = 100;

    // Deduct points for issues based on severity
    for (const issue of issues) {
      switch (issue.severity) {
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    }

    // Bonus points for good practices
    
    // Good word count range (1200-1800 is optimal)
    if (article.wordCount >= 1200 && article.wordCount <= 1800) {
      score += 5;
    }

    // Has multiple internal links
    if (article.internalLinks.length >= 3) {
      score += 5;
    }

    // Has good number of tags
    if (article.suggestedTags.length >= 3 && article.suggestedTags.length <= 7) {
      score += 3;
    }

    // Has call to action
    if (article.callToAction && article.callToAction.length > 20) {
      score += 2;
    }

    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Check for plagiarism (placeholder for future implementation)
   * Validates: Requirements 4.3
   */
  async checkPlagiarism(content: string): Promise<boolean> {
    // TODO: Implement plagiarism check using external API
    // For now, return false (no plagiarism detected)
    return false;
  }

  /**
   * Check readability score (placeholder for future implementation)
   */
  async checkReadability(content: string): Promise<number> {
    // TODO: Implement readability scoring (e.g., Flesch-Kincaid)
    // For now, return a default score
    return 70;
  }

  /**
   * Check article structure in detail
   */
  async checkStructure(content: string): Promise<QualityIssue[]> {
    // This is already implemented in validateStructure
    // This method is kept for API compatibility
    const mockArticle: GeneratedArticle = {
      title: '',
      excerpt: '',
      content,
      suggestedTags: [],
      suggestedCategory: 'reparacion-parabrisas',
      seoMetadata: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
      internalLinks: [],
      callToAction: '',
      wordCount: content.split(/\s+/).length,
      generatedAt: new Date(),
    };

    return this.validateStructure(mockArticle);
  }
}

/**
 * Create a default quality checker configuration
 */
export function createDefaultQualityConfig(): QualityCheckConfig {
  return {
    minWordCount: 800,
    maxWordCount: 2000,
    requireCallToAction: true,
    requireInternalLinks: true,
    minReadabilityScore: 70,
    checkPlagiarism: false, // Disabled by default until implemented
    checkFactualAccuracy: false, // Disabled by default until implemented
  };
}
