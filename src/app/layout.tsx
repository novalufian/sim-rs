import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${outfit.variable} min-h-screen min-w-full`}
      >
        <div className="fixed inset-0 bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-900 -z-10" />
        <ThemeProvider>
          <SidebarProvider>
            <main className="relative min-h-screen">
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
