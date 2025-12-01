'use client'
import moment from 'moment';
import 'react-dates/initialize';
import { useEffect, useState } from 'react'
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { PermohonanKawinFilters } from "@/hooks/fetch/kawin/useKawinPermohonan";

interface Props {
    onFilterChange: (filters: PermohonanKawinFilters) => void
    currentFilters?: PermohonanKawinFilters
}

const _CLASSNAME_ =
    "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer";

export default function KawinDateFilter({ onFilterChange, currentFilters }: Props) {
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

                .dark .DateRangePicker_picker {
                    border: solid 1px rgb(55 65 81);
                    background: rgba(17, 24, 39, 0.8);
                }

                .DateInput {
                    background: transparent;
                }

                .CalendarDay {
                    color: inherit;
                }

                .CalendarDay__default {
                    color: inherit;
                }

                .CalendarDay__selected_span {
                    background: #3b82f6;
                    color: white;
                }

                .dark .CalendarDay__selected_span {
                    background: #2563eb;
                }

                .CalendarDay__selected {
                    background: #1e40af;
                    color: white;
                }

                .dark .CalendarDay__selected {
                    background: #1d4ed8;
                }

                .CalendarDay__hovered_span {
                    background: #60a5fa;
                    color: white;
                }

                .dark .CalendarDay__hovered_span {
                    background: #3b82f6;
                }

                .DayPicker_weekHeader {
                    color: inherit;
                }

                .DayPicker_weekHeader_li {
                    color: inherit;
                }

                .DayPickerNavigation_button {
                    color: inherit;
                }

                .DayPickerNavigation_button__default {
                    color: inherit;
                }

                .DayPicker__withBorder {
                    box-shadow: none;
                }
            `}</style>
            <div className={"relative z-[99] " + _CLASSNAME_}>
                <DateRangePicker
                    startDate={startDate ? moment(startDate) : null}
                    endDate={endDate ? moment(endDate) : null}
                    onDatesChange={handleDateChange}
                    startDateId="start_date_kawin"
                    focusedInput={focusedInput}
                    onFocusChange={setFocusedInput}
                    endDateId="end_date_kawin"
                    displayFormat="YYYY-MM-DD"
                    isOutsideRange={() => false}
                />
            </div>
        </>
    )
}

