"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { useGetUserById, useUpdateUser } from "@/hooks/fetch/pegawai/useUser";

// 🧩 Schema Validasi
const FormSchema = z
.object({
    username: z.string().min(1, "Username wajib diisi"),
    role: z.string().min(1, "Role wajib dipilih"),
    old_password: z.string().min(1, "Password lama wajib diisi"),
    new_password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
})
.refine((data) => data.confirm_password === data.new_password, {
    message: "Password tidak sama",
    path: ["confirm_password"],
});

type FormValues = z.infer<typeof FormSchema>;

export default function Page() {
    const user = useAppSelector((state) => state.auth.user);
    const params = useParams();
    const id = params?.id === "data-saya" ? user?.id_pegawai : (params?.id as string);
    const idParam = id as string;
    
    const { data: userData, isLoading } = useGetUserById(idParam);
    const updateUser = useUpdateUser();
    
    // Dynamic default values yang update otomatis saat userData berubah
    const defaultValues = useMemo(
        () => ({
            username: userData?.data?.username ?? "",
            role: userData?.data?.role ?? "user",
            old_password: "",
            new_password: "",
            confirm_password: "",
        }),
        [userData]
    );
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues,
        values: defaultValues, // auto update jika data berubah
    });
    
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const handleFormSubmit = (data: FormValues) => {
        console.log("submit", { idParam, data });
        updateUser.mutate({ id: idParam, formData :data });
    };
    
    const handleOnCancel = () => reset();
    
    return (
        <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-lg m-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Reset Username & Password
        </h2>
        
        {/* Username */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Username
        </label>
        <input
        {...register("username")}
        type="text"
        placeholder="Masukkan username baru"
        className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.username ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600"
        }`}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        
        {/* Role (hanya untuk admin/super_admin) */}
        {(user?.role === "admin" || user?.role === "super_admin") && (
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
            </label>
            <select
            {...register("role")}
            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.role ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600"
            }`}
            >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>
        )}
        
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        
        {/* Password Lama */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Password Lama
        </label>
        <div className="relative">
        <input
        {...register("old_password")}
        type={showOldPassword ? "text" : "password"}
        placeholder="Masukkan password lama"
        className={`w-full px-4 py-3 pr-10 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.old_password ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600"
        }`}
        />
        <button
        type="button"
        onClick={() => setShowOldPassword((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
        >
        {showOldPassword ? "🙈" : "👁️"}
        </button>
        </div>
        {errors.old_password && (
            <p className="text-red-500 text-sm mt-1">{errors.old_password.message}</p>
        )}
        </div>
        
        {/* Password Baru */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Password Baru
        </label>
        <div className="relative">
        <input
        {...register("new_password")}
        type={showNewPassword ? "text" : "password"}
        placeholder="Masukkan password baru (min. 8 karakter)"
        className={`w-full px-4 py-3 pr-10 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.new_password ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600"
        }`}
        />
        <button
        type="button"
        onClick={() => setShowNewPassword((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
        >
        {showNewPassword ? "🙈" : "👁️"}
        </button>
        </div>
        {errors.new_password && (
            <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
        )}
        </div>
        
        {/* Konfirmasi Password */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Konfirmasi Password Baru
        </label>
        <div className="relative">
        <input
        {...register("confirm_password")}
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Ulangi password baru"
        className={`w-full px-4 py-3 pr-10 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.confirm_password ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600"
        }`}
        />
        <button
        type="button"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
        >
        {showConfirmPassword ? "🙈" : "👁️"}
        </button>
        </div>
        {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
        )}
        </div>
        
        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4">
        <button
        type="button"
        onClick={handleOnCancel}
        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
        Cancel
        </button>
        <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
        Simpan Perubahan
        </button>
        </div>
        </form>
        </div>
    );
}
