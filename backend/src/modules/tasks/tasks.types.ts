import type { TaskPriority, TaskStatus } from "@prisma/client";

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;
