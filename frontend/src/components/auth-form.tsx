"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LayoutGridIcon } from "lucide-react";
import { toast } from "sonner";
import { loginUser, registerUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const copy = {
  login: {
    title: "Welcome back",
    description: "Sign in to your account to continue",
    submit: "Sign in",
    linkText: "Don't have an account?",
    linkHref: "/register",
    linkLabel: "Sign up",
  },
  register: {
    title: "Create your account",
    description: "Start managing your tasks in seconds",
    submit: "Create account",
    linkText: "Already have an account?",
    linkHref: "/login",
    linkLabel: "Sign in",
  },
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await loginUser({ email, password });
        toast.success("Welcome back!");
      } else {
        await registerUser({ email, password });
        toast.success("Account created.");
      }
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = copy[mode];

  return (
    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-8 shadow-[0_20px_60px_-40px_rgba(64,49,160,0.35)]">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#5a47d6] text-white">
          <LayoutGridIcon className="size-4" />
        </span>
        <span className="text-base font-semibold text-[#1f1b2d]">TaskFlow</span>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-[#1f1b2d]">{content.title}</h1>
        <p className="mt-1 text-sm text-[#6b6780]">{content.description}</p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        {mode === "register" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-11 rounded-xl border-[#e6e2f2] bg-[#fbfaff]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-11 rounded-xl border-[#e6e2f2] bg-[#fbfaff]"
                required
              />
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 rounded-xl border-[#e6e2f2] bg-[#fbfaff]"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={mode === "register" ? "Min. 8 characters" : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              className="h-11 rounded-xl border-[#e6e2f2] bg-[#fbfaff] pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a96b2]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {mode === "login" && (
            <div className="text-right text-xs">
              <Link href="#" className="text-[#5a47d6] hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        {mode === "register" && (
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                className="h-11 rounded-xl border-[#e6e2f2] bg-[#fbfaff] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a96b2]"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="mt-2 h-11 w-full rounded-xl bg-[#f5f4fb] text-sm font-semibold text-[#1f1b2d] hover:bg-[#edeaf8]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : content.submit}
        </Button>

        {mode === "login" && (
          <div className="flex items-center gap-3 text-xs text-[#a09bb3]">
            <span className="h-px flex-1 bg-[#ebe7f4]" />
            or
            <span className="h-px flex-1 bg-[#ebe7f4]" />
          </div>
        )}

        {mode === "register" && (
          <p className="text-center text-xs text-[#a09bb3]">
            By creating an account you agree to our <Link href="#" className="text-[#5a47d6]">Terms</Link> and{" "}
            <Link href="#" className="text-[#5a47d6]">Privacy Policy</Link>
          </p>
        )}

        <p className="text-center text-sm text-[#6b6780]">
          {content.linkText} <Link href={content.linkHref} className="font-semibold text-[#5a47d6]">{content.linkLabel}</Link>
        </p>
      </form>
    </div>
  );
}
