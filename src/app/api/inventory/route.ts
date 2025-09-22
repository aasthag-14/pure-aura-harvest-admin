import { NextRequest, NextResponse } from "next/server";
import client from "@/utils/mongodb";

export async function GET() {
  try {
    const inventory = await client
      .db("pure-aura-harvest")
      .collection("inventory")
      .find()
      .toArray();

    return NextResponse.json(inventory);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await client
      .db("pure-aura-harvest")
      .collection("inventory")
      .insertOne(body);

    return NextResponse.json(
      { message: "Item added successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error adding item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body._id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const inventory = await client
      .db("pure-aura-harvest")
      .collection("inventory")
      .updateOne({ _id: body._id }, { $set: body });

    if (inventory.matchedCount === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated" });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating item", error: err },
      { status: 500 }
    );
  }
}
