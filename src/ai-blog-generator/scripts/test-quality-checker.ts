/**
 * Test script for Quality Checker
 * 
 * This script demonstrates the Quality Checker functionality
 */

import { QualityChecker, createDefaultQualityConfig } from '../quality-checker';
import { GeneratedArticle } from '../types';

async function testQualityChecker() {
  console.log('🧪 Testing Quality Checker...\n');

  const config = createDefaultQualityConfig();
  const checker = new QualityChecker(config);

  // Test Case 1: Good quality article
  console.log('📝 Test Case 1: High Quality Article');
  const goodArticle: GeneratedArticle = {
    title: 'Cómo Reparar un Parabrisas Astillado',
    excerpt: 'Aprende las mejores técnicas para reparar un parabrisas astillado y evitar que el daño se extienda. Guía completa con consejos profesionales.',
    content: `
# Introducción

Un parabrisas astillado es un problema común que muchos conductores enfrentan. En este artículo, te explicaremos todo lo que necesitas saber sobre la reparación de parabrisas.

## ¿Qué causa las astillas en el parabrisas?

Las astillas pueden ser causadas por varios factores:

- Piedras y escombros en la carretera
- Cambios bruscos de temperatura
- Accidentes menores

## Proceso de reparación

El proceso de reparación profesional incluye varios pasos importantes que garantizan un resultado duradero.

### Evaluación del daño

Primero, es crucial evaluar el tamaño y la ubicación de la astilla.

### Aplicación de resina

Se aplica una resina especial que rellena la grieta y restaura la integridad estructural.

## Cuándo reemplazar en lugar de reparar

Si la astilla es mayor a 5cm o está en el campo de visión del conductor, es mejor reemplazar el parabrisas completo.

## Conclusión

La reparación temprana de astillas puede ahorrarte dinero y mantener tu vehículo seguro. Contacta con profesionales para obtener los mejores resultados.
    `.trim(),
    suggestedTags: ['reparación', 'parabrisas', 'mantenimiento', 'seguridad'],
    suggestedCategory: 'reparacion-parabrisas',
    seoMetadata: {
      metaTitle: 'Cómo Reparar un Parabrisas Astillado - Guía Completa',
      metaDescription: 'Descubre las mejores técnicas para reparar un parabrisas astillado. Guía profesional con consejos expertos para mantener tu vehículo seguro y ahorrar dinero.',
      keywords: ['reparación parabrisas', 'parabrisas astillado', 'cristales coche'],
    },
    internalLinks: [
      { text: 'servicios de reparación', url: '/servicios/reparacion' },
      { text: 'cotización gratuita', url: '/cotiza' },
      { text: 'tipos de cristales', url: '/blog/tipos-cristales' },
    ],
    callToAction: 'Solicita una cotización gratuita para reparar tu parabrisas hoy mismo',
    wordCount: 250,
    generatedAt: new Date(),
  };

  const result1 = await checker.checkArticle(goodArticle);
  console.log('✅ Quality Score:', result1.score);
  console.log('✅ Passed:', result1.passed);
  console.log('📋 Issues:', result1.issues.length);
  console.log('⚠️  Warnings:', result1.warnings.length);
  console.log('💡 Suggestions:', result1.suggestions.length);
  
  if (result1.issues.length > 0) {
    console.log('\nIssues found:');
    result1.issues.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.description}`);
    });
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test Case 2: Poor quality article (too short, bad SEO)
  console.log('📝 Test Case 2: Low Quality Article');
  const poorArticle: GeneratedArticle = {
    title: 'Cristales',
    excerpt: 'Info sobre cristales',
    content: `
# Cristales

Los cristales son importantes.

## Tipos

Hay varios tipos de cristales para coches.
    `.trim(),
    suggestedTags: ['cristales'],
    suggestedCategory: 'reparacion-parabrisas',
    seoMetadata: {
      metaTitle: 'Cristales de coche - Todo lo que necesitas saber sobre cristales automotrices',
      metaDescription: 'Cristales',
      keywords: [],
    },
    internalLinks: [],
    callToAction: '',
    wordCount: 15,
    generatedAt: new Date(),
  };

  const result2 = await checker.checkArticle(poorArticle);
  console.log('❌ Quality Score:', result2.score);
  console.log('❌ Passed:', result2.passed);
  console.log('📋 Issues:', result2.issues.length);
  console.log('⚠️  Warnings:', result2.warnings.length);
  console.log('💡 Suggestions:', result2.suggestions.length);
  
  if (result2.issues.length > 0) {
    console.log('\nIssues found:');
    result2.issues.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.description}`);
    });
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test Case 3: Article with SEO issues
  console.log('📝 Test Case 3: Article with SEO Issues');
  const seoIssueArticle: GeneratedArticle = {
    title: 'Mantenimiento de Cristales',
    excerpt: 'Guía completa sobre el mantenimiento adecuado de los cristales de tu vehículo para prolongar su vida útil.',
    content: `
# Introducción al mantenimiento de cristales

El mantenimiento adecuado de los cristales de tu vehículo es esencial para garantizar la seguridad y la visibilidad mientras conduces.

## Limpieza regular

La limpieza regular es fundamental. Debes limpiar tus cristales al menos una vez por semana usando productos específicos.

### Productos recomendados

- Limpiadores sin amoníaco
- Paños de microfibra
- Agua destilada

## Inspección periódica

Revisa tus cristales regularmente en busca de daños menores que puedan convertirse en problemas mayores.

## Protección contra elementos

Los cristales están expuestos a diversos elementos que pueden dañarlos con el tiempo.

### Rayos UV

Los rayos UV pueden debilitar el cristal con el tiempo.

### Temperatura

Los cambios bruscos de temperatura pueden causar estrés en el cristal.

## Reparación temprana

Si detectas algún daño, es importante repararlo lo antes posible para evitar que se extienda.

## Conclusión

El mantenimiento preventivo de los cristales de tu vehículo puede ahorrarte dinero y garantizar tu seguridad en la carretera.
    `.trim(),
    suggestedTags: ['mantenimiento', 'cristales', 'cuidado'],
    suggestedCategory: 'reparacion-parabrisas',
    seoMetadata: {
      metaTitle: 'Mant',
      metaDescription: 'Esta es una descripción muy larga que excede el límite recomendado de 160 caracteres para meta descriptions en SEO, lo cual puede causar que se corte en los resultados de búsqueda.',
      keywords: ['mantenimiento'],
    },
    internalLinks: [
      { text: 'servicios', url: '/servicios' },
    ],
    callToAction: 'Contacta con nosotros para más información sobre mantenimiento de cristales',
    wordCount: 220,
    generatedAt: new Date(),
  };

  const result3 = await checker.checkArticle(seoIssueArticle);
  console.log('⚠️  Quality Score:', result3.score);
  console.log('⚠️  Passed:', result3.passed);
  console.log('📋 Issues:', result3.issues.length);
  console.log('⚠️  Warnings:', result3.warnings.length);
  console.log('💡 Suggestions:', result3.suggestions.length);
  
  if (result3.issues.length > 0) {
    console.log('\nIssues found:');
    result3.issues.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.description}`);
    });
  }

  console.log('\n✅ Quality Checker test completed!\n');
}

// Run the test
testQualityChecker().catch(console.error);
