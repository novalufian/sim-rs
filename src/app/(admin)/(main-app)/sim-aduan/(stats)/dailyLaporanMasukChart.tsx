"use client"

import SpinerLoading from '@/components/loading/spiner'
import React, { useState } from 'react'

function DailyLaporanChart() {
    const [isLoading, setIsLoading] = useState(true)


    if(isLoading) {
        return(
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title='Daily laporan masuk'/>
            </div>
        )
    }
    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
            <h1>Distribusi Laporan </h1>
            {/* 
            2. Trend Laporan Harian/Mingguan (Line Chart)
            X-axis: Date (daily/weekly)
            Y-axis: Count of new reports → Shows trend over time, helpful for spotting spikes or drops in activity.
            */}
        </div>
    )
}

export default DailyLaporanChart