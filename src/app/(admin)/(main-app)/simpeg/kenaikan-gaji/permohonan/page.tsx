"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { RootState } from '@/libs/store';
import { useCreatePermohonanGaji } from '@/hooks/fetch/gaji/useGajiPermohonan';
import { permohonanGajiSchema, PermohonanGajiFormData } from './permohonanGajiSchema';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { FiDollarSign, FiCalendar, FiTrendingUp, FiClock } from 'react-icons/fi';
import moment from 'moment';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default function PermohonanKenaikanGajiPage() {
    const router = useRouter();
    const user = useAppSelector((state: RootState) => state.auth.user);
    const createMutation = useCreatePermohonanGaji();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PermohonanGajiFormData>({
        resolver: zodResolver(permohonanGajiSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            id_pegawai: user?.id_pegawai || '',
            tanggal_pengajuan: new Date().toISOString().split('T')[0],
            gaji_pokok_lama: 0,
            gaji_pokok_baru: 0,
            tmt_kgb_lama: '',
            tmt_kgb_baru: '',
            masa_kerja_gol_lama: '',
            masa_kerja_gol_baru: '',
        },
    });

    // State untuk date range picker
    const [focusedInput, setFocusedInput] = useState<any>(null);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);

    // Watch values untuk kalkulasi
    const gajiPokokLama = watch("gaji_pokok_lama");
    const gajiPokokBaru = watch("gaji_pokok_baru");
    const tanggalPengajuan = watch("tanggal_pengajuan");
    const selisihGaji = gajiPokokBaru && gajiPokokLama ? gajiPokokBaru - gajiPokokLama : 0;
    const persentaseKenaikan = gajiPokokLama > 0 ? ((selisihGaji / gajiPokokLama) * 100).toFixed(2) : '0.00';

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

    const onSubmit: SubmitHandler<PermohonanGajiFormData> = (data) => {
        if (!user?.id_pegawai) {
            return;
        }

        const formData = {
            id_pegawai: user.id_pegawai,
            tanggal_pengajuan: data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan) : new Date(),
            gaji_pokok_lama: data.gaji_pokok_lama,
            gaji_pokok_baru: data.gaji_pokok_baru,
            tmt_kgb_lama: data.tmt_kgb_lama,
            tmt_kgb_baru: data.tmt_kgb_baru,
            masa_kerja_gol_lama: data.masa_kerja_gol_lama,
            masa_kerja_gol_baru: data.masa_kerja_gol_baru,
        };

        createMutation.mutate(formData, {
            onSuccess: () => {
                router.push('/simpeg/kenaikan-gaji');
            },
        });
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    const errorClass = "text-red-500 text-sm mt-1";

    if (!user?.id_pegawai) {
        return (
            <div className="container mx-auto p-4">
                <PathBreadcrumb defaultTitle="Permohonan Kenaikan Gaji Berkala" />
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-4">
                    <p className="text-red-500">Error: Data pegawai tidak ditemukan. Silakan login ulang.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <PathBreadcrumb defaultTitle="Permohonan Kenaikan Gaji Berkala" />
            </div>

            <div className="mb-4">
                <Link 
                    href="/simpeg/kenaikan-gaji"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    <IoArrowBack className="mr-2" />
                    Kembali
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-10/12 m-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Form Permohonan Kenaikan Gaji Berkala (KGB)
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
                                            target.onerror = null;
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
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Row 1: Tanggal Pengajuan - Date Range Picker */}
                    <div>
                        <label className={labelClass}>
                            <FiCalendar className="inline mr-2" />
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
                        {errors.tanggal_pengajuan && <p className={errorClass}>{errors.tanggal_pengajuan.message}</p>}
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

                    {/* Row 2: Gaji Pokok Lama & Baru */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <FiDollarSign className="inline mr-2" />
                                Gaji Pokok Lama <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                {...register("gaji_pokok_lama", { valueAsNumber: true })}
                                className={inputClass}
                                placeholder="0"
                                min="0"
                                step="1000"
                            />
                            {errors.gaji_pokok_lama && <p className={errorClass}>{errors.gaji_pokok_lama.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FiDollarSign className="inline mr-2" />
                                Gaji Pokok Baru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                {...register("gaji_pokok_baru", { valueAsNumber: true })}
                                className={inputClass}
                                placeholder="0"
                                min="0"
                                step="1000"
                            />
                            {errors.gaji_pokok_baru && <p className={errorClass}>{errors.gaji_pokok_baru.message}</p>}
                        </div>
                    </div>

                    {/* Kalkulasi Selisih dan Persentase */}
                    {(gajiPokokLama > 0 || gajiPokokBaru > 0) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Selisih Gaji
                                    </label>
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        Rp {selisihGaji.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Persentase Kenaikan
                                    </label>
                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                        <FiTrendingUp className="inline mr-1" />
                                        {persentaseKenaikan}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Row 3: TMT KGB Lama & Baru */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <FiCalendar className="inline mr-2" />
                                TMT KGB Lama <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("tmt_kgb_lama")}
                                className={inputClass}
                            />
                            {errors.tmt_kgb_lama && <p className={errorClass}>{errors.tmt_kgb_lama.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FiCalendar className="inline mr-2" />
                                TMT KGB Baru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("tmt_kgb_baru")}
                                className={inputClass}
                            />
                            {errors.tmt_kgb_baru && <p className={errorClass}>{errors.tmt_kgb_baru.message}</p>}
                        </div>
                    </div>

                    {/* Row 4: Masa Kerja Golongan Lama & Baru */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <FiClock className="inline mr-2" />
                                Masa Kerja Golongan Lama <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("masa_kerja_gol_lama")}
                                className={inputClass}
                                placeholder="Contoh: 2 tahun 3 bulan"
                            />
                            {errors.masa_kerja_gol_lama && <p className={errorClass}>{errors.masa_kerja_gol_lama.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FiClock className="inline mr-2" />
                                Masa Kerja Golongan Baru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("masa_kerja_gol_baru")}
                                className={inputClass}
                                placeholder="Contoh: 4 tahun 3 bulan"
                            />
                            {errors.masa_kerja_gol_baru && <p className={errorClass}>{errors.masa_kerja_gol_baru.message}</p>}
                        </div>
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
                            href="/simpeg/kenaikan-gaji"
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

