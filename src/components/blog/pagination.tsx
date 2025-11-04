'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { BlogPaginationInfo } from '@/lib/blog/blog-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination: BlogPaginationInfo;
  className?: string;
  onPageChange?: (page: number) => void;
  showInfo?: boolean;
  maxVisiblePages?: number;
}

export function Pagination({
  pagination,
  className = '',
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { currentPage, totalPages, totalPosts, postsPerPage, hasNextPage, hasPreviousPage } = pagination;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    if (onPageChange) {
      onPageChange(page);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.push(`/blog${newUrl}`, { scroll: false });
    }
  };

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);
      
      // Adjust range if we're near the beginning or end
      if (currentPage <= halfVisible + 1) {
        endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always show last page (if not already included)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  
  // Calculate the range of posts being shown
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  if (totalPages <= 1) {
    return showInfo ? (
      <div className={cn('text-sm text-muted-foreground text-center', className)}>
        Mostrando {totalPosts} {totalPosts === 1 ? 'artículo' : 'artículos'}
      </div>
    ) : null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Pagination Info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {startPost} - {endPost} de {totalPosts} artículos
        </div>
      )}
      
      {/* Pagination Controls */}
      <nav className="flex items-center justify-center space-x-1" aria-label="Paginación">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          aria-label="Página anterior"
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }
          
          const isCurrentPage = page === currentPage;
          
          return (
            <Button
              key={page}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
              aria-label={`Ir a la página ${page}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              className="h-9 w-9 p-0"
            >
              {page}
            </Button>
          );
        })}
        
        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Página siguiente"
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
      
      {/* Mobile-friendly page input */}
      <div className="flex items-center justify-center space-x-2 md:hidden">
        <span className="text-sm text-muted-foreground">Página</span>
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(parseInt(e.target.value))}
          className="rounded border border-input bg-background px-2 py-1 text-sm"
          aria-label="Seleccionar página"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">de {totalPages}</span>
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function PaginationCompact({
  pagination,
  className = '',
  onPageChange,
}: Omit<PaginationProps, 'showInfo' | 'maxVisiblePages'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    if (onPageChange) {
      onPageChange(page);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.push(`/blog${newUrl}`, { scroll: false });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="flex items-center space-x-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Anterior</span>
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center space-x-1"
      >
        <span>Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}