/**
 * Markdown processing utilities for the blog system
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { BlogPost, BlogPostFrontmatter } from './blog-types';

/**
 * Process markdown content and extract frontmatter
 */
export function parseMarkdown(markdownContent: string): {
  frontmatter: BlogPostFrontmatter;
  content: string;
} {
  const { data, content } = matter(markdownContent);
  
  // Validate required frontmatter fields
  if (!data.title || !data.excerpt || !data.publishedAt || !data.author || !data.category) {
    throw new Error('Missing required frontmatter fields');
  }

  const frontmatter: BlogPostFrontmatter = {
    title: data.title,
    excerpt: data.excerpt,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    featuredImage: data.featuredImage,
    seo: data.seo || {},
    published: data.published !== false, // Default to true if not specified
  };

  return { frontmatter, content };
}

/**
 * Convert markdown content to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}

/**
 * Generate slug from filename
 */
export function generateSlugFromFilename(filename: string): string {
  // Remove .md extension and extract slug
  // Expected format: YYYY-MM-DD-slug-name.md
  const nameWithoutExtension = filename.replace(/\.md$/, '');
  
  // If filename starts with date pattern, remove it
  const datePattern = /^\d{4}-\d{2}-\d{2}-/;
  if (datePattern.test(nameWithoutExtension)) {
    return nameWithoutExtension.replace(datePattern, '');
  }
  
  return nameWithoutExtension;
}

/**
 * Validate frontmatter data
 */
export function validateFrontmatter(data: any): data is BlogPostFrontmatter {
  return (
    typeof data.title === 'string' &&
    typeof data.excerpt === 'string' &&
    typeof data.publishedAt === 'string' &&
    typeof data.author === 'string' &&
    typeof data.category === 'string' &&
    (data.published === undefined || typeof data.published === 'boolean')
  );
}