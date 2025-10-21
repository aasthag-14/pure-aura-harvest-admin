import { CreateUserRequest } from "@/types/user";
import client from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await client
      .db("pure-aura-harvest")
      .collection("users")
      .find({}, { projection: { password: 0 } }) // Exclude password from response
      .toArray();

    // Transform users to match frontend expectations
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      name: user.name || user.email.split("@")[0], // Use email prefix as name if name not provided
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateUserRequest = await request.json();
    const { email, name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await client
      .db("pure-aura-harvest")
      .collection("users")
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const result = await client
      .db("pure-aura-harvest")
      .collection("users")
      .insertOne({
        email,
        name: name || email.split("@")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Return created user (without password)
    const createdUser = {
      id: result.insertedId.toString(),
      _id: result.insertedId.toString(),
      email,
      name: name || email.split("@")[0],
    };

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
