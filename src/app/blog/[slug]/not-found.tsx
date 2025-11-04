import Link from 'next/link';
import { ArrowLeft, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </Button>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileX className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Artículo no encontrado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                El artículo que buscas no existe o ha sido eliminado.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href="/blog">
                    Ver todos los artículos
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    Ir al inicio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}