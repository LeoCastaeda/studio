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
    <article className={`group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image with Overlay */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {post.featuredImage ? (
            <>
              <Image
                src={post.featuredImage}
                alt={`${post.title} - Blog GlassNou`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
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
            <Badge 
              variant="secondary" 
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white font-semibold px-3 py-1 shadow-lg border-0"
            >
              {post.category}
            </Badge>
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
          <h3 className="text-xl font-bold leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {post.author}
              </span>
            </div>

            {/* Read More Arrow */}
            <div className="flex items-center gap-1 text-red-600 dark:text-red-500 text-sm font-semibold group-hover:gap-2 transition-all duration-300">
              <span>Leer más</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
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
      </Link>
    </article>
  );
}