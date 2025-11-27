'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { PermohonanPensiunFilters } from "@/hooks/fetch/pensiun/usePensiunPermohonan"; 

interface Props {
    onFilterChange: (filters: PermohonanPensiunFilters) => void
    currentFilters?: PermohonanPensiunFilters
}

const _CLASSNAME_ =
    "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

export default function PensiunDateFilter({ onFilterChange, currentFilters }: Props) {
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [focusedInput, setFocusedInput] = useState<any>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search)
            const initialStartDate = params.get("startDate") || ""
            const initialEndDate = params.get("endDate") || ""
            
            setStartDate(initialStartDate)
            setEndDate(initialEndDate)
            
            if (initialStartDate || initialEndDate) {
                onFilterChange({
                    startDate: initialStartDate || undefined,
                    endDate: initialEndDate || undefined,
                });
            }
            setIsInitialized(true)
        }
    }, [isInitialized, onFilterChange])

    useEffect(() => {
        if (currentFilters) {
            setStartDate(currentFilters.startDate || '')
            setEndDate(currentFilters.endDate || '')
        }
    }, [currentFilters])

    const handleDateChange = ({ startDate, endDate }: any) => {
        const newStartDate = startDate ? startDate.format('YYYY-MM-DD') : '';
        const newEndDate = endDate ? endDate.format('YYYY-MM-DD') : '';
        
        setStartDate(newStartDate)
        setEndDate(newEndDate)
        
        onFilterChange({
            startDate: newStartDate || undefined,
            endDate: newEndDate || undefined,
        });
    };

    return (
        <div className={"relative " + _CLASSNAME_}>
            <DateRangePicker
                startDate={startDate ? moment(startDate) : null}
                endDate={endDate ? moment(endDate) : null}
                onDatesChange={handleDateChange}
                startDateId="start_date_pensiun"
                focusedInput={focusedInput}
                onFocusChange={setFocusedInput}
                endDateId="end_date_pensiun"
                displayFormat="YYYY-MM-DD"
                isOutsideRange={() => false}
            />
        </div>
    )
}

