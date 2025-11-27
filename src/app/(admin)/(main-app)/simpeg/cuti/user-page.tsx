"use client";

import React, { useState } from 'react'
import MyApprovalCuti from './persetujuan/my-approval'
import MyCuti from './permohonan/my-cuti'
import { FiFileText, FiCheckCircle } from 'react-icons/fi'

type TabType = 'permohonan' | 'persetujuan';

function UserPage() {
    const [activeTab, setActiveTab] = useState<TabType>('persetujuan');

    const activeLinkClass = "text-base font-medium text-white dark:text-gray-300 dark:bg-blue-900 bg-blue-600 w-full p-3 px-4 rounded-md transition-colors duration-300 flex items-center gap-3";
    const inactiveLinkClass = "text-base font-medium text-gray-700 dark:text-gray-300 w-full p-3 px-4 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors duration-300 flex items-center gap-3";

    return (
        <div className='flex gap-2 flex-col md:flex-row col-span-12'>
            {/* Sidebar Menu - 20% width */}
            <div className="w-full md:w-[20%] pt-6 sticky top-0 z-10 h-fit">
                <div className="flex flex-col justify-start gap-2 items-start mb-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2 w-full">Menu</h1>
                    
                    <button
                        onClick={() => setActiveTab('persetujuan')}
                        className={activeTab === 'persetujuan' ? activeLinkClass : inactiveLinkClass}
                    >
                        <FiCheckCircle className="h-5 w-5" />
                        <span>Persetujuan</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('permohonan')}
                        className={activeTab === 'permohonan' ? activeLinkClass : inactiveLinkClass}
                    >
                        <FiFileText className="h-5 w-5" />
                        <span>Permohonan</span>
                    </button>
                </div>
            </div>

            {/* Content Area - 80% width */}
            <div className="w-full md:w-[80%] flex-1">
                {activeTab === 'permohonan' && <MyCuti />}
                {activeTab === 'persetujuan' && <MyApprovalCuti />}
            </div>
        </div>
    )
}

export default UserPage