"use client";
import React, { useState } from "react";
import PensiunStateList from "./state/PensiunStateList";
import PensiunStateByPegawai from "./state/PensiunStateByPegawai";
import PensiunStateForm from "./state/PensiunStateForm";
import PensiunStateStatusUpdate from "./state/PensiunStateStatusUpdate";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";

export default function SuperAdminPage() {
    const [activeTab, setActiveTab] = useState<'list' | 'byPegawai' | 'create' | 'updateStatus'>('list');
    const [selectedStateId, setSelectedStateId] = useState<string>('');

    return (
        <div className="container mx-auto p-4">
            <PathBreadcrumb defaultTitle="Super Admin - State Pensiun" />

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
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
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${
                            activeTab === 'create'
                                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        Tambah State Baru
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
            <div>
                {activeTab === 'list' && <PensiunStateList />}
                {activeTab === 'byPegawai' && <PensiunStateByPegawai />}
                {activeTab === 'create' && (
                    <PensiunStateForm
                        onSuccess={() => {
                            alert('State pensiun berhasil ditambahkan!');
                            setActiveTab('list');
                        }}
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

