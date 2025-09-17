import api from '@/libs/api'
import { useQuery } from '@tanstack/react-query'

// Interface for pegawai statistics filters
interface PegawaiStatsFilters {
    startDate?: string
    endDate?: string
    unit_kerja?: string
    status_pekerjaan?: string
}

// Interface for statistics data structure
export interface PegawaiStatData {
    label: string
    value: number
    percentage?: number
    color?: string
}

// Interface for gender-specific stats
export interface GenderStatsData {
    perempuan: number
    lakiLaki: number
    total: number
    perempuanPercentage: number
    lakiLakiPercentage: number
}

// Interface for agama-specific stats
export interface AgamaStatsData {
    count: number
    agama: string
}

// Interface for status perkawinan-specific stats
export interface StatusPerkawinanStatsData {
    count: number
    status_perkawinan: string
}

// Interface for umur-specific stats
export interface UmurStatsData {
    "20-29": number
    "30-39": number
    "40-49": number
    "50-59": number
    "60+": number
}

// Interface for status pekerjaan-specific stats
export interface StatusPekerjaanStatsData {
    count: number
    status_pekerjaan: string
}

export interface PegawaiStatsResponse {
    success: boolean
    message: string
    data: {
        state: GenderStatsData
        total: number
        gender: string
    }
}

export interface PegawaiAgamaResponse {
    success: boolean
    message: string
    data: AgamaStatsData[]
}

export interface PegawaiStatusPerkawinanResponse {
    success: boolean
    message: string
    data: StatusPerkawinanStatsData[]
}

export interface PegawaiUmurResponse {
    success: boolean
    message: string
    data: UmurStatsData
}

export interface PegawaiStatusPekerjaanResponse {
    success: boolean
    message: string
    data: StatusPekerjaanStatsData[]
}

// Hook for jenis kelamin statistics
export const usePegawaiJenisKelamin = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
        status_pekerjaan,
    } = filters
    
    return useQuery({
        queryKey: ['pegawai-stats', 'jenis-kelamin', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
                if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                            
            const res = await api.get(`/pegawai/stats/jenis-kelamin?${params.toString()}`)
            return res.data as PegawaiStatsResponse
        },
        staleTime: 1000 * 60 * 20, // cache for 20 mins
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Hook for agama statistics
export const usePegawaiAgama = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
        status_pekerjaan,
    } = filters

    return useQuery({
        queryKey: ['pegawai-stats', 'agama', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
            if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)

            const res = await api.get(`/pegawai/stats/agama?${params.toString()}`)
            return res.data as PegawaiAgamaResponse
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Hook for status perkawinan statistics
export const usePegawaiStatusPerkawinan = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
        status_pekerjaan,
    } = filters
    
    return useQuery({
        queryKey: ['pegawai-stats', 'status-perkawinan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
            if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                            
            const res = await api.get(`/pegawai/stats/status-perkawinan?${params.toString()}`)
            return res.data as PegawaiStatusPerkawinanResponse
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Hook for umur statistics
export const usePegawaiUmur = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
        status_pekerjaan,
    } = filters
    
    return useQuery({
        queryKey: ['pegawai-stats', 'umur', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
            if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                            
            const res = await api.get(`/pegawai/stats/umur?${params.toString()}`)
            return res.data as PegawaiUmurResponse
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Hook for status pekerjaan statistics
export const usePegawaiStatusPekerjaan = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
    } = filters
    
    return useQuery({
        queryKey: ['pegawai-stats', 'status-pekerjaan', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
                        
            const res = await api.get(`/pegawai/stats/status-pekerjaan?${params.toString()}`)
            return res.data as PegawaiStatusPekerjaanResponse
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Hook for gelar statistics
export const usePegawaiGelar = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
        status_pekerjaan,
    } = filters
    
    return useQuery({
        queryKey: ['pegawai-stats', 'gelar', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
            if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                            
            const res = await api.get(`/pegawai/stats/gelar?${params.toString()}`)
            return res.data as PegawaiStatsResponse
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}

// Combined hook that returns all statistics at once
export const usePegawaiAllStats = (filters: PegawaiStatsFilters = {}) => {
    const jenisKelamin = usePegawaiJenisKelamin(filters)
    const agama = usePegawaiAgama(filters)
    const statusPerkawinan = usePegawaiStatusPerkawinan(filters)
    const umur = usePegawaiUmur(filters)
    const statusPekerjaan = usePegawaiStatusPekerjaan(filters)
    const gelar = usePegawaiGelar(filters)
    
    return {
        jenisKelamin,
        agama,
        statusPerkawinan,
        umur,
        statusPekerjaan,
        gelar,
        isLoading: jenisKelamin.isLoading || agama.isLoading || statusPerkawinan.isLoading || 
        umur.isLoading || statusPekerjaan.isLoading || gelar.isLoading,
        isError: jenisKelamin.isError || agama.isError || statusPerkawinan.isError || 
        umur.isError || statusPekerjaan.isError || gelar.isError,
    }
}

// Hook for total pegawai count
export const usePegawaiTotal = (filters: PegawaiStatsFilters = {}) => {
    const {
        startDate,
        endDate,
        unit_kerja,
        status_pekerjaan,
    } = filters
    
    return useQuery({
        queryKey: ['pegawai-total', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (unit_kerja) params.append('unit_kerja', unit_kerja)
            if (status_pekerjaan) params.append('status_pekerjaan', status_pekerjaan)
                            
            const res = await api.get(`/pegawai/stats/total?${params.toString()}`)
            return res.data as { total: number; active: number; inactive: number }
        },
        staleTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })
}
