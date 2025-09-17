"use client";
import React from 'react'
import { useKenaikanGaji } from '@/hooks/fetch/gaji/useKenaikanGaji'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function KenaikanGajiChart({ id_pegawai }: { id_pegawai: string }) {
    const { data, isLoading, error } = useKenaikanGaji({ id_pegawai, status: 'SELESAI'})

    if (isLoading) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex justify-center items-center'>Loading...</div>
    if (error) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex justify-center items-center text-red-500'>Error loading KGB</div>
    if (!data?.data?.items?.length) return <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] min-h-[350px] flex justify-center items-center'>No data</div>

    const items = data.data.items
    // Sort by tanggal_pengajuan ascending to ensure line order
    const sorted = [...items].sort((a, b) => new Date(a.tanggal_pengajuan).getTime() - new Date(b.tanggal_pengajuan).getTime())

    const labels = sorted.map(it => new Date(it.tanggal_pengajuan).toLocaleDateString())
    const lama = sorted.map(it => it.gaji_pokok_lama)
    const baru = sorted.map(it => it.gaji_pokok_baru)

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Gaji Pokok Lama',
                data: lama,
                borderColor: 'rgba(99, 102, 241, 1)', // indigo
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                tension: 0.3,
                fill: false,
                pointRadius: 3,
            },
            {
                label: 'Gaji Pokok Baru',
                data: baru,
                borderColor: 'rgba(16, 185, 129, 1)', // emerald
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                tension: 0.3,
                fill: false,
                pointRadius: 3,
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' as const },
            tooltip: {
                callbacks: {
                    label: function(ctx: any) {
                        const val = ctx.raw as number
                        return `${ctx.dataset.label}: ${val.toLocaleString('id-ID')}`
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value: any) {
                        return Number(value).toLocaleString('id-ID')
                    }
                }
            }
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 min-h-[350px]">
            <h3 className="text-3xl font-bold dark:text-white mb-2">Kenaikan Gaji Berkala</h3>
            <div className="h-[260px]">
                <Line data={chartData as any} options={chartOptions as any} />
            </div>
        </div>
    )
}


