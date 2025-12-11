"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import moment from 'moment';
import { useWhoami } from '@/hooks/fetch/useWhoami';
import { useCreatePermohonanCuti, PermohonanCutiInput } from '@/hooks/fetch/cuti/useCutiPermohonan';
import { useJatahCutiByPegawaiTahun } from '@/hooks/fetch/cuti/useCutiJatah';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiCalendar, FiFileText, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

// Schema validasi
const permohonanCutiSchema = z.object({
    id_jenis_cuti: z.number().min(1, "Jenis cuti wajib dipilih"),
    tanggal_mulai_cuti: z.string().min(1, "Tanggal mulai cuti wajib diisi"),
    tanggal_selesai_cuti: z.string().min(1, "Tanggal selesai cuti wajib diisi"),
    jumlah_hari: z.number().min(1, "Jumlah hari harus lebih dari 0"),
    alasan_cuti: z.string().min(10, "Alasan cuti minimal 10 karakter"),
    alamat_selama_cuti: z.string().min(5, "Alamat selama cuti wajib diisi"),
    no_hp_selama_cuti: z.string().min(10, "Nomor HP minimal 10 digit"),
}).refine((data) => {
    const start = moment(data.tanggal_mulai_cuti);
    const end = moment(data.tanggal_selesai_cuti);
    return end.isSameOrAfter(start);
}, {
    message: "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
    path: ["tanggal_selesai_cuti"],
});

type PermohonanCutiFormData = z.infer<typeof permohonanCutiSchema>;

// Options untuk jenis cuti (hardcoded, bisa diganti dengan API call jika ada)
const jenisCutiOptions = [
    { id: 1, name: 'Cuti Tahunan' },
    { id: 2, name: 'Cuti Sakit' },
    { id: 3, name: 'Cuti Melahirkan' },
    { id: 4, name: 'Cuti Besar' },
];

export default function PermohonanCutiPage() {
    const router = useRouter();
    const { data: whoamiData, isLoading: isLoadingWhoami } = useWhoami();
    const createMutation = useCreatePermohonanCuti();

    const userData = whoamiData?.data;
    const currentYear = new Date().getFullYear();
    
    // Fetch jatah cuti untuk tahun sekarang
    const { data: jatahCutiData, isLoading: isLoadingJatah } = useJatahCutiByPegawaiTahun(
        userData?.id_pegawai,
        currentYear,
        !!userData?.id_pegawai
    );

    const jatahCuti = jatahCutiData?.data;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<PermohonanCutiFormData>({
        resolver: zodResolver(permohonanCutiSchema),
        defaultValues: {
            id_jenis_cuti: 0,
            tanggal_mulai_cuti: '',
            tanggal_selesai_cuti: '',
            jumlah_hari: 0,
            alasan_cuti: '',
            alamat_selama_cuti: '',
            no_hp_selama_cuti: '',
        },
    });

    // State untuk date range picker
    const [focusedInput, setFocusedInput] = useState<any>(null);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);

    // Watch tanggal untuk auto-calculate jumlah_hari
    const tanggalMulai = watch('tanggal_mulai_cuti');
    const tanggalSelesai = watch('tanggal_selesai_cuti');
    const jumlahHari = watch('jumlah_hari');

    // Sync date range picker dengan form values
    useEffect(() => {
        if (tanggalMulai) {
            setStartDate(moment(tanggalMulai));
        } else {
            setStartDate(null);
        }
        if (tanggalSelesai) {
            setEndDate(moment(tanggalSelesai));
        } else {
            setEndDate(null);
        }
    }, [tanggalMulai, tanggalSelesai]);

    // Handle date range change
    const handleDateRangeChange = ({ startDate: newStartDate, endDate: newEndDate }: any) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        
        if (newStartDate) {
            setValue('tanggal_mulai_cuti', newStartDate.format('YYYY-MM-DD'));
        } else {
            setValue('tanggal_mulai_cuti', '');
        }
        
        if (newEndDate) {
            setValue('tanggal_selesai_cuti', newEndDate.format('YYYY-MM-DD'));
        } else {
            setValue('tanggal_selesai_cuti', '');
        }
    };

    useEffect(() => {
        if (tanggalMulai && tanggalSelesai) {
            const start = moment(tanggalMulai);
            const end = moment(tanggalSelesai);
            if (end.isSameOrAfter(start)) {
                const days = end.diff(start, 'days') + 1; // +1 untuk include hari terakhir
                setValue('jumlah_hari', days);
            } else {
                setValue('jumlah_hari', 0);
            }
        } else {
            setValue('jumlah_hari', 0);
        }
    }, [tanggalMulai, tanggalSelesai, setValue]);

    const onSubmit = async (data: PermohonanCutiFormData) => {
        if (!userData?.id_pegawai) {
            toast.error('Data pegawai tidak ditemukan. Silakan login ulang.');
            return;
        }

        if (jatahCuti && (jatahCuti.sisa_jatah || 0) - data.jumlah_hari < 0) {
            toast.error('Sisa jatah cuti tidak mencukupi untuk jumlah hari yang diajukan.');
            return;
        }

        try {
            const formData: PermohonanCutiInput = {
                id_pegawai: userData.id_pegawai,
                id_jenis_cuti: data.id_jenis_cuti,
                tanggal_mulai_cuti: new Date(data.tanggal_mulai_cuti),
                tanggal_selesai_cuti: new Date(data.tanggal_selesai_cuti),
                jumlah_hari: data.jumlah_hari,
                alasan_cuti: data.alasan_cuti,
                alamat_selama_cuti: data.alamat_selama_cuti,
                no_hp_selama_cuti: data.no_hp_selama_cuti,
                id_jatah_cuti: jatahCuti?.id ?? null,
            };

            await createMutation.mutateAsync(formData);
            reset();
            // Redirect atau refresh setelah berhasil
            router.push('/simpeg/cuti/data');
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
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
                ❌ Gagal memuat data pengguna. Silakan login kembali.
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
            <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">📝 Form Pengajuan Cuti</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Silakan isi form di bawah ini untuk mengajukan cuti</p>

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

                {/* Informasi Jatah Cuti */}
                {isLoadingJatah ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <FiInfo className="text-amber-600 dark:text-amber-400" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informasi Jatah Cuti {currentYear}</h2>
                        </div>
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                ) : jatahCuti ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FiInfo className="text-amber-600 dark:text-amber-400" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informasi Jatah Cuti {currentYear}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jumlah Jatah</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{jatahCuti.jumlah_jatah || 0} hari</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sisa Jatah</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {jatahCuti.sisa_jatah || 0}
                                    </p>
                                    {jumlahHari > 0 && (
                                        <span 
                                            className="text-lg font-semibold text-red-600 dark:text-red-400 animate-pulse relative inline-block"
                                            style={{
                                                textShadow: '0 0 8px rgba(239, 68, 68, 0.6), 0 0 12px rgba(239, 68, 68, 0.4)'
                                            }}
                                        >
                                            - {jumlahHari}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sisa Setelah Pengajuan</p>
                                <p className={`text-2xl font-bold ${
                                    (jatahCuti.sisa_jatah || 0) - (jumlahHari || 0) < 0 
                                        ? 'text-red-600 dark:text-red-400' 
                                        : 'text-gray-900 dark:text-white'
                                }`}>
                                    {Math.max(0, (jatahCuti.sisa_jatah || 0) - (jumlahHari || 0))} hari
                                </p>
                                {jumlahHari > 0 && (jatahCuti.sisa_jatah || 0) - jumlahHari < 0 && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        ⚠️ Jatah cuti tidak mencukupi
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <FiInfo className="text-amber-600 dark:text-amber-400" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informasi Jatah Cuti {currentYear}</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Data jatah cuti belum tersedia untuk tahun {currentYear}</p>
                    </div>
                )}

                {/* Form Pengajuan Cuti */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Jenis Cuti */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Jenis Cuti <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('id_jenis_cuti', { valueAsNumber: true })}
                            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.id_jenis_cuti ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        >
                            <option value={0}>Pilih Jenis Cuti</option>
                            {jenisCutiOptions.map((jenis) => (
                                <option key={jenis.id} value={jenis.id}>
                                    {jenis.name}
                                </option>
                            ))}
                        </select>
                        {errors.id_jenis_cuti && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.id_jenis_cuti.message}</p>
                        )}
                    </div>

                    {/* Tanggal Cuti - Date Range Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiCalendar className="inline mr-2" />
                            Periode Cuti <span className="text-red-500">*</span>
                            </label>
                        <div className="relative z-[99] appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-full hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer">
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onDatesChange={handleDateRangeChange}
                                startDateId="tanggal_mulai_cuti"
                                endDateId="tanggal_selesai_cuti"
                                focusedInput={focusedInput}
                                onFocusChange={setFocusedInput}
                                displayFormat="YYYY-MM-DD"
                                isOutsideRange={() => false}
                            />
                        </div>
                            {errors.tanggal_mulai_cuti && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_mulai_cuti.message}</p>
                            )}
                            {errors.tanggal_selesai_cuti && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_selesai_cuti.message}</p>
                            )}
                        <style jsx global>{`
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
                            }
                            .DateRangePickerInput {
                                border: none;
                                color: inherit;
                                background: transparent;
                            }
                            .DateRangePicker {
                                color: inherit;
                            }
                            .DateRangePicker_picker {
                                border-radius: 20px;
                                overflow: hidden;
                                border: solid 1px lightgray;
                                backdrop-filter: blur(10px);
                                background: #ffffff80;
                                z-index: 9999 !important;
                            }
                            .dark .DateRangePicker_picker {
                                border: solid 1px rgb(55 65 81);
                                background: rgba(17, 24, 39, 0.8);
                            }
                            .DateInput {
                                background: transparent;
                            }
                            .CalendarDay {
                                color: inherit;
                            }
                            .CalendarDay__default {
                                color: inherit;
                            }
                            .CalendarDay__selected_span {
                                background: #3b82f6;
                                color: white;
                            }
                            .dark .CalendarDay__selected_span {
                                background: #2563eb;
                            }
                            .CalendarDay__selected {
                                background: #1e40af;
                                color: white;
                            }
                            .dark .CalendarDay__selected {
                                background: #1d4ed8;
                            }
                            .CalendarDay__hovered_span {
                                background: #60a5fa;
                                color: white;
                            }
                            .dark .CalendarDay__hovered_span {
                                background: #3b82f6;
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
                    </div>

                    {/* Jumlah Hari (Auto-calculated) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiClock className="inline mr-2" />
                            Jumlah Hari
                        </label>
                        <input
                            type="number"
                            {...register('jumlah_hari', { valueAsNumber: true })}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white cursor-not-allowed"
                        />
                        {errors.jumlah_hari && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jumlah_hari.message}</p>
                        )}
                    </div>

                    {/* Alasan Cuti */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiFileText className="inline mr-2" />
                            Alasan Cuti <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register('alasan_cuti')}
                            rows={4}
                            placeholder="Contoh: Mengunjungi orang tua di luar kota"
                            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.alasan_cuti ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.alasan_cuti && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alasan_cuti.message}</p>
                        )}
                    </div>

                    {/* Alamat Selama Cuti */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiMapPin className="inline mr-2" />
                            Alamat Selama Cuti <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register('alamat_selama_cuti')}
                            rows={3}
                            placeholder="Contoh: Jl. Mawar No. 15, Bandung"
                            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.alamat_selama_cuti ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.alamat_selama_cuti && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alamat_selama_cuti.message}</p>
                        )}
                    </div>

                    {/* Nomor HP Selama Cuti */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiPhone className="inline mr-2" />
                            Nomor HP Selama Cuti <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            {...register('no_hp_selama_cuti')}
                            placeholder="Contoh: 081234567890"
                            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.no_hp_selama_cuti ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.no_hp_selama_cuti && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.no_hp_selama_cuti.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {createMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Mengirim...
                                </span>
                            ) : (
                                'Ajukan Cuti'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

