/**
 * Site configuration for SEO
 */

export const siteConfig = {
  name: 'GlassNou',
  description: 'Taller experto en cristales de automoción en Barcelona. Sustitución de parabrisas y reparación de lunas con calidad OEM.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002',
  ogImage: '/images/hero-background.png',
  links: {
    facebook: 'https://www.facebook.com/glassnou/',
    instagram: 'https://www.instagram.com/glassnou?igsh=NGFjenFmZXN1Z2N3',
    tiktok: 'https://www.tiktok.com/@glassnou',
  },
  contact: {
    phone: '+34 686 770 074',
    email: 'info@glassnoubarcelona.com',
    address: {
      street: 'Carrer Maria Barrientos, 23, Local 2',
      locality: 'Distrito de Les Corts',
      city: 'Barcelona',
      postalCode: '08028',
      region: 'Barcelona',
      country: 'ES',
    },
  },
  business: {
    type: 'AutoGlassShop',
    areaServed: 'Barcelona',
    priceRange: '€€',
  },
} as const;

export function getAbsoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}
