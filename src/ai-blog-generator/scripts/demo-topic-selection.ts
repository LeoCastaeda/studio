#!/usr/bin/env node
/**
 * Demo Topic Selection Script
 * 
 * Demonstrates the complete topic selection workflow with different criteria.
 * Usage: npx tsx src/ai-blog-generator/scripts/demo-topic-selection.ts
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { TopicManager } from '../topic-manager';
import path from 'path';

async function main() {
  console.log('🎯 Topic Selection Demo\n');
  console.log('This demo shows how the Topic Manager selects topics based on different criteria.\n');

  const dbPath = path.join(process.cwd(), 'data', 'ai-blog-generator.db');
  const db = new DatabaseConnection(dbPath);
  
  try {
    await db.initialize();
    const repository = new Repository(db);
    const topicManager = new TopicManager(repository);

    // Scenario 1: High-priority topic for immediate publication
    console.log('📌 Scenario 1: Select high-priority topic for immediate publication');
    console.log('Criteria: High priority, avoid recent topics\n');
    
    const topic1 = await topicManager.selectNextTopic({
      avoidRecentTopics: true,
      preferSeasonal: false,
      preferHighPriority: true,
      categoryDistribution: false,
    });
    
    if (topic1) {
      console.log(`Selected: "${topic1.title}"`);
      console.log(`Category: ${topic1.category}`);
      console.log(`Priority: ${topic1.priority}`);
      console.log(`Tags: ${topic1.tags.join(', ')}`);
      console.log(`Keywords: ${topic1.keywords.join(', ')}\n`);
      
      // Simulate using this topic
      await topicManager.markTopicAsUsed(topic1.id);
      console.log('✓ Topic marked as used\n');
    }

    // Scenario 2: Seasonal topic for current month
    console.log('─'.repeat(60));
    console.log('\n🌦️  Scenario 2: Select seasonal topic for current month');
    console.log('Criteria: Prefer seasonal, high priority\n');
    
    const topic2 = await topicManager.selectNextTopic({
      avoidRecentTopics: true,
      preferSeasonal: true,
      preferHighPriority: true,
      categoryDistribution: false,
    });
    
    if (topic2) {
      console.log(`Selected: "${topic2.title}"`);
      console.log(`Category: ${topic2.category}`);
      console.log(`Seasonal: ${topic2.seasonal ? `Yes (months: ${topic2.seasonal.months.join(', ')})` : 'No'}`);
      console.log(`Priority: ${topic2.priority}\n`);
      
      await topicManager.markTopicAsUsed(topic2.id);
      console.log('✓ Topic marked as used\n');
    } else {
      console.log('No seasonal topics available for current month\n');
    }

    // Scenario 3: Balanced category distribution
    console.log('─'.repeat(60));
    console.log('\n⚖️  Scenario 3: Select topic with category balance');
    console.log('Criteria: Category distribution, avoid recent\n');
    
    const topic3 = await topicManager.selectNextTopic({
      avoidRecentTopics: true,
      preferSeasonal: false,
      preferHighPriority: false,
      categoryDistribution: true,
    });
    
    if (topic3) {
      console.log(`Selected: "${topic3.title}"`);
      console.log(`Category: ${topic3.category}`);
      console.log('(Selected to balance category distribution)\n');
      
      await topicManager.markTopicAsUsed(topic3.id);
      console.log('✓ Topic marked as used\n');
    }

    // Show statistics
    console.log('─'.repeat(60));
    console.log('\n📊 Current Statistics\n');
    
    const allTopics = await topicManager.getAvailableTopics();
    const usedTopics = allTopics.filter(t => t.lastUsed);
    const unusedTopics = allTopics.filter(t => !t.lastUsed);
    
    console.log(`Total topics: ${allTopics.length}`);
    console.log(`Used topics: ${usedTopics.length}`);
    console.log(`Unused topics: ${unusedTopics.length}`);
    
    // Category breakdown
    console.log('\nTopics by category:');
    const categoryCount = new Map<string, number>();
    allTopics.forEach(t => {
      categoryCount.set(t.category, (categoryCount.get(t.category) || 0) + 1);
    });
    
    categoryCount.forEach((count, category) => {
      const used = allTopics.filter(t => t.category === category && t.lastUsed).length;
      console.log(`  ${category}: ${count} total (${used} used, ${count - used} available)`);
    });
    
    // Seasonal topics
    const currentMonth = new Date().getMonth() + 1;
    const seasonalTopics = await topicManager.getSeasonalTopics(currentMonth);
    console.log(`\nSeasonal topics for current month: ${seasonalTopics.length}`);
    
    console.log('\n✅ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error in demo:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
