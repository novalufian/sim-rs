"use client"

import SpinerLoading from '@/components/loading/spiner'
import React, { useState } from 'react'

function TotalAduanChart() {
    const [isLoading, setIsLoading] = useState(true)


    if(isLoading) {
        return(
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title='total aduan'/>
            </div>
        )
    }
    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
            <h1>Total Aduan</h1>
        </div>
    )
}

export default TotalAduanChart