"use client";
import React, { useState, useEffect } from "react";
import { useCreatePensiunState, useUpdatePensiunState, useGetPensiunStateDetail, PensiunStateInput } from "@/hooks/fetch/pensiun/usePensiunState";

interface PensiunStateFormProps {
    stateId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function PensiunStateForm({ stateId, onSuccess, onCancel }: PensiunStateFormProps) {
    const isEditMode = !!stateId;
    const [formData, setFormData] = useState<PensiunStateInput>({
        id_pegawai: '',
        status: '',
        tanggal_efektif: '',
        catatan: '',
    });

    const { data: existingState } = useGetPensiunStateDetail(stateId || '', isEditMode);
    const createMutation = useCreatePensiunState();
    const updateMutation = useUpdatePensiunState();

    useEffect(() => {
        if (isEditMode && existingState?.data) {
            setFormData({
                id_pegawai: existingState.data.id_pegawai,
                status: existingState.data.status,
                tanggal_efektif: existingState.data.tanggal_efektif ? new Date(existingState.data.tanggal_efektif).toISOString().split('T')[0] : '',
                catatan: existingState.data.catatan || '',
            });
        }
    }, [isEditMode, existingState]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditMode && stateId) {
            updateMutation.mutate(
                { id: stateId, formData },
                {
                    onSuccess: () => {
                        onSuccess?.();
                    },
                }
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setFormData({
                        id_pegawai: '',
                        status: '',
                        tanggal_efektif: '',
                        catatan: '',
                    });
                    onSuccess?.();
                },
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {isEditMode ? 'Edit State Pensiun' : 'Tambah State Pensiun Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ID Pegawai <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="id_pegawai"
                        value={formData.id_pegawai}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Pilih Status</option>
                        <option value="AKTIF">Aktif</option>
                        <option value="PENSIUN">Pensiun</option>
                        <option value="NON_AKTIF">Non Aktif</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Efektif
                    </label>
                    <input
                        type="date"
                        name="tanggal_efektif"
                        value={formData.tanggal_efektif ? (typeof formData.tanggal_efektif === 'string' ? formData.tanggal_efektif : new Date(formData.tanggal_efektif).toISOString().split('T')[0]) : ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catatan
                    </label>
                    <textarea
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Menyimpan...' : isEditMode ? 'Update' : 'Simpan'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

