import { Suspense } from 'react';
import { Metadata } from 'next';
import { BlogListContent } from './blog-list-content';
import { getBlogCategories } from '@/lib/blog/blog-utils';
import { InsuranceLogos } from '@/components/blog/insurance-logos';
import { BalizaPromo } from '@/components/blog/baliza-promo';

export const metadata: Metadata = {
  title: 'Blog - Glassnou | Artículos sobre Cristales de Automoción',
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
    title: 'Blog - Glassnou | Artículos sobre Cristales de Automoción',
    description: 'Descubre artículos informativos sobre reparación, instalación y mantenimiento de cristales de automoción.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Glassnou | Artículos sobre Cristales de Automoción',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section - Mejorado */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-900 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-blue-50/50 dark:from-red-950/20 dark:to-blue-950/20" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Artículos actualizados con IA
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 dark:from-white dark:via-red-500 dark:to-white">
                Blog de Glassnou
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Expertos en cristales de automoción en Barcelona. Descubre guías, consejos y las últimas novedades del sector.
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              {categories.slice(0, 5).map((category) => (
                <span
                  key={category.slug}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-current text-white dark:text-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogListContent 
              searchParams={params}
              categories={categories}
            />
          </Suspense>
        </div>
      </section>

      {/* Baliza Promo Banner */}
      <BalizaPromo />

      {/* Insurance Logos */}
      <InsuranceLogos />
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