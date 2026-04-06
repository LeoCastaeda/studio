/**
 * Test script for AI Content Generator
 * 
 * This script verifies that the AI generator can be instantiated and configured correctly.
 */

import { AIContentGenerator } from '../ai-generator';
import { loadAIConfig } from '../config';
import { GenerationPrompt } from '../types';

async function testAIGenerator() {
  console.log('🧪 Testing AI Content Generator...\n');

  try {
    // Load configuration
    console.log('📋 Loading AI configuration...');
    const config = loadAIConfig();
    console.log(`✅ Configuration loaded: ${config.provider} (${config.model})\n`);

    // Create generator instance
    console.log('🤖 Creating AI generator instance...');
    const generator = new AIContentGenerator(config);
    console.log('✅ AI generator created successfully\n');

    // Test SEO title generation
    console.log('📝 Testing SEO title generation...');
    const seoTitle = await generator.generateSEOTitle('Cómo reparar un parabrisas astillado');
    console.log(`✅ SEO Title: "${seoTitle}"\n`);

    // Test meta description generation
    console.log('📝 Testing meta description generation...');
    const metaDesc = await generator.generateMetaDescription(
      'Cómo reparar un parabrisas astillado',
      'Aprende los pasos para reparar pequeñas astillas en tu parabrisas y evitar que se conviertan en grietas mayores.'
    );
    console.log(`✅ Meta Description (${metaDesc.length} chars): "${metaDesc}"\n`);

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testAIGenerator();
