"use client"

import LoadDataLoading from '@/components/loading/loadData';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { statusConfig } from '../laporInterface';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import { useAduanId } from '@/hooks/fetch/useAduan';
import Timeline from './timeline';
import AduanDetail from './detail';
import { LuTimerReset } from "react-icons/lu";

export default function Page() {
    const params = useParams();
    const id = params?.id as string;
    const [lapor, setLapor] = useState<any>(null);
    const [currentStatus, setCurrentStatus] = useState<any>("OPEN");
    const { data, isLoading, error } = useAduanId(id);
    const _CLASSNAME_ = "appearance-none text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer flex justify-center items-center gap-1";

    useEffect(() => {
        if (data) {
        setLapor(data.data);
        setCurrentStatus(statusConfig[data.data.status as keyof typeof statusConfig]);
        }
    }, [data]);

    if (isLoading) {
        return (
        <div className="rounded-2xl min-h-[450px] flex justify-center items-center flex-col">
            <LoadDataLoading />
        </div>
        );
    }

    if (error) {
        return (
        <div className="rounded-2xl min-h-[450px] flex justify-center items-center flex-col">
            <p className="text-xl dark:text-white/30 transition-all flex">{error.message}</p>
        </div>
        );
    }

    if (!data.success) {
        return (
        <div className="rounded-2xl min-h-[450px] flex justify-center items-center flex-col">
            <p className="text-xl dark:text-white/30 transition-all flex">Data tidak ditemukan</p>
        </div>
        );
    }

    return (
        <div className="rounded-2xl min-h-[450px]">
        <PathBreadcrumb defaultTitle="item" />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
            <div className="space-y-3 col-span-7 w-full mx-auto bg-white dark:bg-white/[0.03] rounded-3xl p-6 dark:text-white">
                {/* <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center overflow-hidden rounded-xl gap-2">
                        <div className={_CLASSNAME_}>
                            <span className="text-red-600">{lapor?.klasifikasi}</span>
                        </div>
                        <div className={_CLASSNAME_}>
                            <span className=" text-red-600">{lapor?.priority}</span>
                        </div>
                        <div className={`${_CLASSNAME_} ${currentStatus.bgColor}`}>
                            {currentStatus.icon}
                            <span className={`font-bold ${currentStatus.color}`}>{currentStatus.label}</span>
                        </div>
                        
                    </div>
                </div> */}

                <AduanDetail data={lapor} />
            </div>

            <div className=" dark:bg-white/[0.03] bg-white rounded-3xl p-6 pl-10 border border-gray-100 col-span-3 dark:border-gray-800">
                <h2 className="text-xl font-medium mb-4 dark:text-white flex items-center"><LuTimerReset className='mr-2'/> Riwayat Laporan</h2>
                <div className="space-y-1 text-gray-800 text-sm dark:text-white/70">
                    <Timeline data={lapor?.history_aduan}/>
                    
                </div>
            </div>

        </div>
    </div>
    );
}