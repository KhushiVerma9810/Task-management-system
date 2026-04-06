"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    checkAuth().then((isAuthed) => {
      if (!mounted) return;
      router.replace(isAuthed ? "/dashboard" : "/login");
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f7f6fb]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center text-sm text-[#6b6780]">
        Checking session...
      </div>
    </div>
  );
}
