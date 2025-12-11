'use client'
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { useRouter, usePathname } from "next/navigation";
import { PermohonanMutasiFilters } from "@/hooks/fetch/mutasi/useMutasiPermohonan"; 

// Internal state menggunakan string karena diambil langsung dari <select>
interface InternalFilterState {
    status?: string
    jenis_mutasi?: string 
}

// Props menggunakan tipe yang diharapkan oleh parent (PermohonanMutasiFilters)
interface Props {
    onFilterChange: (filters: PermohonanMutasiFilters) => void
    currentFilters?: PermohonanMutasiFilters
}

const BUTTON_CLASSNAME = "flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4";

export default function MutasiStatusFilter({ onFilterChange, currentFilters }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [filters, setFilters] = useState<InternalFilterState>({
        status: currentFilters?.status || '',
        jenis_mutasi: currentFilters?.jenis_mutasi || '',
    })
    const [isInitialized, setIsInitialized] = useState(false)

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanMutasiFilters => {
        return {
            status: internalFilters.status || undefined,
            jenis_mutasi: internalFilters.jenis_mutasi || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: InternalFilterState = {
            status: params.get("status") || "",
            jenis_mutasi: params.get("jenis_mutasi") || "",
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
                jenis_mutasi: currentFilters.jenis_mutasi || '',
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
        
        // Update URL
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
    }

    const resetFilters = () => {
        const reset: InternalFilterState = {
        status: '',
        jenis_mutasi: '',
        }
        setFilters(reset)
        const resetOutput: PermohonanMutasiFilters = {};
        onFilterChange(resetOutput)
        // Hapus query parameter status dan jenis_mutasi dari URL
        const params = new URLSearchParams(window.location.search);
        params.delete('status');
        params.delete('jenis_mutasi');
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
    }

    // Status options untuk mutasi
    const statusOptions = [
        { value: 'DIAJUKAN', label: 'Diajukan' },
        { value: 'DISETUJUI_KA_UNIT', label: 'Disetujui KA Unit' },
        { value: 'DISETUJUI_KA_BIDANG', label: 'Disetujui KA Bidang' },
        { value: 'VALIDASI_KEPEGAWAIAN', label: 'Validasi Kepegawaian' },
        { value: 'DISETUJUI_AKHIR', label: 'Disetujui Akhir' },
        { value: 'DITOLAK', label: 'Ditolak' },
        { value: 'DIREVISI', label: 'Direvisi' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
        { value: 'SELESAI', label: 'Selesai' },
    ]

    // Jenis Mutasi options
    const jenisMutasiOptions = [
        { value: 'MUTASI_KELUAR', label: 'Mutasi Keluar' },
        { value: 'MUTASI_MASUK', label: 'Mutasi Masuk' },
        { value: 'PROMOSI', label: 'Promosi' },
        { value: 'DEMOSI', label: 'Demosi' },
        { value: 'ROTASI', label: 'Rotasi' },
    ]

    return (
        <div className="flex flex-col gap-3">
            {/* Status Permohonan Mutasi */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status Mutasi</label>
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

            {/* Jenis Mutasi */}
            <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Jenis Mutasi</label>
                <select 
                    name="jenis_mutasi" 
                    value={filters.jenis_mutasi} 
                    onChange={handleChange} 
                    className={`${BUTTON_CLASSNAME} appearance-none pr-10`}
                >
                    <option value="">Semua Jenis</option>
                    {jenisMutasiOptions.map(jenis => (
                        <option key={jenis.value} value={jenis.value}>
                            {jenis.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reset */}
            <button className={`${BUTTON_CLASSNAME} flex flex-row items-center gap-1`} onClick={resetFilters}>
                <RiResetRightLine className='h-4 w-4' />
                Reset Filter
            </button>
        </div>
    )
}

