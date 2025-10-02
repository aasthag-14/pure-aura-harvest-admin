import { NextRequest, NextResponse } from "next/server";
import client from "@/utils/mongodb";

export async function GET() {
  try {
    const collections = await client
      .db("pure-aura-harvest")
      .collection("collections")
      .find()
      .toArray();

    return NextResponse.json(collections);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description } = body || {};
    if (!id || !title || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await client
      .db("pure-aura-harvest")
      .collection("collections")
      .insertOne({ id, title, description });

    return NextResponse.json(
      { message: "Collection added", id: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error adding collection" },
      { status: 500 }
    );
  }
}

