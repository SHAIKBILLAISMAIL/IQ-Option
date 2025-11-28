"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Account created successfully! Please login.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isPending && session?.user && !isLoading) {
      const redirect = searchParams.get("redirect") || "/trade";
      window.location.href = redirect;
    }
  }, [isPending, session?.user, isLoading, searchParams]);

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/trade",
      });
      if (error) {
        toast.error(`Failed to login with ${provider}`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Starting login...");
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (error?.code) {
        toast.error("Invalid email or password. Please make sure you have already registered an account and try again.");
        setIsLoading(false);
        return;
      }

      console.log("Login response data:", data);

      // Extract token from common shapes returned by auth client
      const token =
        (data as any)?.session?.access_token ??
        (data as any)?.session?.accessToken ??
        (data as any)?.accessToken ??
        (data as any)?.token ??
        (data as any)?.jwt ??
        null;

      console.log("Extracted token:", token);

      if (token) {
        try {
          console.log("Calling set-cookie API with token...");
          const res = await fetch("/api/auth/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            credentials: "same-origin",
          });
          console.log("set-cookie response status:", res.status);
          if (!res.ok) {
            console.warn("set-cookie API failed:", await res.text());
          }
        } catch (err) {
          console.warn("Failed to call set-cookie API:", err);
        }
      } else {
        console.warn("Login succeeded but no token found in auth response:", data);
      }

      toast.success("Login successful! Redirecting...");
      await new Promise((r) => setTimeout(r, 300));
      const redirect = searchParams.get("redirect") || "/trade";
      console.log("Redirecting to:", redirect);
      // Use router.push instead of window.location.href to stay in client context
      router.push(redirect);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background-deep flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen bg-background-deep flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-deep flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/favicon-47.svg"
            alt="IQ Option Logo"
            width={40}
            height={40}
          />
          <span className="font-sans text-2xl font-semibold text-white">iq option</span>
        </Link>

        <div className="bg-background-mid rounded-2xl p-8 border border-border-subtle">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-text-secondary mb-6">Log in to continue trading</p>

          {(process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true' || process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === 'true') && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 bg-white text-black py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 px-4 rounded-lg hover:bg-[#166fe5] transition-colors font-medium text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.742-2.971 2.28v1.692h3.949l-.541 3.667h-3.408v7.98h-4.944Z" />
                </svg>
                Facebook
              </button>
            </div>
          )}

          {(process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true' || process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === 'true') && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-medium"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-mid text-text-secondary">Or proceed with email</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-background-deep border border-border-medium rounded-lg text-white placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="off"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-background-deep border border-border-medium rounded-lg text-white placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-border-medium bg-background-deep text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-text-secondary">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-orange-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-orange-hover font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-text-secondary hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-deep flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "bearer_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.error("set-cookie error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}