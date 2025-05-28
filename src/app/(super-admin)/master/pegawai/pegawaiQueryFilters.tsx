'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";  // Import the CSS for react-dates

interface PegawaiFilterState {
    nama?: string;
    nip?: string;
    jenis_kelamin?: string;
    agama?: string;
    status_perkawinan?: string;
    status_pekerjaan?: string;
    startDate?: string; // For filtering a date range, e.g., created_at or tanggal_lahir
    endDate?: string;   // For filtering a date range
}

interface PegawaiQueryFilterProps {
    onFilterChange: (filters: PegawaiFilterState) => void;
}

export default function PegawaiQueryFilter({ onFilterChange }: PegawaiQueryFilterProps) {
    const [filters, setFilters] = useState<PegawaiFilterState>({});
    const [isInitialized, setIsInitialized] = useState(false); // prevent double set
    const [focusedInput, setFocusedInput] = useState<any>(null); // for date range picker

    const _CLASSNAME_ = "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

    // Read query params on first mount
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search);

            const initialFilters: PegawaiFilterState = {
                nama: params.get("nama") || "",
                nip: params.get("nip") || "",
                jenis_kelamin: params.get("jenis_kelamin") || "",
                agama: params.get("agama") || "",
                status_perkawinan: params.get("status_perkawinan") || "",
                status_pekerjaan: params.get("status_pekerjaan") || "",
                startDate: params.get("startDate") || "",
                endDate: params.get("endDate") || "",
            };

            setFilters(initialFilters);
            onFilterChange(initialFilters);
            setIsInitialized(true);
        }
    }, [isInitialized, onFilterChange]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFilters = {
            ...filters,
            [name]: value,
        };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handleDateChange = ({ startDate, endDate }: { startDate: moment.Moment | null, endDate: moment.Moment | null }) => {
        const updatedFilters = {
            ...filters,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
            endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const resetFilters = () => {
        const reset: PegawaiFilterState = {
            nama: '',
            nip: '',
            jenis_kelamin: '',
            agama: '',
            status_perkawinan: '',
            status_pekerjaan: '',
            startDate: '',
            endDate: ''
        };
        setFilters(reset);
        onFilterChange(reset);
    };

    return (
        <>
            <style jsx global>{`
            .DateInput div {
                font-size: 16px !important;
            }

            .DateInput_input {
                font-size: 16px;
                font-weight: 400;
                color: inherit;
                padding: 9px;
                border: none;
                text-align: center;
                background: transparent !important;
            }

            .DateRangePickerInput {
                border: none;
                color: inherit;
                background: transparent;
            }

            .DateRangePicker {
                color: inherit;
            }

            .DateRangePicker_picker {
                border-radius: 20px;
                overflow: hidden;
                border: solid 1px lightgray;
                backdrop-filter: blur(10px);
                background: #ffffff80;
            }

            .DateInput {
                background: transparent;
            }
                `}
            </style>

            {/* Nama */}
            <div className="relative mb-2">
                <input
                    type="text"
                    name="nama"
                    placeholder="Nama"
                    className={`${_CLASSNAME_}`}
                    onChange={handleChange}
                    value={filters.nama || ''}
                />
            </div>

            {/* NIP */}
            <div className="relative mb-2">
                <input
                    type="text"
                    name="nip"
                    placeholder="NIP"
                    className={`${_CLASSNAME_}`}
                    onChange={handleChange}
                    value={filters.nip || ''}
                />
            </div>

            {/* Jenis Kelamin */}
            <div className="relative mb-2">
                <select
                    name="jenis_kelamin"
                    className={`${_CLASSNAME_} pr-10`}
                    onChange={handleChange}
                    value={filters.jenis_kelamin || ''}
                >
                    <option value="">Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
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