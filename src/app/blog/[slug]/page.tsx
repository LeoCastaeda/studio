import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, User, Tag, Folder } from 'lucide-react';

import { getBlogPost, getBlogPosts, getRelatedPosts, getAdjacentPosts } from '@/lib/blog/blog-utils';
import { CATEGORY_NAMES } from '@/lib/blog/blog-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShareButtons } from '@/components/blog/share-buttons';
import { ArticleNavigation } from '@/components/blog/article-navigation';
import { siteConfig, getAbsoluteUrl } from '@/lib/seo/site-config';
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema';
import { InsuranceLogos } from '@/components/blog/insurance-logos';
import { BalizaPromo } from '@/components/blog/baliza-promo';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { TableOfContents } from '@/components/blog/table-of-contents';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ await
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado | Glassnou',
      description: 'El artículo que buscas no existe o ha sido eliminado.',
    };
  }

  const title = post.seo.metaTitle || `${post.title} | Glassnou Blog`;
  const description = post.seo.metaDescription || post.excerpt;
  const keywords = post.seo.keywords || post.tags;

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params; // ✅ await
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Get related content
  const [relatedPosts, { previousPost, nextPost }] = await Promise.all([
    getRelatedPosts(post, 3),
    getAdjacentPosts(post),
  ]);

  const formattedDate = format(post.publishedAt, 'dd MMMM yyyy', { locale: es });
  const formattedUpdatedDate = post.updatedAt
    ? format(post.updatedAt, 'dd MMMM yyyy', { locale: es })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero compacto con video — solo cubre el encabezado */}
      <div className="relative h-[35svh] min-h-[220px] overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-center"
          aria-hidden="true"
        >
          <source src="/video/video_blog.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradiente inferior para transición suave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Breadcrumb Schema for SEO */}
      <div className="relative z-10">
        <BreadcrumbSchema
          items={[
            { name: 'Inicio', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: CATEGORY_NAMES[post.category as keyof typeof CATEGORY_NAMES] || post.category, url: `/blog/category/${post.category}` },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />
      </div>

      {/* Header with back button */}
      <div className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800/60 bg-background/90 dark:bg-background/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link href="/blog">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Volver al blog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de progreso de lectura */}
      <ReadingProgress />

      <article className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Article Header - Mejorado */}
        <header className="mb-12 space-y-6">
          {/* Category Badge */}
          <div className="flex items-center gap-3">
            <Link href={`/blog/category/${post.category}`}>
              <Badge className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-sm font-semibold transition-colors">
                <Folder className="h-3.5 w-3.5 mr-1.5" />
                {CATEGORY_NAMES[post.category as keyof typeof CATEGORY_NAMES] || post.category}
              </Badge>
            </Link>
            {formattedUpdatedDate && (
              <Badge variant="outline" className="px-3 py-1 text-xs">
                Actualizado: {formattedUpdatedDate}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={post.publishedAt.toISOString()}>{formattedDate}</time>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
                  >
                    <Tag className="h-3 w-3 mr-1.5" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800">
              <Image
                src={post.featuredImage}
                alt={`${post.title} - Blog Glassnou`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}
        </header>

        {/* Layout: TOC lateral + contenido */}
        <div className="flex gap-10 items-start">

          {/* Tabla de contenidos — solo en xl+ */}
          <TableOfContents />

          {/* Contenido del artículo */}
          <div className="flex-1 min-w-0 mb-12">
            <div className="bg-gray-900 text-white rounded-2xl shadow-xl ring-1 ring-gray-700 overflow-hidden">
              <div className="p-8 md:p-12">
                <div
                  className="article-content prose prose-lg prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-white prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-3
                  prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-3 prose-h3:text-white
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-5
                  prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-white prose-strong:font-bold
                  prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-gray-300 prose-li:my-1.5
                  prose-img:rounded-2xl prose-img:shadow-2xl prose-img:ring-1 prose-img:ring-gray-700 prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-red-950/30 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300
                  prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-gray-200"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>
          </div>
        </div>


        {/* Share Buttons */}
        <div className="mb-8">
          <ShareButtons url={`/blog/${post.slug}`} title={post.title} description={post.excerpt} />
        </div>

        {/* Article Footer */}
        <footer className="border-t pt-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                Publicado por <strong>{post.author}</strong> el {formattedDate}
              </p>
              {formattedUpdatedDate && <p>Última actualización: {formattedUpdatedDate}</p>}
            </div>

            <Button variant="outline" asChild>
              <Link href="/blog">Ver más artículos</Link>
            </Button>
          </div>
        </footer>

        {/* Article Navigation and Related Posts */}
        <ArticleNavigation previousPost={previousPost} nextPost={nextPost} relatedPosts={relatedPosts} />
      </article>

      {/* Baliza Promo Banner */}
      <BalizaPromo />

      {/* Insurance Logos */}
      <InsuranceLogos />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.featuredImage ? [getAbsoluteUrl(post.featuredImage)] : [],
            datePublished: post.publishedAt.toISOString(),
            dateModified: post.updatedAt?.toISOString() || post.publishedAt.toISOString(),
            author: { '@type': 'Person', name: post.author },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              logo: { '@type': 'ImageObject', url: getAbsoluteUrl('/images/logo.png') },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': getAbsoluteUrl(`/blog/${post.slug}`),
            },
            keywords: post.tags.join(', '),
            articleSection:
              CATEGORY_NAMES[post.category as keyof typeof CATEGORY_NAMES] || post.category,
          }),
        }}
      />
    </div>
  );
}
