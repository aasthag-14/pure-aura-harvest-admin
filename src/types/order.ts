export interface OrderItem {
  id: string;
  name: string;
  image: string;
  unitPrice: string; // you might consider number if this should be numeric
  originalPrice: number;
  quantity: number;
}

export interface Address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
}

export interface Order {
  _id: string;
  order_id: string;
  customer: {
    mobile: string;
    addressForm: Address;
  };
  items: OrderItem[];
  total_amount: number;
  razorpay_order_id: string;
  payment: {
    status: "pending" | "success" | "failed";
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
  };
  order_status: "created" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string; // could be Date if you parse it
  updated_at: string; // could be Date if you parse it
  coupon?: {
    code: string;
    discount: number;
  };
}
