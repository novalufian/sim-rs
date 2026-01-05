"use client";
import React, { useMemo } from 'react';
import { useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';

// Helper function to parse date string to readable format
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  
  // If already in readable format like "01 Jan 2022"
  if (dateStr.includes(' ')) {
    return dateStr;
  }
  
  // Try to parse and format date
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  } catch (e) {
    // If parsing fails, return as is
  }
  
  return dateStr || '-';
};

export default function KepegawaianPage() {
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;
  const { data, isLoading } = useGetPegawaiById(idParam);

  // Extract data
  const kepegawaianData = useMemo(() => {
    const d = data?.data;
    return {
      pangkat: d?.pangkat_nama ?? '-',
      golongan: d?.golongan ?? d?.golongan_kode ?? '-',
      tmt_cpns: formatDate(d?.tmt_cpns),
      jabatan: d?.jabatan ?? '-',
      no_sk_pangkat_terakhir: d?.no_sk_pangkat_terakhir ?? '-',
      tmt_jabatan: formatDate(d?.jabatan_tmt),
      masa_kerja: d?.masa_kerja ?? d?.pengangkatan_masakerja ?? '-',
      no_sk_cpns: d?.no_sk_cpns ?? '-',
      no_sk_pns: d?.no_sk_pns ?? '-',
      no_karpeg: d?.no_karpeg ?? '-',
      no_karis_karsu: d?.no_karis_karsu ?? '-',
      no_taspen: d?.no_taspen ?? '-',
    };
  }, [data]);

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white cursor-not-allowed opacity-75";

  if (isLoading) {
    return (
      <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="space-y-6">
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pangkat</label>
            <input type="text" className={inputClass} value={kepegawaianData.pangkat} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Golongan</label>
            <input type="text" className={inputClass} value={kepegawaianData.golongan} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT CPNS</label>
            <input type="text" className={inputClass} value={kepegawaianData.tmt_cpns} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jabatan</label>
            <input type="text" className={inputClass} value={kepegawaianData.jabatan} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor SK Pangkat Terakhir</label>
            <input type="text" className={inputClass} value={kepegawaianData.no_sk_pangkat_terakhir} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT Jabatan</label>
            <input type="text" className={inputClass} value={kepegawaianData.tmt_jabatan} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Masa Kerja</label>
            <input type="text" className={inputClass} value={kepegawaianData.masa_kerja} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor SK CPNS</label>
            <input type="text" className={inputClass} value={kepegawaianData.no_sk_cpns} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor SK PNS 100%</label>
            <input type="text" className={inputClass} value={kepegawaianData.no_sk_pns} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor Karpeg</label>
            <input type="text" className={inputClass} value={kepegawaianData.no_karpeg} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor Karis/Karsu</label>
            <input type="text" className={inputClass} value={kepegawaianData.no_karis_karsu} readOnly disabled />
          </div>

          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor Taspen</label>
            <input type="text" className={inputClass} value={kepegawaianData.no_taspen} readOnly disabled />
          </div>
        </div>
      </div>
  );
}
