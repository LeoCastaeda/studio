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
    name: 'Front Windshield for Sedan',
    description: 'High-quality laminated front windshield for most modern sedans. Provides excellent visibility and durability.',
    price: 249.99,
    image: getImage('product-1'),
    specifications: {
      'Material': 'Laminated Glass',
      'Thickness': '5mm',
      'Tint': 'Light Green',
      'Features': 'Acoustic Interlayer, Rain Sensor Bracket'
    },
    compatibility: ['Toyota Camry 2018-2023', 'Honda Accord 2019-2024', 'Ford Fusion 2017-2020']
  },
  {
    id: 'prod-002',
    name: 'Rear Window for SUV',
    description: 'Tempered rear window with defroster lines for popular SUV models. Easy to install and built to last.',
    price: 199.50,
    image: getImage('product-2'),
    specifications: {
      'Material': 'Tempered Glass',
      'Thickness': '4mm',
      'Tint': 'Privacy Black',
      'Features': 'Heated Defroster Lines'
    },
    compatibility: ['Ford Explorer 2020-2024', 'Jeep Grand Cherokee 2018-2023', 'Toyota RAV4 2019-2024']
  },
  {
    id: 'prod-003',
    name: 'Driver-Side Window for Truck',
    description: 'Durable side window glass for heavy-duty trucks. Resists scratches and impacts.',
    price: 89.00,
    image: getImage('product-3'),
    specifications: {
      'Material': 'Tempered Glass',
      'Thickness': '4mm',
      'Tint': 'Clear',
      'Features': 'Pre-drilled mounting holes'
    },
    compatibility: ['Ford F-150 2015-2023', 'Chevy Silverado 1500 2019-2024', 'Ram 1500 2019-2024']
  },
  {
    id: 'prod-004',
    name: 'Panoramic Sunroof Glass',
    description: 'Replacement glass panel for panoramic sunroofs. Offers UV protection and a clear view.',
    price: 450.00,
    image: getImage('product-4'),
    specifications: {
      'Material': 'Laminated Glass',
      'Thickness': '6mm',
      'Tint': 'Solar Control',
      'Features': 'UV Protection Layer, Pre-attached frame'
    },
    compatibility: ['Tesla Model 3', 'Hyundai Palisade', 'Kia Telluride']
  },
  {
    id: 'prod-005',
    name: 'Front Windshield for Sports Car',
    description: 'Aerodynamic and lightweight front windshield designed for performance sports cars.',
    price: 399.99,
    image: getImage('product-5'),
    specifications: {
      'Material': 'Gorilla Glass Hybrid',
      'Thickness': '4.5mm',
      'Tint': 'Light Blue',
      'Features': 'Heads-Up Display (HUD) Compatible'
    },
    compatibility: ['Porsche 911 2020-2024', 'Chevrolet Corvette C8', 'Ford Mustang 2018-2023']
  },
  {
    id: 'prod-006',
    name: 'Heated Side Mirror Glass',
    description: 'Replacement side mirror glass with heating element to clear ice and fog quickly.',
    price: 49.95,
    image: getImage('product-6'),
    specifications: {
      'Material': 'Convex Mirror Glass',
      'Thickness': '3mm',
      'Tint': 'Clear',
      'Features': 'Heating Element, Snap-on back plate'
    },
    compatibility: ['Volkswagen Golf GTI', 'Subaru Outback', 'Mazda CX-5']
  }
];

export const faqItems: FaqItem[] = [
    {
        question: "How long does a glass replacement take?",
        answer: "Most windshield replacements can be completed in 60 minutes or less. The vehicle will then need to sit for a short period for the adhesive to cure before it's safe to drive."
    },
    {
        question: "Do you handle insurance claims?",
        answer: "Yes, we work with all major insurance providers. We can help you file your claim and handle the paperwork to make the process as smooth as possible for you."
    },
    {
        question: "Is there a warranty on your glass and installation?",
        answer: "Absolutely. We offer a lifetime warranty on the installation for as long as you own your vehicle, covering any defects in workmanship. The glass itself is covered by the manufacturer's warranty against defects. See our Warranty page for full details."
    },
    {
        question: "Can you repair a small chip instead of replacing the whole windshield?",
        answer: "In many cases, yes. If the chip is smaller than a quarter and not in the driver's direct line of sight, a repair is often possible. A repair can save you time and money and is also covered by most insurance policies."
    },
    {
        question: "What kind of glass do you use?",
        answer: "We use high-quality glass that meets or exceeds OEM (Original Equipment Manufacturer) standards. This ensures a perfect fit, clear visibility, and the safety and structural integrity of your vehicle."
    }
];
