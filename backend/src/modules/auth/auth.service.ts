import { prisma } from "../../config/prisma";
import { config } from "../../config/env";
import { hashPassword, verifyPassword } from "../../utils/bcrypt";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { hashToken } from "../../utils/token";
import { AppError } from "../../utils/errors";
import type { LoginInput, RegisterInput } from "./auth.types";

const createRefreshTokenRecord = async (userId: string, token: string) => {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + config.refreshTokenTtl * 1000);
  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
};

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError("Email already in use", 400);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
    },
  });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
  await createRefreshTokenRecord(user.id, refreshToken);

  return { user, accessToken, refreshToken };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
  await createRefreshTokenRecord(user.id, refreshToken);

  return { user, accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string) => {
  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }
  const tokenHash = hashToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored || stored.revokedAt || stored.userId !== payload.sub) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (stored.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = signAccessToken({ sub: payload.sub, email: payload.email });
  const newRefreshToken = signRefreshToken({ sub: payload.sub, email: payload.email });
  await createRefreshTokenRecord(payload.sub, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken?: string) => {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored || stored.revokedAt) return;

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
};
