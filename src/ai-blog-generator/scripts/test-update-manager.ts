/**
 * Test script for UpdateManager
 * 
 * Tests the article update functionality
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { UpdateManager } from '../update-manager';
import { AIContentGenerator } from '../ai-generator';
import { AIProviderConfig } from '../types';

async function main() {
  console.log('=== Testing UpdateManager ===\n');

  // Initialize database
  const dbPath = process.env.DATABASE_PATH || './data/ai-blog-generator.db';
  const db = new DatabaseConnection(dbPath);
  await db.initialize();
  const repository = new Repository(db);

  // Initialize AI Generator (with dummy config for testing)
  const aiConfig: AIProviderConfig = {
    provider: (process.env.AI_PROVIDER as 'openai' | 'anthropic') || 'openai',
    model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || 'dummy-key-for-testing',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
  };

  const hasRealApiKey = !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
  if (!hasRealApiKey) {
    console.log('Note: Running in test mode without real API key');
    console.log('Some features that require AI generation will be skipped.\n');
  }

  const aiGenerator = new AIContentGenerator(aiConfig);
  const updateManager = new UpdateManager(repository, aiGenerator);

  try {
    // Test 1: Find update candidates
    console.log('Test 1: Finding update candidates (articles older than 30 days)...');
    const candidates = await updateManager.findUpdateCandidates(30);
    
    console.log(`\nFound ${candidates.length} candidates for update:`);
    candidates.forEach((candidate, index) => {
      console.log(`\n${index + 1}. ${candidate.title}`);
      console.log(`   Slug: ${candidate.slug}`);
      console.log(`   Category: ${candidate.category}`);
      console.log(`   Age: ${candidate.ageInDays} days`);
      console.log(`   Published: ${candidate.publishedAt.toISOString().split('T')[0]}`);
      if (candidate.lastUpdated) {
        console.log(`   Last Updated: ${candidate.lastUpdated.toISOString().split('T')[0]}`);
      }
      console.log(`   Reason: ${candidate.updateReason}`);
    });

    if (candidates.length === 0) {
      console.log('\nNo articles need updating. Try reducing the minAgeInDays parameter.');
      console.log('\nTest 2: Finding candidates with lower threshold (7 days)...');
      const recentCandidates = await updateManager.findUpdateCandidates(7);
      console.log(`Found ${recentCandidates.length} candidates with 7-day threshold`);
      
      if (recentCandidates.length > 0) {
        console.log('\nFirst candidate:');
        const first = recentCandidates[0];
        console.log(`  ${first.title} (${first.ageInDays} days old)`);
      }
    }

    // Test 2: Get update history for an article
    if (candidates.length > 0) {
      const firstCandidate = candidates[0];
      console.log(`\n\nTest 2: Getting update history for "${firstCandidate.title}"...`);
      const history = await updateManager.getUpdateHistory(firstCandidate.slug);
      
      if (history.length > 0) {
        console.log(`\nFound ${history.length} previous updates:`);
        history.forEach((update, index) => {
          console.log(`\n${index + 1}. Updated: ${update.updatedAt.toISOString()}`);
          console.log(`   Changes:`);
          update.changes.forEach(change => {
            console.log(`   - [${change.type}] ${change.description}`);
          });
        });
      } else {
        console.log('\nNo previous updates found for this article.');
      }
    }

    // Test 3: Demonstrate update scheduling (without actually executing)
    console.log('\n\nTest 3: Demonstrating update scheduling...');
    console.log('Note: This would schedule updates but we are not executing them in this test.');
    console.log('To actually update articles, use the scheduler or call updateArticle() directly.');
    
    if (candidates.length > 0) {
      console.log(`\nWould schedule updates for ${Math.min(candidates.length, 5)} articles:`);
      candidates.slice(0, 5).forEach((candidate, index) => {
        console.log(`${index + 1}. ${candidate.slug} - ${candidate.updateReason}`);
      });
    }

    console.log('\n\n=== UpdateManager Tests Completed Successfully ===');
  } catch (error) {
    console.error('\n\nError during testing:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
