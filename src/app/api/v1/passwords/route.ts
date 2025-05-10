import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  const db = await connectDB();
  const data = await db.collection("passwords").find().toArray();
  return NextResponse.json(data);
};
