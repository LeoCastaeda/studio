# Mejoras de SEO Implementadas

## 📋 Resumen

Se han implementado mejoras significativas en el SEO de la aplicación GlassNou, incluyendo configuración centralizada, sitemaps dinámicos, Schema.org mejorado y mejor gestión de URLs.

## 🎯 Cambios Implementados

### 1. Configuración Centralizada de SEO

**Archivo:** `src/lib/seo/site-config.ts`

- Configuración centralizada del sitio
- URL dinámica basada en variable de entorno
- Información de contacto y negocio
- Función helper `getAbsoluteUrl()` para URLs absolutas

**Variables de Entorno:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:9002
```

En producción, cambiar a:
```env
NEXT_PUBLIC_SITE_URL=https://glassnoubarcelona.com
```

### 2. Sitemap Dinámico

**Archivo:** `src/app/sitemap.ts`

Genera automáticamente un sitemap que incluye:
- Páginas estáticas (home, products, quote, contact, etc.)
- Todos los artículos del blog
- Páginas de categorías del blog
- Páginas de tags del blog

El sitemap se actualiza automáticamente cuando se añaden nuevos posts.

### 3. Robots.txt Dinámico

**Archivo:** `src/app/robots.ts`

- Configuración dinámica de robots.txt
- Reglas específicas para diferentes user agents
- Referencia automática al sitemap

### 4. Schema.org Mejorado

#### LocalBusiness Schema (Layout Principal)
- Usa configuración centralizada
- URLs dinámicas basadas en entorno
- Información completa del negocio

#### Article Schema (Posts del Blog)
- URLs absolutas
- Metadata completa del artículo
- Publisher y author information

#### Nuevos Componentes de Schema:

**BreadcrumbSchema** (`src/components/seo/breadcrumb-schema.tsx`)
- Implementado en páginas de blog
- Mejora la navegación en resultados de búsqueda

**WebsiteSchema** (`src/components/seo/website-schema.tsx`)
- Schema para el sitio web completo
- Incluye SearchAction para búsqueda

**OrganizationSchema** (`src/components/seo/organization-schema.tsx`)
- Información de la organización
- Datos de contacto estructurados

### 5. Utilidades de Metadata

**Archivo:** `src/lib/seo/metadata.ts`

Funciones helper para generar metadata consistente:
- `generateMetadata()` - Metadata general para páginas
- `generateFAQSchema()` - Schema para páginas de FAQ
- `generateServiceSchema()` - Schema para páginas de servicios

## 🚀 Cómo Usar

### Para Desarrollo Local

1. El archivo `.env.local` ya está configurado con `http://localhost:9002`
2. No requiere cambios adicionales

### Para Producción

1. Actualizar `.env.local` o configurar variable de entorno en el hosting:
   ```env
   NEXT_PUBLIC_SITE_URL=https://glassnoubarcelona.com
   ```

2. Verificar que el dominio sea correcto en:
   - Vercel: Settings → Environment Variables
   - Firebase Hosting: Configurar en `apphosting.yaml`

## 📊 Beneficios SEO

### Mejoras Implementadas

✅ **URLs Dinámicas** - No más URLs hardcodeadas a localhost
✅ **Sitemap Completo** - Incluye todas las páginas y posts del blog
✅ **Schema.org Completo** - LocalBusiness, Article, Breadcrumb, Organization
✅ **Robots.txt Optimizado** - Reglas específicas por user agent
✅ **Metadata Consistente** - Configuración centralizada
✅ **Open Graph Completo** - Para redes sociales
✅ **Twitter Cards** - Metadata específica para Twitter
✅ **Canonical URLs** - En todas las páginas

### Impacto Esperado

- 🔍 **Mejor indexación** - Google puede descubrir todas las páginas
- 📈 **Rich Snippets** - Resultados enriquecidos en búsquedas
- 🎯 **Local SEO** - Optimizado para búsquedas locales en Barcelona
- 📱 **Social Sharing** - Mejores previews en redes sociales
- 🗺️ **Breadcrumbs** - Navegación mejorada en resultados

## 🔍 Verificación

### Herramientas Recomendadas

1. **Google Search Console**
   - Enviar sitemap: `https://tudominio.com/sitemap.xml`
   - Verificar indexación
   - Revisar errores de rastreo

2. **Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Verificar Schema.org

3. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Verificar Open Graph

4. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Verificar Twitter Cards

### Comandos de Verificación

```bash
# Verificar que el sitemap se genera correctamente
curl http://localhost:9002/sitemap.xml

# Verificar robots.txt
curl http://localhost:9002/robots.txt

# Build de producción
npm run build

# Verificar que no hay errores
npm run lint
```

## 📝 Próximos Pasos Recomendados

### Prioridad Alta
- [ ] Configurar Google Search Console
- [ ] Enviar sitemap a Google
- [ ] Verificar propiedad del sitio
- [ ] Configurar Google Analytics 4

### Prioridad Media
- [ ] Añadir hreflang si se planean múltiples idiomas
- [ ] Implementar FAQSchema en página de FAQ
- [ ] Añadir ServiceSchema en página de productos
- [ ] Optimizar imágenes con alt text descriptivo
- [ ] Añadir más contenido long-tail en blog

### Prioridad Baja
- [ ] Implementar AMP para artículos del blog
- [ ] Añadir video schema si se añaden videos
- [ ] Implementar review schema para testimonios
- [ ] Configurar Google My Business

## 🐛 Troubleshooting

### El sitemap no se genera

1. Verificar que `src/app/sitemap.ts` existe
2. Verificar que hay posts en `content/blog/`
3. Rebuild: `npm run build`

### URLs apuntan a localhost en producción

1. Verificar variable de entorno: `echo $NEXT_PUBLIC_SITE_URL`
2. Actualizar en el hosting
3. Rebuild y redeploy

### Schema.org no valida

1. Usar Rich Results Test de Google
2. Verificar que las URLs son absolutas
3. Verificar formato de fechas (ISO 8601)

## 📚 Referencias

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
