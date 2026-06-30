"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, User, Mail, Phone, Lock, Shield, AlertCircle } from "lucide-react";

import {
    createUserSchema,
    CreateUserFormData,
    editUserSchema,
    EditUserFormData,
} from "./schema";
import { handleCreateUser, handleUpdateUser } from "@/lib/actions/admin-user-action";

export type AdminUserRecord = {
    id: string;
    fullName: string;
    email: string;
    contactNumber?: string;
    gender?: string;
    role?: string;
    createdAt?: string;
};

type Props = {
    mode: "create" | "edit";
    user?: AdminUserRecord | null;
    onClose: () => void;
    onSaved: () => void;
};

export default function UserFormModal({ mode, user, onClose, onSaved }: Props) {
    const isEdit = mode === "edit";
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserFormData | EditUserFormData>({
        resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
        defaultValues: {
            fullName: "",
            email: "",
            contactNumber: "",
            gender: "other",
            password: "",
            role: "user",
        },
    });

    useEffect(() => {
        if (isEdit && user) {
            reset({
                fullName: user.fullName || "",
                email: user.email || "",
                contactNumber: user.contactNumber || "",
                gender: (user.gender as any) || "other",
                password: "",
                role: (user.role as any) || "user",
            });
        }
    }, [isEdit, user, reset]);

    const onSubmit = (data: CreateUserFormData | EditUserFormData) => {
        setServerError("");
        startTransition(async () => {
            if (isEdit && user) {
                const payload: any = { ...data };
                if (!payload.password) delete payload.password;
                const result = await handleUpdateUser(user.id, payload);
                if (result.success) {
                    onSaved();
                } else {
                    setServerError(result.message || "Failed to update user");
                }
            } else {
                const result = await handleCreateUser(data as CreateUserFormData);
                if (result.success) {
                    onSaved();
                } else {
                    setServerError(result.message || "Failed to create user");
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEdit ? "Edit User" : "Create User"}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-400 hover:text-gray-700 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto"
                >
                    {serverError && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name
                        </label>
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
                            <User size={16} className="absolute left-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="e.g. Sushmitaa Sen"
                                {...register("fullName")}
                                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email
                        </label>
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
                            <Mail size={16} className="absolute left-3.5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Contact Number
                        </label>
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
                            <Phone size={16} className="absolute left-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="+977 980-000000"
                                {...register("contactNumber")}
                                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none"
                            />
                        </div>
                        {errors.contactNumber && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.contactNumber.message as string}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Gender
                            </label>
                            <select
                                {...register("gender")}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Role
                            </label>
                            <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
                                <Shield size={16} className="absolute left-3.5 text-gray-400" />
                                <select
                                    {...register("role")}
                                    className="w-full bg-transparent pl-10 pr-3 py-2.5 text-sm text-gray-900 outline-none appearance-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Password {isEdit && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                        </label>
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
                            <Lock size={16} className="absolute left-3.5 text-gray-400" />
                            <input
                                type="password"
                                placeholder={isEdit ? "New password" : "Create a password"}
                                {...register("password")}
                                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none"
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isPending}
                            className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:opacity-60"
                        >
                            {isPending
                                ? isEdit
                                    ? "Saving..."
                                    : "Creating..."
                                : isEdit
                                ? "Save Changes"
                                : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
