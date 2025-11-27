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

export interface PersetujuanGajiFilters {
    id_kenaikan_gaji_berkala_proses?: string
    id_pegawai_approver?: string
    status_persetujuan?: string
    page?: number
    limit?: number
}

// Tipe data dasar Persetujuan Gaji (KGB)
export interface PersetujuanGaji {
    id: string
    id_kenaikan_gaji_berkala_proses: string
    id_pegawai_approver: string
    role_approver: string
    status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
    tanggal_persetujuan: Date | string | null
    catatan_persetujuan: string | null
    urutan_persetujuan: number
    is_deleted: boolean
}

// Tipe data Persetujuan Gaji yang diperkaya dengan data Approver
export interface PersetujuanGajiWithApprover extends PersetujuanGaji {
    approver_nama?: string | null
    approver_nip?: string | null
}

// Tipe untuk My Approval (gabungan Persetujuan + Permohonan)
export interface PermohonanGajiDetail {
    id: string
    id_pegawai: string
    tanggal_pengajuan: string
    gaji_pokok_lama: number
    gaji_pokok_baru: number
    tmt_kgb_lama: string
    tmt_kgb_baru: string
    masa_kerja_gol_lama: string
    masa_kerja_gol_baru: string
    status: string
    pemohon_nama?: string
    pemohon_nip?: string
}

export interface MyApprovalGajiItem extends PersetujuanGaji, PermohonanGajiDetail {}

// =========================================================================
// 🤝 PERSETUJUAN GAJI (KGB) HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Gaji
 * GET /api/kepegawaian/gajiberkala/persetujuan
 */
export const usePersetujuanGajiList = (filters: PersetujuanGajiFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<PersetujuanGajiWithApprover>>({
        queryKey: ['persetujuanGaji', filters],
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
            const res = await api.get(`/kepegawaian/gajiberkala/persetujuan?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Persetujuan Gaji yang terkait dengan Pegawai yang sedang login
 * GET /api/kepegawaian/gajiberkala/persetujuan/my-approvals
 */
export const useMyPersetujuanGajiList = (filters: { 
    page?: number
    limit?: number
    status?: 'ditolak' | 'diterima' | 'all'
} = {}) => {
    const { page = 1, limit = 10, status = 'all', ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<MyApprovalGajiItem>>({
        queryKey: ['myPersetujuanGaji', { page, limit, status, ...otherFilters }],
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
            
            const res = await api.get(`/kepegawaian/gajiberkala/persetujuan/my-approvals?${params.toString()}`)
            
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
 * Hook untuk mengambil daftar Persetujuan berdasarkan ID Proses KGB
 * GET /api/kepegawaian/gajiberkala/proses/:id_kenaikan_gaji_berkala_proses/persetujuan
 */
export const usePersetujuanGajiByProses = (id_kenaikan_gaji_berkala_proses: string, enabled: boolean = true) => {
    return useQuery<PersetujuanGajiWithApprover[]>({
        queryKey: ['persetujuanGajiByProses', id_kenaikan_gaji_berkala_proses],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/gajiberkala/proses/${id_kenaikan_gaji_berkala_proses}/persetujuan`)
            return res.data
        },
        enabled: enabled && !!id_kenaikan_gaji_berkala_proses,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Persetujuan Gaji
 * GET /api/kepegawaian/gajiberkala/persetujuan/:id
 */
export const useGetPersetujuanGajiDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PersetujuanGajiWithApprover>>({
        queryKey: ['persetujuanGajiDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/gajiberkala/persetujuan/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan status workflow approval
 * GET /api/kepegawaian/gajiberkala/workflow/:id_kenaikan_gaji_berkala_proses
 */
export const useGetApprovalWorkflowStatus = (id_kenaikan_gaji_berkala_proses: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<any>>({
        queryKey: ['approvalWorkflowStatus', id_kenaikan_gaji_berkala_proses],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/gajiberkala/workflow/${id_kenaikan_gaji_berkala_proses}`)
            return res.data
        },
        enabled: enabled && !!id_kenaikan_gaji_berkala_proses,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan riwayat approval by user
 * GET /api/kepegawaian/gajiberkala/approval-history/:id_user_approver
 */
export const useGetApprovalHistoryByUser = (id_user_approver: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<any>>({
        queryKey: ['approvalHistoryByUser', id_user_approver],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/gajiberkala/approval-history/${id_user_approver}`)
            return res.data
        },
        enabled: enabled && !!id_user_approver,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat Persetujuan Gaji baru
 * POST /api/kepegawaian/gajiberkala/persetujuan
 */
export const useCreatePersetujuanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/kepegawaian/gajiberkala/persetujuan', formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Persetujuan kenaikan gaji berhasil dibuat!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal membuat persetujuan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Persetujuan Gaji
 * PUT /api/kepegawaian/gajiberkala/persetujuan/:id
 */
export const useUpdatePersetujuanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/kepegawaian/gajiberkala/persetujuan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Persetujuan kenaikan gaji berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate persetujuan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Persetujuan Gaji
 * DELETE /api/kepegawaian/gajiberkala/persetujuan/:id
 */
export const useDeletePersetujuanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/gajiberkala/persetujuan/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('🗑️ Persetujuan kenaikan gaji berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus persetujuan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk mengubah status Persetujuan Gaji
 * PATCH /api/kepegawaian/gajiberkala/persetujuan/:id/status
 */
export const useSetStatusPersetujuanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; status_persetujuan: string; catatan_persetujuan?: string }) => {
            const res = await api.patch(`/kepegawaian/gajiberkala/persetujuan/${data.id}/status`, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('✅ Status persetujuan berhasil diubah!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['persetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengubah status persetujuan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memproses Persetujuan Gaji (menyetujui/menolak/merevisi)
 * POST /api/kepegawaian/gajiberkala/persetujuan/:id/process
 */
export const useProcessPersetujuanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { 
            id: string
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'
            catatan_persetujuan?: string 
        }) => {
            const res = await api.post(`/kepegawaian/gajiberkala/persetujuan/${data.id}/process`, data)
            return res.data
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                          variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi'
            
            toast.success(`✅ Persetujuan kenaikan gaji berhasil ${action}!`, { position: 'bottom-right' })
            
            // Invalidate semua query terkait
            queryClient.invalidateQueries({ queryKey: ['persetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanGajiByProses'] })
            queryClient.invalidateQueries({ queryKey: ['permohonanGaji'] })
            queryClient.invalidateQueries({ queryKey: ['approvalWorkflowStatus'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan kenaikan gaji!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

