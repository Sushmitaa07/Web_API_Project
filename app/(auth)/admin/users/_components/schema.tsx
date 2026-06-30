import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    contactNumber: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin"]),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

// Password is optional on edit: leave blank to keep the current password.
export const editUserSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    contactNumber: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    password: z
        .union([z.string().length(0), z.string().min(6, "Password must be at least 6 characters")])
        .optional(),
    role: z.enum(["user", "admin"]),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;
