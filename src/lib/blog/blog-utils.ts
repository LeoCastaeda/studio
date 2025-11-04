/**
 * Blog utility functions
 */

import fs from 'fs';
import path from 'path';
import { BlogPost, BlogCategory, BlogMetadata, BlogPaginationInfo, BLOG_CATEGORIES, CATEGORY_NAMES, DEFAULT_POSTS_PER_PAGE } from './blog-types';
import { parseMarkdown, generateSlugFromFilename, markdownToHtml } from './markdown';

const BLOG_CONTENT_PATH = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all blog post files
 */
export function getBlogPostFiles(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_PATH)) {
    return [];
  }
  
  return fs.readdirSync(BLOG_CONTENT_PATH)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => b.localeCompare(a)); // Sort by filename (newest first)
}

/**
 * Read and parse a single blog post
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const files = getBlogPostFiles();
    const filename = files.find(file => generateSlugFromFilename(file) === slug);
    
    if (!filename) {
      return null;
    }
    
    const filePath = path.join(BLOG_CONTENT_PATH, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const { frontmatter, content } = parseMarkdown(fileContent);
    
    // Convert markdown to HTML
    const htmlContent = await markdownToHtml(content);
    
    const blogPost: BlogPost = {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      content: htmlContent,
      publishedAt: new Date(frontmatter.publishedAt),
      updatedAt: frontmatter.updatedAt ? new Date(frontmatter.updatedAt) : undefined,
      author: frontmatter.author,
      category: frontmatter.category,
      tags: frontmatter.tags,
      featuredImage: frontmatter.featuredImage,
      seo: frontmatter.seo || {},
      published: frontmatter.published,
    };
    
    return blogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all published blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = getBlogPostFiles();
  const posts: BlogPost[] = [];
  
  for (const filename of files) {
    const slug = generateSlugFromFilename(filename);
    const post = await getBlogPost(slug);
    
    if (post && post.published) {
      posts.push(post);
    }
  }
  
  // Sort by publication date (newest first)
  return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

/**
 * Get blog categories with post counts
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const posts = await getBlogPosts();
  const categoryMap = new Map<string, number>();
  
  // Count posts per category
  posts.forEach(post => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });
  
  // Convert to BlogCategory objects
  const categories: BlogCategory[] = [];
  Object.values(BLOG_CATEGORIES).forEach(categorySlug => {
    const postCount = categoryMap.get(categorySlug) || 0;
    categories.push({
      slug: categorySlug,
      name: CATEGORY_NAMES[categorySlug],
      description: `Artículos sobre ${CATEGORY_NAMES[categorySlug].toLowerCase()}`,
      postCount,
    });
  });
  
  return categories.filter(cat => cat.postCount > 0);
}

/**
 * Get all unique tags
 */
export async function getBlogTags(): Promise<string[]> {
  const posts = await getBlogPosts();
  const tagSet = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Get blog metadata
 */
export async function getBlogMetadata(): Promise<BlogMetadata> {
  const [posts, categories, tags] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getBlogTags(),
  ]);
  
  return {
    totalPosts: posts.length,
    categories,
    tags,
    recentPosts: posts.slice(0, 5), // Get 5 most recent posts
  };
}

/**
 * Filter posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter(post => post.category === category);
}

/**
 * Filter posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter(post => post.tags.includes(tag));
}

/**
 * Search posts by keyword
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get paginated blog posts with filters
 */
export async function getPaginatedBlogPosts(params: {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  postsPerPage?: number;
}): Promise<{
  posts: BlogPost[];
  pagination: BlogPaginationInfo;
}> {
  const {
    page = 1,
    category,
    tag,
    search,
    postsPerPage = DEFAULT_POSTS_PER_PAGE,
  } = params;

  let posts = await getBlogPosts();

  // Apply filters
  if (category) {
    posts = posts.filter(post => post.category === category);
  }

  if (tag) {
    posts = posts.filter(post => post.tags.includes(tag));
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Calculate pagination
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // Get posts for current page
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    pagination: {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

/**
 * Get related articles for a given post
 */
export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  // Score posts based on similarity
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Same category gets high score
    if (post.category === currentPost.category) {
      score += 10;
    }
    
    // Shared tags get points
    const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
    score += sharedTags.length * 3;
    
    // More recent posts get slight preference
    const daysDiff = Math.abs(post.publishedAt.getTime() - currentPost.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 30) {
      score += 2;
    } else if (daysDiff < 90) {
      score += 1;
    }
    
    return { post, score };
  });
  
  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Get previous and next posts in chronological order
 */
export async function getAdjacentPosts(currentPost: BlogPost): Promise<{
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}> {
  const allPosts = await getBlogPosts();
  
  // Find current post index
  const currentIndex = allPosts.findIndex(post => post.slug === currentPost.slug);
  
  if (currentIndex === -1) {
    return { previousPost: null, nextPost: null };
  }
  
  // Previous post is newer (lower index), next post is older (higher index)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  
  return { previousPost, nextPost };
}