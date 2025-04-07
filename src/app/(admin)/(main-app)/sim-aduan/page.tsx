import getGreeting from '@/utils/greatingMsg'
import Link from 'next/link'
import React from 'react'
import { BsArrowUpRightCircle } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
import ResponseTimeChart from './(stats)/responseTimeChart'
import TotalAduanChart from './(stats)/totalAduan'
import LaporanBidangChart from './(stats)/laporanBIdangChart'
import DistribusiLaporanChart from './(stats)/distribusiLaporanChart'
import DailyLaporanChart from './(stats)/dailyLaporanMasukChart'

function page() {
    return (
        <div className="grid grid-cols-12 gap-2 md:gap-3">
            <div className="col-span-6 min-h-40 flex justify-center flex-col">
                <h2 className='text-4xl font-extralight tracking-tight text-gray-600 dark:text-gray-300 mb-2'> 👋 Hi, {getGreeting()}</h2>
                <h2 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-red-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent'>Dedi Arpandi</h2>
            </div>

            <div className="col-span-3">
                <Link href="sim-aduan/lapor" className='group'>
                <div className="group-hover:dark:bg-amber-300 text-red-600 rounded-2xl border border-gray-200 bg-red-100/50 hover:bg-red-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Lapor <br /> Aduan Baru</h1>
                    <IoIosAddCircleOutline className='w-18 h-18 group-hover:scale-140 transition-all group-hover:rotate-90 '/>
                </div>
                </Link>
            </div>

            <div className="col-span-3">
                <Link href="sim-aduan/data" className='group'>
                <div className="group-hover:dark:bg-amber-300 text-gray-600 rounded-2xl border border-gray-200 bg-gray-100/50 hover:bg-gray-600 hover:text-white p-5 transition-all dark:border-gray-800 dark:bg-white/[0.03]  sm:p-6 min-h-40 dark:text-amber-300 group-hover:dark:text-gray-800 flex justify-between items-center ">
                    <h1 className='text-2xl leading-tight font-semibold   tracking-tight '>Kelola <br /> Data Aduan</h1>
                    <BsArrowUpRightCircle className='w-15 h-15 group-hover:scale-140 transition-all group-hover:rotate-45 '/>
                </div>
                </Link>
            </div>

            <div className="col-span-5 min-h-100">
                <ResponseTimeChart />
            </div>
            <div className="col-span-3 min-h-100">
                <TotalAduanChart />
            </div>
            <div className="col-span-4 min-h-100">
                <DistribusiLaporanChart />
            </div>

            <div className="col-span-6 min-h-100">
                <LaporanBidangChart />
            </div>

            <div className="col-span-6">
                <DailyLaporanChart />
            </div>
        </div>

        
    )
}

    export default page