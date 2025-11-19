# Promoción Especial: Baliza de Emergencia

## 📋 Detalles de la Promoción

### Oferta
- **Producto:** Baliza de Emergencia Homologada OSRAM
- **Precio Promocional:** 25€
- **Precio Normal:** 54,45€
- **Ahorro:** 29,45€ (54% de descuento)

### Condiciones
- ✅ Obligatoria en carretera
- ✅ Homologada DGT 2026
- ✅ Incluye batería y soporte magnético
- ✅ Solo al cambiar o reparar parabrisas con GlassNou

## 🎨 Componentes Creados

### 1. Banner Principal (Grande)
**Archivo:** `src/components/promo-banner.tsx`

**Características:**
- Diseño completo con imagen
- Fondo rojo degradado
- Precio destacado
- Lista de beneficios
- Dos botones CTA
- Badge de ahorro
- Responsive

**Uso:**
```tsx
import { PromoBanner } from '@/components/promo-banner';

// En tu página
<PromoBanner />
```

**Ubicación actual:** Página principal (home) después del hero

### 2. Banner Compacto
**Archivo:** `src/components/promo-banner-compact.tsx`

**Características:**
- Diseño horizontal compacto
- Ideal para header o entre secciones
- Un solo botón CTA
- Responsive

**Uso:**
```tsx
import { PromoBannerCompact } from '@/components/promo-banner-compact';

// En tu página
<PromoBannerCompact />
```

**Sugerencias de ubicación:**
- Página de productos
- Página de cotización
- Página de contacto
- Como sticky banner en el header

## 📍 Dónde Está Implementado

### Página Principal (Home)
✅ **Implementado** - Banner grande después del hero section

```tsx
// src/app/page.tsx
<PromoBanner />
```

### Otras Páginas (Opcional)

Puedes añadir el banner compacto en:

**Página de Productos:**
```tsx
// src/app/products/page.tsx
import { PromoBannerCompact } from '@/components/promo-banner-compact';

// Añadir al inicio o final
<PromoBannerCompact />
```

**Página de Cotización:**
```tsx
// src/app/quote/page.tsx
import { PromoBannerCompact } from '@/components/promo-banner-compact';

// Añadir antes del formulario
<PromoBannerCompact />
```

## 🎨 Personalización

### Cambiar Colores

**Banner Principal:**
```tsx
// Cambiar el fondo rojo
className="bg-gradient-to-r from-red-600 to-red-700"
// Por ejemplo, a azul:
className="bg-gradient-to-r from-blue-600 to-blue-700"
```

### Cambiar Precio

```tsx
// En src/components/promo-banner.tsx
<div className="text-5xl md:text-6xl font-black">
  SOLO 25€  {/* Cambiar aquí */}
</div>
<div className="text-sm text-gray-600 mt-1">
  (Precio sin promoción: 54,45€)  {/* Y aquí */}
</div>
```

### Cambiar Texto

Edita directamente en `src/components/promo-banner.tsx`:
- Título
- Descripción
- Características
- Textos de botones

## 🖼️ Añadir Imagen Real de la Baliza

### Opción 1: Usar la imagen que tienes

1. Guarda la imagen en `public/images/baliza-osram.png`

2. Actualiza el componente:

```tsx
import Image from 'next/image';

// Reemplaza el placeholder con:
<div className="relative aspect-square max-w-md mx-auto">
  <Image
    src="/images/baliza-osram.png"
    alt="Baliza de emergencia OSRAM homologada DGT 2026 - Promoción GlassNou"
    fill
    className="object-contain"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

### Opción 2: Usar la imagen completa de la promoción

1. Guarda la imagen completa en `public/images/promo-baliza.jpg`

2. Crea un componente más simple:

```tsx
import Image from 'next/image';

export function PromoBaliza() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative w-full max-w-4xl mx-auto">
        <Image
          src="/images/promo-baliza.jpg"
          alt="Promoción especial GlassNou - Baliza de emergencia por 25€ al cambiar parabrisas"
          width={1200}
          height={800}
          className="rounded-lg shadow-2xl"
          priority
        />
      </div>
    </section>
  );
}
```

## 🎯 Estrategias de Colocación

### Máxima Visibilidad
1. **Home** - Banner grande ✅ (Ya implementado)
2. **Header sticky** - Banner compacto flotante
3. **Popup al entrar** - Modal con la oferta

### Visibilidad Media
1. **Página de productos** - Banner compacto al inicio
2. **Página de cotización** - Banner compacto antes del formulario
3. **Footer** - Mención de la promoción

### Visibilidad Baja
1. **Blog posts** - Mención al final
2. **Página de contacto** - Banner compacto

## 🚀 Banner Sticky (Flotante)

Si quieres un banner que siempre esté visible:

```tsx
// src/components/promo-banner-sticky.tsx
export function PromoBannerSticky() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Zap className="h-5 w-5 text-yellow-300" />
            <span className="font-bold">
              ¡Baliza por 25€ al cambiar tu parabrisas!
            </span>
          </div>
          <Button size="sm" className="bg-white text-red-600 hover:bg-red-50" asChild>
            <Link href="/quote">Ver Oferta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

Añadir en `src/app/layout.tsx`:
```tsx
import { PromoBannerSticky } from '@/components/promo-banner-sticky';

// Dentro del body
<PromoBannerSticky />
```

## 📊 Tracking de la Promoción

Para saber cuántas personas hacen clic:

```tsx
// Añadir onClick a los botones
<Button 
  onClick={() => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_promo_baliza', {
        event_category: 'promocion',
        event_label: 'baliza_25_euros',
      });
    }
  }}
>
  Solicitar Cotización
</Button>
```

## 🎨 Variaciones de Diseño

### Versión con Countdown (Urgencia)

```tsx
// Añadir un contador de tiempo limitado
<div className="bg-yellow-400 text-red-600 px-4 py-2 rounded-full inline-block mb-4">
  <span className="font-bold">⏰ ¡Oferta válida hasta fin de mes!</span>
</div>
```

### Versión con Testimonial

```tsx
<div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
  <p className="italic text-sm">
    "Excelente oferta, la baliza es de muy buena calidad y el servicio impecable"
  </p>
  <p className="text-xs mt-2 text-red-100">- Cliente satisfecho</p>
</div>
```

## 📱 Responsive

Los banners están optimizados para:
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 🔧 Mantenimiento

### Actualizar la Promoción

1. Edita `src/components/promo-banner.tsx`
2. Cambia precios, textos o características
3. Guarda y el sitio se actualizará automáticamente

### Desactivar la Promoción

Simplemente comenta o elimina la línea en `src/app/page.tsx`:

```tsx
// <PromoBanner />  // Comentado para desactivar
```

## 📚 Archivos Relacionados

- `src/components/promo-banner.tsx` - Banner principal
- `src/components/promo-banner-compact.tsx` - Banner compacto
- `src/app/page.tsx` - Página principal (implementado)
- `docs/promocion-baliza.md` - Esta documentación

---

**Última actualización:** ${new Date().toLocaleDateString('es-ES', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
