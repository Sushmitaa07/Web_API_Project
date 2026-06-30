"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronDown, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const NAV_LINKS = [
    { label: "HOME", href: "/dashboard" },
    { label: "EVENTS", href: "/events" },
    { label: "CONTACT US", href: "/contact" },
    { label: "ABOUT US", href: "/about" },
    { label: "MY BOOKINGS", href: "/bookings" },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.fullName
        ? user.fullName
              .split(" ")
              .map((n: string) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : "U";

    return (
        <nav className="sticky top-0 z-50 bg-black px-6 md:px-10">
            <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <Image
                            src="/eventloop-logo.png"
                            alt="EventLoop"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-white font-bold tracking-wide text-lg">
                        EVENTLOOP
                    </span>
                </Link>

                {/* Nav links */}
                <div className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold tracking-wide pb-1 border-b-2 transition ${
                                    isActive
                                        ? "text-white border-purple-500"
                                        : "text-gray-300 border-transparent hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-5">
                    <button
                        aria-label="Search"
                        className="text-gray-300 hover:text-white transition"
                    >
                        <Search size={20} />
                    </button>
                    <button
                        aria-label="Notifications"
                        className="text-gray-300 hover:text-white transition"
                    >
                        <Bell size={20} />
                    </button>

                    <div className="h-6 w-px bg-gray-700" />

                    {/* Profile dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="flex items-center gap-2"
                        >
                            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center border border-gray-700">
                                {user?.profileImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={`${API_BASE_URL}${user.profileImage}`}
                                        alt={user.fullName || "Profile"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-xs font-semibold">
                                        {initials}
                                    </span>
                                )}
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-gray-300 transition-transform ${
                                    open ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user?.fullName || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <Link
                                    href="/profile"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <User size={16} />
                                    My Profile
                                </Link>
                                {user?.role === "admin" && (
                                    <Link
                                        href="/admin/users"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50"
                                    >
                                        <ShieldCheck size={16} />
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        logout();
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
