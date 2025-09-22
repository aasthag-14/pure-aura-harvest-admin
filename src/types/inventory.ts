export interface InventoryItem {
  _id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  price: number;
  description?: string;
  sku?: string;
  minStockLevel?: number;
  discount: number;
  benefits?: string[];
  details?: string[];
}

export interface InventoryFormData {
  name: string;
  brand: string;
  category: string;
  price: number | string;
  stock: number | string;
  description?: string;
  sku?: string;
  minStockLevel?: number;
  discount: number;
  benefits?: string[];
  details?: string[];
}
