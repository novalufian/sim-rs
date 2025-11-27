"use client";
import React from 'react'
import GenderStats from './(stats)/(super-admin)/gender';
import { BsArrowUpRightCircle } from "react-icons/bs";
import Link from 'next/link';
import UmurStats from './(stats)/(super-admin)/umur';
import AgamaStats from './(stats)/(super-admin)/agama';
import StatusPerkawinanStats from './(stats)/(super-admin)/statusPerkawinan';
import StatusPekerjaanStats from './(stats)/(super-admin)/statusPekerjaan';
import GreetingHeader from '@/components/common/GreetingHeader';
import { useAppSelector } from '@/hooks/useAppDispatch';

export default function page() {
  const user = useAppSelector((state) => state.auth.user);
  
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
