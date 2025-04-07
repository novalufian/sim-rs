"use client"

import SpinerLoading from '@/components/loading/spiner'
import React, { useState } from 'react'

function DistribusiLaporanChart() {
    const [isLoading, setIsLoading] = useState(true)


    if(isLoading) {
        return(
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title='Disitribusi laporan'/>
            </div>
        )
    }
    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
            <h1>Distribusi Laporan </h1>
            {/* Count grouped by jenis: aduan, informasi, permintaan */}
        </div>
    )
}

export default DistribusiLaporanChart