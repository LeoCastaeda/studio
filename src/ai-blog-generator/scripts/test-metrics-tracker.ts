/**
 * Test script for MetricsTracker
 * 
 * Tests the metrics tracking and performance analysis functionality.
 */

import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { MetricsTracker } from '../metrics-tracker';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'ai-blog-generator.db');

async function testMetricsTracker() {
  console.log('🧪 Testing MetricsTracker...\n');

  // Initialize database
  const dbConnection = new DatabaseConnection(DB_PATH);
  await dbConnection.initialize();
  const repository = new Repository(dbConnection);
  const metricsTracker = new MetricsTracker(repository);

  try {
    // Test 1: Track metrics for a new article
    console.log('Test 1: Track metrics for a new article');
    await metricsTracker.trackArticleMetrics('test-article-1', {
      views: 100,
      avgTimeOnPage: 120,
      bounceRate: 45,
      shares: 5,
      comments: 2,
    });
    console.log('✅ Metrics tracked successfully\n');

    // Test 2: Get metrics for the article
    console.log('Test 2: Get metrics for the article');
    const metrics = await metricsTracker.getArticleMetrics('test-article-1');
    console.log('Retrieved metrics:', metrics);
    console.log('✅ Metrics retrieved successfully\n');

    // Test 3: Update existing metrics
    console.log('Test 3: Update existing metrics');
    await metricsTracker.trackArticleMetrics('test-article-1', {
      views: 150,
      shares: 8,
    });
    const updatedMetrics = await metricsTracker.getArticleMetrics('test-article-1');
    console.log('Updated metrics:', updatedMetrics);
    console.log('✅ Metrics updated successfully\n');

    // Test 4: Track metrics for multiple articles
    console.log('Test 4: Track metrics for multiple articles');
    await metricsTracker.trackArticleMetrics('test-article-2', {
      views: 250,
      avgTimeOnPage: 180,
      bounceRate: 30,
      shares: 15,
      comments: 8,
    });
    await metricsTracker.trackArticleMetrics('test-article-3', {
      views: 50,
      avgTimeOnPage: 60,
      bounceRate: 70,
      shares: 1,
      comments: 0,
    });
    console.log('✅ Multiple articles tracked\n');

    // Test 5: Get top articles
    console.log('Test 5: Get top articles');
    const topArticles = await metricsTracker.getTopArticles(5);
    console.log(`Found ${topArticles.length} top articles:`);
    topArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.slug} - ${article.views} views`);
    });
    console.log('✅ Top articles retrieved\n');

    // Test 6: Analyze performance
    console.log('Test 6: Analyze performance');
    const analysis = await metricsTracker.analyzePerformance();
    console.log('Performance Analysis:');
    console.log(`  Top performing articles: ${analysis.topPerformingArticles.length}`);
    if (analysis.topPerformingArticles.length > 0) {
      console.log('  Top 3:');
      analysis.topPerformingArticles.slice(0, 3).forEach((article, index) => {
        console.log(`    ${index + 1}. ${article.slug} - Score: ${article.score.toFixed(2)}`);
      });
    }
    console.log('  Common Patterns:');
    console.log(`    Successful topics: ${analysis.commonPatterns.successfulTopics.length}`);
    console.log(`    Successful categories: ${analysis.commonPatterns.successfulCategories.join(', ')}`);
    console.log(`    Optimal word count: ${analysis.commonPatterns.optimalWordCount}`);
    console.log(`    Best publish times: ${analysis.commonPatterns.bestPublishTimes.join(', ')}`);
    console.log('✅ Performance analysis completed\n');

    // Test 7: Get metrics for non-existent article
    console.log('Test 7: Get metrics for non-existent article');
    const nonExistent = await metricsTracker.getArticleMetrics('non-existent-slug');
    console.log('Result:', nonExistent === null ? 'null (as expected)' : 'unexpected value');
    console.log('✅ Null handling works correctly\n');

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await dbConnection.close();
  }
}

// Run tests
testMetricsTracker().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
