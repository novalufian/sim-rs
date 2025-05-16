"use client"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { BsArrowLeft } from "react-icons/bs";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/fetch/useAuth";
import SpinerLoading from "@/components/loading/spiner";
import Cookies from 'js-cookie';  // Import js-cookie

// 1. Define Zod schema
const SignInSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(4, "Password minimal 4 karakter"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SignInForm() {
  const { mutate: doAuth, data, isPending, isError, error, isSuccess } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Use isPending for loading state instead of isLoading
  const isLoading = isPending;

  const errorMsg = error?.response?.data?.message || "Unknown error";
  const paswordError = errorMsg.includes("credential");
  const emailError = errorMsg.includes("username");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (formData: SignInFormData) => {
    try {
        doAuth(formData); // Trigger authentication
    } catch (error) {
      console.error("Authentication failed:", error);
      // setErrorMessage("Failed to sign in. Please try again.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const { token } = data;

      console.log("sukses ", token);
      // Store token and user data in cookies
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('userInfo', JSON.stringify(data.user), { expires: 7 });

      // Redirect after successful login
      // redirect("/")
      router.refresh();

    }
  }, [isSuccess, data, router]);

  useEffect(() => {
    if (isError) {
      // Clear cookies if there's an error
      Cookies.remove('token');
      Cookies.remove('userInfo');
    }
  }, [isError]);


  return (
    <div className="flex flex-col flex-1 lg:w-2/5 w-full relative">
      {isLoading && (
        <div className="absolute top-0 left-0 cursor-not-allowed h-full w-full z-20 bg-white/20 backdrop-blur-sm">
          <SpinerLoading />
        </div>
      )}

      <div className="w-8/10 max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <BsArrowLeft className="w-5 h-5 mr-10" />
          Back to dashboard
        </Link>
      </div>

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
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  error={emailError || errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-error-500">{errors.email.message}</p>
                )}
                {emailError && (
                  <p className="text-sm text-error-500 mt-1">{errorMsg}</p>
                )}
              </div>

              <div>
                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    error={paswordError || errors.password}
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
                  <p className="text-sm text-error-500">{errors.password.message}</p>
                )}

                {paswordError && (
                  <p className="text-sm text-error-500 mt-1">{errorMsg}</p>
                )}
              </div>

              <div>
                <Button className="w-full" size="sm" btntype="submit">
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
