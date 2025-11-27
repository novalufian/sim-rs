"use client";
import React, { useState } from "react";
import { usePegawaiAkanNaikGaji } from "@/hooks/fetch/gaji/useGajiState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

const formatRupiah = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const formatDate = (date: string) => {
    if (!date) return "-";
    try {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date(date));
    } catch {
        return date;
    }
};

export default function PegawaiAkanNaikGajiTable() {
    const [filters, setFilters] = useState<{ periode_bulan?: number }>({ periode_bulan: 6 });
    const { data, isLoading, isError } = usePegawaiAkanNaikGaji(filters);
    const statistik = data?.data;

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value ? parseInt(value) : undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Pegawai Akan Naik Gaji" />
            </div>
        );
    }

    if (isError || !statistik) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BsCloudSlash className="w-10 h-10" />
                <p>Server bermasalah</p>
            </div>
        );
    }

    const pegawaiData = Array.isArray(statistik.daftar_pegawai) ? statistik.daftar_pegawai : [];

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">Tabel</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Pegawai Akan Naik Gaji</h2>
            
            <div className="mb-4 flex gap-2">
                <input
                    type="number"
                    name="periode_bulan"
                    value={filters.periode_bulan || ''}
                    onChange={handleFilterChange}
                    placeholder="Periode (bulan)"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div className="mb-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.total_pegawai}</span> pegawai
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Periode: {statistik.periode_bulan} bulan ke depan
                </p>
            </div>

            {pegawaiData.length > 0 ? (
                <div className="overflow-x-auto flex-1">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">NIP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">TMT KGB Baru</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Selisih Gaji</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Hari Hingga TMT</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {pegawaiData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nip}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatDate(item.tmt_kgb_baru)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatRupiah(item.selisih_gaji)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.hari_hingga_tmt} hari</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    Tidak ada data
                </div>
            )}
        </div>
    );
}

