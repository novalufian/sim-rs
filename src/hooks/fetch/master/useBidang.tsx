import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const useBidang = () => {
    return useQuery({
        queryKey: ['bidang'], // caching per filter
        queryFn: async () => {
            const res = await api.get(`/master/bidang`)
            return res.data
        },
        // staleTime: 1000 * 60 * 5, // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useBidangId = (id: string) => {
    return useQuery({
        queryKey: ['bidang', id],
        queryFn: async () => {
            const res = await api.get(`/master/bidang/id/${id}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useBidangDelete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/master/bidang/${id}`)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Bidang berhasil dihapus!', data)
            queryClient.invalidateQueries({ queryKey: ['bidang'] })
        },
        onError: (error: any) => {
            // console.error("❌ Error deleting:", error)
            return error;
        },
    })
}


export const usePostBidang = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/master/bidang', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Bidang berhasil dikirim!', data)
            // You can trigger toast here or redirect
            queryClient.invalidateQueries({ queryKey: ['bidang'] })
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


export const useUpdateBidang =()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { id: string; formData: any }) => {
            const res = await api.put(`/master/bidang/${data.id}`, data.formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Bidang berhasil diupdate!', data)
            toast.success('Bidang berhasil diupdate!')

            queryClient.invalidateQueries({ queryKey: ['bidang'] })
        },

        onError: (error: any) => {
            console.error("❌ Error updating:", error)
            toast.error('Gagal mengupdate bidang!')
        },
    })
}

export const useSearchBidang = () => {

    return useQuery({
        queryKey: ['bidang'], // caching per filter
        queryFn: async () => {
            const params = new URLSearchParams()

            const res = await api.get(`/master/bidang/search?${params.toString()}`)
            return res.data
        },
        // staleTime: 1000 * 60 * 5, // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}
