import { NextResponse } from "next/server";
import client from "@/utils/mongodb";

export async function GET() {
  try {
    const orders = await client
      .db("pure-aura-harvest")
      .collection("users")
      .find()
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
