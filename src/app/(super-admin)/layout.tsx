"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppFooter from "@/layout/AppFooter";
import AppHeader from "@/layout/AppHeader";
import AppSidebarMaster from "@/layout/AppSidebarMaster";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[90px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex flex-col text-gray-900 dark:text-gray-100">
      {/* Header */}
      <AppHeader />
      {/* Sidebar and Backdrop */}
      <AppSidebarMaster />
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
