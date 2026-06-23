"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterFormData,
} from "@/app/(auth)/_components/schema";

import { handleRegisterUser } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await handleRegisterUser(data);

        if (result.success) {
          router.push("/login");
        } else {
          setError(result.message || "Registration failed");
        }
      } catch (error: any) {
        setError(error?.message || "Registration failed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-200">

        {/* Left Side */}
        <div className="relative hidden lg:block min-h-[750px]">
          <Image
            src="/event-bg.jpg"
            alt="Event Background"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="absolute bottom-12 left-10 text-white max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Create And Explore Amazing Events
            </h1>

            <p className="mt-5 text-lg text-gray-200">
              Join EventLoop and connect with people,
              communities and unforgettable experiences.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white px-8 md:px-16 py-12 flex flex-col justify-center">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-10">
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Sign up and start your journey today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500 bg-red-50 p-3 text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
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
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />

              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>

              <input
                type="text"
                placeholder="Enter your contact number"
                {...register("contactNumber")}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />

              {errors.contactNumber && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>

              <select
                {...register("gender")}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              {errors.gender && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.gender.message}
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
                  placeholder="Create a password"
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
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transition duration-300 disabled:opacity-70"
            >
              {isPending
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-gray-600 mt-10">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
