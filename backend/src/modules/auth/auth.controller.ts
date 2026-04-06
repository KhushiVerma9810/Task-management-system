import type { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../../validators/auth.validation";
import { clearAuthCookies, setAccessCookie, setRefreshCookie } from "../../utils/cookies";
import { loginUser, logoutUser, refreshTokens, registerUser } from "./auth.service";
import { config } from "../../config/env";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await registerUser(input);
    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await loginUser(input);
    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    return res.status(200).json({ id: user.id, email: user.email });
  } catch (err) {
    return next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[config.cookie.nameRefresh];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const { accessToken, refreshToken } = await refreshTokens(token);
    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[config.cookie.nameRefresh];
    await logoutUser(token);
    clearAuthCookies(res);
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
};

export const me = async (req: Request, res: Response) => {
  return res.status(200).json({ id: req.user?.id, email: req.user?.email });
};
