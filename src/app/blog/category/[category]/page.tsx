import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostsByCategory, getBlogCategories } from '@/lib/blog/blog-utils';
import { CATEGORY_NAMES, BlogCategorySlug } from '@/lib/blog/blog-types';
import { ArticleCard } from '@/components/blog/article-card';
import { Pagination } from '@/components/blog/pagination';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params; // ✅ Next 15: await
  if (!(category in CATEGORY_NAMES)) {
    return { title: 'Categoría no encontrada' };
  }

  const categoryName = CATEGORY_NAMES[category as BlogCategorySlug];
  const posts = await getBlogPostsByCategory(category);

  return {
    title: `${categoryName} - Blog GlassNou`,
    description: `Descubre todos nuestros artículos sobre ${categoryName.toLowerCase()}. ${posts.length} artículos disponibles sobre cristales de automoción, reparaciones y mantenimiento.`,
    keywords: [categoryName, 'cristales automoción', 'GlassNou', 'blog'],
    openGraph: {
      title: `${categoryName} - Blog GlassNou`,
      description: `Artículos sobre ${categoryName.toLowerCase()} en el blog de GlassNou`,
      type: 'website',
      url: `/blog/category/${category}`,
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} - Blog GlassNou`,
      description: `Artículos sobre ${categoryName.toLowerCase()} en el blog de GlassNou`,
    },
    alternates: {
      canonical: `/blog/category/${category}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;              // ✅ Next 15: await
  const { page: pageStr } = await searchParams;   // ✅ Next 15: await
  const page = Number.isFinite(Number(pageStr)) ? parseInt(pageStr as string, 10) : 1;

  // Validate category exists (por slug, no por nombre)
  if (!(category in CATEGORY_NAMES)) {
    notFound();
  }

  const categoryName = CATEGORY_NAMES[category as BlogCategorySlug];
  const postsPerPage = 9;

  // Get all posts for this category
  const allPosts = await getBlogPostsByCategory(category);

  // Empty state
  const totalPosts = allPosts.length;
  if (totalPosts === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/blog">Blog</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <Badge variant="secondary" className="text-sm">0 artículos</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Aún no hay artículos publicados en esta categoría. ¡Vuelve pronto para ver nuevo contenido!
          </p>
        </div>

        <Link 
          href="/blog"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Ver todos los artículos
        </Link>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // Get posts for current page
  const posts = allPosts.slice(startIndex, endIndex);

  const pagination = {
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: categoryName, url: `/blog/category/${category}` },
        ]}
      />

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Inicio</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/blog">Blog</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <Badge variant="secondary" className="text-sm">
            {totalPosts} {totalPosts === 1 ? 'artículo' : 'artículos'}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Explora todos nuestros artículos sobre {categoryName.toLowerCase()}. 
          Encuentra información útil, consejos y guías especializadas.
        </p>
      </div>

      {/* Results Summary */}
      <div className="mb-6 text-sm text-muted-foreground">
        Mostrando {startIndex + 1} - {Math.min(endIndex, totalPosts)} de {totalPosts} artículos
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination 
            pagination={pagination}
            onPageChange={(newPage) => {
              // Este callback corre en el cliente dentro del componente Pagination
              const url = newPage === 1 
                ? `/blog/category/${category}` 
                : `/blog/category/${category}?page=${newPage}`;
              window.location.href = url;
            }}
          />
        </div>
      )}

      {/* Related Categories */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4">Otras categorías</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_NAMES)
            .filter(([slug]) => slug !== category)
            .map(([slug, name]) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
