/**
 * Seed Topics - Initial topic data for the AI blog generator
 * 
 * Contains 30 topics related to automotive glass, categorized and tagged appropriately.
 * Requirement 2.1: Maintain a list of topics related to automotive glass
 */

import { Topic } from './types';
import { BLOG_CATEGORIES } from '@/lib/blog/blog-types';

type TopicSeed = Omit<Topic, 'id' | 'createdAt' | 'timesUsed' | 'status' | 'lastUsed'>;

export const SEED_TOPICS: TopicSeed[] = [
  // Reparaciones (Repairs)
  {
    title: 'Cómo reparar un parabrisas astillado: Guía completa',
    category: BLOG_CATEGORIES.REPARACIONES,
    tags: ['reparación', 'parabrisas', 'astillado', 'guía'],
    priority: 'high',
    keywords: ['reparar parabrisas', 'parabrisas astillado', 'reparación cristal', 'chip parabrisas'],
  },
  {
    title: 'Cuándo reparar vs reemplazar un parabrisas dañado',
    category: BLOG_CATEGORIES.REPARACIONES,
    tags: ['reparación', 'reemplazo', 'parabrisas', 'decisión'],
    priority: 'high',
    keywords: ['reparar o reemplazar', 'parabrisas dañado', 'cuándo cambiar parabrisas'],
  },
  {
    title: 'Reparación de lunas laterales: Proceso y costos',
    category: BLOG_CATEGORIES.REPARACIONES,
    tags: ['reparación', 'lunas laterales', 'costos', 'proceso'],
    priority: 'medium',
    keywords: ['reparar luna lateral', 'cristal lateral roto', 'costo reparación'],
  },
  {
    title: 'Reparación de luneta trasera: Todo lo que necesitas saber',
    category: BLOG_CATEGORIES.REPARACIONES,
    tags: ['reparación', 'luneta trasera', 'guía'],
    priority: 'medium',
    keywords: ['reparar luneta', 'luneta trasera rota', 'cambiar luneta'],
  },
  {
    title: 'Reparación de grietas en parabrisas: ¿Es posible?',
    category: BLOG_CATEGORIES.REPARACIONES,
    tags: ['reparación', 'grietas', 'parabrisas'],
    priority: 'high',
    keywords: ['grieta parabrisas', 'reparar grieta', 'grieta cristal'],
  },

  // Instalación (Installation)
  {
    title: 'Proceso profesional de instalación de parabrisas',
    category: BLOG_CATEGORIES.INSTALACION,
    tags: ['instalación', 'parabrisas', 'proceso', 'profesional'],
    priority: 'high',
    keywords: ['instalar parabrisas', 'instalación profesional', 'cambio parabrisas'],
  },
  {
    title: 'Tiempo de secado después de instalar un parabrisas nuevo',
    category: BLOG_CATEGORIES.INSTALACION,
    tags: ['instalación', 'secado', 'adhesivo', 'tiempo'],
    priority: 'medium',
    keywords: ['tiempo secado parabrisas', 'cuánto esperar', 'adhesivo parabrisas'],
  },
  {
    title: 'Instalación de cristales con sistema ADAS: Calibración necesaria',
    category: BLOG_CATEGORIES.INSTALACION,
    tags: ['instalación', 'ADAS', 'calibración', 'tecnología'],
    priority: 'high',
    keywords: ['ADAS calibración', 'instalar cristal ADAS', 'sistema asistencia'],
  },
  {
    title: 'Instalación de lunas tintadas: Normativa y proceso',
    category: BLOG_CATEGORIES.INSTALACION,
    tags: ['instalación', 'tintado', 'normativa', 'legal'],
    priority: 'medium',
    keywords: ['lunas tintadas', 'instalar tintado', 'normativa tintado'],
  },
  {
    title: 'Cómo elegir el adhesivo correcto para instalación de parabrisas',
    category: BLOG_CATEGORIES.INSTALACION,
    tags: ['instalación', 'adhesivo', 'materiales'],
    priority: 'low',
    keywords: ['adhesivo parabrisas', 'pegamento cristal', 'materiales instalación'],
  },

  // Tipos de Cristales (Glass Types)
  {
    title: 'Tipos de cristales para automóviles: Guía completa',
    category: BLOG_CATEGORIES.TIPOS_CRISTALES,
    tags: ['tipos', 'cristales', 'guía', 'comparación'],
    priority: 'high',
    keywords: ['tipos cristales coche', 'cristal laminado', 'cristal templado'],
  },
  {
    title: 'Cristal laminado vs templado: Diferencias y usos',
    category: BLOG_CATEGORIES.TIPOS_CRISTALES,
    tags: ['tipos', 'laminado', 'templado', 'comparación'],
    priority: 'high',
    keywords: ['laminado vs templado', 'diferencias cristales', 'tipos vidrio'],
  },
  {
    title: 'Parabrisas acústicos: Reducción de ruido en tu vehículo',
    category: BLOG_CATEGORIES.TIPOS_CRISTALES,
    tags: ['tipos', 'acústico', 'ruido', 'confort'],
    priority: 'medium',
    keywords: ['parabrisas acústico', 'reducir ruido', 'cristal insonorizado'],
  },
  {
    title: 'Cristales con protección UV: Beneficios y características',
    category: BLOG_CATEGORIES.TIPOS_CRISTALES,
    tags: ['tipos', 'UV', 'protección', 'salud'],
    priority: 'medium',
    seasonal: { months: [5, 6, 7, 8] }, // Summer months
    keywords: ['protección UV', 'cristal UV', 'rayos ultravioleta'],
  },
  {
    title: 'Parabrisas con sensor de lluvia: Funcionamiento y ventajas',
    category: BLOG_CATEGORIES.TIPOS_CRISTALES,
    tags: ['tipos', 'sensor lluvia', 'tecnología'],
    priority: 'medium',
    seasonal: { months: [10, 11, 12, 1, 2, 3] }, // Rainy season
    keywords: ['sensor lluvia', 'parabrisas inteligente', 'limpiaparabrisas automático'],
  },

  // Seguridad (Safety)
  {
    title: 'Importancia del parabrisas en la seguridad del vehículo',
    category: BLOG_CATEGORIES.SEGURIDAD,
    tags: ['seguridad', 'parabrisas', 'protección'],
    priority: 'high',
    keywords: ['seguridad parabrisas', 'importancia cristal', 'seguridad vial'],
  },
  {
    title: 'Cómo un parabrisas dañado afecta la seguridad',
    category: BLOG_CATEGORIES.SEGURIDAD,
    tags: ['seguridad', 'daños', 'riesgos'],
    priority: 'high',
    keywords: ['parabrisas dañado', 'riesgo seguridad', 'peligro grieta'],
  },
  {
    title: 'Sistemas ADAS y su relación con el parabrisas',
    category: BLOG_CATEGORIES.SEGURIDAD,
    tags: ['seguridad', 'ADAS', 'tecnología', 'asistencia'],
    priority: 'high',
    keywords: ['ADAS parabrisas', 'sistemas asistencia', 'seguridad activa'],
  },
  {
    title: 'Cristales de seguridad: Normativas europeas',
    category: BLOG_CATEGORIES.SEGURIDAD,
    tags: ['seguridad', 'normativa', 'legal', 'Europa'],
    priority: 'medium',
    keywords: ['normativa cristales', 'homologación', 'seguridad europea'],
  },
  {
    title: 'Qué hacer en caso de rotura de cristal mientras conduces',
    category: BLOG_CATEGORIES.SEGURIDAD,
    tags: ['seguridad', 'emergencia', 'conducción'],
    priority: 'medium',
    keywords: ['cristal roto conduciendo', 'emergencia parabrisas', 'qué hacer'],
  },

  // Noticias (News)
  {
    title: 'Nuevas tecnologías en cristales de automoción 2024',
    category: BLOG_CATEGORIES.NOTICIAS,
    tags: ['noticias', 'tecnología', 'innovación', '2024'],
    priority: 'medium',
    keywords: ['tecnología cristales', 'innovación automoción', 'futuro parabrisas'],
  },
  {
    title: 'Cambios en la normativa de cristales tintados en España',
    category: BLOG_CATEGORIES.NOTICIAS,
    tags: ['noticias', 'normativa', 'tintado', 'legal'],
    priority: 'low',
    keywords: ['normativa tintado', 'ley cristales', 'cambios legales'],
  },
  {
    title: 'Tendencias en reparación de cristales: Sostenibilidad',
    category: BLOG_CATEGORIES.NOTICIAS,
    tags: ['noticias', 'sostenibilidad', 'medio ambiente', 'tendencias'],
    priority: 'low',
    keywords: ['sostenibilidad cristales', 'reciclaje parabrisas', 'ecología'],
  },

  // Consejos (Tips)
  {
    title: 'Cómo mantener tu parabrisas en perfecto estado',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'mantenimiento', 'cuidado'],
    priority: 'high',
    keywords: ['mantener parabrisas', 'cuidado cristal', 'limpieza parabrisas'],
  },
  {
    title: 'Consejos para evitar daños en el parabrisas en invierno',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'invierno', 'prevención', 'frío'],
    priority: 'high',
    seasonal: { months: [11, 12, 1, 2] }, // Winter months
    keywords: ['parabrisas invierno', 'hielo cristal', 'cuidado frío'],
  },
  {
    title: 'Cómo limpiar correctamente el parabrisas',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'limpieza', 'mantenimiento'],
    priority: 'medium',
    keywords: ['limpiar parabrisas', 'limpieza cristal', 'productos limpieza'],
  },
  {
    title: 'Protección del parabrisas en verano: Evita el calor extremo',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'verano', 'calor', 'protección'],
    priority: 'medium',
    seasonal: { months: [6, 7, 8] }, // Summer months
    keywords: ['parabrisas verano', 'proteger calor', 'parasol coche'],
  },
  {
    title: 'Cuándo cambiar las escobillas del limpiaparabrisas',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'escobillas', 'mantenimiento', 'limpiaparabrisas'],
    priority: 'medium',
    keywords: ['cambiar escobillas', 'limpiaparabrisas', 'mantenimiento'],
  },
  {
    title: 'Cómo actuar ante una piedra que impacta tu parabrisas',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'emergencia', 'daños', 'prevención'],
    priority: 'high',
    keywords: ['piedra parabrisas', 'impacto cristal', 'qué hacer'],
  },
  {
    title: 'Seguro de cristales: ¿Vale la pena contratarlo?',
    category: BLOG_CATEGORIES.CONSEJOS,
    tags: ['consejos', 'seguro', 'cobertura', 'económico'],
    priority: 'medium',
    keywords: ['seguro cristales', 'cobertura parabrisas', 'vale la pena'],
  },
];

/**
 * Helper function to seed topics into the database
 */
export async function seedTopics(topicManager: any): Promise<void> {
  const { getLogger } = await import('./logger');
  const logger = getLogger().child({ component: 'SeedTopics' });
  
  logger.info('Starting topic seeding', {
    operation: 'seedTopics',
    topicCount: SEED_TOPICS.length
  });
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const topicSeed of SEED_TOPICS) {
    try {
      await topicManager.addTopic(topicSeed);
      logger.debug('Topic added', {
        operation: 'seedTopics',
        topicTitle: topicSeed.title
      });
      successCount++;
    } catch (error) {
      logger.error('Failed to add topic', {
        operation: 'seedTopics',
        topicTitle: topicSeed.title
      }, error as Error);
      failureCount++;
    }
  }
  
  logger.info('Topic seeding completed', {
    operation: 'seedTopics',
    totalTopics: SEED_TOPICS.length,
    successCount,
    failureCount
  });
}
