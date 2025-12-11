"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWhoami } from '@/hooks/fetch/useWhoami';
import { useCreatePermohonanMutasi, PermohonanMutasiInput } from '@/hooks/fetch/mutasi/useMutasiPermohonan';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiFileText, FiMapPin, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import moment from 'moment';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

// Schema validasi
const permohonanMutasiSchema = z.object({
    instansi_tujuan: z.string().min(3, "Nama instansi tujuan minimal 3 karakter"),
    alasan_mutasi: z.string().min(10, "Alasan mutasi minimal 10 karakter"),
    tanggal_pengajuan: z.string().optional(),
});

type PermohonanMutasiFormData = z.infer<typeof permohonanMutasiSchema>;

export default function PermohonanMutasiPage() {
    const router = useRouter();
    const { data: whoamiData, isLoading: isLoadingWhoami } = useWhoami();
    const createMutation = useCreatePermohonanMutasi();

    const userData = whoamiData?.data;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<PermohonanMutasiFormData>({
        resolver: zodResolver(permohonanMutasiSchema),
        defaultValues: {
            instansi_tujuan: '',
            alasan_mutasi: '',
            tanggal_pengajuan: new Date().toISOString().split('T')[0],
        },
    });

    // State untuk date range picker
    const [focusedInput, setFocusedInput] = useState<any>(null);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const tanggalPengajuan = watch("tanggal_pengajuan");

    // Sync date range picker dengan form values
    useEffect(() => {
        if (tanggalPengajuan) {
            setStartDate(moment(tanggalPengajuan));
        } else {
            setStartDate(null);
        }
    }, [tanggalPengajuan]);

    // Handle date range change (hanya menggunakan startDate untuk tanggal_pengajuan)
    const handleDateRangeChange = ({ startDate: newStartDate }: any) => {
        setStartDate(newStartDate);
        
        if (newStartDate) {
            setValue("tanggal_pengajuan", newStartDate.format('YYYY-MM-DD'));
        } else {
            setValue("tanggal_pengajuan", new Date().toISOString().split('T')[0]);
        }
    };

    const onSubmit = async (data: PermohonanMutasiFormData) => {
        if (!userData?.id_pegawai) {
            toast.error('Data pegawai tidak ditemukan. Silakan login ulang.');
            return;
        }

        try {
            const formData: PermohonanMutasiInput = {
                id_pegawai: userData.id_pegawai,
                instansi_tujuan: data.instansi_tujuan,
                alasan_mutasi: data.alasan_mutasi,
                tanggal_pengajuan: data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan) : new Date(),
            };

            await createMutation.mutateAsync(formData);
            reset();
            // Redirect setelah berhasil
            router.push('/simpeg/mutasi/data');
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
                <PathBreadcrumb defaultTitle="Permohonan Mutasi" />
            </div>

            <div className="mb-4">
                <Link 
                    href="/simpeg/mutasi"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    <IoArrowBack className="mr-2" />
                    Kembali
                </Link>
            </div>

            <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
                <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">📝 Form Pengajuan Mutasi</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Silakan isi form di bawah ini untuk mengajukan mutasi</p>

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

                    {/* Informasi Mutasi */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FiInfo className="text-amber-600 dark:text-amber-400" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informasi Mutasi</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Permohonan mutasi akan diproses oleh bagian kepegawaian. Pastikan data yang Anda isi sudah benar dan lengkap.
                        </p>
                    </div>

                    {/* Form Pengajuan Mutasi */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Instansi Tujuan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiMapPin className="inline mr-2" />
                                Instansi Tujuan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('instansi_tujuan')}
                                placeholder="Contoh: Dinas Pendidikan, Sekretariat Daerah, dll"
                                className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.instansi_tujuan ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.instansi_tujuan && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.instansi_tujuan.message}</p>
                            )}
                        </div>

                        {/* Alasan Mutasi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiFileText className="inline mr-2" />
                                Alasan Mutasi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('alasan_mutasi')}
                                rows={6}
                                placeholder="Jelaskan alasan mengapa Anda mengajukan mutasi ke instansi tujuan tersebut..."
                                className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.alasan_mutasi ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.alasan_mutasi && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alasan_mutasi.message}</p>
                            )}
                        </div>

                        {/* Tanggal Pengajuan - Date Range Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiFileText className="inline mr-2" />
                                Tanggal Pengajuan
                            </label>
                            <div className="relative z-[99] appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-full hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer">
                                <DateRangePicker
                                    startDate={startDate}
                                    endDate={null}
                                    onDatesChange={handleDateRangeChange}
                                    startDateId="tanggal_pengajuan"
                                    endDateId="tanggal_pengajuan_end"
                                    focusedInput={focusedInput}
                                    onFocusChange={setFocusedInput}
                                    displayFormat="YYYY-MM-DD"
                                    isOutsideRange={() => false}
                                />
                            </div>
                            {errors.tanggal_pengajuan && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_pengajuan.message}</p>
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
                                    'Ajukan Mutasi'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

