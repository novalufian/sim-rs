"use client"
import React, { use, useEffect, useState } from "react";
import Image from "next/image";

// ** HOOK
import { useGetUserByPegawaiId, useUpdateUser, useRegister } from "@/hooks/fetch/useAuth";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormInput } from '@/types/users/interface';

// ** COMPONENT
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

// ** ICON
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiMiniPaperAirplane } from "react-icons/hi2";
import { GoX, GoPencil, GoPlus } from "react-icons/go";

const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "user", label: "Regular User" },
    { value: "super_admin", label: "Super Admin" },
];

export default function AuthForm({ pegawaiId , isProfile}: { pegawaiId: string , isProfile? : boolean}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const { 
        data: dataUser, 
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
        isSuccess: isUserSuccess,
        refetch: refetchUser 
    } = useGetUserByPegawaiId(pegawaiId || "");
    
    const { mutate: updateUser, isPending: isUpdateLoading } = useUpdateUser();
    const { mutate: createUser, isPending: isCreateLoading } = useRegister();
    
    const isFormLoading = isUserLoading || isUpdateLoading || isCreateLoading;

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormInput>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            password: "",
            role: "user",
            is_deleted: false,
            pegawai_id: pegawaiId || ""
        },
    });

    const onSubmit: SubmitHandler<UserFormInput> = (data) => {
        if (isNewUser) {
            // Create new user
            createUser(data, {
                onSuccess: () => {
                    refetchUser();
                    setIsNewUser(false);
                    setIsEditing(false);
                }
            });
        } else {
            // Update existing user
            const payload = {
                ...data,
                id: dataUser?.data?.id,
                password: data.password === "" ? undefined : data.password
            };
            updateUser(payload, {
                onSuccess: () => {
                    setIsEditing(false);
                }
            });
        }
    };

    const onError = (err: any) => {
        console.error("Form validation errors:", err);
    };

    useEffect(() => { // Check if user is successfully created or updated
        if (isUserSuccess) {
            console.log(dataUser)
            if(!dataUser){
                setIsNewUser(true);
            }
        }
    }, [isUserSuccess, dataUser]);

    useEffect(() => {
        if (dataUser) {
            console.log(dataUser.data)
            if (dataUser.data) {
                // Existing user found
                setIsNewUser(false);
                setValue("username", dataUser.data.username);
                setValue("role", dataUser.data.role);
                setValue("is_deleted", dataUser.data.is_deleted);
                setValue("pegawai_id", dataUser.data.pegawai_id);
            } else {
                // No user found - setup for new user
                setIsNewUser(true);
                setIsEditing(true); // Auto-enable editing for new user
                reset({
                    username: "",
                    password: "",
                    role: "user",
                    is_deleted: false,
                    pegawai_id: pegawaiId
                });
            }
        }
    }, [dataUser, setValue, reset, pegawaiId]);

    if (isUserLoading) {
        return <div className="text-center py-8">Loading user data...</div>;
    }

    if (isUserError) {
        return <div className="text-center py-8 text-red-500">Error loading user: {userError.message}</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] w-9/10">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4 ml-6 flex items-end">
                    {isNewUser ? "Register New User" : "User Profile"}
                </h1>

                <div className="space-y-6">
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                                    <Image
                                        width={80}
                                        height={80}
                                        src="/images/user/default-user.jpg"
                                        alt="user"
                                    />
                                </div>
                                <div className="order-3 xl:order-2">
                                    {isNewUser ? (
                                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                            Buat login baru pegawai
                                        </h4>
                                    ) : (
                                        <>
                                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                                {dataUser?.data?.username}
                                            </h4>
                                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Role: {dataUser?.data?.role}
                                                </p>
                                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                                <p className={`text-sm  ${dataUser?.data?.is_deleted ? "text-gray-500 dark:text-gray-400" : "text-green-800 dark:text-green-400"}`}>
                                                    <span className="text-gray-500 dark:text-gray-400">Status:</span> {dataUser?.data?.is_deleted ? "Inactive" : "Active"}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isNewUser && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium shadow-theme-xs lg:inline-flex lg:w-auto ${
                                        !isEditing
                                            ? "dark:border-gray-700 border-gray-300 bg-white dark:bg-gray-800 cursor-not-allowed text-gray-700 dark:hover:text-gray-200 dark:text-gray-400 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                                            : "bg-red-300 text-red-600 hover:bg-red-600 hover:text-white border-red-600"
                                    }`}
                                >
                                    {isEditing ? (
                                        <>
                                            <GoX className="w-6 h-6" />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <GoPencil className="w-6 h-6" />
                                            Edit
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 grid grid-cols-12 gap-6 mb-6">
                            {/* Username */}
                            <div className="col-span-12 md:col-span-6">
                                <div className="flex items-center">
                                    <Label required htmlFor="username">
                                        Username
                                    </Label>
                                    {(isEditing || isNewUser) && (
                                        <p className="ml-3 text-green-600 text-sm font-normal">
                                            (Edit mode)
                                        </p>
                                    )}
                                </div>
                                <Input
                                    id="username"
                                    type="text"
                                    {...register("username")}
                                    placeholder="Enter username"
                                    className={`${
                                        errors.username ? "border-red-500" : ""
                                    } ${(!isEditing && !isNewUser) ? "bg-white dark:bg-transparent" : ""}`}
                                    disabled={!isEditing && !isNewUser}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="col-span-12 md:col-span-6">
                                <div className="flex items-center">
                                    <Label htmlFor="password" required={isNewUser}>
                                        Password
                                    </Label>
                                    {(isEditing || isNewUser) && (
                                        <p className="ml-3 text-green-600 text-sm font-normal">
                                            (Edit mode)
                                        </p>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    placeholder={isNewUser ? "Enter password" : "Leave blank to keep current"}
                                    className={`${
                                        errors.password ? "border-red-500" : ""
                                    } ${(!isEditing && !isNewUser) ? "bg-white dark:bg-transparent" : ""}`}
                                    disabled={!isEditing && !isNewUser}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            {!isProfile && (
                            <div className="col-span-12 md:col-span-6">
                                <div className="flex items-center">
                                    <Label required htmlFor="role">
                                        Role
                                    </Label>
                                    {(isEditing || isNewUser) && (
                                        <p className="ml-3 text-green-600 text-sm font-normal">
                                            (Edit mode)
                                        </p>
                                    )}
                                </div>
                                <select
                                    id="role"
                                    {...register("role")}
                                    className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${
                                        errors.role ? "border-red-500" : "border-gray-300"
                                    } ${
                                        (!isEditing && !isNewUser) 
                                        ? "bg-white dark:bg-transparent cursor-not-allowed" 
                                        : "dark:bg-gray-900"
                                    }`}
                                    disabled={!isEditing && !isNewUser}
                                >
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>
                            )}
                            

                            {/* Status - Hidden for new users */}
                            {!isNewUser && (
                                <div className="col-span-12 md:col-span-6">
                                    <div className="flex items-center">
                                        <Label htmlFor="is_deleted">
                                            Account Status
                                        </Label>
                                        {(isEditing || isNewUser) && (
                                            <p className="ml-3 text-green-600 text-sm font-normal">
                                                (Edit mode)
                                            </p>
                                        )}
                                    </div>
                                    <select
                                        id="is_deleted"
                                        {...register("is_deleted")}
                                        className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${
                                            errors.is_deleted ? "border-red-500" : "border-gray-300"
                                        } ${
                                            (!isEditing && !isNewUser) 
                                            ? "bg-white dark:bg-transparent cursor-not-allowed" 
                                            : "dark:bg-gray-900"
                                        }`}
                                        disabled={!isEditing && !isNewUser}
                                    >
                                        <option value="false">Active</option>
                                        <option value="true">Inactive</option>
                                    </select>
                                </div>
                            )}

                            {/* Pegawai ID (hidden field for new users) */}
                            <input type="hidden" {...register("pegawai_id")} />

                            {/* Action Buttons */}
                            {(isEditing || isNewUser) && (
                                <div className="col-span-12 flex justify-end">
                                    <Button
                                        btntype="button"
                                        size="sm"
                                        className="w-auto bg-gray-300 hover:bg-gray-800 mr-3 text-gray-800 hover:text-white"
                                        onClick={() => {
                                            reset();
                                            setIsEditing(false);
                                            if (isNewUser) {
                                                setIsNewUser(false);
                                                refetchUser();
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        btntype="submit"
                                        size="sm"
                                        className={`w-auto ${
                                            isFormLoading
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        } text-white`}
                                        disabled={isFormLoading}
                                    >
                                        {isFormLoading ? (
                                            <>
                                                <AiOutlineLoading3Quarters className="inline-block animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {isNewUser ? (
                                                    <>
                                                        <GoPlus className="inline-block mr-2" />
                                                        Create User
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiMiniPaperAirplane className="inline-block mr-2" />
                                                        Update User
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}