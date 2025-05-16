"use client"

import React, { useEffect } from 'react'
import { useAduanStatGroup, useAduanTotal } from '@/hooks/fetch/useAduanStat'
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { BsCloudSlash } from "react-icons/bs";
import SpinerLoading from '@/components/loading/spiner'
import { Doughnut } from 'react-chartjs-2'
import CountUp from 'react-countup';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type AduanStatItem = {
    status?: string
    klasifikasi?: string
    priority?: string
    count: number | bigint
}
interface FilterState {
    startDate?: string
    endDate?: string
}

export function TotalAduanChart({group, title, colors, filters}: {group: string, title: string, colors?: string[], filters: FilterState}) {
    // Add filters as dependency to trigger refetch when filters change
    const { data, isLoading, refetch, isError } = useAduanStatGroup(group, filters)

    // Refetch data when filters change
    useEffect(() => {
        refetch()
    }, [filters, refetch])

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title={title} />
            </div>
        )
    }

    if(!data){
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full flex flex-col justify-center items-center text-gray-400">
                <BsCloudSlash className='w-15 h-15'/>
                <p>server bermasalah</p>
            </div>
        )
    }

    const groupData = (data as any)?.data.totalAduanGroup ?? []

    const labels = groupData.map((item: AduanStatItem) =>
        item.status || item.klasifikasi || item.priority || 'Unknown'
    )

    const counts = groupData.map((item: AduanStatItem) =>
        typeof item.count === 'bigint' ? Number(item.count) : item.count
    )

    function generateChartColors(length: number): string[] {
        const baseColors = [
            '#3b82f6',
            '#f59e0b',
            '#ef4444',
            '#10b981',
            '#8b5cf6',
            '#6366f1',
        ]
        const colors: string[] = []
        for (let i = 0; i < length; i++) {
            colors.push(baseColors[i % baseColors.length])
        }
        return colors
    }

    const backgroundColors = generateChartColors(labels.length)

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Jumlah Aduan',
                data: counts,
                backgroundColor: colors || backgroundColors,
                borderWidth: 1,
                borderRadius: 10,
                spacing: 5,
            },
        ],
    }

    const options = {
        cutout: '70%',
        padding: 20,
        margin: 20,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 20,
                    padding: 10,
                    font: {
                        size: 12,
                    },
                    color: '#374151',
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
        },
    } as const;

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100">
            <h2 className="text-lg font-semibold text-center text-gray-500">Grafik</h2>
            <h2 className="text-2xl font-semibold mb-10 text-center">{title}</h2>
            <Doughnut data={chartData} options={options}/>
        </div>
    )
}

export function TotalAduanStat({title, filters}: {title: string, filters: FilterState}) {
    // Add filters as dependency to trigger refetch when filters change
    const { data, isLoading, refetch, isError } = useAduanTotal(filters)

    // Refetch data when filters change
    useEffect(() => {
        refetch()
    }, [filters, refetch])

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full">
                <SpinerLoading title='Status Aduan' />
            </div>
        )
    }

    if(isError && !data){
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 h-full flex flex-col justify-center items-center text-gray-400">
                <BsCloudSlash className='w-15 h-15'/>
                <p>server bermasalah</p>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] box-border p-5 min-h-100 h-full">
            <h2 className="text-lg font-semibold text-center text-gray-500">Total</h2>
            <h2 className="text-2xl font-semibold mb-10 text-center">{title}</h2>

            <div className="flex flex-col h-[200px] justify-center items-center">
                <p className='text-7xl font-semibold tracking-tight flex items-center text-green-600'>
                    <CountUp start={0} end={data.data.totalAduan} duration={1.5}/>
                    <MdKeyboardDoubleArrowUp className='w-10 h-10 text-green-400'/>
                </p>
                <p className='text-xl font-base text-gray-500 tracking-tight'>laporan</p>
            </div>
            <p className='w-9/12 text-center m-auto text-gray-500'>informasi data real time dan akurat</p>
        </div>
    )
}
