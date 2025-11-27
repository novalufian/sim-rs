'use client'
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { PermohonanKawinFilters } from "@/hooks/fetch/kawin/useKawinPermohonan";

interface InternalFilterState {
    status?: string
}

interface Props {
    onFilterChange: (filters: PermohonanKawinFilters) => void
    currentFilters?: PermohonanKawinFilters
}

const BUTTON_CLASSNAME = "flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4";

export default function KawinStatusFilter({ onFilterChange, currentFilters }: Props) {
    const [filters, setFilters] = useState<InternalFilterState>({
        status: currentFilters?.status || '',
    })
    const [isInitialized, setIsInitialized] = useState(false)

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanKawinFilters => {
        return {
            status: internalFilters.status || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search)
            const initialFilters: InternalFilterState = {
                status: params.get("status") || "",
            }
            setFilters(initialFilters)
            onFilterChange(convertToOutput(initialFilters));
            setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    useEffect(() => {
        if (currentFilters) {
            setFilters({
                status: currentFilters.status || '',
            })
        }
    }, [currentFilters])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const updatedInternalFilters = {
            ...filters,
            [name]: value,
        }
        setFilters(updatedInternalFilters)
        onFilterChange(convertToOutput(updatedInternalFilters))
    }

    const resetFilters = () => {
        const reset: InternalFilterState = {
            status: '',
        }
        setFilters(reset)
        const resetOutput: PermohonanKawinFilters = {};
        onFilterChange(resetOutput)
    }

    const statusOptions = [
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'MENUNGGU', label: 'Menunggu' },
        { value: 'PROSES', label: 'Proses' },
        { value: 'VALIDASI', label: 'Validasi' },
        { value: 'DISETUJUI', label: 'Disetujui' },
        { value: 'DISETUJUI_AKHIR', label: 'Disetujui Akhir' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
        { value: 'SELESAI', label: 'Selesai' },
        { value: 'KAWIN', label: 'Kawin' },
        { value: 'CERAI_MATI', label: 'Cerai Mati' },
        { value: 'CERAI_HIDUP', label: 'Cerai Hidup' },
    ]

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status</label>
                <select
                    name="status"
                    className={`${BUTTON_CLASSNAME} appearance-none pr-10`}
                    value={filters.status}
                    onChange={handleChange}
                >
                    <option value="">Semua Status</option>
                    {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            <button className={`${BUTTON_CLASSNAME} flex flex-row items-center gap-1`} onClick={resetFilters}>
                <RiResetRightLine className='h-4 w-4' /> Reset Filter
            </button>
        </div>
    )
}

