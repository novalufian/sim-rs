"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { RootState } from '@/libs/store';
import { useCreatePermohonanBelajar } from '@/hooks/fetch/belajar/useBelajarPermohonan';
import { permohonanBelajarSchema, PermohonanBelajarFormData } from './permohonanBelajarSchema';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

const jenisPermohonanOptions = [
    { value: 'TUGAS_BELAJAR', label: 'Tugas Belajar' },
    { value: 'IZIN_BELAJAR', label: 'Izin Belajar' },
];

const biayaDitanggungOptions = [
    { value: 'INSTANSI', label: 'Instansi' },
    { value: 'MANDIRI', label: 'Mandiri' },
    { value: 'CAMPURAN', label: 'Campuran' },
];

export default function PermohonanIjinBelajarPage() {
    const router = useRouter();
    const user = useAppSelector((state: RootState) => state.auth.user);
    const createMutation = useCreatePermohonanBelajar();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PermohonanBelajarFormData>({
        resolver: zodResolver(permohonanBelajarSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            id_pegawai: user?.id_pegawai || '',
            jenis_permohonan: undefined,
            id_program_studi: '',
            id_institusi_pendidikan: '',
            gelar_yang_diperoleh: '',
            tanggal_mulai_belajar: '',
            tanggal_selesai_belajar: '',
            lama_studi_bulan: undefined,
            biaya_ditanggung: undefined,
            status_pegawai_selama_belajar: '',
            kewajiban_setelah_belajar: '',
        },
    });

    // Watch tanggal untuk auto calculate lama_studi_bulan
    const tanggalMulai = watch("tanggal_mulai_belajar");
    const tanggalSelesai = watch("tanggal_selesai_belajar");

    useEffect(() => {
        if (tanggalMulai && tanggalSelesai) {
            const start = new Date(tanggalMulai);
            const end = new Date(tanggalSelesai);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
            
            if (diffMonths > 0) {
                setValue("lama_studi_bulan", diffMonths);
            }
        }
    }, [tanggalMulai, tanggalSelesai, setValue]);

    const onSubmit: SubmitHandler<PermohonanBelajarFormData> = (data) => {
        createMutation.mutate(data as any, {
            onSuccess: () => {
                router.push('/simpeg/ijin-belajar/permohonan');
            },
        });
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    const errorClass = "text-red-500 text-sm mt-1";

    if (!user?.id_pegawai) {
        return (
            <div className="container mx-auto p-4">
                <PathBreadcrumb defaultTitle="Permohonan Ijin Belajar" />
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-4">
                    <p className="text-red-500">Error: Data pegawai tidak ditemukan. Silakan login ulang.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <PathBreadcrumb defaultTitle="Permohonan Ijin Belajar" />
            </div>

            <div className="mb-4">
                <Link 
                    href="/simpeg/ijin-belajar/permohonan"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    <IoArrowBack className="mr-2" />
                    Kembali
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-10/12 m-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Form Permohonan Ijin Belajar
                </h1>

                {/* Informasi Pegawai */}
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Informasi Pegawai
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Foto Pegawai */}
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 shadow-md">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_SERVER_IP || process.env.SERVER_IP || ''}${user.avatar}`}
                                        alt={user.nama || 'Foto Pegawai'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/user/owner.jpg';
                                            target.onerror = null; // Prevent infinite loop
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                                        <span className="text-white text-5xl md:text-6xl font-bold">
                                            {user.nama?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Data Pegawai */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Nama Pegawai
                                </label>
                                <p className="text-gray-900 dark:text-white font-semibold text-base">
                                    {user.nama || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    NIP
                                </label>
                                <p className="text-gray-900 dark:text-white text-base">
                                    {user.nip || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Email
                                </label>
                                <p className="text-gray-900 dark:text-white text-base">
                                    {user.email || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Jenis Kelamin
                                </label>
                                <p className="text-gray-900 dark:text-white text-base">
                                    {user.jenis_kelamin || '-'}
                                </p>
                            </div>
                            {user.unit_kerja && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Unit Kerja
                                    </label>
                                    <p className="text-gray-900 dark:text-white text-base">
                                        {user.unit_kerja}
                                    </p>
                                </div>
                            )}
                            {user.struktural_nama && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Jabatan Struktural
                                    </label>
                                    <p className="text-gray-900 dark:text-white text-base">
                                        {user.struktural_nama}
                                    </p>
                                </div>
                            )}
                            {user.fungsional_nama && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Jabatan Fungsional
                                    </label>
                                    <p className="text-gray-900 dark:text-white text-base">
                                        {user.fungsional_nama}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Row 1: Jenis Permohonan - Full Width */}
                    <div>
                        <label className={labelClass}>
                            Jenis Permohonan <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("jenis_permohonan")}
                            className={inputClass}
                        >
                            <option value="">Pilih Jenis Permohonan</option>
                            {jenisPermohonanOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.jenis_permohonan && <p className={errorClass}>{errors.jenis_permohonan.message}</p>}
                    </div>

                    {/* Row 2: Program Studi & Institusi Pendidikan - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Program Studi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("id_program_studi")}
                                className={inputClass}
                                placeholder="Masukkan ID Program Studi"
                            />
                            {errors.id_program_studi && <p className={errorClass}>{errors.id_program_studi.message}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                * Untuk sementara menggunakan ID, akan diganti dengan dropdown setelah API tersedia
                            </p>
                        </div>

                        <div>
                            <label className={labelClass}>
                                Institusi Pendidikan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("id_institusi_pendidikan")}
                                className={inputClass}
                                placeholder="Masukkan ID Institusi Pendidikan"
                            />
                            {errors.id_institusi_pendidikan && <p className={errorClass}>{errors.id_institusi_pendidikan.message}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                * Untuk sementara menggunakan ID, akan diganti dengan dropdown setelah API tersedia
                            </p>
                        </div>
                    </div>

                    {/* Row 3: Gelar yang Diperoleh & Status Pegawai Selama Belajar - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Gelar yang Diperoleh
                            </label>
                            <input
                                type="text"
                                {...register("gelar_yang_diperoleh")}
                                className={inputClass}
                                placeholder="Contoh: S.E., M.M., Dr."
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Status Pegawai Selama Belajar
                            </label>
                            <input
                                type="text"
                                {...register("status_pegawai_selama_belajar")}
                                className={inputClass}
                                placeholder="Contoh: Tetap Aktif, Non-Aktif"
                            />
                        </div>
                    </div>

                    {/* Row 4: Tanggal Mulai & Tanggal Selesai - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Tanggal Mulai Belajar <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("tanggal_mulai_belajar")}
                                className={inputClass}
                            />
                            {errors.tanggal_mulai_belajar && <p className={errorClass}>{errors.tanggal_mulai_belajar.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Tanggal Selesai Belajar <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("tanggal_selesai_belajar")}
                                className={inputClass}
                            />
                            {errors.tanggal_selesai_belajar && <p className={errorClass}>{errors.tanggal_selesai_belajar.message}</p>}
                        </div>
                    </div>

                    {/* Row 5: Lama Studi & Biaya Ditanggung - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Lama Studi (Bulan)
                            </label>
                            <input
                                type="number"
                                {...register("lama_studi_bulan", { valueAsNumber: true })}
                                className={inputClass}
                                placeholder="Akan dihitung otomatis dari tanggal"
                                min="1"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                * Akan dihitung otomatis berdasarkan tanggal mulai dan selesai
                            </p>
                        </div>

                        <div>
                            <label className={labelClass}>
                                Biaya Ditanggung <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("biaya_ditanggung")}
                                className={inputClass}
                            >
                                <option value="">Pilih Biaya Ditanggung</option>
                                {biayaDitanggungOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.biaya_ditanggung && <p className={errorClass}>{errors.biaya_ditanggung.message}</p>}
                        </div>
                    </div>

                    {/* Row 6: Kewajiban Setelah Belajar - Full Width */}
                    <div>
                        <label className={labelClass}>
                            Kewajiban Setelah Belajar
                        </label>
                        <textarea
                            {...register("kewajiban_setelah_belajar")}
                            className={inputClass}
                            rows={3}
                            placeholder="Contoh: Mengabdi 2x masa belajar, Presentasi hasil"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={createMutation.isPending || isSubmitting}
                            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                                createMutation.isPending || isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {createMutation.isPending || isSubmitting ? 'Mengirim...' : 'Ajukan Permohonan'}
                        </button>
                        <Link
                            href="/simpeg/ijin-belajar/permohonan"
                            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
