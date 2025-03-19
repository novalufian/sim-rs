import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Simpeg - RS",
    description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

const menu =[
    {
        "icon" : "/images/icons/duk.png",
        "title" : "Daftar Urut Kepangkatan",
        "url" : "/simpeg/duk"
    },
    {
        "icon" : "/images/icons/cuti.png",
        "title" : "Cuti Pegawai",
        "url" : "/simpeg/cuti"

    },
    {
        "icon" : "/images/icons/mutasi.png",
        "title" : "Mutasi Pegawai",
        "url" : "/simpeg/mutasi"

    },
    {
        "icon" : "/images/icons/gaji.png",
        "title" : "Kenaikan Gaji",
        "url" : "/simpeg/kenaikan-gaji"

    },
    {
        "icon" : "/images/icons/belajar.png",
        "title" : "Tugas / Ijin Belajar",
        "url" : "/simpeg/ijin-belajar"

    },
    {
        "icon" : "/images/icons/pensiun.png",
        "title" : "Pensiun Pegawai",
        "url" : "/simpeg/pensiun"

    },
    {
        "icon" : "/images/icons/kawin.png",
        "title" : "Kawin Cerai",
        "url" : "/simpeg/kawin-cerai"

    },
    {
        "icon" : "/images/icons/surat.png",
        "title" : "Persuratan",
        "url" : "/simpeg/persuratan"

    },

]

export default function BlankPage() {
    return (
    <>

        <h1 className="w-full box-border px-10 text-3xl font-semibold text-gray-600 mt-10 dark:text-white/70">👋 <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Hi Nova , </span> <br />Selemat datang di Simpeg!</h1>

        <div className="rounded-2xl px-5 py-7 xl:px-10 xl:py-12 flex flex-wrap mb-4 gap-3 dark:text-white">
            {menu.map((item, index) => (
                <Link 
                    href={item.url} 
                    key={index}
                    className="w-[calc(25%-12px)] h-[200px] cursor-pointer "
                >
                    <div 
                        className="w-full h-full rounded-2xl border-2 border-white hover:border hover:border-white hover:shadow-slate-900 hover:bg-white/90 dark:hover:bg-gray-800 bg-white/50 p-5 dark:border-gray-800 dark:bg-gray-800/20 md:p-6 flex justify-center flex-col items-center "
                    >
                        <Image width={64} height={64} src={item.icon} alt={item.title}/>
                        <p className="w-7/10 text-center mt-4">{item.title}</p>
                    </div>
                </Link>
            ))}
        </div>
    </>
    );
}
