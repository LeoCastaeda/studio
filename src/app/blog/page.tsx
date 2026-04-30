import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BlogListContent } from './blog-list-content';
import { getBlogCategories } from '@/lib/blog/blog-utils';
import { InsurancePartners } from '@/components/insurance-partners';

export const metadata: Metadata = {
  title: 'Blog - Glassnou | Artículos sobre Cristales de Automoción',
  description: 'Descubre artículos informativos sobre reparación, instalación y mantenimiento de cristales de automoción. Consejos de expertos y las últimas novedades del sector.',
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
  alternates: { canonical: '/blog' },
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
  const params = await searchParams;
  const categories = await getBlogCategories();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero con video */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
        >
          <source src="/video/video_blog.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" aria-hidden="true" />

        <div className="relative z-10 container mx-auto py-20 px-4 pb-28 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Blog de <span className="text-red-500">glass</span>nou
          </h1>
          <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow mb-8">
            Expertos en cristales de automoción en Barcelona. Guías, consejos y novedades del sector.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos */}
      <section className="py-12 md:py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogListContent
              searchParams={params}
              categories={categories}
            />
          </Suspense>
        </div>
      </section>

      {/* Seguros */}
      <div className="border-t border-gray-800">
        <InsurancePartners />
      </div>
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/4 space-y-3">
        <div className="h-5 bg-gray-800 rounded w-24 animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
      <div className="lg:w-3/4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video bg-gray-800 rounded-2xl animate-pulse" />
            <div className="h-4 bg-gray-800 rounded w-20 animate-pulse" />
            <div className="h-6 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}