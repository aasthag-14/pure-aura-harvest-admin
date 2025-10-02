import client from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const doc = await client
      .db("pure-aura-harvest")
      .collection("collections")
      .findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const result = await client
      .db("pure-aura-harvest")
      .collection("collections")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }
    const body = await req.json();
    const update = { ...body };
    delete update._id;

    const result = await client
      .db("pure-aura-harvest")
      .collection("collections")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating", error: err },
      { status: 500 }
    );
  }
}

