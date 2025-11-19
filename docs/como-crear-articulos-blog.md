# 📝 Cómo Crear Artículos para el Blog

## 🚀 Inicio Rápido

### 1. Crear el Archivo

Crea un archivo `.md` en la carpeta `content/blog/` con un nombre descriptivo:

```
content/blog/nombre-del-articulo.md
```

**Ejemplos de nombres:**
- `instalacion-parabrisas-proceso-profesional.md`
- `como-reparar-grieta-parabrisas.md`
- `mantenimiento-cristales-coche.md`

### 2. Estructura del Archivo

Todo artículo debe empezar con el **frontmatter** (metadatos) entre `---`:

```markdown
---
title: "Título del Artículo"
excerpt: "Resumen breve del artículo (2-3 líneas)"
publishedAt: "2024-01-15"
author: "Equipo GlassNou"
category: "instalacion"
tags: ["tag1", "tag2", "tag3"]
featuredImage: "/images/blog/nombre-imagen.jpg"
published: true
seo:
  metaTitle: "Título SEO optimizado | GlassNou"
  metaDescription: "Descripción para Google (150-160 caracteres)"
  keywords: ["palabra clave 1", "palabra clave 2"]
---

Aquí empieza el contenido del artículo...
```

## 📋 Campos del Frontmatter

### Campos Obligatorios

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `title` | Título del artículo | "Instalación de Parabrisas: Guía Completa" |
| `excerpt` | Resumen breve | "Aprende todo sobre la instalación profesional..." |
| `publishedAt` | Fecha de publicación | "2024-01-15" |
| `author` | Autor del artículo | "Equipo GlassNou" |
| `category` | Categoría (ver lista abajo) | "instalacion" |
| `tags` | Etiquetas (array) | ["parabrisas", "instalación"] |
| `published` | ¿Publicar? | `true` o `false` |

### Campos Opcionales

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `featuredImage` | Imagen destacada | "/images/blog/articulo.jpg" |
| `updatedAt` | Fecha de actualización | "2024-02-01" |
| `seo.metaTitle` | Título para SEO | "Título optimizado \| GlassNou" |
| `seo.metaDescription` | Descripción SEO | "Descripción de 150-160 caracteres" |
| `seo.keywords` | Palabras clave | ["keyword1", "keyword2"] |

## 📁 Categorías Disponibles

Usa **exactamente** uno de estos valores en `category`:

- `instalacion` - Instalación de cristales
- `reparacion` - Reparación de daños
- `mantenimiento` - Cuidado y mantenimiento
- `tecnologia` - Tecnología y sistemas ADAS
- `seguridad` - Seguridad vial
- `consejos` - Consejos y guías

## 🏷️ Tags (Etiquetas)

Usa tags descriptivos y relevantes:

**Ejemplos buenos:**
```yaml
tags: ["parabrisas", "instalación profesional", "ADAS", "seguridad"]
```

**Evita:**
- Tags muy genéricos: "coche", "auto"
- Tags duplicados con la categoría
- Más de 5-6 tags por artículo

## ✍️ Formato del Contenido

### Títulos

```markdown
## Título Principal (H2)
### Subtítulo (H3)
#### Sub-subtítulo (H4)
```

### Listas

```markdown
- Elemento 1
- Elemento 2
- Elemento 3

1. Primer paso
2. Segundo paso
3. Tercer paso
```

### Énfasis

```markdown
**Texto en negrita**
*Texto en cursiva*
***Texto en negrita y cursiva***
```

### Enlaces

```markdown
[Texto del enlace](/ruta-interna)
[Enlace externo](https://ejemplo.com)
```

### Imágenes

```markdown
![Texto alternativo](/images/blog/imagen.jpg)
```

### Citas

```markdown
> Esta es una cita importante
```

### Código

```markdown
`código inline`

\`\`\`javascript
// Bloque de código
const ejemplo = "código";
\`\`\`
```

## 🖼️ Imágenes

### Ubicación

Guarda las imágenes en:
```
public/images/blog/nombre-imagen.jpg
```

### Referencia en el artículo

```markdown
![Descripción de la imagen](/images/blog/nombre-imagen.jpg)
```

### Buenas Prácticas

- **Formato:** JPG para fotos, PNG para gráficos
- **Tamaño:** Máximo 1200px de ancho
- **Peso:** Menos de 500KB (optimizar con TinyPNG)
- **Nombres:** descriptivos y en minúsculas
- **Alt text:** siempre descriptivo para SEO

## 📝 Ejemplo Completo

```markdown
---
title: "Cómo Reparar una Grieta en el Parabrisas"
excerpt: "Aprende cuándo es posible reparar una grieta en el parabrisas y cuándo es necesario reemplazarlo. Guía completa con consejos profesionales."
publishedAt: "2024-01-20"
author: "Equipo GlassNou"
category: "reparacion"
tags: ["parabrisas", "reparación", "grietas", "mantenimiento"]
featuredImage: "/images/blog/reparacion-grieta.jpg"
published: true
seo:
  metaTitle: "Reparación de Grietas en Parabrisas: Guía Completa | GlassNou"
  metaDescription: "Descubre cuándo reparar o cambiar un parabrisas con grietas. Proceso profesional, costos y consejos de expertos en Barcelona."
  keywords: ["reparación parabrisas", "grieta parabrisas", "reparar cristal coche"]
---

Las **grietas en el parabrisas** son un problema común que requiere atención inmediata. En esta guía te explicamos todo lo que necesitas saber.

## ¿Cuándo se puede reparar?

Una grieta es reparable cuando:

- Tiene menos de 5 cm de longitud
- No está en el campo de visión del conductor
- No afecta los bordes del cristal

## Proceso de Reparación

### 1. Evaluación inicial

Nuestros técnicos inspeccionan...

[Continúa con el contenido...]

## Conclusión

La reparación profesional de grietas...

**¿Necesitas reparar tu parabrisas?**

📞 Contáctanos: +34 686 770 074  
[Solicita tu cotización](/quote)
```

## 🎯 SEO: Mejores Prácticas

### Título (title)

- **Longitud:** 50-60 caracteres
- **Incluir:** palabra clave principal
- **Formato:** "Título Principal: Subtítulo | GlassNou"

### Excerpt

- **Longitud:** 2-3 líneas (150-200 caracteres)
- **Incluir:** beneficio o promesa del artículo
- **Llamada a la acción:** invita a leer más

### Meta Description

- **Longitud:** 150-160 caracteres
- **Incluir:** palabra clave principal
- **Llamada a la acción:** "Descubre", "Aprende", "Guía completa"

### Keywords

- **Cantidad:** 3-5 palabras clave
- **Relevancia:** relacionadas con el contenido
- **Variedad:** incluir sinónimos y variaciones

## 📊 Checklist Antes de Publicar

- [ ] Frontmatter completo y correcto
- [ ] Título atractivo y descriptivo
- [ ] Excerpt claro y conciso
- [ ] Categoría correcta
- [ ] 3-5 tags relevantes
- [ ] Imagen destacada añadida
- [ ] SEO metadata optimizada
- [ ] Contenido bien estructurado con H2, H3
- [ ] Enlaces internos a otras páginas
- [ ] Llamada a la acción al final
- [ ] Información de contacto
- [ ] `published: true` para publicar

## 🚀 Publicar el Artículo

### 1. Guardar el archivo

Guarda el archivo `.md` en `content/blog/`

### 2. Añadir imagen (si la tienes)

Guarda la imagen en `public/images/blog/`

### 3. Verificar

```bash
npm run dev
```

Visita: http://localhost:9002/blog

### 4. Build para producción

```bash
npm run build
```

## 🔄 Actualizar un Artículo

1. Edita el archivo `.md`
2. Actualiza el campo `updatedAt`:
   ```yaml
   updatedAt: "2024-02-01"
   ```
3. Guarda y rebuild

## 📱 Vista Previa

Antes de publicar (`published: false`), puedes ver el artículo en desarrollo:

```yaml
published: false  # No aparecerá en el blog público
```

## 💡 Consejos de Contenido

### Longitud Ideal

- **Mínimo:** 800 palabras
- **Óptimo:** 1500-2000 palabras
- **Máximo:** 3000 palabras

### Estructura

1. **Introducción** (100-150 palabras)
2. **Cuerpo** (dividido en secciones con H2)
3. **Conclusión** (100-150 palabras)
4. **Llamada a la acción**

### Tono

- Profesional pero cercano
- Usa "tú" o "usted" consistentemente
- Explica términos técnicos
- Incluye ejemplos prácticos

## 🎨 Emojis en Títulos

Puedes usar emojis para hacer los títulos más visuales:

```markdown
## 🔍 Evaluación Inicial
## 🧰 Herramientas Necesarias
## ⚙️ Proceso Paso a Paso
## 🎯 Conclusión
```

## 📚 Recursos Útiles

- **Markdown Guide:** https://www.markdownguide.org/
- **Optimizar imágenes:** https://tinypng.com/
- **Verificar SEO:** https://www.seoptimer.com/

---

**¿Necesitas ayuda?** Revisa el ejemplo en:
`content/blog/instalacion-parabrisas-proceso-profesional.md`
