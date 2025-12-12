"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import moment from 'moment';
import { useWhoami } from '@/hooks/fetch/useWhoami';
import { useCreatePermohonanPensiun, PermohonanPensiunInput } from '@/hooks/fetch/pensiun/usePensiunPermohonan';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiCalendar, FiFileText, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

// Schema validasi
const permohonanPensiunSchema = z.object({
    jenis_pensiun: z.string().min(1, "Jenis pensiun wajib dipilih"),
    tanggal_pengajuan: z.string().optional(),
    tanggal_pensiun: z.string().min(1, "Tanggal pensiun wajib diisi"),
    alasan_pensiun: z.string().min(10, "Alasan pensiun minimal 10 karakter"),
}).refine((data) => {
    if (data.tanggal_pengajuan && data.tanggal_pensiun) {
        const pengajuan = moment(data.tanggal_pengajuan);
        const pensiun = moment(data.tanggal_pensiun);
        return pensiun.isSameOrAfter(pengajuan);
    }
    return true;
}, {
    message: "Tanggal pensiun harus setelah atau sama dengan tanggal pengajuan",
    path: ["tanggal_pensiun"],
});

// Helper function untuk cek apakah tanggal sebelum hari ini
const isBeforeToday = (day: moment.Moment) => {
    return day.isBefore(moment(), 'day');
};

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
        watch,
        setValue,
    } = useForm<PermohonanPensiunFormData>({
        resolver: zodResolver(permohonanPensiunSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            jenis_pensiun: '',
            tanggal_pengajuan: new Date().toISOString().split('T')[0],
            tanggal_pensiun: '',
            alasan_pensiun: '',
        },
    });

    // Watch semua field untuk validasi form
    const jenisPensiun = watch('jenis_pensiun');
    const tanggalPengajuan = watch('tanggal_pengajuan');
    const tanggalPensiun = watch('tanggal_pensiun');
    const alasanPensiun = watch('alasan_pensiun');

    // State untuk date picker
    const [focusedPengajuan, setFocusedPengajuan] = useState<boolean>(false);
    const [focusedPensiun, setFocusedPensiun] = useState<boolean>(false);
    
    // Gunakan useMemo untuk mengkonversi string tanggal form menjadi objek moment
    const pengajuanDate = useMemo(() => tanggalPengajuan ? moment(tanggalPengajuan) : null, [tanggalPengajuan]);
    const pensiunDate = useMemo(() => tanggalPensiun ? moment(tanggalPensiun) : null, [tanggalPensiun]);

    // Handle tanggal pengajuan change
    const handlePengajuanDateChange = (date: moment.Moment | null) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setValue('tanggal_pengajuan', formattedDate, { shouldValidate: true });
            
            // Reset tanggal pensiun jika tanggal pengajuan yang baru lebih lambat dari tanggal pensiun yang sudah ada
            if (pensiunDate && date.isAfter(pensiunDate, 'day')) {
                setValue('tanggal_pensiun', '', { shouldValidate: true });
            }
        } else {
            setValue('tanggal_pengajuan', new Date().toISOString().split('T')[0], { shouldValidate: true });
        }
    };

    // Handle tanggal pensiun change
    const handlePensiunDateChange = (date: moment.Moment | null) => {
        if (date) {
            setValue('tanggal_pensiun', date.format('YYYY-MM-DD'), { shouldValidate: true });
        } else {
            setValue('tanggal_pensiun', '', { shouldValidate: true });
        }
    };

    // Check apakah form sudah terisi lengkap
    const isFormComplete = 
        jenisPensiun &&
        jenisPensiun.length > 0 &&
        tanggalPensiun &&
        tanggalPensiun.length > 0 &&
        alasanPensiun &&
        alasanPensiun.length >= 10;

    // Button disabled jika: loading atau form belum lengkap
    const isButtonDisabled = 
        isLoadingWhoami || 
        createMutation.isPending || 
        !isFormComplete;

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
            toast.success('Permohonan pensiun berhasil diajukan!');
            reset();
            // Redirect setelah berhasil
            router.push('/simpeg/pensiun/data');
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

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <PathBreadcrumb defaultTitle="Permohonan Pensiun" />
            </div>

            <div className="mb-4">
                <Link 
                    href="/simpeg/pensiun/data"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    <IoArrowBack className="mr-2" />
                    Kembali
                </Link>
            </div>

            <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
                <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">📝 Form Pengajuan Pensiun</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Silakan isi form di bawah ini untuk mengajukan pensiun</p>

                    {/* Informasi Data Pribadi */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <FiUser className="text-blue-600 dark:text-blue-400" />
                            Informasi Data Pribadi
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <FiUser className="text-gray-400 dark:text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{userData.nama || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiMail className="text-gray-400 dark:text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Username/Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{userData.username || '-'}</p>
                                </div>
                            </div>
                            {userData.nip && (
                                <div className="flex items-center gap-3">
                                    <FiFileText className="text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">NIP</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{userData.nip}</p>
                                    </div>
                                </div>
                            )}
                            {userData.role && (
                                <div className="flex items-center gap-3">
                                    <FiUser className="text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{userData.role}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informasi Pensiun */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FiInfo className="text-amber-600 dark:text-amber-400" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informasi Pensiun</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Permohonan pensiun akan diproses oleh bagian kepegawaian. Pastikan data yang Anda isi sudah benar dan lengkap.
                        </p>
                    </div>

                    {/* Form Pengajuan Pensiun */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Jenis Pensiun */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiFileText className="inline mr-2" />
                                Jenis Pensiun <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('jenis_pensiun')}
                                className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.jenis_pensiun ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            >
                                <option value="">Pilih Jenis Pensiun</option>
                                {jenisPensiunOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.jenis_pensiun && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jenis_pensiun.message}</p>
                            )}
                        </div>

                        {/* Tanggal - Single Date Pickers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tanggal Pengajuan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <FiCalendar className="inline mr-2" />
                                    Tanggal Pengajuan
                                </label>
                                {/* Tambahkan z-index yang lebih tinggi di sini */}
                                <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                                    <SingleDatePicker
                                        date={pengajuanDate} // Menggunakan state moment yang disinkronkan dengan watch
                                        onDateChange={handlePengajuanDateChange} // Menggunakan handler yang update form value
                                        focused={focusedPengajuan}
                                        onFocusChange={({ focused }) => setFocusedPengajuan(focused || false)}
                                        id="tanggal_pengajuan"
                                        displayFormat="YYYY-MM-DD"
                                        isOutsideRange={isBeforeToday}
                                        placeholder="Pilih tanggal pengajuan"
                                        numberOfMonths={1}
                                        // Prop untuk menyembunyikan input asli
                                        customInputIcon={null}
                                        showClearDate={true}
                                    />
                                </div>
                                {errors.tanggal_pengajuan && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_pengajuan.message}</p>
                                )}
                            </div>

                            {/* Tanggal Pensiun */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <FiCalendar className="inline mr-2" />
                                    Tanggal Pensiun <span className="text-red-500">*</span>
                                </label>
                                {/* Tambahkan z-index yang lebih tinggi di sini */}
                                <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                                    <SingleDatePicker
                                        date={pensiunDate} // Menggunakan state moment yang disinkronkan dengan watch
                                        onDateChange={handlePensiunDateChange} // Menggunakan handler yang update form value
                                        focused={focusedPensiun}
                                        onFocusChange={({ focused }) => setFocusedPensiun(focused || false)}
                                        id="tanggal_pensiun"
                                        displayFormat="YYYY-MM-DD"
                                        isOutsideRange={(day) => {
                                            // Tanggal pensiun tidak boleh sebelum tanggal pengajuan
                                            if (pengajuanDate) {
                                                return day.isBefore(pengajuanDate, 'day');
                                            }
                                            return isBeforeToday(day);
                                        }}
                                        placeholder="Pilih tanggal pensiun"
                                        numberOfMonths={1}
                                        // Prop untuk menyembunyikan input asli
                                        customInputIcon={null}
                                        showClearDate={true}
                                    />
                                </div>
                                {errors.tanggal_pensiun && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_pensiun.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Alasan Pensiun */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiFileText className="inline mr-2" />
                                Alasan Pensiun <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('alasan_pensiun')}
                                rows={6}
                                placeholder="Jelaskan alasan mengapa Anda mengajukan pensiun..."
                                className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.alasan_pensiun ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.alasan_pensiun && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alasan_pensiun.message}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setFocusedPengajuan(false);
                                    setFocusedPensiun(false);
                                    reset();
                                }}
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {createMutation.isPending || isLoadingWhoami ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        {createMutation.isPending ? 'Mengirim...' : 'Memuat...'}
                                    </span>
                                ) : (
                                    'Ajukan Permohonan'
                                )}
                            </button>
                        </div>
                        {/* Gaya global untuk datepicker dipertahankan, namun perhatikan konflik z-index (z-index: 50 pada div pembungkus sudah dinaikkan) */}
                        <style jsx global>{`
                            /* Membatasi selector ke elemen yang spesifik jika memungkinkan */
                            .DateInput div {
                                font-size: 16px !important;
                            }
                            .DateInput_input {
                                font-size: 16px;
                                font-weight: 400;
                                color: inherit;
                                padding: 9px;
                                border: none;
                                text-align: center;
                                background: transparent !important;
                                width: 100%;
                            }
                            .SingleDatePickerInput {
                                border: none;
                                color: inherit;
                                background: transparent;
                                width: 100%;
                            }
                            .SingleDatePicker {
                                color: inherit;
                                width: 100%;
                            }
                            .SingleDatePicker_picker {
                                /* Perlu z-index tinggi agar kalender muncul di atas elemen lain */
                                z-index: 9999 !important;
                                border-radius: 20px;
                                overflow: hidden;
                                border: solid 1px lightgray;
                                backdrop-filter: blur(10px);
                                background: #ffffff80;
                            }
                            .dark .SingleDatePicker_picker {
                                border: solid 1px rgb(55 65 81);
                                background: rgba(17, 24, 39, 0.8);
                            }
                            .DateInput {
                                background: transparent;
                                width: 100%;
                            }
                            .CalendarDay {
                                color: inherit;
                            }
                            .CalendarDay__default {
                                color: inherit;
                            }
                            .CalendarDay__selected {
                                background: #1e40af;
                                color: white;
                            }
                            .dark .CalendarDay__selected {
                                background: #1d4ed8;
                            }
                            .CalendarDay__blocked_calendar {
                                background: #f3f4f6;
                                color: #9ca3af;
                                cursor: not-allowed;
                            }
                            .dark .CalendarDay__blocked_calendar {
                                background: #374151;
                                color: #6b7280;
                            }
                            .DayPicker_weekHeader {
                                color: inherit;
                            }
                            .DayPicker_weekHeader_li {
                                color: inherit;
                            }
                            .DayPickerNavigation_button {
                                color: inherit;
                            }
                            .DayPickerNavigation_button__default {
                                color: inherit;
                            }
                            .DayPicker__withBorder {
                                box-shadow: none;
                            }
                        `}</style>
                    </form>
                </div>
            </div>
        </div>
    );
}

