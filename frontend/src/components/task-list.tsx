"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  LayoutGridIcon,
  Loader2Icon,
  SearchIcon,
  TimerIcon,
} from "lucide-react";
import { toast } from "sonner";
import { fetchTasks, toggleTask } from "@/lib/tasks";
import type { Task, TaskPriority, TaskStatus } from "@shared/tasks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskForm } from "@/components/task-form";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const statusTabs: Array<{ label: string; value: TaskStatus | "" }> = [
  { label: "All", value: "" },
  { label: "To do", value: "TODO" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

const priorityOptions: Array<{ label: string; value: TaskPriority | "" }> = [
  { label: "All priorities", value: "" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];

const statusBadge: Record<TaskStatus, string> = {
  TODO: "bg-[#f1edff] text-[#5a47d6]",
  IN_PROGRESS: "bg-[#fff2dc] text-[#d07a12]",
  DONE: "bg-[#e7f8ef] text-[#1f8c4f]",
};

const priorityBadge: Record<TaskPriority, string> = {
  LOW: "bg-[#e7f8ef] text-[#1f8c4f]",
  MEDIUM: "bg-[#fff2dc] text-[#d07a12]",
  HIGH: "bg-[#ffe4e4] text-[#c23a3a]",
};

const statusLabel: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const priorityLabel: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const formatDateChip = (date?: string) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  const isPast = parsed.getTime() < new Date().setHours(0, 0, 0, 0);
  const formatted = parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    text: `${isPast ? "Overdue" : "Due"} - ${formatted}`,
    className: isPast ? "bg-[#ffe4e4] text-[#c23a3a]" : "bg-[#eef1ff] text-[#4a4eb8]",
  };
};

export function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const params = useMemo(() => {
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("limit", String(limit));
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    if (priority) query.set("priority", priority);
    return query;
  }, [page, limit, status, search, priority]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTasks(params);
      setTasks(response.items);
      setMeta({ total: response.meta.total, totalPages: response.meta.totalPages });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load tasks";
      if (message.toLowerCase().includes("unauthorized")) {
        router.push("/login");
        return;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [params]);

  const handleToggle = async (id: string) => {
    try {
      await toggleTask(id);
      toast.success("Task updated");
      loadTasks();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update task";
      toast.error(message);
    }
  };

  const totalPages = meta.totalPages || 1;
  const totalCount = meta.total || tasks.length;
  const todoCount = tasks.filter((task) => task.status === "TODO").length;
  const inProgressCount = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((task) => task.status === "DONE").length;

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1f1b2d]">My tasks</h1>
          <p className="text-sm text-[#6b6780]">You have {todoCount} tasks to do today</p>
        </div>
        <TaskForm
          triggerLabel="Add task"
          onSuccess={loadTasks}
          triggerClassName="h-10 rounded-xl bg-[#5a47d6] px-5 text-sm font-semibold text-white hover:bg-[#4b39c5]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-[#ece8f6] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#f1edff] text-[#5a47d6]">
              <LayoutGridIcon className="size-4" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-[#1f1b2d]">{totalCount}</p>
              <p className="text-xs text-[#6b6780]">Total tasks</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border border-[#ece8f6] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#f1edff] text-[#5a47d6]">
              <CircleDotIcon className="size-4" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-[#1f1b2d]">{todoCount}</p>
              <p className="text-xs text-[#6b6780]">To do</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border border-[#ece8f6] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#fff2dc] text-[#d07a12]">
              <TimerIcon className="size-4" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-[#1f1b2d]">{inProgressCount}</p>
              <p className="text-xs text-[#6b6780]">In progress</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border border-[#ece8f6] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#e7f8ef] text-[#1f8c4f]">
              <CheckCircle2Icon className="size-4" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-[#1f1b2d]">{doneCount}</p>
              <p className="text-xs text-[#6b6780]">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border border-[#ece8f6] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a39fb8]" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-xl border-[#ece8f6] bg-[#fbfaff] pl-9 text-sm"
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Select
                value={priority || "all"}
                onValueChange={(value) => {
                  setPriority(value === "all" ? "" : (value as TaskPriority));
                  setPage(1);
                }}
              >
              <SelectTrigger className="h-10 w-full rounded-xl border-[#ece8f6] bg-[#fbfaff] text-sm sm:w-[200px]">
                <span className="flex flex-1 text-left text-sm">
                  {priority ? priorityLabel[priority] : "All priorities"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.label} value={option.value || "all"}>
                    {option.label}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-10 w-full rounded-xl border-[#ece8f6] bg-[#fbfaff] text-sm sm:w-[180px]">
                  <SelectValue placeholder="Newest first" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 rounded-xl border border-[#ece8f6] bg-[#fbfaff] p-1">
            {statusTabs.map((tab) => {
              const isActive = status === tab.value;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setStatus(tab.value);
                    setPage(1);
                  }}
                  className={cn(
                    "flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition",
                    isActive
                      ? "bg-white text-[#1f1b2d] shadow-sm"
                      : "text-[#6b6780] hover:text-[#1f1b2d]"
                  )}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#ece8f6] py-10 text-sm text-[#6b6780]">
                <Loader2Icon className="mr-2 size-4 animate-spin" /> Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#ece8f6] py-10 text-center text-sm text-[#6b6780]">
                No tasks yet. Add your first task to get started.
              </div>
            ) : (
              tasks.map((task) => {
                const dueChip = formatDateChip(task.dueDate);
                return (
                  <div
                    key={task.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[#ece8f6] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === "DONE"}
                        onCheckedChange={() => handleToggle(task.id)}
                        aria-label={`Mark ${task.title} complete`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#1f1b2d]">{task.title}</p>
                        {task.description && (
                          <p className="mt-1 text-xs text-[#6b6780]">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge className={cn("rounded-full px-3 py-1", statusBadge[task.status])}>
                        {statusLabel[task.status]}
                      </Badge>
                      <Badge className={cn("rounded-full px-3 py-1", priorityBadge[task.priority])}>
                        {priorityLabel[task.priority]}
                      </Badge>
                      {dueChip && (
                        <Badge className={cn("rounded-full px-3 py-1", dueChip.className)}>
                          <CalendarIcon className="mr-1 size-3" />
                          {dueChip.text}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-xs text-[#6b6780]">
              Showing {rangeStart}-{rangeEnd} of {totalCount} tasks
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((prev) => Math.max(1, prev - 1));
                    }}
                    className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).slice(0, 3).map((_, index) => {
                  const current = index + 1;
                  return (
                    <PaginationItem key={current}>
                      <PaginationLink
                        href="#"
                        isActive={current === page}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(current);
                        }}
                      >
                        {current}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>
    </div>
  );
}
