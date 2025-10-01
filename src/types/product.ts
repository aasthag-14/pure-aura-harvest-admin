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
  | "fragrance-oils"
  | "air-freshener"
  | "car-air-fresheners";

type Brand = (typeof BRANDS)[keyof typeof BRANDS]["name"];

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
};
