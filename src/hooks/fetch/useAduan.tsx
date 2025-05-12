import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast, { ToastBar } from 'react-hot-toast'
interface AduanFilters {
    status?: string
    klasifikasi?: string
    priority?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

export const useAduan = (filters: AduanFilters = {}) => {
    const {
        status,
        klasifikasi,
        priority,
        startDate,
        endDate,
        page = 1,
        limit = 10,
    } = filters


    return useQuery({
        queryKey: ['aduan', filters], // caching per filter
        queryFn: async () => {
            const params = new URLSearchParams()

            if (status) params.append('status', status)
            if (klasifikasi) params.append('klasifikasi', klasifikasi)
            if (priority) params.append('priority', priority)
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)

            params.append('page', page.toString())
            params.append('limit', limit.toString())

            const res = await api.get(`/aduan?${params.toString()}`)
            return res.data
        },
        // staleTime: 1000 * 60 * 5, // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useAduanId = (id: string) => {
    return useQuery({
        queryKey: ['aduan', id],
        queryFn: async () => {
            const res = await api.get(`/aduan/id/${id}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useAduanDelete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/aduan/${id}`)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Laporan berhasil dihapus!', data)
            toast.success('Laporan berhasil dihapus!')
            queryClient.invalidateQueries({ queryKey: ['aduan'] })
        },
        onError: (error: any) => {
            console.error("❌ Error deleting:", error)
            toast.error('Gagal menghapus laporan!')
        },
    })
}


export const usePostAduan = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/aduan', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Laporan berhasil dikirim!', data)
            // You can trigger toast here or redirect
            queryClient.invalidateQueries({ queryKey: ['aduan'] })
        },
        onError: (error: any) => {
            if (error.response) {
                const message = error.response.data?.message || 'Unknown error'
                const validationErrors = error.response.data?.data
            
                console.error("🛑 Validation error:", message)
            
                if (Array.isArray(validationErrors)) {
                    validationErrors.forEach((err: any) => {
                    console.error(`🔸 ${err.path.join('.')} - ${err.message}`)
                    toast(`${err.path.join('.')} - ${err.message}`, {
                        icon: '❌',
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                        duration: 5000
                    })
                    
                    })
                }
            } else {
                console.error("❌ Unexpected error:", error)
            }
        },
    })
}

export const useUpdateAduan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: any) => {
            console.log(data)
            const res = await api.put('/aduan/' + data.id, data.formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Laporan berhasil diupdate!', data)
            toast.success('Laporan berhasil diupdate!')
            queryClient.invalidateQueries({ queryKey: ['aduan'] })
        },
        
        onError: (error: any) => {
            console.error("❌ Error updating:", error)
            toast.error('Gagal mengupdate laporan!')
        },
    })
}


export const updateAduanStatus =()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/aduan/status/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Aduan berhasil diupdate!', data)
            toast.success('Aduan berhasil diupdate!')

            queryClient.invalidateQueries({
                queryKey: ['aduan'],
            })
        },
        
        onError: (error: any) => {
            console.error("❌ Error updating:", error)
            toast.error('Gagal mengupdate aduan!')
        },
    })
}
