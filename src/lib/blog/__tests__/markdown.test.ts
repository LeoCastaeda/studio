/**
 * Unit tests for markdown processing utilities
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown, markdownToHtml, generateSlugFromFilename, validateFrontmatter } from '../markdown';

describe('Markdown Processing', () => {
  describe('parseMarkdown', () => {
    it('should parse valid markdown with frontmatter', () => {
      const markdownContent = `---
title: "Test Post"
excerpt: "Test excerpt"
publishedAt: "2024-01-15"
author: "Test Author"
category: "reparaciones"
tags: ["test", "blog"]
published: true
---

# Test Content

This is test content.`;

      const result = parseMarkdown(markdownContent);

      expect(result.frontmatter.title).toBe('Test Post');
      expect(result.frontmatter.excerpt).toBe('Test excerpt');
      expect(result.frontmatter.publishedAt).toBe('2024-01-15');
      expect(result.frontmatter.author).toBe('Test Author');
      expect(result.frontmatter.category).toBe('reparaciones');
      expect(result.frontmatter.tags).toEqual(['test', 'blog']);
      expect(result.frontmatter.published).toBe(true);
      expect(result.content).toContain('# Test Content');
    });

    it('should throw error for missing required frontmatter fields', () => {
      const invalidMarkdown = `---
title: "Test Post"
# Missing required fields
---

Content here`;

      expect(() => parseMarkdown(invalidMarkdown)).toThrow('Missing required frontmatter fields');
    });

    it('should default published to true when not specified', () => {
      const markdownContent = `---
title: "Test Post"
excerpt: "Test excerpt"
publishedAt: "2024-01-15"
author: "Test Author"
category: "reparaciones"
---

Content`;

      const result = parseMarkdown(markdownContent);
      expect(result.frontmatter.published).toBe(true);
    });

    it('should handle optional fields correctly', () => {
      const markdownContent = `---
title: "Test Post"
excerpt: "Test excerpt"
publishedAt: "2024-01-15"
author: "Test Author"
category: "reparaciones"
tags: ["test"]
featuredImage: "/test.jpg"
seo:
  metaTitle: "SEO Title"
  metaDescription: "SEO Description"
---

Content`;

      const result = parseMarkdown(markdownContent);
      expect(result.frontmatter.featuredImage).toBe('/test.jpg');
      expect(result.frontmatter.seo?.metaTitle).toBe('SEO Title');
      expect(result.frontmatter.seo?.metaDescription).toBe('SEO Description');
    });
  });

  describe('markdownToHtml', () => {
    it('should convert markdown to HTML', async () => {
      const markdown = '# Heading\n\nThis is **bold** text.';
      const html = await markdownToHtml(markdown);
      
      expect(html).toContain('<h1>Heading</h1>');
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should handle lists correctly', async () => {
      const markdown = '- Item 1\n- Item 2\n- Item 3';
      const html = await markdownToHtml(markdown);
      
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
    });
  });

  describe('generateSlugFromFilename', () => {
    it('should generate slug from date-prefixed filename', () => {
      const filename = '2024-01-15-como-reparar-parabrisas.md';
      const slug = generateSlugFromFilename(filename);
      
      expect(slug).toBe('como-reparar-parabrisas');
    });

    it('should handle filename without date prefix', () => {
      const filename = 'simple-post.md';
      const slug = generateSlugFromFilename(filename);
      
      expect(slug).toBe('simple-post');
    });

    it('should remove .md extension', () => {
      const filename = 'test-post.md';
      const slug = generateSlugFromFilename(filename);
      
      expect(slug).toBe('test-post');
    });
  });

  describe('validateFrontmatter', () => {
    it('should validate correct frontmatter', () => {
      const validData = {
        title: 'Test Title',
        excerpt: 'Test excerpt',
        publishedAt: '2024-01-15',
        author: 'Test Author',
        category: 'reparaciones',
        published: true
      };

      expect(validateFrontmatter(validData)).toBe(true);
    });

    it('should reject frontmatter with missing required fields', () => {
      const invalidData = {
        title: 'Test Title',
        // Missing excerpt, publishedAt, author, category
      };

      expect(validateFrontmatter(invalidData)).toBe(false);
    });

    it('should reject frontmatter with wrong types', () => {
      const invalidData = {
        title: 123, // Should be string
        excerpt: 'Test excerpt',
        publishedAt: '2024-01-15',
        author: 'Test Author',
        category: 'reparaciones'
      };

      expect(validateFrontmatter(invalidData)).toBe(false);
    });

    it('should allow published field to be undefined', () => {
      const validData = {
        title: 'Test Title',
        excerpt: 'Test excerpt',
        publishedAt: '2024-01-15',
        author: 'Test Author',
        category: 'reparaciones'
        // published is undefined
      };

      expect(validateFrontmatter(validData)).toBe(true);
    });
  });
});