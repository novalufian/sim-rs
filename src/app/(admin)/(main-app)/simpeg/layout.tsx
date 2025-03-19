import React from "react";

export default function SimpegLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mb-30">
        {children}
        </div>
    );
}
// rounded-4xl dark:bg-gray-900 bg-white/50 p-2 backdrop-blur-2xl border-2 border-white dark:border-gray-800 min-h-screen
