import { apiFetch } from "./api";
import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@shared/tasks";
import type { PaginationMeta } from "@shared/pagination";

export type TaskListResponse = {
  items: Task[];
  meta: PaginationMeta;
};

export const fetchTasks = (params: URLSearchParams) => {
  return apiFetch<TaskListResponse>(`/tasks?${params.toString()}`);
};

export const createTask = (payload: CreateTaskRequest) => {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateTask = (id: string, payload: UpdateTaskRequest) => {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteTask = (id: string) => {
  return apiFetch<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
};

export const toggleTask = (id: string) => {
  return apiFetch<Task>(`/tasks/${id}/toggle`, {
    method: "POST",
  });
};
