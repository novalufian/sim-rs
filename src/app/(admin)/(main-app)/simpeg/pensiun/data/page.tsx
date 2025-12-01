"use client";
import React, { useState } from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import PensiunStateList from "./PensiunStateList";
import PensiunStateByPegawai from "./PensiunStateByPegawai";
import Link from "next/link";
import { BsArrowLeft, BsPlusCircle } from "react-icons/bs";

export default function DataPensiunPage() {
    const [activeTab, setActiveTab] = useState<'list' | 'byPegawai'>('list');

    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Kelola Data Pensiun" />
                </div>

            {/* Header dengan tombol kembali dan tambah */}
            <div className="col-span-12 flex justify-between items-center mb-4">
                <Link
                    href="/simpeg/pensiun"
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <BsArrowLeft className="w-5 h-5" />
                    <span>Kembali</span>
                        </Link>
                <Link
                    href="/simpeg/pensiun/data/tambah"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <BsPlusCircle className="w-5 h-5" />
                    <span>Tambah State Baru</span>
                </Link>
                    </div>
                    
            {/* Tab Navigation */}
            <div className="col-span-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${
                            activeTab === 'list'
                                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        Daftar State
                    </button>
                    <button
                        onClick={() => setActiveTab('byPegawai')}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${
                            activeTab === 'byPegawai'
                                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        Cari Berdasarkan Pegawai
                    </button>
                </div>
                    </div>

            {/* Content */}
            <div className="col-span-12">
                {activeTab === 'list' && <PensiunStateList />}
                {activeTab === 'byPegawai' && <PensiunStateByPegawai />}
            </div>
        </div>
    );
}
