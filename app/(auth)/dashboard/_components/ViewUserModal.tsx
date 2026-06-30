"use client";

import { X, User, Mail, Phone, Shield, Calendar, Heart } from "lucide-react";
import { AdminUserRecord } from "../../admin/users/_components/UserFormModal";

type Props = {
    user: AdminUserRecord;
    onClose: () => void;
};

export default function ViewUserModal({ user, onClose }: Props) {
    const nameInitials = (user.fullName || "U")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const formatDate = (value?: string) => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "—";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <User size={18} className="text-purple-600" />
                        <span>Account Details</span>
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close details"
                        className="text-gray-400 hover:text-gray-700 transition rounded-lg p-1 hover:bg-gray-50 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md border-4 border-purple-50 mb-3">
                            {nameInitials}
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{user.fullName}</h3>
                        <p className="text-xs text-gray-400 capitalize font-semibold mt-1">
                            Registered Account
                        </p>
                    </div>

                    {/* Information Grid */}
                    <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-150">
                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Email Address</span>
                                <span className="text-sm font-semibold text-gray-800 break-all">{user.email}</span>
                            </div>
                        </div>

                        {/* Security Role */}
                        <div className="flex items-start gap-3">
                            <Shield size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Security Role</span>
                                <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold border mt-0.5 ${
                                    user.role === "admin"
                                        ? "bg-purple-100 text-purple-700 border-purple-200"
                                        : "bg-gray-100 text-gray-600 border-gray-200"
                                }`}>
                                    {user.role === "admin" ? "Admin Access" : "Standard User"}
                                </span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="flex items-start gap-3">
                            <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Contact Number</span>
                                <span className="text-sm font-semibold text-gray-800">{user.contactNumber || "—"}</span>
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="flex items-start gap-3">
                            <Heart size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Gender</span>
                                <span className="text-sm font-semibold text-gray-800 capitalize">{user.gender || "—"}</span>
                            </div>
                        </div>

                        {/* Creation Date */}
                        <div className="flex items-start gap-3">
                            <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Registration Date</span>
                                <span className="text-sm font-semibold text-gray-800">{formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-2.5 text-sm font-bold text-gray-700 shadow-xs transition cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
