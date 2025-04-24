import api from '@/libs/api'
import { useQuery , useMutation} from '@tanstack/react-query'

export const useBidang = () => {
    return useQuery({
        queryKey: ['bidang'],
        queryFn: async () => {
            const res = await api.get('/public/bidang')
            return res.data
        },
        staleTime: 1000 * 60 * 60 * 24, // cache for 1 day
    })
}