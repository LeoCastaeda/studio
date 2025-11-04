import { Suspense } from 'react';
import { Metadata } from 'next';
import { BlogListContent } from './blog-list-content';
import { getBlogCategories } from '@/lib/blog/blog-utils';

export const metadata: Metadata = {
  title: 'Blog - GlassNou | Artículos sobre Cristales de Automoción',
  description: 'Descubre artículos informativos sobre reparación, instalación y mantenimiento de cristales de automoción. Consejos de expertos y las últimas noticias del sector.',
  keywords: [
    'blog cristales automoción',
    'reparación parabrisas',
    'instalación cristales coche',
    'mantenimiento cristales',
    'consejos automoción',
    'noticias sector cristales'
  ],
  openGraph: {
    title: 'Blog - GlassNou | Artículos sobre Cristales de Automoción',
    description: 'Descubre artículos informativos sobre reparación, instalación y mantenimiento de cristales de automoción.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - GlassNou | Artículos sobre Cristales de Automoción',
    description: 'Descubre artículos informativos sobre reparación, instalación y mantenimiento de cristales de automoción.',
  },
  alternates: {
    canonical: '/blog',
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Await the searchParams promise
  const params = await searchParams;
  
  // Get categories for the filter component
  const categories = await getBlogCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Blog de <span className="text-red-600">Glass</span>Nou
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Descubre artículos informativos sobre cristales de automoción, 
              reparaciones, mantenimiento y las últimas noticias del sector.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.slice(0, 4).map((category) => (
                <span
                  key={category.slug}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogListContent 
              searchParams={params}
              categories={categories}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

// Loading skeleton component
function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search and Filter Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
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
        
        <div className="lg:w-3/4 space-y-6">
          {/* Search Bar Skeleton */}
          <div className="h-10 bg-muted rounded"></div>
          
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
        </div>
      </div>
    </div>
  );
}