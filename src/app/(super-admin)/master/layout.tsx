"use client"
import React from "react";
import { globalStore } from "@/libs/store";
import { useAppSelector } from "@/hooks/useAppDispatch";
import Unauthorized from "@/components/common/unauthorized";


function layout({
    children,
    bidang,
    jabatan,
    klasifikasi
}: {
    children: React.ReactNode;
    bidang: React.ReactNode;
    jabatan: React.ReactNode;
    klasifikasi: React.ReactNode; 
}) {
    const user = useAppSelector((state) => state.auth.user);
    console.log(user)
    if (user?.role != "super_admin") {
        return <Unauthorized />
    }

    return (
        <div className="grid grid-cols-12 gap-2 items-start">
        {/* Main content area */}
            <div className="col-span-12 md:col-span-12">
            {children}
            </div>
            
            {/* Bidang section */}
            <div className="col-span-12 md:col-span-4">
            {bidang}
            </div>
            
            {/* Jabatan section */}
            <div className="col-span-12 md:col-span-4">
            {jabatan}
            </div>
            {/* kasifikai section */}
            <div className="col-span-12 md:col-span-4">
            {klasifikasi}
            </div>
        </div>
    );
}

export default layout;
