# Update Manager

El Update Manager es responsable de identificar, actualizar y mantener el historial de cambios de artículos existentes en el blog.

## Características

### 1. Identificación de Candidatos para Actualización

El sistema identifica automáticamente artículos que necesitan actualización basándose en:

- **Edad del artículo**: Artículos más antiguos que un umbral configurable (por defecto 180 días)
- **Métricas de tráfico**: Prioriza artículos con alto número de visitas
- **Última actualización**: Considera la fecha de última modificación si existe

```typescript
const candidates = await updateManager.findUpdateCandidates(180); // Artículos > 180 días
```

### 2. Actualización de Artículos

El proceso de actualización incluye:

1. **Lectura del artículo existente**: Lee el archivo Markdown y parsea frontmatter
2. **Generación de contenido actualizado**: Usa IA para generar contenido mejorado
3. **Identificación de cambios**: Compara el contenido original con el actualizado
4. **Actualización del archivo**: Preserva el frontmatter original y actualiza el campo `updatedAt`
5. **Registro en base de datos**: Guarda el historial de cambios

```typescript
const update = await updateManager.updateArticle('slug-del-articulo');
console.log(`Cambios realizados: ${update.changes.length}`);
```

### 3. Historial de Actualizaciones

Mantiene un registro completo de todas las actualizaciones realizadas:

```typescript
const history = await updateManager.getUpdateHistory('slug-del-articulo');
history.forEach(update => {
  console.log(`Actualizado: ${update.updatedAt}`);
  update.changes.forEach(change => {
    console.log(`- [${change.type}] ${change.description}`);
  });
});
```

### 4. Programación Automática

Integración con el ContentScheduler para automatizar actualizaciones:

```typescript
// Programa actualizaciones para artículos que lo necesiten
await updateManager.scheduleUpdates(180, 5); // Edad mínima: 180 días, máximo: 5 artículos
```

## Tipos de Cambios Detectados

El sistema identifica tres tipos de cambios:

1. **added**: Nuevas secciones añadidas al artículo
2. **modified**: Secciones existentes que fueron modificadas
3. **removed**: Secciones que fueron eliminadas

## Estructura de Datos

### UpdateCandidate

```typescript
interface UpdateCandidate {
  slug: string;
  title: string;
  publishedAt: Date;
  lastUpdated?: Date;
  ageInDays: number;
  category: BlogCategorySlug;
  needsUpdate: boolean;
  updateReason: string;
}
```

### ArticleUpdate

```typescript
interface ArticleUpdate {
  slug: string;
  originalContent: string;
  updatedContent: string;
  changes: Array<{
    section: string;
    type: 'added' | 'modified' | 'removed';
    description: string;
  }>;
  updatedAt: Date;
}
```

## Uso

### Inicialización

```typescript
import { UpdateManager } from './update-manager';
import { Repository } from './database/repository';
import { AIContentGenerator } from './ai-generator';
import { ContentScheduler } from './scheduler';

const updateManager = new UpdateManager(
  repository,
  aiGenerator,
  scheduler // Opcional, solo si se necesita programación automática
);
```

### Encontrar Candidatos

```typescript
// Buscar artículos con más de 6 meses (180 días)
const candidates = await updateManager.findUpdateCandidates(180);

console.log(`Encontrados ${candidates.length} artículos para actualizar`);
candidates.forEach(candidate => {
  console.log(`- ${candidate.title} (${candidate.ageInDays} días)`);
});
```

### Actualizar un Artículo

```typescript
try {
  const result = await updateManager.updateArticle('slug-del-articulo');
  
  console.log('Artículo actualizado exitosamente');
  console.log(`Cambios realizados: ${result.changes.length}`);
  
  result.changes.forEach(change => {
    console.log(`- [${change.type}] ${change.description}`);
  });
} catch (error) {
  console.error('Error al actualizar artículo:', error);
}
```

### Consultar Historial

```typescript
const history = await updateManager.getUpdateHistory('slug-del-articulo');

if (history.length > 0) {
  console.log(`Historial de actualizaciones (${history.length} entradas):`);
  history.forEach((update, index) => {
    console.log(`\n${index + 1}. ${update.updatedAt.toISOString()}`);
    update.changes.forEach(change => {
      console.log(`   - ${change.description}`);
    });
  });
} else {
  console.log('No hay actualizaciones previas para este artículo');
}
```

### Programar Actualizaciones Automáticas

```typescript
// Programa actualizaciones para los 5 artículos más prioritarios
// que tengan más de 180 días
await updateManager.scheduleUpdates(180, 5);
```

## Script de Prueba

Ejecuta el script de prueba para verificar la funcionalidad:

```bash
npx tsx src/ai-blog-generator/scripts/test-update-manager.ts
```

Este script:
1. Busca candidatos para actualización
2. Muestra el historial de actualizaciones
3. Demuestra la programación de actualizaciones

## Integración con el Scheduler

El UpdateManager se integra con el ContentScheduler para ejecutar actualizaciones programadas:

```typescript
// En el scheduler, cuando se ejecuta una tarea de tipo 'update':
const updateManager = new UpdateManager(repository, aiGenerator);
await updateManager.updateArticle(task.article_slug);
```

## Consideraciones

### Preservación de Contenido

- El frontmatter original se preserva completamente
- Solo se actualiza el campo `updatedAt` y opcionalmente los metadatos SEO
- El contenido se reemplaza pero mantiene la estructura general

### Detección de Cambios

- La detección de cambios se basa en secciones (headers de Markdown)
- Compara títulos de secciones y contenido
- Calcula porcentaje de cambio para secciones modificadas

### Priorización

Los artículos se priorizan por:
1. **Tráfico**: Artículos con más visitas primero
2. **Edad**: Artículos más antiguos primero

### Límites

- Por defecto, se programan máximo 5 actualizaciones por ejecución
- Esto evita sobrecarga del sistema y costos excesivos de API

## Requisitos Implementados

- ✅ **6.1**: Identificar artículos con más de X días de antigüedad
- ✅ **6.2**: Actualizar información desactualizada en artículos existentes
- ✅ **6.3**: Añadir nuevas secciones con información relevante
- ✅ **6.4**: Actualizar la fecha de modificación del artículo
- ✅ **6.5**: Mantener un historial de cambios realizados

## Próximos Pasos

Para usar el UpdateManager en producción:

1. Configurar el scheduler para ejecutar actualizaciones periódicamente
2. Ajustar el umbral de edad según las necesidades del negocio
3. Monitorear las métricas de artículos para priorizar actualizaciones
4. Revisar manualmente las actualizaciones antes de publicar (opcional)
