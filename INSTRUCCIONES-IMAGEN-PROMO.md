# 📸 Cómo Añadir la Imagen de la Promoción

## Paso 1: Guardar la Imagen

1. Guarda tu imagen de la promoción (la que me mostraste) con el nombre:
   ```
   promo-baliza.jpg
   ```

2. Colócala en la carpeta:
   ```
   public/images/promo-baliza.jpg
   ```

## Paso 2: Estructura de Carpetas

Tu estructura debe verse así:
```
proyecto/
├── public/
│   └── images/
│       ├── hero-background.png
│       └── promo-baliza.jpg  ← Aquí va tu imagen
├── src/
│   └── ...
```

## Paso 3: Verificar

1. Guarda la imagen en `public/images/promo-baliza.jpg`
2. Reinicia el servidor si está corriendo:
   ```bash
   npm run dev
   ```
3. Abre http://localhost:9002
4. Deberías ver tu imagen de promoción en la página principal

## 🎨 El Banner Ahora Es:

- ✅ **Más compacto** - Solo muestra tu imagen
- ✅ **Clickeable** - Toda la imagen lleva a cotización
- ✅ **Overlay con CTA** - Botón "Solicitar Ahora" sobre la imagen
- ✅ **Responsive** - Se adapta a móvil, tablet y desktop
- ✅ **Hover effect** - Crece ligeramente al pasar el mouse
- ✅ **Alt text optimizado** - Para SEO y accesibilidad

## 🔧 Si Quieres Cambiar Algo

### Quitar el Overlay (solo imagen)

Edita `src/components/promo-banner.tsx` y elimina esta sección:

```tsx
{/* Overlay con botón CTA (opcional) */}
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
  ...
</div>
```

### Cambiar el Tamaño

```tsx
// Más pequeño
<div className="max-w-3xl mx-auto">

// Más grande
<div className="max-w-6xl mx-auto">

// Ancho completo
<div className="max-w-full mx-auto">
```

### Cambiar el Espaciado

```tsx
// Menos espacio arriba/abajo
<section className="py-4 md:py-6">

// Más espacio
<section className="py-12 md:py-16">
```

## 📱 Formatos de Imagen Recomendados

- **Formato:** JPG o PNG
- **Ancho recomendado:** 1200px - 1600px
- **Calidad:** 80-90% (para web)
- **Peso:** Menos de 500KB (optimizado)

## 🚀 Optimizar la Imagen (Opcional)

Si la imagen es muy pesada, puedes optimizarla:

### Online (Gratis)
- https://tinypng.com/
- https://squoosh.app/

### Comando (si tienes ImageMagick)
```bash
magick promo-baliza.jpg -quality 85 -resize 1200x promo-baliza-optimized.jpg
```

## ❓ Problemas Comunes

### La imagen no aparece
1. Verifica que el archivo esté en `public/images/promo-baliza.jpg`
2. Verifica que el nombre sea exacto (minúsculas)
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### La imagen se ve pixelada
- Usa una imagen de mayor resolución (mínimo 1200px de ancho)

### La imagen es muy pesada
- Optimízala con TinyPNG o Squoosh
- Objetivo: menos de 500KB

## 🎯 Resultado Final

Tu promoción se verá así:
1. Imagen grande y clara de tu promoción
2. Clickeable para ir a cotización
3. Botón "Solicitar Ahora" sobre la imagen
4. Responsive en todos los dispositivos

---

**¿Necesitas ayuda?** Avísame si tienes problemas guardando la imagen.
