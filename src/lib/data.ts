import type { Product, FaqItem, Review } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return { id: 'fallback', url: '/images/fallback.svg', hint: 'imagen predeterminada' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
};

export const products: Product[] = [
  {
    id: 'reparacion-de-parabrisas',
    name: 'Reparación de Parabrisas',
    description: 'Reparamos pequeñas grietas y astillas en tu parabrisas, devolviéndole su resistencia original y evitando que el daño se extienda. Un servicio rápido y económico.',
    price: 59.99,
    image: getImage('product-repair'),
    specifications: {
      'Servicio': 'Reparación de astillas y grietas',
      'Tiempo estimado': '30-45 minutos',
      'Resultado': 'Recupera hasta el 95% de la integridad estructural',
      'Ventaja': 'Evita el reemplazo completo del parabrisas'
    },
    compatibility: ['Todo tipo de parabrisas laminados']
  },
  {
    id: 'sustitucion-de-parabrisas',
    name: 'Sustitución de Parabrisas',
    description: 'Reemplazo e instalación profesional de parabrisas para todo tipo de vehículos. Utilizamos cristal de la más alta calidad que cumple con los estándares OEM.',
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
    id: 'calibracion-de-sistema-adas',
    name: 'Calibración de Sistema ADAS',
    description: 'Calibración precisa de los sistemas avanzados de asistencia al conductor (ADAS) tras el reemplazo del parabrisas. Esencial para la seguridad y el correcto funcionamiento de tu vehículo.',
    price: 150.00,
    image: getImage('product-adas'),
    specifications: {
      'Servicio': 'Calibración estática y dinámica',
      'Tecnología': 'Equipos de última generación',
      'Requisito': 'Post-reemplazo de parabrisas',
      'Sistemas': 'Control de crucero adaptativo, asistente de carril, etc.'
    },
    compatibility: ['Vehículos equipados con ADAS']
  },
  {
    id: 'tintado-de-lunas',
    name: 'Tintado de Lunas',
    description: 'Instalación profesional de láminas de tintado para lunas. Mejora la estética, aumenta la privacidad y protege el interior de tu coche de los rayos UV.',
    price: 120.00,
    image: getImage('product-tint'),
    specifications: {
      'Servicio': 'Instalación de láminas de control solar',
      'Material': 'Lámina de alta calidad',
      'Beneficios': 'Protección UV, privacidad, reducción de calor',
      'Legal': 'Cumple con la normativa vigente'
    },
    compatibility: ['Cristales laterales y luneta trasera']
  },
  {
    id: 'escobillas-limpiaparabrisas',
    name: 'Escobillas Limpiaparabrisas',
    description: 'Venta e instalación de escobillas limpiaparabrisas de alta calidad. Mejora la visibilidad y seguridad en condiciones de lluvia.',
    price: 25.00,
    image: getImage('product-6'),
    specifications: {
      'Servicio': 'Venta e instalación',
      'Material': 'Goma de alta calidad',
      'Duración': 'Hasta 12 meses',
      'Beneficios': 'Mejor visibilidad, limpieza eficiente'
    },
    compatibility: ['Todos los vehículos']
  },
  {
    id: 'tratamiento-antilluvia-mosquitos',
    name: 'Tratamiento Antilluvia & Mosquitos',
    description: 'Aplicamos un tratamiento hidrofóbico avanzado a tu parabrisas. Repele el agua, la suciedad y los insectos, mejorando drásticamente la visibilidad en condiciones adversas.',
    price: 39.99,
    image: getImage('product-rain'),
    specifications: {
      'Servicio': 'Aplicación de tratamiento hidrofóbico',
      'Duración': 'Hasta 6 meses',
      'Beneficios': 'Mejora la visibilidad, facilita la limpieza, repele mosquitos',
      'Aplicación': 'Parabrisas y cristales delanteros'
    },
    compatibility: ['Todos los vehículos']
  },
  {
    id: 'baliza-homologada',
    name: 'Baliza de Emergencia Homologada',
    description: 'Venta de baliza de emergencia homologada DGT 2026. Obligatoria en carretera. Incluye batería y soporte magnético.',
    price: 54.45,
    image: getImage('product-4'),
    specifications: {
      'Homologación': 'DGT 2026',
      'Incluye': 'Batería y soporte magnético',
      'Obligatoria': 'En carretera desde 2026',
      'Marca': 'OSRAM'
    },
    compatibility: ['Todos los vehículos']
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

export const reviews: Review[] = [
  {
    id: "review-1",
    author: "Victor L.",
    rating: 5,
    content: "Muy contento con el servicio prestado, la atención es inmejorable, te avisan de cuando reciben el cristal, te dan cita y en 1 hora lo tienes listo. Muy profesionales. Calidad-precio de lo mejor que he encontrado en Barcelona. Muy recomendable.",
    source: "Google",
  },
  {
    id: "review-2",
    author: "Jose K.",
    rating: 5,
    content: "Muy profesionales, el mejor precio de toda Barcelona, el trabajo impecable, el trato excelente, muy puntuales. 100% recomendados.",
    source: "Google",
  },
  {
    id: "review-3",
    author: "Juan A.",
    rating: 5,
    content: "Servicio súper profesional y rápido. Tuve que cambiar la luna delantera de mi coche y me lo gestionaron todo súper rápido. El trato con el cliente es exquisito y el precio muy competitivo. Recomendable al 100%.",
    source: "Google",
  }
];
