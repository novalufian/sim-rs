"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


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
    const pathname = usePathname();
    const activeLinkClass = "text-base font-medium text-white dark:text-gray-300 dark:bg-blue-900 bg-blue-600 w-full p-2 px-4 rounded-md transition-colors duration-300";
    const inactiveLinkClass = "text-base font-medium text-gray-700 dark:text-gray-300 w-full p-2 px-4 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors duration-300";

    return (
        <div className="grid grid-cols-12 gap-2 items-start">

            {/* Right side submenu */}
            <div className="col-span-12 md:col-span-3 sticky top-6 z-10 h-fit">
                <div className="flex flex-col justify-start gap-1 items-start mb-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Menu</h1>
                    <Link
                        href="/master/kepegawaian"
                        className={pathname === "/master/kepegawaian" ? activeLinkClass : inactiveLinkClass}
                    >
                        Master Kepegawaian
                    </Link>
                    <a
                        href="#bidang"
                        className={inactiveLinkClass}
                    >
                        Bidang
                    </a>
                    <Link
                        href="/master/kepegawaian/jabatan"
                        className={pathname === "/master/kepegawaian/jabatan" ? activeLinkClass : inactiveLinkClass}
                    >
                        Jabatan
                    </Link>
                    <a
                        href="#klasifikasi"
                        className={inactiveLinkClass}
                    >
                        Klasifikasi
                    </a>
                    <Link
                        href="/master/kepegawaian/cuti"
                        className={pathname === "/master/kepegawaian/cuti" ? activeLinkClass : inactiveLinkClass}
                    >
                        Jenis Cuti
                    </Link>
                    <Link
                        href="/master/kepegawaian/status-pendidikan"
                        className={pathname === "/master/kepegawaian/status-pendidikan" ? activeLinkClass : inactiveLinkClass}
                    >
                        Status Pendidikan
                    </Link>
                    <Link
                        href="/master/kepegawaian/unit-kerja"
                        className={pathname === "/master/kepegawaian/unit-kerja" ? activeLinkClass : inactiveLinkClass}
                    >
                        Unit Kerja
                    </Link>
                </div>
            </div>

            {/* Main content area */}
            <div className="col-span-12 md:col-span-9 space-y-4 text-gray-900 dark:text-white">
                <div className="col-span-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default layout;
