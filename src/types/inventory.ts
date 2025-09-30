type YES_NO = "Yes" | "No";

export interface InventoryFormData {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  discount: number;
  description?: string;
  sku?: string;
  minStockLevel?: number;
  benefits?: string[];
  details?: string[];
  images?: string[];
  _id?: string;
  isBestSeller?: YES_NO;
  isNewArrival?: YES_NO;
  inStock?: YES_NO;
  shortDescription?: string;
}
