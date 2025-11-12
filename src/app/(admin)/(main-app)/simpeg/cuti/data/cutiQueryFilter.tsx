'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";  
import { StatusCuti } from "./cutiPermohonan";
// Import PermohonanCutiFilters agar tipe output props cocok dengan page.tsx
import { PermohonanCutiFilters } from "@/hooks/fetch/cuti/useCutiPermohonan"; 

// Internal state menggunakan string karena diambil langsung dari <select>
interface InternalFilterState {
    status?: string
    id_jenis_cuti?: string 
    startDate?: string
    endDate?: string
}

// Props menggunakan tipe yang diharapkan oleh parent (PermohonanCutiFilters)
interface Props {
    onFilterChange: (filters: PermohonanCutiFilters) => void
}

 export default function CutiQueryFilter({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<InternalFilterState>({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [focusedInput, setFocusedInput] = useState<any>(null)

    const _CLASSNAME_ =
        "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

    const convertToOutput = (internalFilters: InternalFilterState): PermohonanCutiFilters => {
        // Lakukan konversi string 'id_jenis_cuti' ke number
        return {
            status: internalFilters.status || undefined,
            id_jenis_cuti: internalFilters.id_jenis_cuti 
                ? parseInt(internalFilters.id_jenis_cuti, 10) 
                : undefined,
            startDate: internalFilters.startDate || undefined,
            endDate: internalFilters.endDate || undefined,
        };
    };

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
        const params = new URLSearchParams(window.location.search)

        const initialFilters: InternalFilterState = {
            status: params.get("status") || "",
            id_jenis_cuti: params.get("id_jenis_cuti") || "",
            startDate: params.get("startDate") || "",
            endDate: params.get("endDate") || "",
        }

        setFilters(initialFilters)
        onFilterChange(convertToOutput(initialFilters)); // Konversi saat inisialisasi
        setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const updatedInternalFilters = {
        ...filters,
        [name]: value,
        }
        setFilters(updatedInternalFilters)
        onFilterChange(convertToOutput(updatedInternalFilters)) // Konversi saat perubahan
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        const updatedInternalFilters = {
        ...filters,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
        endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        }
        setFilters(updatedInternalFilters)
        onFilterChange(convertToOutput(updatedInternalFilters)); // Konversi saat perubahan tanggal
    };

    const resetFilters = () => {
        const reset: InternalFilterState = {
        status: '',
        id_jenis_cuti: '',
        startDate: '',
        endDate: '',
        }
        setFilters(reset)
        const resetOutput: PermohonanCutiFilters = {};
        onFilterChange(resetOutput)
    }

    const statusOptions = Object.values(StatusCuti);

    // Placeholder data Jenis Cuti (Value di sini harus STRING '1', '2', dll.)
    const jenisCutiOptions = [
        { id: '1', name: 'Cuti Tahunan' },
        { id: '2', name: 'Cuti Sakit' },
        { id: '3', name: 'Cuti Melahirkan' },
        { id: '4', name: 'Cuti Besar' },
    ]

    return (
        <div className="flex flex-wrap gap-2">
        {/* Status Permohonan Cuti */}
        <select name="status" className={`${_CLASSNAME_} pr-10`} value={filters.status} onChange={handleChange}>
            <option value="">Status Cuti</option>
            {statusOptions.map(status => (
                <option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                </option>
            ))}
        </select>

        {/* Jenis Cuti */}
        <select name="id_jenis_cuti" value={filters.id_jenis_cuti} onChange={handleChange} className={`${_CLASSNAME_} pr-10`}>
            <option value="">Jenis Cuti</option>
            {jenisCutiOptions.map(jenis => (
                <option key={jenis.id} value={jenis.id}>
                    {jenis.name}
                </option>
            ))}
        </select>

        {/* Date Range (Tanggal Cuti) */}
        <div className={"relative " + _CLASSNAME_}>
            <DateRangePicker
            startDate={filters.startDate ? moment(filters.startDate) : null}
            endDate={filters.endDate ? moment(filters.endDate) : null}
            onDatesChange={handleDateChange}
            startDateId="start_date_cuti"
            focusedInput={focusedInput}
            onFocusChange={setFocusedInput}
            endDateId="end_date_cuti"
            displayFormat="YYYY-MM-DD"
            isOutsideRange={() => false}
            />
        </div>

        {/* Reset */}
        <button className={`${_CLASSNAME_} flex flex-row items-center gap-1`} onClick={resetFilters}>
            <RiResetRightLine className='h-4 w-4' />
            Reset
        </button>
        </div>
    )
}