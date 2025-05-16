"use client"
import getGreeting from '@/utils/greatingMsg'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsArrowUpRightCircle } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
import {TotalAduanChart, TotalAduanStat} from './(stats)/totalAduan'
import LaporanBidangChart from './(stats)/laporanBIdangChart'
import { RootState } from '@/libs/store'
import WordCloudChart from './(stats)/skiriningMasalah'
import { FaRegCalendarCheck } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";


// import DateRangePicker from '@/components/datePicker/dateRangePicker'
import { DateRangePicker } from "react-dates";
import moment from 'moment';
import 'react-dates/initialize';
import "react-dates/lib/css/_datepicker.css";  // Import the CSS for react-dates


import { useAppSelector } from "@/hooks/useAppDispatch";
import { filter } from 'd3'
interface FilterState {
    startDate?: string
    endDate?: string
}

const _CLASSNAME_ = "appearance-none flex flex-row text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer  items-center";


function page() {
    const [userRole, setUserRole] = useState<string | undefined>(undefined)
    const user = useAppSelector((state: RootState) => state.auth.user);
    const [filters, setFilters] = useState<FilterState>({})
    const [focusedInput, setFocusedInput] = useState<any>(null)
    const onFilterChange = (newFilters: {
        startDate?: string;
        endDate?: string;
    }) => {
        setFilters(newFilters);
    };

    const handleDateChange = ({ startDate, endDate }: any) => {
        const updatedFilters = {
            ...filters,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
            endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
        }
        setFilters(updatedFilters);
        onFilterChange(updatedFilters)
    };

    const handleResetFilterDate = () => {
        setFilters({
            startDate: '',
            endDate: '',
        })
        setFocusedInput(null)
        // onFilterChange(filters)
    }


    useEffect(()=>{
        setUserRole(user?.role)
    },[user])

    return (
        <div className="grid grid-cols-12 gap-2 md:gap-3">
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
            <div className="col-span-12">
            </div>
            <div className="col-span-6 min-h-40 flex justify-center flex-col mb-10 items-start">
                <h2 className='text-4xl font-extralight tracking-tight text-gray-600 dark:text-gray-300 mb-2'> 👋 Hi, {getGreeting()}</h2>
                <h2 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-red-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent'>{user?.name.toLocaleLowerCase()}</h2>
                {/* <DateRangePicker/> */}
                <div className='flex gap-1 mt-10'>
                    <div className={"relative cursor-pinter "+ _CLASSNAME_}>
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
                        <FaRegCalendarCheck className='w-6 h-6 ml-4 text-gray-300'/>
                    </div>

                    <button className={_CLASSNAME_} onClick={handleResetFilterDate}>
                        <GrPowerReset className='w-6 h-6'/>
                    </button>
                </div>
            </div>

            <div className="col-span-3">
                {!userRole ||userRole != "user" &&
                <Link href="sim-aduan/lapor" className='group'>
                <div className="group-hover:dark:bg-amber-300 text-red-600 rounded-2xl border border-gray-200 bg-red-100/50 hover:bg-red-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Lapor <br /> Aduan Baru</h1>
                    <IoIosAddCircleOutline className='w-18 h-18 group-hover:scale-140 transition-all group-hover:rotate-90 '/>
                </div>
                </Link>
                }
            </div>

            <div className="col-span-3">
                <Link href="sim-aduan/data" className='group'>
                <div className="group-hover:dark:bg-amber-300 text-gray-600 rounded-2xl border border-gray-200 bg-gray-100/50 hover:bg-gray-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Kelola <br /> Data Aduan</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>


            <div className="col-span-3 min-h-100">
                <TotalAduanChart group='status' title='Status Laporan' colors={['#7AE2CF', '#077A7D',  '#06202B',]} filters={filters}/>
            </div>

            <div className="col-span-3 min-h-100">
                <TotalAduanChart group='klasifikasi' title='Kasifikasi Laporan' colors={['#A0C878', '#143D60',  '#EB5B00',]} filters={filters}/>
            </div>

            <div className="col-span-3 min-h-100">
                <TotalAduanChart group='priority' title='Priority Laporan' colors={['#f59e0b', '#ef4444', '#3b82f6']} filters={filters}/>
            </div>
            <div className="col-span-3 min-h-100">
                <TotalAduanStat title={`Aduan Masuk`} filters={filters}/>
            </div>

            {/* <div className="col-span-12 max-h-70">
                <TrendAduanChart/>
            </div> */}

            <div className="col-span-7 min-h-100">
                <LaporanBidangChart filters={filters}/>
            </div>

            <div className="col-span-5 min-h-100">
                <WordCloudChart filters={filters}/>
            </div>


        </div>


    )
}

    export default page
