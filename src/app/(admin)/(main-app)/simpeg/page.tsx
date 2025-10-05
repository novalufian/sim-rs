"use client";
import React from "react";
import { useAppSelector } from '@/hooks/useAppDispatch';
import getGreeting from '@/utils/greatingMsg'
import PageSuperAdmin from "./page-super-admin";
import PageUser from "./page-user";
import PageAdmin from "./page-admin";


export default function BlankPage() {
    const user = useAppSelector((state) => state.auth.user);
    return (
    <>
        <div className='flex flex-col mb-5'>
            <h2 className='text-4xl font-extralight tracking-tight text-gray-600 dark:text-gray-300 mb-2'> 👋 Hi, {getGreeting()}</h2>
            <h2 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-800 to-dark-blue-600 bg-clip-text text-transparent capitalize'>{user?.name.toLocaleLowerCase()}</h2>
        </div>

        {user?.role === "super_admin" && <PageSuperAdmin />}
        {user?.role === "user" && <PageUser />}
        {user?.role === "admin" && <PageAdmin />}

        
    </>
    );
}
