'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogPost, BlogCategory, BlogPaginationInfo } from '@/lib/blog/blog-types';
import { getBlogPostsAction } from './actions';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/blog/search-bar';
import { CategoryFilter, CategoryFilterDropdown } from '@/components/blog/category-filter';
import { Pagination } from '@/components/blog/pagination';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogListContentProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
  categories: BlogCategory[];
}

type ViewMode = 'grid' | 'list';

export function BlogListContent({ searchParams, categories }: BlogListContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<BlogPaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse search params
  const currentPage = parseInt(searchParams.page || '1', 10);
  const selectedCategory = searchParams.category || null;
  const selectedTag = searchParams.tag || null;
  const searchQuery = searchParams.search || '';

  // Load posts when search params change
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getBlogPostsAction({
          page: currentPage,
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          search: searchQuery || undefined,
        });
        
        if (result.success && result.data) {
          setPosts(result.data.posts);
          setPagination(result.data.pagination);
        } else {
          setError(result.error || 'Error al cargar los artículos');
        }
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Error al cargar los artículos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategory, selectedTag, searchQuery]);

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Handle mobile filter toggle
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (loading) {
    return <BlogListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Error al cargar artículos</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={toggleMobileFilters}
          className="w-full justify-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showMobileFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <aside className={cn(
          'lg:w-1/4 space-y-6',
          showMobileFilters ? 'block' : 'hidden lg:block'
        )}>
          {/* Desktop Category Filter */}
          <div className="hidden lg:block">
            <CategoryFilter categories={categories} />
          </div>
          
          {/* Mobile Category Filter */}
          <div className="lg:hidden space-y-4">
            <h3 className="text-lg font-semibold">Filtrar por categoría</h3>
            <CategoryFilterDropdown categories={categories} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4 space-y-6">
          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-auto sm:flex-1 max-w-md">
              <SearchBar placeholder="Buscar artículos..." />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="h-8 w-8 p-0"
                aria-label="Vista en cuadrícula"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="h-8 w-8 p-0"
                aria-label="Vista en lista"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {pagination && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
              <div>
                {pagination.totalPosts === 0 ? (
                  'No se encontraron artículos'
                ) : (
                  <>
                    Mostrando {((pagination.currentPage - 1) * pagination.postsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.postsPerPage, pagination.totalPosts)} de {pagination.totalPosts} artículos
                  </>
                )}
              </div>
              
              {(selectedCategory || selectedTag || searchQuery) && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      Categoría: {categories.find(c => c.slug === selectedCategory)?.name}
                    </span>
                  )}
                  {selectedTag && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      Tag: {selectedTag}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      Búsqueda: "{searchQuery}"
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Articles Grid/List */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">No se encontraron artículos</h2>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory || selectedTag
                    ? 'Intenta ajustar los filtros o términos de búsqueda.'
                    : 'Aún no hay artículos publicados. ¡Vuelve pronto para ver nuevo contenido!'
                  }
                </p>
                {(searchQuery || selectedCategory || selectedTag) && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/blog')}
                  >
                    Ver todos los artículos
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={cn(
              'gap-6',
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 xl:grid-cols-3' 
                : 'space-y-6'
            )}>
              {posts.map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  className={viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-start' : ''}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination pagination={pagination} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Loading skeleton component
function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Mobile Filter Toggle Skeleton */}
      <div className="lg:hidden">
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:w-1/4">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-24"></div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="lg:w-3/4 space-y-6">
          {/* Search and Controls Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="h-10 bg-muted rounded flex-1 max-w-md"></div>
            <div className="h-10 bg-muted rounded w-20"></div>
          </div>
          
          {/* Results Summary Skeleton */}
          <div className="h-4 bg-muted rounded w-64"></div>
          
          {/* Articles Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Skeleton */}
          <div className="flex justify-center pt-8">
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-9 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}