import { z } from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    contactNumber: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(6, "Password must be at least 6 characters"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type PasswordFormData = z.infer<typeof passwordSchema>;
