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

