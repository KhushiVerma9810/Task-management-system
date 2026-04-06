import type { Request, Response, NextFunction } from "express";
import { getPagination, buildPaginationMeta } from "../../utils/pagination";
import { createTaskSchema, taskPriorityEnum, taskStatusEnum, updateTaskSchema } from "../../validators/tasks.validation";
import { createTask, deleteTask, getTask, listTasks, toggleTaskStatus, updateTask } from "./tasks.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageRaw = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page;
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const statusRaw = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
    const priorityRaw = Array.isArray(req.query.priority) ? req.query.priority[0] : req.query.priority;
    const searchRaw = Array.isArray(req.query.search) ? req.query.search[0] : req.query.search;

    const { page, limit, skip, take } = getPagination(
      pageRaw as string | undefined,
      limitRaw as string | undefined
    );
    const status = statusRaw ? taskStatusEnum.parse(statusRaw) : undefined;
    const priority = priorityRaw ? taskPriorityEnum.parse(priorityRaw) : undefined;
    const search = searchRaw ? String(searchRaw) : undefined;

    const { items, total } = await listTasks({
      userId: req.user!.id,
      skip,
      take,
      status,
      priority,
      search,
    });

    return res.status(200).json({
      items,
      meta: buildPaginationMeta(page, limit, total),
    });
  } catch (err) {
    return next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createTaskSchema.parse(req.body);
    const task = await createTask(req.user!.id, {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    });
    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTask(req.user!.id, req.params.id);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateTaskSchema.parse(req.body);
    const task = await updateTask(req.user!.id, req.params.id, {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    });
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTask(req.user!.id, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const toggle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await toggleTaskStatus(req.user!.id, req.params.id);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};
