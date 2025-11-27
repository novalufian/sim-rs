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

export interface PermohonanKawinFilters {
    id_pegawai?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

// Tipe data dasar Riwayat Pernikahan
export interface RiwayatPernikahan {
    id: string
    pegawai_id: string
    status_saat_ini: string
    catatan: string | null
    is_deleted: boolean
    pasangan_nama: string
    pasangan_jenis_kelamin: string | null
    pasangan_tanggal_lahir: string | null
    pasangan_tempat_lahir: string | null
    pernikahan_no_akta: string | null
    pernikahan_tanggal: Date | string
    pernikahan_tempat: string | null
    pernikahan_id_dokumen_akta: string | null
    dokumen_akta_nikah_id: string | null
    dokumen_akta_nikah_url: string | null
    audit_created_at: string
    audit_updated_at: string
    audit_created_by: string | null
    audit_updated_by: string | null
}

// Tipe data dasar Riwayat Perceraian
export interface RiwayatPerceraian {
    id: string
    pegawai_id: string
    tanggal_cerai: Date | string
    alasan_perceraian: string | null
    status_saat_ini: string
    catatan: string | null
    is_deleted: boolean
    dokumen_akta_cerai_id: string | null
    dokumen_akta_cerai_no: string | null
    dokumen_akta_cerai_url: string | null
    audit_created_at: string
    audit_updated_at: string
    audit_created_by: string | null
    audit_updated_by: string | null
}

// Tipe data yang diperkaya dengan Relasi
export interface RiwayatPernikahanWithRelations extends RiwayatPernikahan {
    pegawai_nama?: string
    pegawai_nip?: string
    [key: string]: any
}

export interface RiwayatPerceraianWithRelations extends RiwayatPerceraian {
    pegawai_nama?: string
    pegawai_nip?: string
    [key: string]: any
}

// Input types
export interface RiwayatPernikahanInput {
    id_pegawai: string
    nama_pasangan: string
    tanggal_menikah: string | Date
    tempat_menikah?: string
    no_akta_nikah?: string
    catatan?: string
}

export interface RiwayatPerceraianInput {
    id_pegawai: string
    nama_mantan_pasangan: string
    tanggal_cerai: string | Date
    tempat_cerai?: string
    no_akta_cerai?: string
    alasan_cerai?: string
    catatan?: string
}

// =========================================================================
// 🚀 RIWAYAT PERNIKAHAN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Riwayat Pernikahan
 * GET /api/kepegawaian/kawincerai/pernikahan
 */
export const useRiwayatPernikahanList = (filters: PermohonanKawinFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<RiwayatPernikahanWithRelations>>({
        queryKey: ['riwayatPernikahan', filters],
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

            const res = await api.get(`/kepegawaian/kawincerai/pernikahan?${params.toString()}`)
            return res.data as ApiListResponse<RiwayatPernikahanWithRelations>
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Riwayat Pernikahan
 * GET /api/kepegawaian/kawincerai/pernikahan/:id
 */
export const useGetRiwayatPernikahanDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPernikahanWithRelations>>({
        queryKey: ['riwayatPernikahan', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/kawincerai/pernikahan/${id}`)
            return res.data as ApiItemResponse<RiwayatPernikahanWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat Riwayat Pernikahan baru
 * POST /api/kepegawaian/kawincerai/pernikahan
 */
export const useCreateRiwayatPernikahan = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<RiwayatPernikahanWithRelations>, any, RiwayatPernikahanInput>({
        mutationFn: async (formData: RiwayatPernikahanInput) => {
            const res = await api.post('/kepegawaian/kawincerai/pernikahan', formData)
            return res.data
        },
        onSuccess: (response) => {
            const riwayat = response.data
            toast.success('✅ Riwayat pernikahan berhasil ditambahkan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPernikahan'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menambahkan riwayat pernikahan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Riwayat Pernikahan
 * PUT /api/kepegawaian/kawincerai/pernikahan/:id
 */
export const useUpdateRiwayatPernikahan = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<RiwayatPernikahanWithRelations>, any, { id: string; formData: Partial<RiwayatPernikahanInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/kawincerai/pernikahan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const riwayat = response.data
            toast.success('✅ Riwayat pernikahan berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPernikahan'] })
            queryClient.invalidateQueries({ queryKey: ['riwayatPernikahan', riwayat.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate riwayat pernikahan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Riwayat Pernikahan
 * DELETE /api/kepegawaian/kawincerai/pernikahan/:id
 */
export const useDeleteRiwayatPernikahan = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<RiwayatPernikahanWithRelations>, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/kawincerai/pernikahan/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const riwayat = response.data
            toast.success('🗑️ Riwayat pernikahan berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPernikahan'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus riwayat pernikahan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

// =========================================================================
// 🚀 RIWAYAT PERCERAIAN HOOKS
// =========================================================================

/**
 * Hook untuk mengambil daftar Riwayat Perceraian
 * GET /api/kepegawaian/kawincerai/perceraian
 */
export const useRiwayatPerceraianList = (filters: PermohonanKawinFilters = {}) => {
    const { page = 1, limit = 10, ...otherFilters } = filters

    return useQuery<ApiListResponse<RiwayatPerceraianWithRelations>>({
        queryKey: ['riwayatPerceraian', filters],
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

            const res = await api.get(`/kepegawaian/kawincerai/perceraian?${params.toString()}`)
            return res.data as ApiListResponse<RiwayatPerceraianWithRelations>
        },
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk mendapatkan detail Riwayat Perceraian
 * GET /api/kepegawaian/kawincerai/perceraian/:id
 */
export const useGetRiwayatPerceraianDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiItemResponse<RiwayatPerceraianWithRelations>>({
        queryKey: ['riwayatPerceraian', id],
        queryFn: async () => {
            const res = await api.get(`/kepegawaian/kawincerai/perceraian/${id}`)
            return res.data as ApiItemResponse<RiwayatPerceraianWithRelations>
        },
        enabled: enabled && !!id,
        refetchOnWindowFocus: false,
    })
}

/**
 * Hook untuk membuat Riwayat Perceraian baru
 * POST /api/kepegawaian/kawincerai/perceraian
 */
export const useCreateRiwayatPerceraian = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<RiwayatPerceraianWithRelations>, any, RiwayatPerceraianInput>({
        mutationFn: async (formData: RiwayatPerceraianInput) => {
            const res = await api.post('/kepegawaian/kawincerai/perceraian', formData)
            return res.data
        },
        onSuccess: (response) => {
            const riwayat = response.data
            toast.success('✅ Riwayat perceraian berhasil ditambahkan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPerceraian'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menambahkan riwayat perceraian!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk memperbarui Riwayat Perceraian
 * PUT /api/kepegawaian/kawincerai/perceraian/:id
 */
export const useUpdateRiwayatPerceraian = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<RiwayatPerceraianWithRelations>, any, { id: string; formData: Partial<RiwayatPerceraianInput> }>({
        mutationFn: async (data) => {
            const res = await api.put(`/kepegawaian/kawincerai/perceraian/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (response) => {
            const riwayat = response.data
            toast.success('✅ Riwayat perceraian berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPerceraian'] })
            queryClient.invalidateQueries({ queryKey: ['riwayatPerceraian', riwayat.id] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate riwayat perceraian!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

/**
 * Hook untuk menghapus Riwayat Perceraian
 * DELETE /api/kepegawaian/kawincerai/perceraian/:id
 */
export const useDeleteRiwayatPerceraian = () => {
    const queryClient = useQueryClient()
    return useMutation<ApiItemResponse<RiwayatPerceraianWithRelations>, any, string>({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/kepegawaian/kawincerai/perceraian/${id}`)
            return res.data
        },
        onSuccess: (response) => {
            const riwayat = response.data
            toast.success('🗑️ Riwayat perceraian berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['riwayatPerceraian'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus riwayat perceraian!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}
