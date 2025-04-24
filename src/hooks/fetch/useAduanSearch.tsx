import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

interface AduanSearchFilters {
    q: string
    page?: number
    limit?: number
    status?: string
    klasifikasi?: string
    priority?: string
    startDate?: string
    endDate?: string
}

export const UseAduanSearch = (filters: AduanSearchFilters) => {
    const { q, page = 1, limit = 10,status, klasifikasi, priority,startDate, endDate } = filters

    const params = new URLSearchParams()
    params.append('q', q)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    if (status) params.append('status', status)
    if (klasifikasi) params.append('klasifikasi', klasifikasi)
    if (priority) params.append('priority', priority)
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    return useQuery({
        queryKey: ['aduan-search', filters],
        queryFn: async () => {
        const res = await api.get(`/aduan/search?${params.toString()}`)
        return res.data
        },
        enabled: !!q, // only run when search query exists
        staleTime: 1000 * 60 * 2,
    })
}
