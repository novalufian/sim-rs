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

export interface PersetujuanKawinFilters {
    id_riwayat_pernikahan?: string
    id_riwayat_perceraian?: string
    id_pegawai_approver?: string
    status_persetujuan?: string
    page?: number
    limit?: number
}

// Tipe data dasar Persetujuan Pernikahan
export interface PersetujuanPernikahan {
    id: string
    id_riwayat_pernikahan: string
    id_pegawai_approver: string
    role_approver: string
    status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
    tanggal_persetujuan: Date | string | null
    catatan_persetujuan: string | null
    urutan_persetujuan: number
    is_deleted: boolean
}

// Tipe data dasar Persetujuan Perceraian
export interface PersetujuanPerceraian {
    id: string
    id_riwayat_perceraian: string
    id_pegawai_approver: string
    role_approver: string
    status_persetujuan: string // e.g., 'DISETUJUI', 'DITOLAK', 'MENUNGGU'
    tanggal_persetujuan: Date | string | null
    catatan_persetujuan: string | null
    urutan_persetujuan: number
    is_deleted: boolean
}

// Tipe data Persetujuan yang diperkaya dengan data Approver
export interface PersetujuanPernikahanWithApprover extends PersetujuanPernikahan {
    approver_nama?: string | null
    approver_nip?: string | null
}

export interface PersetujuanPerceraianWithApprover extends PersetujuanPerceraian {
    approver_nama?: string | null
    approver_nip?: string | null
}

// Tipe untuk My Approval (gabungan Persetujuan + Riwayat)
export interface RiwayatPernikahanDetail {
    id: string
    id_pegawai: string
    nama_pasangan: string
    tanggal_menikah: string
    tempat_menikah: string | null
    no_akta_nikah: string | null
    status: string
    pemohon_nama?: string
    pemohon_nip?: string
}

export interface RiwayatPerceraianDetail {
    id: string
    id_pegawai: string
    nama_mantan_pasangan: string
    tanggal_cerai: string
    tempat_cerai: string | null
    no_akta_cerai: string | null
    alasan_cerai: string | null
    status: string
    pemohon_nama?: string
    pemohon_nip?: string
}

export interface MyApprovalPernikahanItem extends PersetujuanPernikahan, RiwayatPernikahanDetail {}
export interface MyApprovalPerceraianItem extends PersetujuanPerceraian, RiwayatPerceraianDetail {}

// =========================================================================
// 🤝 PERSETUJUAN PERNIKAHAN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Pernikahan
 * GET /api/kepegawaian/kawincerai/persetujuan/pernikahan
 */
export const usePersetujuanPernikahanList = (filters: PersetujuanKawinFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<PersetujuanPernikahanWithApprover>>({
        queryKey: ['persetujuanPernikahan', filters],
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
            const res = await api.get(`/kepegawaian/kawincerai/persetujuan/pernikahan?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Persetujuan Pernikahan yang terkait dengan Pegawai yang sedang login
 * GET /api/kepegawaian/kawincerai/persetujuan/pernikahan/my-approvals
 */
export const useMyPersetujuanPernikahanList = (filters: { 
    page?: number
    limit?: number
    status?: 'ditolak' | 'diterima' | 'all'
} = {}) => {
    const { page = 1, limit = 10, status = 'all', ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<MyApprovalPernikahanItem>>({
        queryKey: ['myPersetujuanPernikahan', { page, limit, status, ...otherFilters }],
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
            
            const res = await api.get(`/kepegawaian/kawincerai/persetujuan/pernikahan/my-approvals?${params.toString()}`)
            
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
 * Hook untuk mengambil daftar Persetujuan berdasarkan ID Riwayat Pernikahan
 * GET /api/kepegawaian/kawincerai/pernikahan/:id/persetujuan
 */
export const usePersetujuanPernikahanByRiwayat = (id: string, enabled: boolean = true) => {
    return useQuery<PersetujuanPernikahanWithApprover[]>({
        queryKey: ['persetujuanPernikahanByRiwayat', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/kawincerai/pernikahan/${id}/persetujuan`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Persetujuan Pernikahan
 * GET /api/kepegawaian/kawincerai/persetujuan/pernikahan/:id
 */
export const useGetPersetujuanPernikahanDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PersetujuanPernikahanWithApprover>>({
        queryKey: ['persetujuanPernikahanDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/kawincerai/persetujuan/pernikahan/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk memproses Persetujuan Pernikahan (menyetujui/menolak/merevisi)
 * POST /api/kepegawaian/kawincerai/persetujuan/pernikahan/:id/process
 */
export const useProcessPersetujuanPernikahan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { 
            id: string
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'
            catatan_persetujuan?: string 
        }) => {
            const res = await api.post(`/kepegawaian/kawincerai/persetujuan/pernikahan/${data.id}/process`, data)
            return res.data
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                          variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi'
            
            toast.success(`✅ Persetujuan pernikahan berhasil ${action}!`, { position: 'bottom-right' })
            
            // Invalidate semua query terkait
            queryClient.invalidateQueries({ queryKey: ['persetujuanPernikahan'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanPernikahan'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPernikahanByRiwayat'] })
            queryClient.invalidateQueries({ queryKey: ['riwayatPernikahan'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan pernikahan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

// =========================================================================
// 🤝 PERSETUJUAN PERCERAIAN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Persetujuan Perceraian
 * GET /api/kepegawaian/kawincerai/persetujuan/perceraian
 */
export const usePersetujuanPerceraianList = (filters: PersetujuanKawinFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<PersetujuanPerceraianWithApprover>>({
        queryKey: ['persetujuanPerceraian', filters],
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
            const res = await api.get(`/kepegawaian/kawincerai/persetujuan/perceraian?${params.toString()}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mengambil daftar Persetujuan Perceraian yang terkait dengan Pegawai yang sedang login
 * GET /api/kepegawaian/kawincerai/persetujuan/perceraian/my-approvals
 */
export const useMyPersetujuanPerceraianList = (filters: { 
    page?: number
    limit?: number
    status?: 'ditolak' | 'diterima' | 'all'
} = {}) => {
    const { page = 1, limit = 10, status = 'all', ...otherFilters } = filters
    
    return useQuery<PaginatedResponse<MyApprovalPerceraianItem>>({
        queryKey: ['myPersetujuanPerceraian', { page, limit, status, ...otherFilters }],
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
            
            const res = await api.get(`/kepegawaian/kawincerai/persetujuan/perceraian/my-approvals?${params.toString()}`)
            
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
 * Hook untuk mengambil daftar Persetujuan berdasarkan ID Riwayat Perceraian
 * GET /api/kepegawaian/kawincerai/perceraian/:id/persetujuan
 */
export const usePersetujuanPerceraianByRiwayat = (id: string, enabled: boolean = true) => {
    return useQuery<PersetujuanPerceraianWithApprover[]>({
        queryKey: ['persetujuanPerceraianByRiwayat', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/kawincerai/perceraian/${id}/persetujuan`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Persetujuan Perceraian
 * GET /api/kepegawaian/kawincerai/persetujuan/perceraian/:id
 */
export const useGetPersetujuanPerceraianDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<PersetujuanPerceraianWithApprover>>({
        queryKey: ['persetujuanPerceraianDetail', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/kawincerai/persetujuan/perceraian/${id}`)
            return res.data
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk memproses Persetujuan Perceraian (menyetujui/menolak/merevisi)
 * POST /api/kepegawaian/kawincerai/persetujuan/perceraian/:id/process
 */
export const useProcessPersetujuanPerceraian = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { 
            id: string
            status_persetujuan: 'DISETUJUI' | 'DITOLAK' | 'DIREVISI'
            catatan_persetujuan?: string 
        }) => {
            const res = await api.post(`/kepegawaian/kawincerai/persetujuan/perceraian/${data.id}/process`, data)
            return res.data
        },
        onSuccess: (data, variables) => {
            const action = variables.status_persetujuan === 'DISETUJUI' ? 'disetujui' : 
                          variables.status_persetujuan === 'DITOLAK' ? 'ditolak' : 'direvisi'
            
            toast.success(`✅ Persetujuan perceraian berhasil ${action}!`, { position: 'bottom-right' })
            
            // Invalidate semua query terkait
            queryClient.invalidateQueries({ queryKey: ['persetujuanPerceraian'] })
            queryClient.invalidateQueries({ queryKey: ['myPersetujuanPerceraian'] })
            queryClient.invalidateQueries({ queryKey: ['persetujuanPerceraianByRiwayat'] })
            queryClient.invalidateQueries({ queryKey: ['riwayatPerceraian'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal memproses persetujuan perceraian!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

