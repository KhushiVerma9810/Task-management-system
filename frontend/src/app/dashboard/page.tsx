"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { TaskList } from "@/components/task-list";
import { checkAuth } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    checkAuth().then((isAuthed) => {
      if (!mounted) return;
      if (!isAuthed) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f7f6fb]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center text-sm text-[#6b6780]">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6fb] px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-end">
          <LogoutButton />
        </div>
        <TaskList />
      </div>
    </div>
  );
}
