// app/(auth)/_components/schema.ts
import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string("Full name must be string")
        .min(2, "Full name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    contactNumber: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string("Confirm Password must be string")
        .min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long")
});

export type LoginFormData = z.infer<typeof loginSchema>;