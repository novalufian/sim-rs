"use client";
import React from "react";
import Image from "next/image";
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai';
import UserStateCuti from "./duk/(stats)/(user)/cuti";
import Link from "next/link";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { 
    LuUser, 
    LuCalendar, 
    LuLink, 
    LuTrendingUp, 
    LuFileText,
    LuZap
} from "react-icons/lu";
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
            <div className="col-span-12 mt-10">
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 tracking-tighter">
                        Menu Utama
                        <span className="text-green-600 dark:text-green-400">.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    <LinkMenu 
                        href="simpeg/duk/pegawai/data-saya" 
                        number="01"
                        icon="user"
                        title="Kelola Data Diri" 
                        description="Akses dan perbarui informasi pribadi, riwayat pendidikan, serta data keluarga Anda dengan mudah." 
                    />

                    <LinkMenu 
                        href="simpeg/cuti" 
                        number="02"
                        icon="calendar"
                        title="Ajukan Cuti" 
                        description="Ajukan cuti tahunan, sakit, atau alasan lain secara online dan pantau status persetujuannya." 
                        featured
                    />

                    <LinkMenu 
                        href="simpeg/mutasi" 
                        number="03"
                        icon="link"
                        title="Mutasi" 
                        description="Ajukan dan kelola proses mutasi jabatan atau lokasi kerja dengan transparan." 
                    />

                    <LinkMenu 
                        href="simpeg/ijin-belajar" 
                        number="04"
                        icon="chart"
                        title="Ijin Belajar" 
                        description="Ajukan izin belajar untuk studi lanjut tanpa mengganggu status kepegawaian." 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <LinkMenu 
                        href="simpeg/kenaikan-gaji" 
                        number="05"
                        icon="chart"
                        title="Kenaikan Gaji" 
                        description="Lacak riwayat kenaikan gaji dan ajukan permohonan sesuai ketentuan." 
                        horizontal
                    />

                    <LinkMenu 
                        href="simpeg/dokumen" 
                        number="06"
                        icon="file"
                        title="Dokumen" 
                        description="Simpan, kelola, dan akses dokumen penting pegawai secara digital dan aman." 
                        horizontal
                    />
                </div>
            </div>
            
        </div>
    );
}

interface LinkMenuProps {
    href: string;
    number: string;
    icon: 'user' | 'calendar' | 'link' | 'chart' | 'file' | 'zap';
    title: string;
    description: string;
    featured?: boolean;
    horizontal?: boolean;
}

const iconMap = {
    user: LuUser,
    calendar: LuCalendar,
    link: LuLink,
    chart: LuTrendingUp,
    file: LuFileText,
    zap: LuZap,
};

function LinkMenu({ href, number, icon, title, description, featured = false, horizontal = false }: LinkMenuProps) {
    const IconComponent = iconMap[icon];
    
    if (horizontal) {
        return (
            <Link href={href} className="group">
                <div className="rounded-2xl border border-gray-200 bg-white hover:border-green-600 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-green-500 p-6 transition-all h-full">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <p className="text-5xl font-bold text-gray-200 dark:text-gray-700">{number}</p>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <IconComponent className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-3xl font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors tracking-tight">
                                    {title}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={href} className="group">
            <div className={`rounded-2xl border border-gray-200 bg-white hover:border-green-600 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-green-500 p-6 transition-all h-full flex flex-col ${
                featured ? 'md:col-span-2 md:row-span-2' : ''
            }`}>
                <div className="flex-shrink-0 mb-4">
                    <p className="text-8xl font-bold text-gray-200 dark:text-gray-700 mb-3 tracking-tighter">{number}</p>
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit">
                        <IconComponent className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <h3 className="text-3xl font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-3 tracking-tight">
                        {title}
                    </h3>
                    {featured && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}