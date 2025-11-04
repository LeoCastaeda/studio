'use server';

import { getPaginatedBlogPosts } from '@/lib/blog/blog-utils';

export async function getBlogPostsAction(params: {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  postsPerPage?: number;
}) {
  try {
    const result = await getPaginatedBlogPosts(params);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error in getBlogPostsAction:', error);
    return {
      success: false,
      error: 'Error al cargar los artículos',
    };
  }
}