/**
 * Property-based tests for Topic Manager
 * 
 * **Feature: ai-blog-generator, Property 2: Topic Selection Uniqueness**
 * **Validates: Requirements 2.2**
 * 
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { DatabaseConnection } from '../database/connection';
import { Repository } from '../database/repository';
import { TopicManager } from '../topic-manager';
import { Topic, TopicSelectionCriteria } from '../types';
import * as fs from 'fs';
import * as path from 'path';

describe('TopicManager - Property-Based Tests', () => {
  const testDbPath = path.join(__dirname, 'topic-manager-property-test.db');
  let db: DatabaseConnection;
  let repo: Repository;
  let topicManager: TopicManager;

  beforeEach(async () => {
    // Clean up any existing test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    db = new DatabaseConnection(testDbPath);
    await db.initialize();
    repo = new Repository(db);
    topicManager = new TopicManager(repo);
  });

  afterEach(async () => {
    await db.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  /**
   * Property 2: Topic Selection Uniqueness
   * 
   * For any 30-day period, the system should not select the same topic twice,
   * ensuring content variety.
   * 
   * This property tests that when avoidRecentTopics is enabled, topics used
   * within the last 30 days are not selected again.
   */
  describe('Property 2: Topic Selection Uniqueness', () => {
    it('should not select the same topic twice within 30 days when avoidRecentTopics is enabled', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate a list of topics (between 2 and 10 topics)
          fc.array(
            fc.record({
              title: fc.string({ minLength: 5, maxLength: 50 }),
              category: fc.constantFrom('reparacion', 'mantenimiento', 'instalacion', 'noticias'),
              tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
              priority: fc.constantFrom('low', 'medium', 'high'),
              keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          // Generate number of days ago the topic was last used (0-29 days for recent, 30+ for old)
          fc.integer({ min: 0, max: 60 }),
          async (topicData, daysAgo) => {
            // Clean database before each property test iteration
            await db.execute('DELETE FROM topics');
            await db.execute('DELETE FROM generated_articles');
            
            // Create topics in the database
            const createdTopics: Topic[] = [];
            for (const data of topicData) {
              const topic = await topicManager.addTopic({
                title: data.title,
                category: data.category as any,
                tags: data.tags,
                priority: data.priority as any,
                keywords: data.keywords,
              });
              createdTopics.push(topic);
            }

            // Select at least 2 topics to test
            if (createdTopics.length < 2) {
              return; // Skip if we don't have enough topics
            }

            // Mark the first topic as used X days ago
            const firstTopic = createdTopics[0];
            await topicManager.markTopicAsUsed(firstTopic.id);
            
            // Manually update the last_used date to simulate it being used X days ago
            const lastUsedDate = new Date();
            lastUsedDate.setDate(lastUsedDate.getDate() - daysAgo);
            await repo.updateTopic(firstTopic.id, {
              last_used: lastUsedDate.toISOString(),
            });

            // Now select the next topic with avoidRecentTopics enabled
            const criteria: TopicSelectionCriteria = {
              avoidRecentTopics: true,
              preferSeasonal: false,
              preferHighPriority: false,
              categoryDistribution: false,
            };

            const selectedTopic = await topicManager.selectNextTopic(criteria);

            // Property: If the first topic was used within the last 30 days,
            // it should NOT be selected again
            if (daysAgo < 30) {
              // Topic was used recently, should not be selected
              if (selectedTopic) {
                expect(selectedTopic.id).not.toBe(firstTopic.id);
              }
            }
            // If daysAgo >= 30, the topic could be selected again (it's old enough)
          }
        ),
        { numRuns: 100, timeout: 30000 } // Run 100 iterations as specified in the design
      );
    }, 35000);

    it('should allow selecting topics that were used more than 30 days ago', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate topic data
          fc.record({
            title: fc.string({ minLength: 5, maxLength: 50 }),
            category: fc.constantFrom('reparacion', 'mantenimiento', 'instalacion', 'noticias'),
            tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
            priority: fc.constantFrom('low', 'medium', 'high'),
            keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          }),
          // Generate days ago > 30
          fc.integer({ min: 31, max: 365 }),
          async (topicData, daysAgo) => {
            // Clean database before each property test iteration
            await db.execute('DELETE FROM topics');
            
            // Create a single topic
            const topic = await topicManager.addTopic({
              title: topicData.title,
              category: topicData.category as any,
              tags: topicData.tags,
              priority: topicData.priority as any,
              keywords: topicData.keywords,
            });

            // Mark it as used X days ago (where X > 30)
            await topicManager.markTopicAsUsed(topic.id);
            
            const lastUsedDate = new Date();
            lastUsedDate.setDate(lastUsedDate.getDate() - daysAgo);
            await repo.updateTopic(topic.id, {
              last_used: lastUsedDate.toISOString(),
            });

            // Select next topic with avoidRecentTopics enabled
            const criteria: TopicSelectionCriteria = {
              avoidRecentTopics: true,
              preferSeasonal: false,
              preferHighPriority: false,
              categoryDistribution: false,
            };

            const selectedTopic = await topicManager.selectNextTopic(criteria);

            // Property: Topics used more than 30 days ago should be available for selection
            expect(selectedTopic).not.toBeNull();
            if (selectedTopic) {
              expect(selectedTopic.id).toBe(topic.id);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain uniqueness across multiple selections within 30 days', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate multiple topics
          fc.array(
            fc.record({
              title: fc.string({ minLength: 5, maxLength: 50 }),
              category: fc.constantFrom('reparacion', 'mantenimiento', 'instalacion', 'noticias'),
              tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
              priority: fc.constantFrom('low', 'medium', 'high'),
              keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            }),
            { minLength: 3, maxLength: 8 }
          ),
          async (topicsData) => {
            // Clean database before each property test iteration
            await db.execute('DELETE FROM topics');
            await db.execute('DELETE FROM generated_articles');
            
            // Create all topics
            const createdTopics: Topic[] = [];
            for (const data of topicsData) {
              const topic = await topicManager.addTopic({
                title: data.title,
                category: data.category as any,
                tags: data.tags,
                priority: data.priority as any,
                keywords: data.keywords,
              });
              createdTopics.push(topic);
            }

            if (createdTopics.length < 3) {
              return; // Need at least 3 topics
            }

            const criteria: TopicSelectionCriteria = {
              avoidRecentTopics: true,
              preferSeasonal: false,
              preferHighPriority: false,
              categoryDistribution: false,
            };

            const selectedTopicIds = new Set<string>();

            // Select topics multiple times (up to the number of available topics)
            const selectionsToMake = Math.min(createdTopics.length, 5);
            
            for (let i = 0; i < selectionsToMake; i++) {
              const selected = await topicManager.selectNextTopic(criteria);
              
              if (selected) {
                // Property: Each selected topic should be unique (not selected before)
                expect(selectedTopicIds.has(selected.id)).toBe(false);
                
                selectedTopicIds.add(selected.id);
                
                // Mark as used to simulate the selection
                await topicManager.markTopicAsUsed(selected.id);
              }
            }

            // Property: We should have selected unique topics
            expect(selectedTopicIds.size).toBe(selectionsToMake);
          }
        ),
        { numRuns: 100, timeout: 30000 }
      );
    }, 35000);
  });
});
