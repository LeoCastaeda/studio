import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BlogListContent } from './blog-list-content';
import { getBlogCategories } from '@/lib/blog/blog-utils';
import { InsurancePartners } from '@/components/insurance-partners';

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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/**
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/video/video_blog.mp4" type="video/mp4" />
      </video>
      */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero_Dev.jpeg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Blog de <span className="text-red-600">glass</span><span className="text-white">nou</span>
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Expertos en cristales de automoción en Barcelona. Descubre guías, consejos y las últimas novedades del sector.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium transition-colors hover:bg-red-700"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogListContent 
              searchParams={params}
              categories={categories}
            />
          </Suspense>
        </div>
      </section>

      {/* Insurance Logos */}
      <InsurancePartners />
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