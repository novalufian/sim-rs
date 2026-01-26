import api from '@/libs/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export interface StatusPendidikanItem {
    id: number
    nama: string
}

export interface ApiItemResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface StatusPendidikanListData {
    statusPendidikan: StatusPendidikanItem[]
}

// GET /master/status_pendidikan/ — List (response: data.statusPendidikan)
export const useStatusPendidikan = () => {
    return useQuery<ApiItemResponse<StatusPendidikanListData>>({
        queryKey: ['statusPendidikan'],
        queryFn: async () => {
            const res = await api.get(`/master/status_pendidikan`)
            return res.data as ApiItemResponse<StatusPendidikanListData>
        },
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// POST /master/status_pendidikan
export const usePostStatusPendidikan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: Partial<StatusPendidikanItem>) => {
            const res = await api.post('/master/status_pendidikan', formData)
            return res.data
        },
        onSuccess: (data) => {
            toast.success('✅ Status pendidikan berhasil ditambahkan!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['statusPendidikan'] })
            queryClient.invalidateQueries({ queryKey: ['statusPendidikan', 'search'] })
            console.log('🟢 Data:', data)
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menambahkan status pendidikan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

// GET /master/status_pendidikan/:id
export const useStatusPendidikanById = (id: string) => {
    return useQuery<ApiItemResponse<StatusPendidikanItem>>({
        queryKey: ['statusPendidikan', id],
        queryFn: async () => {
            const res = await api.get(`/master/status_pendidikan/${id}`)
            return res.data as ApiItemResponse<StatusPendidikanItem>
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// PUT /master/status_pendidikan/:id
export const useUpdateStatusPendidikan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: Partial<StatusPendidikanItem> }) => {
            const res = await api.put(`/master/status_pendidikan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (data) => {
            toast.success('✅ Status pendidikan berhasil diupdate!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['statusPendidikan'] })
            queryClient.invalidateQueries({ queryKey: ['statusPendidikan', 'search'] })
            console.log('🟢 Data:', data)
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengupdate status pendidikan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

// DELETE /master/status_pendidikan/:id
export const useDeleteStatusPendidikan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/master/status_pendidikan/${id}`)
            return res.data
        },
        onSuccess: (data) => {
            toast.success('🗑️ Status pendidikan berhasil dihapus!', { position: 'bottom-right' })
            queryClient.invalidateQueries({ queryKey: ['statusPendidikan'] })
            queryClient.invalidateQueries({ queryKey: ['statusPendidikan', 'search'] })
            console.log('🟢 Data:', data)
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal menghapus status pendidikan!'
            toast.error(message, { position: 'bottom-right' })
        },
    })
}

// GET /master/status_pendidikan/search
export const useStatusPendidikanSearch = (search: string) => {
    return useQuery<ApiItemResponse<StatusPendidikanItem[]>>({
        queryKey: ['statusPendidikan', 'search', search],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
                const res = await api.get(`/master/status_pendidikan/search?${params.toString()}`)
            return res.data as ApiItemResponse<StatusPendidikanItem[]>
        },
        enabled: !!search,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}
