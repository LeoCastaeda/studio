#!/usr/bin/env node
/**
 * CLI for AI Blog Generator
 * 
 * Command-line interface for managing the AI blog generator system.
 * Provides commands for generation, scheduling, topics, configuration, and metrics.
 */

import { config } from 'dotenv';
import { Command } from 'commander';
import { DatabaseConnection } from './database/connection';
import { Repository } from './database/repository';
import { TopicManager } from './topic-manager';
import { ContentScheduler } from './scheduler';
import { AIContentGenerator } from './ai-generator';
import { QualityChecker } from './quality-checker';
import { AutoPublisher } from './publisher';
import { MetricsTracker } from './metrics-tracker';
import { 
  getSchedulerConfig, 
  getPublishConfig, 
  getQualityCheckConfig,
  getAIProviderConfig,
  getDatabasePath
} from './config';
import { BlogCategorySlug } from '@/lib/blog/blog-types';
import { initializeLogger, LogLevel } from './logger';

// Load environment variables
config({ path: '.env.local' });

// Initialize logger
const logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
initializeLogger({
  level: logLevel,
  logDir: './logs',
  enableConsole: true,
  enableFile: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 14, // Keep 2 weeks of logs
  datePattern: 'YYYY-MM-DD',
});

const program = new Command();

// Initialize database and services
let db: DatabaseConnection;
let repository: Repository;
let topicManager: TopicManager;
let scheduler: ContentScheduler;
let aiGenerator: AIContentGenerator;
let qualityChecker: QualityChecker;
let publisher: AutoPublisher;
let metricsTracker: MetricsTracker;

async function initializeServices(options: { 
  needsAI?: boolean;
  needsScheduler?: boolean;
} = {}) {
  const dbPath = getDatabasePath();
  db = new DatabaseConnection(dbPath);
  await db.initialize();
  
  repository = new Repository(db);
  topicManager = new TopicManager(repository);
  metricsTracker = new MetricsTracker(repository);
  
  // Only initialize AI-dependent services if needed
  if (options.needsAI) {
    aiGenerator = new AIContentGenerator(getAIProviderConfig());
    qualityChecker = new QualityChecker(getQualityCheckConfig());
    publisher = new AutoPublisher(repository, getPublishConfig());
  }
  
  // Only initialize scheduler if needed
  if (options.needsScheduler && aiGenerator && qualityChecker && publisher) {
    scheduler = new ContentScheduler(
      getSchedulerConfig(),
      repository,
      topicManager,
      aiGenerator,
      qualityChecker,
      publisher
    );
  }
}

async function cleanup() {
  if (db) {
    await db.close();
  }
}

// Main Program Configuration
program
  .name('ai-blog-generator')
  .description('CLI para gestionar el generador automático de artículos del blog')
  .version('1.0.0');


// Generate Command
program
  .command('generate')
  .description('Generar un nuevo artículo manualmente')
  .option('-t, --topic <id>', 'ID del tema específico a usar')
  .option('-c, --category <category>', 'Categoría del tema')
  .option('--draft', 'Guardar como borrador (no publicar)')
  .action(async (options) => {
    try {
      await initializeServices({ needsAI: true });
      
      console.log('🚀 Iniciando generación de artículo...\n');
      
      // Select topic
      let topic;
      if (options.topic) {
        const dbTopic = await repository.getTopic(options.topic);
        if (!dbTopic) {
          console.error(`❌ Error: Tema con ID "${options.topic}" no encontrado`);
          process.exit(1);
        }
        topic = Repository.mapTopicToApp(dbTopic);
        console.log(`📝 Usando tema: ${topic.title}`);
      } else {
        const criteria = {
          avoidRecentTopics: true,
          preferSeasonal: true,
          preferHighPriority: true,
          categoryDistribution: options.category ? false : true,
        };
        
        topic = await topicManager.selectNextTopic(criteria);
        if (!topic) {
          console.error('❌ Error: No hay temas disponibles');
          process.exit(1);
        }
        console.log(`📝 Tema seleccionado: ${topic.title}`);
      }
      
      // Generate article
      console.log('✍️  Generando contenido con IA...');
      const article = await aiGenerator.generateArticle({
        topic,
        targetWordCount: 1200,
        tone: 'professional',
        includeCallToAction: true,
        relatedServices: ['reparacion-parabrisas', 'sustitucion-parabrisas'],
      });
      
      console.log(`✅ Artículo generado: "${article.title}" (${article.wordCount} palabras)\n`);
      
      // Check quality
      console.log('🔍 Verificando calidad...');
      const qualityResult = await qualityChecker.checkArticle(article);
      console.log(`📊 Puntuación de calidad: ${qualityResult.score}/100`);
      
      if (qualityResult.issues.length > 0) {
        console.log('\n⚠️  Problemas detectados:');
        qualityResult.issues.forEach(issue => {
          console.log(`   - [${issue.severity}] ${issue.description}`);
        });
      }
      
      // Publish or save as draft
      const forceDraft = options.draft || qualityResult.score < 75;
      const publishMethod = forceDraft ? publisher.saveDraft.bind(publisher) : publisher.publishArticle.bind(publisher);
      
      console.log(`\n📤 ${forceDraft ? 'Guardando como borrador' : 'Publicando artículo'}...`);
      const published = await publishMethod(article, topic.id, qualityResult.score);
      
      console.log(`\n✅ Artículo ${published.status === 'published' ? 'publicado' : 'guardado como borrador'}`);
      console.log(`   Slug: ${published.slug}`);
      console.log(`   Archivo: ${published.filePath}`);
      
      if (published.reviewStatus === 'pending') {
        console.log('\n⏳ El artículo requiere revisión manual antes de publicarse');
        console.log(`   Aprobar: npm run blog:cli approve ${published.slug}`);
        console.log(`   Rechazar: npm run blog:cli reject ${published.slug} "razón"`);
      }
      
      // Mark topic as used
      await topicManager.markTopicAsUsed(topic.id);
      
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });


// List Command
program
  .command('list')
  .description('Listar artículos pendientes de revisión')
  .option('-a, --all', 'Mostrar todos los artículos (no solo pendientes)')
  .option('-s, --status <status>', 'Filtrar por estado (draft, published)')
  .action(async (options) => {
    try {
      await initializeServices();
      
      let articles;
      if (options.all) {
        articles = await repository.getAllGeneratedArticles();
      } else if (options.status) {
        articles = await repository.getGeneratedArticlesByStatus(options.status);
      } else {
        articles = await repository.getArticlesPendingReview();
      }
      
      if (articles.length === 0) {
        console.log('📭 No hay artículos que mostrar');
        return;
      }
      
      console.log(`\n📚 Artículos (${articles.length}):\n`);
      
      for (const article of articles) {
        const statusIcon = article.status === 'published' ? '✅' : '📝';
        const reviewIcon = article.review_status === 'pending' ? '⏳' : 
                          article.review_status === 'approved' ? '✅' : 
                          article.review_status === 'rejected' ? '❌' : '';
        
        console.log(`${statusIcon} ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Estado: ${article.status} ${reviewIcon}`);
        if (article.quality_score) {
          console.log(`   Calidad: ${article.quality_score}/100`);
        }
        console.log(`   Generado: ${new Date(article.generated_at).toLocaleString('es-ES')}`);
        if (article.published_at) {
          console.log(`   Publicado: ${new Date(article.published_at).toLocaleString('es-ES')}`);
        }
        console.log('');
      }
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Approve Command
program
  .command('approve <slug>')
  .description('Aprobar y publicar un borrador')
  .action(async (slug) => {
    try {
      await initializeServices({ needsAI: true });
      
      console.log(`🔍 Buscando artículo: ${slug}...`);
      
      const article = await repository.getGeneratedArticleBySlug(slug);
      if (!article) {
        console.error(`❌ Error: Artículo "${slug}" no encontrado`);
        process.exit(1);
      }
      
      if (article.status !== 'draft') {
        console.error(`❌ Error: El artículo no es un borrador (estado: ${article.status})`);
        process.exit(1);
      }
      
      console.log(`✅ Aprobando y publicando "${article.title}"...`);
      await publisher.approveDraft(slug);
      
      console.log('\n✅ Artículo publicado exitosamente');
      console.log(`   Slug: ${slug}`);
      console.log(`   Archivo: ${article.file_path}`);
      
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Reject Command
program
  .command('reject <slug> <reason>')
  .description('Rechazar un borrador')
  .action(async (slug, reason) => {
    try {
      await initializeServices({ needsAI: true });
      
      console.log(`🔍 Buscando artículo: ${slug}...`);
      
      const article = await repository.getGeneratedArticleBySlug(slug);
      if (!article) {
        console.error(`❌ Error: Artículo "${slug}" no encontrado`);
        process.exit(1);
      }
      
      if (article.status !== 'draft') {
        console.error(`❌ Error: El artículo no es un borrador (estado: ${article.status})`);
        process.exit(1);
      }
      
      console.log(`❌ Rechazando "${article.title}"...`);
      await publisher.rejectDraft(slug, reason);
      
      console.log('\n✅ Artículo rechazado');
      console.log(`   Razón: ${reason}`);
      
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Topics Commands
const topicsCommand = program
  .command('topics')
  .description('Gestionar temas del blog');

// Topics Add Command
topicsCommand
  .command('add')
  .description('Añadir un nuevo tema')
  .requiredOption('-t, --title <title>', 'Título del tema')
  .requiredOption('-c, --category <category>', 'Categoría del tema')
  .option('-k, --keywords <keywords>', 'Palabras clave (separadas por comas)')
  .option('-g, --tags <tags>', 'Etiquetas (separadas por comas)')
  .option('-p, --priority <priority>', 'Prioridad (low, medium, high)', 'medium')
  .option('-s, --seasonal <months>', 'Meses estacionales (1-12, separados por comas)')
  .action(async (options) => {
    try {
      await initializeServices();
      
      console.log('📝 Añadiendo nuevo tema...\n');
      
      const keywords = options.keywords ? options.keywords.split(',').map((k: string) => k.trim()) : [];
      const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [];
      const seasonal = options.seasonal ? {
        months: options.seasonal.split(',').map((m: string) => parseInt(m.trim()))
      } : undefined;
      
      const topic = await topicManager.addTopic({
        title: options.title,
        category: options.category as BlogCategorySlug,
        tags,
        priority: options.priority as 'low' | 'medium' | 'high',
        seasonal,
        keywords,
      });
      
      console.log('✅ Tema añadido exitosamente');
      console.log(`   ID: ${topic.id}`);
      console.log(`   Título: ${topic.title}`);
      console.log(`   Categoría: ${topic.category}`);
      console.log(`   Prioridad: ${topic.priority}`);
      if (topic.seasonal) {
        console.log(`   Meses estacionales: ${topic.seasonal.months.join(', ')}`);
      }
      
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Topics List Command
topicsCommand
  .command('list')
  .description('Listar todos los temas disponibles')
  .option('-c, --category <category>', 'Filtrar por categoría')
  .option('-s, --status <status>', 'Filtrar por estado (active, used, archived)', 'active')
  .action(async (options) => {
    try {
      await initializeServices();
      
      let topics;
      if (options.category) {
        topics = await topicManager.getTopicsByCategory(options.category as BlogCategorySlug);
      } else if (options.status === 'active') {
        topics = await topicManager.getAvailableTopics();
      } else {
        // For non-active statuses, we need to map manually
        const dbTopics = await repository.getTopicsByStatus(options.status);
        topics = dbTopics.map(t => ({
          id: t.id,
          title: t.title,
          category: t.category as BlogCategorySlug,
          tags: JSON.parse(t.tags),
          priority: t.priority as 'low' | 'medium' | 'high',
          seasonal: t.seasonal_months ? { months: JSON.parse(t.seasonal_months) } : undefined,
          keywords: JSON.parse(t.keywords),
          lastUsed: t.last_used ? new Date(t.last_used) : undefined,
          timesUsed: t.times_used,
          status: t.status as 'active' | 'used' | 'archived',
          createdAt: new Date(t.created_at),
        }));
      }
      
      if (topics.length === 0) {
        console.log('📭 No hay temas que mostrar');
        return;
      }
      
      console.log(`\n📚 Temas (${topics.length}):\n`);
      
      for (const topic of topics) {
        const priorityIcon = topic.priority === 'high' ? '🔴' : 
                            topic.priority === 'medium' ? '🟡' : '🟢';
        const seasonalIcon = topic.seasonal ? '❄️' : '';
        
        console.log(`${priorityIcon} ${topic.title} ${seasonalIcon}`);
        console.log(`   ID: ${topic.id}`);
        console.log(`   Categoría: ${topic.category}`);
        console.log(`   Prioridad: ${topic.priority}`);
        console.log(`   Veces usado: ${topic.timesUsed}`);
        if (topic.lastUsed) {
          console.log(`   Último uso: ${new Date(topic.lastUsed).toLocaleString('es-ES')}`);
        }
        if (topic.seasonal) {
          console.log(`   Meses estacionales: ${topic.seasonal.months.join(', ')}`);
        }
        console.log(`   Keywords: ${topic.keywords.join(', ')}`);
        console.log('');
      }
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Topics Stats Command
topicsCommand
  .command('stats')
  .description('Ver estadísticas de uso de temas')
  .action(async () => {
    try {
      await initializeServices();
      
      const allTopics = await repository.getAllTopics();
      const activeTopics = allTopics.filter(t => t.status === 'active');
      const usedTopics = allTopics.filter(t => t.status === 'used');
      const archivedTopics = allTopics.filter(t => t.status === 'archived');
      
      // Calculate usage statistics
      const totalUsage = allTopics.reduce((sum, t) => sum + t.times_used, 0);
      const avgUsage = allTopics.length > 0 ? (totalUsage / allTopics.length).toFixed(2) : '0';
      
      // Find most used topics
      const mostUsed = [...allTopics]
        .sort((a, b) => b.times_used - a.times_used)
        .slice(0, 5);
      
      // Category distribution
      const categoryCount = new Map<string, number>();
      allTopics.forEach(t => {
        categoryCount.set(t.category, (categoryCount.get(t.category) || 0) + 1);
      });
      
      console.log('\n📊 Estadísticas de Temas\n');
      console.log('═══════════════════════════════════════\n');
      
      console.log('📈 Resumen General:');
      console.log(`   Total de temas: ${allTopics.length}`);
      console.log(`   Activos: ${activeTopics.length}`);
      console.log(`   Usados: ${usedTopics.length}`);
      console.log(`   Archivados: ${archivedTopics.length}`);
      console.log(`   Uso total: ${totalUsage} veces`);
      console.log(`   Uso promedio: ${avgUsage} veces por tema\n`);
      
      console.log('🏆 Temas Más Usados:');
      mostUsed.forEach((topic, index) => {
        console.log(`   ${index + 1}. ${topic.title} (${topic.times_used} veces)`);
      });
      console.log('');
      
      console.log('📂 Distribución por Categoría:');
      Array.from(categoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} temas`);
        });
      console.log('');
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Config Command
program
  .command('config')
  .description('Ver y editar configuración del sistema')
  .option('-l, --list', 'Listar toda la configuración')
  .option('-g, --get <key>', 'Obtener valor de una clave')
  .option('-s, --set <key> <value>', 'Establecer valor de una clave')
  .action(async (options, command) => {
    try {
      await initializeServices();
      
      if (options.list) {
        const allConfig = await repository.getAllConfig();
        
        if (allConfig.length === 0) {
          console.log('📭 No hay configuración guardada');
          return;
        }
        
        console.log('\n⚙️  Configuración del Sistema\n');
        console.log('═══════════════════════════════════════\n');
        
        for (const config of allConfig) {
          console.log(`${config.key}: ${config.value}`);
          console.log(`   Actualizado: ${new Date(config.updated_at).toLocaleString('es-ES')}\n`);
        }
      } else if (options.get) {
        const config = await repository.getConfig(options.get);
        
        if (!config) {
          console.error(`❌ Error: Clave "${options.get}" no encontrada`);
          process.exit(1);
        }
        
        console.log(`\n${config.key}: ${config.value}`);
        console.log(`Actualizado: ${new Date(config.updated_at).toLocaleString('es-ES')}\n`);
      } else if (options.set) {
        const args = command.args;
        if (args.length < 2) {
          console.error('❌ Error: Se requieren dos argumentos: <key> <value>');
          process.exit(1);
        }
        
        const key = args[0];
        const value = args[1];
        
        await repository.setConfig(key, value);
        
        console.log(`\n✅ Configuración actualizada`);
        console.log(`   ${key}: ${value}\n`);
      } else {
        console.log('⚙️  Configuración Actual del Sistema\n');
        console.log('═══════════════════════════════════════\n');
        
        const schedulerConfig = getSchedulerConfig();
        const publishConfig = getPublishConfig();
        const qualityConfig = getQualityCheckConfig();
        
        console.log('📅 Scheduler:');
        console.log(`   Habilitado: ${schedulerConfig.enabled}`);
        console.log(`   Frecuencia: ${schedulerConfig.frequency}`);
        if (schedulerConfig.customDays) {
          console.log(`   Días personalizados: ${schedulerConfig.customDays}`);
        }
        console.log(`   Hora de publicación: ${schedulerConfig.publishTime}`);
        console.log(`   Zona horaria: ${schedulerConfig.timezone}\n`);
        
        console.log('📤 Publisher:');
        console.log(`   Auto-publicar: ${publishConfig.autoPublish}`);
        console.log(`   Requiere revisión manual: ${publishConfig.requireManualReview}`);
        console.log(`   Notificar al publicar: ${publishConfig.notifyOnPublish}`);
        if (publishConfig.notificationEmail) {
          console.log(`   Email de notificación: ${publishConfig.notificationEmail}`);
        }
        console.log('');
        
        console.log('🔍 Quality Checker:');
        console.log(`   Palabras mínimas: ${qualityConfig.minWordCount}`);
        console.log(`   Palabras máximas: ${qualityConfig.maxWordCount}`);
        console.log(`   Puntuación mínima: ${qualityConfig.minReadabilityScore}`);
        console.log(`   Verificar plagio: ${qualityConfig.checkPlagiarism}`);
        console.log(`   Verificar precisión: ${qualityConfig.checkFactualAccuracy}\n`);
        
        console.log('🤖 AI Generator:');
        try {
          const aiConfig = getAIProviderConfig();
          console.log(`   Proveedor: ${aiConfig.provider}`);
          console.log(`   Modelo: ${aiConfig.model}`);
          console.log(`   Temperatura: ${aiConfig.temperature}`);
          console.log(`   Max tokens: ${aiConfig.maxTokens}\n`);
        } catch (error) {
          console.log(`   ⚠️  No configurado (falta API key)\n`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Schedule Command
program
  .command('schedule')
  .description('Ver próximas tareas programadas')
  .option('-l, --limit <number>', 'Número de tareas a mostrar', '10')
  .option('-a, --all', 'Mostrar todas las tareas (no solo pendientes)')
  .action(async (options) => {
    try {
      await initializeServices({ needsAI: true, needsScheduler: true });
      
      let tasks;
      if (options.all) {
        const allTasks = await repository.getScheduledTasksByStatus('pending');
        const completedTasks = await repository.getScheduledTasksByStatus('completed');
        const failedTasks = await repository.getScheduledTasksByStatus('failed');
        tasks = [...allTasks, ...completedTasks, ...failedTasks]
          .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime())
          .slice(0, parseInt(options.limit))
          .map(t => Repository.mapScheduledTaskToApp(t));
      } else {
        tasks = await scheduler.getUpcomingTasks(parseInt(options.limit));
      }
      
      if (tasks.length === 0) {
        console.log('📭 No hay tareas programadas');
        return;
      }
      
      console.log(`\n📅 Tareas Programadas (${tasks.length}):\n`);
      
      for (const task of tasks) {
        const statusIcon = task.status === 'pending' ? '⏳' : 
                          task.status === 'running' ? '🔄' : 
                          task.status === 'completed' ? '✅' : '❌';
        const typeIcon = task.type === 'generate' ? '✍️' : '🔄';
        
        console.log(`${statusIcon} ${typeIcon} ${task.type.toUpperCase()}`);
        console.log(`   ID: ${task.id}`);
        console.log(`   Estado: ${task.status}`);
        console.log(`   Programada para: ${task.scheduledFor.toLocaleString('es-ES')}`);
        if (task.topicId) {
          const topic = await repository.getTopic(task.topicId);
          if (topic) {
            console.log(`   Tema: ${topic.title}`);
          }
        }
        if (task.articleSlug) {
          console.log(`   Artículo: ${task.articleSlug}`);
        }
        if (task.completedAt) {
          console.log(`   Completada: ${task.completedAt.toLocaleString('es-ES')}`);
        }
        if (task.error) {
          console.log(`   Error: ${task.error}`);
        }
        console.log('');
      }
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

// Metrics Command
program
  .command('metrics')
  .description('Ver métricas generales de artículos')
  .option('-t, --top <number>', 'Número de artículos top a mostrar', '10')
  .option('-a, --analyze', 'Analizar patrones de rendimiento')
  .action(async (options) => {
    try {
      await initializeServices();
      
      if (options.analyze) {
        console.log('📊 Analizando patrones de rendimiento...\n');
        
        const analysis = await metricsTracker.analyzePerformance();
        
        console.log('═══════════════════════════════════════\n');
        
        console.log('🏆 Top 10 Artículos:');
        analysis.topPerformingArticles.forEach((article, index) => {
          console.log(`   ${index + 1}. ${article.slug}`);
          console.log(`      Puntuación: ${article.score.toFixed(2)}/100`);
          console.log(`      Visitas: ${article.metrics.views}`);
          console.log(`      Tiempo promedio: ${article.metrics.avgTimeOnPage}s`);
          console.log(`      Tasa de rebote: ${article.metrics.bounceRate}%`);
          console.log('');
        });
        
        console.log('📈 Patrones Comunes:');
        console.log(`   Temas exitosos: ${analysis.commonPatterns.successfulTopics.slice(0, 5).join(', ')}`);
        console.log(`   Categorías exitosas: ${analysis.commonPatterns.successfulCategories.slice(0, 3).join(', ')}`);
        console.log(`   Longitud óptima: ${analysis.commonPatterns.optimalWordCount} palabras`);
        console.log(`   Mejores horarios: ${analysis.commonPatterns.bestPublishTimes.join(', ')}\n`);
        
      } else {
        const topArticles = await metricsTracker.getTopArticles(parseInt(options.top));
        
        if (topArticles.length === 0) {
          console.log('📭 No hay métricas disponibles');
          return;
        }
        
        console.log(`\n📊 Top ${options.top} Artículos por Visitas\n`);
        console.log('═══════════════════════════════════════\n');
        
        topArticles.forEach((metrics, index) => {
          console.log(`${index + 1}. ${metrics.slug}`);
          console.log(`   Visitas: ${metrics.views}`);
          console.log(`   Tiempo promedio: ${metrics.avgTimeOnPage}s`);
          console.log(`   Tasa de rebote: ${metrics.bounceRate}%`);
          console.log(`   Compartidos: ${metrics.shares}`);
          console.log(`   Comentarios: ${metrics.comments}`);
          console.log(`   Última actualización: ${metrics.lastTracked.toLocaleString('es-ES')}`);
          console.log('');
        });
      }
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    } finally {
      await cleanup();
    }
  });

program.parse();
