#!/usr/bin/env node
/**
 * Test Topic Manager Script
 * 
 * Tests the TopicManager functionality with various selection criteria.
 * Usage: npx tsx src/ai-blog-generator/scripts/test-topic-manager.ts
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { TopicManager } from '../topic-manager';
import path from 'path';

async function main() {
  console.log('🧪 Testing Topic Manager...\n');

  const dbPath = path.join(process.cwd(), 'data', 'ai-blog-generator.db');
  const db = new DatabaseConnection(dbPath);
  
  try {
    await db.initialize();
    const repository = new Repository(db);
    const topicManager = new TopicManager(repository);

    // Test 1: Get all available topics
    console.log('Test 1: Get all available topics');
    const allTopics = await topicManager.getAvailableTopics();
    console.log(`✓ Found ${allTopics.length} available topics\n`);

    if (allTopics.length === 0) {
      console.log('⚠️  No topics found. Run seed-database.ts first.\n');
      return;
    }

    // Test 2: Select topic with default criteria
    console.log('Test 2: Select topic with default criteria');
    const topic1 = await topicManager.selectNextTopic({
      avoidRecentTopics: true,
      preferSeasonal: false,
      preferHighPriority: true,
      categoryDistribution: false,
    });
    if (topic1) {
      console.log(`✓ Selected: "${topic1.title}"`);
      console.log(`  Category: ${topic1.category}, Priority: ${topic1.priority}\n`);
    }

    // Test 3: Select seasonal topic
    console.log('Test 3: Select seasonal topic (current month)');
    const topic2 = await topicManager.selectNextTopic({
      avoidRecentTopics: false,
      preferSeasonal: true,
      preferHighPriority: false,
      categoryDistribution: false,
    });
    if (topic2) {
      console.log(`✓ Selected: "${topic2.title}"`);
      console.log(`  Seasonal: ${topic2.seasonal ? 'Yes' : 'No'}\n`);
    } else {
      console.log('✓ No seasonal topics for current month\n');
    }

    // Test 4: Get topics by category
    console.log('Test 4: Get topics by category (reparaciones)');
    const repairTopics = await topicManager.getTopicsByCategory('reparaciones');
    console.log(`✓ Found ${repairTopics.length} repair topics\n`);

    // Test 5: Get seasonal topics for summer (month 7 = July)
    console.log('Test 5: Get seasonal topics for summer (July)');
    const summerTopics = await topicManager.getSeasonalTopics(7);
    console.log(`✓ Found ${summerTopics.length} summer topics`);
    summerTopics.forEach(t => console.log(`   - ${t.title}`));
    console.log();

    // Test 6: Mark topic as used
    if (topic1) {
      console.log('Test 6: Mark topic as used');
      await topicManager.markTopicAsUsed(topic1.id);
      console.log(`✓ Marked "${topic1.title}" as used\n`);
    }

    // Test 7: Select with avoid recent topics
    console.log('Test 7: Select with avoid recent topics (should skip just-used topic)');
    const topic3 = await topicManager.selectNextTopic({
      avoidRecentTopics: true,
      preferSeasonal: false,
      preferHighPriority: true,
      categoryDistribution: false,
    });
    if (topic3) {
      console.log(`✓ Selected: "${topic3.title}"`);
      console.log(`  Different from previous: ${topic3.id !== topic1?.id}\n`);
    }

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing Topic Manager:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
