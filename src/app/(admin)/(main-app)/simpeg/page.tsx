"use client";
import React from "react";
import { useAppSelector } from '@/hooks/useAppDispatch';
import PageSuperAdmin from "./page-super-admin";
import PageUser from "./page-user";
import PageAdmin from "./page-admin";
import GreetingHeader from "@/components/common/GreetingHeader";


export default function BlankPage() {
    const user = useAppSelector((state) => state.auth.user);
    return (
    <>
        <div className="grid grid-cols-12 gap-2">  
            <div className="col-span-6">
                <GreetingHeader 
                    userName={user?.nama}
                    structuralName={user?.struktural_nama}
                />
            </div>
        </div>

        {user?.role === "super_admin" && <PageSuperAdmin />}
        {user?.role === "user" && <PageUser />}
        {user?.role === "admin" && <PageAdmin />}

        
    </>
    );
}
