import { z } from "zod";

export const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

const dateString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: dateString.optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
