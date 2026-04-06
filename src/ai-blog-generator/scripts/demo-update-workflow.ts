/**
 * Demo script for UpdateManager workflow
 * 
 * Demonstrates the complete article update workflow:
 * 1. Find candidates
 * 2. Schedule updates
 * 3. Execute updates (if API key is available)
 * 4. View update history
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { UpdateManager } from '../update-manager';
import { AIContentGenerator } from '../ai-generator';
import { ContentScheduler } from '../scheduler';
import { TopicManager } from '../topic-manager';
import { QualityChecker } from '../quality-checker';
import { AutoPublisher } from '../publisher';
import { AIProviderConfig, SchedulerConfig } from '../types';

async function main() {
  console.log('=== UpdateManager Workflow Demo ===\n');

  // Initialize database
  const dbPath = process.env.DATABASE_PATH || './data/ai-blog-generator.db';
  const db = new DatabaseConnection(dbPath);
  await db.initialize();
  const repository = new Repository(db);

  // Check for API key
  const hasApiKey = !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
  
  if (!hasApiKey) {
    console.log('⚠️  No API key found. Running in demo mode.');
    console.log('To actually update articles, set OPENAI_API_KEY or ANTHROPIC_API_KEY\n');
  }

  // Initialize AI Generator
  const aiConfig: AIProviderConfig = {
    provider: (process.env.AI_PROVIDER as 'openai' | 'anthropic') || 'openai',
    model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || 'demo-key',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
  };

  const aiGenerator = new AIContentGenerator(aiConfig);

  // Initialize other components for scheduler
  const topicManager = new TopicManager(repository);
  const qualityChecker = new QualityChecker();
  const publisher = new AutoPublisher(repository);

  const schedulerConfig: SchedulerConfig = {
    frequency: 'custom',
    customDays: 7,
    publishTime: '09:00',
    timezone: 'Europe/Madrid',
    enabled: true,
  };

  const scheduler = new ContentScheduler(
    schedulerConfig,
    repository,
    topicManager,
    aiGenerator,
    qualityChecker,
    publisher
  );

  const updateManager = new UpdateManager(repository, aiGenerator, scheduler);

  try {
    // Step 1: Find update candidates
    console.log('📋 Step 1: Finding articles that need updating...\n');
    const minAge = 30; // Articles older than 30 days
    const candidates = await updateManager.findUpdateCandidates(minAge);
    
    if (candidates.length === 0) {
      console.log(`No articles found older than ${minAge} days.`);
      console.log('Try reducing the age threshold or add more articles to your blog.\n');
      return;
    }

    console.log(`Found ${candidates.length} articles needing update:\n`);
    candidates.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.title}`);
      console.log(`   📅 Age: ${candidate.ageInDays} days`);
      console.log(`   📂 Category: ${candidate.category}`);
      console.log(`   💡 Reason: ${candidate.updateReason}\n`);
    });

    // Step 2: Schedule updates
    console.log('📅 Step 2: Scheduling updates...\n');
    const maxUpdates = 2; // Limit to 2 for demo
    await updateManager.scheduleUpdates(minAge, maxUpdates);
    
    console.log(`✅ Scheduled ${Math.min(candidates.length, maxUpdates)} updates\n`);

    // Step 3: Check scheduled tasks
    console.log('📋 Step 3: Viewing scheduled update tasks...\n');
    const upcomingTasks = await scheduler.getUpcomingTasks(10);
    const updateTasks = upcomingTasks.filter(t => t.type === 'update');
    
    if (updateTasks.length > 0) {
      console.log(`Found ${updateTasks.length} scheduled update tasks:\n`);
      updateTasks.forEach((task, index) => {
        console.log(`${index + 1}. Article: ${task.articleSlug}`);
        console.log(`   Status: ${task.status}`);
        console.log(`   Scheduled: ${task.scheduledFor.toISOString()}\n`);
      });
    } else {
      console.log('No update tasks scheduled.\n');
    }

    // Step 4: Execute updates (only if API key is available)
    if (hasApiKey && candidates.length > 0) {
      console.log('🚀 Step 4: Executing article update...\n');
      console.log('⚠️  This will use AI API credits. Updating first article...\n');
      
      const firstCandidate = candidates[0];
      console.log(`Updating: ${firstCandidate.title}\n`);
      
      try {
        const result = await updateManager.updateArticle(firstCandidate.slug);
        
        console.log('✅ Article updated successfully!\n');
        console.log(`Changes made (${result.changes.length}):`);
        result.changes.forEach((change, index) => {
          const icon = change.type === 'added' ? '➕' : change.type === 'removed' ? '➖' : '✏️';
          console.log(`${index + 1}. ${icon} ${change.description}`);
        });
        console.log();

        // Step 5: View update history
        console.log('📜 Step 5: Viewing update history...\n');
        const history = await updateManager.getUpdateHistory(firstCandidate.slug);
        
        console.log(`Update history for "${firstCandidate.title}":`);
        console.log(`Total updates: ${history.length}\n`);
        
        if (history.length > 0) {
          history.forEach((update, index) => {
            console.log(`Update #${index + 1} - ${update.updatedAt.toISOString()}`);
            update.changes.forEach(change => {
              console.log(`  - ${change.description}`);
            });
            console.log();
          });
        }
      } catch (error) {
        console.error('❌ Error updating article:', error);
      }
    } else if (!hasApiKey) {
      console.log('⏭️  Step 4: Skipped (no API key available)\n');
      console.log('To execute updates, set your API key and run again.\n');
    }

    console.log('=== Demo Completed ===\n');
    console.log('Summary:');
    console.log(`- Found ${candidates.length} articles needing update`);
    console.log(`- Scheduled ${Math.min(candidates.length, maxUpdates)} updates`);
    if (hasApiKey && candidates.length > 0) {
      console.log('- Executed 1 article update');
    }
    console.log('\nNext steps:');
    console.log('1. Review updated articles in content/blog/');
    console.log('2. Check the database for update history');
    console.log('3. Configure scheduler to run updates automatically');
    
  } catch (error) {
    console.error('\n❌ Error during demo:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
