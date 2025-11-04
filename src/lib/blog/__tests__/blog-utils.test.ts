/**
 * Unit tests for blog utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { 
  getBlogPostFiles, 
  getBlogPost, 
  getBlogPosts, 
  getBlogCategories, 
  getBlogTags, 
  getBlogPostsByCategory, 
  getBlogPostsByTag, 
  searchBlogPosts,
  getPaginatedBlogPosts
} from '../blog-utils';

// Mock fs module
vi.mock('fs');
const mockFs = vi.mocked(fs);

// Mock the markdown module
vi.mock('../markdown', () => ({
  parseMarkdown: vi.fn(),
  markdownToHtml: vi.fn(),
  generateSlugFromFilename: vi.fn()
}));

import { parseMarkdown, markdownToHtml, generateSlugFromFilename } from '../markdown';
const mockParseMarkdown = vi.mocked(parseMarkdown);
const mockMarkdownToHtml = vi.mocked(markdownToHtml);
const mockGenerateSlugFromFilename = vi.mocked(generateSlugFromFilename);

describe('Blog Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock process.cwd()
    vi.spyOn(process, 'cwd').mockReturnValue('/mock/project');
    
    // Default mock implementations
    mockMarkdownToHtml.mockResolvedValue('<p>Test HTML content</p>');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getBlogPostFiles', () => {
    it('should return empty array when blog directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const files = getBlogPostFiles();
      
      expect(files).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(path.join('/mock/project', 'content', 'blog'));
    });

    it('should return sorted markdown files', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        '2024-01-10-old-post.md',
        '2024-01-20-new-post.md',
        'not-markdown.txt',
        '2024-01-15-middle-post.md'
      ] as any);
      
      const files = getBlogPostFiles();
      
      expect(files).toEqual([
        '2024-01-20-new-post.md',
        '2024-01-15-middle-post.md',
        '2024-01-10-old-post.md'
      ]);
    });
  });

  describe('getBlogPost', () => {
    it('should return null when post file not found', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['other-post.md'] as any);
      mockGenerateSlugFromFilename.mockReturnValue('other-slug');
      
      const post = await getBlogPost('non-existent-slug');
      
      expect(post).toBeNull();
    });

    it('should return parsed blog post', async () => {
      const mockFrontmatter = {
        title: 'Test Post',
        excerpt: 'Test excerpt',
        publishedAt: '2024-01-15',
        author: 'Test Author',
        category: 'reparaciones',
        tags: ['test'],
        published: true,
        seo: {}
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['2024-01-15-test-post.md'] as any);
      mockFs.readFileSync.mockReturnValue('mock file content');
      mockGenerateSlugFromFilename.mockReturnValue('test-post');
      mockParseMarkdown.mockReturnValue({
        frontmatter: mockFrontmatter,
        content: 'Test content'
      });
      
      const post = await getBlogPost('test-post');
      
      expect(post).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: '<p>Test HTML content</p>',
        publishedAt: new Date('2024-01-15'),
        updatedAt: undefined,
        author: 'Test Author',
        category: 'reparaciones',
        tags: ['test'],
        featuredImage: undefined,
        seo: {},
        published: true
      });
    });

    it('should handle errors gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['test.md'] as any);
      mockGenerateSlugFromFilename.mockReturnValue('test');
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const post = await getBlogPost('test');
      
      expect(post).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getBlogPostsByCategory', () => {
    it('should filter posts by category', async () => {
      // Mock getBlogPosts to return test data
      const mockPosts = [
        { category: 'reparaciones', title: 'Post 1' },
        { category: 'consejos', title: 'Post 2' },
        { category: 'reparaciones', title: 'Post 3' }
      ];

      // Mock the getBlogPosts function by mocking the file system calls
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        'post1.md', 'post2.md', 'post3.md'
      ] as any);
      
      mockGenerateSlugFromFilename
        .mockReturnValueOnce('post1')
        .mockReturnValueOnce('post2')
        .mockReturnValueOnce('post3');
      
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown
        .mockReturnValueOnce({
          frontmatter: { ...mockPosts[0], publishedAt: '2024-01-15', excerpt: 'excerpt', author: 'author', tags: [], published: true, seo: {} },
          content: 'content'
        })
        .mockReturnValueOnce({
          frontmatter: { ...mockPosts[1], publishedAt: '2024-01-15', excerpt: 'excerpt', author: 'author', tags: [], published: true, seo: {} },
          content: 'content'
        })
        .mockReturnValueOnce({
          frontmatter: { ...mockPosts[2], publishedAt: '2024-01-15', excerpt: 'excerpt', author: 'author', tags: [], published: true, seo: {} },
          content: 'content'
        });
      
      const reparacionesPosts = await getBlogPostsByCategory('reparaciones');
      
      expect(reparacionesPosts).toHaveLength(2);
      expect(reparacionesPosts.every(post => post.category === 'reparaciones')).toBe(true);
    });
  });

  describe('getBlogPostsByTag', () => {
    it('should filter posts by tag', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md', 'post2.md'] as any);
      
      mockGenerateSlugFromFilename
        .mockReturnValueOnce('post1')
        .mockReturnValueOnce('post2');
      
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown
        .mockReturnValueOnce({
          frontmatter: {
            title: 'Post 1',
            excerpt: 'excerpt',
            publishedAt: '2024-01-15',
            author: 'author',
            category: 'reparaciones',
            tags: ['parabrisas', 'reparacion'],
            published: true,
            seo: {}
          },
          content: 'content'
        })
        .mockReturnValueOnce({
          frontmatter: {
            title: 'Post 2',
            excerpt: 'excerpt',
            publishedAt: '2024-01-15',
            author: 'author',
            category: 'consejos',
            tags: ['mantenimiento'],
            published: true,
            seo: {}
          },
          content: 'content'
        });
      
      const parabrisasPosts = await getBlogPostsByTag('parabrisas');
      
      expect(parabrisasPosts).toHaveLength(1);
      expect(parabrisasPosts[0].tags).toContain('parabrisas');
    });
  });

  describe('searchBlogPosts', () => {
    it('should search posts by title', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md'] as any);
      
      mockGenerateSlugFromFilename.mockReturnValue('post1');
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown.mockReturnValue({
        frontmatter: {
          title: 'Reparación de Parabrisas',
          excerpt: 'Guía completa',
          publishedAt: '2024-01-15',
          author: 'author',
          category: 'reparaciones',
          tags: ['parabrisas'],
          published: true,
          seo: {}
        },
        content: 'content'
      });
      
      const results = await searchBlogPosts('parabrisas');
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Parabrisas');
    });

    it('should search posts by excerpt', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md'] as any);
      
      mockGenerateSlugFromFilename.mockReturnValue('post1');
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown.mockReturnValue({
        frontmatter: {
          title: 'Test Post',
          excerpt: 'Guía completa de reparación',
          publishedAt: '2024-01-15',
          author: 'author',
          category: 'reparaciones',
          tags: ['test'],
          published: true,
          seo: {}
        },
        content: 'content'
      });
      
      const results = await searchBlogPosts('reparación');
      
      expect(results).toHaveLength(1);
    });

    it('should search posts by tags', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md'] as any);
      
      mockGenerateSlugFromFilename.mockReturnValue('post1');
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown.mockReturnValue({
        frontmatter: {
          title: 'Test Post',
          excerpt: 'Test excerpt',
          publishedAt: '2024-01-15',
          author: 'author',
          category: 'reparaciones',
          tags: ['parabrisas', 'mantenimiento'],
          published: true,
          seo: {}
        },
        content: 'content'
      });
      
      const results = await searchBlogPosts('mantenimiento');
      
      expect(results).toHaveLength(1);
    });

    it('should return empty array when no matches found', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md'] as any);
      
      mockGenerateSlugFromFilename.mockReturnValue('post1');
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown.mockReturnValue({
        frontmatter: {
          title: 'Test Post',
          excerpt: 'Test excerpt',
          publishedAt: '2024-01-15',
          author: 'author',
          category: 'reparaciones',
          tags: ['test'],
          published: true,
          seo: {}
        },
        content: 'content'
      });
      
      const results = await searchBlogPosts('nonexistent');
      
      expect(results).toHaveLength(0);
    });
  });

  describe('getPaginatedBlogPosts', () => {
    it('should return paginated results', async () => {
      // Mock multiple posts
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        'post1.md', 'post2.md', 'post3.md', 'post4.md', 'post5.md'
      ] as any);
      
      // Mock slug generation
      for (let i = 1; i <= 5; i++) {
        mockGenerateSlugFromFilename.mockReturnValueOnce(`post${i}`);
      }
      
      mockFs.readFileSync.mockReturnValue('mock content');
      
      // Mock frontmatter for each post
      for (let i = 1; i <= 5; i++) {
        mockParseMarkdown.mockReturnValueOnce({
          frontmatter: {
            title: `Post ${i}`,
            excerpt: `Excerpt ${i}`,
            publishedAt: `2024-01-${10 + i}`,
            author: 'author',
            category: 'reparaciones',
            tags: ['test'],
            published: true,
            seo: {}
          },
          content: 'content'
        });
      }
      
      const result = await getPaginatedBlogPosts({
        page: 1,
        postsPerPage: 3
      });
      
      expect(result.posts).toHaveLength(3);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalPosts).toBe(5);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(false);
    });

    it('should handle search and category filters', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md', 'post2.md'] as any);
      
      mockGenerateSlugFromFilename
        .mockReturnValueOnce('post1')
        .mockReturnValueOnce('post2');
      
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseMarkdown
        .mockReturnValueOnce({
          frontmatter: {
            title: 'Reparación Post',
            excerpt: 'About repairs',
            publishedAt: '2024-01-15',
            author: 'author',
            category: 'reparaciones',
            tags: ['parabrisas'],
            published: true,
            seo: {}
          },
          content: 'content'
        })
        .mockReturnValueOnce({
          frontmatter: {
            title: 'Consejos Post',
            excerpt: 'About tips',
            publishedAt: '2024-01-16',
            author: 'author',
            category: 'consejos',
            tags: ['mantenimiento'],
            published: true,
            seo: {}
          },
          content: 'content'
        });
      
      const result = await getPaginatedBlogPosts({
        category: 'reparaciones',
        search: 'reparación'
      });
      
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].category).toBe('reparaciones');
      expect(result.posts[0].title).toContain('Reparación');
    });
  });
});