import prisma from "@/libs/prisma";
import { verifyToken } from "@/libs/verifyToken";
import { NextResponse } from "next/server";

export async function POST(params) {
  try {
    const token = params.headers.get("authorization")?.replace("Bearer ", "");
    const { amount, type, description } = await params.json();
    console.log(amount, type, description);
    if (!amount || !type || !description) {
      return NextResponse.json(
        { error: "Some fields are required" },
        { status: 400 }
      );
    }

    if (!token)
      return NextResponse.json({ error: "Token is required" }, { status: 401 });
    console.log(token);

    const { valid, decoded, message } = verifyToken(token);

    if (!valid) return NextResponse.json({ message }, { status: 401 });
    const userId = decoded.userId;

    console.log(userId);

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-based
    const currentYear = currentDate.getFullYear();
    console.log(amount, type, description, userId);
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description,
        userId,
        month: currentMonth,
        year: currentYear,
      },
    });

    console.log(transaction);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating transaction" },
      { status: 500 }
    );
  }
}
