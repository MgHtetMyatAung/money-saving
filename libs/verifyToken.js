import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export function verifyToken(token) {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, decoded }; // Return the decoded payload (userId, etc.)
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // If token is expired, return this error
      return { valid: false, message: "Token has expired" };
    } else {
      // For all other errors (invalid signature, etc.)
      return { valid: false, message: "Invalid token" };
    }
  }
}

export function verifyRefreshToken(token) {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY);
    console.log(decoded, "decode");
    return { valid: true, decoded }; // Return the decoded payload (userId, etc.)
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      // If token is expired, return this error
      return {
        valid: false,
        message: "Refresh Token has expired, please login again",
      };
    } else {
      // For all other errors (invalid signature, etc.)
      return { valid: false, message: "Invalid token" };
    }
  }
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "17m" });
}
