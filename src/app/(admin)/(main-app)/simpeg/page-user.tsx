"use client";
import React from "react";
import Image from "next/image";
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai';
import UserStateCuti from "./duk/(stats)/(user)/cuti";
import Link from "next/link";
import { BsArrowUpRightCircle } from "react-icons/bs";
import KenaikanGajiChart from "./duk/(stats)/(user)/kenaikanGaji";

export default function PageUser() {
    const user = useAppSelector((state) => state.auth.user);


    if(!user?.id_pegawai) { 
        return <div>User not found</div>;
    }
    
    // Get pegawai data using the user's ID
    const { data: pegawaiData, isLoading, error } = useGetPegawaiById(user?.id_pegawai);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading pegawai data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading pegawai data: {error.message}
            </div>
        );
    }

    if (!pegawaiData) {
        return (
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                No pegawai data found
            </div>
        );
    }


    return (
        <div className="grid grid-cols-12 gap-2 items-start mt-10">
            
            <div className="col-span-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] max-h-[350px] flex justify-center items-center flex-col overflow-hidden relative">
                    <Image src={`${pegawaiData.data.avatar_url}`} alt="Foto Pegawai" width={100} height={100} className="w-full h-full object-cover " />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center flex-col">
                        <p className="text-white text-4xl font-bold">{pegawaiData.data.nama}</p>
                        <p className="text-white text-2xl font-thin">{pegawaiData.data.nip}</p>
                        <p className="text-white text-2xl font-thin">{pegawaiData.data.status_pekerjaan}</p>


                    </div>
                </div>
            </div>


            <div className="col-span-6">
                <KenaikanGajiChart id_pegawai={pegawaiData.data.id_pegawai}/>
            </div>

            <div className="col-span-3">
                <UserStateCuti id_pegawai={pegawaiData.data.id_pegawai}/>
            </div>

            <h1 className="col-span-12 text-center text-2xl my-5 text-gray-500">Menu Utama</h1>

            <div className="col-span-3">
                <Link href="duk/data" className='group'>
                <div className="group-hover:dark:bg-blue-light-300 text-blue-600 rounded-2xl border border-gray-200 bg-blue-100/50 hover:bg-blue-600 hover:text-white p-4 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-30 dark:text-blue-light-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Kelola <br /> Data Diri</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>

            <div className="col-span-3">
                <Link href="duk/data" className='group'>
                <div className="group-hover:dark:bg-blue-light-300 text-blue-600 rounded-2xl border border-gray-200 bg-blue-100/50 hover:bg-blue-600 hover:text-white p-4 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-30 dark:text-blue-light-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Mutasi</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>

            <div className="col-span-3">
                <Link href="duk/data" className='group'>
                <div className="group-hover:dark:bg-blue-light-300 text-gray-600 rounded-2xl border border-gray-200 bg-blue-100/50 hover:bg-blue-600 hover:text-white p-4 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-30 dark:text-blue-light-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Kenaikan Gaji</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>

            <div className="col-span-3">
                <Link href="duk/data" className='group'>
                <div className="group-hover:dark:bg-blue-light-300 text-blue-600 rounded-2xl border border-gray-200 bg-blue-100/50 hover:bg-blue-600 hover:text-white p-4 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-30 dark:text-blue-light-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Mutasi</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>

            <div className="col-span-3">
                <Link href="duk/data" className='group'>
                <div className="group-hover:dark:bg-blue-light-300 text-blue-600 rounded-2xl border border-gray-200 bg-blue-100/50 hover:bg-blue-600 hover:text-white p-4 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-30 dark:text-blue-light-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Mutasi</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>
            
            
            
        </div>
    );
}