/**
 * AI Content Generator
 * 
 * Generates blog article content using AI providers (OpenAI/Anthropic/Gemini).
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProviderConfig, GenerationPrompt, GeneratedArticle } from './types';
import { BlogCategorySlug } from '@/lib/blog/blog-types';
import { getLogger, Logger } from './logger';

/**
 * Rate limiting configuration
 */
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds initial retry delay

export class AIContentGenerator {
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;
  private geminiClient?: GoogleGenerativeAI;
  private lastRequestTime = 0;
  private logger: Logger;

  constructor(private config: AIProviderConfig) {
    this.logger = getLogger().child({ component: 'AIContentGenerator' });
    
    if (config.provider === 'openai') {
      this.openaiClient = new OpenAI({
        apiKey: config.apiKey,
      });
      this.logger.info('Initialized OpenAI client', {
        operation: 'constructor',
        model: config.model,
      });
    } else if (config.provider === 'anthropic') {
      this.anthropicClient = new Anthropic({
        apiKey: config.apiKey,
      });
      this.logger.info('Initialized Anthropic client', {
        operation: 'constructor',
        model: config.model,
      });
    } else if (config.provider === 'gemini') {
      this.geminiClient = new GoogleGenerativeAI(config.apiKey);
      this.logger.info('Initialized Gemini client', {
        operation: 'constructor',
        model: config.model,
      });
    }
  }

  /**
   * Rate limiting: ensure minimum delay between API requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = MAX_RETRIES,
    delay = RETRY_DELAY
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) {
        this.logger.error('Max retries exhausted', {
          operation: 'retryWithBackoff',
        }, error as Error);
        throw error;
      }

      // Check if error is retryable
      const isRetryable = this.isRetryableError(error);
      if (!isRetryable) {
        this.logger.error('Non-retryable error', {
          operation: 'retryWithBackoff',
        }, error as Error);
        throw error;
      }

      this.logger.warn('Request failed, retrying', {
        operation: 'retryWithBackoff',
        retriesLeft: retries,
        delayMs: delay,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      // Retry on rate limits, timeouts, and server errors
      return message.includes('rate limit') ||
             message.includes('timeout') ||
             message.includes('503') ||
             message.includes('502') ||
             message.includes('500');
    }
    return false;
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    await this.enforceRateLimit();

    return this.retryWithBackoff(async () => {
      const response = await this.openaiClient!.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return content;
    });
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized');
    }

    await this.enforceRateLimit();

    return this.retryWithBackoff(async () => {
      const response = await this.anthropicClient!.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      return content.text;
    });
  }

  /**
   * Call Gemini API
   */
  private async callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.geminiClient) {
      throw new Error('Gemini client not initialized');
    }

    await this.enforceRateLimit();

    return this.retryWithBackoff(async () => {
      const model = this.geminiClient!.getGenerativeModel({ model: this.config.model });
      
      // Combine system and user prompts for Gemini
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('No content received from Gemini');
      }

      return text;
    });
  }

  /**
   * Call the configured AI provider
   */
  private async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(systemPrompt, userPrompt);
    } else if (this.config.provider === 'anthropic') {
      return this.callAnthropic(systemPrompt, userPrompt);
    } else if (this.config.provider === 'gemini') {
      return this.callGemini(systemPrompt, userPrompt);
    } else {
      throw new Error(`Unknown AI provider: ${this.config.provider}`);
    }
  }

  /**
   * Build the system prompt for article generation
   */
  private buildSystemPrompt(): string {
    return `Eres un experto redactor de contenido para GlassNou, una empresa especializada en cristales de automoción en Barcelona.

INFORMACIÓN SOBRE GLASSNOU:
- Empresa líder en reparación y sustitución de cristales de automoción
- Ubicada en Barcelona, España
- Servicios principales:
  * Reparación de parabrisas (astillas y grietas)
  * Sustitución de parabrisas con cristal OEM de alta calidad
  * Calibración de sistemas ADAS (sistemas avanzados de asistencia al conductor)
  * Tintado de lunas con láminas de control solar
  * Venta e instalación de escobillas limpiaparabrisas
  * Tratamiento antilluvia e insectos hidrofóbico
  * Venta de balizas de emergencia homologadas DGT 2026
- Trabajan con todas las principales compañías de seguros
- Garantía de por vida en la instalación
- Servicio rápido: la mayoría de reemplazos en 60 minutos o menos

ESTILO DE ESCRITURA:
- Tono profesional pero accesible y cercano
- Enfoque educativo e informativo
- Lenguaje claro y directo, evitando jerga excesiva
- Estructura bien organizada con secciones claras
- Incluye información técnica precisa pero explicada de forma comprensible
- Orientado a resolver problemas y dudas del lector

TU TAREA:
Generar artículos de blog de alta calidad sobre temas relacionados con cristales de automoción, mantenimiento, seguridad vial, y servicios de GlassNou.`;
  }

  /**
   * Build the user prompt for article generation
   */
  private buildArticlePrompt(prompt: GenerationPrompt): string {
    const { topic, targetWordCount, tone, includeCallToAction, relatedServices, context } = prompt;

    let userPrompt = `Genera un artículo de blog completo sobre el siguiente tema:

TEMA: ${topic.title}
CATEGORÍA: ${topic.category}
PALABRAS CLAVE: ${topic.keywords.join(', ')}
LONGITUD OBJETIVO: ${targetWordCount} palabras
TONO: ${tone}

`;

    if (context) {
      userPrompt += `CONTEXTO ADICIONAL: ${context}\n\n`;
    }

    if (relatedServices.length > 0) {
      userPrompt += `SERVICIOS RELACIONADOS A MENCIONAR: ${relatedServices.join(', ')}\n\n`;
    }

    userPrompt += `El artículo debe incluir:

1. Un título atractivo y optimizado para SEO (máximo 60 caracteres)
2. Un extracto/resumen breve (2-3 frases, máximo 160 caracteres)
3. Contenido principal en formato Markdown con:
   - Introducción que enganche al lector
   - Secciones bien estructuradas con subtítulos (##)
   - Información técnica precisa y útil
   - Ejemplos prácticos cuando sea relevante
   - Listas y viñetas para mejorar la legibilidad
   - Conclusión que resuma los puntos clave
${includeCallToAction ? '   - Llamada a la acción al final invitando a contactar con GlassNou\n' : ''}
4. Sugerencias de 3-5 tags relevantes
5. Meta título SEO (máximo 60 caracteres)
6. Meta descripción SEO (150-160 caracteres)
7. 5-7 palabras clave SEO
8. 2-3 enlaces internos sugeridos (formato: {texto: "texto del enlace", url: "/ruta"})

FORMATO DE RESPUESTA (JSON):
Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura:
{
  "title": "Título del artículo",
  "excerpt": "Extracto breve del artículo",
  "content": "Contenido completo en Markdown",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "suggestedCategory": "${topic.category}",
  "seoMetadata": {
    "metaTitle": "Título SEO optimizado",
    "metaDescription": "Descripción SEO de 150-160 caracteres",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "internalLinks": [
    {"text": "texto del enlace", "url": "/ruta"}
  ],
  "callToAction": "Texto de la llamada a la acción"
}

IMPORTANTE: 
- Responde SOLO con el JSON, sin texto adicional antes o después
- Asegúrate de que el JSON sea válido y parseable
- El contenido debe estar en español
- Usa formato Markdown para el contenido
- Incluye información precisa y verificable`;

    return userPrompt;
  }

  /**
   * Parse the AI response into a GeneratedArticle
   */
  private parseArticleResponse(response: string, prompt: GenerationPrompt): GeneratedArticle {
    try {
      // Try to extract JSON from the response
      let jsonStr = response.trim();
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to find JSON object in the response
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      // Fix common JSON issues
      // Replace unescaped newlines in strings
      jsonStr = jsonStr.replace(/("content":\s*")([\s\S]*?)("[\s,\}])/g, (match, start, content, end) => {
        // Escape newlines and quotes in content
        const fixed = content
          .replace(/\\/g, '\\\\')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/"/g, '\\"');
        return start + fixed + end;
      });

      const parsed = JSON.parse(jsonStr);

      // Count words in content
      const wordCount = parsed.content.split(/\s+/).length;

      return {
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: parsed.content,
        suggestedTags: parsed.suggestedTags || [],
        suggestedCategory: parsed.suggestedCategory || prompt.topic.category,
        seoMetadata: {
          metaTitle: parsed.seoMetadata?.metaTitle || parsed.title,
          metaDescription: parsed.seoMetadata?.metaDescription || parsed.excerpt,
          keywords: parsed.seoMetadata?.keywords || prompt.topic.keywords,
        },
        internalLinks: parsed.internalLinks || [],
        callToAction: parsed.callToAction || '',
        wordCount,
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to parse AI response', {
        operation: 'parseArticleResponse',
        responseLength: response.length,
        responsePreview: response.substring(0, 500),
      }, error as Error);
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateArticle(prompt: GenerationPrompt): Promise<GeneratedArticle> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildArticlePrompt(prompt);

    const response = await this.callAI(systemPrompt, userPrompt);
    return this.parseArticleResponse(response, prompt);
  }

  async improveContent(content: string, feedback: string): Promise<string> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = `Mejora el siguiente contenido de artículo basándote en este feedback:

FEEDBACK: ${feedback}

CONTENIDO ACTUAL:
${content}

Proporciona el contenido mejorado en formato Markdown, manteniendo la estructura pero aplicando las mejoras sugeridas.`;

    return this.callAI(systemPrompt, userPrompt);
  }

  async generateMetaDescription(title: string, excerpt: string): Promise<string> {
    const systemPrompt = `Eres un experto en SEO especializado en crear meta descripciones optimizadas para motores de búsqueda.`;
    
    const userPrompt = `Genera una meta descripción SEO optimizada para el siguiente artículo:

TÍTULO: ${title}
EXTRACTO: ${excerpt}

REQUISITOS:
- Longitud: exactamente entre 150-160 caracteres
- Debe ser atractiva y persuasiva
- Incluir palabras clave relevantes
- Llamada a la acción implícita
- En español

Responde SOLO con la meta descripción, sin texto adicional.`;

    const response = await this.callAI(systemPrompt, userPrompt);
    return response.trim();
  }

  async suggestTags(content: string): Promise<string[]> {
    const systemPrompt = `Eres un experto en categorización de contenido y SEO.`;
    
    const userPrompt = `Analiza el siguiente contenido y sugiere 3-5 tags relevantes:

CONTENIDO:
${content.substring(0, 1000)}... (extracto)

REQUISITOS:
- Tags en español
- Relevantes para cristales de automoción
- Útiles para SEO y navegación
- En minúsculas, separados por guiones si es necesario

Responde con un array JSON de strings: ["tag1", "tag2", "tag3"]
Responde SOLO con el array JSON, sin texto adicional.`;

    const response = await this.callAI(systemPrompt, userPrompt);
    
    try {
      const tags = JSON.parse(response.trim());
      if (Array.isArray(tags)) {
        return tags;
      }
      throw new Error('Response is not an array');
    } catch (error) {
      // Fallback: try to extract tags from response
      const matches = response.match(/\[.*\]/);
      if (matches) {
        return JSON.parse(matches[0]);
      }
      throw new Error('Failed to parse tags from AI response');
    }
  }

  async generateSEOTitle(topic: string): Promise<string> {
    const systemPrompt = `Eres un experto en SEO especializado en crear títulos optimizados para motores de búsqueda.`;
    
    const userPrompt = `Genera un título SEO optimizado para un artículo sobre:

TEMA: ${topic}

REQUISITOS:
- Longitud: máximo 60 caracteres
- Incluir palabras clave relevantes
- Atractivo y que genere clicks
- Claro y descriptivo
- En español
- Relacionado con cristales de automoción

Responde SOLO con el título, sin texto adicional ni comillas.`;

    const response = await this.callAI(systemPrompt, userPrompt);
    return response.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
  }

  /**
   * Generate internal links for an article
   * This method identifies opportunities to link to GlassNou services and related articles
   */
  async generateInternalLinks(
    content: string,
    availableServices: Array<{ id: string; name: string }>,
    relatedArticles?: Array<{ slug: string; title: string }>
  ): Promise<Array<{ text: string; url: string }>> {
    const systemPrompt = `Eres un experto en SEO y estrategia de enlaces internos.`;
    
    let userPrompt = `Analiza el siguiente contenido y sugiere 2-3 enlaces internos relevantes:

CONTENIDO:
${content.substring(0, 1500)}... (extracto)

SERVICIOS DISPONIBLES:
${availableServices.map(s => `- ${s.name} (URL: /servicios/${s.id})`).join('\n')}
`;

    if (relatedArticles && relatedArticles.length > 0) {
      userPrompt += `
ARTÍCULOS RELACIONADOS:
${relatedArticles.map(a => `- ${a.title} (URL: /blog/${a.slug})`).join('\n')}
`;
    }

    userPrompt += `
REQUISITOS:
- Identifica oportunidades naturales para enlaces internos
- Prioriza enlaces a servicios relevantes
- Incluye 1-2 enlaces a artículos relacionados si son relevantes
- Los enlaces deben ser contextuales y útiles para el lector

Responde con un array JSON de objetos con formato:
[
  {"text": "texto ancla del enlace", "url": "/ruta/del/enlace"}
]

Responde SOLO con el array JSON, sin texto adicional.`;

    const response = await this.callAI(systemPrompt, userPrompt);
    
    try {
      let jsonStr = response.trim();
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const links = JSON.parse(jsonStr);
      if (Array.isArray(links)) {
        return links;
      }
      throw new Error('Response is not an array');
    } catch (error) {
      // Fallback: try to extract array from response
      const matches = response.match(/\[[\s\S]*\]/);
      if (matches) {
        return JSON.parse(matches[0]);
      }
      this.logger.warn('Failed to parse internal links from AI response, returning empty array', {
        operation: 'generateInternalLinks',
      });
      return [];
    }
  }

  /**
   * Identify service mentions in content and suggest links
   */
  identifyServiceOpportunities(
    content: string,
    availableServices: Array<{ id: string; name: string; keywords: string[] }>
  ): Array<{ text: string; url: string; position: number }> {
    const opportunities: Array<{ text: string; url: string; position: number }> = [];
    
    for (const service of availableServices) {
      // Check if service name or keywords appear in content
      const keywords = [service.name, ...service.keywords];
      
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = content.matchAll(regex);
        
        for (const match of matches) {
          if (match.index !== undefined) {
            opportunities.push({
              text: match[0],
              url: `/servicios/${service.id}`,
              position: match.index,
            });
            // Only add first occurrence of each service
            break;
          }
        }
        
        if (opportunities.some(o => o.url === `/servicios/${service.id}`)) {
          break;
        }
      }
    }
    
    return opportunities.sort((a, b) => a.position - b.position);
  }
}
