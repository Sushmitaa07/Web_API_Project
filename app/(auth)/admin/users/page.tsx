"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Users as UsersIcon,
    AlertCircle,
} from "lucide-react";

import Navbar from "../../_components/Navbar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { handleGetUsers } from "@/lib/actions/admin-user-action";
import UserFormModal, { AdminUserRecord } from "./_components/UserFormModal";
import DeleteUserModal from "./_components/DeleteUserModal";

type Meta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

const DEFAULT_META: Meta = { page: 1, limit: 10, total: 0, totalPages: 1 };

export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [meta, setMeta] = useState<Meta>(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [activeUser, setActiveUser] = useState<AdminUserRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(null);

    // redirect non-admins away
    useEffect(() => {
        if (!authLoading && user && user.role !== "admin") {
            router.push("/dashboard");
        }
    }, [authLoading, user, router]);

    // debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        const result = await handleGetUsers({ page, limit: 10, search });
        if (result.success) {
            setUsers(result.data || []);
            setMeta(result.meta || DEFAULT_META);
        } else {
            setError(result.message || "Failed to load users");
            setUsers([]);
        }
        setLoading(false);
    }, [page, search]);

    useEffect(() => {
        if (!authLoading && user?.role === "admin") {
            fetchUsers();
        }
    }, [authLoading, user, fetchUsers]);

    const closeModal = () => {
        setModalMode(null);
        setActiveUser(null);
    };

    const onSaved = () => {
        closeModal();
        fetchUsers();
    };

    const onDeleted = () => {
        setDeleteTarget(null);
        // if last row on page removed, step back a page when needed
        if (users.length === 1 && page > 1) {
            setPage((p) => p - 1);
        } else {
            fetchUsers();
        }
    };

    const formatDate = (value?: string) => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "—";
        }
    };

    if (authLoading || (user && user.role !== "admin")) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            <div className="flex-1 px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Admin Panel
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View, search, create, edit, and delete user accounts.
                        </p>
                    </div>
                    <button
                        onClick={() => setModalMode("create")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 shadow-md transition shrink-0"
                    >
                        <Plus size={16} />
                        Add User
                    </button>
                </div>

                {/* Search bar */}
                <div className="mb-5">
                    <div className="relative max-w-sm">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                        />
                    </div>
                </div>

                {/* Table card */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Created</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading && (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={`skeleton-${i}`}>
                                            <td className="px-5 py-4" colSpan={5}>
                                                <div className="h-4 w-full max-w-md bg-gray-100 rounded animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                )}

                                {!loading && error && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-red-600">
                                                <AlertCircle size={28} />
                                                <p className="text-sm font-medium">{error}</p>
                                                <button
                                                    onClick={fetchUsers}
                                                    className="mt-2 text-xs font-semibold text-purple-600 hover:underline"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <UsersIcon size={28} />
                                                <p className="text-sm font-medium text-gray-500">
                                                    {search ? "No users match your search" : "No users yet"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {search
                                                        ? "Try a different name or email."
                                                        : "Create your first user to get started."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/60 transition">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                                    {(u.fullName || "U")
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .slice(0, 2)
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {u.fullName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-600">{u.email}</td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    u.role === "admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {u.role === "admin" ? "Admin" : "User"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">
                                            {formatDate(u.createdAt)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setActiveUser(u);
                                                        setModalMode("edit");
                                                    }}
                                                    aria-label={`Edit ${u.fullName}`}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(u)}
                                                    aria-label={`Delete ${u.fullName}`}
                                                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && !error && users.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
                            <p className="text-xs text-gray-500">
                                Showing page <span className="font-semibold text-gray-700">{meta.page}</span> of{" "}
                                <span className="font-semibold text-gray-700">{meta.totalPages}</span>{" "}
                                ({meta.total} total {meta.total === 1 ? "user" : "users"})
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={meta.page <= 1}
                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft size={14} />
                                    Prev
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                    disabled={meta.page >= meta.totalPages}
                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:hover:bg-transparent"
                                >
                                    Next
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modalMode && (
                <UserFormModal
                    mode={modalMode}
                    user={activeUser}
                    onClose={closeModal}
                    onSaved={onSaved}
                />
            )}

            {deleteTarget && (
                <DeleteUserModal
                    userId={deleteTarget.id}
                    userName={deleteTarget.fullName}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={onDeleted}
                />
            )}
        </div>
    );
}
