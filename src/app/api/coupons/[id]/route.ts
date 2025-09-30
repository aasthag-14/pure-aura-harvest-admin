import { NextRequest, NextResponse } from "next/server";
import client from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const coupon = await client
      .db("pure-aura-harvest")
      .collection("coupons")
      .findOne({ _id: new ObjectId(id) });

    if (!coupon) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json(coupon);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // get last part of URL

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();
    const result = await client
      .db("pure-aura-harvest")
      .collection("coupons")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    if (!result?.value)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(result.value);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating coupon", error: err },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // get last part of URL

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }
    const result = await client
      .db("pure-aura-harvest")
      .collection("coupons")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error deleting coupon" },
      { status: 500 }
    );
  }
}
