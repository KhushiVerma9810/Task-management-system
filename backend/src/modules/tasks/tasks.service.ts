import { TaskStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/errors";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.types";

const statusCycle: Record<TaskStatus, TaskStatus> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};

export const listTasks = async ({
  userId,
  skip,
  take,
  status,
  priority,
  search,
}: {
  userId: string;
  skip: number;
  take: number;
  status?: TaskStatus;
  priority?: import("@prisma/client").TaskPriority;
  search?: string;
}) => {
  const where = {
    userId,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { id: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return { items, total };
};

export const getTask = async (userId: string, id: string) => {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

export const createTask = async (userId: string, input: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      ...input,
      userId,
    },
  });
};

export const updateTask = async (userId: string, id: string, input: UpdateTaskInput) => {
  await getTask(userId, id);
  return prisma.task.update({
    where: { id },
    data: input,
  });
};

export const deleteTask = async (userId: string, id: string) => {
  await getTask(userId, id);
  await prisma.task.delete({ where: { id } });
};

export const toggleTaskStatus = async (userId: string, id: string) => {
  const task = await getTask(userId, id);
  const nextStatus = statusCycle[task.status];
  return prisma.task.update({
    where: { id },
    data: { status: nextStatus },
  });
};
