'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  placeholder = 'Buscar artículos...',
  className = '',
  onSearch,
  debounceMs = 300,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      setIsSearching(false);
      
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Update URL with search parameter
        const params = new URLSearchParams(searchParams.toString());
        
        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
          params.delete('page'); // Reset to first page when searching
        } else {
          params.delete('search');
        }
        
        const newUrl = params.toString() ? `?${params.toString()}` : '';
        router.push(`/blog${newUrl}`, { scroll: false });
      }
    }, debounceMs),
    [onSearch, router, searchParams, debounceMs]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsSearching(true);
    debouncedSearch(newQuery);
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    setIsSearching(false);
    
    if (onSearch) {
      onSearch('');
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.push(`/blog${newUrl}`, { scroll: false });
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query);
  };

  // Update local state when URL search param changes
  useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        {/* Search Icon */}
        <Search 
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
          aria-hidden="true"
        />
        
        {/* Search Input */}
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10"
          aria-label="Buscar artículos del blog"
          autoComplete="off"
        />
        
        {/* Clear Button */}
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
      </div>
      
      {/* Screen reader only submit button */}
      <button type="submit" className="sr-only">
        Buscar
      </button>
    </form>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}