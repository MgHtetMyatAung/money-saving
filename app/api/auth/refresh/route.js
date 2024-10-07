// Your token functions

import prisma from "@/libs/prisma";
import { generateAccessToken, verifyRefreshToken } from "@/libs/verifyToken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { refreshToken } = await request.json(); // Get refresh token from request body
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify the refresh token
    const { valid, decoded, message } = verifyRefreshToken(refreshToken);

    if (!valid) return NextResponse.json({ message }, { status: 401 });

    const userId = decoded.userId; // Extract userId from token payload

    // Optionally, check if the refresh token is still valid in the database (if stored there)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken({ userId: user.id });

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error refreshing access token" },
      { status: 500 }
    );
  }
}
