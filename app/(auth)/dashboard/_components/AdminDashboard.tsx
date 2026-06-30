"use client";

import { useCallback, useEffect, useState } from "react";
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
    Eye,
} from "lucide-react";

import Navbar from "../../_components/Navbar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { handleGetUsers } from "@/lib/actions/admin-user-action";
import UserFormModal, { AdminUserRecord } from "../../admin/users/_components/UserFormModal";
import DeleteUserModal from "../../admin/users/_components/DeleteUserModal";
import ViewUserModal from "./ViewUserModal";

type Meta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

const DEFAULT_META: Meta = { page: 1, limit: 10, total: 0, totalPages: 1 };

export default function AdminDashboard() {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [meta, setMeta] = useState<Meta>(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [viewTarget, setViewTarget] = useState<AdminUserRecord | null>(null);
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [activeUser, setActiveUser] = useState<AdminUserRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch current page of users
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

    // Initial load
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-between font-sans">
            <div>
                {/* Navbar */}
                <Navbar />

                {/* Dashboard Banner / Header */}
                <div className="mx-6 md:mx-10 mt-6 p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-900 to-black text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
                    <div className="absolute right-20 bottom-0 w-60 h-60 bg-indigo-500 rounded-full blur-3xl opacity-25 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold tracking-wider uppercase mb-2">
                            <ShieldCheck size={16} />
                            <span>System Administrator Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Welcome back, {currentUser?.fullName || "Admin"}
                        </h1>
                        <p className="text-purple-200 mt-2 text-sm md:text-base max-w-xl font-medium">
                            Monitor system activity, manage user accounts, roles, permissions, and view data insights instantly.
                        </p>
                    </div>
                </div>


                {/* Main Content Area - User Management */}
                <main className="mx-6 md:mx-10 mt-8 mb-16">
                    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden p-6">
                        
                        {/* Table Header Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">User Accounts Manager</h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Perform CRUD operations, change roles, or search through profiles.
                                </p>
                            </div>
                            <button
                                id="admin-add-user-btn"
                                onClick={() => setModalMode("create")}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-3 shadow-md hover:shadow-lg transition duration-200 cursor-pointer shrink-0"
                            >
                                <Plus size={16} />
                                Add New Account
                            </button>
                        </div>

                        {/* Search control */}
                        <div className="mb-6">
                            <div className="relative max-w-sm">
                                <Search
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="admin-user-search-input"
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search by full name or email address..."
                                    className="w-full rounded-2xl border border-gray-300 bg-gray-50 pl-11 pr-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                />
                            </div>
                        </div>

                        {/* Table View */}
                        <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                                            <th className="px-6 py-4">User Details</th>
                                            <th className="px-6 py-4">Email Address</th>
                                            <th className="px-6 py-4">Security Role</th>
                                            <th className="px-6 py-4">Contact Number</th>
                                            <th className="px-6 py-4">Registration Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading && (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={`skeleton-${i}`}>
                                                    <td className="px-6 py-5" colSpan={6}>
                                                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                                    </td>
                                                </tr>
                                            ))
                                        )}

                                        {!loading && error && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-2.5 text-red-600">
                                                        <AlertCircle size={32} />
                                                        <p className="text-sm font-semibold">{error}</p>
                                                        <button
                                                            onClick={fetchUsers}
                                                            className="mt-2 text-xs font-bold bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-200 hover:bg-red-100 transition"
                                                        >
                                                            Try loading again
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {!loading && !error && users.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <UsersIcon size={32} />
                                                        <p className="text-sm font-bold text-gray-500">
                                                            {search ? "No profiles match your search criteria" : "No users registered yet"}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {search
                                                                ? "Try refining your name or email query."
                                                                : "Create a user account to populate the portal."}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {!loading && !error && users.map((u) => {
                                            const nameInitials = (u.fullName || "U")
                                                .split(" ")
                                                .map((n) => n[0])
                                                .slice(0, 2)
                                                .join("")
                                                .toUpperCase();

                                            return (
                                                <tr key={u.id} className="hover:bg-gray-50/40 transition duration-150">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center text-xs font-extrabold shrink-0 border border-purple-200">
                                                                {nameInitials}
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-gray-900 block leading-tight">
                                                                    {u.fullName}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 capitalize font-medium">
                                                                    {u.gender || "Not specified"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                                        {u.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold border ${
                                                                u.role === "admin"
                                                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                                            }`}
                                                        >
                                                            {u.role === "admin" ? "Admin Access" : "User Access"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                                        {u.contactNumber || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {formatDate(u.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setViewTarget(u)}
                                                                aria-label={`View profile for ${u.fullName}`}
                                                                className="p-2 rounded-xl text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                                                            >
                                                                <Eye size={15} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveUser(u);
                                                                    setModalMode("edit");
                                                                }}
                                                                aria-label={`Edit profile for ${u.fullName}`}
                                                                className="p-2 rounded-xl text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                                                            >
                                                                 <Pencil size={15} />
                                                             </button>
                                                             <button
                                                                onClick={() => setDeleteTarget(u)}
                                                                aria-label={`Delete profile for ${u.fullName}`}
                                                                className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination bar */}
                            {!loading && !error && users.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-150 px-6 py-4 bg-gray-50/50">
                                    <p className="text-xs text-gray-500 font-medium">
                                        Showing page <span className="font-bold text-gray-800">{meta.page}</span> of{" "}
                                        <span className="font-bold text-gray-800">{meta.totalPages}</span>{" "}
                                        ({meta.total} total {meta.total === 1 ? "user" : "users"})
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={meta.page <= 1}
                                            className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={14} />
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                            disabled={meta.page >= meta.totalPages}
                                            className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            Next
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-black text-gray-400 py-12 px-6 md:px-12 border-t border-zinc-900 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p>© 2026 EVENTLOOP. All Admin Privileges Secured.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-white transition cursor-pointer">Security Protocol</span>
                        <span className="hover:text-white transition cursor-pointer">Console Logs</span>
                        <span className="hover:text-white transition cursor-pointer">API Keys</span>
                    </div>
                </div>
            </footer>

            {/* Modal Elements */}
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

            {viewTarget && (
                <ViewUserModal
                    user={viewTarget}
                    onClose={() => setViewTarget(null)}
                />
            )}
        </div>
    );
}
