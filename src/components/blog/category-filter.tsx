'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { BlogCategory, CATEGORY_NAMES } from '@/lib/blog/blog-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: BlogCategory[];
  className?: string;
  onCategoryChange?: (category: string | null) => void;
  showAllOption?: boolean;
  variant?: 'default' | 'compact';
}

export function CategoryFilter({
  categories,
  className = '',
  onCategoryChange,
  showAllOption = true,
  variant = 'default',
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const handleCategoryClick = (categorySlug: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(categorySlug);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      
      if (categorySlug) {
        params.set('category', categorySlug);
        params.delete('page'); // Reset to first page when filtering
      } else {
        params.delete('category');
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.push(`/blog${newUrl}`, { scroll: false });
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {showAllOption && (
          <Badge
            variant={!selectedCategory ? 'default' : 'outline'}
            className="cursor-pointer transition-colors hover:bg-primary/80"
            onClick={() => handleCategoryClick(null)}
          >
            Todas ({categories.reduce((sum, cat) => sum + cat.postCount, 0)})
          </Badge>
        )}
        
        {categories.map((category) => (
          <Badge
            key={category.slug}
            variant={selectedCategory === category.slug ? 'default' : 'outline'}
            className="cursor-pointer transition-colors hover:bg-primary/80"
            onClick={() => handleCategoryClick(category.slug)}
          >
            {CATEGORY_NAMES[category.slug as keyof typeof CATEGORY_NAMES] || category.name} ({category.postCount})
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">Categorías</h3>
      
      <div className="space-y-2">
        {showAllOption && (
          <Button
            variant={!selectedCategory ? 'default' : 'ghost'}
            className="w-full justify-between h-auto py-3 px-4"
            onClick={() => handleCategoryClick(null)}
          >
            <span>Todas las categorías</span>
            <Badge variant="secondary" className="ml-2">
              {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
            </Badge>
          </Button>
        )}
        
        {categories.map((category) => {
          const displayName = CATEGORY_NAMES[category.slug as keyof typeof CATEGORY_NAMES] || category.name;
          const isSelected = selectedCategory === category.slug;
          
          return (
            <Button
              key={category.slug}
              variant={isSelected ? 'default' : 'ghost'}
              className="w-full justify-between h-auto py-3 px-4"
              onClick={() => handleCategoryClick(category.slug)}
              aria-pressed={isSelected}
            >
              <span className="text-left">
                {displayName}
                {category.description && (
                  <span className="block text-xs text-muted-foreground mt-1 font-normal">
                    {category.description}
                  </span>
                )}
              </span>
              <Badge 
                variant={isSelected ? 'secondary' : 'outline'} 
                className="ml-2 shrink-0"
              >
                {category.postCount}
              </Badge>
            </Button>
          );
        })}
      </div>
      
      {/* Clear filter button when a category is selected */}
      {selectedCategory && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className="w-full"
        >
          Limpiar filtro
        </Button>
      )}
    </div>
  );
}

// Mobile-friendly dropdown version
export function CategoryFilterDropdown({
  categories,
  className = '',
  onCategoryChange,
  showAllOption = true,
}: Omit<CategoryFilterProps, 'variant'>) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  
  const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);
  const selectedDisplayName = selectedCategoryData 
    ? CATEGORY_NAMES[selectedCategoryData.slug as keyof typeof CATEGORY_NAMES] || selectedCategoryData.name
    : 'Todas las categorías';

  return (
    <div className={cn('relative', className)}>
      <select
        value={selectedCategory || ''}
        onChange={(e) => {
          const value = e.target.value || null;
          if (onCategoryChange) {
            onCategoryChange(value);
          } else {
            const params = new URLSearchParams(searchParams.toString());
            
            if (value) {
              params.set('category', value);
              params.delete('page');
            } else {
              params.delete('category');
            }
            
            const newUrl = params.toString() ? `?${params.toString()}` : '';
            window.location.href = `/blog${newUrl}`;
          }
        }}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Filtrar por categoría"
      >
        {showAllOption && (
          <option value="">
            Todas las categorías ({categories.reduce((sum, cat) => sum + cat.postCount, 0)})
          </option>
        )}
        
        {categories.map((category) => {
          const displayName = CATEGORY_NAMES[category.slug as keyof typeof CATEGORY_NAMES] || category.name;
          return (
            <option key={category.slug} value={category.slug}>
              {displayName} ({category.postCount})
            </option>
          );
        })}
      </select>
    </div>
  );
}