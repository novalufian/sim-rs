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
    const user = useAppSelector((state) => state?.auth?.user);


    if(!user?.id_pegawai) { 
        return <div>User not found</div>;
    }
    
    // Get pegawai data using the user's ID
    const { data: pegawaiData, isLoading, error } = useGetPegawaiById(user?.id_pegawai);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
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
            {/* <div className="col-span-3 flex h-full flex-col items-center justify-center">
                <p className="text-2xl font-thin text-gray-900 dark:text-white pr-10 self-end">Kelola data pribadi terpusat, efisien, dan tetap aman.</p>
            </div> */}
            
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
            
            

            {/* LIST MENU UTAMA */}

            <div className="grid grid-cols-6 grid-rows-5 gap-3 mt-10 w-full h-[500px] col-span-12">
                <LinkMenu 
                href="simpeg/duk/pegawai/data-saya" 
                className="group col-start-1 col-end-3 row-start-1 row-end-4" 
                title="Kelola Data Diri" 
                description="Akses dan perbarui informasi pribadi, riwayat pendidikan, serta data keluarga Anda dengan mudah." 
                />

                <LinkMenu 
                href="simpeg/cuti" 
                className="group col-start-3 col-end-5 row-start-1 row-end-3" 
                title="Ajukan Cuti" 
                description="Ajukan cuti tahunan, sakit, atau alasan lain secara online dan pantau status persetujuannya." 
                />

                <LinkMenu 
                href="simpeg/mutasi" 
                className="group col-start-1 col-end-3 row-start-4 row-end-6" 
                title="Mutasi" 
                description="Ajukan dan kelola proses mutasi jabatan atau lokasi kerja dengan transparan." 
                />

                <LinkMenu 
                href="simpeg/kenaikan-gaji" 
                className="group col-start-3 col-end-5 row-start-3 row-end-5" 
                title="Kenaikan Gaji" 
                description="Lacak riwayat kenaikan gaji dan ajukan permohonan sesuai ketentuan." 
                />

                <LinkMenu 
                href="simpeg/ijin-belajar" 
                className="group col-start-5 col-end-7 row-start-1 row-end-4" 
                title="Ijin Belajar" 
                description="Ajukan izin belajar untuk studi lanjut tanpa mengganggu status kepegawaian." 
                />

                <LinkMenu 
                href="simpeg/dokumen" 
                className="group col-start-5 col-end-7 row-start-4 row-end-6" 
                title="Dokumen" 
                description="Simpan, kelola, dan akses dokumen penting pegawai secara digital dan aman." 
                />

                {/* <LinkMenu 
                href="simpeg/duk/pegawai/lainnya" 
                className="group col-start-3 col-end-5 row-start-5 row-end-6" 
                title="Menu Lainnya" 
                description="" 
                /> */}
   
            </div>
            
        </div>
    );
}

function LinkMenu(props : any) {
    return (
        <Link href={props.href} className={`${props.className}`}>
            <div className="group-hover:dark:bg-amber-light-300 text-blue-600 rounded-2xl border border-transparent bg-white hover:bg-blue-600 hover:text-white p-4 transition-all dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full dark:text-amber-light-300 group-hover:dark:text-gray-800 flex justify-between items-center">
                <div className="flex flex-col pr-5 w-9/12">
                    <h1 className="text-4xl leading-tight font-semibold tracking-tight">{props.title}</h1>
                    <p className="mt-3 w-10/12 leading-tight tracking-tight font-light">{props.description}</p>
                </div>
                
                <BsArrowUpRightCircle className="w-15 h-15 group-hover:scale-160 transition-all group-hover:rotate-45" />
                </div>
        </Link>
    );
}