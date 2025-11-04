import { Metadata } from 'next';
import { siteConfig } from './site-config';

interface GenerateMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

/**
 * Generate consistent metadata for pages
 */
export function generateMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: GenerateMetadataParams): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const ogImageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  // Base Open Graph (no mutamos luego; lo reasignamos si es 'article')
  let openGraph: NonNullable<Metadata['openGraph']> = {
    title: fullTitle,
    description,
    url,
    siteName: siteConfig.name,
    locale: 'es_ES',
    type, // 'website' por defecto; lo cambiaremos abajo si es 'article'
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  // Si es artículo, reasignamos con el tipo 'article' y sus campos específicos
  if (type === 'article') {
    openGraph = {
      ...(openGraph ?? {}),
      type: 'article',
      publishedTime, // ISO string (p.ej. 2025-11-03T10:00:00.000Z)
      modifiedTime,  // ISO string o undefined
      authors,       // string[]
      tags,          // string[]
    };
  }

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    // "authors" del metadata general (no confundir con openGraph.authors)
    authors: authors ? authors.map((name) => ({ name })) : undefined,
    openGraph, // ✅ ya con el tipo correcto según 'type'
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
    },
  };

  return metadata;
}

/**
 * Generate JSON-LD for FAQ pages
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD for Service pages
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    areaServed: service.areaServed,
    priceRange: service.priceRange,
  };
}
