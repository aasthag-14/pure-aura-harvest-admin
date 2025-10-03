type CouponType = "PERCENT" | "FLAT" | "B1G1";
type CouponScope = "ALL" | "COLLECTION";
interface Coupon {
  _id: string;
  code: string;
  description?: string | null;
  type: CouponType;
  value: number;
  scope?: CouponScope; // default ALL if missing
  collectionId?: string | null; // applicable when scope === "COLLECTION"
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

export type { CouponType, CouponScope, Coupon, ListResponse };
