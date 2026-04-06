/**
 * Database schema definitions
 * 
 * SQL schema for the AI blog generator database.
 */

export const SCHEMA_SQL = `
-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,
  priority TEXT NOT NULL,
  seasonal_months TEXT,
  keywords TEXT NOT NULL,
  last_used DATETIME,
  times_used INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL
);

-- Scheduled tasks table
CREATE TABLE IF NOT EXISTS scheduled_tasks (
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
CREATE TABLE IF NOT EXISTS generated_articles (
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
CREATE TABLE IF NOT EXISTS article_metrics (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  avg_time_on_page REAL DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  last_tracked DATETIME NOT NULL
);

-- Article updates history
CREATE TABLE IF NOT EXISTS article_updates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  changes TEXT NOT NULL,
  updated_at DATETIME NOT NULL
);

-- Configuration table
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_status ON scheduled_tasks(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_scheduled_for ON scheduled_tasks(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_generated_articles_status ON generated_articles(status);
CREATE INDEX IF NOT EXISTS idx_generated_articles_slug ON generated_articles(slug);
`;
