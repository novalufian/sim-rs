"use client"
import React from "react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import Unauthorized from "@/components/common/unauthorized";


function useLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useAppSelector((state) => state.auth.user);
    if (user?.role != "super_admin") {
        return <Unauthorized />
    }

    return (
        <div className="grid grid-cols-12 gap-2 items-start">
        {/* Main content area */}
            <div className="col-span-12 md:col-span-12">
            {children}
            </div>


        </div>
    );
}

export default useLayout;
