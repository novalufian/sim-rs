"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { BsArrowLeft } from "react-icons/bs";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/fetch/useAuth";
import SpinerLoading from "@/components/loading/spiner";
import Cookies from 'js-cookie';

// 1. Define Zod schema
const SignInSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(4, "Password minimal 4 karakter"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SignInForm() {
  const { mutate: doAuth, isPending, isError, error, isSuccess } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // State for general error messages not tied to a specific field
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError, // Import setError from useForm
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (formData: SignInFormData) => {
    setGeneralError(null); // Clear previous general errors
    setError("email", { message: undefined }); // Clear previous specific errors
    setError("password", { message: undefined });

    doAuth(formData, {
      onSuccess: (data) => {
        // useAuth's onSuccess already sets the token, no need to duplicate here
        console.log("Login successful in component:", data);
        router.refresh(); // Or router.push('/dashboard');
      },
      onError: (err: any) => {
        // This onError is called if the mutation fails.
        // It's the ideal place to map backend errors to form fields or general messages.

        // Clear existing Zod errors (important for re-attempts after server error)
        setError("email", { message: undefined });
        setError("password", { message: undefined });

        if (err.code === 'ERR_NETWORK') {
          setGeneralError("Gagal terhubung ke server. Periksa koneksi Anda atau coba lagi nanti.");
        } else if (err.response) {
          const apiMessage = err.response.data?.message;
          const validationErrors = err.response.data?.data; // Assuming this is an array of { path: string[], message: string }

          if (Array.isArray(validationErrors)) {
            // Backend sent specific validation errors
            validationErrors.forEach((valErr: { path: string[], message: string }) => {
              if (valErr.path && valErr.path.length > 0) {
                const fieldName = valErr.path[0] as keyof SignInFormData; // Assuming path[0] is 'email' or 'password'
                if (fieldName === 'email' || fieldName === 'password') {
                  setError(fieldName, { type: 'server', message: valErr.message });
                }
              }
            });
            // If there are validation errors but none map to our fields, or if a general message is also present
            if (apiMessage && !errors.email && !errors.password) {
                 setGeneralError(apiMessage); // Fallback to general API message
            }
          } else {
            // Backend sent a general error message
            setGeneralError(apiMessage || "Login gagal. Silakan coba lagi.");
          }
        } else {
          // Other unexpected errors
          setGeneralError("Terjadi kesalahan tidak terduga. Silakan coba lagi.");
        }
      },
    });
  };

  useEffect(() => {
    // isPending is already handled by useAuth, so no need for additional isLoading state
    // Just ensure the UI reflects isPending (e.g., button disabled, spinner shown)
  }, [isPending]);


  useEffect(() => {
    if (isError) {
      // Clear cookies if there's an error (as done before)
      Cookies.remove('token');
      Cookies.remove('userInfo');
      console.log("Login error caught in component's useEffect:", error);
    }
  }, [isError, error]); // Add 'error' to dependency array

  return (
    <div className="flex flex-col flex-1 lg:w-2/5 w-full relative">
      {isPending && ( // Use isPending directly for loading state
        <div className="absolute top-0 left-0 cursor-not-allowed h-full w-full z-20 bg-white/20 backdrop-blur-sm">
          <SpinerLoading />
        </div>
      )}


      <div className="flex flex-col justify-center flex-1 w-full max-w-sm mx-auto relative">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Masukkan email dan password dengan benar!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {generalError && ( // Display general error message
                <p className="text-sm text-error-500 text-center mb-4 p-2 bg-red-100 border border-red-400 rounded">
                  {generalError}
                </p>
              )}

              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  // error prop should receive a boolean (true if there's an error for this field)
                  error={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-error-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    // error prop should receive a boolean
                    error={!!errors.password}
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <LuEye className="fill-white dark:fill-gray-400" />
                    ) : (
                      <LuEyeClosed className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-sm text-error-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Button className="w-full" size="sm" btntype="submit" disabled={isPending}>
                  Sign in
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}