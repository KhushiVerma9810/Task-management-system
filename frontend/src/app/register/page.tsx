"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { checkAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    checkAuth().then((isAuthed) => {
      if (!mounted) return;
      if (isAuthed) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return <div className="min-h-screen bg-[#f7f6fb]" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6fb] px-6 py-16">
      <div className="w-full max-w-md">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
