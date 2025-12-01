"use client";
import React, { useState } from "react";
import { useJabatanAkanKosong, StatistikPeriodeFilter } from "@/hooks/fetch/pensiun/usePensiunState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function JabatanAkanKosongTable() {
    const [filters, setFilters] = useState<StatistikPeriodeFilter>({ periode: '1tahun' });
    const { data, isLoading, isError } = useJabatanAkanKosong(filters);
    const statistik = data?.data;

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({
            ...prev,
            periode: e.target.value || undefined,
        }));
    };

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Jabatan Akan Kosong" />
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

    const daftarJabatan = statistik.data || [];

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">Tabel</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Jabatan Akan Kosong</h2>
            
            <div className="mb-4 flex gap-2 items-center">
                <label className="text-sm text-gray-600 dark:text-gray-400">Periode:</label>
                <select
                    value={filters.periode || ''}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="1tahun">1 Tahun</option>
                    <option value="6bulan">6 Bulan</option>
                    <option value="3bulan">3 Bulan</option>
                </select>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.total_jabatan}</span> jabatan
                    </p>
                </div>
            </div>

            {daftarJabatan.length > 0 ? (
                <div className="overflow-x-auto flex-1">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tipe</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama Jabatan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Jumlah</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Pegawai</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {daftarJabatan.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            item.tipe_jabatan === 'STRUKTURAL' 
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        }`}>
                                            {item.tipe_jabatan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama_jabatan}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.jumlah_akan_pensiun}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        <div className="flex flex-col gap-1">
                                            {item.pegawai.map((peg, idx) => (
                                                <div key={idx} className="text-xs">
                                                    {peg.nama} ({peg.sisa_hari} hari)
                                                </div>
                                            ))}
                                        </div>
                                    </td>
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

