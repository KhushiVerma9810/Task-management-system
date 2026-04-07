"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { createTask, updateTask } from "@/lib/tasks";
import type { Task, TaskPriority, TaskStatus } from "@shared/tasks";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const priorityOptions: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};
const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function TaskForm({
  onSuccess,
  triggerLabel,
  task,
  triggerVariant,
  triggerSize,
  triggerClassName,
}: {
  onSuccess: () => void;
  triggerLabel: string;
  task?: Task;
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "MEDIUM");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : "");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "TODO");
    setPriority(task?.priority ?? "MEDIUM");
    setDueDate(task?.dueDate ? task.dueDate.slice(0, 10) : "");
  }, [open, task]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title,
        description: description || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
      };
      if (task) {
        await updateTask(task.id, payload);
        toast.success("Task updated");
      } else {
        await createTask(payload);
        toast.success("Task created");
      }
      setOpen(false);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const titleText = task ? "Edit task" : "Add new task";
  const descriptionText = task ? "Update the details for your task" : "Fill in the details to create a task";
  const submitText = task ? "Save task" : "Add task";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: triggerVariant ?? "default",
            size: triggerSize ?? "default",
            className: triggerClassName ?? "bg-emerald-700 text-white hover:bg-emerald-800",
          })
        )}
      >
        {triggerLabel}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl overflow-hidden rounded-2xl border border-[#e6e2f2] bg-white p-0 shadow-[0_30px_80px_-50px_rgba(76,59,165,0.45)]"
      >
        <DialogHeader className="border-b border-[#ece8f6] bg-[#f6f3ff] px-6 py-5">
          <DialogTitle className="text-lg font-semibold text-[#1f1b2d]">{titleText}</DialogTitle>
          <DialogDescription className="text-sm text-[#6b6780]">{descriptionText}</DialogDescription>
        </DialogHeader>

        <form className="grid gap-5 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-[#6b6780]">
              Title <span className="text-[#c23a3a]">*</span>
            </Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 rounded-xl border-[#e6e2f2] bg-white"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-[#6b6780]">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add more context or notes..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="rounded-xl border-[#e6e2f2] bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-[#6b6780]">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger className="h-11 rounded-xl border-[#e6e2f2] bg-white">
                  <span className="flex flex-1 text-left text-sm">{statusLabels[status]}</span>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {statusLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-[#6b6780]">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger className="h-11 rounded-xl border-[#e6e2f2] bg-white">
                  <span className="flex flex-1 text-left text-sm">{priorityLabels[priority]}</span>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {priorityLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate" className="text-xs font-semibold uppercase tracking-wide text-[#6b6780]">
              Due date
            </Label>
            <div className="relative">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-11 rounded-xl border-[#e6e2f2] bg-white pr-10"
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9a96b2]" />
            </div>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 border-t border-[#ece8f6] bg-[#f8f7fd] px-6 py-4 sm:flex-row sm:justify-end">
            <DialogClose
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "h-10 rounded-xl border-[#d9d4ea]"
              )}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-xl bg-[#5a47d6] px-5 text-sm font-semibold text-white hover:bg-[#4b39c5]"
            >
              {isSaving ? "Saving..." : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
