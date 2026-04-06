import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const toBool = (value: string): boolean => value.toLowerCase() === "true";

export const config = {
  port: Number(getEnv("PORT", "4000")),
  databaseUrl: getEnv("DATABASE_URL"),
  accessTokenSecret: getEnv("ACCESS_TOKEN_SECRET"),
  refreshTokenSecret: getEnv("REFRESH_TOKEN_SECRET"),
  accessTokenTtl: Number(getEnv("ACCESS_TOKEN_TTL", "900")),
  refreshTokenTtl: Number(getEnv("REFRESH_TOKEN_TTL", "604800")),
  cookie: {
    nameAccess: getEnv("COOKIE_NAME_ACCESS", "access_token"),
    nameRefresh: getEnv("COOKIE_NAME_REFRESH", "refresh_token"),
    secure: toBool(getEnv("COOKIE_SECURE", "false")),
    sameSite: getEnv("COOKIE_SAMESITE", "lax").toLowerCase(),
    domain: getEnv("COOKIE_DOMAIN", "") || undefined,
  },
  corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:3001/"),
};
