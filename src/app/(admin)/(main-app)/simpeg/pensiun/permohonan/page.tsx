"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWhoami } from '@/hooks/fetch/useWhoami';
import { useCreatePermohonanPensiun, PermohonanPensiunInput } from '@/hooks/fetch/pensiun/usePensiunPermohonan';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

// Schema validasi
const permohonanPensiunSchema = z.object({
    jenis_pensiun: z.string().min(1, "Jenis pensiun wajib dipilih"),
    tanggal_pengajuan: z.string().optional(),
    tanggal_pensiun: z.string().min(1, "Tanggal pensiun wajib diisi"),
    alasan_pensiun: z.string().min(10, "Alasan pensiun minimal 10 karakter"),
});

type PermohonanPensiunFormData = z.infer<typeof permohonanPensiunSchema>;

// Options untuk jenis pensiun
const jenisPensiunOptions = [
    { value: 'PENSIUN_USIA', label: 'Pensiun Usia' },
    { value: 'PENSIUN_JABATAN', label: 'Pensiun Jabatan' },
    { value: 'PENSIUN_SAKIT', label: 'Pensiun Sakit' },
    { value: 'PENSIUN_CACAT', label: 'Pensiun Cacat' },
    { value: 'PENSIUN_ATAS_PERMINTAAN_SENDIRI', label: 'Pensiun Atas Permintaan Sendiri' },
];

export default function PermohonanPensiunPage() {
    const router = useRouter();
    const { data: whoamiData, isLoading: isLoadingWhoami } = useWhoami();
    const createMutation = useCreatePermohonanPensiun();

    const userData = whoamiData?.data;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PermohonanPensiunFormData>({
        resolver: zodResolver(permohonanPensiunSchema),
        defaultValues: {
            jenis_pensiun: '',
            tanggal_pengajuan: new Date().toISOString().split('T')[0],
            tanggal_pensiun: '',
            alasan_pensiun: '',
        },
    });

    const onSubmit = async (data: PermohonanPensiunFormData) => {
        if (!userData?.id_pegawai) {
            toast.error('Data pegawai tidak ditemukan. Silakan login ulang.');
            return;
        }

        try {
            const formData: PermohonanPensiunInput = {
                id_pegawai: userData.id_pegawai,
                jenis_pensiun: data.jenis_pensiun,
                tanggal_pengajuan: data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan) : new Date(),
                tanggal_pensiun: data.tanggal_pensiun ? new Date(data.tanggal_pensiun) : undefined,
                alasan_pensiun: data.alasan_pensiun,
            };

            await createMutation.mutateAsync(formData);
            reset();
            // Redirect setelah berhasil
            router.push('/simpeg/pensiun');
        } catch (error) {
            // Error sudah dihandle di hook
            console.error('Error submitting form:', error);
        }
    };

    if (isLoadingWhoami) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="p-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl">
                ❌ Gagal memuat data pengguna. Silakan login kembali.
            </div>
        );
    }

    const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    const errorClass = "text-red-500 text-sm mt-1";

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <PathBreadcrumb defaultTitle="Permohonan Pensiun" />
            </div>

            <div className="mb-4">
                <Link 
                    href="/simpeg/pensiun"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    <IoArrowBack className="mr-2" />
                    Kembali
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Form Permohonan Pensiun
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Informasi Pegawai */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiFileText className="mr-2" />
                            Informasi Pegawai
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nama Pegawai</label>
                                <input
                                    type="text"
                                    value={userData.nama || '-'}
                                    disabled
                                    className={`${inputClass} bg-gray-100 dark:bg-gray-800 cursor-not-allowed`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>NIP</label>
                                <input
                                    type="text"
                                    value={userData.nip || '-'}
                                    disabled
                                    className={`${inputClass} bg-gray-100 dark:bg-gray-800 cursor-not-allowed`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Jenis Pensiun */}
                    <div>
                        <label className={labelClass}>
                            Jenis Pensiun <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('jenis_pensiun')}
                            className={inputClass}
                        >
                            <option value="">Pilih Jenis Pensiun</option>
                            {jenisPensiunOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.jenis_pensiun && (
                            <p className={errorClass}>{errors.jenis_pensiun.message}</p>
                        )}
                    </div>

                    {/* Tanggal Pengajuan */}
                    <div>
                        <label className={labelClass}>
                            <FiCalendar className="inline mr-2" />
                            Tanggal Pengajuan
                        </label>
                        <input
                            type="date"
                            {...register('tanggal_pengajuan')}
                            className={inputClass}
                        />
                        {errors.tanggal_pengajuan && (
                            <p className={errorClass}>{errors.tanggal_pengajuan.message}</p>
                        )}
                    </div>

                    {/* Tanggal Pensiun */}
                    <div>
                        <label className={labelClass}>
                            <FiCalendar className="inline mr-2" />
                            Tanggal Pensiun <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            {...register('tanggal_pensiun')}
                            className={inputClass}
                        />
                        {errors.tanggal_pensiun && (
                            <p className={errorClass}>{errors.tanggal_pensiun.message}</p>
                        )}
                    </div>

                    {/* Alasan Pensiun */}
                    <div>
                        <label className={labelClass}>
                            <FiFileText className="inline mr-2" />
                            Alasan Pensiun <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register('alasan_pensiun')}
                            rows={5}
                            className={inputClass}
                            placeholder="Masukkan alasan pensiun..."
                        />
                        {errors.alasan_pensiun && (
                            <p className={errorClass}>{errors.alasan_pensiun.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/simpeg/pensiun"
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {createMutation.isPending ? 'Mengirim...' : 'Ajukan Permohonan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

