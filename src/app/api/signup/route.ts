import { NextResponse } from "next/server";
import client from "@/utils/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const existingUser = await client
      .db("pure-aura-harvest")
      .collection("users")
      .findOne({ email });

    if (existingUser)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.db("pure-aura-harvest").collection("users").insertOne({
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
