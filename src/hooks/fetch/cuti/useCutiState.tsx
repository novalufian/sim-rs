import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/libs/api'

// ===============================
// 📌 TYPE DEFINITIONS
// ===============================

export interface StatistikFilters {
  startDate?: string
  endDate?: string
  id_pegawai?: string
  role?: 'super_admin' | 'admin' | 'user' | string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  export?: boolean
}

export interface ApiItemResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiListResponse<T> {
  success: boolean
  message: string
  data: T[]
}

// ===============================
// 📊 DASHBOARD
// ===============================
export interface DashboardStatistik {
  totalPermohonan: number
  totalPegawai: number
  rataRataWaktuPersetujuan: number
  filterDigunakan: Record<string, unknown>
  catatan: string
}

// ===============================
// 📊 JATAH CUTI
// ===============================
export interface DistribusiSisaCuti {
  range: string
  jumlahPegawai: number
  persentase: number
}

export interface TrendTahunan {
  tahun: number
  totalPermohonan: number
  totalHari: number
  rataRataHari: number
}

export interface RekomendasiJatah {
  persiapanJatah: string
  monitoring: string
}

export interface StatistikJatahCuti {
  rataRataJatahTahunan: number
  distribusiSisaCuti: DistribusiSisaCuti[]
  trendTahunan: TrendTahunan[]
  prediksiTahunDepan: number
  rekomendasi: RekomendasiJatah
}

// ===============================
// 📊 PERMOHONAN CUTI
// ===============================
export interface DistribusiStatus {
  status: string
  jumlah: number
  persentase: number
}

export interface DistribusiJenisCuti {
  jenisNama: string
  jumlah: number
  persentase: number
}

export interface PegawaiCutiTerbanyak {
  nama: string
  nip: string
  totalHari: number
  totalPermohonan: number
}

export interface TrendPermohonanPerBulan {
  bulan: string
  jumlah: number
}

export interface StatistikPermohonanCuti {
  totalPermohonan: number
  distribusiStatus: DistribusiStatus[]
  distribusiJenisCuti: DistribusiJenisCuti[]
  rataRataLamaCuti: number
  topPegawaiCutiTerbanyak: PegawaiCutiTerbanyak[]
  trendPermohonanPerBulan: TrendPermohonanPerBulan[]
}

// ===============================
// 📊 PERSETUJUAN CUTI
// ===============================
export interface DistribusiStatusPersetujuan {
  status: string
  jumlah: number
  persentase: number
}

export interface StatistikRoleApprover {
  role: string
  totalPersetujuan: number
  disetujui: number
  ditolak: number
  direvisi: number
  persentasePersetujuan: number
}

export interface StatistikPersetujuan {
  rataRataWaktuPersetujuan: number
  distribusiStatusPersetujuan: DistribusiStatusPersetujuan[]
  statistikRoleApprover: StatistikRoleApprover[]
  rataRataLangkahPersetujuan: number
}

// ===============================
// 📊 STATISTIK GABUNGAN
// ===============================
export interface StatistikGabungan {
  filterDigunakan: Record<string, any>
  permohonan: StatistikPermohonanCuti
  persetujuan: StatistikPersetujuan
  jatah: StatistikJatahCuti
  catatan: string
}

// ===============================
// 📊 PEMBUAT PERMOHONAN
// ===============================
export interface StatistikPembuatPermohonan {
  nama: string
  nip: string
  totalHari: number
  totalPermohonan: number
}

// ===============================
// 📊 DETAIL APPROVER
// ===============================
export interface StatistikDetailApprover {
  role: string
  totalPersetujuan: number
  disetujui: number
  ditolak: number
  direvisi: number
  persentasePersetujuan: number
}

// ===============================
// 📊 EFISIENSI PERSETUJUAN
// ===============================
export interface StatistikEfisiensiPersetujuan {
  rataRataWaktuPersetujuan: number
  rataRataLangkahPersetujuan: number
  filterDigunakan: Record<string, unknown>
  catatan: string
}

// ===============================
// 📊 PUNCAK PERMOHONAN
// ===============================
export interface StatistikPuncakPermohonan {
  bulan: string
  jumlah: number
}

// ===============================
// 📊 PREDIKSI KEBUTUHAN
// ===============================
export interface StatistikPrediksiKebutuhan {
  prediksiPermohonanTahunDepan: number
  rekomendasi: string
  filterDigunakan: Record<string, unknown>
}

// ===============================
// 📊 HEALTH CHECK
// ===============================
export interface StatistikHealthService {
  status: string
  totalPermohonan?: number
  rataRataWaktu?: number
  rataRataJatah?: number
}

export interface StatistikHealth {
  status: string
  responseTime: string
  timestamp: string
  services: {
    permohonan: StatistikHealthService
    persetujuan: StatistikHealthService
    jatah: StatistikHealthService
  }
  performance: {
    responseTime: number
    status: string
  }
}

// ===============================
// 📦 HOOK IMPLEMENTATIONS
// ===============================

const BASE_PATH_STATISTIK = 'kepegawaian/cuti/statistik'

const buildStatistikUrl = (path: string, filters: StatistikFilters): string => {
  const params = new URLSearchParams()
  for (const key in filters) {
    const value = filters[key as keyof StatistikFilters]
    if (value !== undefined && value !== null) params.append(key, String(value))
  }
  const qs = params.toString()
  console.log(qs)
  return `${BASE_PATH_STATISTIK}${path}${qs ? `?${qs}` : ''}`
}

// --- Dashboard ---
export const useDashboardStatistik = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<DashboardStatistik>>({
    queryKey: ['dashboardStatistik', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/dashboard', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Permohonan ---
export const useStatistikPermohonanCuti = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikPermohonanCuti>>({
    queryKey: ['statistikPermohonanCuti', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/permohonan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Persetujuan ---
export const useStatistikPersetujuan = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikPersetujuan>>({
    queryKey: ['statistikPersetujuan', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/persetujuan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Gabungan ---
export const useStatistikGabungan = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikGabungan>>({
    queryKey: ['statistikGabungan', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/gabungan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Jatah ---
export const useStatistikJatahCuti = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikJatahCuti>>({
    queryKey: ['statistikJatahCuti', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/jatah', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Pembuat Permohonan ---
export const useStatistikPembuatPermohonan = (filters: StatistikFilters = {}) =>
  useQuery<ApiListResponse<StatistikPembuatPermohonan>>({
    queryKey: ['statistikPembuatPermohonan', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/pembuat-permohonan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Detail Approver ---
export const useStatistikDetailApprover = (filters: StatistikFilters = {}) =>
  useQuery<ApiListResponse<StatistikDetailApprover>>({
    queryKey: ['statistikDetailApprover', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/detail-approver', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Efisiensi Persetujuan ---
export const useStatistikEfisiensiPersetujuan = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikEfisiensiPersetujuan>>({
    queryKey: ['statistikEfisiensiPersetujuan', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/efisiensi-persetujuan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Puncak Permohonan ---
export const useStatistikPuncakPermohonan = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikPuncakPermohonan[]>>({
    queryKey: ['statistikPuncakPermohonan', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/puncak-permohonan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Prediksi Kebutuhan ---
export const useStatistikPrediksiKebutuhan = (filters: StatistikFilters = {}) =>
  useQuery<ApiItemResponse<StatistikPrediksiKebutuhan>>({
    queryKey: ['statistikPrediksiKebutuhan', filters],
    queryFn: async () => (await api.get(buildStatistikUrl('/prediksi-kebutuhan', filters))).data,
    refetchOnWindowFocus: false,
  })

// --- Health Check ---
export const useStatistikHealthCheck = () =>
  useQuery<ApiItemResponse<StatistikHealth>>({
    queryKey: ['statistikHealthCheck'],
    queryFn: async () => (await api.get(buildStatistikUrl('/health', {}))).data,
    refetchOnWindowFocus: false,
  })
