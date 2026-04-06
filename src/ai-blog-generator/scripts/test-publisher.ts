/**
 * Test script for AutoPublisher
 * 
 * This script demonstrates the publisher functionality by creating a test article.
 */

import { AutoPublisher } from '../publisher';
import { Repository } from '../database/repository';
import { DatabaseConnection } from '../database/connection';
import { GeneratedArticle, PublishConfig } from '../types';
import { getDatabasePath, loadPublishConfig } from '../config';

async function main() {
  console.log('🚀 Testing AutoPublisher...\n');

  // Initialize database
  const dbPath = getDatabasePath();
  const db = new DatabaseConnection(dbPath);
  await db.initialize();
  const repository = new Repository(db);

  // Load config
  const config: PublishConfig = loadPublishConfig();
  console.log('📋 Configuration:', config);

  // Create publisher
  const publisher = new AutoPublisher(repository, config);

  // Create a test article
  const testArticle: GeneratedArticle = {
    title: 'Guía Completa de Mantenimiento de Cristales de Automóvil',
    excerpt: 'Aprende todo sobre el mantenimiento adecuado de los cristales de tu vehículo para garantizar seguridad y durabilidad.',
    content: `# Guía Completa de Mantenimiento de Cristales de Automóvil

El mantenimiento adecuado de los cristales de tu vehículo es esencial para garantizar tu seguridad en la carretera. En esta guía completa, te enseñamos todo lo que necesitas saber.

## Importancia del Mantenimiento Regular

Los cristales de tu automóvil no solo te protegen de los elementos, sino que también son cruciales para la integridad estructural del vehículo. Un mantenimiento regular puede:

- Prevenir daños mayores
- Mejorar la visibilidad
- Aumentar la seguridad
- Prolongar la vida útil de los cristales

## Limpieza Adecuada

### Productos Recomendados

Utiliza siempre productos específicos para cristales de automóvil. Evita limpiadores domésticos que pueden dañar los tratamientos especiales.

### Técnica de Limpieza

1. Limpia en movimientos circulares
2. Usa paños de microfibra
3. Evita la luz solar directa durante la limpieza
4. Limpia también el interior

## Inspección Regular

Realiza inspecciones visuales cada mes para detectar:

- Pequeñas astillas o grietas
- Desgaste en las juntas
- Problemas con los limpiaparabrisas
- Daños en los bordes

## Cuándo Contactar a un Profesional

Si detectas cualquiera de estos problemas, contacta a GlassNou inmediatamente:

- Grietas que se expanden
- Astillas mayores a 2.5 cm
- Problemas de visibilidad
- Daños en el sellado

## Prevención de Daños

### Consejos Prácticos

- Mantén distancia de camiones con carga
- Estaciona en lugares protegidos cuando sea posible
- Reemplaza limpiaparabrisas desgastados
- Evita cambios bruscos de temperatura

### Protección en Invierno

El invierno presenta desafíos especiales para los cristales:

- No uses agua caliente sobre cristales fríos
- Usa raspadores de plástico, no metal
- Aplica tratamientos anti-hielo
- Mantén el líquido limpiaparabrisas adecuado

## Conclusión

El mantenimiento regular de los cristales de tu automóvil es una inversión en tu seguridad. En GlassNou, estamos aquí para ayudarte con cualquier necesidad de reparación o reemplazo.

¿Necesitas ayuda profesional? [Contáctanos hoy](/contacto) para una evaluación gratuita.`,
    suggestedTags: ['mantenimiento', 'cristales', 'seguridad', 'consejos'],
    suggestedCategory: 'mantenimiento',
    seoMetadata: {
      metaTitle: 'Guía Completa de Mantenimiento de Cristales de Automóvil',
      metaDescription: 'Aprende todo sobre el mantenimiento de cristales de automóvil. Consejos profesionales para limpieza, inspección y prevención de daños.',
      keywords: ['mantenimiento cristales', 'limpieza parabrisas', 'cuidado cristales coche'],
    },
    internalLinks: [
      { text: 'Contáctanos', url: '/contacto' },
      { text: 'Servicios', url: '/servicios' },
    ],
    callToAction: 'Contacta a GlassNou para una evaluación profesional gratuita',
    wordCount: 450,
    generatedAt: new Date(),
  };

  // Create a test topic
  console.log('\n📝 Creating test topic...');
  const topic = await repository.createTopic({
    title: 'Mantenimiento de Cristales',
    category: 'mantenimiento',
    tags: JSON.stringify(['mantenimiento', 'cristales']),
    priority: 'high',
    seasonal_months: null,
    keywords: JSON.stringify(['mantenimiento', 'cristales', 'limpieza']),
    last_used: null,
    times_used: 0,
    status: 'active',
  });
  console.log('✅ Topic created:', topic.id);

  // Publish the article
  console.log('\n📤 Publishing article...');
  const result = await publisher.publishArticle(testArticle, topic.id, 85);
  
  console.log('\n✅ Article published successfully!');
  console.log('   Slug:', result.slug);
  console.log('   File:', result.filePath);
  console.log('   Status:', result.status);
  console.log('   Review Status:', result.reviewStatus || 'N/A');

  // Get pending reviews
  console.log('\n📋 Checking pending reviews...');
  const pending = await publisher.getPendingReviews();
  console.log(`   Found ${pending.length} article(s) pending review`);

  if (pending.length > 0) {
    console.log('\n   Pending articles:');
    pending.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.slug}`);
    });
  }

  // Close database
  await db.close();
  console.log('\n✨ Test completed successfully!');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
