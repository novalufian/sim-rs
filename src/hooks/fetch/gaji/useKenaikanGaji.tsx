import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Response envelopes
export interface KgbListResponse<T> {
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

export interface KgbItemResponse<T> {
    success: boolean
    message: string
    data: T
}

// Item shape based on your sample
export interface KenaikanGajiItem {
    id: string
    id_pegawai: string
    tanggal_pengajuan: string
    gaji_pokok_lama: number
    gaji_pokok_baru: number
    tmt_kgb_lama: string
    tmt_kgb_baru: string
    masa_kerja_gol_lama: string
    masa_kerja_gol_baru: string
    no_sk_kgb: string | null
    tanggal_sk_kgb: string | null
    status: string
    catatan_kepegawaian: string | null
    catatan_penolakan: string | null
    created_at: string
    updated_at: string
    pegawai_nama: string
    pegawai_nip: string
    selisih_gaji: number
    persentase_kenaikan: number
}

// Filters
export interface KgbFilters {
    id_pegawai?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

const BASE_PATH = '/kepegawaian/gajiberkala'

// List query with filters
export const useKenaikanGaji = (filters: KgbFilters = {}) => {
    const {
        id_pegawai,
        status,
        startDate,
        endDate,
        page,
        limit,
        sortBy,
        sortOrder,
    } = filters

    return useQuery<KgbListResponse<KenaikanGajiItem>>({
        queryKey: ['kgb', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (id_pegawai) params.append('id_pegawai', id_pegawai)
            if (status) params.append('status', status)
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if(page) params.append('page', String(page))
            if(limit) params.append('limit', String(limit))
            if (sortBy) params.append('sortBy', sortBy)
            if (sortOrder) params.append('sortOrder', sortOrder)
            console.log(`${BASE_PATH}?${params.toString()}`)
            const res = await api.get(`${BASE_PATH}?${params.toString()}`)
            return res.data as KgbListResponse<KenaikanGajiItem>
        },
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Get by id
export const useKenaikanGajiById = (id: string | undefined) => {
    return useQuery<KgbItemResponse<KenaikanGajiItem>>({
        queryKey: ['kgb', id],
        queryFn: async () => {
            const res = await api.get(`${BASE_PATH}/${id}`)
            return res.data as KgbItemResponse<KenaikanGajiItem>
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Create
export const usePostKenaikanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: Partial<KenaikanGajiItem>) => {
            const res = await api.post(BASE_PATH, formData)
            return (res.data as KgbItemResponse<KenaikanGajiItem>).data
        },
        onSuccess: (data) => {
            toast.success('KGB berhasil dibuat!')
            queryClient.invalidateQueries({ queryKey: ['kgb'] })
            if (data?.id_pegawai) {
                queryClient.invalidateQueries({ queryKey: ['kgb', { id_pegawai: data.id_pegawai }] })
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Gagal membuat KGB'
            toast.error(message)
        },
    })
}

// Update
export const useUpdateKenaikanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: Partial<KenaikanGajiItem> }) => {
            const res = await api.put(`${BASE_PATH}/${data.id}`, data.formData)
            return (res.data as KgbItemResponse<KenaikanGajiItem>).data
        },
        onSuccess: (data) => {
            toast.success('KGB berhasil diupdate!')
            queryClient.invalidateQueries({ queryKey: ['kgb'] })
            queryClient.invalidateQueries({ queryKey: ['kgb', data.id] })
            if (data?.id_pegawai) {
                queryClient.invalidateQueries({ queryKey: ['kgb', { id_pegawai: data.id_pegawai }] })
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Gagal mengupdate KGB'
            toast.error(message)
        },
    })
}

// Delete
export const useDeleteKenaikanGaji = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`${BASE_PATH}/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('KGB berhasil dihapus!')
            queryClient.invalidateQueries({ queryKey: ['kgb'] })
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Gagal menghapus KGB'
            toast.error(message)
        },
    })
}


