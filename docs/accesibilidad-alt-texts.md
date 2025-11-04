# Guía de Accesibilidad: Alt Texts para Imágenes

## ¿Por qué son importantes los Alt Texts?

### 1. **Accesibilidad (WCAG 2.1)**
- Personas con discapacidad visual usan lectores de pantalla
- Los lectores leen el texto alternativo en voz alta
- Permite a todos los usuarios entender el contenido

### 2. **SEO**
- Google indexa el texto alternativo
- Mejora el ranking en búsqueda de imágenes
- Ayuda a Google a entender el contexto de la página

### 3. **Experiencia de Usuario**
- Si la imagen no carga, se muestra el texto
- Conexiones lentas muestran el alt mientras carga
- Navegadores de texto muestran el alt

### 4. **Legal**
- Cumplimiento con leyes de accesibilidad
- WCAG 2.1 nivel AA es el estándar
- Evita problemas legales

## ✅ Alt Texts Implementados en GlassNou

### Página Principal (Home)

**Hero Image:**
```tsx
alt="Taller especializado en reparación e instalación de cristales y parabrisas para automóviles en Barcelona - GlassNou"
```
- ✅ Describe el negocio
- ✅ Incluye ubicación (Barcelona)
- ✅ Incluye marca (GlassNou)
- ✅ Palabras clave para SEO

### Tarjetas de Productos

**Product Cards:**
```tsx
alt={`Servicio de ${product.name} - Instalación y reparación profesional en Barcelona`}
```
- ✅ Describe el servicio específico
- ✅ Menciona que es profesional
- ✅ Incluye ubicación

### Página de Producto Individual

**Product Detail:**
```tsx
alt={`${product.name} - Servicio profesional de instalación y reparación en Barcelona por GlassNou`}
```
- ✅ Nombre del producto
- ✅ Tipo de servicio
- ✅ Ubicación y marca

### Blog

**Article Cards:**
```tsx
alt={`Imagen del artículo: ${post.title} - Blog GlassNou sobre cristales de automoción`}
```
- ✅ Identifica que es un artículo
- ✅ Incluye el título del post
- ✅ Contexto del blog

**Featured Image en Post:**
```tsx
alt={`Imagen destacada del artículo: ${post.title} - Blog GlassNou sobre cristales de automoción en Barcelona`}
```
- ✅ Más descriptivo para la imagen principal
- ✅ Incluye ubicación
- ✅ Contexto completo

## 📋 Mejores Prácticas

### ✅ Hacer

1. **Ser descriptivo pero conciso**
   - Ideal: 125 caracteres o menos
   - Máximo: 250 caracteres

2. **Incluir contexto relevante**
   ```tsx
   // ✅ Bueno
   alt="Parabrisas nuevo instalado en Toyota Corolla 2020"
   
   // ❌ Malo
   alt="Parabrisas"
   ```

3. **Incluir palabras clave naturalmente**
   ```tsx
   // ✅ Bueno
   alt="Reparación de luna trasera en Barcelona - Servicio GlassNou"
   
   // ❌ Malo (keyword stuffing)
   alt="Barcelona cristales Barcelona parabrisas Barcelona reparación Barcelona"
   ```

4. **Describir la función, no solo la apariencia**
   ```tsx
   // ✅ Bueno
   alt="Técnico instalando parabrisas con herramientas especializadas"
   
   // ❌ Malo
   alt="Hombre con camisa azul"
   ```

5. **Usar puntuación correcta**
   ```tsx
   // ✅ Bueno
   alt="Cristal lateral izquierdo para Honda Civic, instalación profesional"
   
   // ❌ Malo
   alt="cristal lateral izquierdo para honda civic instalacion profesional"
   ```

### ❌ Evitar

1. **No usar "imagen de" o "foto de"**
   ```tsx
   // ❌ Malo
   alt="Imagen de un parabrisas"
   
   // ✅ Bueno
   alt="Parabrisas nuevo para Toyota Camry 2021"
   ```

2. **No dejar alt vacío (a menos que sea decorativo)**
   ```tsx
   // ❌ Malo
   alt=""  // Solo para imágenes puramente decorativas
   
   // ✅ Bueno
   alt="Logo de GlassNou"
   ```

3. **No usar nombres de archivo**
   ```tsx
   // ❌ Malo
   alt="IMG_1234.jpg"
   
   // ✅ Bueno
   alt="Instalación de parabrisas en taller GlassNou Barcelona"
   ```

4. **No repetir el mismo alt en múltiples imágenes**
   ```tsx
   // ❌ Malo - todas las imágenes con el mismo alt
   alt="Servicio de cristales"
   
   // ✅ Bueno - cada imagen con su descripción única
   alt="Parabrisas delantero"
   alt="Luna trasera"
   alt="Cristal lateral"
   ```

## 🎯 Fórmula para Alt Texts Efectivos

### Para Productos/Servicios:
```
[Nombre del producto/servicio] - [Acción/Beneficio] en [Ubicación] por [Marca]
```

Ejemplo:
```tsx
alt="Parabrisas delantero - Instalación profesional en Barcelona por GlassNou"
```

### Para Blog:
```
[Tipo de contenido]: [Título] - [Contexto] sobre [Tema]
```

Ejemplo:
```tsx
alt="Artículo: Cómo mantener tu parabrisas - Guía GlassNou sobre cuidado de cristales"
```

### Para Imágenes Decorativas:
```tsx
// Si la imagen es puramente decorativa (no añade información)
alt=""
// O usa role="presentation"
<Image src="..." alt="" role="presentation" />
```

## 🔍 Herramientas de Verificación

### Lectores de Pantalla
- **NVDA** (Windows) - Gratuito
- **JAWS** (Windows) - Comercial
- **VoiceOver** (Mac/iOS) - Integrado
- **TalkBack** (Android) - Integrado

### Extensiones de Navegador
- **WAVE** - Evaluación de accesibilidad
- **axe DevTools** - Auditoría de accesibilidad
- **Lighthouse** (Chrome DevTools) - Auditoría completa

### Comandos para Probar

```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:9002 --view

# Verificar accesibilidad con axe
npm install -D @axe-core/cli
npx axe http://localhost:9002
```

## 📊 Checklist de Accesibilidad

- [x] Todas las imágenes tienen alt text
- [x] Alt texts son descriptivos (no genéricos)
- [x] Alt texts incluyen contexto relevante
- [x] Alt texts incluyen palabras clave naturalmente
- [x] Alt texts son concisos (< 250 caracteres)
- [x] No hay "imagen de" o "foto de"
- [x] Imágenes decorativas tienen alt=""
- [x] Alt texts únicos para cada imagen

## 🎨 Ejemplos Específicos de GlassNou

### Hero Section
```tsx
<Image
  src="/images/hero-background.png"
  alt="Taller especializado en reparación e instalación de cristales y parabrisas para automóviles en Barcelona - GlassNou"
/>
```

### Servicios
```tsx
<Image
  src={product.image.url}
  alt={`Servicio de ${product.name} - Instalación y reparación profesional en Barcelona`}
/>
```

### Blog Posts
```tsx
<Image
  src={post.featuredImage}
  alt={`Imagen del artículo: ${post.title} - Blog GlassNou sobre cristales de automoción`}
/>
```

### Logos
```tsx
<Logo
  aria-label="GlassNou - Taller de cristales de automoción en Barcelona"
  className="h-8 w-8"
/>
```

## 🚀 Impacto en SEO

### Antes (Alt genérico)
```tsx
alt="Parabrisas"
```
- Ranking bajo en búsqueda de imágenes
- No aporta contexto a Google
- Mala experiencia para usuarios con discapacidad

### Después (Alt optimizado)
```tsx
alt="Parabrisas delantero - Instalación profesional en Barcelona por GlassNou"
```
- ✅ Mejor ranking en "parabrisas Barcelona"
- ✅ Aparece en búsqueda de imágenes
- ✅ Google entiende el contexto
- ✅ Accesible para todos los usuarios

## 📚 Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Alt Text Guide](https://webaim.org/techniques/alttext/)
- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [MDN Web Docs - Alt Text](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-alt)

---

**Última actualización:** ${new Date().toLocaleDateString('es-ES', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
