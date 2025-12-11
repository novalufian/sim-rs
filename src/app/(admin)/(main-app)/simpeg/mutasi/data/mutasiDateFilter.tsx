'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { useRouter, usePathname } from "next/navigation";
import { PermohonanMutasiFilters } from "@/hooks/fetch/mutasi/useMutasiPermohonan"; 

interface Props {
    onFilterChange: (filters: PermohonanMutasiFilters) => void
    currentFilters?: PermohonanMutasiFilters
}

const _CLASSNAME_ =
    "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

export default function MutasiDateFilter({ onFilterChange, currentFilters }: Props) {
    const router = useRouter();
    const pathname = usePathname();
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

        // Update URL
        const params = new URLSearchParams(window.location.search);
        if (newStartDate) {
            params.set('startDate', newStartDate);
        } else {
            params.delete('startDate');
        }
        if (newEndDate) {
            params.set('endDate', newEndDate);
        } else {
            params.delete('endDate');
        }
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
    };

    return (
        <div className={"relative z-[99] " + _CLASSNAME_}>
            <DateRangePicker
                startDate={startDate ? moment(startDate) : null}
                endDate={endDate ? moment(endDate) : null}
                onDatesChange={handleDateChange}
                startDateId="start_date_mutasi"
                focusedInput={focusedInput}
                onFocusChange={setFocusedInput}
                endDateId="end_date_mutasi"
                displayFormat="YYYY-MM-DD"
                isOutsideRange={() => false}
            />
        </div>
    )
}

