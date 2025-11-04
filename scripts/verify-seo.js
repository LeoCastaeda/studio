#!/usr/bin/env node

/**
 * Script de verificación SEO
 * Verifica que la configuración SEO esté correcta
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración SEO...\n');

let hasErrors = false;

// 1. Verificar variable de entorno
console.log('1. Verificando variable de entorno NEXT_PUBLIC_SITE_URL...');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('NEXT_PUBLIC_SITE_URL')) {
    console.log('   ✅ Variable de entorno configurada\n');
  } else {
    console.log('   ❌ Variable NEXT_PUBLIC_SITE_URL no encontrada en .env.local\n');
    hasErrors = true;
  }
} else {
  console.log('   ⚠️  Archivo .env.local no encontrado\n');
  hasErrors = true;
}

// 2. Verificar archivos SEO
console.log('2. Verificando archivos SEO...');
const seoFiles = [
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/lib/seo/site-config.ts',
  'src/lib/seo/metadata.ts',
  'src/components/seo/breadcrumb-schema.tsx',
  'src/components/seo/website-schema.tsx',
  'src/components/seo/organization-schema.tsx',
];

seoFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} no encontrado`);
    hasErrors = true;
  }
});
console.log();

// 3. Verificar posts del blog
console.log('3. Verificando posts del blog...');
const blogPath = path.join(process.cwd(), 'content', 'blog');
if (fs.existsSync(blogPath)) {
  const posts = fs.readdirSync(blogPath).filter(f => f.endsWith('.md'));
  console.log(`   ✅ ${posts.length} posts encontrados\n`);
} else {
  console.log('   ⚠️  Directorio content/blog no encontrado\n');
}

// 4. Verificar que public/sitemap.xml y robots.txt no interfieran
console.log('4. Verificando archivos estáticos...');
const publicSitemap = path.join(process.cwd(), 'public', 'sitemap.xml');
const publicRobots = path.join(process.cwd(), 'public', 'robots.txt');

if (fs.existsSync(publicSitemap)) {
  const content = fs.readFileSync(publicSitemap, 'utf8');
  if (content.includes('src/app/sitemap.ts')) {
    console.log('   ✅ public/sitemap.xml actualizado correctamente');
  } else {
    console.log('   ⚠️  public/sitemap.xml puede interferir con sitemap dinámico');
  }
}

if (fs.existsSync(publicRobots)) {
  const content = fs.readFileSync(publicRobots, 'utf8');
  if (content.includes('src/app/robots.ts')) {
    console.log('   ✅ public/robots.txt actualizado correctamente');
  } else {
    console.log('   ⚠️  public/robots.txt puede interferir con robots dinámico');
  }
}
console.log();

// Resumen
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (hasErrors) {
  console.log('❌ Se encontraron errores en la configuración SEO');
  console.log('   Revisa los mensajes anteriores y corrige los problemas');
  process.exit(1);
} else {
  console.log('✅ Configuración SEO verificada correctamente');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. Ejecuta: npm run build');
  console.log('   2. Verifica: http://localhost:9002/sitemap.xml');
  console.log('   3. Verifica: http://localhost:9002/robots.txt');
  console.log('   4. Antes de producción, actualiza NEXT_PUBLIC_SITE_URL');
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
