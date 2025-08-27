import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ladarajaya88";

export async function registerUser({ name, email, password, verifyPassword }) {
  if (password !== verifyPassword)
    throw new Error("Verification password mismatched.");

  if (password.length <= 8)
    throw new Error("Password require more than 8 characters.");

  if (!/[A-Z]/.test(password))
    throw new Error("Password require at least 1 uppercase character.");

  if (!/\d/.test(password))
    throw new Error("Password require at least 1 numeric character.");

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    throw new Error("Password require at least 1 special character.");

  const existing = await UserModel.findByEmail(email);
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  return await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });
}

export async function loginUser({ email, password }) {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
