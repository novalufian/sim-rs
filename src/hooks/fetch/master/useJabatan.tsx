import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface JabatanFilters {
    status?: string
    page?: number
    limit?: number
}

export const useJabatan = () => {
    return useQuery({
        queryKey: ['jabatan'], // caching per filter
        queryFn: async () => {
            const res = await api.get(`/public/jenis_jabatan`)
            return res.data
        },
        // staleTime: 1000 * 60 * 5, // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useJabatanId = (id: string) => {
    return useQuery({
        queryKey: ['jabatan', id],
        queryFn: async () => {
            const res = await api.get(`/master/jenis_jabatan/id/${id}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useJabatanDelete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/master/jenis_jabatan/${id}`)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Jabatan berhasil dihapus!', data)
            queryClient.invalidateQueries({ queryKey: ['jabatan'] })
        },
        onError: (error: any) => {
            // console.error("❌ Error deleting:", error)
            return error;
        },
    })
}


export const usePostJabatan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/master/jenis_jabatan', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Jabatan berhasil dikirim!', data)
            // You can trigger toast here or redirect
            queryClient.invalidateQueries({ queryKey: ['jabatan'] })
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

export const useUpdateJabatan =()=>{    
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/master/jenis_jabatan/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Jabatan berhasil diupdate!', data)
            toast.success('Jabatan berhasil diupdate!')

            queryClient.invalidateQueries({ queryKey: ['jabatan'] })
        },
        
        onError: (error: any) => {
            console.error("❌ Error updating:", error)
            toast.error('Gagal mengupdate jabatan!')
        },
    })
}