import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .or(z.literal("")), // Allow empty string (for when not changing password)
    role: z.enum(["admin", "user", "super_admin"]),
    is_deleted: z.boolean(),
    pegawai_id: z.string().min(1, "Employee ID is required"),
});

export type UserFormInput = z.infer<typeof userSchema>;