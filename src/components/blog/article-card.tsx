import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BlogPost } from '@/lib/blog/blog-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface ArticleCardProps {
  post: BlogPost;
  className?: string;
}

export function ArticleCard({ post, className = '' }: ArticleCardProps) {
  const formattedDate = format(post.publishedAt, 'dd MMMM yyyy', { locale: es });

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={`Imagen del artículo: ${post.title} - Blog GlassNou sobre cristales de automoción`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <svg
                  className="mx-auto h-12 w-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">Sin imagen</span>
              </div>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          {/* Category Badge */}
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Excerpt */}
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-0">
          {/* Author and Date */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="font-medium">{post.author}</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {formattedDate}
            </time>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 max-w-[50%]">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5 h-auto"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 h-auto"
                >
                  +{post.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}