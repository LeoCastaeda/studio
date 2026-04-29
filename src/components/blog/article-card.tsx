import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BlogPost } from '@/lib/blog/blog-types';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  post: BlogPost;
  className?: string;
}

export function ArticleCard({ post, className = '' }: ArticleCardProps) {
  const formattedDate = format(post.publishedAt, 'dd MMMM yyyy', { locale: es });
  
  // Calcular tiempo de lectura estimado (asumiendo 200 palabras por minuto)
  const wordCount = post.excerpt.split(' ').length * 5; // Estimación basada en el extracto
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className={`group relative bg-white text-slate-900 dark:bg-slate-950 dark:text-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 ${className}`}>
      {/* Featured Image with Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {post.featuredImage ? (
            <Link href={`/blog/${post.slug}`} className="absolute inset-0">
              <Image
                src={post.featuredImage}
                alt={`${post.title} - Blog GlassNou`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <span className="sr-only">Leer artículo {post.title}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center text-gray-400">
                <svg
                  className="mx-auto h-16 w-16 mb-3 opacity-50"
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
              </div>
            </div>
          )}
          
          {/* Category Badge - Positioned on Image */}
          <div className="absolute top-4 left-4 z-10">
            <Link href={`/blog/category/${post.category}`} className="inline-flex">
              <Badge
                variant="secondary"
                className="bg-red-600 text-white font-semibold px-3 py-1 shadow-lg border-0 hover:bg-red-700"
              >
                {post.category}
              </Badge>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt.toISOString()}>
                {formattedDate}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTime} min lectura</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/blog/${post.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">
            <h3 className="text-xl font-bold leading-tight line-clamp-2 text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-700 dark:text-slate-300 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {post.author}
              </span>
            </div>

            {/* Read More Link */}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-red-600 dark:text-red-500 text-sm font-semibold hover:text-red-700 dark:hover:text-red-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              <span>Leer más</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
    </article>
  );
}