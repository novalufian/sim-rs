"use client"

import LoadDataLoading from '@/components/loading/loadData';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { statusConfig } from '../laporInterface';
import PathBreadcrumb from '@/components/common/PathBreadcrumb';
import { useAduanId } from '@/hooks/fetch/useAduan';
import Timeline from './timeline';
import AduanDetail from './detail';

export default function Page() {
    const params = useParams();
    const id = params?.id as string;
    const [lapor, setLapor] = useState<any>(null);
    const [currentStatus, setCurrentStatus] = useState<any>("OPEN");
    const { data, isLoading, error } = useAduanId(id);

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
        <PathBreadcrumb defaultTitle="" />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="space-y-3 col-span-7">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center overflow-hidden rounded-xl">
                        <div className="flex items-center space-x-1 px-4 py-2 bg-red-100">
                            <span className="font-bold text-red-600">{lapor?.klasifikasi}</span>
                        </div>
                        <div className="flex items-center space-x-1 px-4 py-2 bg-red-100">
                            <span className="font-bold text-red-600">{lapor?.priority}</span>
                        </div>
                        <div className={`flex items-center space-x-2 px-4 py-2 ${currentStatus.bgColor}`}>
                            {currentStatus.icon}
                            <span className={`font-bold ${currentStatus.color}`}>{currentStatus.label}</span>
                        </div>
                        
                    </div>
                   
                </div>

                <AduanDetail data={lapor} />
            </div>

            <div className=" dark:bg-white/[0.03] rounded-xl p-6 border border-gray-100 col-span-3 dark:border-gray-800">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Riwayat Laporan</h2>
                <div className="space-y-2 text-gray-800 text-sm dark:text-white/70">
                    <Timeline data={lapor?.history_aduan}/>
                    
                </div>
            </div>

        </div>
    </div>
    );
}