#!/usr/bin/env tsx
/**
 * Manual Article Update Script
 * 
 * This script manually triggers article updates for blog posts.
 * It will identify articles that need updating and update them immediately.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { Repository } from '../database/repository';
import { DatabaseConnection } from '../database/connection';
import { AIContentGenerator } from '../ai-generator';
import { UpdateManager } from '../update-manager';
import { loadAIConfig, getDatabasePath } from '../config';
import { getLogger } from '../logger';

const logger = getLogger();

async function main() {
  logger.info('Starting manual article update process');

  try {
    // Initialize database connection
    const dbPath = getDatabasePath();
    const dbConnection = new DatabaseConnection(dbPath);
    await dbConnection.initialize();
    
    // Initialize components
    const repository = new Repository(dbConnection);
    
    const aiConfig = loadAIConfig();
    const aiGenerator = new AIContentGenerator(aiConfig);
    
    const updateManager = new UpdateManager(repository, aiGenerator);

    // Find articles that need updating (using 0 days to get ALL articles)
    logger.info('Finding articles to update...');
    const candidates = await updateManager.findUpdateCandidates(0); // 0 days = all articles

    if (candidates.length === 0) {
      logger.info('No articles found to update');
      return;
    }

    logger.info(`Found ${candidates.length} article(s) to update`);
    
    // Display candidates
    console.log('\n📋 Articles to update:');
    candidates.forEach((candidate, index) => {
      console.log(`\n${index + 1}. ${candidate.title}`);
      console.log(`   Slug: ${candidate.slug}`);
      console.log(`   Age: ${candidate.ageInDays} days`);
      console.log(`   Category: ${candidate.category}`);
      console.log(`   Last updated: ${candidate.lastUpdated?.toLocaleDateString() || 'Never'}`);
    });

    // Ask for confirmation
    console.log('\n⚠️  This will update ALL articles using AI. Continue? (y/n)');
    
    // Update all articles that need updating
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < candidates.length; i++) {
      const articleToUpdate = candidates[i];
      
      console.log(`\n🔄 [${i + 1}/${candidates.length}] Updating article: ${articleToUpdate.title}...`);
      
      try {
        const update = await updateManager.updateArticle(articleToUpdate.slug);
        
        console.log('\n✅ Article updated successfully!');
        console.log(`\n📝 Changes made:`);
        update.changes.forEach((change, index) => {
          console.log(`${index + 1}. [${change.type.toUpperCase()}] ${change.description}`);
        });
        
        console.log(`\n📊 Statistics:`);
        console.log(`   Original word count: ${update.originalContent.split(/\s+/).length}`);
        console.log(`   Updated word count: ${update.updatedContent.split(/\s+/).length}`);
        console.log(`   Changes: ${update.changes.length}`);
        console.log(`   Updated at: ${update.updatedAt.toLocaleString()}`);
        
        successCount++;
        
        // Wait a bit between articles to respect rate limits
        if (i < candidates.length - 1) {
          console.log('\n⏳ Waiting 2 seconds before next article...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`\n❌ Failed to update article: ${error instanceof Error ? error.message : 'Unknown error'}`);
        logger.error('Failed to update article', { slug: articleToUpdate.slug }, error as Error);
        failCount++;
      }
    }

    console.log(`\n\n📈 Summary:`);
    console.log(`   Total articles: ${candidates.length}`);
    console.log(`   Successfully updated: ${successCount}`);
    console.log(`   Failed: ${failCount}`);

    logger.info('Manual article update completed', { successCount, failCount });

  } catch (error) {
    logger.error('Error during manual article update', {}, error as Error);
    console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
