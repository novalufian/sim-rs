"use client";

import React from "react";

export default function Footer() {
    return (
        <footer className="lg:ml-[90px] py-6 mb-10  dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-center flex-col text-gray-700 dark:text-white/40">
            <p>
                Powered by{"  "}
                <span className="font-semibold text-gray-700 dark:text-white text-lg ml-2 animate-pulse">
                    Kyntara Studio <span className="align-super text-xs">™</span>
                </span> 
            </p>
            <span>from 2025 to 2026. All rights reserved.</span>
        </div>
        </footer>
    );
}
