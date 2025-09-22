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
}
