"use client";
import React from "react";
import { usePegawaiSedangBelajar } from "@/hooks/fetch/belajar/useBelajarState";
import SpinerLoading from "@/components/loading/spiner";
import { BsCloudSlash } from "react-icons/bs";

export default function PegawaiSedangBelajarTable() {
    const { data, isLoading, isError } = usePegawaiSedangBelajar();
    const statistik = data?.data;

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

    if (isLoading) {
        return (
            <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col items-center justify-center">
                <SpinerLoading title="Pegawai Sedang Belajar" />
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

    const daftarPegawai = statistik.daftar_pegawai || [];

    return (
        <div className="rounded-4xl bg-white dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-[360px] h-full flex flex-col">
            <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">Tabel</h2>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Pegawai Sedang Belajar</h2>
            <div className="mb-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total: <span className="font-bold text-blue-600 dark:text-blue-400">{statistik.total_pegawai_sedang_belajar}</span> pegawai
                </p>
            </div>
            {daftarPegawai.length > 0 ? (
                <div className="overflow-x-auto flex-1">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">NIP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Unit Kerja</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Program Studi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Institusi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tanggal Mulai</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase">Tanggal Selesai</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {daftarPegawai.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nip}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.unit_kerja}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.program_studi}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.institusi_pendidikan}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatDate(item.tanggal_mulai)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatDate(item.tanggal_selesai)}</td>
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

