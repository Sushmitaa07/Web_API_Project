"use client";

import { useTransition, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { handleDeleteUser } from "@/lib/actions/admin-user-action";

type Props = {
    userId: string;
    userName: string;
    onClose: () => void;
    onDeleted: () => void;
};

export default function DeleteUserModal({ userId, userName, onClose, onDeleted }: Props) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const onConfirm = () => {
        setError("");
        startTransition(async () => {
            const result = await handleDeleteUser(userId);
            if (result.success) {
                onDeleted();
            } else {
                setError(result.message || "Failed to delete user");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-gray-200 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="text-red-600" size={22} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-gray-900">Delete User</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete <span className="font-semibold text-gray-700">{userName}</span>?
                    This action cannot be undone.
                </p>

                {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-6 flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:opacity-60"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
