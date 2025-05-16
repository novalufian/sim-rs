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

import { GoInfo ,GoMention, GoDatabase} from "react-icons/go";
export default function UserDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: whoamiData, isLoading: whoAmILoading, error: whoamiError } = useWhoami();
  const user = useSelector((state: RootState) => state.auth.user);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function dologout() {
    dispatch(logout());
    Cookies.remove('userInfo');
    Cookies.remove('token');
    router.refresh();
    closeDropdown();
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    setIsLoading(whoAmILoading);

    const initializeUser = () => {
      try {
        let userData = null;
        const userInfoCookie = Cookies.get('userInfo');
        const tokenFromCookie = userInfoCookie && userInfoCookie !== 'undefined' ? JSON.parse(userInfoCookie) : null;

        if (whoamiData?.data) {
          userData = {
            id: whoamiData.data.id_pegawai,
            name: whoamiData.data.nama,
            email: whoamiData.data.username,
            role: whoamiData.data.role,
          };
          try {
            Cookies.set('userInfo', JSON.stringify(whoamiData), { expires: 7 });
          } catch (e) {
            console.error("Error setting userInfo cookie", e);
          }
        } else if (tokenFromCookie?.data) {
          userData = {
            id: tokenFromCookie.data.id_pegawai,
            name: tokenFromCookie.data.nama,
            email: tokenFromCookie.data.username,
            role: tokenFromCookie.data.role,
          };
        }

        if (userData && !user) {
          dispatch(updateUser(userData));
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        // Handle the error appropriately, e.g., set an error state, redirect, or show a message
      }
    };

    initializeUser();
  }, [whoamiData, user, dispatch, whoAmILoading]);

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (whoamiError && !user) {
    console.error("Error fetching user data:", whoamiError);
    // Handle error appropriately, e.g., show a message, redirect to login
    return <p>Error loading user data.</p>;
  }

  if (!user) {
    return null;
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
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.name}</span>

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
            {user?.name}
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
        </ul>
        <button
          onClick={dologout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
            />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
