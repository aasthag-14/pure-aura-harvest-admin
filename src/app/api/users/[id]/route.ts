import { UpdateUserRequest } from "@/types/user";
import client from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await client
      .db("pure-aura-harvest")
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    const result = await client
      .db("pure-aura-harvest")
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }
    const body: UpdateUserRequest = await request.json();
    const { email, name } = body;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await client
      .db("pure-aura-harvest")
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const emailExists = await client
        .db("pure-aura-harvest")
        .collection("users")
        .findOne({
          email,
          _id: { $ne: new ObjectId(id) },
        });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email is already taken by another user" },
          { status: 409 }
        );
      }
    }

    // Prepare update object
    const updateData = {
      updatedAt: new Date().toISOString(),
      email: email,
      name: name,
    };

    if (email) updateData.email = email;
    if (name !== undefined) updateData.name = name;

    // Update user
    const result = await client
      .db("pure-aura-harvest")
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 });
    }

    // Fetch and return updated user (without password)
    const updatedUser = await client
      .db("pure-aura-harvest")
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    const transformedUser = {
      id: updatedUser!._id.toString(),
      _id: updatedUser!._id.toString(),
      email: updatedUser!.email,
      name: updatedUser!.name || updatedUser!.email.split("@")[0],
    };

    return NextResponse.json(transformedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    // Fetch user (without password)
    const user = await client
      .db("pure-aura-harvest")
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transformedUser = {
      id: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      name: user.name || user.email.split("@")[0],
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
