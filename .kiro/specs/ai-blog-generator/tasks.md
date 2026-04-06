# Plan de Implementación - Generador Automático de Artículos con IA

- [x] 1. Configurar infraestructura base del proyecto
  - Crear estructura de directorios para el generador de IA
  - Configurar TypeScript y dependencias necesarias
  - Crear archivo de configuración de environment variables
  - _Requirements: 1.1, 1.2_

- [x] 2. Implementar base de datos y modelos
  - [x] 2.1 Crear schema de base de datos SQLite
    - Implementar tablas: topics, scheduled_tasks, generated_articles, article_metrics, article_updates, config
    - Crear índices para optimizar consultas
    - _Requirements: Todos_

  - [x] 2.2 Implementar capa de acceso a datos
    - Crear funciones CRUD para cada tabla
    - Implementar manejo de conexiones y transacciones
    - _Requirements: Todos_

  - [x]* 2.3 Escribir tests unitarios para la capa de datos
    - Test de creación, lectura, actualización y eliminación
    - Test de integridad referencial
    - _Requirements: Todos_

- [x] 3. Implementar Topic Manager
  - [x] 3.1 Crear clase TopicManager con métodos básicos
    - Implementar addTopic, getAvailableTopics, markTopicAsUsed
    - Implementar lógica de selección de temas
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Implementar filtros de selección de temas
    - Filtro de temas recientes (últimos 30 días)
    - Filtro de temas estacionales
    - Filtro de prioridad
    - _Requirements: 2.2, 2.3_

  - [x] 3.3 Crear seed de temas iniciales
    - Añadir 20-30 temas relacionados con cristales de automoción
    - Categorizar y etiquetar apropiadamente
    - _Requirements: 2.1_

  - [x] 3.4 Escribir property test para selección de temas
    - **Property 2: Topic Selection Uniqueness**
    - **Validates: Requirements 2.2**

- [x] 4. Implementar AI Content Generator
  - [x] 4.1 Crear integración con OpenAI API
    - Configurar cliente de OpenAI
    - Implementar método generateArticle
    - Manejar rate limiting y errores de API
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Crear sistema de prompts
    - Diseñar prompt template para generación de artículos
    - Incluir contexto sobre GlassNou y servicios
    - Configurar parámetros (temperature, max_tokens)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 4.3 Implementar generación de metadatos SEO
    - Generar meta title optimizado
    - Generar meta description (150-160 caracteres)
    - Sugerir keywords relevantes
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.4 Implementar generación de enlaces internos
    - Identificar oportunidades de enlaces a servicios
    - Generar enlaces a artículos relacionados
    - _Requirements: 5.5_

  - [x]* 4.5 Escribir tests unitarios para AI Generator


    - Mock de respuestas de OpenAI
    - Test de construcción de prompts
    - Test de parsing de respuestas
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Implementar Quality Checker
  - [x] 5.1 Crear validaciones básicas
    - Validar longitud de contenido (800-2000 palabras)
    - Validar presencia de secciones requeridas
    - Validar formato Markdown
    - _Requirements: 4.1, 4.2_

  - [x] 5.2 Implementar validación de SEO
    - Validar longitud de meta title (≤60 caracteres)
    - Validar longitud de meta description (150-160 caracteres)
    - Validar presencia de keywords
    - _Requirements: 5.1, 5.2_

  - [x] 5.3 Implementar sistema de scoring
    - Calcular score de calidad (0-100)
    - Identificar issues y warnings
    - Generar sugerencias de mejora
    - _Requirements: 4.2, 4.4_

  - [ ]* 5.4 Escribir property test para quality threshold


    - **Property 3: Content Quality Threshold**
    - **Validates: Requirements 4.2, 4.5**

  - [ ]* 5.5 Escribir property test para SEO metadata
    - **Property 4: SEO Metadata Completeness**
    - **Validates: Requirements 5.1, 5.2**

- [x] 6. Implementar Auto Publisher
  - [x] 6.1 Crear funcionalidad de guardado de archivos Markdown
    - Generar slug único basado en título
    - Formatear frontmatter con metadatos
    - Guardar archivo en content/blog/
    - _Requirements: 7.1, 7.2_

  - [x] 6.2 Implementar lógica de publicación vs borrador
    - Verificar configuración auto_publish
    - Establecer status correcto (draft/published)
    - Registrar en base de datos
    - _Requirements: 7.1, 7.4_

  - [x] 6.3 Implementar sistema de notificaciones
    - Enviar email cuando hay artículos pendientes de revisión
    - Notificar cuando se publica un artículo
    - _Requirements: 7.2_

  - [ ]* 6.4 Escribir property test para publication state
    - **Property 6: Publication State Consistency**
    - **Validates: Requirements 7.1, 7.2**

  - [x]* 6.5 Escribir tests unitarios para Publisher
    - Test de generación de slug
    - Test de formato de frontmatter
    - Test de guardado de archivos
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 7. Implementar Content Scheduler
  - [x] 7.1 Configurar sistema de cron jobs
    - Instalar y configurar node-cron
    - Crear tarea programada para generación
    - Implementar lógica de frecuencia configurable
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 7.2 Implementar gestión de tareas programadas
    - Crear, listar y cancelar tareas
    - Ejecutar tareas pendientes
    - Manejar errores en ejecución
    - _Requirements: 1.1, 1.5_

  - [x] 7.3 Implementar flujo completo de generación
    - Seleccionar tema → Generar contenido → Validar → Publicar
    - Manejar errores en cada paso
    - Registrar logs de ejecución
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 7.4 Escribir property test para scheduled generation
    - **Property 1: Scheduled Generation Consistency**
    - **Validates: Requirements 1.1, 1.3**

- [x] 8. Checkpoint - Verificar generación básica funciona
  - All core generation components are implemented and tested

- [x] 9. Implementar Update Manager





  - [x] 9.1 Implementar identificación de candidatos para actualización


    - Implementar findUpdateCandidates para buscar artículos con más de X días
    - Leer archivos Markdown existentes del directorio content/blog/
    - Calcular score de necesidad de actualización basado en edad y métricas
    - Priorizar artículos más visitados usando datos de article_metrics
    - _Requirements: 6.1_

  - [x] 9.2 Implementar actualización de artículos existentes


    - Implementar updateArticle para leer artículo existente usando fs
    - Parsear frontmatter y contenido del archivo Markdown
    - Generar contenido actualizado usando AIContentGenerator
    - Identificar y registrar cambios específicos (diff de contenido)
    - Actualizar archivo Markdown preservando frontmatter original
    - Actualizar campo updatedAt en frontmatter
    - _Requirements: 6.2, 6.3, 6.4_

  - [x] 9.3 Implementar historial de actualizaciones


    - Implementar getUpdateHistory para consultar cambios desde repository
    - Registrar cambios en tabla article_updates usando repository.createArticleUpdate
    - Incluir descripción de cambios realizados en formato JSON
    - _Requirements: 6.5_

  - [x] 9.4 Implementar scheduleUpdates para automatización


    - Integrar con ContentScheduler para programar actualizaciones
    - Crear tareas de tipo 'update' en scheduled_tasks usando repository
    - _Requirements: 6.1_

  - [ ]* 9.5 Escribir property test para update scheduling
    - **Property 5: Update Scheduling Correctness**
    - **Validates: Requirements 6.1**

- [x] 10. Implementar Metrics Tracker





  - [x] 10.1 Implementar tracking de métricas básicas


    - Implementar trackArticleMetrics para registrar/actualizar métricas
    - Usar repository.createArticleMetrics o repository.updateArticleMetrics
    - Implementar getArticleMetrics para consultar métricas usando repository
    - _Requirements: 8.1_

  - [x] 10.2 Implementar análisis de rendimiento


    - Implementar getTopArticles usando repository.getTopArticlesByViews
    - Implementar analyzePerformance para analizar patrones comunes
    - Generar insights sobre temas, categorías y longitud óptima
    - Identificar mejores horarios de publicación basado en métricas
    - _Requirements: 8.2, 8.3, 8.4_

  - [ ]* 10.3 Escribir property test para metrics tracking
    - **Property 7: Metrics Tracking Completeness**
    - **Validates: Requirements 8.1**

- [x] 11. Implementar CLI de administración
  - [x] 11.1 Configurar CLI framework y comandos básicos
    - Configurar commander.js para CLI
    - Implementar comando 'generate' para generar artículo manualmente
    - Implementar comando 'list' para listar artículos pendientes usando repository
    - Implementar comandos 'approve' y 'reject' para gestionar borradores usando AutoPublisher
    - _Requirements: 7.3_

  - [x] 11.2 Implementar comandos de gestión de temas
    - Implementar comando 'topics add' usando TopicManager.addTopic
    - Implementar comando 'topics list' usando TopicManager.getAvailableTopics
    - Implementar comando 'topics stats' para ver estadísticas de uso
    - _Requirements: 2.5_

  - [x] 11.3 Implementar comandos de configuración y monitoreo
    - Implementar comando 'config' para ver/editar configuración usando repository config methods
    - Implementar comando 'schedule' para ver próximas tareas usando ContentScheduler
    - Implementar comando 'metrics' para ver métricas generales usando MetricsTracker
    - _Requirements: 1.2_

- [x] 12. Implementar manejo robusto de errores
  - [x] 12.1 Completar ErrorHandler con retry logic
    - Implementar handleError con manejo contextual de errores
    - Implementar retryWithBackoff con exponential backoff
    - Configurar reintentos por tipo de error (API, DB, filesystem)
    - _Requirements: Todos_

  - [x] 12.2 Implementar logging comprehensivo








































    - Instalar winston o pino para logging estructurado
    - Log de todas las operaciones importantes con contexto
    - Log de errores con stack traces y contexto
    - Implementar rotación de logs
    - _Requirements: Todos_

  - [ ]* 12.3 Implementar notifyAdmin para alertas
    - Instalar nodemailer para envío de emails


    - Implementar envío de emails en errores críticos
    - Alertas cuando hay artículos pendientes de revisión
    - Configurar umbrales de alerta
    - _Requirements: 7.2_





- [x] 13. Checkpoint Final - Verificar sistema completo






















  - Ensure all tests pass, ask the user if questions arise.
