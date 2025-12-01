import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// =========================================================================
// 📊 STATISTIK TYPES
// =========================================================================

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

export interface StatistikPeriodeFilter {
    periode?: string // e.g., "1tahun", "6bulan", etc.
}

// =========================================================================
// 🧩 TYPES
// =========================================================================

// --- Standard API Response Types ---
export interface ApiListResponse<T> {
    success: boolean
    message: string
    data: {
        items: T[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
}

export interface ApiItemResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface PensiunStateFilters {
    id_pegawai?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

// Tipe data dasar State Pensiun
export interface PensiunState {
    id: string
    id_pegawai: string
    status: string
    tanggal_efektif: Date | string | null
    catatan: string | null
    is_deleted: boolean
    created_at: string
    updated_at: string
    created_by: string | null
    updated_by: string | null
}

// Tipe data State Pensiun yang diperkaya dengan Relasi
export interface PensiunStateWithRelations extends PensiunState {
    // Data relasi Pegawai
    pegawai_nama?: string
    pegawai_nip?: string
    
    // Data relasi lainnya jika ada
    [key: string]: any
}

// Input types
export interface PensiunStateInput {
    id_pegawai: string
    status: string
    tanggal_efektif?: string | Date
    catatan?: string
}

// =========================================================================
// 🚀 STATE PENSIUN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar State Pensiun
 * GET /api/kepegawaian/pensiun/state
 */
export const usePensiunStateList = (filters: PensiunStateFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<PensiunStateWithRelations>>({
        queryKey: ['pensiunState', filters],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...Object.entries(otherFilters).reduce((acc: Record<string, string>, [key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        acc[key] = String(value)
                    }
                    return acc
                }, {}),
            })

            const res = await api.get(`/kepegawaian/pensiun/state?${params.toString()}`)
            return res.data as ApiListResponse<PensiunStateWithRelations>
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail State Pensiun
 * GET /api/kepegawaian/pensiun/state/:id
 */
export const useGetPensiunStateDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PensiunStateWithRelations>>({
        queryKey: ['pensiunState', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/state/${id}`)
            return res.data as ApiItemResponse<PensiunStateWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan State Pensiun berdasarkan ID Pegawai
 * GET /api/kepegawaian/pensiun/state/pegawai/:id_pegawai
 */
export const useGetPensiunStateByPegawai = (id_pegawai: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PensiunStateWithRelations>>({
        queryKey: ['pensiunState', 'pegawai', id_pegawai],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/state/pegawai/${id_pegawai}`)
            return res.data as ApiItemResponse<PensiunStateWithRelations>
        },
        enabled: enabled && !!id_pegawai,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat State Pensiun baru
 * POST /api/kepegawaian/pensiun/state
 */
export const useCreatePensiunState = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<PensiunStateWithRelations>, any, PensiunStateInput>({
        mutationFn: async (formData: PensiunStateInput) => {
            const res = await api.post('/kepegawaian/pensiun/state', formData)
            return res.data
        },
        onSuccess: (response) => {
            const state = response.data
            toast.success('✅ State pensiun berhasil ditambahkan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['pensiunState'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menambahkan state pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui State Pensiun
 * PUT /api/kepegawaian/pensiun/state/:id
 */
export const useUpdatePensiunState = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<PensiunStateWithRelations>, any, { id: string; formData: Partial<PensiunStateInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/pensiun/state/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const state = response.data
            toast.success('✅ State pensiun berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['pensiunState'] })
            queryClient.invalidateQueries({ queryKey: ['pensiunState', state.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate state pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus State Pensiun
 * DELETE /api/kepegawaian/pensiun/state/:id
 */
export const useDeletePensiunState = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<PensiunStateWithRelations>, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/pensiun/state/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const state = response.data
            toast.success('🗑️ State pensiun berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['pensiunState'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus state pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk mengubah status State Pensiun
 * PATCH /api/kepegawaian/pensiun/state/:id/status
 */
export const useUpdatePensiunStateStatus = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<PensiunStateWithRelations>, any, { id: string; status: string }>({
        mutationFn: async (data) => {
            const res = await api.patch(`/kepegawaian/pensiun/state/${data.id}/status`, { status: data.status })
            return res.data
        },
        onSuccess: (response) => {
            const state = response.data
            toast.success('✅ Status state pensiun berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['pensiunState'] })
            queryClient.invalidateQueries({ queryKey: ['pensiunState', state.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate status state pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

// =========================================================================
// 📊 STATISTIK RESPONSE TYPES
// =========================================================================

// 1. Pegawai Akan Pensiun
export interface PegawaiAkanPensiunItem {
    id_pegawai: string
    nama: string
    nip: string
    usia: number
    tanggal_pensiun: string
    sisa_hari: number
    unit_kerja: string | null
    jabatan_struktural: string | null
    jabatan_fungsional: string | null
}

export interface PegawaiAkanPensiun {
    periode: string
    total: number
    data: PegawaiAkanPensiunItem[]
}

// 2. Distribusi Usia
export interface DistribusiUsiaItem {
    usia: number
    jumlah: number
    data: Array<{
        id_pegawai: string
        nama: string
        nip: string
        usia: number
        unit_kerja: string | null
    }>
}

export interface DistribusiUsia {
    distribusi: DistribusiUsiaItem[]
    total: number
}

// 3. Pegawai Akan Pensiun Per Unit
export interface PegawaiAkanPensiunPerUnitItem {
    unit_kerja: string
    jumlah: number
    pegawai: PegawaiAkanPensiunItem[]
}

export interface PegawaiAkanPensiunPerUnit {
    periode: string
    total_unit: number
    data: PegawaiAkanPensiunPerUnitItem[]
}

// 4. Statistik Jenis Pensiun
export interface StatistikJenisPensiunItem {
    jenis: string
    jumlah: number
    persentase?: string
}

export interface StatistikJenisPensiun {
    tahun: string
    total: number
    data: StatistikJenisPensiunItem[]
}

// 5. Proyeksi 5 Tahun
export interface Proyeksi5TahunItem {
    tahun: number
    jumlah: number
}

export interface Proyeksi5Tahun {
    tahun_sekarang: number
    proyeksi: Proyeksi5TahunItem[]
    total_5_tahun: number
}

// 6. Jabatan Akan Kosong
export interface JabatanAkanKosongPegawai {
    id_pegawai: string
    nama: string
    nip: string
    sisa_hari: number
}

export interface JabatanAkanKosongItem {
    tipe_jabatan: string
    nama_jabatan: string
    jumlah_akan_pensiun: number
    pegawai: JabatanAkanKosongPegawai[]
}

export interface JabatanAkanKosong {
    periode: string
    total_jabatan: number
    data: JabatanAkanKosongItem[]
}

// 7. Riwayat Pengajuan
export interface RiwayatPengajuanItem {
    id: string
    id_pegawai: string
    nama: string
    nip: string
    tanggal_pengajuan: string
    status: string
    [key: string]: any
}

export interface RiwayatPengajuan {
    page: number
    limit: number
    total: number
    data: RiwayatPengajuanItem[]
}

// 8. Statistik Status Permohonan
export interface StatistikStatusPermohonanItem {
    status: string
    jumlah: number
    persentase?: string
}

export interface StatistikStatusPermohonan {
    tahun: string
    total: number
    data: StatistikStatusPermohonanItem[]
}

// 9. SLA
export interface SLAPerLevel {
    level: number
    rata_rata_hari: number
    jumlah: number
}

export interface SLA {
    tahun: string
    total_proses: number
    rata_rata_waktu_hari: number
    tercepat_hari: number
    terlambat_hari: number
    waktu_per_level: SLAPerLevel[]
}

// 10. Pegawai Lewat Masa Pensiun
export interface PegawaiLewatMasaPensiunItem {
    id_pegawai: string
    nama: string
    nip: string
    usia: number
    tanggal_pensiun: string
    sudah_lewat_hari: number
    unit_kerja: string | null
    jabatan_struktural: string | null
    ada_pengajuan_pensiun: boolean
    status_pengajuan: string | null
}

export interface PegawaiLewatMasaPensiun {
    total: number
    data: PegawaiLewatMasaPensiunItem[]
}

// 11. Trend Per Bulan
export interface TrendPerBulanItem {
    bulan: string
    pengajuan: number
    selesai: number
    pending: number
}

export interface TrendPerBulan {
    tahun: number
    data: TrendPerBulanItem[]
    total_pengajuan: number
    total_selesai: number
}

// 12. Countdown
export interface Countdown {
    id_pegawai: string
    nama: string
    nip: string
    tanggal_pensiun: string
    sisa_hari: number
    sisa_bulan: number
    sisa_tahun: number
    [key: string]: any
}

// =========================================================================
// 🚀 STATISTIK PENSIUN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil pegawai akan pensiun
 * GET /kepegawaian/pensiun/statistik/pegawai-akan-pensiun
 */
export const usePegawaiAkanPensiun = (filters?: StatistikPeriodeFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PegawaiAkanPensiun>>({
        queryKey: ['pensiunStatistik', 'pegawai-akan-pensiun', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.periode) params.append('periode', filters.periode)
            
            const queryString = params.toString()
            const url = `/kepegawaian/pensiun/statistik/pegawai-akan-pensiun${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PegawaiAkanPensiun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil distribusi usia
 * GET /kepegawaian/pensiun/statistik/distribusi-usia
 */
export const useDistribusiUsia = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<DistribusiUsia>>({
        queryKey: ['pensiunStatistik', 'distribusi-usia'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/pensiun/statistik/distribusi-usia')
            return res.data as ApiItemResponse<DistribusiUsia>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil pegawai akan pensiun per unit
 * GET /kepegawaian/pensiun/statistik/pegawai-akan-pensiun-per-unit
 */
export const usePegawaiAkanPensiunPerUnit = (filters?: StatistikPeriodeFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PegawaiAkanPensiunPerUnit>>({
        queryKey: ['pensiunStatistik', 'pegawai-akan-pensiun-per-unit', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.periode) params.append('periode', filters.periode)
            
            const queryString = params.toString()
            const url = `/kepegawaian/pensiun/statistik/pegawai-akan-pensiun-per-unit${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<PegawaiAkanPensiunPerUnit>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik jenis pensiun
 * GET /kepegawaian/pensiun/statistik/statistik-jenis-pensiun
 */
export const useStatistikJenisPensiun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikJenisPensiun>>({
        queryKey: ['pensiunStatistik', 'statistik-jenis-pensiun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/pensiun/statistik/statistik-jenis-pensiun')
            return res.data as ApiItemResponse<StatistikJenisPensiun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil proyeksi 5 tahun
 * GET /kepegawaian/pensiun/statistik/proyeksi-5-tahun
 */
export const useProyeksi5Tahun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<Proyeksi5Tahun>>({
        queryKey: ['pensiunStatistik', 'proyeksi-5-tahun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/pensiun/statistik/proyeksi-5-tahun')
            return res.data as ApiItemResponse<Proyeksi5Tahun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil jabatan akan kosong
 * GET /kepegawaian/pensiun/statistik/jabatan-akan-kosong
 */
export const useJabatanAkanKosong = (filters?: StatistikPeriodeFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<JabatanAkanKosong>>({
        queryKey: ['pensiunStatistik', 'jabatan-akan-kosong', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.periode) params.append('periode', filters.periode)
            
            const queryString = params.toString()
            const url = `/kepegawaian/pensiun/statistik/jabatan-akan-kosong${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<JabatanAkanKosong>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil riwayat pengajuan
 * GET /kepegawaian/pensiun/statistik/riwayat-pengajuan
 */
export const useRiwayatPengajuan = (filters?: StatistikPegawaiFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPengajuan>>({
        queryKey: ['pensiunStatistik', 'riwayat-pengajuan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.id_pegawai) params.append('id_pegawai', filters.id_pegawai)
            if (filters?.nip) params.append('nip', filters.nip)
            if (filters?.page) params.append('page', filters.page.toString())
            if (filters?.limit) params.append('limit', filters.limit.toString())
            
            const queryString = params.toString()
            const url = `/kepegawaian/pensiun/statistik/riwayat-pengajuan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<RiwayatPengajuan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil statistik status permohonan
 * GET /kepegawaian/pensiun/statistik/statistik-status-permohonan
 */
export const useStatistikStatusPermohonan = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<StatistikStatusPermohonan>>({
        queryKey: ['pensiunStatistik', 'statistik-status-permohonan'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/pensiun/statistik/statistik-status-permohonan')
            return res.data as ApiItemResponse<StatistikStatusPermohonan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil SLA
 * GET /kepegawaian/pensiun/statistik/sla
 */
export const useSLA = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<SLA>>({
        queryKey: ['pensiunStatistik', 'sla'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/pensiun/statistik/sla')
            return res.data as ApiItemResponse<SLA>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil pegawai lewat masa pensiun
 * GET /kepegawaian/pensiun/statistik/pegawai-lewat-masa-pensiun
 */
export const usePegawaiLewatMasaPensiun = (enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PegawaiLewatMasaPensiun>>({
        queryKey: ['pensiunStatistik', 'pegawai-lewat-masa-pensiun'],
        queryFn: async () => {
            const res = await api.get('/kepegawaian/pensiun/statistik/pegawai-lewat-masa-pensiun')
            return res.data as ApiItemResponse<PegawaiLewatMasaPensiun>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil trend per bulan
 * GET /kepegawaian/pensiun/statistik/trend-per-bulan
 */
export const useTrendPerBulan = (filters?: StatistikBulanFilter, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<TrendPerBulan>>({
        queryKey: ['pensiunStatistik', 'trend-per-bulan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.tahun) params.append('tahun', filters.tahun.toString())
            if (filters?.bulan) params.append('bulan', filters.bulan.toString())
            if (filters?.startDate) params.append('startDate', filters.startDate)
            if (filters?.endDate) params.append('endDate', filters.endDate)
            
            const queryString = params.toString()
            const url = `/kepegawaian/pensiun/statistik/trend-per-bulan${queryString ? `?${queryString}` : ''}`
            const res = await api.get(url)
            return res.data as ApiItemResponse<TrendPerBulan>
        },
        enabled,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook untuk mengambil countdown pensiun pegawai
 * GET /kepegawaian/pensiun/statistik/countdown/:id_pegawai
 */
export const useCountdownPensiun = (id_pegawai: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<Countdown>>({
        queryKey: ['pensiunStatistik', 'countdown', id_pegawai],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/statistik/countdown/${id_pegawai}`)
            return res.data as ApiItemResponse<Countdown>
        },
        enabled: enabled && !!id_pegawai,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}

