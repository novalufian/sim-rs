"use client";
import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useRiwayatKepangkatan, CreateRiwayatKepangkatanPayload } from '@/hooks/fetch/pegawai/useRiwayatKepangkatan';
import { useRiwayatJabatan, CreateRiwayatJabatanPayload } from '@/hooks/fetch/pegawai/useRiwayatJabatan';
import { usePangkatGolonganForm, PangkatGolonganItem } from '@/hooks/fetch/master/usePangkatGolong';
import { useJabatan, JabatanItem } from '@/hooks/fetch/master/useJabatan';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/modal';
import { FiFileText } from 'react-icons/fi';
import LeftDrawer from '@/components/drawer/leftDrawer';
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
  const [riwayatJabatanError, setRiwayatJabatanError] = useState<string | null>(null);
  const [jabatanFormErrors, setJabatanFormErrors] = useState<Record<string, string>>({});
  const [newPangkat, setNewPangkat] = useState({
    pangkat: '',
    golongan: '',
    tmt_pangkat: '',
    no_sk_pangkat: '',
  });
  const [pangkatFormError, setPangkatFormError] = useState<string | null>(null);
  const [focusedTmtPangkat, setFocusedTmtPangkat] = useState(false);
  const [focusedTmtMulai, setFocusedTmtMulai] = useState(false);
  const [focusedTmtSelesai, setFocusedTmtSelesai] = useState(false);
  const [focusedSkTanggal, setFocusedSkTanggal] = useState(false);
  const [selectedPangkatId, setSelectedPangkatId] = useState('');
  const [newJabatan, setNewJabatan] = useState({
    jenis_jabatan: 'STRUKTURAL',
    jabatan_id: '',
    tmt_mulai: '',
    tmt_selesai: '',
    sk_nomor: '',
    sk_tanggal: '',
    file_sk: null as File | null,
    keterangan: '',
  });
  const [jabatanSearch, setJabatanSearch] = useState('');
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;
  const { data, isLoading: isLoadingGet } = useGetPegawaiById(idParam);
  const { mutate: updatePegawai, isPending: isLoadingUpdate, isError: errorOnSubmit } = useUpdatePegawai();
  const { data: pangkatGolonganForm, isLoading: isLoadingPangkatGolongan } = usePangkatGolonganForm();
  const {
    data: jabatanData,
    isLoading: isLoadingJabatan,
    refetch: refetchJabatan,
    isFetching: isFetchingJabatan,
  } = useJabatan({ page: 1, limit: 1000 });
  const {
    riwayatKepangkatan: riwayatKepangkatanData,
    isLoadingRiwayat,
    createRiwayatKepangkatan,
    isCreatingRiwayatKepangkatan,
  } = useRiwayatKepangkatan({ id_pegawai: idParam });
  const {
    riwayatJabatan: riwayatJabatanData,
    isLoadingRiwayatJabatan,
    createRiwayatJabatan,
    isCreatingRiwayatJabatan,
  } = useRiwayatJabatan({ id_pegawai: idParam });

  const riwayatKepangkatanItems = useMemo(() => {
    const raw = riwayatKepangkatanData as any;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.data?.items)) return raw.data.items;
    return [];
  }, [riwayatKepangkatanData]);

  const riwayatKepangkatanDisplay = useMemo(() => {
    if (riwayatKepangkatanItems.length > 0) return riwayatKepangkatanItems;
    const d = data?.data;
    if (!d) return [];
    if (d.pangkat_nama || d.golongan || d.pangkat_tmt || d.no_sk_pangkat_terakhir) {
      return [
        {
          is_aktif: true,
          pangkat_nama: d.pangkat_nama,
          golongan: d.golongan ?? d.golongan_kode ?? d.golongan_kode_asn ?? d.golongan_ruang,
          tmt_pangkat: d.pangkat_tmt,
          no_sk_pangkat: d.no_sk_pangkat_terakhir,
        },
      ];
    }
    return [];
  }, [riwayatKepangkatanItems, data]);

  const getPangkatName = (item: any) =>
    item?.pangkat_nama ??
    item?.nama_pangkat ??
    item?.pangkat ??
    item?.pangkat_golongan?.nama_pangkat ??
    '-';

  const getGolongan = (item: any) =>
    item?.golongan ??
    item?.golongan_kode ??
    item?.golongan_kode_asn ??
    item?.golongan_ruang ??
    item?.pangkat_golongan?.golongan ??
    '-';

  const getTmtPangkat = (item: any) =>
    formatDate(item?.tmt_pangkat ?? item?.pangkat_tmt ?? item?.tmt ?? item?.tmt_mulai ?? null);

  const getNoSkPangkat = (item: any) =>
    item?.no_sk_pangkat ??
    item?.nomor_sk ??
    item?.no_sk ??
    item?.no_sk_pangkat_terakhir ??
    item?.sk_pangkat ??
    item?.sk ??
    '-';

  const getJabatanName = (item: any) =>
    item?.nama_jabatan ??
    item?.jabatan?.nama_jabatan ??
    item?.jabatan ??
    item?.jabatan_struktural_nama ??
    item?.jabatan_fungsional_nama ??
    '-';

  const pangkatGolonganItems: PangkatGolonganItem[] = useMemo(() => {
    const raw = pangkatGolonganForm as any;
    const data = raw?.data ?? raw;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [pangkatGolonganForm]);

  const jabatanItems: JabatanItem[] = useMemo(() => {
    const items = jabatanData?.data?.items ?? [];
    return items;
  }, [jabatanData]);

  const selectedJabatanType = useMemo(() => {
    return jabatanModalType === 'struktural'
      ? 'STRUKTURAL'
      : jabatanModalType === 'fungsional'
        ? 'FUNGSIONAL'
        : 'PELAKSANA';
  }, [jabatanModalType]);

  const filteredJabatanItems = useMemo(() => {
    if (!selectedJabatanType) return jabatanItems;
    return jabatanItems.filter((item) => item?.tipe_jabatan === selectedJabatanType);
  }, [jabatanItems, selectedJabatanType]);

  const filteredJabatanOptions = useMemo(() => {
    const keyword = jabatanSearch.trim().toLowerCase();
    if (!keyword) return filteredJabatanItems;
    return filteredJabatanItems.filter((item) =>
      item.nama_jabatan?.toLowerCase().includes(keyword),
    );
  }, [filteredJabatanItems, jabatanSearch]);


  useEffect(() => {
    if (!isAddJabatanOpen) return;
    refetchJabatan();
    const mapped =
      jabatanModalType === 'struktural'
        ? 'STRUKTURAL'
        : jabatanModalType === 'fungsional'
          ? 'FUNGSIONAL'
          : 'PELAKSANA';
    setNewJabatan((prev) => ({
      ...prev,
      jenis_jabatan: mapped,
    }));
  }, [isAddJabatanOpen, jabatanModalType]);

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
      tmt_pangkat: formatDate(
        kepangkatanAktif?.tmt_pangkat ??
          kepangkatanAktif?.pangkat_tmt ??
          kepangkatanAktif?.tmt ??
          d?.pangkat_tmt ??
          null,
      ),
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
      jabatan_pelaksana_nama:
        d?.jabatan_pelaksana_nama ??
        (d?.jabatan_struktural_id || d?.jabatan_fungsional_id ? '-' : d?.jabatan ?? '-'),
      jabatan_pelaksana_tingkat: d?.jabatan_pelaksana_tingkat ?? '-',
      jabatan_pelaksana_tmt_mulai: formatDate(d?.jabatan_pelaksana_tmt_mulai ?? null),
      jabatan_pelaksana_tmt_selesai: formatDate(d?.jabatan_pelaksana_tmt_selesai ?? null),
      jabatan_pelaksana_tmt:
        d?.jabatan_pelaksana_tmt_mulai ??
        (d?.jabatan_struktural_id || d?.jabatan_fungsional_id ? '-' : formatDate(d?.jabatan_tmt ?? null)),
      no_sk_pns: d?.no_sk_pns ?? '-',
    };
  }, [data]);

  const activeJabatanJenis =
    jabatanModalType === 'struktural' ? 'STRUKTURAL' : jabatanModalType === 'fungsional' ? 'FUNGSIONAL' : 'PELAKSANA';
  const riwayatJabatanItems = useMemo(() => {
    const raw = riwayatJabatanData as any;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.data?.items)) return raw.data.items;
    return [];
  }, [riwayatJabatanData]);

  const filteredRiwayatJabatan = useMemo(
    () => riwayatJabatanItems.filter((item: any) => (item?.tipe_jabatan ?? item?.jenis_jabatan) === activeJabatanJenis),
    [riwayatJabatanItems, activeJabatanJenis],
  );

  const filteredRiwayatJabatanDisplay = useMemo(() => {
    if (filteredRiwayatJabatan.length > 0) return filteredRiwayatJabatan;
    const d = data?.data;
    if (!d) return [];
    if (jabatanModalType === 'struktural' && d.jabatan_struktural_id) {
      return [
        {
          is_aktif: true,
          nama_jabatan: d.jabatan_struktural_nama,
          jenis_jabatan: 'STRUKTURAL',
          tmt_mulai: d.jabatan_struktural_tmt_mulai,
          eselon: d.jabatan_struktural_tingkat,
        },
      ];
    }
    if (jabatanModalType === 'fungsional' && d.jabatan_fungsional_id) {
      return [
        {
          is_aktif: true,
          nama_jabatan: d.jabatan_fungsional_nama,
          jenis_jabatan: 'FUNGSIONAL',
          tmt_mulai: d.jabatan_fungsional_tmt_mulai,
          jenjang: d.jabatan_fungsional_tingkat,
        },
      ];
    }
    if (jabatanModalType === 'pelaksana' && d.jabatan) {
      return [
        {
          is_aktif: true,
          nama_jabatan: d.jabatan,
          jenis_jabatan: 'PELAKSANA',
          tmt_mulai: d.jabatan_tmt,
        },
      ];
    }
    return [];
  }, [filteredRiwayatJabatan, data, jabatanModalType]);

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
    // keep for other side effects only (riwayat jabatan now from hook)
  }, [data]);

  useEffect(() => {
    if (data?.data) {
      console.log('[Kepegawaian] data:', data.data);
    }
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
                className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jabatan Struktural</h3>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Struktural</span>
                </div>
                {kepegawaianData.jabatan_struktural_id ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama</p>
                      <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.jabatan_struktural_nama}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Tingkat</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_struktural_tingkat}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>TMT</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_struktural_tmt_mulai}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada jabatan</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Data otomatis dari riwayat jabatan aktif</p>
                <button
                  type="button"
                  onClick={() => {
                    setJabatanModalType('struktural');
                    setIsJabatanModalOpen(true);
                  }}
                  className="mt-5 w-full px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Kelola Jabatan Struktural
                </button>
              </div>

              {/* Jabatan Fungsional */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jabatan Fungsional</h3>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Fungsional</span>
                </div>
                {kepegawaianData.jabatan_fungsional_id ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama</p>
                      <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.jabatan_fungsional_nama}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Jenjang</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_fungsional_tingkat}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>TMT</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_fungsional_tmt_mulai}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada jabatan</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Data otomatis dari riwayat jabatan aktif</p>
                <button
                  type="button"
                  onClick={() => {
                    setJabatanModalType('fungsional');
                    setIsJabatanModalOpen(true);
                  }}
                  className="mt-5 w-full px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Kelola Jabatan Fungsional
                </button>
              </div>

              {/* Jabatan Pelaksana */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jabatan Pelaksana</h3>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Pelaksana</span>
                </div>
                {kepegawaianData.jabatan_pelaksana_nama !== '-' ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama</p>
                      <p className="text-sm text-gray-900 dark:text-white">{kepegawaianData.jabatan_pelaksana_nama}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Tingkat</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_pelaksana_tingkat}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>TMT Mulai</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_pelaksana_tmt_mulai}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>TMT Selesai</span>
                        <span className="text-gray-900 dark:text-gray-200">{kepegawaianData.jabatan_pelaksana_tmt_selesai}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tidak ada jabatan</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Data otomatis dari riwayat jabatan aktif</p>
                <button
                  type="button"
                  onClick={() => {
                    setJabatanModalType('pelaksana');
                    setIsJabatanModalOpen(true);
                  }}
                  className="mt-5 w-full px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
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

        <LeftDrawer
          isOpen={isPangkatModalOpen}
          onClose={() => setIsPangkatModalOpen(false)}
          title="Riwayat Kepangkatan"
          width="50vw"
        >
          <div className="space-y-4 h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan data aktif dan histori kepangkatan.
              </p>
              <button
                type="button"
                onClick={() => setIsAddPangkatOpen(true)}
                className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                Tambah Riwayat Pangkat
              </button>
            </div>
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
                  {riwayatKepangkatanDisplay.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        {isLoadingRiwayat ? 'Memuat riwayat kepangkatan...' : 'Belum ada riwayat kepangkatan'}
                      </td>
                    </tr>
                  ) : (
                    riwayatKepangkatanDisplay.map((item: any, idx: number) => (
                      <React.Fragment key={idx}>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{getPangkatName(item)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{getGolongan(item)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{getTmtPangkat(item)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{getNoSkPangkat(item)}</td>
                        </tr>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                          <td colSpan={5} className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                            <details className="group">
                              <summary className="cursor-pointer list-none font-medium text-blue-600 dark:text-blue-300">
                                Lihat data lengkap
                              </summary>
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                  <p className="text-[11px] uppercase tracking-wide text-gray-400">Pegawai</p>
                                  <p className="text-sm text-gray-900 dark:text-white">{item?.pegawai?.nama ?? '-'}</p>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{item?.pegawai?.nip ?? '-'}</p>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                  <p className="text-[11px] uppercase tracking-wide text-gray-400">Pangkat &amp; Golongan</p>
                                  <p className="text-sm text-gray-900 dark:text-white">{item?.pangkat_golongan?.nama_pangkat ?? getPangkatName(item)}</p>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    {(item?.pangkat_golongan?.golongan ?? getGolongan(item)) || '-'}
                                    {item?.pangkat_golongan?.ruang ? `/${item.pangkat_golongan.ruang}` : ''}
                                  </p>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                  <p className="text-[11px] uppercase tracking-wide text-gray-400">Tanggal</p>
                                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                    <span>TMT Mulai</span>
                                    <span className="text-gray-900 dark:text-gray-200">{formatDate(item?.tmt_mulai ?? item?.tmt ?? item?.tmt_pangkat ?? null)}</span>
                                  </div>
                                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                    <span>TMT Selesai</span>
                                    <span className="text-gray-900 dark:text-gray-200">{formatDate(item?.tmt_selesai ?? null)}</span>
                                  </div>
                                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                    <span>Tanggal SK</span>
                                    <span className="text-gray-900 dark:text-gray-200">{formatDate(item?.tanggal_sk ?? item?.sk_tanggal ?? null)}</span>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                  <p className="text-[11px] uppercase tracking-wide text-gray-400">SK &amp; Dokumen</p>
                                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                    <span>Nomor SK</span>
                                    <span className="text-gray-900 dark:text-gray-200">{getNoSkPangkat(item) || item?.sk_nomor || '-'}</span>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    {item?.file_sk ? (
                                      <a
                                        href={item.file_sk}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:underline text-[11px]"
                                      >
                                        <FiFileText size={14} />
                                        Lihat File SK (PDF)
                                      </a>
                                    ) : (
                                      <span className="inline-flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                                        <FiFileText size={14} />
                                        File SK belum diunggah
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      className="px-2 py-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </details>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </LeftDrawer>

        <LeftDrawer
          isOpen={isAddPangkatOpen}
          onClose={() => setIsAddPangkatOpen(false)}
          title="Tambah Riwayat Pangkat"
          width="50vw"
        >
          <div className="h-full overflow-y-auto p-6">
            <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPangkatFormError(null);
              try {
                const payload: CreateRiwayatKepangkatanPayload = {
                  id_pegawai: idParam,
                  id_pangkat_golongan: selectedPangkatId,
                  tmt_pangkat: newPangkat.tmt_pangkat,
                  tmt_mulai: newPangkat.tmt_pangkat,
                  tmt: newPangkat.tmt_pangkat,
                  pangkat_tmt: newPangkat.tmt_pangkat,
                  no_sk_pangkat: newPangkat.no_sk_pangkat,
                  sk_nomor: newPangkat.no_sk_pangkat,
                  nomor_sk: newPangkat.no_sk_pangkat,
                  is_aktif: true,
                };
                console.log('[RiwayatKepangkatan] payload:', payload);
                await createRiwayatKepangkatan(payload);
              } catch (error: any) {
                const message = error?.response?.data?.message || 'Gagal menyimpan riwayat pangkat.';
                setPangkatFormError(message);
                return;
              }
              setIsAddPangkatOpen(false);
              setNewPangkat({ pangkat: '', golongan: '', tmt_pangkat: '', no_sk_pangkat: '' });
              setSelectedPangkatId('');
            }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tambah Riwayat Pangkat</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Riwayat baru akan menjadi aktif, riwayat sebelumnya otomatis nonaktif.
              </p>
            </div>
            {pangkatFormError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg p-3 flex items-center justify-between">
                <p className="text-sm">{pangkatFormError}</p>
                <button
                  type="button"
                  className="text-xs font-medium px-2 py-1 rounded border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-800/40"
                  onClick={() => setPangkatFormError(null)}
                >
                  Tutup
                </button>
              </div>
            )}
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
                      golongan: selected.golongan ?? '',
                    }));
                  }
                }}
                required
                disabled={isLoadingPangkatGolongan || isCreatingRiwayatKepangkatan}
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
              <input
                type="text"
                className={inputClassReadOnly}
                value={newPangkat.golongan}
                readOnly
                disabled
              />
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
                  disabled={isCreatingRiwayatKepangkatan}
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
                disabled={isCreatingRiwayatKepangkatan}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsAddPangkatOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={isCreatingRiwayatKepangkatan}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                disabled={isCreatingRiwayatKepangkatan}
              >
                {isCreatingRiwayatKepangkatan ? 'Memproses...' : 'Simpan'}
              </button>
            </div>
            </form>
          </div>
        </LeftDrawer>

        <LeftDrawer
          isOpen={isJabatanModalOpen}
          onClose={() => setIsJabatanModalOpen(false)}
          title="Riwayat Jabatan"
          width="50vw"
        >
          <div className="space-y-4 h-full min-w-[700px]">
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
                onClick={() => {
                  setRiwayatJabatanError(null);
                  setIsAddJabatanOpen(true);
                }}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      {jabatanModalType === 'fungsional' ? 'Jenjang' : jabatanModalType === 'pelaksana' ? 'Keterangan' : 'Eselon'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRiwayatJabatanDisplay.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        {isLoadingRiwayatJabatan ? 'Memuat riwayat jabatan...' : 'Belum ada riwayat jabatan untuk jenis ini'}
                      </td>
                    </tr>
                  ) : (
                    filteredRiwayatJabatanDisplay.map((item: any, idx: number) => (
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
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {getJabatanName(item)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item?.tipe_jabatan ?? item?.jenis_jabatan ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item?.tmt_mulai ?? item?.tmt_jabatan ?? null)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {item?.eselon ?? item?.jenjang ?? '-'}
                        </td>
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
        </LeftDrawer>

        <LeftDrawer
          isOpen={isAddJabatanOpen}
          onClose={() => setIsAddJabatanOpen(false)}
          title="Tambah Riwayat Jabatan"
          width="50vw"
        >
          <div className="h-full overflow-y-auto p-6">
            <form
            onSubmit={async (e) => {
              e.preventDefault();
              setRiwayatJabatanError(null);
              const nextErrors: Record<string, string> = {};
              if (!newJabatan.jabatan_id) nextErrors.jabatan_id = 'Jabatan wajib dipilih';
              if (!newJabatan.tmt_mulai) nextErrors.tmt_mulai = 'TMT Mulai wajib diisi';
              if (!newJabatan.sk_nomor) nextErrors.sk_nomor = 'Nomor SK wajib diisi';
              if (!newJabatan.sk_tanggal) nextErrors.sk_tanggal = 'Tanggal SK wajib diisi';
              setJabatanFormErrors(nextErrors);
              if (Object.keys(nextErrors).length > 0) return;
              const payload: CreateRiwayatJabatanPayload = {
                pegawai_id: idParam,
                jabatan_id: newJabatan.jabatan_id,
                tipe_jabatan: newJabatan.jenis_jabatan,
                tmt_mulai: newJabatan.tmt_mulai,
                tmt_selesai: newJabatan.tmt_selesai || null,
                sk_nomor: newJabatan.sk_nomor,
                sk_tanggal: newJabatan.sk_tanggal || null,
                is_aktif: true,
                file_sk: newJabatan.file_sk,
                keterangan: newJabatan.keterangan,
              };
              console.log('[RiwayatJabatan] payload:', payload);
              try {
                await createRiwayatJabatan(payload);
              } catch (error: any) {
                const message = error?.response?.data?.message || 'Gagal menyimpan riwayat jabatan.';
                setRiwayatJabatanError(message);
                return;
              }
              setIsAddJabatanOpen(false);
              setNewJabatan({
                jenis_jabatan: 'STRUKTURAL',
                jabatan_id: '',
                tmt_mulai: '',
                tmt_selesai: '',
                sk_nomor: '',
                sk_tanggal: '',
                file_sk: null,
                keterangan: '',
              });
                setJabatanSearch('');
            }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tambah Riwayat Jabatan</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Riwayat baru akan menjadi aktif, riwayat sebelumnya otomatis nonaktif.
              </p>
            </div>
            {riwayatJabatanError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg p-3 flex items-center justify-between">
                <p className="text-sm">{riwayatJabatanError}</p>
                <button
                  type="button"
                  className="text-xs font-medium px-2 py-1 rounded border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-800/40"
                  onClick={() => setRiwayatJabatanError(null)}
                >
                  Tutup
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jabatan</label>
                <input
                  type="text"
                  className={inputClassEditable}
                  value={jabatanSearch}
                  onChange={(e) => setJabatanSearch(e.target.value)}
                  placeholder="Cari jabatan..."
                disabled={isLoadingJabatan || isFetchingJabatan}
                />
              <select
                  className={inputClassEditable}
                  value={newJabatan.jabatan_id}
                  onChange={(e) => setNewJabatan((prev) => ({ ...prev, jabatan_id: e.target.value }))}
                  required
                disabled={isLoadingJabatan || isFetchingJabatan || isCreatingRiwayatJabatan}
                >
                  <option value="">Pilih jabatan</option>
                  {filteredJabatanOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_jabatan}
                    </option>
                  ))}
                </select>
              {jabatanFormErrors.jabatan_id && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{jabatanFormErrors.jabatan_id}</p>
              )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Jabatan</label>
              <select className={inputClassEditable} value={newJabatan.jenis_jabatan} disabled>
                  <option value="STRUKTURAL">Struktural</option>
                  <option value="FUNGSIONAL">Fungsional</option>
                  <option value="PELAKSANA">Pelaksana</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT Mulai</label>
                <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                  <SingleDatePicker
                    date={newJabatan.tmt_mulai ? moment(newJabatan.tmt_mulai) : null}
                    onDateChange={(date) =>
                      setNewJabatan((prev) => ({
                        ...prev,
                        tmt_mulai: date ? date.format('YYYY-MM-DD') : '',
                      }))
                    }
                    focused={focusedTmtMulai}
                    onFocusChange={({ focused }) => setFocusedTmtMulai(focused || false)}
                    id="tmt_mulai_jabatan_picker"
                    displayFormat="YYYY-MM-DD"
                    isOutsideRange={() => false}
                    placeholder="Pilih tanggal"
                    numberOfMonths={1}
                    showClearDate
                    disabled={isCreatingRiwayatJabatan}
                  />
                </div>
              {jabatanFormErrors.tmt_mulai && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{jabatanFormErrors.tmt_mulai}</p>
              )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TMT Selesai</label>
                <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                  <SingleDatePicker
                    date={newJabatan.tmt_selesai ? moment(newJabatan.tmt_selesai) : null}
                    onDateChange={(date) =>
                      setNewJabatan((prev) => ({
                        ...prev,
                        tmt_selesai: date ? date.format('YYYY-MM-DD') : '',
                      }))
                    }
                    focused={focusedTmtSelesai}
                    onFocusChange={({ focused }) => setFocusedTmtSelesai(focused || false)}
                    id="tmt_selesai_jabatan_picker"
                    displayFormat="YYYY-MM-DD"
                    isOutsideRange={() => false}
                    placeholder="Pilih tanggal"
                    numberOfMonths={1}
                    showClearDate
                    disabled={isCreatingRiwayatJabatan}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor SK</label>
                <input
                  type="text"
                  className={inputClassEditable}
                  value={newJabatan.sk_nomor}
                  onChange={(e) => setNewJabatan((prev) => ({ ...prev, sk_nomor: e.target.value }))}
                  placeholder="Nomor SK"
                  disabled={isCreatingRiwayatJabatan}
                />
                {jabatanFormErrors.sk_nomor && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{jabatanFormErrors.sk_nomor}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal SK</label>
                <div className="relative z-50 appearance-none text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg h-11 w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
                  <SingleDatePicker
                    date={newJabatan.sk_tanggal ? moment(newJabatan.sk_tanggal) : null}
                    onDateChange={(date) =>
                      setNewJabatan((prev) => ({
                        ...prev,
                        sk_tanggal: date ? date.format('YYYY-MM-DD') : '',
                      }))
                    }
                    focused={focusedSkTanggal}
                    onFocusChange={({ focused }) => setFocusedSkTanggal(focused || false)}
                    id="sk_tanggal_picker"
                    displayFormat="YYYY-MM-DD"
                    isOutsideRange={() => false}
                    placeholder="Pilih tanggal"
                    numberOfMonths={1}
                    showClearDate
                    disabled={isCreatingRiwayatJabatan}
                  />
                {jabatanFormErrors.sk_tanggal && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{jabatanFormErrors.sk_tanggal}</p>
                )}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keterangan</label>
              <textarea
                className={inputClassEditable}
                value={newJabatan.keterangan}
                onChange={(e) => setNewJabatan((prev) => ({ ...prev, keterangan: e.target.value }))}
                placeholder="Keterangan"
                rows={3}
                disabled={isCreatingRiwayatJabatan}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload File SK (PDF)</label>
              <label className="group relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3-3 3m3-3v12" />
                  </svg>
                  <p className="mb-1 text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (maks. 5MB)</p>
                  {newJabatan.file_sk && (
                    <p className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                      File dipilih: {newJabatan.file_sk.name}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    setNewJabatan((prev) => ({ ...prev, file_sk: e.target.files?.[0] ?? null }))
                  }
                  disabled={isCreatingRiwayatJabatan}
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsAddJabatanOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={isCreatingRiwayatJabatan}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                disabled={isCreatingRiwayatJabatan}
              >
                {isCreatingRiwayatJabatan ? 'Memproses...' : 'Simpan'}
              </button>
            </div>
            </form>
          </div>
        </LeftDrawer>
        <style jsx global>{`
          .SingleDatePickerInput {
            border: none !important;
            background: transparent !important;
          }
          .DateInput_input {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .DateInput_input__focused {
            border: none !important;
            box-shadow: none !important;
          }
          .SingleDatePicker_picker {
            z-index: 99999 !important;
            border-radius: 16px;
            overflow: hidden;
            border: solid 1px rgba(229, 231, 235, 0.8);
            backdrop-filter: blur(10px);
            background: #ffffffea;
          }
          .dark .SingleDatePicker_picker {
            border: solid 1px rgb(55 65 81);
            background: rgba(17, 24, 39, 0.92);
          }
          .CalendarDay__selected,
          .CalendarDay__selected:active,
          .CalendarDay__selected:hover {
            border-radius: 8px !important;
          }
          .CalendarDay__selected_span,
          .CalendarDay__selected_span:active,
          .CalendarDay__selected_span:hover {
            border-radius: 8px !important;
          }
        `}</style>
      </div>
  );
}
