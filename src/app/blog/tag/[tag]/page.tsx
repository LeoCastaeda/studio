import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostsByTag, getBlogTags } from '@/lib/blog/blog-utils';
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

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Generate static params for all tags
export async function generateStaticParams() {
  const tags = await getBlogTags();
  // Guardamos el segmento URL-encoded para soportar tags con espacios/acentos
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;               // ✅ Next 15: await
  const decodedTag = decodeURIComponent(tag);

  const allTags = await getBlogTags();
  if (!allTags.includes(decodedTag)) {
    return { title: 'Tag no encontrado' };
  }

  const posts = await getBlogPostsByTag(decodedTag);

  return {
    title: `${decodedTag} - Blog GlassNou`,
    description: `Descubre todos nuestros artículos etiquetados con "${decodedTag}". ${posts.length} artículos disponibles sobre cristales de automoción, reparaciones y mantenimiento.`,
    keywords: [decodedTag, 'cristales automoción', 'GlassNou', 'blog'],
    openGraph: {
      title: `${decodedTag} - Blog GlassNou`,
      description: `Artículos etiquetados con "${decodedTag}" en el blog de GlassNou`,
      type: 'website',
      url: `/blog/tag/${tag}`,
    },
    twitter: {
      card: 'summary',
      title: `${decodedTag} - Blog GlassNou`,
      description: `Artículos etiquetados con "${decodedTag}" en el blog de GlassNou`,
    },
    alternates: {
      canonical: `/blog/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;               // ✅ Next 15: await
  const { page: pageStr } = await searchParams; // ✅ Next 15: await
  const decodedTag = decodeURIComponent(tag);

  // Validate tag exists
  const allTags = await getBlogTags();
  if (!allTags.includes(decodedTag)) {
    notFound();
  }

  const postsPerPage = 9;

  // Get all posts for this tag
  const allPosts = await getBlogPostsByTag(decodedTag);

  // Calculate pagination
  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  const pageNum = Number.isFinite(Number(pageStr)) ? parseInt(pageStr as string, 10) : 1;
  const currentPage = Math.max(1, Math.min(pageNum, totalPages));
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

  // Related tags (de los mismos posts)
  const relatedTags = new Set<string>();
  allPosts.forEach(post => {
    post.tags.forEach(postTag => {
      if (postTag !== decodedTag) relatedTags.add(postTag);
    });
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: `#${decodedTag}`, url: `/blog/tag/${tag}` },
        ]}
      />

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>#{decodedTag}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">#{decodedTag}</h1>
          <Badge variant="secondary" className="text-sm">
            {totalPosts} {totalPosts === 1 ? 'artículo' : 'artículos'}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Explora todos nuestros artículos etiquetados con "{decodedTag}". 
          Encuentra contenido específico y especializado sobre este tema.
        </p>
      </div>

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">No hay artículos disponibles</h2>
            <p className="text-muted-foreground mb-6">
              Aún no hay artículos publicados con esta etiqueta. ¡Vuelve pronto para ver nuevo contenido!
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Ver todos los artículos
            </Link>
          </div>
        </div>
      ) : (
        <>
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
                  // Este callback corre en el cliente dentro de Pagination
                  const url = newPage === 1 
                    ? `/blog/tag/${tag}` 
                    : `/blog/tag/${tag}?page=${newPage}`;
                  window.location.href = url;
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Related Tags */}
      {relatedTags.size > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">Tags relacionados</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(relatedTags)
              .sort()
              .slice(0, 10)
              .map((relatedTag) => (
                <Link
                  key={relatedTag}
                  href={`/blog/tag/${encodeURIComponent(relatedTag)}`}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  #{relatedTag}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* All Tags Link */}
      <div className="mt-8 text-center">
        <Link 
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver al blog principal
        </Link>
      </div>
    </div>
  );
}
