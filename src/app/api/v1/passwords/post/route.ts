import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const db = await connectDB();
    const result = await db.collection("passwords").insertOne({
      ...body,
    });

    return NextResponse.json({
      message: "Password saved",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/password error:", error);
    return NextResponse.json(
      { error: "Failed to save password" },
      { status: 500 }
    );
  }
};
