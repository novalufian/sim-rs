"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useWhoami } from "@/hooks/fetch/useWhoami";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/libs/store'
import { updateUser, logout } from '@/features/auth/authSlice'
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from "next/navigation";


import { GoInfo ,GoMention, GoDatabase, GoSignOut} from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
export default function UserDropdown() {
const router = useRouter();
const [isOpen, setIsOpen] = useState(false);
const dispatch = useDispatch<AppDispatch>();
const [isLoading, setIsLoading] = useState(false);
const { data: whoamiData, isLoading: whoAmILoading, error: whoamiError , refetch : refetchWhoami } = useWhoami();
const user = useSelector((state: RootState) => state.auth.user);

const queryClient = useQueryClient();
const pathname = usePathname();
const splitedPath = pathname.split("/");


function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
}

function dologout() {
    queryClient.removeQueries({ queryKey: ['whoami'] });

    setTimeout(function(){
        Cookies.remove('token');
        closeDropdown();
        dispatch(logout());
        router.refresh();
    }, 500);
}


function closeDropdown() {
    setIsOpen(false);
}

useEffect(() => {
    setIsLoading(whoAmILoading);
    if (whoamiData?.data) {
        const userData = {
            id: whoamiData.data.id,
            username: whoamiData.data.username,
            role: whoamiData.data.role,
            id_pegawai: whoamiData.data.id_pegawai,
            nama: whoamiData.data.nama,
            nip: whoamiData.data.nip,
            email: whoamiData.data.email,
            jenis_kelamin: whoamiData.data.jenis_kelamin,
            unit_kerja: whoamiData.data.unit_kerja,
            struktural_id: whoamiData.data.struktural_id,
            struktural_nama: whoamiData.data.struktural_nama,
            fungsional_id: whoamiData.data.fungsional_id,
            fungsional_nama: whoamiData.data.fungsional_nama,
            avatar: whoamiData.data.avatar,
        };

        if (!user) {
            dispatch(updateUser(userData));
        }
    }
}, [whoamiData, user, dispatch, whoAmILoading, refetchWhoami]);

if (isLoading) {
    return (
    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
}
console.log(user)

if (whoamiError && !user) {
    // console.error("Error fetching user data:", whoamiError);
    // Handle error appropriately, e.g., show a message, redirect to login
    return <p>Error loading user data.</p>;
}

if (!user) {
    return <p>Loading...</p>;
}

return (
    <div className="relative">
    <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
    >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
        <Image
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt={user?.nama || "User"}
            className="object-cover rounded-full"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/user/owner.jpg";
            }}
        />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.nama}</span>

        <svg
        className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </svg>
    </button>

    <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
        <div>
        <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.nama}
        </span>
        <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
        </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li>
            <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
            <GoMention className="w-6 h-6"/>
            Edit profile
            </DropdownItem>
        </li>
        <li>
            <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
            <GoInfo className="w-6 h-6"/>
            Support
            </DropdownItem>
        </li>

        {/* MASTER DATA ONLY CAN ACCESS BYUSERADMIN  */}
        {user.role ==="super_admin" && (
            splitedPath[1] === "master" ?
                <li>
                    <DropdownItem
                        onItemClick={closeDropdown}
                        tag="a"
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 font-medium text-green-700 rounded-lg group text-theme-sm hover:bg-green-100 hover:text-green-700 dark:text-green-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                        <RxDashboard className="w-6 h-6"/>
                        Dashboard
                    </DropdownItem>
                </li>
                :
                <li>
                <DropdownItem
                    onItemClick={closeDropdown}
                    tag="a"
                    href="/master"
                    className="flex items-center gap-3 px-3 py-2 font-medium text-red-700 rounded-lg group text-theme-sm hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                    <GoDatabase className="w-6 h-6"/>

                    Master data
                </DropdownItem>
                </li>
            ) }
        {/* END OF MASTER DATA ONLY CAN ACCESS BYUSERADMIN  */}


        </ul>
        <button
        onClick={dologout}
        className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
            <GoSignOut className="w-6 h-6"/>
            Sign out
        </button>
    </Dropdown>
    </div>
);
}
