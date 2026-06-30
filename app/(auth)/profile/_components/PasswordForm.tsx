"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { passwordSchema, PasswordFormData } from "./schema";
import { handleUpdatePassword } from "@/lib/actions/user-action";

import { Lock, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function PasswordForm({ theme = "aurora" }: { theme?: string }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [show, setShow] = useState({
        current: false,
        next: false,
        confirm: false,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = (data: PasswordFormData) => {
        setMessage(null);

        startTransition(async () => {
            const result = await handleUpdatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (result.success) {
                setMessage({ type: "success", text: "Password updated successfully" });
                reset();
            } else {
                setMessage({
                    type: "error",
                    text: result.message || "Password update failed",
                });
            }
        });
    };

    const fields: {
        name: keyof PasswordFormData;
        label: string;
        key: "current" | "next" | "confirm";
        icon: any;
    }[] = [
        { name: "currentPassword", label: "Current Password", key: "current", icon: Lock },
        { name: "newPassword", label: "New Password", key: "next", icon: KeyRound },
        { name: "confirmPassword", label: "Confirm New Password", key: "confirm", icon: KeyRound },
    ];

    // Styling Maps based on active theme
    const styles = {
        label: {
            aurora: "block text-xs uppercase tracking-wider font-semibold text-purple-200 mb-2",
            cyber: "block text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5",
            editorial: "block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-1.5",
            saas: "block text-sm font-semibold text-slate-700 mb-1.5",
        }[theme] || "block text-sm font-medium text-gray-700 mb-2",

        inputContainer: {
            aurora: "relative flex items-center rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md focus-within:border-white/50 focus-within:ring-4 focus-within:ring-white/10 transition duration-300",
            cyber: "relative flex items-center rounded-none border border-purple-500/30 bg-black/60 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/40 transition duration-300 font-mono",
            editorial: "relative flex items-center rounded-none border-b border-zinc-200 bg-transparent focus-within:border-zinc-900 transition duration-300",
            saas: "relative flex items-center rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-50 transition duration-200",
        }[theme] || "relative flex items-center",

        input: {
            aurora: "w-full bg-transparent px-5 py-4 pl-12 pr-12 text-white placeholder-white/30 outline-none text-base",
            cyber: "w-full bg-transparent px-5 py-4 pl-12 pr-12 text-purple-200 placeholder-purple-500/30 outline-none text-sm font-mono tracking-wide",
            editorial: "w-full bg-transparent px-2 py-3.5 pl-10 pr-10 text-zinc-900 placeholder-zinc-400 outline-none text-base font-sans",
            saas: "w-full bg-transparent px-5 py-3.5 pl-12 pr-12 text-slate-800 placeholder-slate-400 outline-none text-sm font-medium",
        }[theme] || "w-full",

        icon: {
            aurora: "absolute left-4 text-purple-300/60 w-5 h-5",
            cyber: "absolute left-4 text-purple-500/70 w-5 h-5",
            editorial: "absolute left-2 text-zinc-400 w-5 h-5",
            saas: "absolute left-4 text-slate-400 w-5 h-5",
        }[theme] || "absolute left-4 text-gray-400",

        eyeButton: {
            aurora: "absolute right-4 text-purple-300/60 hover:text-purple-100 transition-colors",
            cyber: "absolute right-4 text-purple-500/70 hover:text-cyan-400 transition-colors",
            editorial: "absolute right-2 text-zinc-400 hover:text-zinc-950 transition-colors",
            saas: "absolute right-4 text-slate-400 hover:text-slate-600 transition-colors",
        }[theme] || "absolute right-4 text-gray-400",

        button: {
            aurora: "w-full bg-white text-purple-950 font-bold py-4 rounded-2xl text-lg shadow-xl shadow-purple-950/20 hover:shadow-white/20 hover:scale-[1.01] active:scale-[0.99] transition duration-300 disabled:opacity-50",
            cyber: "w-full bg-transparent border-2 border-purple-500 text-purple-300 font-mono tracking-widest uppercase py-4 rounded-none text-lg hover:bg-purple-500 hover:text-black hover:shadow-[0_0_20px_#a855f7] active:translate-y-[1px] transition-all duration-300 disabled:opacity-50",
            editorial: "w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-4 rounded-none text-lg tracking-widest uppercase transition duration-300 disabled:opacity-50",
            saas: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-sm shadow-md shadow-indigo-100 hover:shadow-lg transition duration-300 disabled:opacity-50",
        }[theme] || "w-full",

        alert: {
            aurora: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-purple-200 flex items-start gap-3",
            cyber: "rounded-none border border-cyan-500/50 bg-black/80 p-4 text-cyan-300 font-mono text-xs flex items-start gap-3 shadow-[0_0_8px_rgba(6,182,212,0.15)]",
            editorial: "rounded-none border border-zinc-900 bg-zinc-50 p-4 text-zinc-900 flex items-start gap-3",
            saas: "rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-emerald-800 flex items-start gap-3",
        }[theme] || "rounded-xl border p-4",

        alertError: {
            aurora: "rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-md p-4 text-red-200 flex items-start gap-3",
            cyber: "rounded-none border border-red-500 bg-black/80 p-4 text-red-400 font-mono text-xs flex items-start gap-3 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
            editorial: "rounded-none border border-red-200 bg-red-50 p-4 text-red-800 flex items-start gap-3",
            saas: "rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-rose-800 flex items-start gap-3",
        }[theme] || "rounded-xl border p-4",
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {message && (
                <div className={message.type === "success" ? styles.alert : styles.alertError}>
                    {message.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    )}
                    <div>
                        <p className="font-semibold text-sm">
                            {message.type === "success" ? "Success" : "Error"}
                        </p>
                        <p className="text-xs opacity-90 mt-0.5">{message.text}</p>
                    </div>
                </div>
            )}

            {fields.map((field) => {
                const IconComponent = field.icon;
                return (
                    <div key={field.name}>
                        <label className={styles.label}>
                            {theme === 'cyber' && <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse"></span>}
                            {field.label}
                        </label>
                        <div className={styles.inputContainer}>
                            <IconComponent className={styles.icon} />
                            <input
                                type={show[field.key] ? "text" : "password"}
                                placeholder={field.label}
                                {...register(field.name)}
                                className={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShow((prev) => ({
                                        ...prev,
                                        [field.key]: !prev[field.key],
                                    }))
                                }
                                className={styles.eyeButton}
                            >
                                {show[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors[field.name] && (
                            <p className={`text-sm mt-2 font-medium ${theme === 'cyber' ? 'text-red-400 font-mono' : 'text-rose-500'}`}>
                                {errors[field.name]?.message as string}
                            </p>
                        )}
                    </div>
                );
            })}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className={styles.button}
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            {theme === 'cyber' ? "UPDATING.EXE..." : "Updating Password..."}
                        </span>
                    ) : (
                        theme === 'cyber' ? "UPDATE_PASSWORD.SYS" : "Update Password"
                    )}
                </button>
            </div>
        </form>
    );
}
