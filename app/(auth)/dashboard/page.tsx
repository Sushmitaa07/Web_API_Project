"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import UserDashboard from "./_components/UserDashboard";
import AdminDashboard from "./_components/AdminDashboard";

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    if (currentUserRole(user) === "admin") {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
}

function currentUserRole(user: any) {
    return user?.role;
}
