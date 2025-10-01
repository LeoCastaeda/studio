import type { Product, FaqItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Use a placeholder from a configured host
    return { id: 'fallback', url: 'https://picsum.photos/seed/fallback/600/400', hint: 'placeholder' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
};

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Parabrisas',
    description: 'Reemplazo e instalación de parabrisas para todo tipo de vehículos. Utilizamos cristal de la más alta calidad que cumple con los estándares OEM.',
    price: 249.99,
    image: getImage('product-1'),
    specifications: {
      'Material': 'Vidrio Laminado',
      'Servicio': 'Reemplazo e Instalación',
      'Tinte': 'Original de Fábrica',
      'Características': 'Soporte para sensores de lluvia y ADAS'
    },
    compatibility: ['Sedanes', 'SUVs', 'Camionetas', 'Deportivos']
  },
  {
    id: 'prod-002',
    name: 'Cristales Laterales',
    description: 'Reemplazo de ventanas de puertas, aletas y custodias. Nos aseguramos de que el nuevo cristal funcione perfectamente con el mecanismo de tu vehículo.',
    price: 89.00,
    image: getImage('product-3'),
    specifications: {
      'Material': 'Vidrio Templado',
      'Servicio': 'Reemplazo e Instalación',
      'Tinte': 'Original de Fábrica',
      'Posición': 'Puertas delanteras y traseras'
    },
    compatibility: ['Sedanes', 'SUVs', 'Camionetas', 'Deportivos']
  },
  {
    id: 'prod-003',
    name: 'Medallones',
    description: 'Instalación de medallones (cristal trasero) con o sin desempañador. Devolvemos la seguridad y visibilidad a la parte trasera de tu coche.',
    price: 199.50,
    image: getImage('product-2'),
    specifications: {
      'Material': 'Vidrio Templado',
      'Servicio': 'Reemplazo e Instalación',
      'Tinte': 'Original de Fábrica',
      'Características': 'Conexión para desempañador térmico'
    },
    compatibility: ['Sedanes', 'SUVs', 'Hatchbacks', 'Deportivos']
  },
  {
    id: 'prod-004',
    name: 'Quemacocos',
    description: 'Reparación y reemplazo de cristales para quemacocos y techos panorámicos. Disfruta de una vista clara y sin filtraciones.',
    price: 450.00,
    image: getImage('product-4'),
    specifications: {
      'Material': 'Vidrio Laminado de Seguridad',
      'Servicio': 'Reemplazo y Reparación',
      'Tinte': 'Control Solar',
      'Características': 'Protección UV, sellado hermético'
    },
    compatibility: ['Vehículos con quemacocos', 'Techos panorámicos']
  },
  {
    id: 'prod-005',
    name: 'Espejos Laterales',
    description: 'Reemplazo de lunas de espejos laterales, con o sin calefacción y sensores de punto ciego. Recupera la visibilidad completa de tu entorno.',
    price: 49.95,
    image: getImage('product-6'),
    specifications: {
      'Material': 'Cristal de Espejo Convexo',
      'Servicio': 'Reemplazo de Luna',
      'Características': 'Opción con calefacción y sensor de punto ciego',
      'Posición': 'Espejos de puerta del conductor y pasajero'
    },
    compatibility: ['La mayoría de marcas y modelos']
  },
];


export const faqItems: FaqItem[] = [
    {
        question: "¿Cuánto tiempo tarda un reemplazo de cristal?",
        answer: "La mayoría de los reemplazos de parabrisas se pueden completar en 60 minutos o menos. Luego, el vehículo deberá reposar por un corto período para que el adhesivo se seque antes de que sea seguro conducirlo."
    },
    {
        question: "¿Manejan reclamos de seguros?",
        answer: "Sí, trabajamos con todas las principales compañías de seguros. Podemos ayudarte a presentar tu reclamo y manejar el papeleo para que el proceso sea lo más sencillo posible para ti."
    },
    {
        question: "¿Hay garantía en sus cristales e instalación?",
        answer: "Absolutamente. Ofrecemos una garantía de por vida en la instalación mientras seas dueño de tu vehículo, cubriendo cualquier defecto de mano de obra. El cristal en sí está cubierto por la garantía del fabricante contra defectos. Consulta nuestra página de Garantía para más detalles."
    },
    {
        question: "¿Pueden reparar una pequeña astilla en lugar de reemplazar todo el parabrisas?",
        answer: "En muchos casos, sí. Si la astilla es más pequeña que una moneda y no está en la línea de visión directa del conductor, a menudo es posible una reparación. Una reparación puede ahorrarte tiempo y dinero, y también está cubierta por la mayoría de las pólizas de seguro."
    },
    {
        question: "¿Qué tipo de cristal utilizan?",
        answer: "Utilizamos cristal de alta calidad que cumple o excede los estándares del Fabricante de Equipo Original (OEM). Esto asegura un ajuste perfecto, una visibilidad clara y la seguridad e integridad estructural de tu vehículo."
    }
];
