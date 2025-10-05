"use client";
import QueryProviders from "@/context/QueryContext";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import RouteChangeBar from "@/utils/routeChangeBar";

// redux start
import { Provider } from "react-redux";
import { globalStore } from "@/libs/store";
// redux end

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={` min-h-screen min-w-full`}
      >
        <Provider store={globalStore()}>
          <div className="fixed inset-0  dark:from-gray-900 dark:to-gray-900 -z-10" />
          <RouteChangeBar />
          <ThemeProvider>
            {/* 
            bg-gradient-to-t from-[#EDEFF1] to-gray-50
              !!tanstack query is needed to fetch usequery
              without it, useQuery will not work
            */}
            <QueryProviders>
              {/* !!sidebar provider is needed to manage the sidebar state  */}
              <SidebarProvider>
                <main className="relative min-h-screen">
                  {children}
                </main>
              </SidebarProvider>
            </QueryProviders>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
