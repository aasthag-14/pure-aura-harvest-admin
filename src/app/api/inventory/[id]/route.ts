import client from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // get last part of URL

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const product = await client
      .db("pure-aura-harvest")
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
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
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Item deleted successfully" });
    } else {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error deleting item" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // get last part of URL

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();

    delete body?._id;

    const result = await client
      .db("pure-aura-harvest")
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: body });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating item", error: err },
      { status: 500 }
    );
  }
}
