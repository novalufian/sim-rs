"use client";

import React from 'react';
import { useAppSelector } from "@/hooks/useAppDispatch";
import GreetingHeader from '@/components/common/GreetingHeader';
import type { RootState } from '@/libs/store';
import { BsArrowUpRightCircle } from "react-icons/bs";
import Link from "next/link";
import SuperAdminPage from './superadmin-page';
import UserState from './state/user-state';

export default function Page() {
    const user = useAppSelector((state: RootState) => state.auth.user);
    const userRole = user?.role;

    return (
        <div className="grid grid-cols-12 gap-[2px] md:gap-2">
            <div className="col-span-8 min-h-40 flex justify-center flex-col">
                <GreetingHeader 
                    userName={user?.nama}
                    structuralName={user?.struktural_nama}
                />
            </div>
            {userRole === "super_admin" ? (
                <div className="col-span-4">
                    <Link href="/simpeg/ijin-belajar/data" className='group'>
                        <div className="group-hover:dark:bg-amber-300 text-red-600 rounded-2xl border border-gray-200 bg-red-100/50 hover:bg-red-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center">
                            <h1 className='text-2xl leading-tight font-semibold tracking-tight'>Kelola <br /> Data Ijin Belajar</h1>
                            <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45'/>
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="col-span-4">
                    <Link href="/simpeg/ijin-belajar/permohonan" className='group'>
                        <div className="group-hover:dark:bg-blue-300 text-blue-600 rounded-2xl border border-gray-200 bg-blue-100/50 hover:bg-blue-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 min-h-40 dark:text-blue-300 group-hover:dark:text-gray-800 flex justify-between items-center">
                            <h1 className='text-2xl leading-tight font-semibold tracking-tight'>Ajukan <br /> Ijin Belajar</h1>
                            <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45'/>
                        </div>
                    </Link>
                </div>
            )}

            <div className="col-span-12 h-20 flex justify-center items-center">
                <hr className='w-6/8 border-t border-white/[0.03]'/>
            </div>

            {userRole && userRole === "super_admin" && <SuperAdminPage />}
            {userRole && userRole !== "super_admin" && (
                <div className="col-span-12">
                    <UserState />
                </div>
            )}
        </div>
    );
}