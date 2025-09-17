import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Filters for querying jatah cuti
export interface CutiJatahFilters {
    id_pegawai?: string
    year?: number // mapped to 'tahun' on API
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// Shape of a single jatah cuti item
export interface CutiJatahItem {
    id: string
    id_pegawai: string
    tahun: number
    jumlah_jatah: number
    sisa_jatah: number
    created_at: string
    updated_at: string
    pegawai_nama?: string
    pegawai_nip?: string
    is_deleted?: boolean
}

// List response shape
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

const BASE_PATH = '/kepegawaian/cuti/jatah'

// Query: list with filters & pagination
export const useCutiJatah = (filters: CutiJatahFilters = {}) => {
    const {
        id_pegawai,
        year,
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
    } = filters
    
    return useQuery<ApiListResponse<CutiJatahItem>>({
        queryKey: ['cutiJatah', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            
            if (id_pegawai) params.append('id_pegawai', id_pegawai)
                if (typeof year === 'number') params.append('tahun', String(year))
                        
            params.append('page', String(page))
            params.append('limit', String(limit))
            
            if (sortBy) params.append('sortBy', sortBy)
                if (sortOrder) params.append('sortOrder', sortOrder)
                    
            const res = await api.get(`${BASE_PATH}?${params.toString()}`)
            return res.data as ApiListResponse<CutiJatahItem>
        },
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Query: get single by id (record id)
export const useCutiJatahById = (id: string | undefined) => {
    return useQuery<ApiItemResponse<CutiJatahItem>>({
        queryKey: ['cutiJatah', id],
        queryFn: async () => {
            const res = await api.get(`${BASE_PATH}/${id}`)
            return res.data as ApiItemResponse<CutiJatahItem>
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Query: get jatah by id_pegawai and optional year (convenience)
export const useCutiJatahByPegawai = (id_pegawai: string | undefined, year?: number) => {
    return useQuery<ApiListResponse<CutiJatahItem>>({
        queryKey: ['cutiJatah', 'pegawai', id_pegawai, year],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (id_pegawai) params.append('id_pegawai', id_pegawai)
                if (typeof year === 'number') params.append('tahun', String(year))
                    const res = await api.get(`${BASE_PATH}?${params.toString()}`)
                console.log(`${BASE_PATH}?${params.toString()}`)
            return res.data as ApiListResponse<CutiJatahItem>
        },
        enabled: !!id_pegawai,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Mutation: create
export const usePostCutiJatah = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (formData: Partial<CutiJatahItem>) => {
            const res = await api.post(BASE_PATH, formData)
            return (res.data as ApiItemResponse<CutiJatahItem>).data
        },
        onSuccess: (data) => {
            toast.success('Jatah cuti berhasil ditambahkan!')
            queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
            if (data?.id_pegawai) {
                queryClient.invalidateQueries({ queryKey: ['cutiJatah', 'pegawai', data.id_pegawai] })
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Gagal menambahkan jatah cuti'
            toast.error(message)
        },
    })
}

// Mutation: update
export const useUpdateCutiJatah = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (data: { id: string; formData: Partial<CutiJatahItem> }) => {
            const res = await api.put(`${BASE_PATH}/${data.id}`, data.formData)
            return (res.data as ApiItemResponse<CutiJatahItem>).data
        },
        onSuccess: (data) => {
            toast.success('Jatah cuti berhasil diupdate!')
            queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
            queryClient.invalidateQueries({ queryKey: ['cutiJatah', data.id] })
            if (data?.id_pegawai) {
                queryClient.invalidateQueries({ queryKey: ['cutiJatah', 'pegawai', data.id_pegawai] })
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Gagal mengupdate jatah cuti'
            toast.error(message)
        },
    })
}

// Mutation: delete
export const useDeleteCutiJatah = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`${BASE_PATH}/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('Jatah cuti berhasil dihapus!')
            queryClient.invalidateQueries({ queryKey: ['cutiJatah'] })
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Gagal menghapus jatah cuti'
            toast.error(message)
        },
    })
}


