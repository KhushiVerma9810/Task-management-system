"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to log out";
      toast.error(message);
    }
  };

  return (
    <Button
      variant="outline"
      className="h-10 rounded-xl border-[#e6e2f2] bg-white text-sm font-semibold text-[#1f1b2d] hover:bg-[#f2f0fa]"
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
}
