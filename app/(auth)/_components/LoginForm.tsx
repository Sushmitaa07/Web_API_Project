"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "./schema";
import { handleLoginUser } from "@/lib/actions/auth-action";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await handleLoginUser(data);

        if (result.success) {
          router.push("/dashboard");
        } else {
          setError(result.message || "Login failed");
        }
      } catch (error: any) {
        setError(error?.message || "Login failed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-200">
        
        {/* Left Side */}
        <div className="relative hidden lg:block min-h-[700px]">
          <Image
            src="/event-bg.jpg"
            alt="Event Background"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-12 left-10 text-white max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Join Amazing Events Around The World
            </h1>

            <p className="mt-5 text-lg text-gray-200">
              Manage, discover and attend unforgettable events with EventLoop.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white px-8 md:px-16 py-14 flex flex-col justify-center">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="relative w-24 h-24">
              <Image
                src="/eventloop-logo.png"
                alt="EventLoop Logo"
                fill
                className="object-contain"
              />
            </div>

            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide">
                EVENTLOOP
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Smart Event Platform
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Login to continue your journey
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-600 text-sm">
                <input
                  type="checkbox"
                  className="accent-purple-600 w-4 h-4"
                />
                Remember Me
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transition duration-300 disabled:opacity-50"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-gray-600 mt-10">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}