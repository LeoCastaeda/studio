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
      title: 'Artículo no encontrado | GlassNou',
      description: 'El artículo que buscas no existe o ha sido eliminado.',
    };
  }

  const title = post.seo.metaTitle || `${post.title} | GlassNou Blog`;
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
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: CATEGORY_NAMES[post.category as keyof typeof CATEGORY_NAMES] || post.category, url: `/blog/category/${post.category}` },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      {/* Header with back button */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al blog
            </Link>
          </Button>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <Link href={`/blog/category/${post.category}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                <Folder className="h-3 w-3 mr-1" />
                {CATEGORY_NAMES[post.category as keyof typeof CATEGORY_NAMES] || post.category}
              </Badge>
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt.toISOString()}>{formattedDate}</time>
            </div>

            {formattedUpdatedDate && (
              <div className="flex items-center gap-1">
                <span className="text-xs">Actualizado:</span>
                <time dateTime={post.updatedAt?.toISOString()}>{formattedUpdatedDate}</time>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="hover:bg-accent transition-colors">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
              <Image
                src={post.featuredImage}
                alt={`Imagen destacada del artículo: ${post.title} - Blog GlassNou sobre cristales de automoción en Barcelona`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div
              className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

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
