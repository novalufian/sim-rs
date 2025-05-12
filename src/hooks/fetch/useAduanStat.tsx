import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

interface AduanFilters {
    startDate?: string
    endDate?: string
}

export const useAduanStatGroup = (group: string, filters: AduanFilters = {}) => {
    const {
        startDate,
        endDate,
    } = filters

    return useQuery({
        queryKey: ['totalAduanStat', group],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)

            const res = await api.get(`/aduan/stat/totalAduan/${group}?${params.toString()}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useAduanTotal = (filters: AduanFilters = {}) => {
    const {
        startDate,
        endDate,
    } = filters
    return useQuery({
        queryKey: ['totalAduan'],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)

            const res = await api.get(`/aduan/stat/totalAduan?${params.toString()}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useTrendAduan = (filters: AduanFilters = {}) => {
    const {
        startDate,
        endDate,
    } = filters
    return useQuery({
        queryKey: ['trendAduan'],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            const res = await api.get(`/aduan/stat/trendAduan?${params.toString()}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}


export const useAduanBidang = (filters: AduanFilters = {}) => {
    const {
        startDate,
        endDate,
    } = filters
    return useQuery({
        queryKey: ['totalAduanBidang'],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)

            const res = await api.get(`/aduan/stat/totalAduanBidang?${params.toString()}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

export const useSkriningMasalah = (filters: AduanFilters = {}) => {
    const {
        startDate,
        endDate,
    } = filters
    return useQuery({
        queryKey: ['skriningAduan'],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            const res = await api.get(`/aduan/stat/skriningMasalah?${params.toString()}`)
            return res.data
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}