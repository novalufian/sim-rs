import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = {
  title:
    "SSO RSUD dr. Abdul Rivai",
  description: "sistem satu login untuk semua aplikasi RSUD",
};

const classCard = "w-60 h-70 bg-white border border-gray-100 rounded-xl cursor-pointer transition-all hover:drop-shadow-xl hover:-translate-y-4 flex items-center flex-col justify-end overflow-hidden box-border p-3 dark:bg-white/[0.03] dark:border-gray-700";

const mainMenu = [
  {
    "title" : "SIMPEG",
    "icon" : "/images/icons/main-menu/simpeg.png",
    "url" : "/simpeg"
  },
  {
    "title" : "SIM-ASSET",
    "icon" : "/images/icons/main-menu/asset.png",
    "url" : "/sim-asset"
  },
  {
    "title" : "SIM-ARSIP",
    "icon" : "/images/icons/main-menu/arsip.png",
    "url" : "/sim-arsip"
  },
  {
    "title" : "SIM-ADUAN",
    "icon" : "/images/icons/main-menu/lapor.png",
    "url" : "/sim-aduan"
  },
  {
    "title" : "SI-NOMOR",
    "icon" : "/images/icons/main-menu/nomor.png",
    "url" : "/si-nomor"
  },
  {
    "title" : "SIM-KEU",
    "icon" : "/images/icons/main-menu/uang.png",
    "url" : "/sim-keu"
  },
  {
    "title" : "SERVICE DESK",
    "icon" : "/images/icons/main-menu/service.png",
    "url" : "/service-desk"
  },
  {
    "title" : "J.D.I.H",
    "icon" : "/images/icons/main-menu/jdih.png",
    "url" : "/jdih"
  }
]

export default function Ecommerce() {
  return (
    <div className="flex items-center w-full flex-col ">
      <h1 className="text-4xl font-bold mb-8 tracking-tighter text-gray-700">Menu Utama</h1>
      <div className="grid grid-cols-4 gap-4">

        {mainMenu.map((item, index)=>(
            <Link href={item.url} className={classCard}>
            <div className="h-full w-full flex justify-center items-center bg-gray-100 rounded-2xl p-2 dark:bg-gray-900">
              <Image src={item.icon} alt="simpeg" width={80} height={80}></Image>
            </div>
            <h2 className="text-2xl text-gray-700 my-5 tracking-tighter dark:text-white">{item.title}</h2>
            </Link>
        ))}
        
      </div>
    </div>
  );
}
