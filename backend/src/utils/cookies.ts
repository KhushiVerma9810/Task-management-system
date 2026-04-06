import type { Response } from "express";
import { config } from "../config/env";

const baseCookieOptions = {
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite as "lax" | "strict" | "none",
  domain: config.cookie.domain,
  path: "/",
};

export const setAccessCookie = (res: Response, token: string) => {
  res.cookie(config.cookie.nameAccess, token, {
    ...baseCookieOptions,
    maxAge: config.accessTokenTtl * 1000,
  });
};

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(config.cookie.nameRefresh, token, {
    ...baseCookieOptions,
    maxAge: config.refreshTokenTtl * 1000,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(config.cookie.nameAccess, baseCookieOptions);
  res.clearCookie(config.cookie.nameRefresh, baseCookieOptions);
};
