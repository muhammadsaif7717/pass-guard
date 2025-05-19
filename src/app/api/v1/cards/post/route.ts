import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    if (
      !body.name ||
      !body.cardNumber ||
      !body.expiry ||
      !body.cvv ||
      !body.user?.email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const result = await db.collection("cards").insertOne({
      ...body,
    });

    return NextResponse.json({ message: "Card saved", id: result.insertedId });
  } catch (error) {
    console.error("POST /api/password error:", error);
    return NextResponse.json(
      { error: "Failed to save password" },
      { status: 500 }
    );
  }
};
