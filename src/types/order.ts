export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderDate: Date; // defaulted in backend
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "unpaid" | "paid" | "refunded" | "failed";
  paymentMethod: "credit_card" | "cod" | "upi" | "bank_transfer";
  totalAmount: number;
  currency?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod: "standard" | "express" | "same_day";
  trackingNumber?: string;
  estimatedDeliveryDate?: Date | string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
