"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function ProgressBar() {
    const router = useRouter();
    const pathname = usePathname(); // Detects route changes

    useEffect(() => {
        const handleStart = () => NProgress.start();
        const handleComplete = () => NProgress.done();

        // Override router.push and router.replace to trigger progress
        const originalPush = router.push;
        const originalReplace = router.replace;

        router.push = (url: string, options?: { scroll?: boolean }) => {
            handleStart();
            return originalPush(url, options);
        };

        router.replace = (url: string, options?: { scroll?: boolean }) => {
            handleStart();
            return originalReplace(url, options);
        };

        // Also track changes in pathname (for navigation clicks)
        handleStart();
        const timeout = setTimeout(() => handleComplete(), 800); // Fake loading for smooth effect

        return () => {
            clearTimeout(timeout);
            router.push = originalPush;
            router.replace = originalReplace;
        };
    }, [pathname]); // Runs when the route changes

    return null; // No UI needed, just runs the effect
}
