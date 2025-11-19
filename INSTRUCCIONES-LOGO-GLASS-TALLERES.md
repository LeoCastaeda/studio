# 📸 Cómo Añadir el Logo de Glass Talleres

## Paso 1: Guardar la Imagen

1. Guarda la imagen del logo de "glass talleres" con el nombre:
   ```
   glass-talleres-logo.png
   ```

2. Colócala en la carpeta:
   ```
   public/images/glass-talleres-logo.png
   ```

## Paso 2: Estructura de Carpetas

Tu estructura debe verse así:
```
proyecto/
├── public/
│   └── images/
│       ├── hero-background.png
│       └── glass-talleres-logo.png  ← Aquí va la imagen
├── src/
│   └── ...
```

## Paso 3: Verificar

1. Guarda la imagen en `public/images/glass-talleres-logo.png`
2. Reinicia el servidor si está corriendo:
   ```bash
   npm run dev
   ```
3. Abre http://localhost:9002
4. Desplázate hasta el footer
5. Deberías ver el logo con el texto "Formamos parte de la red glass talleres"

## 🎨 El Logo Aparecerá:

- ✅ **Centrado** en el footer
- ✅ **Encima del copyright** y enlaces
- ✅ **Con texto descriptivo** debajo
- ✅ **Altura de 64px** (h-16)
- ✅ **Alt text optimizado** para SEO y accesibilidad

## 🔧 Si Quieres Cambiar el Tamaño

Edita `src/components/layout/footer.tsx` y cambia:

```tsx
// Más pequeño
className="h-12 w-auto"

// Más grande
className="h-20 w-auto"

// Actual
className="h-16 w-auto"
```

## 📝 Formato de Imagen Recomendado

- **Formato:** PNG (con fondo transparente) o JPG
- **Ancho recomendado:** 300px - 500px
- **Calidad:** Alta resolución para pantallas retina
- **Peso:** Menos de 100KB (optimizado)

## 🚀 Optimizar la Imagen (Opcional)

Si la imagen es muy pesada, puedes optimizarla:

### Online (Gratis)
- https://tinypng.com/
- https://squoosh.app/

---

**¿Necesitas ayuda?** Avísame si tienes problemas guardando la imagen.
