import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

export const useAduanStatGroup = (group: string) => {
    return useQuery({
        queryKey: ['totalAduanStat', group],
        queryFn: async () => {
            const res = await api.get(`/aduan/stat/totalAduan/${group}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useAduanTotal = () => {
    return useQuery({
        queryKey: ['totalAduan'],
        queryFn: async () => {
            const res = await api.get(`/aduan/stat/totalAduan`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useTrendAduan = () => {
    return useQuery({
        queryKey: ['trendAduan'],
        queryFn: async () => {
            const res = await api.get(`/aduan/stat/trendAduan`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}


export const useAduanBidang = () => {
    return useQuery({
        queryKey: ['totalAduanBidang'],
        queryFn: async () => {
            const res = await api.get(`/aduan/stat/totalAduanBidang`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useSkriningMasalah = () => {
    return useQuery({
        queryKey: ['skriningAduan'],
        queryFn: async () => {
            const res = await api.get(`/aduan/stat/skriningMasalah`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}