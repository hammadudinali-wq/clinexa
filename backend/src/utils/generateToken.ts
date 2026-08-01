import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  console.log("SECRET IN TOKEN GEN:", secret);

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    { id: userId },
    secret,
    {
      expiresIn: "7d",
    }
  );
};