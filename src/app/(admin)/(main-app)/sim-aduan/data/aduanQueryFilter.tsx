'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { RiResetRightLine } from "react-icons/ri";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";  // Import the CSS for react-dates

interface FilterState {
    status?: string
    klasifikasi?: string
    priority?: string
    startDate?: string
    endDate?: string
}

interface Props {
    onFilterChange: (filters: FilterState) => void
}

export default function AduanQueryFilter({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<FilterState>({})
    const [isInitialized, setIsInitialized] = useState(false) // prevent double set
    const [focusedInput, setFocusedInput] = useState<any>(null) // for date range picker

    const _CLASSNAME_ = "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

    // Read query params on first mount
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search)

            const initialFilters: FilterState = {
                status: params.get("status")?.toUpperCase() || "",
                klasifikasi: params.get("klasifikasi")?.toUpperCase() || "",
                priority: params.get("priority")?.toUpperCase() || "",
                startDate: params.get("startDate") || "",  // Add startDate and endDate
                endDate: params.get("endDate") || "",
            }

            setFilters(initialFilters)
            onFilterChange(initialFilters)
            setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target
        const updatedFilters = {
            ...filters,
            [name]: value,
        }
        setFilters(updatedFilters)
        console.table(updatedFilters)
        onFilterChange(updatedFilters)
    }


    const handleDateChange = ({ startDate, endDate }: any) => {
        const updatedFilters = {
            ...filters,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
            endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        }
        setFilters(updatedFilters);
        onFilterChange(updatedFilters)
    };

    const resetFilters = () => {
        const reset = { status: '', klasifikasi: '', priority: '', startDate: '', endDate: '' }
        setFilters(reset)
        onFilterChange(reset)
    }

    return (
        <>
            {/* Status */}
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
            <div className="relative mb-2">
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
                    <option value="HIGHT">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Date Range Picker */}
            <div className={"relative "+ _CLASSNAME_}>
                <DateRangePicker
                startDate={filters.startDate ? moment(filters.startDate) : null}
                endDate={filters.endDate ? moment(filters.endDate) : null}
                onDatesChange={handleDateChange}
                startDateId="start_date"
                focusedInput={focusedInput}
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                endDateId="end_date"
                displayFormat="YYYY-MM-DD"
                isOutsideRange={() => false}
                />
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
