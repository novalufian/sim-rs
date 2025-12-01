"use client";
import React, { useState } from "react";
import { useUpdatePensiunStateStatus, useGetPensiunStateDetail } from "@/hooks/fetch/pensiun/usePensiunState";

interface PensiunStateStatusUpdateProps {
    stateId: string;
    onSuccess?: () => void;
}

export default function PensiunStateStatusUpdate({ stateId, onSuccess }: PensiunStateStatusUpdateProps) {
    const [newStatus, setNewStatus] = useState('');
    const { data: stateData } = useGetPensiunStateDetail(stateId, !!stateId);
    const updateStatusMutation = useUpdatePensiunStateStatus();

    React.useEffect(() => {
        if (stateData?.data?.status) {
            setNewStatus(stateData.data.status);
        }
    }, [stateData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStatus && newStatus !== stateData?.data?.status) {
            updateStatusMutation.mutate(
                { id: stateId, status: newStatus },
                {
                    onSuccess: () => {
                        onSuccess?.();
                    },
                }
            );
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Update Status State Pensiun</h2>

            {stateData?.data && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pegawai:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                        {stateData.data.pegawai_nama || 'N/A'} ({stateData.data.pegawai_nip || 'NIP N/A'})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Status Saat Ini:</p>
                    <p className="font-medium text-gray-900 dark:text-white">{stateData.data.status || '-'}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status Baru <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Pilih Status</option>
                        <option value="AKTIF">Aktif</option>
                        <option value="PENSIUN">Pensiun</option>
                        <option value="NON_AKTIF">Non Aktif</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={updateStatusMutation.isPending || !newStatus || newStatus === stateData?.data?.status}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {updateStatusMutation.isPending ? 'Mengupdate...' : 'Update Status'}
                </button>
            </form>
        </div>
    );
}

