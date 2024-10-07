// app/api/transactions/all/route.ts
import prisma from "@/libs/prisma";
import { verifyToken } from "@/libs/verifyToken";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Token is required" }, { status: 401 });

    // Verify token and extract user ID
    const { valid, message, decoded } = verifyToken(token);
    if (!valid) return NextResponse.json({ message }, { status: 401 });

    const userId = decoded.userId;

    // Fetch all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
