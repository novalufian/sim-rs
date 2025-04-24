'use client'
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";

interface FilterState {
    status?: string
    klasifikasi?: string
    priority?: string
}

interface Props {
    onFilterChange: (filters: FilterState) => void
}

export default function AduanQueryFilter({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<FilterState>({})
    const [isInitialized, setIsInitialized] = useState(false) // prevent double set

    const _CLASSNAME_ = "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

    // Read query params on first mount
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search)

            const initialFilters: FilterState = {
                status: params.get("status")?.toUpperCase() || "",
                klasifikasi: params.get("klasifikasi")?.toUpperCase() || "",
                priority: params.get("priority")?.toUpperCase() || "",
            }

            setFilters(initialFilters)
            onFilterChange(initialFilters)
            setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const updatedFilters = {
            ...filters,
            [name]: value,
        }
        setFilters(updatedFilters)
        console.table(updatedFilters)
        onFilterChange(updatedFilters)
    }

    const resetFilters = () => {
        const reset = { status: '', klasifikasi: '', priority: '' }
        setFilters(reset)
        onFilterChange(reset)
    }

    return (
        <>
            {/* Status */}
            <div className="relative">
                <select
                    name="status"
                    className={`${_CLASSNAME_} pr-10`}
                    onChange={handleChange}
                    value={filters.status}
                >
                    <option value="">Status</option>
                    <option value="OPEN">Open</option>
                    <option value="ON_PROGRESS">In Progress</option>
                    <option value="CLOSE">Close</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Klasifikasi */}
            <div className="relative">
                <select
                    name="klasifikasi"
                    value={filters.klasifikasi}
                    onChange={handleChange}
                    className={`${_CLASSNAME_} pr-10`}
                >
                    <option value="">Klasifikasi</option>
                    <option value="PENGADUAN">Aduan</option>
                    <option value="ASPIRASI">Aspirasi</option>
                    <option value="PERMINTAAN_INFORMASI">Permintaan Informasi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Priority */}
            <div className="relative">
                <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleChange}
                    className={`${_CLASSNAME_} pr-10`}
                >
                    <option value="">Prioritas</option>
                    <option value="HIGHT">Hight</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Reset Button */}
            <button
                className={`${_CLASSNAME_} flex flex-row items-center gap-1`}
                onClick={resetFilters}
            >
                <RiResetRightLine className='h-4 w-4' />
                Reset
            </button>
        </>
    )
}
