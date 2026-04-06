/**
 * Unit tests for AI Content Generator
 * Tests core functionality with simplified mocks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIContentGenerator } from '../ai-generator';
import { AIProviderConfig, GenerationPrompt, Topic } from '../types';
import { BlogCategorySlug } from '@/lib/blog/blog-types';

// Mock the modules
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn(),
      },
    };
    
    constructor(config: any) {
      this.config = config;
    }
    
    config: any;
  },
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = {
      create: vi.fn(),
    };
    
    constructor(config: any) {
      this.config = config;
    }
    
    config: any;
  },
}));

// Mock logger
vi.mock('../logger', () => ({
  getLogger: () => ({
    child: () => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  }),
}));

describe('AIContentGenerator', () => {
  let generator: AIContentGenerator;
  let mockOpenAIConfig: AIProviderConfig;
  let mockAnthropicConfig: AIProviderConfig;
  let mockTopic: Topic;
  let mockPrompt: GenerationPrompt;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockOpenAIConfig = {
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'test-api-key',
      temperature: 0.7,
      maxTokens: 2000,
    };

    mockAnthropicConfig = {
      provider: 'anthropic',
      model: 'claude-3-sonnet-20240229',
      apiKey: 'test-api-key',
      temperature: 0.7,
      maxTokens: 2000,
    };

    mockTopic = {
      id: 'test-topic-1',
      title: 'Reparación de parabrisas astillado',
      category: 'reparacion' as BlogCategorySlug,
      tags: ['parabrisas', 'reparacion', 'astillas'],
      priority: 'high',
      keywords: ['reparación parabrisas', 'astillas', 'grietas'],
      timesUsed: 0,
      status: 'active',
      createdAt: new Date(),
    };

    mockPrompt = {
      topic: mockTopic,
      targetWordCount: 1000,
      tone: 'professional',
      includeCallToAction: true,
      relatedServices: ['reparacion-parabrisas', 'sustitucion-parabrisas'],
      context: 'Artículo enfocado en reparaciones menores',
    };
  });

  describe('Constructor', () => {
    it('should initialize OpenAI client when provider is openai', () => {
      generator = new AIContentGenerator(mockOpenAIConfig);
      
      // Verify that the generator was created (basic smoke test)
      expect(generator).toBeDefined();
    });

    it('should initialize Anthropic client when provider is anthropic', () => {
      generator = new AIContentGenerator(mockAnthropicConfig);
      
      // Verify that the generator was created (basic smoke test)
      expect(generator).toBeDefined();
    });
  });

  describe('generateArticle with OpenAI', () => {
    beforeEach(() => {
      generator = new AIContentGenerator(mockOpenAIConfig);
    });

    it('should generate article with valid JSON response', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Cómo Reparar un Parabrisas Astillado',
              excerpt: 'Guía completa para reparar astillas en el parabrisas',
              content: '# Cómo Reparar un Parabrisas Astillado\n\nLas astillas en el parabrisas son un problema común que requiere atención inmediata.',
              suggestedTags: ['parabrisas', 'reparacion'],
              suggestedCategory: 'reparacion',
              seoMetadata: {
                metaTitle: 'Reparación de Parabrisas Astillado - Guía 2024',
                metaDescription: 'Aprende cómo reparar astillas en el parabrisas de forma profesional.',
                keywords: ['reparación parabrisas', 'astillas', 'cristales auto'],
              },
              internalLinks: [
                { text: 'servicios de reparación', url: '/servicios/reparacion-parabrisas' }
              ],
              callToAction: 'Contacta con GlassNou para una reparación profesional',
            }),
          },
        }],
      };

      // Mock the OpenAI create method
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await generator.generateArticle(mockPrompt);

      expect(result).toMatchObject({
        title: 'Cómo Reparar un Parabrisas Astillado',
        excerpt: 'Guía completa para reparar astillas en el parabrisas',
        suggestedTags: ['parabrisas', 'reparacion'],
        suggestedCategory: 'reparacion',
        wordCount: expect.any(Number),
        generatedAt: expect.any(Date),
      });

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: expect.stringContaining('GlassNou') },
          { role: 'user', content: expect.stringContaining('Reparación de parabrisas astillado') },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
    });

    it('should handle JSON response wrapped in markdown code blocks', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: '```json\n' + JSON.stringify({
              title: 'Test Article',
              excerpt: 'Test excerpt',
              content: '# Test Content\n\nThis is test content.',
              suggestedTags: ['test'],
              suggestedCategory: 'reparacion',
              seoMetadata: {
                metaTitle: 'Test Title',
                metaDescription: 'Test description',
                keywords: ['test'],
              },
              internalLinks: [],
              callToAction: 'Test CTA',
            }) + '\n```',
          },
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await generator.generateArticle(mockPrompt);

      expect(result.title).toBe('Test Article');
      expect(result.excerpt).toBe('Test excerpt');
    });

    it('should throw error when OpenAI returns no content', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: null,
          },
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(generator.generateArticle(mockPrompt)).rejects.toThrow('No content received from OpenAI');
    });

    it('should throw error when JSON parsing fails', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Invalid JSON response that cannot be parsed',
          },
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(generator.generateArticle(mockPrompt)).rejects.toThrow('Failed to parse AI response');
    });
  });

  describe('generateArticle with Anthropic', () => {
    beforeEach(() => {
      generator = new AIContentGenerator(mockAnthropicConfig);
    });

    it('should generate article with valid response from Anthropic', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            title: 'Anthropic Test Article',
            excerpt: 'Test excerpt from Anthropic',
            content: '# Anthropic Test Content\n\nThis is content generated by Anthropic.',
            suggestedTags: ['anthropic', 'test'],
            suggestedCategory: 'reparacion',
            seoMetadata: {
              metaTitle: 'Anthropic Test Title',
              metaDescription: 'Test description from Anthropic',
              keywords: ['anthropic', 'test'],
            },
            internalLinks: [],
            callToAction: 'Anthropic Test CTA',
          }),
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).anthropicClient = {
        messages: {
          create: mockCreate,
        },
      };

      const result = await generator.generateArticle(mockPrompt);

      expect(result.title).toBe('Anthropic Test Article');
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature: 0.7,
        system: expect.stringContaining('GlassNou'),
        messages: [
          { role: 'user', content: expect.stringContaining('Reparación de parabrisas astillado') },
        ],
      });
    });

    it('should throw error when Anthropic returns non-text content', async () => {
      const mockResponse = {
        content: [{
          type: 'image',
          source: {},
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).anthropicClient = {
        messages: {
          create: mockCreate,
        },
      };

      await expect(generator.generateArticle(mockPrompt)).rejects.toThrow('Unexpected response type from Anthropic');
    });
  });

  describe('generateMetaDescription', () => {
    beforeEach(() => {
      generator = new AIContentGenerator(mockOpenAIConfig);
    });

    it('should generate meta description', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Aprende cómo reparar astillas en el parabrisas de forma profesional. Guía paso a paso con consejos de expertos para mantener tu vehículo seguro.',
          },
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await generator.generateMetaDescription(
        'Cómo Reparar un Parabrisas Astillado',
        'Guía completa para reparar astillas en el parabrisas'
      );

      expect(result).toBe('Aprende cómo reparar astillas en el parabrisas de forma profesional. Guía paso a paso con consejos de expertos para mantener tu vehículo seguro.');
    });
  });

  describe('suggestTags', () => {
    beforeEach(() => {
      generator = new AIContentGenerator(mockOpenAIConfig);
    });

    it('should parse tags from JSON array response', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: '["parabrisas", "reparacion", "cristales", "automocion"]',
          },
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await generator.suggestTags('Contenido sobre reparación de parabrisas...');

      expect(result).toEqual(['parabrisas', 'reparacion', 'cristales', 'automocion']);
    });

    it('should extract tags from response with extra text', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Aquí tienes los tags sugeridos: ["parabrisas", "reparacion", "cristales"]',
          },
        }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await generator.suggestTags('Contenido sobre reparación de parabrisas...');

      expect(result).toEqual(['parabrisas', 'reparacion', 'cristales']);
    });
  });

  describe('identifyServiceOpportunities', () => {
    beforeEach(() => {
      generator = new AIContentGenerator(mockOpenAIConfig);
    });

    it('should identify service opportunities in content', () => {
      const content = 'La reparación de parabrisas es importante. También ofrecemos calibración ADAS para mayor seguridad.';
      
      const availableServices = [
        {
          id: 'reparacion-parabrisas',
          name: 'Reparación de Parabrisas',
          keywords: ['reparación', 'reparacion'],
        },
        {
          id: 'calibracion-adas',
          name: 'Calibración ADAS',
          keywords: ['calibración', 'ADAS'],
        },
      ];

      const result = generator.identifyServiceOpportunities(content, availableServices);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        text: expect.any(String),
        url: '/servicios/reparacion-parabrisas',
        position: expect.any(Number),
      });
      expect(result[1]).toMatchObject({
        text: expect.any(String),
        url: '/servicios/calibracion-adas',
        position: expect.any(Number),
      });
    });

    it('should return opportunities sorted by position', () => {
      const content = 'Calibración ADAS y reparación de parabrisas son servicios importantes.';
      
      const availableServices = [
        {
          id: 'reparacion-parabrisas',
          name: 'Reparación de Parabrisas',
          keywords: ['reparación'],
        },
        {
          id: 'calibracion-adas',
          name: 'Calibración ADAS',
          keywords: ['Calibración'],
        },
      ];

      const result = generator.identifyServiceOpportunities(content, availableServices);

      if (result.length >= 2) {
        expect(result[0].position).toBeLessThan(result[1].position);
      }
    });
  });

  describe('Error Handling and Retries', () => {
    beforeEach(() => {
      generator = new AIContentGenerator(mockOpenAIConfig);
      // Mock setTimeout to avoid actual delays in tests
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return {} as any;
      });
    });

    it('should retry on retryable errors', async () => {
      const mockCreate = vi.fn()
        .mockRejectedValueOnce(new Error('rate limit exceeded'))
        .mockResolvedValueOnce({
          choices: [{ message: { content: '{"title":"success","excerpt":"test","content":"test content","suggestedTags":[],"suggestedCategory":"reparacion","seoMetadata":{"metaTitle":"test","metaDescription":"test","keywords":[]},"internalLinks":[],"callToAction":"test"}' } }],
        });

      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(generator.generateArticle(mockPrompt)).resolves.toBeDefined();
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const mockCreate = vi.fn().mockRejectedValue(new Error('invalid api key'));

      (generator as any).openaiClient = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(generator.generateArticle(mockPrompt)).rejects.toThrow('invalid api key');
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });
});