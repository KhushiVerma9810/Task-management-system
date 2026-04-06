export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  message: string;
  errors?: unknown;
  details?: unknown;
};
