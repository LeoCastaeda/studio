/**
 * Property-based tests for Quality Checker
 * **Feature: ai-blog-generator, Property 3: Content Quality Threshold**
 * **Validates: Requirements 4.2, 4.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { QualityChecker, createDefaultQualityConfig } from '../quality-checker';
import { GeneratedArticle, QualityCheckConfig } from '../types';
import { BlogCategorySlug } from '@/lib/blog/blog-types';

describe('QualityChecker Property Tests', () => {
  let qualityChecker: QualityChecker;
  let config: QualityCheckConfig;

  beforeEach(() => {
    config = createDefaultQualityConfig();
    qualityChecker = new QualityChecker(config);
  });

  /**
   * **Feature: ai-blog-generator, Property 3: Content Quality Threshold**
   * **Validates: Requirements 4.2, 4.5**
   * 
   * Property: For any generated article, if the quality score is below the configured threshold,
   * the article should be saved as a draft requiring manual review rather than auto-published.
   */
  it('should fail quality check when score is below threshold', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator for articles that should fail quality checks
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          excerpt: fc.string({ minLength: 1, maxLength: 200 }),
          content: fc.oneof(
            // Very short content (should fail word count)
            fc.string({ minLength: 1, maxLength: 100 }),
            // Content without headings (should fail structure)
            fc.string({ minLength: 800, maxLength: 1000 }).filter(s => !/^#{1,3}\s+/m.test(s)),
            // Content with malformed markdown (should fail format)
            fc.string({ minLength: 800, maxLength: 1000 }).map(s => s + '\n[broken link]('),
          ),
          suggestedTags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 2 }),
          suggestedCategory: fc.constantFrom('reparaciones', 'instalacion', 'consejos') as fc.Arbitrary<BlogCategorySlug>,
          seoMetadata: fc.record({
            metaTitle: fc.oneof(
              fc.constant(''), // Empty title (should fail)
              fc.string({ minLength: 80, maxLength: 120 }), // Too long title (should fail)
            ),
            metaDescription: fc.oneof(
              fc.constant(''), // Empty description (should fail)
              fc.string({ minLength: 1, maxLength: 100 }), // Too short description (should fail)
              fc.string({ minLength: 200, maxLength: 300 }), // Too long description (should fail)
            ),
            keywords: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 1 }), // Too few keywords
          }),
          internalLinks: fc.array(
            fc.record({
              text: fc.string({ minLength: 1, maxLength: 50 }),
              url: fc.string({ minLength: 1, maxLength: 100 }),
            }),
            { maxLength: 1 }
          ),
          callToAction: fc.string({ minLength: 0, maxLength: 10 }), // Short or empty CTA
          generatedAt: fc.constant(new Date()),
        }).map(article => ({
          ...article,
          wordCount: article.content.split(/\s+/).length,
        })),
        async (article: GeneratedArticle) => {
          const result = await qualityChecker.checkArticle(article);
          
          // If the score is below the threshold, the article should fail quality check
          if (result.score < config.minReadabilityScore) {
            expect(result.passed).toBe(false);
          }
          
          // Articles with high severity issues should always fail
          const hasHighSeverityIssues = result.issues.some(issue => issue.severity === 'high');
          if (hasHighSeverityIssues) {
            expect(result.passed).toBe(false);
          }
          
          // The score should be between 0 and 100
          expect(result.score).toBeGreaterThanOrEqual(0);
          expect(result.score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Articles that meet quality standards should pass the quality check
   */
  it('should pass quality check for well-formed articles', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator for articles that should pass quality checks
        fc.record({
          title: fc.string({ minLength: 10, maxLength: 60 }),
          excerpt: fc.string({ minLength: 100, maxLength: 200 }),
          content: fc.array(fc.lorem({ maxCount: 5 }), { minLength: 200, maxLength: 300 }).map(words => {
            // Create content with actual words (not just characters)
            const wordArray = words.join(' ').split(/\s+/);
            const intro = wordArray.slice(0, 100).join(' ');
            const desarrollo = wordArray.slice(100, 200).join(' ');
            const conclusion = wordArray.slice(200).join(' ');
            
            // Ensure content has proper structure with sufficient word count
            return `# Introducción\n\n${intro}\n\n## Desarrollo\n\n${desarrollo}\n\n## Conclusión\n\n${conclusion}`;
          }),
          suggestedTags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 3, maxLength: 7 }),
          suggestedCategory: fc.constantFrom('reparaciones', 'instalacion', 'consejos') as fc.Arbitrary<BlogCategorySlug>,
          seoMetadata: fc.record({
            metaTitle: fc.string({ minLength: 30, maxLength: 60 }),
            metaDescription: fc.string({ minLength: 150, maxLength: 160 }),
            keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 3, maxLength: 7 }),
          }),
          internalLinks: fc.array(
            fc.record({
              text: fc.string({ minLength: 5, maxLength: 30 }),
              url: fc.webUrl(),
            }),
            { minLength: 2, maxLength: 5 }
          ),
          callToAction: fc.string({ minLength: 20, maxLength: 100 }),
          generatedAt: fc.constant(new Date()),
        }).map(article => ({
          ...article,
          wordCount: article.content.split(/\s+/).length,
        })),
        async (article: GeneratedArticle) => {
          const result = await qualityChecker.checkArticle(article);
          
          // Well-formed articles should have a good score
          expect(result.score).toBeGreaterThan(60);
          
          // Should not have high severity issues
          const hasHighSeverityIssues = result.issues.some(issue => issue.severity === 'high');
          expect(hasHighSeverityIssues).toBe(false);
          
          // If score is above threshold and no high severity issues, should pass
          if (result.score >= config.minReadabilityScore && !hasHighSeverityIssues) {
            expect(result.passed).toBe(true);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Quality score should be consistent - same article should always get same score
   */
  it('should produce consistent quality scores for identical articles', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 10, maxLength: 60 }),
          excerpt: fc.string({ minLength: 50, maxLength: 200 }),
          content: fc.string({ minLength: 500, maxLength: 1500 }),
          suggestedTags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
          suggestedCategory: fc.constantFrom('reparaciones', 'instalacion', 'consejos') as fc.Arbitrary<BlogCategorySlug>,
          seoMetadata: fc.record({
            metaTitle: fc.string({ minLength: 10, maxLength: 80 }),
            metaDescription: fc.string({ minLength: 50, maxLength: 200 }),
            keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          }),
          internalLinks: fc.array(
            fc.record({
              text: fc.string({ minLength: 5, maxLength: 30 }),
              url: fc.string({ minLength: 5, maxLength: 50 }),
            }),
            { maxLength: 3 }
          ),
          callToAction: fc.string({ minLength: 0, maxLength: 100 }),
          generatedAt: fc.constant(new Date()),
        }).map(article => ({
          ...article,
          wordCount: article.content.split(/\s+/).length,
        })),
        async (article: GeneratedArticle) => {
          // Check the same article twice
          const result1 = await qualityChecker.checkArticle(article);
          const result2 = await qualityChecker.checkArticle(article);
          
          // Should get identical results
          expect(result1.score).toBe(result2.score);
          expect(result1.passed).toBe(result2.passed);
          expect(result1.issues).toEqual(result2.issues);
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: Quality score should decrease as issues are introduced
   */
  it('should have lower quality score when issues are introduced', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a good base article
        fc.record({
          title: fc.string({ minLength: 30, maxLength: 60 }),
          excerpt: fc.string({ minLength: 100, maxLength: 160 }),
          content: fc.string({ minLength: 1200, maxLength: 1800 }).map(content => {
            return `# Introducción\n\n${content.substring(0, 300)}\n\n## Desarrollo\n\n${content.substring(300, 900)}\n\n## Conclusión\n\n${content.substring(900)}`;
          }),
          suggestedTags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 3, maxLength: 5 }),
          suggestedCategory: fc.constantFrom('reparaciones', 'instalacion', 'consejos') as fc.Arbitrary<BlogCategorySlug>,
          seoMetadata: fc.record({
            metaTitle: fc.string({ minLength: 30, maxLength: 60 }),
            metaDescription: fc.string({ minLength: 150, maxLength: 160 }),
            keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 3, maxLength: 5 }),
          }),
          internalLinks: fc.array(
            fc.record({
              text: fc.string({ minLength: 5, maxLength: 30 }),
              url: fc.string({ minLength: 5, maxLength: 50 }),
            }),
            { minLength: 2, maxLength: 4 }
          ),
          callToAction: fc.string({ minLength: 20, maxLength: 80 }),
          generatedAt: fc.constant(new Date()),
        }).map(article => ({
          ...article,
          wordCount: article.content.split(/\s+/).length,
        })),
        async (goodArticle: GeneratedArticle) => {
          // Create a degraded version with issues
          const badArticle: GeneratedArticle = {
            ...goodArticle,
            seoMetadata: {
              ...goodArticle.seoMetadata,
              metaTitle: '', // Empty title (high severity issue)
              metaDescription: 'short', // Too short description
            },
            content: 'Very short content without headings', // Poor structure
            wordCount: 5,
          };
          
          const goodResult = await qualityChecker.checkArticle(goodArticle);
          const badResult = await qualityChecker.checkArticle(badArticle);
          
          // Bad article should have lower score than good article
          expect(badResult.score).toBeLessThan(goodResult.score);
          
          // Bad article should have more issues
          expect(badResult.issues.length).toBeGreaterThan(goodResult.issues.length);
        }
      ),
      { numRuns: 20 }
    );
  });
});