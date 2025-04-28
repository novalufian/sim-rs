import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import flatpickr from 'flatpickr';
import { setDateRange, resetDateRange } from '@/features/dateFilter/dateRangeSlice';
import { RootState } from '@/libs/store';
import 'flatpickr/dist/flatpickr.min.css';

import { PiCalendarDuotone } from "react-icons/pi";
import { RiResetLeftFill } from "react-icons/ri";



const DateRangePicker: React.FC = () => {
    const dispatch = useDispatch();
    const { startDate, endDate } = useSelector((state: RootState) => state.dateRange);
    const dateRangeInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (dateRangeInputRef.current) {
            const fp = flatpickr(dateRangeInputRef.current, {
                mode: 'range',
                dateFormat: 'Y-m-d',
                defaultDate: startDate && endDate ? [startDate, endDate] : undefined,
                onChange: (selectedDates: Date[]) => {
                    if (selectedDates.length === 2) {
                        const [start, end] = selectedDates;
                        dispatch(
                            setDateRange({
                                startDate: start.toISOString().split('T')[0],
                                endDate: end.toISOString().split('T')[0],
                            })
                        );
                    }
                },
                onClose: (selectedDates: Date[]) => {
                    if (selectedDates.length === 1) {
                        // If only one date is selected, set both start and end to the same date
                        const date = selectedDates[0];
                        dispatch(
                            setDateRange({
                                startDate: date.toISOString().split('T')[0],
                                endDate: date.toISOString().split('T')[0],
                            })
                        );
                    }
                }
            });

            return () => {
                if (fp) {
                    fp.destroy();
                }
            };
        }
    }, [dispatch]);

    const handleReset = () => {
        dispatch(resetDateRange());
        if (dateRangeInputRef.current) {
            const fp = flatpickr(dateRangeInputRef.current);
            fp.clear();
        }
    };

    return (
        <div className="mt-15">
            <div className="flex items-center gap-1 ">
                <div className="flex flex-row items-center justify-between px-3 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input
                        id="dateRange"
                        type="text"
                        placeholder="Select a date range"
                        ref={dateRangeInputRef}
                        readOnly
                        onChange={(e)=>{console.log(e.target.value)}}/>
                    <PiCalendarDuotone className='text-gray-500 w-7 h-7'/>
                </div>
                <button
                onClick={handleReset}
                className="p-2 text-sm font-medium text-gray-400 border border-gray-300 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <RiResetLeftFill className=' w-7 h-7'/>
                </button>
            </div>
            
        </div>
    );
};

export default DateRangePicker;