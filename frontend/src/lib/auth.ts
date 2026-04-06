import { apiFetch } from "./api";
import type { AuthUser, LoginRequest, RegisterRequest } from "@shared/auth";

type AuthResponse = AuthUser;

export const registerUser = (payload: RegisterRequest) => {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const loginUser = (payload: LoginRequest) => {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logoutUser = () => {
  return apiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
  });
};

let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = async () => {
  try {
    await apiFetch<{ message: string }>("/auth/refresh", {
      method: "POST",
      skipAuthRefresh: true,
    });
    return true;
  } catch {
    return false;
  }
};

export const checkAuth = async () => {
  try {
    await apiFetch<{ id: string; email: string }>("/auth/me", {
      method: "GET",
      skipAuthRefresh: true,
    });
    return true;
  } catch {
    if (!refreshInFlight) {
      refreshInFlight = refreshSession().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }
};

export const getTasks = (query: string) => {
  return apiFetch<{ items: unknown[]; meta: unknown }>(`/tasks?${query}`);
};
