# Documento de Diseño - Generador Automático de Artículos con IA

## Overview

El sistema de generación automática de artículos utilizará una arquitectura basada en servicios que integra APIs de IA (OpenAI/Anthropic), un sistema de programación de tareas (cron jobs), y una base de datos para gestionar temas, artículos y métricas. El sistema se ejecutará como un proceso independiente que interactúa con el sistema de blog existente basado en archivos Markdown.

## Architecture

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Blog Generator System                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Scheduler  │───▶│Topic Manager │───▶│AI Generator  │  │
│  │   (Cron)     │    │              │    │  (OpenAI)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Database   │◀───│Quality Check │◀───│  Publisher   │  │
│  │  (SQLite)    │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                         │          │
│         ▼                                         ▼          │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │   Metrics    │                        │   Markdown   │  │
│  │   Tracker    │                        │    Files     │  │
│  └──────────────┘                        └──────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Scheduler** ejecuta tareas programadas
2. **Topic Manager** selecciona el próximo tema
3. **AI Generator** crea el contenido del artículo
4. **Quality Checker** valida el contenido
5. **Publisher** guarda el artículo como Markdown
6. **Metrics Tracker** registra métricas de rendimiento

## Components and Interfaces

### 1. Content Scheduler

**Responsabilidad:** Gestionar la programación de generación de artículos

```typescript
interface SchedulerConfig {
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number; // Para frecuencia custom
  publishTime: string; // HH:MM formato 24h
  timezone: string;
  enabled: boolean;
}

interface ScheduledTask {
  id: string;
  type: 'generate' | 'update';
  scheduledFor: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  topicId?: string;
  articleSlug?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

class ContentScheduler {
  async scheduleNextGeneration(): Promise<ScheduledTask>;
  async scheduleArticleUpdate(articleSlug: string): Promise<ScheduledTask>;
  async executePendingTasks(): Promise<void>;
  async getUpcomingTasks(): Promise<ScheduledTask[]>;
  async cancelTask(taskId: string): Promise<void>;
}
```

### 2. Topic Manager

**Responsabilidad:** Gestionar y seleccionar temas para artículos

```typescript
interface Topic {
  id: string;
  title: string;
  category: BlogCategory;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  seasonal?: {
    months: number[]; // 1-12
  };
  keywords: string[];
  lastUsed?: Date;
  timesUsed: number;
  status: 'active' | 'used' | 'archived';
  createdAt: Date;
}

interface TopicSelectionCriteria {
  avoidRecentTopics: boolean; // No repetir temas de últimos 30 días
  preferSeasonal: boolean; // Priorizar temas de temporada
  preferHighPriority: boolean;
  categoryDistribution: boolean; // Balancear categorías
}

class TopicManager {
  async selectNextTopic(criteria: TopicSelectionCriteria): Promise<Topic>;
  async addTopic(topic: Omit<Topic, 'id' | 'createdAt'>): Promise<Topic>;
  async getAvailableTopics(): Promise<Topic[]>;
  async markTopicAsUsed(topicId: string): Promise<void>;
  async getTopicsByCategory(category: BlogCategory): Promise<Topic[]>;
  async getSeasonalTopics(month: number): Promise<Topic[]>;
}
```

### 3. AI Content Generator

**Responsabilidad:** Generar contenido de artículos usando IA

```typescript
interface GenerationPrompt {
  topic: Topic;
  targetWordCount: number;
  tone: 'professional' | 'casual' | 'technical';
  includeCallToAction: boolean;
  relatedServices: string[]; // IDs de servicios de GlassNou
  context?: string; // Contexto adicional
}

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string; // Markdown format
  suggestedTags: string[];
  suggestedCategory: BlogCategory;
  seoMetadata: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  internalLinks: Array<{
    text: string;
    url: string;
  }>;
  callToAction: string;
  wordCount: number;
  generatedAt: Date;
}

interface AIProviderConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

class AIContentGenerator {
  constructor(config: AIProviderConfig);
  
  async generateArticle(prompt: GenerationPrompt): Promise<GeneratedArticle>;
  async improveContent(content: string, feedback: string): Promise<string>;
  async generateMetaDescription(title: string, excerpt: string): Promise<string>;
  async suggestTags(content: string): Promise<string[]>;
  async generateSEOTitle(topic: string): Promise<string>;
}
```

### 4. Quality Checker

**Responsabilidad:** Validar calidad del contenido generado

```typescript
interface QualityCheckResult {
  passed: boolean;
  score: number; // 0-100
  issues: QualityIssue[];
  warnings: string[];
  suggestions: string[];
}

interface QualityIssue {
  type: 'plagiarism' | 'factual_error' | 'poor_structure' | 'seo_issue' | 'tone_mismatch';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: string; // Sección del artículo
}

interface QualityCheckConfig {
  minWordCount: number;
  maxWordCount: number;
  requireCallToAction: boolean;
  requireInternalLinks: boolean;
  minReadabilityScore: number;
  checkPlagiarism: boolean;
  checkFactualAccuracy: boolean;
}

class QualityChecker {
  async checkArticle(article: GeneratedArticle, config: QualityCheckConfig): Promise<QualityCheckResult>;
  async checkPlagiarism(content: string): Promise<boolean>;
  async checkReadability(content: string): Promise<number>;
  async validateSEO(metadata: GeneratedArticle['seoMetadata']): Promise<QualityIssue[]>;
  async checkStructure(content: string): Promise<QualityIssue[]>;
}
```

### 5. Auto Publisher

**Responsabilidad:** Publicar artículos en el sistema de blog

```typescript
interface PublishConfig {
  autoPublish: boolean; // Si false, guarda como borrador
  requireManualReview: boolean;
  notifyOnPublish: boolean;
  notificationEmail?: string;
}

interface PublishedArticle {
  slug: string;
  filePath: string;
  publishedAt: Date;
  status: 'draft' | 'published';
  reviewStatus?: 'pending' | 'approved' | 'rejected';
}

class AutoPublisher {
  async publishArticle(
    article: GeneratedArticle,
    topic: Topic,
    config: PublishConfig
  ): Promise<PublishedArticle>;
  
  async saveDraft(article: GeneratedArticle, topic: Topic): Promise<PublishedArticle>;
  async approveDraft(slug: string): Promise<void>;
  async rejectDraft(slug: string, reason: string): Promise<void>;
  async getPendingReviews(): Promise<PublishedArticle[]>;
  async sendNotification(article: PublishedArticle): Promise<void>;
}
```

### 6. Update Manager

**Responsabilidad:** Actualizar artículos existentes

```typescript
interface UpdateCandidate {
  slug: string;
  title: string;
  publishedAt: Date;
  lastUpdated?: Date;
  ageInDays: number;
  category: BlogCategory;
  needsUpdate: boolean;
  updateReason: string;
}

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

class UpdateManager {
  async findUpdateCandidates(minAgeInDays: number): Promise<UpdateCandidate[]>;
  async updateArticle(slug: string): Promise<ArticleUpdate>;
  async getUpdateHistory(slug: string): Promise<ArticleUpdate[]>;
  async scheduleUpdates(): Promise<void>;
}
```

### 7. Metrics Tracker

**Responsabilidad:** Rastrear métricas de artículos

```typescript
interface ArticleMetrics {
  slug: string;
  views: number;
  avgTimeOnPage: number; // segundos
  bounceRate: number; // porcentaje
  shares: number;
  comments: number;
  lastTracked: Date;
}

interface PerformanceAnalysis {
  topPerformingArticles: Array<{
    slug: string;
    score: number;
    metrics: ArticleMetrics;
  }>;
  commonPatterns: {
    successfulTopics: string[];
    successfulCategories: BlogCategory[];
    optimalWordCount: number;
    bestPublishTimes: string[];
  };
}

class MetricsTracker {
  async trackArticleMetrics(slug: string, metrics: Partial<ArticleMetrics>): Promise<void>;
  async getArticleMetrics(slug: string): Promise<ArticleMetrics | null>;
  async analyzePerformance(): Promise<PerformanceAnalysis>;
  async getTopArticles(limit: number): Promise<ArticleMetrics[]>;
}
```

## Data Models

### Database Schema (SQLite)

```sql
-- Topics table
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL, -- JSON array
  priority TEXT NOT NULL,
  seasonal_months TEXT, -- JSON array
  keywords TEXT NOT NULL, -- JSON array
  last_used DATETIME,
  times_used INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL
);

-- Scheduled tasks table
CREATE TABLE scheduled_tasks (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  scheduled_for DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  topic_id TEXT,
  article_slug TEXT,
  created_at DATETIME NOT NULL,
  completed_at DATETIME,
  error TEXT,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Generated articles table
CREATE TABLE generated_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  review_status TEXT,
  quality_score REAL,
  word_count INTEGER,
  generated_at DATETIME NOT NULL,
  published_at DATETIME,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Article metrics table
CREATE TABLE article_metrics (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  avg_time_on_page REAL DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  last_tracked DATETIME NOT NULL
);

-- Article updates history
CREATE TABLE article_updates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  changes TEXT NOT NULL, -- JSON array
  updated_at DATETIME NOT NULL
);

-- Configuration table
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME NOT NULL
);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Scheduled Generation Consistency
*For any* configured schedule, the system should generate articles at the specified frequency without skipping scheduled dates or generating multiple articles on the same day (unless explicitly configured).
**Validates: Requirements 1.1, 1.3**

### Property 2: Topic Selection Uniqueness
*For any* 30-day period, the system should not select the same topic twice, ensuring content variety.
**Validates: Requirements 2.2**

### Property 3: Content Quality Threshold
*For any* generated article, if the quality score is below the configured threshold, the article should be saved as a draft requiring manual review rather than auto-published.
**Validates: Requirements 4.2, 4.5**

### Property 4: SEO Metadata Completeness
*For any* generated article, the SEO metadata (title, description, keywords) should be present and within valid length constraints (title ≤ 60 chars, description 150-160 chars).
**Validates: Requirements 5.1, 5.2**

### Property 5: Update Scheduling Correctness
*For any* article older than the configured threshold (e.g., 6 months), the system should identify it as an update candidate and schedule an update task.
**Validates: Requirements 6.1**

### Property 6: Publication State Consistency
*For any* article, if auto-publish is disabled, the article should be saved with status 'draft' and review_status 'pending', never directly as 'published'.
**Validates: Requirements 7.1, 7.2**

### Property 7: Metrics Tracking Completeness
*For any* published article, the system should create a corresponding metrics entry with initial values, ensuring no published article lacks tracking data.
**Validates: Requirements 8.1**

## Error Handling

### Error Categories

1. **API Errors** (OpenAI/Anthropic)
   - Rate limiting: Implement exponential backoff
   - API failures: Retry up to 3 times
   - Invalid responses: Log and notify admin

2. **Database Errors**
   - Connection failures: Retry with backoff
   - Constraint violations: Log and skip
   - Data corruption: Backup and restore

3. **File System Errors**
   - Write failures: Retry and notify
   - Permission issues: Log and alert admin
   - Disk space: Check before writing

4. **Quality Check Failures**
   - Low quality score: Save as draft
   - Plagiarism detected: Reject and regenerate
   - Factual errors: Flag for manual review

### Error Recovery Strategy

```typescript
interface ErrorRecoveryConfig {
  maxRetries: number;
  retryDelay: number; // milliseconds
  backoffMultiplier: number;
  notifyOnFailure: boolean;
  fallbackBehavior: 'skip' | 'retry_later' | 'manual_intervention';
}

class ErrorHandler {
  async handleError(error: Error, context: string, config: ErrorRecoveryConfig): Promise<void>;
  async retryWithBackoff<T>(fn: () => Promise<T>, config: ErrorRecoveryConfig): Promise<T>;
  async logError(error: Error, context: string): Promise<void>;
  async notifyAdmin(error: Error, context: string): Promise<void>;
}
```

## Testing Strategy

### Unit Tests

- **Topic Manager**: Test topic selection logic, seasonal filtering, priority handling
- **AI Generator**: Mock API responses, test prompt construction
- **Quality Checker**: Test validation rules, scoring algorithm
- **Publisher**: Test file creation, metadata formatting
- **Scheduler**: Test cron logic, task execution

### Integration Tests

- **End-to-end generation**: Topic selection → Generation → Quality check → Publishing
- **Update workflow**: Identify candidates → Generate updates → Apply changes
- **Error scenarios**: API failures, database errors, file system issues

### Property-Based Tests

Each correctness property will be implemented as a property-based test using a testing framework appropriate for the language (e.g., fast-check for TypeScript).

## Implementation Notes

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Database**: SQLite (simple, file-based, no server required)
- **AI Provider**: OpenAI GPT-4 or Anthropic Claude
- **Scheduler**: node-cron or node-schedule
- **Markdown**: gray-matter, remark, rehype
- **Testing**: Vitest + fast-check (for property-based testing)

### Environment Variables

```env
# AI Provider
AI_PROVIDER=openai # or anthropic
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_MODEL=gpt-4-turbo-preview
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=4000

# Scheduler
SCHEDULE_ENABLED=true
SCHEDULE_FREQUENCY=custom
SCHEDULE_CUSTOM_DAYS=5
SCHEDULE_PUBLISH_TIME=09:00
SCHEDULE_TIMEZONE=Europe/Madrid

# Publisher
AUTO_PUBLISH=false
REQUIRE_MANUAL_REVIEW=true
NOTIFICATION_EMAIL=admin@glassnou.com

# Quality
MIN_WORD_COUNT=800
MAX_WORD_COUNT=2000
MIN_QUALITY_SCORE=75
CHECK_PLAGIARISM=true

# Database
DATABASE_PATH=./data/ai-blog-generator.db

# Paths
BLOG_CONTENT_PATH=./content/blog
```

### Security Considerations

1. **API Keys**: Store in environment variables, never commit
2. **Rate Limiting**: Implement to avoid excessive API costs
3. **Input Validation**: Sanitize all user inputs
4. **File Permissions**: Restrict write access to blog directory
5. **Database**: Use parameterized queries to prevent SQL injection

### Performance Optimization

1. **Caching**: Cache topic lists and article metadata
2. **Batch Processing**: Process multiple tasks in parallel when possible
3. **Lazy Loading**: Load articles on-demand
4. **Database Indexing**: Index frequently queried columns
5. **API Optimization**: Minimize API calls, use streaming when available
