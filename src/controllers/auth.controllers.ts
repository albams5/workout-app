import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401);

    const accessToken = jwt.sign(
      { userId: foundUser.id, username: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { userId: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1m" }
    );

    await prisma.user.update({
      where: { id: foundUser.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 70 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) return res.sendStatus(401);

  try {
    const verifiedToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: verifiedToken.userId },
    });
    if (user?.refreshToken !== token) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: verifiedToken.userId, email: user?.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const verifiedToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: verifiedToken.userId },
    });
    if (user?.refreshToken !== token) return res.sendStatus(403);

    await prisma.user.update({
      where: { id: verifiedToken.userId },
      data: { refreshToken: null },
    });

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(204);
  }
};
