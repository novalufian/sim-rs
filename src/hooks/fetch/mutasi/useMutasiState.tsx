import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

// =========================================================================
// 🧩 TYPES
// =========================================================================

// --- Standard API Response Types ---
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

// Filter types untuk statistik
export interface StatistikTahunFilter {
    tahun?: number
    startYear?: number
    endYear?: number
}

export interface StatistikBulanFilter {
    tahun?: number
    bulan?: number
    startDate?: string
    endDate?: string
}

export interface StatistikPegawaiFilter {
    id_pegawai?: string
    nip?: string
    page?: number
    limit?: number
}

export interface StatistikUnitKerjaFilter {
    unit_kerja?: string
    id_unit_kerja?: string
}

// =========================================================================
// 📊 RESPONSE TYPES
// =========================================================================

// 1. Statistik Status Mutasi
export interface StatistikStatusItem {
    status: string
    jumlah: number
    persentase: string
}

export interface StatistikStatus {
    total_permohonan: number
    per_status: StatistikStatusItem[]
    tahun: string
}

// 2. Top Instansi Tujuan
export interface TopInstansiTujuanItem {
    instansi_tujuan: string
    jumlah_permohonan: number
}

export interface TopInstansiTujuan {
    top_instansi: TopInstansiTujuanItem[]
    tahun: string
}

// 3. Per Unit Kerja Asal
export interface PerUnitKerjaAsalItem {
    unit_kerja_id: string
    nama_unit_kerja: string
    total_mutasi: number
    disetujui: number
    pending: number
    ditolak: number
    persentase_disetujui: string
}

export interface PerUnitKerjaAsal {
    per_unit_kerja: PerUnitKerjaAsalItem[]
    tahun: string
}

// 4. Trend Per Bulan
export interface TrendPerBulanItem {
    bulan: number
    nama_bulan: string
    total: number
    disetujui: number
    ditolak: number
    pending: number
}

export interface TrendPerBulan {
    tahun: number
    trend_bulanan: TrendPerBulanItem[]
}

// 5. SLA Persetujuan (placeholder - response tidak diberikan)
export interface SLAPersetujuan {
    rata_rata_hari: number
    min_hari: number
    max_hari: number
    per_level: Array<{
        level: number
        rata_rata_hari: number
        jumlah: number
    }>
    tahun: string
}

// 6. Statistik Status Persetujuan
export interface StatistikStatusPersetujuanItem {
    urutan: number
    menunggu: number
    disetujui: number
    ditolak: number
    direvisi: number
    total: number
    persentase_menunggu: string
    persentase_disetujui: string
    persentase_ditolak: string
}

export interface StatistikStatusPersetujuan {
    per_level: StatistikStatusPersetujuanItem[]
    tahun: string
}

// 7. Statistik Disetujui vs Pending
export interface StatistikDisetujuiVsPending {
    total_permohonan: number
    disetujui: {
        jumlah: number
        persentase: string
    }
    pending: {
        jumlah: number
        persentase: string
    }
    ditolak: {
        jumlah: number
        persentase: string
    }
    approval_rate: string
    tahun: string
}

// 8. Proyeksi 5 Tahun
export interface Proyeksi5TahunItem {
    tahun: number
    jumlah_permohonan: number
    tipe: 'aktual' | 'proyeksi'
}

export interface Proyeksi5Tahun {
    rata_rata_historis: string
    proyeksi: Proyeksi5TahunItem[]
}

// 9. Riwayat Pegawai (placeholder - response tidak diberikan)
export interface RiwayatPegawaiItem {
    id: string
    pegawai_id: string
    nama: string
    nip: string
    jenis_mutasi: string
    instansi_tujuan: string
    tanggal_pengajuan: string
    status: string
    [key: string]: any
}

export interface RiwayatPegawai {
    total: number
    page: number
    limit: number
    total_pages: number
    data: RiwayatPegawaiItem[]
}

// 10. Statistik Per Tahun
export interface StatistikPerTahunItem {
    tahun: number
    total: number
    disetujui: number
    ditolak: number
    pending: number
}

export interface StatistikPerTahun {
    periode: {
        tahun_mulai: number
        tahun_selesai: number
    }
    per_tahun: StatistikPerTahunItem[]
}

// =========================================================================
// 🚀 STATISTIK MUTASI HOOKS
// =========================================================================

/**
 * Hook untuk mengambil statistik status mutasi
 * GET /kepegawaian/mutasi/statistik/statistik-status
 */
export const useStatistikStatus = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatus>>({
        queryKey: ['mutasiStatistik', 'statistik-status'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/mutasi/statistik/statistik-status')
            return res.data as ApiItemResponse<StatistikStatus>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil top instansi tujuan
 * GET /kepegawaian/mutasi/statistik/top-instansi-tujuan
 */
export const useTopInstansiTujuan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TopInstansiTujuan>>({
        queryKey: ['mutasiStatistik', 'top-instansi-tujuan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/mutasi/statistik/top-instansi-tujuan')
            return res.data as ApiItemResponse<TopInstansiTujuan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil mutasi per unit kerja asal
 * GET /kepegawaian/mutasi/statistik/per-unit-kerja-asal
 */
export const usePerUnitKerjaAsal = (filters?: StatistikUnitKerjaFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PerUnitKerjaAsal>>({
        queryKey: ['mutasiStatistik', 'per-unit-kerja-asal', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.unit_kerja) params.append('unit_kerja', filters.unit_kerja)
            if (filters?.id_unit_kerja) params.append('id_unit_kerja', filters.id_unit_kerja)
            
            const queryString = params.toString()
            const url = `/kepegawaian/mutasi/statistik/per-unit-kerja-asal${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PerUnitKerjaAsal>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil trend per bulan
 * GET /kepegawaian/mutasi/statistik/trend-per-bulan
 */
export const useTrendPerBulan = (filters?: StatistikBulanFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TrendPerBulan>>({
        queryKey: ['mutasiStatistik', 'trend-per-bulan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.bulan) params.append('bulan', filters.bulan.toString())
            if (filters?.startDate) params.append('startDate', filters.startDate)
            if (filters?.endDate) params.append('endDate', filters.endDate)
            
            const queryString = params.toString()
            const url = `/kepegawaian/mutasi/statistik/trend-per-bulan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TrendPerBulan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil SLA persetujuan
 * GET /kepegawaian/mutasi/statistik/sla-persetujuan
 */
export const useSLAPersetujuan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<SLAPersetujuan>>({
        queryKey: ['mutasiStatistik', 'sla-persetujuan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/mutasi/statistik/sla-persetujuan')
            return res.data as ApiItemResponse<SLAPersetujuan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik status persetujuan
 * GET /kepegawaian/mutasi/statistik/statistik-status-persetujuan
 */
export const useStatistikStatusPersetujuan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatusPersetujuan>>({
        queryKey: ['mutasiStatistik', 'statistik-status-persetujuan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/mutasi/statistik/statistik-status-persetujuan')
            return res.data as ApiItemResponse<StatistikStatusPersetujuan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik disetujui vs pending
 * GET /kepegawaian/mutasi/statistik/statistik-disetujui-vs-pending
 */
export const useStatistikDisetujuiVsPending = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikDisetujuiVsPending>>({
        queryKey: ['mutasiStatistik', 'statistik-disetujui-vs-pending'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/mutasi/statistik/statistik-disetujui-vs-pending')
            return res.data as ApiItemResponse<StatistikDisetujuiVsPending>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil proyeksi 5 tahun
 * GET /kepegawaian/mutasi/statistik/proyeksi-5-tahun
 */
export const useProyeksi5Tahun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<Proyeksi5Tahun>>({
        queryKey: ['mutasiStatistik', 'proyeksi-5-tahun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/mutasi/statistik/proyeksi-5-tahun')
            return res.data as ApiItemResponse<Proyeksi5Tahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil riwayat pegawai
 * GET /kepegawaian/mutasi/statistik/riwayat-pegawai
 */
export const useRiwayatPegawai = (filters?: StatistikPegawaiFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPegawai>>({
        queryKey: ['mutasiStatistik', 'riwayat-pegawai', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.id_pegawai) params.append('id_pegawai', filters.id_pegawai)
            if (filters?.nip) params.append('nip', filters.nip)
            if (filters?.page) params.append('page', filters.page.toString())
            if (filters?.limit) params.append('limit', filters.limit.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/mutasi/statistik/riwayat-pegawai${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<RiwayatPegawai>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik per tahun
 * GET /kepegawaian/mutasi/statistik/statistik-per-tahun
 */
export const useStatistikPerTahun = (filters?: StatistikTahunFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikPerTahun>>({
        queryKey: ['mutasiStatistik', 'statistik-per-tahun', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.startYear) params.append('startYear', filters.startYear.toString())
            if (filters?.endYear) params.append('endYear', filters.endYear.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/mutasi/statistik/statistik-per-tahun${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<StatistikPerTahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

