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

export interface PersetujuanMutasiFilters {
    id_permohonan_mutasi?: string
    id_pegawai_approver?: string
    status_persetujuan?: string
    page?: number
    limit?: number
}

// Tipe data dasar Persetujuan Mutasi
export interface PersetujuanMutasi {
    id: string
    id_permohonan_mutasi: string
    id_pegawai_approver: string
    role_approver: string
    status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
    tanggal_persetujuan: Date | string | null
    catatan_persetujuan: string | null
    urutan_persetujuan: number
    is_deleted: boolean
}

// Tipe data Persetujuan Mutasi yang diperkaya dengan data Approver
export interface PersetujuanMutasiWithApprover extends PersetujuanMutasi {
    approver_nama?: string | null
    approver_nip?: string | null
}

// Tipe untuk My Approval (gabungan Persetujuan + Permohonan)
export interface PermohonanMutasiDetail {
    id: string
    id_pegawai: string
    jenis_mutasi?: string
    instansi_tujuan?: string
    alasan_mutasi: string
    status: string
    tanggal_pengajuan: string
    pemohon_nama?: string
    pemohon_nip?: string
}

export interface MyApprovalMutasiItem extends PersetujuanMutasi, PermohonanMutasiDetail {}

// =========================================================================
// 🤝 PERSETUJUAN MUTASI HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Mutasi
 * GET /api/kepegawaian/mutasi/persetujuan
 */
export const usePersetujuanMutasiList = (filters: PersetujuanMutasiFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<PersetujuanMutasiWithApprover>>({
        queryKey: ['persetujuanMutasi', filters],
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
            const res = await api.get(`/kepegawaian/mutasi/persetujuan?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Persetujuan Mutasi yang terkait dengan Pegawai yang sedang login
 * GET /api/kepegawaian/mutasi/persetujuan/my-approvals
 */
export const useMyPersetujuanMutasiList = (filters: { 
    page?: number
    limit?: number
    status?: 'ditolak' | 'diterima' | 'all'
} = {}) => {
    const { page = 1, limit = 10, status = 'all', ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<MyApprovalMutasiItem>>({
        queryKey: ['myPersetujuanMutasi', { page, limit, status, ...otherFilters }],
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
            
            const res = await api.get(`/kepegawaian/mutasi/persetujuan/my-approvals?${params.toString()}`)
            
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
 * Hook untuk mengambil daftar Persetujuan berdasarkan ID Permohonan
 * GET /api/kepegawaian/mutasi/persetujuan/by-permohonan/:id_permohonan_mutasi
 */
export const usePersetujuanMutasiByPermohonan = (id_permohonan_mutasi: string, enabled: boolean = true) => {
    return useQuery<PersetujuanMutasiWithApprover[]>({
        queryKey: ['persetujuanMutasiByPermohonan', id_permohonan_mutasi],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/mutasi/persetujuan/by-permohonan/${id_permohonan_mutasi}`)
            return res.data
        },
        enabled: enabled && !!id_permohonan_mutasi,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Persetujuan Mutasi
 * GET /api/kepegawaian/mutasi/persetujuan/:id
 */
export const useGetPersetujuanMutasiDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PersetujuanMutasiWithApprover>>({
        queryKey: ['persetujuanMutasiDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/mutasi/persetujuan/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat Persetujuan Mutasi baru
 * POST /api/kepegawaian/mutasi/persetujuan
 */
export const useCreatePersetujuanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/kepegawaian/mutasi/persetujuan', formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Persetujuan mutasi berhasil dibuat!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal membuat persetujuan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Persetujuan Mutasi
 * PUT /api/kepegawaian/mutasi/persetujuan/:id
 */
export const useUpdatePersetujuanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/kepegawaian/mutasi/persetujuan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Persetujuan mutasi berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate persetujuan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Persetujuan Mutasi
 * DELETE /api/kepegawaian/mutasi/persetujuan/:id
 */
export const useDeletePersetujuanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/mutasi/persetujuan/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('🗑️ Persetujuan mutasi berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus persetujuan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk mengubah status Persetujuan Mutasi
 * PATCH /api/kepegawaian/mutasi/persetujuan/:id/status
 */
export const useSetStatusPersetujuanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; status_persetujuan: string; catatan_persetujuan?: string }) => {
            const res = await api.patch(`/kepegawaian/mutasi/persetujuan/${data.id}/status`, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Status persetujuan berhasil diubah!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengubah status persetujuan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memproses Persetujuan Mutasi (menyetujui/menolak/merevisi)
 * POST /api/kepegawaian/mutasi/persetujuan/:id/process
 */
export const useProcessPersetujuanMutasi = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { 
            id: string
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'
            catatan_persetujuan?: string 
        }) => {
            const res = await api.post(`/kepegawaian/mutasi/persetujuan/${data.id}/process`, data)
            return res.data
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                          variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi'
            
            toast.success(`✅ Persetujuan mutasi berhasil ${action}!`, { position: 'bottom-right' })
            
            // Invalidate semua query terkait
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanMutasi'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanMutasiByPermohonan'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanMutasi'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan mutasi!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

