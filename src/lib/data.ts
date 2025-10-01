import type { Product, FaqItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return { id: 'fallback', url: 'https://placehold.co/600x400', hint: 'placeholder' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
};

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Parabrisas Delantero para Sedán',
    description: 'Parabrisas delantero laminado de alta calidad para la mayoría de los sedanes modernos. Proporciona excelente visibilidad y durabilidad.',
    price: 249.99,
    image: getImage('product-1'),
    specifications: {
      'Material': 'Vidrio Laminado',
      'Espesor': '5mm',
      'Tinte': 'Verde Claro',
      'Características': 'Capa intermedia acústica, Soporte para sensor de lluvia'
    },
    compatibility: ['Toyota Camry 2018-2023', 'Honda Accord 2019-2024', 'Ford Fusion 2017-2020']
  },
  {
    id: 'prod-002',
    name: 'Luneta Trasera para SUV',
    description: 'Luneta trasera de vidrio templado con líneas de desempañador para modelos populares de SUV. Fácil de instalar y construida para durar.',
    price: 199.50,
    image: getImage('product-2'),
    specifications: {
      'Material': 'Vidrio Templado',
      'Espesor': '4mm',
      'Tinte': 'Negro de Privacidad',
      'Características': 'Líneas de desempañador térmico'
    },
    compatibility: ['Ford Explorer 2020-2024', 'Jeep Grand Cherokee 2018-2023', 'Toyota RAV4 2019-2024']
  },
  {
    id: 'prod-003',
    name: 'Ventana Lateral del Conductor para Camioneta',
    description: 'Cristal de ventana lateral duradero para camionetas de trabajo pesado. Resiste rayones e impactos.',
    price: 89.00,
    image: getImage('product-3'),
    specifications: {
      'Material': 'Vidrio Templado',
      'Espesor': '4mm',
      'Tinte': 'Transparente',
      'Características': 'Agujeros de montaje pre-perforados'
    },
    compatibility: ['Ford F-150 2015-2023', 'Chevy Silverado 1500 2019-2024', 'Ram 1500 2019-2024']
  },
  {
    id: 'prod-004',
    name: 'Cristal para Techo Solar Panorámico',
    description: 'Panel de cristal de reemplazo para techos solares panorámicos. Ofrece protección UV y una vista clara.',
    price: 450.00,
    image: getImage('product-4'),
    specifications: {
      'Material': 'Vidrio Laminado',
      'Espesor': '6mm',
      'Tinte': 'Control Solar',
      'Características': 'Capa de protección UV, Marco pre-adjunto'
    },
    compatibility: ['Tesla Model 3', 'Hyundai Palisade', 'Kia Telluride']
  },
  {
    id: 'prod-005',
    name: 'Parabrisas Delantero para Coche Deportivo',
    description: 'Parabrisas delantero aerodinámico y ligero diseñado para coches deportivos de alto rendimiento.',
    price: 399.99,
    image: getImage('product-5'),
    specifications: {
      'Material': 'Híbrido de Gorilla Glass',
      'Espesor': '4.5mm',
      'Tinte': 'Azul Claro',
      'Características': 'Compatible con Head-Up Display (HUD)'
    },
    compatibility: ['Porsche 911 2020-2024', 'Chevrolet Corvette C8', 'Ford Mustang 2018-2023']
  },
  {
    id: 'prod-006',
    name: 'Cristal de Espejo Lateral con Calefacción',
    description: 'Cristal de reemplazo para espejo lateral con elemento calefactor para despejar hielo y niebla rápidamente.',
    price: 49.95,
    image: getImage('product-6'),
    specifications: {
      'Material': 'Cristal de Espejo Convexo',
      'Espesor': '3mm',
      'Tinte': 'Transparente',
      'Características': 'Elemento calefactor, Placa trasera a presión'
    },
    compatibility: ['Volkswagen Golf GTI', 'Subaru Outback', 'Mazda CX-5']
  }
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
