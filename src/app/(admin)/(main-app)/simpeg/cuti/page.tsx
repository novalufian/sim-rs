"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StatistikFilters } from '@/hooks/fetch/cuti/useCutiState';
import moment from 'moment';
import 'react-dates/initialize';
import "react-dates/lib/css/_datepicker.css";
import { DistribusiSisaCutiChart, TrendTahunanCutiChart } from './state/jatahChart';
import { useAppSelector } from "@/hooks/useAppDispatch";
import GreetingHeader from '@/components/common/GreetingHeader';
import type { RootState } from '@/libs/store';
import { FaRegCalendarCheck } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsArrowUpRightCircle } from "react-icons/bs";
import Link from "next/link";
import SuperAdminPage from './superadmin-page';
import UserPage from './user-page';

// Dynamic import untuk DateRangePicker agar tidak ada masalah dengan SSR
const DateRangePicker = dynamic(
    () => import('react-dates').then((mod) => mod.DateRangePicker),
    { 
        ssr: false,
        loading: () => <div className="h-11 w-64 bg-gray-100 rounded-full animate-pulse" />
    }
);

export default function Page() {
    const [filters, setFilters] = useState<StatistikFilters>({});
    const [focusedInput, setFocusedInput] = useState<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);
    const user = useAppSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        setUserRole(user?.role);
    }, [user]);

    const _CLASSNAME_ =
        "appearance-none flex flex-row text-gray-500 transition-colors bg-white rounded-full hover:text-dark-900 h-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-3 cursor-pointer items-center";

    // Initialize filters from URL params
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const params = new URLSearchParams(window.location.search);
            
            const initialFilters: StatistikFilters = {
                startDate: params.get("startDate") || undefined,
                endDate: params.get("endDate") || undefined,
                id_pegawai: params.get("id_pegawai") || undefined,
                role: params.get("role") || undefined,
            };

            setFilters(initialFilters);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleDateChange = ({ startDate, endDate }: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
        const updatedFilters: StatistikFilters = {
            ...filters,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
            endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
        };
        setFilters(updatedFilters);
    };

    const handleResetFilterDate = () => {
        setFilters({});
        setFocusedInput(null);
        if (typeof window !== "undefined") {
            window.history.pushState({}, '', window.location.pathname);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-[2px] md:gap-2">
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

            <div className="col-span-6 min-h-40 flex justify-between flex-col items-start">
                <GreetingHeader 
                    userName={user?.nama}
                    structuralName={user?.struktural_nama}
                />
                <div className='flex gap-[2px]'>
                    <div className={"relative cursor-pinter text-gray-500 "+ _CLASSNAME_}>
                        <DateRangePicker
                            startDate={filters.startDate ? moment(filters.startDate) : null}
                            endDate={filters.endDate ? moment(filters.endDate) : null}
                            onDatesChange={handleDateChange as any}
                            startDateId="start_date_statistik"
                            focusedInput={focusedInput}
                            onFocusChange={setFocusedInput}
                            endDateId="end_date_statistik"
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

            {userRole && userRole === "user" && (
                <div className="col-span-3">
                </div>
            )}

            <div className="col-span-3">
                <Link href="/simpeg/cuti/permohonan" className='group'>
                    <div className="group-hover:dark:bg-amber-300 text-red-600 rounded-4xl bg-red-100/50 hover:bg-red-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center">
                        <h1 className='text-2xl leading-tight font-semibold tracking-tight'>Ajukan <br /> Cuti Baru</h1>
                        <IoIosAddCircleOutline className='w-18 h-18 group-hover:scale-140 transition-all group-hover:rotate-90'/>
                    </div>
                </Link>
            </div>

            
                {userRole && userRole === "super_admin" && (
                    <div className="col-span-3">
                    <Link href="/simpeg/cuti/data" className='group'>
                        <div className="group-hover:dark:bg-amber-300 text-gray-600 rounded-4xl bg-white hover:bg-gray-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center">
                            <h1 className='text-2xl leading-tight font-semibold tracking-tight'>Kelola <br /> Data Cuti</h1>
                            <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45'/>
                        </div>
                    </Link>
                    </div>
                )}

            <div className="col-span-12 h-20 flex justify-center items-center">
                <hr className='w-6/8 border-t border-white/[0.03]'/>
            </div>


            {userRole && userRole === "super_admin" && <SuperAdminPage filters={filters} />}
            {userRole && userRole === "user" && <UserPage />}
        </div>
    );
}