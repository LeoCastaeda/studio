import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog/blog-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from './article-card';

interface ArticleNavigationProps {
  previousPost?: BlogPost | null;
  nextPost?: BlogPost | null;
  relatedPosts?: BlogPost[];
}

export function ArticleNavigation({ 
  previousPost, 
  nextPost, 
  relatedPosts = [] 
}: ArticleNavigationProps) {
  const hasNavigation = previousPost || nextPost;
  const hasRelated = relatedPosts.length > 0;

  if (!hasNavigation && !hasRelated) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Previous/Next Navigation */}
      {hasNavigation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Navegación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous Post */}
              <div className="flex justify-start">
                {previousPost ? (
                  <Link 
                    href={`/blog/${previousPost.slug}`}
                    className="group flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors w-full"
                  >
                    <div className="flex-shrink-0">
                      <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Artículo anterior</p>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {previousPost.title}
                      </h4>
                    </div>
                    {previousPost.featuredImage && (
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={previousPost.featuredImage}
                          alt={previousPost.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-lg border opacity-50 w-full">
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">No hay artículo anterior</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Post */}
              <div className="flex justify-end">
                {nextPost ? (
                  <Link 
                    href={`/blog/${nextPost.slug}`}
                    className="group flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors w-full text-right"
                  >
                    {nextPost.featuredImage && (
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 order-first md:order-last">
                        <Image
                          src={nextPost.featuredImage}
                          alt={nextPost.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Siguiente artículo</p>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {nextPost.title}
                      </h4>
                    </div>
                    <div className="flex-shrink-0 order-last md:order-first">
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-lg border opacity-50 w-full justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">No hay siguiente artículo</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Articles */}
      {hasRelated && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Artículos relacionados</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/blog">
                Ver todos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <div key={post.slug} className="h-full">
                  <ArticleCard post={post} className="h-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back to Blog Button */}
      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/blog">
            ← Volver al blog
          </Link>
        </Button>
      </div>
    </div>
  );
}