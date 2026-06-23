"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, ProfileFormData } from "./schema";
import { handleUpdateProfile } from "@/lib/actions/user-action";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

import { User, Phone, Smile, Camera, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfileForm({ theme = "aurora" }: { theme?: string }) {
    const { user, setUser, checkAuth } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedFileRef = useRef<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    // Prefill the form once user details are available
    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || "",
                contactNumber: user.contactNumber || "",
                gender: user.gender || "other",
            });
            setPreview(
                user.profileImage ? `${API_BASE_URL}${user.profileImage}` : null
            );
        }
    }, [user, reset]);

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        selectedFileRef.current = file;
        setPreview(URL.createObjectURL(file));
    };

    const onSubmit = (data: ProfileFormData) => {
        setMessage(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            if (data.contactNumber)
                formData.append("contactNumber", data.contactNumber);
            if (data.gender) formData.append("gender", data.gender);
            if (selectedFileRef.current)
                formData.append("profileImage", selectedFileRef.current);

            const result = await handleUpdateProfile(formData);

            if (result.success) {
                setMessage({ type: "success", text: "Profile updated successfully" });
                setUser(result.data);
                selectedFileRef.current = null;
                await checkAuth();
            } else {
                setMessage({
                    type: "error",
                    text: result.message || "Profile update failed",
                });
            }
        });
    };

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
            aurora: "w-full bg-transparent px-5 py-4 pl-12 text-white placeholder-white/30 outline-none text-base",
            cyber: "w-full bg-transparent px-5 py-4 pl-12 text-purple-200 placeholder-purple-500/30 outline-none text-sm font-mono tracking-wide",
            editorial: "w-full bg-transparent px-2 py-3.5 pl-10 text-zinc-900 placeholder-zinc-400 outline-none text-base font-sans",
            saas: "w-full bg-transparent px-5 py-3.5 pl-12 text-slate-800 placeholder-slate-400 outline-none text-sm font-medium",
        }[theme] || "w-full",

        icon: {
            aurora: "absolute left-4 text-purple-300/60 w-5 h-5",
            cyber: "absolute left-4 text-purple-500/70 w-5 h-5",
            editorial: "absolute left-2 text-zinc-400 w-5 h-5",
            saas: "absolute left-4 text-slate-400 w-5 h-5",
        }[theme] || "absolute left-4 text-gray-400",

        select: {
            aurora: "w-full bg-transparent px-5 py-4 pl-12 text-white outline-none text-base appearance-none [&>option]:bg-purple-950 [&>option]:text-white",
            cyber: "w-full bg-transparent px-5 py-4 pl-12 text-purple-200 outline-none text-sm font-mono tracking-wide appearance-none [&>option]:bg-zinc-950 [&>option]:text-purple-300",
            editorial: "w-full bg-transparent px-2 py-3.5 pl-10 text-zinc-900 outline-none text-base font-sans appearance-none [&>option]:bg-white [&>option]:text-zinc-800",
            saas: "w-full bg-transparent px-5 py-3.5 pl-12 text-slate-800 outline-none text-sm font-medium appearance-none [&>option]:bg-white [&>option]:text-slate-800",
        }[theme] || "w-full",

        button: {
            aurora: "w-full bg-white text-purple-950 font-bold py-4 rounded-2xl text-lg shadow-xl shadow-purple-950/20 hover:shadow-white/20 hover:scale-[1.01] active:scale-[0.99] transition duration-300 disabled:opacity-50",
            cyber: "w-full bg-transparent border-2 border-purple-500 text-purple-300 font-mono tracking-widest uppercase py-4 rounded-none text-lg hover:bg-purple-500 hover:text-black hover:shadow-[0_0_20px_#a855f7] active:translate-y-[1px] transition-all duration-300 disabled:opacity-50",
            editorial: "w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-4 rounded-none text-lg tracking-widest uppercase transition duration-300 disabled:opacity-50",
            saas: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-sm shadow-md shadow-indigo-100 hover:shadow-lg transition duration-300 disabled:opacity-50",
        }[theme] || "w-full",

        avatarRing: {
            aurora: "relative w-28 h-28 rounded-full overflow-hidden bg-purple-950/40 border-2 border-white/20 shadow-inner flex items-center justify-center group",
            cyber: "relative w-28 h-28 rounded-none overflow-hidden bg-black border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center justify-center group",
            editorial: "relative w-28 h-28 rounded-full overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center group",
            saas: "relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md shadow-slate-100 flex items-center justify-center group",
        }[theme] || "relative w-28 h-28",

        changePhotoBtn: {
            aurora: "rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/30 transition",
            cyber: "rounded-none border border-cyan-400 bg-transparent px-4 py-2 text-xs font-mono text-cyan-300 uppercase tracking-widest hover:bg-cyan-950/50 transition-all",
            editorial: "rounded-none border border-zinc-900 bg-transparent px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition",
            saas: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition",
        }[theme] || "rounded-xl border border-gray-300 px-4 py-2 text-sm",

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

            {/* Profile image section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                <div className={styles.avatarRing}>
                    {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className={`flex h-full w-full items-center justify-center text-xs font-semibold ${theme === 'cyber' ? 'text-purple-400' : 'text-gray-400'}`}>
                            NO AVATAR
                        </div>
                    )}
                    
                    {/* Hover Camera Icon overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer duration-200" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="text-white w-6 h-6" />
                    </div>
                </div>

                <div className="text-center sm:text-left">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={styles.changePhotoBtn}
                    >
                        Upload New Photo
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp,image/avif"
                        onChange={onImageChange}
                        className="hidden"
                    />
                    <p className={`mt-2 text-xs ${theme === 'cyber' ? 'font-mono text-purple-400/60' : theme === 'aurora' ? 'text-purple-200/60' : 'text-slate-400'}`}>
                        Accepts JPG, PNG, WEBP. Max size 5MB.
                    </p>
                </div>
            </div>

            {/* Full Name */}
            <div>
                <label className={styles.label}>
                    {theme === 'cyber' && <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse"></span>}
                    Full Name
                </label>
                <div className={styles.inputContainer}>
                    <User className={styles.icon} />
                    <input
                        type="text"
                        placeholder="e.g. Sushmitaa Sen"
                        {...register("fullName")}
                        className={styles.input}
                    />
                </div>
                {errors.fullName && (
                    <p className={`text-sm mt-2 font-medium ${theme === 'cyber' ? 'text-red-400 font-mono' : 'text-rose-500'}`}>
                        {errors.fullName.message}
                    </p>
                )}
            </div>

            {/* Contact Number */}
            <div>
                <label className={styles.label}>
                    {theme === 'cyber' && <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse"></span>}
                    Contact Number
                </label>
                <div className={styles.inputContainer}>
                    <Phone className={styles.icon} />
                    <input
                        type="text"
                        placeholder="+977 980-000000"
                        {...register("contactNumber")}
                        className={styles.input}
                    />
                </div>
                {errors.contactNumber && (
                    <p className={`text-sm mt-2 font-medium ${theme === 'cyber' ? 'text-red-400 font-mono' : 'text-rose-500'}`}>
                        {errors.contactNumber.message}
                    </p>
                )}
            </div>

            {/* Gender */}
            <div>
                <label className={styles.label}>
                    {theme === 'cyber' && <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse"></span>}
                    Gender Identity
                </label>
                <div className={styles.inputContainer}>
                    <Smile className={styles.icon} />
                    <select
                        {...register("gender")}
                        className={styles.select}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other / Prefer not to say</option>
                    </select>
                    
                    {/* Select Arrow Indicator */}
                    <div className="absolute right-4 pointer-events-none flex items-center">
                        <svg className={`h-4 w-4 ${theme === 'cyber' ? 'text-purple-400' : theme === 'aurora' ? 'text-purple-300' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className={styles.button}
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            {theme === 'cyber' ? "SAVING.EXE..." : "Saving Changes..."}
                        </span>
                    ) : (
                        theme === 'cyber' ? "SAVE_PROFILE.SYS" : "Save Settings"
                    )}
                </button>
            </div>
        </form>
    );
}
