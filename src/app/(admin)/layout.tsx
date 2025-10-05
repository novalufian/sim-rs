"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAppSelector } from "@/hooks/useAppDispatch";
import AppFooter from "@/layout/AppFooter";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { Toaster } from 'react-hot-toast';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const user = useAppSelector((state) => state.auth.user);
  
  type Role = "super_admin" | "user" | "admin" | "default";
  const roleUser: Role = user?.role as Role ?? "default";

  const bggradient: Record<Role, string> = {
    super_admin: "bg-gradient-to-b from-blue-100 via-gray-100/20 to-gray-100/20",
    user: "bg-gradient-to-b from-amber-100/20 via-amber-100/50 to-amber-300",
    admin: "bg-gradient-to-b from-red-400 via-red-800 to-dark-red-600",
    default: "bg-gradient-to-b from-gray-100/20 via-gray-100/20 to-gray-200",
  };

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[90px]"
    : "lg:ml-[90px]";

  

  return (
    <div className={`min-h-screen xl:flex flex-col text-gray-900 dark:text-gray-100 dark:bg-none dark:bg-gray-900 ${bggradient[roleUser]}`}>
      {/* Header */}
      <AppHeader />
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
      <AppFooter />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "bg-gray-800 text-white",
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}
