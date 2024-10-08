import prisma from "@/libs/prisma";
import { verifyToken } from "@/libs/verifyToken";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const { amount, type, description } = await req.json();
    const { id } = params;
    console.log(amount, type, description, id);
    if (!amount || !type || !description) {
      return NextResponse.json(
        { error: "Some fields are required" },
        { status: 400 }
      );
    }

    if (!token)
      return NextResponse.json({ error: "Token is required" }, { status: 401 });

    const { valid, decoded, message } = verifyToken(token);

    if (!valid) return NextResponse.json({ message }, { status: 401 });
    const userId = decoded.userId;

    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id), userId },
      data: {
        amount,
        type,
        description,
      },
    });
    console.log(transaction);

    if (transaction.count === 0) {
      return NextResponse.json(
        { error: "Transaction not found or not yours" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction, { status: 200 });
    // return NextResponse.json({ message: userId });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const { id } = params;

    if (!token)
      return NextResponse.json({ error: "Token is required" }, { status: 401 });

    const { valid, decoded, message } = verifyToken(token);

    if (!valid) return NextResponse.json({ message }, { status: 401 });
    const userId = decoded.userId;

    await prisma.transaction.delete({
      where: { id: parseInt(id), userId },
    });

    return NextResponse.json(
      { message: "Transaction successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting transaction" },
      { status: 500 }
    );
  }
}
