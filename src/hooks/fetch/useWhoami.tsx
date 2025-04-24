// hooks/useWhoami.ts
import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

export const useWhoami = () => {
    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
        const res = await api.get(`/auth/whoami`)
        return res.data
        },
        staleTime: 1000 * 60 * 5, // cache for 5 mins
    })
}
