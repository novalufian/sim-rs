// hooks/useWhoami.ts
import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie';  // Import js-cookie

export const useWhoami = () => {
    const token = Cookies.get('token')
    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
            try{
                const res = await api.get(`/auth/whoami`)
                return res.data
            } catch (error: any) {
                return error.response.data
            }
        },
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        enabled: !!token,
    })
}

export const useWhoamiWithCache = () => {
    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
            const res = await api.get(`/auth/whoami`)
            return res.data
        },
        staleTime: 1000 , // cache for 5 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}
