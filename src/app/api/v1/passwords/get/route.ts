import { connectDB } from "@/lib/connectDB";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Get authenticated user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Extract email and username from user object
    const email = user.emailAddresses?.[0]?.emailAddress;
    const username = user.username;

    if (!email || !username) {
      return NextResponse.json(
        { error: "User email or username not found" },
        { status: 400 }
      );
    }

    // Connect to MongoDB database
    const db = await connectDB();

    // Fetch all password records belonging to this user
    const userPasswords = await db
      .collection("passwords")
      .find({ "user.email": email, "user.username": username })
      .toArray();

    if (userPasswords.length === 0) {
      return NextResponse.json(
        { error: "No password data found for this user" },
        { status: 404 }
      );
    }

    // Return user's filtered password data
    return NextResponse.json(userPasswords, { status: 200 });
  } catch (error) {
    console.error("Error fetching secure data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
