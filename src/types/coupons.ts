type CouponType = "PERCENT" | "FLAT";
interface Coupon {
  _id: string;
  code: string;
  description?: string | null;
  type: CouponType;
  value: number;
  maxDiscount?: number | null;
  minOrder?: number | null;
  usageLimit?: number | null;
  usagePerUser?: number | null;
  usedCount?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type ListResponse = {
  items: Coupon[];
  total: number;
  page: number;
  pageSize: number;
};

export type { CouponType, Coupon, ListResponse };
