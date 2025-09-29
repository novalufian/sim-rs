import React from "react";
import { Employee } from "./employee";
import { IoFemaleSharp, IoMaleSharp } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRightCircle } from "react-icons/fi";

interface SelectedPegawaiProps {
    employee: Employee | null;
}

const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "";
    try {
        return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        }).format(new Date(dateStr));
    } catch {
        return dateStr; // fallback kalau invalid
    }
};

const statusPekerjaan = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-sm font-medium inline-block";

    switch (status.toLowerCase()) {
        case "pns":
        return (
            <span className={`${baseClasses} bg-green-500 text-white`}>
            {status}
            </span>
        );
        case "kontrak":
        return (
            <span className={`${baseClasses} bg-orange-500 text-white`}>
            {status}
            </span>
        );
        case "honorer":
        return (
            <span className={`${baseClasses} bg-yellow-400 text-black`}>
            {status}
            </span>
        );
        default:
        return (
            <span className={`${baseClasses} bg-gray-300 text-gray-800`}>
            {status}
            </span>
        );
    }
};

export default function SelectedPegawai({ employee }: SelectedPegawaiProps) {
    if(employee === null) return <div>Loading...</div>;
    return (
        <div className=" left-0 w-full  dark:bg-gray-90 flex flex-col justify-center items-center relative">
            <div className="w-[600px] bg-white dark:bg-gray-900 rounded-2xl px-10 pb-10">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 justify-between mb-3">
                        <Image src={employee?.avatar_url || ""} alt="avatar" width={100} height={100} className="rounded-lg col-span-1 w-10/12 object-cover" />

                        <div className="grid grid-cols-1 mb-3 justify-start">
                            <div className="flex flex-col col-span-1">
                                <h2 className="text-xl font-bold mb-1">Nama</h2>
                                <p className="text-gray-500 dark:text-gray-400">{employee?.nama}</p>
                            </div>
                            <div className="flex flex-col col-span-1">
                                <h2 className="text-xl font-bold mb-1">NIP</h2>
                                <p className="text-gray-500 dark:text-gray-400">{employee?.nip}</p>
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-1">Status Pekerjaan</h2>
                                <p className="text-gray-500 dark:text-gray-400">{statusPekerjaan(employee?.status_pekerjaan || "")}</p>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-1">Tempat, Tanggal Lahir</h2>
                                <p className="text-gray-500 dark:text-gray-400">{employee?.tempat_lahir}, {formatDate(employee?.tanggal_lahir)}</p>
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-1">Umur</h2>
                                <p className="text-gray-500 dark:text-gray-400">{employee?.umur}</p>
                            </div>
                            
                        </div>

                    </div>
                    
                    
                    {/* Alamat */}
                    <div className="grid grid-cols-2 justify-between mb-3">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold mb-1">Alamat KTP</h2>
                            <p className="text-gray-500 dark:text-gray-400">{employee?.alamat_ktp}</p>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold mb-1">Alamat Domisili</h2>
                            <p className="text-gray-500 dark:text-gray-400">{employee?.alamat_domisili}</p>
                        </div>
                    </div>

                    {/* Umur */}
                    <div className="grid grid-cols-2 justify-between items-center mb-3">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold mb-1">Jenis Kelamin</h2>
                            <p className="text-gray-500 dark:text-gray-400 flex flex-row items-center">{(employee?.jenis_kelamin?.toLowerCase() == "perempuan") ? <IoFemaleSharp className="h-4 w-4 text-pink-500 mr-2"/> : <IoMaleSharp className="h-4 w-4 text-blue-500 mr-2"/>} {employee?.jenis_kelamin}</p>
                        </div>

                        <Link href={`/simpeg/duk/pegawai/${employee?.id}`} className="flex items-center justify-center text-white transition-colors bg-blue-700 border border-blue-700 rounded-lg hover:text-blue-700 h-11 w-auto hover:border-blue-700 hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-5 px-4">Lihat Detail  
                        <FiArrowRightCircle className="w-6 h-6 ml-4"/>
                        </Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
}