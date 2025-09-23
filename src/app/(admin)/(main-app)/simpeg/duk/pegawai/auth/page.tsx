    "use client";
    import React from "react";
    import { useForm } from "react-hook-form";


    export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
        email: "",
        username: "",
        old_password: "",
        new_password: "",
        confirm_password: "",
        },
    });
    
    const newPassword = watch("new_password");
    
    const handleFormSubmit = (data: any) => {
        console.log("submit")
    };

    const handleOnCancel = () => {
        console.log("cancel")
    };
    
    return (
        <div className="w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="max-w-lg m-auto"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Reset Username / Email & Password
            </h2>
            
            {/* Username */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
            </label>
            <input
                {...register("username", { required: "Username wajib diisi" })}
                type="text"
                placeholder="Masukkan username baru"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
            </div>
            
            {/* Email */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
            </label>
            <input
                {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
                },
                })}
                type="email"
                placeholder="Masukkan email baru"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
            </div>
            
            <hr className="my-4 border-gray-300 dark:border-gray-700" />
            
            {/* Old Password */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Lama
            </label>
            <input
                {...register("old_password", { required: "Password lama wajib diisi" })}
                type="password"
                placeholder="Masukkan password lama"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.old_password && (
                <p className="text-red-500 text-sm mt-1">
                {errors.old_password.message}
                </p>
            )}
            </div>
            
            {/* New Password */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Baru
            </label>
            <input
                {...register("new_password", {
                required: "Password baru wajib diisi",
                minLength: { value: 6, message: "Minimal 6 karakter" },
                })}
                type="password"
                placeholder="Masukkan password baru"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.new_password && (
                <p className="text-red-500 text-sm mt-1">
                {errors.new_password.message}
                </p>
            )}
            </div>
            
            {/* Confirm Password */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konfirmasi Password Baru
            </label>
            <input
                {...register("confirm_password", {
                required: "Konfirmasi password wajib diisi",
                validate: (value) =>
                    value === newPassword || "Password tidak sama",
                })}
                type="password"
                placeholder="Ulangi password baru"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password.message}
                </p>
            )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
            <button
                type="button"
                onClick={() => {
                reset();
                handleOnCancel();
                }}
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