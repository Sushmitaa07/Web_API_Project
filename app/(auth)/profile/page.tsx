"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    Palette, 
    ArrowLeft, 
    Settings, 
    Activity, 
    Shield, 
    Mail, 
    Calendar, 
    User, 
    Sparkles, 
    Terminal, 
    FileText, 
    LayoutDashboard 
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProfileForm from "./_components/ProfileForm";
import PasswordForm from "./_components/PasswordForm";
import Navbar from "../_components/Navbar";

type ThemeType = "aurora" | "cyber" | "editorial" | "saas";

export default function ProfilePage() {
    const { user, loading, checkAuth } = useAuth();
    const [tab, setTab] = useState<"profile" | "password">("profile");
    const [theme, setTheme] = useState<ThemeType>("aurora");
    const [panelOpen, setPanelOpen] = useState(false);

    useEffect(() => {
        // Ensure the latest user details are loaded when visiting this page
        checkAuth();
        
        // Restore saved theme from local storage if available
        const savedTheme = localStorage.getItem("profile-ui-theme") as ThemeType;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const changeTheme = (newTheme: ThemeType) => {
        setTheme(newTheme);
        localStorage.setItem("profile-ui-theme", newTheme);
    };

    // Layout configuration styles
    const pageStyles = {
        outer: {
            aurora: "flex-1 w-full bg-gradient-to-br from-[#120c33] to-[#08051a] flex items-center justify-center p-4 md:p-8 py-10 md:py-14 transition-all duration-500",
            cyber: "flex-1 w-full bg-[#0a0a0c] bg-cyber-grid flex items-center justify-center p-4 md:p-8 py-10 md:py-14 transition-all duration-500 relative overflow-hidden",
            editorial: "flex-1 w-full bg-[#fdfdfc] flex items-center justify-center p-4 md:p-8 py-10 md:py-14 transition-all duration-500",
            saas: "flex-1 w-full bg-slate-50 flex items-center justify-center p-4 md:p-12 py-10 md:py-14 transition-all duration-500",
        }[theme],

        card: {
            aurora: "w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 px-6 md:px-12 py-10 md:py-12 text-white transition-all duration-500",
            cyber: "w-full max-w-2xl rounded-none bg-black border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] px-6 md:px-12 py-10 md:py-12 text-purple-300 relative z-10 transition-all duration-500",
            editorial: "w-full max-w-2xl rounded-none bg-white border border-zinc-200 px-6 md:px-12 py-10 md:py-12 text-zinc-900 shadow-sm transition-all duration-500",
            saas: "w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100 flex flex-col md:flex-row overflow-hidden transition-all duration-500",
        }[theme],

        title: {
            aurora: "text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent",
            cyber: "text-2xl font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2",
            editorial: "text-4xl font-serif tracking-tight text-zinc-900 italic font-medium",
            saas: "text-2xl font-bold text-slate-800",
        }[theme],

        backLink: {
            aurora: "text-xs font-semibold uppercase tracking-wider text-purple-200 hover:text-white transition flex items-center gap-1.5",
            cyber: "text-xs font-mono uppercase tracking-widest text-cyan-400 hover:text-cyan-300 hover:underline transition flex items-center gap-1.5",
            editorial: "text-xs uppercase tracking-widest font-bold text-zinc-900 border-b border-zinc-900 pb-0.5 hover:opacity-75 transition flex items-center gap-1",
            saas: "text-sm font-medium text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5",
        }[theme],

        tabContainer: {
            aurora: "flex gap-2 mb-8 border-b border-white/10",
            cyber: "flex gap-2 mb-8 border-b border-purple-500/20 font-mono",
            editorial: "flex gap-6 mb-8 border-b border-zinc-200",
            saas: "hidden", // In SaaS theme, tabs are in the sidebar
        }[theme],

        tabBtn: (active: boolean) => ({
            aurora: `px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all duration-300 ${
                active ? "border-white text-white" : "border-transparent text-purple-200/50 hover:text-purple-100"
            }`,
            cyber: `px-4 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all duration-300 ${
                active ? "border-cyan-400 text-cyan-400 shadow-[0_4px_10px_-4px_rgba(34,211,238,0.5)]" : "border-transparent text-purple-500/60 hover:text-purple-400"
            }`,
            editorial: `px-2 py-3 text-xs uppercase tracking-widest font-bold border-b transition-all duration-300 ${
                active ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`,
            saas: "",
        }[theme]),
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-sm tracking-widest text-purple-300 animate-pulse">BOOTING_USER_PROFILE.SYS...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-zinc-950">
            {/* Global Top Navbar */}
            <Navbar />

            <div className={pageStyles.outer}>
            {/* SaaS-specific Split Layout vs Standard Layout wrapper */}
            {theme === "saas" ? (
                <div className={pageStyles.card}>
                    {/* Left overview pane */}
                    <div className="w-full md:w-80 bg-slate-50/70 border-r border-slate-200/80 p-8 flex flex-col justify-between">
                        <div>
                            {/* Header */}
                            <div className="mb-8">
                                <Link href="/dashboard" className={pageStyles.backLink}>
                                    <ArrowLeft size={16} />
                                    Back to Dashboard
                                </Link>
                            </div>

                            {/* User card info */}
                            <div className="flex flex-col items-center text-center md:items-start md:text-left mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-2xl shadow-sm mb-4">
                                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{user?.fullName || "User Profile"}</h3>
                                <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                                    <Mail size={13} className="shrink-0" />
                                    {user?.email || "user@domain.com"}
                                </p>
                            </div>

                            {/* Sidebar navigation links (acting as tabs) */}
                            <nav className="space-y-1.5">
                                <button
                                    onClick={() => setTab("profile")}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 ${
                                        tab === "profile" 
                                            ? "bg-white text-indigo-700 border border-slate-200 shadow-sm" 
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                                >
                                    <User size={16} />
                                    Personal Profile
                                </button>
                                <button
                                    onClick={() => setTab("password")}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 ${
                                        tab === "password" 
                                            ? "bg-white text-indigo-700 border border-slate-200 shadow-sm" 
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                                >
                                    <Shield size={16} />
                                    Security & Password
                                </button>
                            </nav>
                        </div>

                        {/* Sidebar metadata footer */}
                        <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-3 hidden md:block">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>Security Level</span>
                                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                                    <Activity size={10} />
                                    Optimal
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>Member Since</span>
                                <span className="text-slate-600 font-medium flex items-center gap-1">
                                    <Calendar size={10} />
                                    June 2026
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right form container pane */}
                    <div className="flex-1 p-6 md:p-12 bg-white">
                        <div className="max-w-xl mx-auto">
                            <div className="mb-8">
                                <h1 className={pageStyles.title}>
                                    {tab === "profile" ? "Personal Settings" : "Security Configuration"}
                                </h1>
                                <p className="text-slate-400 text-xs mt-1">
                                    {tab === "profile" 
                                        ? "Manage public and identity attributes of your user account." 
                                        : "Secure your workspace credentials by updating your current password."}
                                </p>
                            </div>

                            {tab === "profile" ? (
                                <ProfileForm key={user?.id || "profile-saas"} theme={theme} />
                            ) : (
                                <PasswordForm theme={theme} />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Aurora, Cyberpunk, and Editorial layout template wrapper */
                <div className={pageStyles.card}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h1 className={pageStyles.title}>
                            {theme === "cyber" && <Terminal className="w-6 h-6 inline mr-1 text-cyan-400" />}
                            {theme === "editorial" && "editorial // "}
                            {theme === "cyber" ? "CONFIG.PROFILE" : "Account Settings"}
                        </h1>
                        <Link href="/dashboard" className={pageStyles.backLink}>
                            <ArrowLeft size={14} className="shrink-0" />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Dynamic Tabs */}
                    <div className={pageStyles.tabContainer}>
                        <button
                            onClick={() => setTab("profile")}
                            className={pageStyles.tabBtn(tab === "profile")}
                        >
                            Profile details
                        </button>
                        <button
                            onClick={() => setTab("password")}
                            className={pageStyles.tabBtn(tab === "password")}
                        >
                            Security & key
                        </button>
                    </div>

                    {/* Rendering child forms */}
                    <div className="relative">
                        {tab === "profile" ? (
                            <ProfileForm key={user?.id || "profile-standard"} theme={theme} />
                        ) : (
                            <PasswordForm theme={theme} />
                        )}
                    </div>
                </div>
            )}

            {/* Interactive Live Theme Switcher Panel (Widget) */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Floating Switcher Trigger Button */}
                <button
                    onClick={() => setPanelOpen(!panelOpen)}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg hover:shadow-indigo-500/30 transition duration-300 hover:scale-105 active:scale-95"
                    title="Change UI Theme"
                >
                    <Settings className={`w-6 h-6 ${panelOpen ? 'animate-spin' : ''}`} />
                </button>

                {/* Switcher Selection Panel */}
                {panelOpen && (
                    <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="text-purple-600 w-5 h-5" />
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">UI Layout Showcase</h4>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
                            Select a design below to live-preview this page rendering in different realistic themes:
                        </p>

                        <div className="space-y-2.5">
                            {/* Aurora */}
                            <button
                                onClick={() => changeTheme("aurora")}
                                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between ${
                                    theme === "aurora"
                                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    <div>
                                        <p className="text-xs font-bold">Aurora Glassmorphic</p>
                                        <p className="text-[10px] text-slate-400">Frosted glass & radial gradients</p>
                                    </div>
                                </div>
                                {theme === "aurora" && <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>}
                            </button>

                            {/* Cyberpunk */}
                            <button
                                onClick={() => changeTheme("cyber")}
                                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between ${
                                    theme === "cyber"
                                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-purple-500" />
                                    <div>
                                        <p className="text-xs font-bold">Cyberpunk Obsidian</p>
                                        <p className="text-[10px] text-slate-400">Scanlines, monospaced & glows</p>
                                    </div>
                                </div>
                                {theme === "cyber" && <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>}
                            </button>

                            {/* Editorial */}
                            <button
                                onClick={() => changeTheme("editorial")}
                                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between ${
                                    theme === "editorial"
                                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold">Editorial Minimalist</p>
                                        <p className="text-[10px] text-slate-400">Clean serif typography & line borders</p>
                                    </div>
                                </div>
                                {theme === "editorial" && <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>}
                            </button>

                            {/* SaaS Grid */}
                            <button
                                onClick={() => changeTheme("saas")}
                                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between ${
                                    theme === "saas"
                                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                                    <div>
                                        <p className="text-xs font-bold">SaaS Split Dashboard</p>
                                        <p className="text-[10px] text-slate-400">Professional columns & sidebar navigation</p>
                                    </div>
                                </div>
                                {theme === "saas" && <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>}
                            </button>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">Click triggers instant re-render</span>
                            <button 
                                onClick={() => setPanelOpen(false)} 
                                className="text-[10px] font-bold text-purple-600 hover:text-purple-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}
