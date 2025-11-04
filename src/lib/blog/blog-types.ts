/**
 * TypeScript types for the blog system
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  published: boolean;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  postCount: number;
}

export interface BlogMetadata {
  totalPosts: number;
  categories: BlogCategory[];
  tags: string[];
  recentPosts: BlogPost[];
}

export interface BlogPostFrontmatter {
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  published: boolean;
}

export interface BlogSearchParams {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
}

export interface BlogPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListResponse {
  posts: BlogPost[];
  pagination: BlogPaginationInfo;
  categories: BlogCategory[];
  tags: string[];
}

// Predefined blog categories
export const BLOG_CATEGORIES = {
  REPARACIONES: 'reparaciones',
  INSTALACION: 'instalacion',
  TIPOS_CRISTALES: 'tipos-cristales',
  SEGURIDAD: 'seguridad',
  NOTICIAS: 'noticias',
  CONSEJOS: 'consejos',
} as const;

export type BlogCategorySlug = typeof BLOG_CATEGORIES[keyof typeof BLOG_CATEGORIES];

// Category display names
export const CATEGORY_NAMES: Record<BlogCategorySlug, string> = {
  [BLOG_CATEGORIES.REPARACIONES]: 'Reparaciones',
  [BLOG_CATEGORIES.INSTALACION]: 'Instalación',
  [BLOG_CATEGORIES.TIPOS_CRISTALES]: 'Tipos de Cristales',
  [BLOG_CATEGORIES.SEGURIDAD]: 'Seguridad',
  [BLOG_CATEGORIES.NOTICIAS]: 'Noticias',
  [BLOG_CATEGORIES.CONSEJOS]: 'Consejos',
};

// Default values
export const DEFAULT_POSTS_PER_PAGE = 9;
export const DEFAULT_EXCERPT_LENGTH = 160;