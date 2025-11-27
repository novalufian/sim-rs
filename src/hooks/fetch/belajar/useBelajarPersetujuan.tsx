import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// =========================================================================
// 🧩 TYPES
// =========================================================================

// --- Standard API Response Types ---
export interface ApiListResponse<T> {
    success: boolean
    message: string
    data: {
        page: number
        limit: number
        total: number
        items: T[]
    }
}

export interface ApiItemResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    page: number
    limit: number
    total: number
    items: T[]
}

export interface PersetujuanBelajarFilters {
    id_izin_belajar?: string
    id_pegawai_approver?: string
    status_persetujuan?: string
    page?: number
    limit?: number
}

// Tipe data dasar Persetujuan Ijin Belajar
export interface PersetujuanBelajar {
    id: string
    id_izin_belajar: string
    id_pegawai_approver: string
    role_approver: string
    status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
    tanggal_persetujuan: Date | string | null
    catatan_persetujuan: string | null
    urutan_persetujuan: number
    is_deleted: boolean
}

// Tipe data Persetujuan Belajar yang diperkaya dengan data Approver
export interface PersetujuanBelajarWithApprover extends PersetujuanBelajar {
    approver_nama?: string | null
    approver_nip?: string | null
}

// Tipe untuk My Approval (gabungan Persetujuan + Permohonan)
export interface PermohonanBelajarDetail {
    id: string
    id_pegawai: string
    nama_sekolah: string
    jenjang_pendidikan: string
    jurusan: string | null
    alamat_sekolah: string | null
    tanggal_mulai: string
    tanggal_selesai: string | null
    status: string
    pemohon_nama?: string
    pemohon_nip?: string
}

export interface MyApprovalBelajarItem extends PersetujuanBelajar, PermohonanBelajarDetail {}

// =========================================================================
// 🤝 PERSETUJUAN IJIN BELAJAR HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Ijin Belajar berdasarkan ID Permohonan
 * GET /api/kepegawaian/ijinbelajar/:id/persetujuan
 */
export const usePersetujuanBelajarByPermohonan = (id: string, enabled: boolean = true) => {
    return useQuery<PersetujuanBelajarWithApprover[]>({
        queryKey: ['persetujuanBelajarByPermohonan', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/ijinbelajar/${id}/persetujuan`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Persetujuan Ijin Belajar yang terkait dengan Pegawai yang sedang login
 * GET /api/kepegawaian/ijinbelajar/persetujuan/my-approvals
 */
export const useMyPersetujuanBelajarList = (filters: { 
    page?: number
    limit?: number
    status?: 'ditolak' | 'diterima' | 'all'
} = {}) => {
    const { page = 1, limit = 10, status = 'all', ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<MyApprovalBelajarItem>>({
        queryKey: ['myPersetujuanBelajar', { page, limit, status, ...otherFilters }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                status: status,
                ...Object.entries(otherFilters).reduce((acc: Record<string, string>, [key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        acc[key] = String(value)
                    }
                    return acc
                }, {}),
            })
            
            const res = await api.get(`/kepegawaian/ijinbelajar/persetujuan/my-approvals?${params.toString()}`)
            
            // Jika response memiliki wrapper { success, message, data }
            if (res.data?.data) {
                return res.data.data
            }
            return res.data
        },
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // Cache 5 menit
    })
}

/**
 * Hook untuk mendapatkan detail Persetujuan Ijin Belajar
 * GET /api/kepegawaian/ijinbelajar/persetujuan/:id
 */
export const useGetPersetujuanBelajarDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PersetujuanBelajarWithApprover>>({
        queryKey: ['persetujuanBelajarDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/ijinbelajar/persetujuan/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat Persetujuan Ijin Belajar baru
 * POST /api/kepegawaian/ijinbelajar/:id/persetujuan
 */
export const useCreatePersetujuanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.post(`/kepegawaian/ijinbelajar/${data.id}/persetujuan`, data.formData)
            return res.data
        },
        onSuccess: (response, variables) => {
            toast.success('✅ Persetujuan ijin belajar berhasil dibuat!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanBelajar'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanBelajarByPermohonan', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal membuat persetujuan ijin belajar!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memproses Persetujuan Ijin Belajar (menyetujui/menolak/merevisi)
 * POST /api/kepegawaian/ijinbelajar/persetujuan/:id/process
 */
export const useProcessPersetujuanBelajar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { 
            id: string
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'
            catatan_persetujuan?: string 
        }) => {
            const res = await api.post(`/kepegawaian/ijinbelajar/persetujuan/${data.id}/process`, data)
            return res.data
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                          variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi'
            
            toast.success(`✅ Persetujuan ijin belajar berhasil ${action}!`, { position: 'bottom-right' })
            
            // Invalidate semua query terkait
            queryClient.invalidateQueries({ queryKey: ['persetujuanBelajar'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanBelajar'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanBelajarByPermohonan'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanBelajar'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan ijin belajar!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

