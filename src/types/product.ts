export interface Product {
  _id: string;
  id: string;
  name: string;
  active?: boolean;
  description?: string;
  category: "fragrance" | "aromatherapy" | "food" | string;
  brand: string;
  price: number;
  discount?: number;
  stock: number;
  image?: string;
  images: string[];
  tagline?: string;
  benefits?: string[];
  usage?: string;
  details?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  nutrition?: Nutrition;
  minStockLevel?: number;
}

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // Add other specific nutrition properties
}
