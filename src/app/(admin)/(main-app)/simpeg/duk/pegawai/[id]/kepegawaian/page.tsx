"use client";
import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useRiwayatKepangkatan } from '@/hooks/fetch/pegawai/useRiwayatKepangkatan';
import { usePangkatGolonganForm, PangkatGolonganItem } from '@/hooks/fetch/master/usePangkatGolong';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/modal';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

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

const kepegawaianSchema = z.object({
  no_sk_cpns: z.string().optional(),
  no_karpeg: z.string().optional(),
  no_karis_karsu: z.string().optional(),
  no_taspen: z.string().optional(),
});

type FormValues = z.infer<typeof kepegawaianSchema>;

export default function KepegawaianPage() {
  const [isError, setIsError] = useState(false);
  const [isPangkatModalOpen, setIsPangkatModalOpen] = useState(false);
  const [isAddPangkatOpen, setIsAddPangkatOpen] = useState(false);
  const [isJabatanModalOpen, setIsJabatanModalOpen] = useState(false);
  const [jabatanModalType, setJabatanModalType] = useState<'struktural' | 'fungsional' | 'pelaksana'>('struktural');
  const [isAddJabatanOpen, setIsAddJabatanOpen] = useState(false);
  const [riwayatJabatan, setRiwayatJabatan] = useState<any[]>([]);
  const [newPangkat, setNewPangkat] = useState({
    pangkat: '',
    golongan: '',
    tmt_pangkat: '',
    no_sk_pangkat: '',
  });
  const [focusedTmtPangkat, setFocusedTmtPangkat] = useState(false);
  const [focusedTmtJabatan, setFocusedTmtJabatan] = useState(false);
  const [selectedPangkatId, setSelectedPangkatId] = useState('');
  const [selectedGolonganId, setSelectedGolonganId] = useState('');
  const [newJabatan, setNewJabatan] = useState({
    jenis_jabatan: 'STRUKTURAL',
    jabatan_id: '',
    jenjang_fungsional_id: '',
    eselon_id: '',
    tmt_jabatan: '',
  });
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;
  const { data, isLoading: isLoadingGet } = useGetPegawaiById(idParam);
  const { mutate: updatePegawai, isPending: isLoadingUpdate, isError: errorOnSubmit } = useUpdatePegawai();
  const { data: pangkatGolonganForm, isLoading: isLoadingPangkatGolongan } = usePangkatGolonganForm();
  const {
    riwayatKepangkatan: riwayatKepangkatanData,
    isLoadingRiwayat,
    createRiwayatKepangkatan,
  } = useRiwayatKepangkatan({ id_pegawai: idParam });

  const riwayatKepangkatanItems = useMemo(() => {
    const raw = riwayatKepangkatanData as any;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.data?.items)) return raw.data.items;
    return [];
  }, [riwayatKepangkatanData]);

  const pangkatGolonganItems: PangkatGolonganItem[] = useMemo(() => {
    const raw = pangkatGolonganForm as any;
    const data = raw?.data ?? raw;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [pangkatGolonganForm]);

  // local state for form
  const isLoading = isLoadingGet || isLoadingUpdate;

  //form handle 
  if(errorOnSubmit){
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 5000);
  }

  // Extract data for read-only fields
  const kepegawaianData = useMemo(() => {
    const d = data?.data;
    const riwayatKepangkatan = d?.riwayat_kepangkatan ?? [];
    const kepangkatanAktif = Array.isArray(riwayatKepangkatan)
      ? riwayatKepangkatan.find((item: any) => item?.is_aktif === true)
      : null;
    const riwayatJabatan = d?.riwayat_jabatan ?? [];
    const jabatanAktif = Array.isArray(riwayatJabatan)
      ? riwayatJabatan.find((item: any) => item?.is_aktif === true)
      : null;
    const jenisJabatan =
      jabatanAktif?.tipe_jabatan ??
      jabatanAktif?.jenis_jabatan ??
      (d?.jabatan_struktural_id || d?.jabatan_struktural_nama ? 'STRUKTURAL' : null) ??
      (d?.jabatan_fungsional_id || d?.jabatan_fungsional_nama ? 'FUNGSIONAL' : null) ??
      (d?.jabatan ? 'PELAKSANA' : '-');

    return {
      // Data otomatis dari riwayat kepangkatan aktif
      pangkat: kepangkatanAktif?.pangkat_nama ?? kepangkatanAktif?.pangkat ?? d?.pangkat_nama ?? '-',
      golongan: kepangkatanAktif?.golongan ?? kepangkatanAktif?.golongan_kode ?? kepangkatanAktif?.golongan_ruang ?? d?.golongan ?? d?.golongan_kode ?? '-',
      tmt_pangkat: formatDate(kepangkatanAktif?.tmt_pangkat ?? kepangkatanAktif?.tmt ?? null),
      no_sk_pangkat_terakhir: kepangkatanAktif?.no_sk_pangkat ?? kepangkatanAktif?.no_sk ?? d?.no_sk_pangkat_terakhir ?? '-',
      masa_kerja: kepangkatanAktif?.masa_kerja ?? '-',

      // Data lainnya
      status_kepegawaian: d?.status_pekerjaan ?? '-',
      tmt_cpns: formatDate(d?.tmt_cpns),
      // Jabatan (ringkasan aktif)
      jabatan: jabatanAktif?.nama_jabatan ?? jabatanAktif?.jabatan ?? d?.jabatan ?? '-',
      jenis_jabatan: jenisJabatan,
      tmt_jabatan: formatDate(jabatanAktif?.tmt_mulai ?? jabatanAktif?.tmt_jabatan ?? d?.jabatan_tmt),

      // Jabatan Struktural
      jabatan_struktural_id: d?.jabatan_struktural_id ?? null,
      jabatan_struktural_nama: d?.jabatan_struktural_nama ?? '-',
      jabatan_struktural_tingkat: d?.jabatan_struktural_tingkat ?? '-',
      jabatan_struktural_tmt_mulai: formatDate(d?.jabatan_struktural_tmt_mulai ?? null),
      jabatan_struktural_tmt_selesai: formatDate(d?.jabatan_struktural_tmt_selesai ?? null),

      // Jabatan Fungsional
      jabatan_fungsional_id: d?.jabatan_fungsional_id ?? null,
      jabatan_fungsional_nama: d?.jabatan_fungsional_nama ?? '-',
      jabatan_fungsional_tingkat: d?.jabatan_fungsional_tingkat ?? '-',
      jabatan_fungsional_tmt_mulai: formatDate(d?.jabatan_fungsional_tmt_mulai ?? null),
      jabatan_fungsional_tmt_selesai: formatDate(d?.jabatan_fungsional_tmt_selesai ?? null),

      // Jabatan Pelaksana
      jabatan_pelaksana_nama: d?.jabatan ?? '-',
      jabatan_pelaksana_tmt: formatDate(d?.jabatan_tmt ?? null),
      no_sk_pns: d?.no_sk_pns ?? '-',
    };
  }, [data]);

  const activeJabatanJenis =
    jabatanModalType === 'struktural' ? 'STRUKTURAL' : jabatanModalType === 'fungsional' ? 'FUNGSIONAL' : 'PELAKSANA';
  const filteredRiwayatJabatan = useMemo(
    () => riwayatJabatan.filter((item: any) => item?.jenis_jabatan === activeJabatanJenis),
    [riwayatJabatan, activeJabatanJenis],
  );

  // Default values for editable form fields
  const defaults: FormValues = useMemo(() => {
    const d = data?.data;
    return {
      no_sk_cpns: d?.no_sk_cpns ?? '',
      no_karpeg: d?.no_karpeg ?? '',
      no_karis_karsu: d?.no_karis_karsu ?? '',
      no_taspen: d?.no_taspen ?? '',
    };
  }, [data]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ 
    defaultValues: defaults, 
    values: defaults, 
    resolver: zodResolver(kepegawaianSchema) 
  });

  const onSubmit = async (values: FormValues) => {
    updatePegawai({ id: idParam, formData: values });
  };

  useEffect(() => {
    const d = data?.data;
    setRiwayatJabatan(Array.isArray(d?.riwayat_jabatan) ? d?.riwayat_jabatan : []);
  }, [data]);

  const inputClassReadOnly = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white cursor-not-allowed opacity-75";
  const inputClassEditable = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  if (isLoading) {
    return (
      <div className="w-full p-6 m-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
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
      <div className="w-11/12 p-6 m-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
        {isError && (
          <span className='bg-red-200 border-red-500 w-full p-6 rounded-xl mb-4 text-center flex flex-row justify-between items-center'> 
            <p className="text-red-500 text-sm mt-1">Terjadi kesalahan pada server, silahkan coba beberapa saat lagi</p>
            <button className='bg-red-500 text-white rounded-lg p-2 px-4 hover:bg-red-600 transition-colors' onClick={() => setIsError(false)}>Tutup</button>
          </span>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Status Kepegawaian */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Kepegawaian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Kepegawaian</label>
                <input type="text" className={inputClassReadOnly} value={kepegawaianData.status_kepegawaian} readOnly disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT CPNS</label>
                <input type="text" className={inputClassReadOnly} value={kepegawaianData.tmt_cpns} readOnly disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor SK CPNS <p className="text-red-500 text-sm mt-1">{errors.no_sk_cpns && errors.no_sk_cpns.message ? `${errors.no_sk_cpns.message}` : ""}</p>
                </label>
                <input type="text" className={inputClassEditable + " " + (errors.no_sk_cpns ? 'border-red-500' : "")} disabled={isLoading} {...register('no_sk_cpns')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor SK PNS 100%</label>
                <input type="text" className={inputClassReadOnly} value={kepegawaianData.no_sk_pns} readOnly disabled />
              </div>
            </div>
          </div>

          {/* Kepangkatan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kepangkatan</h2>
              <button
                type="button"
                onClick={() => setIsPangkatModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Kelola Pangkat
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Perubahan pangkat dilakukan melalui Riwayat Kepangkatan berbasis SK
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pangkat</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.pangkat}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat kepangkatan aktif</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Golongan</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.golongan}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat kepangkatan aktif</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">TMT Pangkat</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.tmt_pangkat}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat kepangkatan aktif</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Masa Kerja</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.masa_kerja}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat kepangkatan aktif</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Nomor SK Pangkat Terakhir</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.no_sk_pangkat_terakhir}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat kepangkatan aktif</p>
              </div>
            </div>
          </div>

          {/* Jabatan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Jabatan</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Perubahan jabatan dilakukan melalui Riwayat Jabatan berbasis SK
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Jabatan Struktural */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jabatan Struktural</h3>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Struktural</span>
                </div>
                {kepegawaianData.jabatan_struktural_id ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.jabatan_struktural_nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tingkat: {kepegawaianData.jabatan_struktural_tingkat}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">TMT: {kepegawaianData.jabatan_struktural_tmt_mulai}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada jabatan</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat jabatan aktif</p>
                <button
                  type="button"
                  onClick={() => {
                    setJabatanModalType('struktural');
                    setIsJabatanModalOpen(true);
                  }}
                  className="mt-auto w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Kelola Jabatan Struktural
                </button>
              </div>

              {/* Jabatan Fungsional */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jabatan Fungsional</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Fungsional</span>
                </div>
                {kepegawaianData.jabatan_fungsional_id ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.jabatan_fungsional_nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Jenjang: {kepegawaianData.jabatan_fungsional_tingkat}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">TMT: {kepegawaianData.jabatan_fungsional_tmt_mulai}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada jabatan</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat jabatan aktif</p>
                <button
                  type="button"
                  onClick={() => {
                    setJabatanModalType('fungsional');
                    setIsJabatanModalOpen(true);
                  }}
                  className="mt-auto w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Kelola Jabatan Fungsional
                </button>
              </div>

              {/* Jabatan Pelaksana */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jabatan Pelaksana</h3>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Pelaksana</span>
                </div>
                {kepegawaianData.jabatan_pelaksana_nama !== '-' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.jabatan_pelaksana_nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">TMT: {kepegawaianData.jabatan_pelaksana_tmt}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada jabatan</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data otomatis dari riwayat jabatan aktif</p>
                <button
                  type="button"
                  onClick={() => {
                    setJabatanModalType('pelaksana');
                    setIsJabatanModalOpen(true);
                  }}
                  className="mt-auto w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Kelola Jabatan Pelaksana
                </button>
              </div>
            </div>
          </div>

          {/* Administrasi Pegawai */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Administrasi Pegawai</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Karpeg <p className="text-red-500 text-sm mt-1">{errors.no_karpeg && errors.no_karpeg.message ? `${errors.no_karpeg.message}` : ""}</p>
                </label>
                <input type="text" className={inputClassEditable + " " + (errors.no_karpeg ? 'border-red-500' : "")} disabled={isLoading} {...register('no_karpeg')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Karis / Karsu <p className="text-red-500 text-sm mt-1">{errors.no_karis_karsu && errors.no_karis_karsu.message ? `${errors.no_karis_karsu.message}` : ""}</p>
                </label>
                <input type="text" className={inputClassEditable + " " + (errors.no_karis_karsu ? 'border-red-500' : "")} disabled={isLoading} {...register('no_karis_karsu')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Taspen <p className="text-red-500 text-sm mt-1">{errors.no_taspen && errors.no_taspen.message ? `${errors.no_taspen.message}` : ""}</p>
                </label>
                <input type="text" className={inputClassEditable + " " + (errors.no_taspen ? 'border-red-500' : "")} disabled={isLoading} {...register('no_taspen')} />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>

        <Modal
          isOpen={isPangkatModalOpen}
          onClose={() => setIsPangkatModalOpen(false)}
          className="max-w-[600px] p-5 lg:p-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Riwayat Kepangkatan</h3>
              <button
                type="button"
                onClick={() => setIsAddPangkatOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Tambah Riwayat Pangkat
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan data aktif dan histori kepangkatan.
            </p>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pangkat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Golongan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">TMT Pangkat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">No. SK</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {riwayatKepangkatanItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        {isLoadingRiwayat ? 'Memuat riwayat kepangkatan...' : 'Belum ada riwayat kepangkatan'}
                      </td>
                    </tr>
                  ) : (
                    riwayatKepangkatanItems.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {item?.is_aktif ? (
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              Historis
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item?.pangkat_nama ?? item?.pangkat ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item?.golongan ?? item?.golongan_kode ?? item?.golongan_ruang ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(item?.tmt_pangkat ?? item?.tmt ?? null)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item?.no_sk_pangkat ?? item?.no_sk ?? '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsPangkatModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isAddPangkatOpen}
          onClose={() => setIsAddPangkatOpen(false)}
          className="max-w-[600px] p-5 lg:p-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const confirmed = window.confirm('Simpan riwayat pangkat baru dan nonaktifkan yang lama?');
              if (!confirmed) return;
              createRiwayatKepangkatan({
                id_pegawai: idParam,
                pangkat: newPangkat.pangkat,
                golongan: newPangkat.golongan,
                tmt_pangkat: newPangkat.tmt_pangkat,
                no_sk_pangkat: newPangkat.no_sk_pangkat,
                is_aktif: true,
              });
              setIsAddPangkatOpen(false);
              setNewPangkat({ pangkat: '', golongan: '', tmt_pangkat: '', no_sk_pangkat: '' });
              setSelectedPangkatId('');
              setSelectedGolonganId('');
            }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tambah Riwayat Pangkat</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Riwayat baru akan menjadi aktif, riwayat sebelumnya otomatis nonaktif.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pangkat</label>
              <select
                className={inputClassEditable}
                value={selectedPangkatId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedPangkatId(selectedId);
                  const selected = pangkatGolonganItems.find((item) => item.id === selectedId);
                  if (selected) {
                    setNewPangkat((prev) => ({
                      ...prev,
                      pangkat: selected.nama_pangkat,
                      golongan: selected.golongan && selected.ruang ? `${selected.golongan}/${selected.ruang}` : selected.golongan ?? selected.ruang ?? '',
                    }));
                  }
                }}
                required
                disabled={isLoadingPangkatGolongan}
              >
                <option value="">Pilih pangkat</option>
                {pangkatGolonganItems.map((item: PangkatGolonganItem) => (
                  <option key={item.id} value={item.id}>
                    {item.nama_pangkat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Golongan</label>
              <select
                className={inputClassEditable}
                value={selectedGolonganId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedGolonganId(selectedId);
                  const selected = pangkatGolonganItems.find((item) => item.id === selectedId);
                  if (selected) {
                    setNewPangkat((prev) => ({
                      ...prev,
                      golongan: selected.golongan && selected.ruang ? `${selected.golongan}/${selected.ruang}` : selected.golongan ?? selected.ruang ?? '',
                    }));
                  }
                }}
                required
                disabled={isLoadingPangkatGolongan}
              >
                <option value="">Pilih golongan</option>
                {pangkatGolonganItems.map((item: PangkatGolonganItem) => (
                  <option key={item.id} value={item.id}>
                    {(item.golongan ?? '-') + (item.ruang ? `/${item.ruang}` : '')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT Pangkat</label>
              <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                <SingleDatePicker
                  date={newPangkat.tmt_pangkat ? moment(newPangkat.tmt_pangkat) : null}
                  onDateChange={(date) =>
                    setNewPangkat((prev) => ({
                      ...prev,
                      tmt_pangkat: date ? date.format('YYYY-MM-DD') : '',
                    }))
                  }
                  focused={focusedTmtPangkat}
                  onFocusChange={({ focused }) => setFocusedTmtPangkat(focused || false)}
                  id="tmt_pangkat_picker"
                  displayFormat="YYYY-MM-DD"
                  isOutsideRange={() => false}
                  placeholder="Pilih tanggal"
                  numberOfMonths={1}
                  showClearDate
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor SK Pangkat</label>
              <input
                type="text"
                className={inputClassEditable}
                value={newPangkat.no_sk_pangkat}
                onChange={(e) => setNewPangkat((prev) => ({ ...prev, no_sk_pangkat: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsAddPangkatOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isJabatanModalOpen}
          onClose={() => setIsJabatanModalOpen(false)}
          className="max-w-[600px] p-5 lg:p-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Riwayat Jabatan</h3>
                {jabatanModalType === 'struktural' && (
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Struktural</span>
                )}
                {jabatanModalType === 'fungsional' && (
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Fungsional</span>
                )}
                {jabatanModalType === 'pelaksana' && (
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Pelaksana</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsAddJabatanOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Tambah Riwayat Jabatan
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan data aktif dan histori jabatan.
            </p>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Jabatan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Jenis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">TMT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Eselon</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRiwayatJabatan.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        Belum ada riwayat jabatan untuk jenis ini
                      </td>
                    </tr>
                  ) : (
                    filteredRiwayatJabatan.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {item?.is_aktif ? (
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              Historis
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item?.nama_jabatan ?? item?.jabatan ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item?.tipe_jabatan ?? item?.jenis_jabatan ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(item?.tmt_mulai ?? item?.tmt_jabatan ?? null)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item?.eselon ?? '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsJabatanModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isAddJabatanOpen}
          onClose={() => setIsAddJabatanOpen(false)}
          className="max-w-[600px] p-5 lg:p-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const confirmed = window.confirm('Simpan riwayat jabatan baru dan nonaktifkan yang lama?');
              if (!confirmed) return;
              const payload = {
                jenis_jabatan: newJabatan.jenis_jabatan,
                jabatan_id: newJabatan.jabatan_id,
                eselon_id: newJabatan.jenis_jabatan === 'STRUKTURAL' ? newJabatan.eselon_id : null,
                jenjang_fungsional_id: newJabatan.jenis_jabatan === 'FUNGSIONAL' ? newJabatan.jenjang_fungsional_id : null,
                tmt_jabatan: newJabatan.tmt_jabatan,
                is_aktif: true,
              };
              const newItem = payload;
              setRiwayatJabatan((prev) => [
                newItem,
                ...prev.map((item: any) => ({ ...item, is_aktif: false })),
              ]);
              setIsAddJabatanOpen(false);
              setNewJabatan({
                jenis_jabatan: 'STRUKTURAL',
                jabatan_id: '',
                jenjang_fungsional_id: '',
                eselon_id: '',
                tmt_jabatan: '',
              });
            }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tambah Riwayat Jabatan</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Riwayat baru akan menjadi aktif, riwayat sebelumnya otomatis nonaktif.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pegawai</label>
                <input
                  type="text"
                  className={inputClassReadOnly}
                  value={data?.data?.nama ?? '-'}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIP</label>
                <input
                  type="text"
                  className={inputClassReadOnly}
                  value={data?.data?.nip ?? '-'}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Kerja Induk</label>
                <input
                  type="text"
                  className={inputClassReadOnly}
                  value={data?.data?.unit_kerja_induk ?? data?.data?.unit_kerja ?? '-'}
                  readOnly
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jabatan</label>
              <input
                type="text"
                className={inputClassEditable}
                value={newJabatan.jabatan_id}
                onChange={(e) => setNewJabatan((prev) => ({ ...prev, jabatan_id: e.target.value }))}
                placeholder="Pilih jabatan (master_jabatan)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Jabatan</label>
              <select
                className={inputClassEditable}
                value={newJabatan.jenis_jabatan}
                onChange={(e) =>
                  setNewJabatan((prev) => ({
                    ...prev,
                    jenis_jabatan: e.target.value,
                    jenjang_fungsional_id: '',
                    eselon_id: '',
                  }))
                }
              >
                <option value="STRUKTURAL">Struktural</option>
                <option value="FUNGSIONAL">Fungsional</option>
                <option value="PELAKSANA">Pelaksana</option>
              </select>
            </div>
            {newJabatan.jenis_jabatan === 'STRUKTURAL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Eselon</label>
                <input
                  type="text"
                  className={inputClassEditable}
                  value={newJabatan.eselon_id}
                  onChange={(e) => setNewJabatan((prev) => ({ ...prev, eselon_id: e.target.value }))}
                  placeholder="Eselon"
                />
              </div>
            )}
            {newJabatan.jenis_jabatan === 'FUNGSIONAL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenjang Fungsional</label>
                <input
                  type="text"
                  className={inputClassEditable}
                  value={newJabatan.jenjang_fungsional_id}
                  onChange={(e) => setNewJabatan((prev) => ({ ...prev, jenjang_fungsional_id: e.target.value }))}
                  placeholder="Jenjang fungsional"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT Jabatan</label>
              <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                <SingleDatePicker
                  date={newJabatan.tmt_jabatan ? moment(newJabatan.tmt_jabatan) : null}
                  onDateChange={(date) =>
                    setNewJabatan((prev) => ({
                      ...prev,
                      tmt_jabatan: date ? date.format('YYYY-MM-DD') : '',
                    }))
                  }
                  focused={focusedTmtJabatan}
                  onFocusChange={({ focused }) => setFocusedTmtJabatan(focused || false)}
                  id="tmt_jabatan_picker"
                  displayFormat="YYYY-MM-DD"
                  isOutsideRange={() => false}
                  placeholder="Pilih tanggal"
                  numberOfMonths={1}
                  showClearDate
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsAddJabatanOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      </div>
  );
}
