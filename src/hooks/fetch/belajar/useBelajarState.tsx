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

// 1. Statistik Jenis Permohonan
export interface StatistikJenisPermohonanItem {
    jenis: string
    jumlah: number
    persentase: string
}

export interface StatistikJenisPermohonan {
    total_permohonan: number
    per_jenis: StatistikJenisPermohonanItem[]
    tahun: string
}

// 2. Distribusi Status Permohonan
export interface DistribusiStatusPermohonanItem {
    status: string
    jumlah: number
    persentase: string
}

export interface DistribusiStatusPermohonan {
    total_permohonan: number
    per_status: DistribusiStatusPermohonanItem[]
    tahun: string
}

// 3. Top Program Studi
export interface TopProgramStudiItem {
    program_studi_id: string
    nama_program_studi: string
    jenjang_pendidikan: string
    bidang_ilmu: string
    jumlah_permohonan: number
}

export interface TopProgramStudi {
    top_program_studi: TopProgramStudiItem[]
    tahun: string
}

// 4. Top Institusi Pendidikan
export interface TopInstitusiPendidikanItem {
    institusi_id: string
    nama_institusi: string
    kota: string
    negara: string
    jumlah_permohonan: number
}

export interface TopInstitusiPendidikan {
    top_institusi: TopInstitusiPendidikanItem[]
    tahun: string
}

// 5. Permohonan Per Unit Kerja
export interface PermohonanPerUnitKerjaItem {
    unit_kerja_id: string
    nama_unit_kerja: string
    jumlah_permohonan: number
}

export interface PermohonanPerUnitKerja {
    total_unit_kerja: number
    per_unit_kerja: PermohonanPerUnitKerjaItem[]
    tahun: string
}

// 6. Distribusi Biaya Ditanggung
export interface DistribusiBiayaDitanggungItem {
    biaya_ditanggung: string
    jumlah: number
    persentase: string
}

export interface DistribusiBiayaDitanggung {
    total_permohonan: number
    per_biaya: DistribusiBiayaDitanggungItem[]
    tahun: string
}

// 7. Trend Per Bulan
export interface TrendPerBulanItem {
    bulan: number
    nama_bulan: string
    total: number
    tugas_belajar: number
    izin_belajar: number
    disetujui: number
    ditolak: number
    menunggu: number
}

export interface TrendPerBulan {
    tahun: number
    trend_bulanan: TrendPerBulanItem[]
}

// 8. Rata-Rata Lama Studi
export interface RataRataLamaStudiPerJenjang {
    jenjang_pendidikan: string
    rata_rata_bulan: string
    jumlah_data: number
}

export interface RataRataLamaStudi {
    rata_rata_keseluruhan: string
    rata_rata_tugas_belajar: string
    rata_rata_izin_belajar: string
    per_jenjang: RataRataLamaStudiPerJenjang[]
    tahun: string
}

// 9. Pegawai Sedang Belajar
export interface PegawaiSedangBelajarItem {
    id_permohonan: string
    pegawai_id: string
    nama: string
    nip: string
    unit_kerja: string
    program_studi: string
    institusi_pendidikan: string
    tanggal_mulai: string
    tanggal_selesai: string
    [key: string]: any
}

export interface PegawaiSedangBelajar {
    total_pegawai_sedang_belajar: number
    daftar_pegawai: PegawaiSedangBelajarItem[]
}

// 10. Permohonan Akan Dimulai
export interface PermohonanAkanDimulaiItem {
    id_permohonan: string
    pegawai_id: string
    nama: string
    nip: string
    unit_kerja: string
    jenis_permohonan: string
    program_studi: string
    tanggal_mulai: string
    hari_hingga_mulai: number
}

export interface PermohonanAkanDimulai {
    total_permohonan: number
    periode_bulan: number
    daftar_permohonan: PermohonanAkanDimulaiItem[]
}

// 11. Statistik Status Persetujuan
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

// 12. Proyeksi 5 Tahun
export interface Proyeksi5TahunItem {
    tahun: number
    jumlah_permohonan: number
    tipe: 'aktual' | 'proyeksi'
}

export interface Proyeksi5Tahun {
    rata_rata_historis: string
    proyeksi: Proyeksi5TahunItem[]
}

// 13. Riwayat Pengajuan
export interface RiwayatPengajuanItem {
    id: string
    pegawai_id: string
    nama: string
    nip: string
    jenis_permohonan: string
    program_studi: string
    institusi_pendidikan: string
    tanggal_pengajuan: string
    status: string
    [key: string]: any
}

export interface RiwayatPengajuan {
    total: number
    page: number
    limit: number
    total_pages: number
    data: RiwayatPengajuanItem[]
}

// 14. Statistik Gelar Diperoleh
export interface StatistikGelarDiperolehItem {
    gelar: string
    jumlah: number
    persentase: string
}

export interface StatistikGelarDiperoleh {
    total_gelar: number
    per_gelar: StatistikGelarDiperolehItem[]
    tahun: string
}

// =========================================================================
// 🚀 STATISTIK IJIN BELAJAR HOOKS
// =========================================================================

/**
 * Hook untuk mengambil statistik jenis permohonan
 * GET /kepegawaian/ijinbelajar/statistik/statistik-jenis-permohonan
 */
export const useStatistikJenisPermohonan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikJenisPermohonan>>({
        queryKey: ['belajarStatistik', 'statistik-jenis-permohonan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/statistik-jenis-permohonan')
            return res.data as ApiItemResponse<StatistikJenisPermohonan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil distribusi status permohonan
 * GET /kepegawaian/ijinbelajar/statistik/distribusi-status-permohonan
 */
export const useDistribusiStatusPermohonan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DistribusiStatusPermohonan>>({
        queryKey: ['belajarStatistik', 'distribusi-status-permohonan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/distribusi-status-permohonan')
            return res.data as ApiItemResponse<DistribusiStatusPermohonan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil top program studi
 * GET /kepegawaian/ijinbelajar/statistik/top-program-studi
 */
export const useTopProgramStudi = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TopProgramStudi>>({
        queryKey: ['belajarStatistik', 'top-program-studi'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/top-program-studi')
            return res.data as ApiItemResponse<TopProgramStudi>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil top institusi pendidikan
 * GET /kepegawaian/ijinbelajar/statistik/top-institusi-pendidikan
 */
export const useTopInstitusiPendidikan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TopInstitusiPendidikan>>({
        queryKey: ['belajarStatistik', 'top-institusi-pendidikan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/top-institusi-pendidikan')
            return res.data as ApiItemResponse<TopInstitusiPendidikan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil permohonan per unit kerja
 * GET /kepegawaian/ijinbelajar/statistik/permohonan-per-unit-kerja
 */
export const usePermohonanPerUnitKerja = (filters?: StatistikUnitKerjaFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PermohonanPerUnitKerja>>({
        queryKey: ['belajarStatistik', 'permohonan-per-unit-kerja', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.unit_kerja) params.append('unit_kerja', filters.unit_kerja)
            if (filters?.id_unit_kerja) params.append('id_unit_kerja', filters.id_unit_kerja)
            
            const queryString = params.toString()
            const url = `/kepegawaian/ijinbelajar/statistik/permohonan-per-unit-kerja${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PermohonanPerUnitKerja>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil distribusi biaya ditanggung
 * GET /kepegawaian/ijinbelajar/statistik/distribusi-biaya-ditanggung
 */
export const useDistribusiBiayaDitanggung = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DistribusiBiayaDitanggung>>({
        queryKey: ['belajarStatistik', 'distribusi-biaya-ditanggung'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/distribusi-biaya-ditanggung')
            return res.data as ApiItemResponse<DistribusiBiayaDitanggung>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil trend per bulan
 * GET /kepegawaian/ijinbelajar/statistik/trend-per-bulan
 */
export const useTrendPerBulan = (filters?: StatistikBulanFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TrendPerBulan>>({
        queryKey: ['belajarStatistik', 'trend-per-bulan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.bulan) params.append('bulan', filters.bulan.toString())
            if (filters?.startDate) params.append('startDate', filters.startDate)
            if (filters?.endDate) params.append('endDate', filters.endDate)
            
            const queryString = params.toString()
            const url = `/kepegawaian/ijinbelajar/statistik/trend-per-bulan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TrendPerBulan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil rata-rata lama studi
 * GET /kepegawaian/ijinbelajar/statistik/rata-rata-lama-studi
 */
export const useRataRataLamaStudi = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RataRataLamaStudi>>({
        queryKey: ['belajarStatistik', 'rata-rata-lama-studi'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/rata-rata-lama-studi')
            return res.data as ApiItemResponse<RataRataLamaStudi>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil pegawai sedang belajar
 * GET /kepegawaian/ijinbelajar/statistik/pegawai-sedang-belajar
 */
export const usePegawaiSedangBelajar = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PegawaiSedangBelajar>>({
        queryKey: ['belajarStatistik', 'pegawai-sedang-belajar'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/pegawai-sedang-belajar')
            return res.data as ApiItemResponse<PegawaiSedangBelajar>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil permohonan akan dimulai
 * GET /kepegawaian/ijinbelajar/statistik/permohonan-akan-dimulai
 */
export const usePermohonanAkanDimulai = (filters?: { periode_bulan?: number }, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PermohonanAkanDimulai>>({
        queryKey: ['belajarStatistik', 'permohonan-akan-dimulai', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.periode_bulan) params.append('periode_bulan', filters.periode_bulan.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/ijinbelajar/statistik/permohonan-akan-dimulai${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PermohonanAkanDimulai>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik status persetujuan
 * GET /kepegawaian/ijinbelajar/statistik/statistik-status-persetujuan
 */
export const useStatistikStatusPersetujuan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatusPersetujuan>>({
        queryKey: ['belajarStatistik', 'statistik-status-persetujuan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/statistik-status-persetujuan')
            return res.data as ApiItemResponse<StatistikStatusPersetujuan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil proyeksi 5 tahun
 * GET /kepegawaian/ijinbelajar/statistik/proyeksi-5-tahun
 */
export const useProyeksi5Tahun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<Proyeksi5Tahun>>({
        queryKey: ['belajarStatistik', 'proyeksi-5-tahun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/proyeksi-5-tahun')
            return res.data as ApiItemResponse<Proyeksi5Tahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil riwayat pengajuan
 * GET /kepegawaian/ijinbelajar/statistik/riwayat-pengajuan
 */
export const useRiwayatPengajuan = (filters?: StatistikPegawaiFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPengajuan>>({
        queryKey: ['belajarStatistik', 'riwayat-pengajuan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.id_pegawai) params.append('id_pegawai', filters.id_pegawai)
            if (filters?.nip) params.append('nip', filters.nip)
            if (filters?.page) params.append('page', filters.page.toString())
            if (filters?.limit) params.append('limit', filters.limit.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/ijinbelajar/statistik/riwayat-pengajuan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<RiwayatPengajuan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik gelar diperoleh
 * GET /kepegawaian/ijinbelajar/statistik/statistik-gelar-diperoleh
 */
export const useStatistikGelarDiperoleh = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikGelarDiperoleh>>({
        queryKey: ['belajarStatistik', 'statistik-gelar-diperoleh'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/ijinbelajar/statistik/statistik-gelar-diperoleh')
            return res.data as ApiItemResponse<StatistikGelarDiperoleh>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

