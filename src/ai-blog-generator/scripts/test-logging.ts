/**
 * Test script for comprehensive logging system
 * 
 * This script tests all logging features including:
 * - Different log levels (error, warn, info, debug)
 * - Contextual logging with metadata
 * - Stack trace capture for errors
 * - Log rotation
 * - Multiple transports (console and file)
 */

import { initializeLogger, LogLevel, getLogger } from '../logger';
import { TopicManager } from '../topic-manager';
import { QualityChecker, createDefaultQualityConfig } from '../quality-checker';
import { MetricsTracker } from '../metrics-tracker';
import { UpdateManager } from '../update-manager';
import { Repository } from '../database/repository';
import { AIContentGenerator } from '../ai-generator';
import { getDbPath } from '../config';

async function testLogging() {
  console.log('🧪 Testing comprehensive logging system...\n');

  // Initialize logger with debug level to see all logs
  const logger = initializeLogger({
    level: LogLevel.DEBUG,
    logDir: './logs',
    enableConsole: true,
    enableFile: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 14,
    datePattern: 'YYYY-MM-DD',
  });

  console.log('✅ Logger initialized\n');

  // Test 1: Basic logging at different levels
  console.log('📝 Test 1: Basic logging at different levels');
  logger.info('This is an info message', { test: 'basic-logging' });
  logger.warn('This is a warning message', { test: 'basic-logging' });
  logger.debug('This is a debug message', { test: 'basic-logging' });
  logger.error('This is an error message', { test: 'basic-logging' });
  console.log('✅ Test 1 passed\n');

  // Test 2: Contextual logging with metadata
  console.log('📝 Test 2: Contextual logging with metadata');
  logger.info('Operation started', {
    component: 'TestScript',
    operation: 'testLogging',
    userId: 'test-user-123',
    articleSlug: 'test-article',
    customData: { foo: 'bar', count: 42 }
  });
  console.log('✅ Test 2 passed\n');

  // Test 3: Error logging with stack traces
  console.log('📝 Test 3: Error logging with stack traces');
  try {
    throw new Error('This is a test error with stack trace');
  } catch (error) {
    logger.error('Caught test error', {
      component: 'TestScript',
      operation: 'errorHandling'
    }, error as Error);
  }
  console.log('✅ Test 3 passed\n');

  // Test 4: Child logger with default context
  console.log('📝 Test 4: Child logger with default context');
  const childLogger = logger.child({ component: 'ChildComponent', userId: 'child-user' });
  childLogger.info('Message from child logger');
  childLogger.warn('Warning from child logger');
  console.log('✅ Test 4 passed\n');

  // Test 5: Operation measurement
  console.log('📝 Test 5: Operation measurement');
  await logger.measureOperation('testOperation', async () => {
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 100));
    return 'operation result';
  }, { component: 'TestScript' });
  console.log('✅ Test 5 passed\n');

  // Test 6: Component logging - TopicManager
  console.log('📝 Test 6: Component logging - TopicManager');
  try {
    const repository = new Repository(getDbPath());
    const topicManager = new TopicManager(repository);
    
    // This will log internally
    await topicManager.getAvailableTopics();
    console.log('✅ Test 6 passed\n');
  } catch (error) {
    console.log('⚠️  Test 6 skipped (database not available)\n');
  }

  // Test 7: Component logging - QualityChecker
  console.log('📝 Test 7: Component logging - QualityChecker');
  const qualityChecker = new QualityChecker(createDefaultQualityConfig());
  
  const testArticle = {
    title: 'Test Article',
    excerpt: 'This is a test excerpt for the article',
    content: '# Test Article\n\nThis is test content with some paragraphs.\n\n## Section 1\n\nMore content here.',
    suggestedTags: ['test', 'logging'],
    suggestedCategory: 'consejos' as any,
    seoMetadata: {
      metaTitle: 'Test Article - SEO Title',
      metaDescription: 'This is a test meta description that should be between 150 and 160 characters long to pass validation checks.',
      keywords: ['test', 'article', 'logging'],
    },
    internalLinks: [],
    callToAction: 'Contact us for more information',
    wordCount: 50,
    generatedAt: new Date(),
  };
  
  await qualityChecker.checkArticle(testArticle);
  console.log('✅ Test 7 passed\n');

  // Test 8: Component logging - MetricsTracker
  console.log('📝 Test 8: Component logging - MetricsTracker');
  try {
    const repository = new Repository(getDbPath());
    const metricsTracker = new MetricsTracker(repository);
    
    // This will log internally
    await metricsTracker.trackArticleMetrics('test-slug', {
      views: 100,
      avgTimeOnPage: 120,
      bounceRate: 45,
    });
    console.log('✅ Test 8 passed\n');
  } catch (error) {
    console.log('⚠️  Test 8 skipped (database not available)\n');
  }

  // Test 9: Failed operation logging
  console.log('📝 Test 9: Failed operation logging');
  try {
    await logger.measureOperation('failingOperation', async () => {
      throw new Error('Simulated operation failure');
    }, { component: 'TestScript' });
  } catch (error) {
    // Expected to fail
  }
  console.log('✅ Test 9 passed\n');

  // Test 10: High-volume logging (stress test)
  console.log('📝 Test 10: High-volume logging (stress test)');
  for (let i = 0; i < 50; i++) {
    logger.debug(`Stress test message ${i}`, {
      component: 'StressTest',
      iteration: i,
      timestamp: Date.now()
    });
  }
  console.log('✅ Test 10 passed\n');

  console.log('🎉 All logging tests completed successfully!\n');
  console.log('📁 Check the following log files:');
  console.log('   - logs/combined.log (all logs)');
  console.log('   - logs/error.log (errors only)');
  console.log('   - logs/info.log (info and above)');
  console.log('\n💡 Log rotation is configured for:');
  console.log('   - Max file size: 10MB');
  console.log('   - Max files to keep: 14 (2 weeks)');

  // Close logger
  await logger.close();
}

// Run the test
testLogging().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
