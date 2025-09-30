export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: {
    id: string;
    url: string;
    hint: string;
  };
  specifications: { [key: string]: string };
  compatibility: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};
