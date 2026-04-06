#!/usr/bin/env node
/**
 * Seed Database Script
 * 
 * Seeds the database with initial topics for the AI blog generator.
 * Usage: npx tsx src/ai-blog-generator/scripts/seed-database.ts
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { TopicManager } from '../topic-manager';
import { seedTopics } from '../seed-topics';
import path from 'path';

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Initialize database connection
  const dbPath = path.join(process.cwd(), 'data', 'ai-blog-generator.db');
  const db = new DatabaseConnection(dbPath);
  
  try {
    await db.initialize();
    console.log('✓ Database initialized\n');

    // Create repository and topic manager
    const repository = new Repository(db);
    const topicManager = new TopicManager(repository);

    // Check if topics already exist
    const existingTopics = await topicManager.getAvailableTopics();
    if (existingTopics.length > 0) {
      console.log(`⚠️  Database already contains ${existingTopics.length} topics.`);
      console.log('Skipping seed to avoid duplicates.\n');
      return;
    }

    // Seed topics
    await seedTopics(topicManager);
    
    // Verify seeding
    const topics = await topicManager.getAvailableTopics();
    console.log(`\n✅ Successfully seeded ${topics.length} topics!`);
    
    // Show summary by category
    console.log('\n📊 Topics by category:');
    const categories = new Map<string, number>();
    topics.forEach(topic => {
      categories.set(topic.category, (categories.get(topic.category) || 0) + 1);
    });
    
    categories.forEach((count, category) => {
      console.log(`   ${category}: ${count} topics`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await db.close();
    console.log('\n✓ Database connection closed');
  }
}

main();
