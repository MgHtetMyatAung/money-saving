import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email && !password) {
    return NextResponse.json({
      message: "Email or password are required",
    });
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    message: "User registered successfully",
    user: { id: user.id, email: user.email },
  });
}
