import { NextRequest } from "next/server";
import client from "@/utils/mongodb";

interface CouponFilter {
  $or?: Array<{
    code?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
  isActive?: boolean;
  type?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // pagination params
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(
    100,
    Math.max(1, Number(searchParams.get("pageSize") || 20))
  );

  // optional filters
  const q = searchParams.get("q") || "";
  const isActive = searchParams.get("isActive");
  const type = searchParams.get("type");
  const collection = await client.db("pure-aura-harvest").collection("coupons");

  const where: CouponFilter = {};
  if (q) {
    where.$or = [
      { code: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }
  if (isActive === "true") where.isActive = true;
  if (isActive === "false") where.isActive = false;
  if (type) where.type = type as string;

  // total count (for frontend pagination)
  const total = await collection.countDocuments(where);

  // get paginated items
  const items = await collection
    .find(where)
    .sort({ createdAt: -1 }) // newest first
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return Response.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const coupons = await client.db("pure-aura-harvest").collection("coupons");

  const now = new Date();
  const newCoupon = {
    ...body,
    code: body.code.toUpperCase(),
    createdAt: now,
    updatedAt: now,
    usedCount: 0,
    isActive: true,
  };

  // ensure unique code
  const exists = await coupons.findOne({ code: newCoupon.code });
  if (exists) {
    return Response.json(
      { error: "Coupon code already exists" },
      { status: 409 }
    );
  }

  const result = await coupons.insertOne(newCoupon);
  return Response.json(
    { _id: result.insertedId, ...newCoupon },
    { status: 201 }
  );
}
