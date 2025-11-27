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
}

export interface StatistikUnitKerjaFilter {
    unit_kerja?: string
    id_unit_kerja?: string
}

// Response types untuk berbagai statistik
export interface DistribusiStatusPernikahanItem {
    status: string
    jumlah: number
    persentase: string
}

export interface DistribusiStatusPernikahan {
    total_pegawai: number
    per_status: DistribusiStatusPernikahanItem[]
}

export interface PeriodeTahun {
    tahun_mulai: number
    tahun_selesai: number
}

export interface StatistikPernikahanPerTahunItem {
    tahun: number
    total: number
    pasangan_pria: number
    pasangan_wanita: number
}

export interface StatistikPernikahanPerTahun {
    periode: PeriodeTahun
    per_tahun: StatistikPernikahanPerTahunItem[]
}

export interface StatistikPerceraianPerTahunItem {
    tahun: number
    total: number
    cerai_hidup: number
    cerai_mati: number
    putusan_pengadilan: number
    kematian: number
    lain_lain: number
}

export interface StatistikPerceraianPerTahun {
    periode: PeriodeTahun
    per_tahun: StatistikPerceraianPerTahunItem[]
}

export interface TrendPernikahanPerBulanItem {
    bulan: number
    nama_bulan: string
    jumlah: number
}

export interface TrendPernikahanPerBulan {
    tahun: number
    trend_bulanan: TrendPernikahanPerBulanItem[]
}

export interface TrendPerceraianPerBulanItem {
    bulan: number
    nama_bulan: string
    jumlah: number
    putusan_pengadilan: number
    kematian: number
    lain_lain: number
}

export interface TrendPerceraianPerBulan {
    tahun: number
    trend_bulanan: TrendPerceraianPerBulanItem[]
}

export interface DistribusiAlasanPerceraianItem {
    alasan: string
    jumlah: number
    persentase: string
}

export interface DistribusiAlasanPerceraian {
    total_perceraian: number
    per_alasan: DistribusiAlasanPerceraianItem[]
    tahun: string
}

export interface RataRataUsiaPernikahan {
    total_data: number
    rata_rata_usia: string
    min_usia: string
    max_usia: string
    pria: {
        rata_rata: string
        jumlah: number
    }
    wanita: {
        rata_rata: string
        jumlah: number
    }
    tahun: string
}

export interface RataRataDurasiPernikahan {
    total_data: number
    rata_rata_hari: string
    rata_rata_tahun: string
    min_hari: string
    max_hari: string
    tahun: string
}

export interface StatistikStatusPersetujuanPernikahan {
    status: string
    jumlah: number
    persentase: number
}

export interface StatistikStatusPersetujuanPerceraian {
    status: string
    jumlah: number
    persentase: number
}

export interface RiwayatPernikahanPegawai {
    id: string
    pegawai_id: string
    pegawai_nama: string
    pegawai_nip: string
    pasangan_nama: string
    tanggal_menikah: string
    status_saat_ini: string
    [key: string]: any
}

export interface RiwayatPerceraianPegawai {
    id: string
    pegawai_id: string
    pegawai_nama: string
    pegawai_nip: string
    tanggal_cerai: string
    alasan_perceraian: string
    status_saat_ini: string
    [key: string]: any
}

export interface ProyeksiPernikahan5TahunItem {
    tahun: number
    jumlah_pernikahan: number
    tipe: 'aktual' | 'proyeksi'
}

export interface ProyeksiPernikahan5Tahun {
    rata_rata_historis: string
    proyeksi: ProyeksiPernikahan5TahunItem[]
}

export interface PerbandinganPernikahanVsPerceraian {
    tahun: string
    total_pernikahan: number
    total_perceraian: number
    rasio_perceraian: string
    selisih: number
}

export interface StatistikPerUnitKerja {
    unit_kerja: string
    id_unit_kerja?: string
    jumlah_pernikahan: number
    jumlah_perceraian: number
    total_pegawai: number
    persentase_pernikahan: number
    persentase_perceraian: number
}

// =========================================================================
// 🚀 STATISTIK KAWIN CERAI HOOKS
// =========================================================================

/**
 * Hook untuk mengambil distribusi status pernikahan
 * GET /kepegawaian/kawincerai/statistik/distribusi-status-pernikahan
 */
export const useDistribusiStatusPernikahan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DistribusiStatusPernikahan>>({
        queryKey: ['kawinStatistik', 'distribusi-status-pernikahan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/distribusi-status-pernikahan')
            return res.data as ApiItemResponse<DistribusiStatusPernikahan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // Cache 5 menit
    })
}

/**
 * Hook untuk mengambil statistik pernikahan per tahun
 * GET /kepegawaian/kawincerai/statistik/statistik-pernikahan-per-tahun
 */
export const useStatistikPernikahanPerTahun = (filters?: StatistikTahunFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikPernikahanPerTahun>>({
        queryKey: ['kawinStatistik', 'statistik-pernikahan-per-tahun', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.startYear) params.append('startYear', filters.startYear.toString())
            if (filters?.endYear) params.append('endYear', filters.endYear.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/statistik-pernikahan-per-tahun${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<StatistikPernikahanPerTahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik perceraian per tahun
 * GET /kepegawaian/kawincerai/statistik/statistik-perceraian-per-tahun
 */
export const useStatistikPerceraianPerTahun = (filters?: StatistikTahunFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikPerceraianPerTahun>>({
        queryKey: ['kawinStatistik', 'statistik-perceraian-per-tahun', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.startYear) params.append('startYear', filters.startYear.toString())
            if (filters?.endYear) params.append('endYear', filters.endYear.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/statistik-perceraian-per-tahun${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<StatistikPerceraianPerTahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil trend pernikahan per bulan
 * GET /kepegawaian/kawincerai/statistik/trend-pernikahan-per-bulan
 */
export const useTrendPernikahanPerBulan = (filters?: StatistikBulanFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TrendPernikahanPerBulan>>({
        queryKey: ['kawinStatistik', 'trend-pernikahan-per-bulan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.bulan) params.append('bulan', filters.bulan.toString())
            if (filters?.startDate) params.append('startDate', filters.startDate)
            if (filters?.endDate) params.append('endDate', filters.endDate)
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/trend-pernikahan-per-bulan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TrendPernikahanPerBulan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil trend perceraian per bulan
 * GET /kepegawaian/kawincerai/statistik/trend-perceraian-per-bulan
 */
export const useTrendPerceraianPerBulan = (filters?: StatistikBulanFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TrendPerceraianPerBulan>>({
        queryKey: ['kawinStatistik', 'trend-perceraian-per-bulan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.bulan) params.append('bulan', filters.bulan.toString())
            if (filters?.startDate) params.append('startDate', filters.startDate)
            if (filters?.endDate) params.append('endDate', filters.endDate)
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/trend-perceraian-per-bulan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TrendPerceraianPerBulan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil distribusi alasan perceraian
 * GET /kepegawaian/kawincerai/statistik/distribusi-alasan-perceraian
 */
export const useDistribusiAlasanPerceraian = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DistribusiAlasanPerceraian>>({
        queryKey: ['kawinStatistik', 'distribusi-alasan-perceraian'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/distribusi-alasan-perceraian')
            return res.data as ApiItemResponse<DistribusiAlasanPerceraian>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil rata-rata usia pernikahan
 * GET /kepegawaian/kawincerai/statistik/rata-rata-usia-pernikahan
 */
export const useRataRataUsiaPernikahan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RataRataUsiaPernikahan>>({
        queryKey: ['kawinStatistik', 'rata-rata-usia-pernikahan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/rata-rata-usia-pernikahan')
            return res.data as ApiItemResponse<RataRataUsiaPernikahan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil rata-rata durasi pernikahan
 * GET /kepegawaian/kawincerai/statistik/rata-rata-durasi-pernikahan
 */
export const useRataRataDurasiPernikahan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RataRataDurasiPernikahan>>({
        queryKey: ['kawinStatistik', 'rata-rata-durasi-pernikahan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/rata-rata-durasi-pernikahan')
            return res.data as ApiItemResponse<RataRataDurasiPernikahan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik status persetujuan pernikahan
 * GET /kepegawaian/kawincerai/statistik/statistik-status-persetujuan-pernikahan
 */
export const useStatistikStatusPersetujuanPernikahan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatusPersetujuanPernikahan[]>>({
        queryKey: ['kawinStatistik', 'statistik-status-persetujuan-pernikahan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/statistik-status-persetujuan-pernikahan')
            return res.data as ApiItemResponse<StatistikStatusPersetujuanPernikahan[]>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik status persetujuan perceraian
 * GET /kepegawaian/kawincerai/statistik/statistik-status-persetujuan-perceraian
 */
export const useStatistikStatusPersetujuanPerceraian = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatusPersetujuanPerceraian[]>>({
        queryKey: ['kawinStatistik', 'statistik-status-persetujuan-perceraian'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/statistik-status-persetujuan-perceraian')
            return res.data as ApiItemResponse<StatistikStatusPersetujuanPerceraian[]>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil riwayat pernikahan pegawai
 * GET /kepegawaian/kawincerai/statistik/riwayat-pernikahan-pegawai
 */
export const useRiwayatPernikahanPegawai = (filters?: StatistikPegawaiFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPernikahanPegawai[]>>({
        queryKey: ['kawinStatistik', 'riwayat-pernikahan-pegawai', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.id_pegawai) params.append('id_pegawai', filters.id_pegawai)
            if (filters?.nip) params.append('nip', filters.nip)
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/riwayat-pernikahan-pegawai${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<RiwayatPernikahanPegawai[]>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil riwayat perceraian pegawai
 * GET /kepegawaian/kawincerai/statistik/riwayat-perceraian-pegawai
 */
export const useRiwayatPerceraianPegawai = (filters?: StatistikPegawaiFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPerceraianPegawai[]>>({
        queryKey: ['kawinStatistik', 'riwayat-perceraian-pegawai', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.id_pegawai) params.append('id_pegawai', filters.id_pegawai)
            if (filters?.nip) params.append('nip', filters.nip)
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/riwayat-perceraian-pegawai${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<RiwayatPerceraianPegawai[]>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil proyeksi pernikahan 5 tahun
 * GET /kepegawaian/kawincerai/statistik/proyeksi-pernikahan-5-tahun
 */
export const useProyeksiPernikahan5Tahun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<ProyeksiPernikahan5Tahun>>({
        queryKey: ['kawinStatistik', 'proyeksi-pernikahan-5-tahun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/kawincerai/statistik/proyeksi-pernikahan-5-tahun')
            return res.data as ApiItemResponse<ProyeksiPernikahan5Tahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil perbandingan pernikahan vs perceraian
 * GET /kepegawaian/kawincerai/statistik/perbandingan-pernikahan-vs-perceraian
 */
export const usePerbandinganPernikahanVsPerceraian = (filters?: StatistikTahunFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PerbandinganPernikahanVsPerceraian>>({
        queryKey: ['kawinStatistik', 'perbandingan-pernikahan-vs-perceraian', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.startYear) params.append('startYear', filters.startYear.toString())
            if (filters?.endYear) params.append('endYear', filters.endYear.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/perbandingan-pernikahan-vs-perceraian${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PerbandinganPernikahanVsPerceraian>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik per unit kerja
 * GET /kepegawaian/kawincerai/statistik/statistik-per-unit-kerja
 */
export const useStatistikPerUnitKerja = (filters?: StatistikUnitKerjaFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikPerUnitKerja[]>>({
        queryKey: ['kawinStatistik', 'statistik-per-unit-kerja', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.unit_kerja) params.append('unit_kerja', filters.unit_kerja)
            if (filters?.id_unit_kerja) params.append('id_unit_kerja', filters.id_unit_kerja)
            
            const queryString = params.toString()
            const url = `/kepegawaian/kawincerai/statistik/statistik-per-unit-kerja${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<StatistikPerUnitKerja[]>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

