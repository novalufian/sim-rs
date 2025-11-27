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

export interface StatistikGolonganFilter {
    golongan_id?: string
    kode_golongan?: string
}

// =========================================================================
// 📊 RESPONSE TYPES
// =========================================================================

// 1. Total Biaya Per Tahun
export interface DetailPerBulan {
    bulan: number
    nama_bulan: string
    jumlah_kgb: number
    total_selisih_bulanan: string
    total_biaya_tahunan: string
}

export interface TotalBiayaPerTahun {
    tahun: number
    total_kgb: number
    total_selisih_gaji_bulanan: string
    total_biaya_tahunan: string
    rata_rata_selisih_per_pegawai: string
    detail_per_bulan: DetailPerBulan[]
}

// 2. Rata-Rata Kenaikan Gaji
export interface RataRataKenaikanGaji {
    total_kgb: number
    rata_rata_selisih_gaji: string
    rata_rata_persentase_kenaikan: string
    min_kenaikan: string
    max_kenaikan: string
    tahun: string
}

// 3. Distribusi Per Golongan
export interface DistribusiPerGolonganItem {
    golongan_id: string
    kode: string
    nama: string
    jumlah_kgb: number
    total_selisih_bulanan: string
    total_biaya_tahunan: string
    rata_rata_selisih: string
    min_selisih: string
    max_selisih: string
}

export interface DistribusiPerGolongan {
    per_golongan: DistribusiPerGolonganItem[]
    tahun: string
}

// 4. Trend Biaya Per Bulan
export interface TrendBiayaPerBulanItem {
    bulan: number
    nama_bulan: string
    jumlah_kgb: number
    total_selisih_bulanan: string
    total_biaya_tahunan: string
}

export interface TrendBiayaPerBulan {
    tahun: number
    trend_bulanan: TrendBiayaPerBulanItem[]
}

// 5. Proyeksi 5 Tahun
export interface Proyeksi5TahunItem {
    tahun: number
    jumlah_kgb: number
    total_biaya_tahunan: string
    tipe: 'aktual' | 'proyeksi'
}

export interface Proyeksi5Tahun {
    rata_rata_biaya_tahunan_historis: string
    rata_rata_jumlah_kgb_historis: string
    proyeksi: Proyeksi5TahunItem[]
}

// 6. Per Unit Kerja
export interface PerUnitKerjaItem {
    unit_kerja_id: string
    nama_unit_kerja: string
    jumlah_kgb: number
    total_selisih_bulanan: string
    total_biaya_tahunan: string
    rata_rata_per_pegawai: string
}

export interface PerUnitKerja {
    per_unit_kerja: PerUnitKerjaItem[]
    tahun: string
}

// 7. Statistik Status
export interface StatistikStatusItem {
    status: string
    jumlah: number
    persentase: string
}

export interface StatistikStatus {
    total_kgb: number
    per_status: StatistikStatusItem[]
    tahun: string
}

// 8. Pegawai Akan Naik Gaji
export interface PegawaiAkanNaikGajiItem {
    id_kgb: string
    pegawai_id: string
    nama: string
    nip: string
    unit_kerja: string
    golongan: string
    tmt_kgb_baru: string
    gaji_pokok_lama: number
    gaji_pokok_baru: number
    selisih_gaji: string
    biaya_tahunan: string
    hari_hingga_tmt: number
}

export interface PegawaiAkanNaikGaji {
    total_pegawai: number
    periode_bulan: number
    daftar_pegawai: PegawaiAkanNaikGajiItem[]
}

// 9. Perbandingan Gaji
export interface GajiStatistik {
    total: string
    rata_rata: string
    min: string
    max: string
}

export interface PersentaseKenaikan {
    rata_rata: string
    min: string
    max: string
}

export interface PerbandinganGaji {
    total_kgb: number
    gaji_lama: GajiStatistik
    gaji_baru: GajiStatistik
    selisih: GajiStatistik
    persentase_kenaikan: PersentaseKenaikan
    total_biaya_tahunan: string
    tahun: string
}

// 10. Total Pengeluaran Gaji
export interface TotalPengeluaranGaji {
    total_kgb: number
    total_gaji_pokok_bulanan: string
    total_gaji_pokok_tahunan: string
    rata_rata_gaji_per_pegawai: string
    tahun: string
}

// 11. Statistik Disetujui Vs Pending
export interface StatusStatistik {
    jumlah: number
    persentase: string
    total_selisih_bulanan?: string
    total_biaya_tahunan?: string
}

export interface StatistikDisetujuiVsPending {
    total_kgb: number
    disetujui: StatusStatistik
    pending: StatusStatistik
    ditolak: StatusStatistik
    approval_rate: string
    tahun: string
}

// 12. Analisis Biaya Per Golongan
export interface GajiLamaBaru {
    total: string
    rata_rata: string
}

export interface SelisihDetail {
    total: string
    rata_rata: string
    min: string
    max: string
}

export interface AnalisisBiayaPerGolonganItem {
    golongan_id: string
    kode: string
    nama: string
    jumlah_kgb: number
    gaji_lama: GajiLamaBaru
    gaji_baru: GajiLamaBaru
    selisih: SelisihDetail
    biaya_tahunan: string
    persentase_kenaikan: PersentaseKenaikan
}

export interface AnalisisBiayaPerGolongan {
    per_golongan: AnalisisBiayaPerGolonganItem[]
    tahun: string
}

// 13. Statistik Per Tahun
export interface PeriodeTahun {
    tahun_mulai: number
    tahun_selesai: number
}

export interface StatistikPerTahunItem {
    tahun: number
    jumlah_kgb: number
    total_selisih_bulanan: string
    total_biaya_tahunan: string
    selisih_list: number[]
    rata_rata_selisih: string
}

export interface StatistikPerTahun {
    periode: PeriodeTahun
    per_tahun: StatistikPerTahunItem[]
}

// =========================================================================
// 🚀 STATISTIK KENAIKAN GAJI BERKALA HOOKS
// =========================================================================

/**
 * Hook untuk mengambil total biaya per tahun
 * GET /kepegawaian/gajiberkala/statistik/total-biaya-per-tahun
 */
export const useTotalBiayaPerTahun = (filters?: StatistikTahunFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TotalBiayaPerTahun>>({
        queryKey: ['gajiStatistik', 'total-biaya-per-tahun', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.startYear) params.append('startYear', filters.startYear.toString())
            if (filters?.endYear) params.append('endYear', filters.endYear.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/gajiberkala/statistik/total-biaya-per-tahun${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TotalBiayaPerTahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil rata-rata kenaikan gaji
 * GET /kepegawaian/gajiberkala/statistik/rata-rata-kenaikan-gaji
 */
export const useRataRataKenaikanGaji = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RataRataKenaikanGaji>>({
        queryKey: ['gajiStatistik', 'rata-rata-kenaikan-gaji'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/rata-rata-kenaikan-gaji')
            return res.data as ApiItemResponse<RataRataKenaikanGaji>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil distribusi per golongan
 * GET /kepegawaian/gajiberkala/statistik/distribusi-per-golongan
 */
export const useDistribusiPerGolongan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DistribusiPerGolongan>>({
        queryKey: ['gajiStatistik', 'distribusi-per-golongan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/distribusi-per-golongan')
            return res.data as ApiItemResponse<DistribusiPerGolongan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil trend biaya per bulan
 * GET /kepegawaian/gajiberkala/statistik/trend-biaya-per-bulan
 */
export const useTrendBiayaPerBulan = (filters?: StatistikBulanFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TrendBiayaPerBulan>>({
        queryKey: ['gajiStatistik', 'trend-biaya-per-bulan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.bulan) params.append('bulan', filters.bulan.toString())
            if (filters?.startDate) params.append('startDate', filters.startDate)
            if (filters?.endDate) params.append('endDate', filters.endDate)
            
            const queryString = params.toString()
            const url = `/kepegawaian/gajiberkala/statistik/trend-biaya-per-bulan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TrendBiayaPerBulan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil proyeksi 5 tahun
 * GET /kepegawaian/gajiberkala/statistik/proyeksi-5-tahun
 */
export const useProyeksi5Tahun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<Proyeksi5Tahun>>({
        queryKey: ['gajiStatistik', 'proyeksi-5-tahun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/proyeksi-5-tahun')
            return res.data as ApiItemResponse<Proyeksi5Tahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik per unit kerja
 * GET /kepegawaian/gajiberkala/statistik/per-unit-kerja
 */
export const usePerUnitKerja = (filters?: StatistikUnitKerjaFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PerUnitKerja>>({
        queryKey: ['gajiStatistik', 'per-unit-kerja', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.unit_kerja) params.append('unit_kerja', filters.unit_kerja)
            if (filters?.id_unit_kerja) params.append('id_unit_kerja', filters.id_unit_kerja)
            
            const queryString = params.toString()
            const url = `/kepegawaian/gajiberkala/statistik/per-unit-kerja${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PerUnitKerja>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik status
 * GET /kepegawaian/gajiberkala/statistik/statistik-status
 */
export const useStatistikStatus = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatus>>({
        queryKey: ['gajiStatistik', 'statistik-status'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/statistik-status')
            return res.data as ApiItemResponse<StatistikStatus>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil pegawai akan naik gaji
 * GET /kepegawaian/gajiberkala/statistik/pegawai-akan-naik-gaji
 */
export const usePegawaiAkanNaikGaji = (filters?: { periode_bulan?: number }, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PegawaiAkanNaikGaji>>({
        queryKey: ['gajiStatistik', 'pegawai-akan-naik-gaji', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.periode_bulan) params.append('periode_bulan', filters.periode_bulan.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/gajiberkala/statistik/pegawai-akan-naik-gaji${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PegawaiAkanNaikGaji>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil perbandingan gaji
 * GET /kepegawaian/gajiberkala/statistik/perbandingan-gaji
 */
export const usePerbandinganGaji = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PerbandinganGaji>>({
        queryKey: ['gajiStatistik', 'perbandingan-gaji'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/perbandingan-gaji')
            return res.data as ApiItemResponse<PerbandinganGaji>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil total pengeluaran gaji
 * GET /kepegawaian/gajiberkala/statistik/total-pengeluaran-gaji
 */
export const useTotalPengeluaranGaji = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TotalPengeluaranGaji>>({
        queryKey: ['gajiStatistik', 'total-pengeluaran-gaji'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/total-pengeluaran-gaji')
            return res.data as ApiItemResponse<TotalPengeluaranGaji>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik disetujui vs pending
 * GET /kepegawaian/gajiberkala/statistik/statistik-disetujui-vs-pending
 */
export const useStatistikDisetujuiVsPending = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikDisetujuiVsPending>>({
        queryKey: ['gajiStatistik', 'statistik-disetujui-vs-pending'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/statistik-disetujui-vs-pending')
            return res.data as ApiItemResponse<StatistikDisetujuiVsPending>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil analisis biaya per golongan
 * GET /kepegawaian/gajiberkala/statistik/analisis-biaya-per-golongan
 */
export const useAnalisisBiayaPerGolongan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<AnalisisBiayaPerGolongan>>({
        queryKey: ['gajiStatistik', 'analisis-biaya-per-golongan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/gajiberkala/statistik/analisis-biaya-per-golongan')
            return res.data as ApiItemResponse<AnalisisBiayaPerGolongan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik per tahun
 * GET /kepegawaian/gajiberkala/statistik/statistik-per-tahun
 */
export const useStatistikPerTahun = (filters?: StatistikTahunFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikPerTahun>>({
        queryKey: ['gajiStatistik', 'statistik-per-tahun', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.startYear) params.append('startYear', filters.startYear.toString())
            if (filters?.endYear) params.append('endYear', filters.endYear.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/gajiberkala/statistik/statistik-per-tahun${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<StatistikPerTahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

