// app/api/transactions/total/route.ts
import prisma from "@/libs/prisma";
import { verifyToken } from "@/libs/verifyToken";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Token is required" }, { status: 401 });

    // Verify token and extract user ID
    const { valid, decoded, message } = verifyToken(token);

    if (!valid) {
      // If the token is expired or invalid, return an appropriate message
      return NextResponse.json({ message }, { status: 401 });
    }
    // This will throw an error if the token is invalid
    const userId = decoded.userId; // Assuming `userId` is stored in the token payload

    // Fetch transactions and calculate total (same logic as before)
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const totalAmount = transactions.reduce((total, transaction) => {
      return String(transaction.type).toUpperCase() === "ADD"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    return NextResponse.json({ totalAmount });
  } catch (error) {
    return NextResponse.json(
      { error: "Error verifying token" },
      { status: 500 }
    );
  }
}
