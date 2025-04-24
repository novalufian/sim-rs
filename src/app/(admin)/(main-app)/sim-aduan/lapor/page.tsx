"use client"
import ComponentCard from '@/components/common/ComponentCard'
import PathBreadcrumb from '@/components/common/PathBreadcrumb'
import LaporForm from '@/components/form/(main-app)/lapor/page'
import { TbChecks } from "react-icons/tb";
import { IoCloseCircle } from "react-icons/io5";
import React from 'react'
const verifiedInput = {
    success : {
        icon : <TbChecks className='text-green-600 ml-2'/>,
        text : "text-green-600 mb-3",
        label : "sudah diisi"
    },
    error : {
        icon : <IoCloseCircle className='text-red-600'/>,
        text : "text-red-600 mb-3",
        label : ""
    },
    default : {
        icon : "",
        text : "text-gray-600 mb-3",
        label : "belum diisi"
    }
}

function page() {

    return (
        <div className='w-full grid grid-cols-12 gap-6 items-start'>
            <div className="col-span-12">
            <PathBreadcrumb />
            </div>

            <LaporForm />
            
            <ComponentCard title='Check list inputan :'  className="col-span-4 bg-white sticky top-20 h-fit">
                <ul className='list-decimal w-9/12 m-auto gap-1 text-gray-700'>
                    <li className={verifiedInput["success"].text}> 
                        <p className='flex items-center'>
                        Klasifikasi pelaporan {verifiedInput["success"].label} {verifiedInput["success"].icon}</p>
                    </li>
                    <li className={verifiedInput["error"].text}>
                        <p className=''>Judul : gunakan tata bahasa yang singkat sesuai pokok masalah 
                        {verifiedInput["error"].label}
                        {verifiedInput["error"].icon}
                        </p>
                    </li>
                    <li className={verifiedInput["default"].text}>
                        <p className=''>Bidang yang dituju {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>
                    <li className={verifiedInput["default"].text}>
                        <p className=''>Pilih sumber media 
                        {verifiedInput["default"].label} {verifiedInput["default"].icon}</p>
                    </li>
                    <li className={verifiedInput["default"].text}>
                        <p className=''>Tanggal pelaporan {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>
                    <li className={verifiedInput["error"].text}>
                        <p className=''>Isi laporan , jelaskan secara detail kejadian dan keluhan {verifiedInput["error"].label}  {verifiedInput["error"].icon}</p>
                    </li>

                    <li className={verifiedInput["success"].text}>
                        <p className=''>Nik , isi sesuai dengan KTP {verifiedInput["success"].label}  {verifiedInput["success"].icon}</p>
                    </li>

                    <li className={verifiedInput["default"].text}>
                        <p className=''>Nama lengkap , isi sesuai dengan KTP {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>

                    <li className={verifiedInput["default"].text}>
                        <p className=''>Alamat lengkap , isi sesuai dengan KTP {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>

                    <li className={verifiedInput["default"].text}>
                        <p className=''>Email , isi jika mempunyai email  {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>

                    <li className={verifiedInput["default"].text}>
                        <p className=''>No. telp / WA , mohon diisi untuk menerima progress aduan  {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>

                    <li className={verifiedInput["default"].text}>
                        <p className=''>File aduan, boleh dikosongkan  {verifiedInput["default"].label}  {verifiedInput["default"].icon}</p>
                    </li>

                </ul>
            </ComponentCard>
        </div>
    )
}

export default page