import { BRANDS } from "@/constants";

export type Product = {
  _id: string;
  id: string;
  benefits: string[];
  category: ProductType;
  description: string;
  details: string[];
  discount: number;
  duration: string;
  images: string[];
  index: number;
  metadata: {
    title: string;
    description: string;
    keywords: string;
    image: string;
  };
  name: string;
  price: number;
  tagline: string;
  stock: number;
  active: boolean;
  brand: Brand;
  minStockLevel: number;
  isBestSeller: "Yes" | "No";
  isNewArrival: "Yes" | "No";
  inStock: "Yes" | "No";
  onSale: boolean;
  rating: number;
  reviews: Review[];
  shipping: string;
  sku: string;
  shortDescription: string;
  usage?: string;
};

export type ProductType =
  | "product"
  | "fragrance"
  | "aromatherapy"
  | "diffuser"
  | "fragrance-oil"
  | "air-freshener";

type Brand = (typeof BRANDS)[keyof typeof BRANDS]["name"];

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
};

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  image: string;
}

export interface Fragrance {
  index: number;
  id: string;
  name: string;
  description: string;
  benefits: string[];
  duration: string;
  price: string;
  images: string[];
  tagline: string;
  details: string[];
  metadata: MetaData;
  discount?: number;
  category: "car-perfume";
}

export interface AromatherapyOil {
  index: number;
  id: string;
  name: string;
  description: string;
  benefits: string[];
  scentProfile: string[];
  volume: string;
  price: string;
  images: string[];
  tagline: string;
  details: string[];
  metadata: MetaData;
  discount?: number;
  category: "aromatherapy";
  therapeuticProperties: string[];
  applicationMethods: string[];
}

export interface RoomDiffuser {
  index: number;
  id: string;
  name: string;
  description: string;
  benefits: string[];
  coverage: string;
  runtime: string;
  price: string;
  images: string[];
  tagline: string;
  details: string[];
  metadata: MetaData;
  discount?: number;
  category: "diffuser";
  features: string[];
  includedOils: string[];
}

export interface FragranceOil {
  index: number;
  id: string;
  name: string;
  description: string;
  benefits: string[];
  concentration: string;
  volume: string;
  price: string;
  images: string[];
  tagline: string;
  details: string[];
  metadata: MetaData;
  discount?: number;
  category: "fragrance-oil";
  scentNotes: string[];
  applications: string[];
}

export interface AirFreshener {
  index: number;
  id: string;
  name: string;
  description: string;
  benefits: string[];
  coverage: string;
  duration: string;
  price: string;
  images: string[];
  tagline: string;
  details: string[];
  metadata: MetaData;
  discount?: number;
  category: "air-freshener";
  type: "spray" | "gel" | "candle" | "reed";
  features: string[];
}
