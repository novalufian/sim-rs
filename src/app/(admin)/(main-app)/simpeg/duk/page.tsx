"use client";
import React, { useState, useEffect } from 'react'
import GenderStats from './(stats)/(super-admin)/gender';
import { BsArrowUpRightCircle } from "react-icons/bs";
import Link from 'next/link';
import UmurStats from './(stats)/(super-admin)/umur';
import AgamaStats from './(stats)/(super-admin)/agama';
import StatusPerkawinanStats from './(stats)/(super-admin)/statusPerkawinan';
import StatusPekerjaanStats from './(stats)/(super-admin)/statusPekerjaan';
import GreetingHeader from '@/components/common/GreetingHeader';
import { useAppSelector } from '@/hooks/useAppDispatch';
import type { RootState } from '@/libs/store';
import { LuShieldX } from "react-icons/lu";
import GeneratingPage from "@/components/loading/GeneratingPage";

export default function page() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userRole = user?.role;
  const [isVerifying, setIsVerifying] = useState(true);

  // Preloading: Verifikasi user role
  useEffect(() => {
    // Simulasi delay untuk verifikasi role
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 500); // Delay 500ms untuk verifikasi

    return () => clearTimeout(timer);
  }, [user]);

  // Tampilkan preloading saat sedang verifikasi role
  if (isVerifying || !userRole) {
    return <GeneratingPage title="Sedang Verifikasi User Role" transparent={true} />;
  }

  // Guard: Cek apakah user memiliki akses (jika role adalah user, tampilkan forbidden)
  if (userRole === "user") {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <LuShieldX className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Akses Ditolak
            </h1>

            {/* Description */}
            <div className="space-y-3 mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Halaman <span className="font-semibold text-gray-700 dark:text-gray-300">Daftar Urut Kepegawaian (DUK)</span> tidak dapat diakses oleh <span className="font-semibold text-red-600 dark:text-red-400">User</span>.
              </p>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Jika Anda memerlukan akses ke halaman ini, silakan hubungi administrator sistem.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center gap-4">
              <Link href="/simpeg">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                  Kembali ke Halaman Simpeg
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-12 gap-2 md:gap-3">
      <div className="col-span-8 min-h-40 flex justify-center flex-col">
        <GreetingHeader 
          userName={user?.nama}
          structuralName={user?.struktural_nama}
        />
      </div>
      <div className="col-span-4">
        <Link href="duk/pegawai" className='group'>
          <div className="group-hover:dark:bg-amber-300 text-red-600 rounded-2xl border border-gray-200 bg-red-100/50 hover:bg-red-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
            <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Kelola <br /> Daftar Urut Kepegawaian</h1>
            <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
          </div>
        </Link>
      </div>
      <div className="col-span-12 my-5 text-center">
        <h1 className='text-4xl leading-tight font-thin tracking-tight  dark:text-gray-400'>Statistik Demografi</h1>
      </div>

      <div className="col-span-4">
          <GenderStats/>
      </div>
      <div className="col-span-4">
          <AgamaStats/>
      </div>

      <div className="col-span-4">
          <StatusPerkawinanStats/>
      </div>

      {/* <div className="col-span-8">
        <GelarStats/>
      </div> */}

      <div className="col-span-7">
        <StatusPekerjaanStats/>
      </div>

      {/* <div className="col-span-5">
        <HighlightTable/>
      </div> */}

      <div className="col-span-5">
        <UmurStats/>
      </div>
    </div>
  );
}
