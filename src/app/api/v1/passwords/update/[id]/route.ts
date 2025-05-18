import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const PUT = async (request: Request,
    context: { params: Promise<{ id: string }> },) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { username, password, note } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const result = await db.collection("passwords").updateOne(
      { _id: new ObjectId(id) },
      { $set: { username, password, note } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Password entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
