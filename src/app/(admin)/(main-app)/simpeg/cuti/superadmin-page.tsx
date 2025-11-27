"use client";

import React from 'react';
import { StatistikFilters } from '@/hooks/fetch/cuti/useCutiState';
import { DistribusiSisaCutiChart, TrendTahunanCutiChart } from './state/jatahChart';
import { DistribusiStatusCutiChart, DistribusiJenisCutiChart, TrendPermohonanCutiChart, TopPegawaiCutiChart, RataRataLamaCutiCard, TotalPermohonanCard } from './state/permohonanChart';
import DetailApproverStackedBarChart from './state/detailArpporvalChart';

interface SuperAdminPageProps {
    filters: StatistikFilters;
}

export default function SuperAdminPage({ filters }: SuperAdminPageProps) {
    return (
        <>
            {/* Seksi konten chart/statistik */}
            <div className="col-span-12 grid grid-cols-12 gap-2 mb-10">
                {/* <AllStatistikCutiDashboard filters={filters} /> */}
                {/* Alternatif/eksperimen */}
                
                <div className="col-span-4">
                    <DistribusiSisaCutiChart filters={filters} />
                </div>
                <div className="col-span-8">
                    <TrendTahunanCutiChart filters={filters} />
                </div>
                {/* <AllStatistikCutiDashboardCopy filters={filters as any} /> */}
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-4 flex flex-col gap-2">
                    <RataRataLamaCutiCard filters={filters} />
                    <TotalPermohonanCard filters={filters} />
                </div>

                <div className="col-span-4">
                    <TrendPermohonanCutiChart filters={filters} />
                </div>

                <div className="col-span-4 row-span-2">
                    <TopPegawaiCutiChart filters={filters} />
                </div>

                <div className="col-span-4">
                    <DistribusiJenisCutiChart filters={filters} />
                </div>
            
                <div className="col-span-4">
                    <DistribusiStatusCutiChart filters={filters} />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 mt-10 gap-2">
                <div className="col-span-8">
                    <DetailApproverStackedBarChart filters={filters} />
                </div>
            </div>
        </>
    );
}

