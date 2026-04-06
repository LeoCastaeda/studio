# AI Blog Generator

Sistema de generación automática de contenido para el blog de GlassNou utilizando inteligencia artificial.

## Estructura del Proyecto

```
src/ai-blog-generator/
├── index.ts              # Punto de entrada principal
├── types.ts              # Definiciones de tipos TypeScript
├── config.ts             # Gestión de configuración
├── scheduler.ts          # Programación de tareas
├── topic-manager.ts      # Gestión de temas
├── ai-generator.ts       # Generación de contenido con IA
├── quality-checker.ts    # Validación de calidad
├── publisher.ts          # Publicación de artículos
├── update-manager.ts     # Actualización de artículos
├── metrics-tracker.ts    # Seguimiento de métricas
├── error-handler.ts      # Manejo de errores
└── database/
    ├── index.ts          # Exportaciones del módulo de base de datos
    ├── schema.ts         # Esquema de la base de datos
    └── connection.ts     # Gestión de conexiones
```

## Configuración

Todas las configuraciones se gestionan a través de variables de entorno. Consulta `.env.example` para ver todas las opciones disponibles.

### Variables de Entorno Requeridas

- `AI_PROVIDER`: Proveedor de IA (openai o anthropic)
- `OPENAI_API_KEY` o `ANTHROPIC_API_KEY`: Clave API del proveedor seleccionado

### Variables de Entorno Opcionales

Ver `.env.example` para la lista completa de configuraciones opcionales.

## Componentes

### ContentScheduler
Gestiona la programación de generación de artículos según la frecuencia configurada.

### TopicManager
Selecciona temas para artículos, evitando repeticiones y priorizando temas estacionales.

### AIContentGenerator
Genera contenido de artículos utilizando APIs de IA (OpenAI/Anthropic).

### QualityChecker
Valida la calidad del contenido generado antes de la publicación.

### AutoPublisher
Publica artículos en el sistema de blog como archivos Markdown.

### UpdateManager
Identifica y actualiza artículos antiguos con información nueva.

### MetricsTracker
Rastrea métricas de rendimiento de artículos publicados.

## Base de Datos

El sistema utiliza SQLite para almacenar:
- Temas disponibles
- Tareas programadas
- Artículos generados
- Métricas de artículos
- Historial de actualizaciones
- Configuración del sistema

## Estado de Implementación

✅ Infraestructura base configurada
✅ Base de datos y modelos implementados
✅ Topic Manager implementado
✅ AI Content Generator implementado
✅ Quality Checker implementado
✅ Auto Publisher implementado
✅ Content Scheduler implementado
⏳ Pendiente: Update Manager, Metrics Tracker, CLI

## Uso

### Iniciar el Scheduler

Para iniciar el scheduler en modo daemon:

```bash
npm run blog:start-scheduler
```

El scheduler se ejecutará continuamente según la configuración y generará artículos automáticamente.

### Probar el Scheduler

Para probar la funcionalidad del scheduler sin ejecutarlo continuamente:

```bash
npm run blog:test-scheduler
```

### Scripts Disponibles

- `npm run blog:start-scheduler` - Inicia el scheduler en modo daemon
- `npm run blog:test-scheduler` - Prueba la funcionalidad del scheduler
- `npm run blog:generate` - Genera un artículo manualmente (CLI - pendiente)
- `npm run blog:schedule` - Gestiona tareas programadas (CLI - pendiente)

## Próximos Pasos

1. ✅ ~~Implementar base de datos y modelos (Task 2)~~
2. ✅ ~~Implementar Topic Manager (Task 3)~~
3. ✅ ~~Implementar AI Content Generator (Task 4)~~
4. ✅ ~~Implementar Quality Checker (Task 5)~~
5. ✅ ~~Implementar Auto Publisher (Task 6)~~
6. ✅ ~~Implementar Content Scheduler (Task 7)~~
7. Implementar Update Manager (Task 9)
8. Implementar Metrics Tracker (Task 10)
9. Implementar CLI de administración (Task 11)

## Documentación

Para más detalles sobre el diseño y requisitos, consulta:
- `.kiro/specs/ai-blog-generator/requirements.md`
- `.kiro/specs/ai-blog-generator/design.md`
- `.kiro/specs/ai-blog-generator/tasks.md`
