import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          <div className="lg:w-2/6 w-full h-full bg-gray-50 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <div className="flex flex-col items-center max-w-xs">
                  <Image
                    width={231}
                    height={48}
                    src="./images/logo/logo.svg"
                    alt="Logo"
                  />

                <p className="text-center text-gray-800 dark:text-white/80 text-xl">
                  SSO RSUD dr. ABDUL RIVAI <br />
                  sistem terpadu satu atap untuk pelayanan kesehatan
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
