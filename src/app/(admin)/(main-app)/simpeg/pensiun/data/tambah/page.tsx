"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import PensiunStateForm from "./PensiunStateForm";
import PensiunStateStatusUpdate from "./PensiunStateStatusUpdate";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import SpinerLoading from "@/components/loading/spiner";

function TambahPensiunContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'tambah' | 'updateStatus'>('tambah');
    const [selectedStateId, setSelectedStateId] = useState<string>('');

    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        const modeFromUrl = searchParams.get('mode');
        if (idFromUrl) {
            setSelectedStateId(idFromUrl);
            if (modeFromUrl === 'status') {
                setActiveTab('updateStatus');
            } else {
                setActiveTab('tambah');
            }
        }
    }, [searchParams]);

    const handleSuccess = () => {
        router.push('/simpeg/pensiun/data');
    };

    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Tambah/Update Data Pensiun" />
            </div>

            {/* Header dengan tombol kembali */}
            <div className="col-span-12 mb-4">
                <Link
                    href="/simpeg/pensiun/data"
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <BsArrowLeft className="w-5 h-5" />
                    <span>Kembali</span>
                </Link>
            </div>

            {/* Tab Navigation */}
            <div className="col-span-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('tambah')}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${
                            activeTab === 'tambah'
                                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        {selectedStateId ? 'Edit State' : 'Tambah State Baru'}
                    </button>
                    <button
                        onClick={() => setActiveTab('updateStatus')}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${
                            activeTab === 'updateStatus'
                                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        Update Status
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="col-span-12">
                {activeTab === 'tambah' && (
                    <PensiunStateForm
                        stateId={selectedStateId || undefined}
                        onSuccess={handleSuccess}
                        onCancel={() => router.push('/simpeg/pensiun/data')}
                    />
                )}
                {activeTab === 'updateStatus' && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ID State Pensiun
                            </label>
                            <input
                                type="text"
                                value={selectedStateId}
                                onChange={(e) => setSelectedStateId(e.target.value)}
                                placeholder="Masukkan ID State Pensiun"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        {selectedStateId && (
                            <PensiunStateStatusUpdate
                                stateId={selectedStateId}
                                onSuccess={() => {
                                    alert('Status berhasil diupdate!');
                                    setSelectedStateId('');
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TambahPensiunPage() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 flex items-center justify-center min-h-[400px]">
                    <SpinerLoading title="Memuat halaman..." />
                </div>
            </div>
        }>
            <TambahPensiunContent />
        </Suspense>
    );
}

