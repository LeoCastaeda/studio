# Documento de Diseño - Sistema de Blog

## Visión General

El sistema de blog para GlassNou será implementado utilizando Next.js 13+ con App Router, aprovechando la generación estática (SSG) para optimizar el rendimiento y SEO. El contenido se gestionará mediante archivos Markdown con frontmatter para metadatos, proporcionando una solución simple pero potente.

## Arquitectura

### Estructura de Directorios
```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx                 # Lista de artículos
│   │   ├── [slug]/
│   │   │   └── page.tsx            # Artículo individual
│   │   ├── category/
│   │   │   └── [category]/
│   │   │       └── page.tsx        # Artículos por categoría
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx        # Artículos por tag
├── components/
│   ├── blog/
│   │   ├── article-card.tsx        # Tarjeta de artículo
│   │   ├── article-content.tsx     # Contenido del artículo
│   │   ├── blog-header.tsx         # Cabecera del blog
│   │   ├── category-filter.tsx     # Filtros por categoría
│   │   ├── search-bar.tsx          # Barra de búsqueda
│   │   ├── share-buttons.tsx       # Botones de compartir
│   │   └── pagination.tsx          # Paginación
├── lib/
│   ├── blog/
│   │   ├── markdown.ts             # Procesamiento de Markdown
│   │   ├── blog-utils.ts           # Utilidades del blog
│   │   └── blog-types.ts           # Tipos TypeScript
└── content/
    └── blog/
        ├── 2024-01-15-como-reparar-parabrisas.md
        ├── 2024-01-20-tipos-cristales-coche.md
        └── ...
```

### Tecnologías Utilizadas
- **Next.js 13+**: Framework principal con App Router
- **TypeScript**: Tipado estático
- **Markdown**: Formato de contenido con frontmatter
- **gray-matter**: Procesamiento de frontmatter
- **remark/rehype**: Procesamiento avanzado de Markdown
- **Tailwind CSS**: Estilos responsive
- **next/image**: Optimización de imágenes

## Componentes y Interfaces

### 1. Tipos de Datos

```typescript
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  published: boolean;
}

interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  postCount: number;
}

interface BlogMetadata {
  totalPosts: number;
  categories: BlogCategory[];
  tags: string[];
  recentPosts: BlogPost[];
}
```

### 2. Componentes Principales

#### BlogListPage (`/blog/page.tsx`)
- Lista paginada de artículos
- Filtros por categoría y búsqueda
- Metadata SEO optimizada
- Generación estática con ISR

#### BlogPostPage (`/blog/[slug]/page.tsx`)
- Contenido completo del artículo
- Botones de compartir social
- Artículos relacionados
- Schema.org markup
- Generación estática

#### ArticleCard Component
- Vista previa del artículo
- Imagen destacada optimizada
- Metadatos (fecha, categoría, tags)
- Enlace al artículo completo

### 3. Gestión de Contenido

#### Estructura de Archivo Markdown
```markdown
---
title: "Cómo Reparar un Parabrisas Astillado"
excerpt: "Guía completa para reparar pequeñas astillas en el parabrisas antes de que se conviertan en grietas mayores."
publishedAt: "2024-01-15"
author: "Equipo GlassNou"
category: "reparaciones"
tags: ["parabrisas", "reparación", "mantenimiento"]
featuredImage: "/images/blog/reparacion-parabrisas.jpg"
seo:
  metaTitle: "Reparación de Parabrisas Astillado - Guía Completa | GlassNou"
  metaDescription: "Aprende a reparar astillas en el parabrisas con nuestra guía paso a paso. Evita costosos reemplazos con técnicas profesionales."
  keywords: ["reparación parabrisas", "astillas parabrisas", "mantenimiento cristales"]
published: true
---

# Contenido del artículo en Markdown...
```

## Modelos de Datos

### Categorías Predefinidas
- **reparaciones**: Guías de reparación y mantenimiento
- **instalacion**: Procesos de instalación de cristales
- **tipos-cristales**: Información sobre diferentes tipos de cristales
- **seguridad**: Aspectos de seguridad y normativas
- **noticias**: Noticias del sector y empresa
- **consejos**: Tips y recomendaciones para propietarios

### Estructura de URLs
- `/blog` - Lista principal de artículos
- `/blog/[slug]` - Artículo individual
- `/blog/category/[category]` - Artículos por categoría
- `/blog/tag/[tag]` - Artículos por etiqueta

## Manejo de Errores

### Estrategias de Error
1. **404 para artículos no encontrados**: Página personalizada con sugerencias
2. **Validación de frontmatter**: Verificación de campos requeridos
3. **Fallback para imágenes**: Imagen placeholder si falla la carga
4. **Manejo de Markdown inválido**: Logs de error y contenido de respaldo

### Logging
- Errores de procesamiento de Markdown
- Artículos con metadatos faltantes
- Problemas de generación estática

## Estrategia de Testing

### Pruebas Unitarias
- Utilidades de procesamiento de Markdown
- Funciones de filtrado y búsqueda
- Generación de metadatos SEO

### Pruebas de Integración
- Renderizado de componentes del blog
- Navegación entre páginas
- Funcionalidad de búsqueda y filtros

### Pruebas E2E
- Flujo completo de lectura de artículos
- Compartir en redes sociales
- Navegación responsive

## Optimizaciones SEO

### Metadatos Dinámicos
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  return {
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    keywords: post.seo.keywords || post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    }
  };
}
```

### Schema.org Markup
- Article schema para cada post
- BreadcrumbList para navegación
- Organization schema para autor

### Sitemap Dinámico
- Generación automática de sitemap.xml
- Inclusión de todas las URLs del blog
- Frecuencias de actualización optimizadas

## Rendimiento

### Optimizaciones
- **Static Generation**: Todas las páginas generadas en build time
- **Image Optimization**: next/image con lazy loading
- **Code Splitting**: Componentes del blog cargados bajo demanda
- **ISR (Incremental Static Regeneration)**: Actualización automática de contenido

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## Consideraciones de Accesibilidad

### Implementaciones
- Navegación por teclado completa
- Etiquetas ARIA apropiadas
- Contraste de colores WCAG AA
- Texto alternativo para imágenes
- Estructura semántica HTML5

### Testing de Accesibilidad
- Validación con herramientas automatizadas
- Pruebas con lectores de pantalla
- Navegación solo por teclado