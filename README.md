# 🌐 Glassnou Mobility — Sitio Web Oficial

**Glassnou Mobility** es una web moderna desarrollada con **Next.js 15** y **TypeScript**, diseñada para ofrecer una experiencia profesional y optimizada a clientes que buscan servicios de **reparación y sustitución de cristales de automóvil en Barcelona**.

El proyecto integra un diseño limpio, un sistema de gestión de productos y servicios, formularios inteligentes conectados a WhatsApp, y optimización SEO avanzada para mejorar el posicionamiento local en buscadores.

---

## 🚀 Características principales

- ⚡ **Desarrollado con Next.js 15 y TypeScript**
- 🎨 **Diseño con TailwindCSS + shadcn/ui**
- 🔍 **SEO profesional integrado**
- 💬 **Formulario de cotización vía WhatsApp**
- 🧭 **Sistema de rutas dinámicas**
- 📱 **Diseño responsive**

---

## 🧩 Tecnologías utilizadas

| Categoría | Herramienta |
|------------|-------------|
| **Framework** | Next.js 15 |
| **Lenguaje** | TypeScript |
| **Estilos** | TailwindCSS |
| **UI Components** | shadcn/ui |
| **Validación** | Zod + React Hook Form |
| **Iconos** | Lucide React |
| **Despliegue** | Vercel |
| **SEO** | Metadata API + JSON-LD Schemas |
| **Integraciones** | WhatsApp Web, Google Maps, Google Business |

---

## ⚙️ Instalación y configuración

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/LeoCastaeda/studio.git
cd glassnou-mobility
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno
Crea un archivo `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://www.glassnou.com
```

### 4️⃣ Ejecutar en desarrollo
```bash
npm run dev
```
Visita 👉 [http://localhost:9002](http://localhost:9002)

### 5️⃣ Construir para producción
```bash
npm run build
npm run start
```

---

## 🧱 Estructura del proyecto

```
📦 src
 ┣ 📂 app
 ┃ ┣ 📂 products
 ┃ ┣ 📂 quote
 ┃ ┣ 📂 blog
 ┃ ┣ 📂 proteccion-datos
 ┃ ┣ sitemap.ts
 ┃ ┗ robots.ts
 ┣ 📂 components
 ┣ 📂 lib
 ┃ ┣ data.ts
 ┃ ┗ seo/
 ┃    ┣ metadata.ts
 ┃    ┗ site-config.ts
 ┣ 📂 hooks
 ┣ 📂 public
 ┗ 📄 globals.css
```

---

## 🧠 SEO y posicionamiento

Incluye:
- Sitemap y robots.txt automáticos
- OpenGraph + Twitter Cards
- JSON-LD Schema para servicios, organización y breadcrumbs
- Palabras clave locales: *“Cambio de parabrisas en Barcelona”*, *“Reparación de lunas”*

Verifica:
```bash
npm run seo:verify
```

---

## 💬 Cotización vía WhatsApp

Formulario `/quote`:
- Validación con Zod
- Mensaje directo a WhatsApp Web/móvil
- Checkbox de protección de datos (RGPD)

---

## 📈 Despliegue en Vercel

1. Subir el proyecto a [Vercel](https://vercel.com)
2. Configurar dominio:
   - `A @ → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
3. Variable en Vercel:
   ```env
   NEXT_PUBLIC_SITE_URL=https://www.glassnou.com
   ```

---

## 📞 Contacto

**Glassnou Mobility SL**  
📍 Barcelona, España  
📞 +34 686 770 074  
🌐 [www.glassnou.com](https://www.glassnou.com)  
📧 contacto@glassnou.com

