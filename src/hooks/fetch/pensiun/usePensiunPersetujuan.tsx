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

export interface PersetujuanPensiunFilters {
    id_pensiun_proses?: string
    id_pegawai_approver?: string
    status_persetujuan?: string
    page?: number
    limit?: number
}

// Tipe data dasar Persetujuan Pensiun
export interface PersetujuanPensiun {
    id: string
    id_pensiun_proses: string
    id_pegawai_approver: string
    role_approver: string
    status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
    tanggal_persetujuan: Date | string | null
    catatan_persetujuan: string | null
    urutan_persetujuan: number
    is_deleted: boolean
}

// Tipe data Persetujuan Pensiun yang diperkaya dengan data Approver
export interface PersetujuanPensiunWithApprover extends PersetujuanPensiun {
    approver_nama?: string | null
    approver_nip?: string | null
}

// Tipe untuk My Approval (gabungan Persetujuan + Permohonan)
export interface PermohonanPensiunDetail {
    id: string
    id_pegawai: string
    jenis_pensiun: string
    tanggal_pengajuan: string
    alasan_pensiun: string | null
    tanggal_pensiun: string | null
    status: string
    pemohon_nama?: string
    pemohon_nip?: string
}

export interface MyApprovalPensiunItem extends PersetujuanPensiun, PermohonanPensiunDetail {}

// =========================================================================
// 🤝 PERSETUJUAN PENSIUN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Pensiun
 * GET /api/kepegawaian/pensiun/persetujuan
 */
export const usePersetujuanPensiunList = (filters: PersetujuanPensiunFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<PersetujuanPensiunWithApprover>>({
        queryKey: ['persetujuanPensiun', filters],
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
            const res = await api.get(`/kepegawaian/pensiun/persetujuan?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Persetujuan Pensiun yang terkait dengan Pegawai yang sedang login
 * GET /api/kepegawaian/pensiun/persetujuan/my-approvals
 */
export const useMyPersetujuanPensiunList = (filters: { 
    page?: number
    limit?: number
    status?: 'ditolak' | 'diterima' | 'all'
} = {}) => {
    const { page = 1, limit = 10, status = 'all', ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<MyApprovalPensiunItem>>({
        queryKey: ['myPersetujuanPensiun', { page, limit, status, ...otherFilters }],
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
            
            const res = await api.get(`/kepegawaian/pensiun/persetujuan/my-approvals?${params.toString()}`)
            
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
 * Hook untuk mengambil daftar Persetujuan berdasarkan ID Proses Pensiun
 * GET /api/kepegawaian/pensiun/persetujuan/by-proses/:id
 */
export const usePersetujuanPensiunByProses = (id: string, enabled: boolean = true) => {
    return useQuery<PersetujuanPensiunWithApprover[]>({
        queryKey: ['persetujuanPensiunByProses', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/persetujuan/by-proses/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Persetujuan Pensiun
 * GET /api/kepegawaian/pensiun/persetujuan/:id
 */
export const useGetPersetujuanPensiunDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PersetujuanPensiunWithApprover>>({
        queryKey: ['persetujuanPensiunDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/pensiun/persetujuan/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat Persetujuan Pensiun baru
 * POST /api/kepegawaian/pensiun/persetujuan
 */
export const useCreatePersetujuanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/kepegawaian/pensiun/persetujuan', formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Persetujuan pensiun berhasil dibuat!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal membuat persetujuan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Persetujuan Pensiun
 * PUT /api/kepegawaian/pensiun/persetujuan/:id
 */
export const useUpdatePersetujuanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/kepegawaian/pensiun/persetujuan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Persetujuan pensiun berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate persetujuan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Persetujuan Pensiun
 * DELETE /api/kepegawaian/pensiun/persetujuan/:id
 */
export const useDeletePersetujuanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/pensiun/persetujuan/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('🗑️ Persetujuan pensiun berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus persetujuan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memproses Persetujuan Pensiun (menyetujui/menolak/merevisi)
 * POST /api/kepegawaian/pensiun/persetujuan/:id/process
 */
export const useProcessPersetujuanPensiun = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { 
            id: string
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'
            catatan_persetujuan?: string 
        }) => {
            const res = await api.post(`/kepegawaian/pensiun/persetujuan/${data.id}/process`, data)
            return res.data
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                          variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi'
            
            toast.success(`✅ Persetujuan pensiun berhasil ${action}!`, { position: 'bottom-right' })
            
            // Invalidate semua query terkait
            queryClient.invalidateQueries({ queryKey: ['persetujuanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanPensiun'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPensiunByProses'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanPensiun'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan pensiun!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

