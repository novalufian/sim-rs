"use client"

import SpinerLoading from '@/components/loading/spiner'
import React, { useState } from 'react'

function LaporanBidangChart() {
    const [isLoading, setIsLoading] = useState(true)


    if(isLoading) {
        return(
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title='Laporan per Bidang'/>
            </div>
        )
    }
    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
            <h1>Pie chart jumlah laporan disetiap bidang</h1>
            <h1>stack chart jumlah laporan disetiap bidang</h1>
            <p>Diagram lingkaran distribusi jenis laporan (Pengaduan, Aspirasi, Permintaan Informasi)</p>
            <p>Visualisasi status laporan (Submitted, Verified, In Progress, Resolved)</p>
            <p>jadi ada 3 bar chart , tiap bar ada stack chart untuk point 2</p>
            Pending vs In Progress vs Done → Good for operational visibility on how many are completed.
        </div>
    )
}

export default LaporanBidangChart