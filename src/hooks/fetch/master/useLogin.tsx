import api from '@/libs/api'
import { useQuery , useMutation, useQueryClient} from '@tanstack/react-query'

export const useLogin = () => {
    return useQuery({
        queryKey: ['login'], // caching per filter
        queryFn: async () => {
            const res = await api.get(`/api/login`)
            return res.data
        },
        // staleTime: 1000 * 60 * 5, // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useLoginPost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/master/login', formData)
            return res.data
        },
        onSuccess: (data) => {
            console.log('✅ Login berhasil!', data)
            // You can trigger toast here or redirect
            queryClient.invalidateQueries({ queryKey: ['login'] })
        },
        onError: (error: any) => {
            if (error.response) {
                const message = error.response.data?.message || 'Unknown error'
                const validationErrors = error.response.data?.data

                console.error("🛑 Validation error:", message, validationErrors)
                // You can trigger toast here or redirect
            }
        },
    })
}
