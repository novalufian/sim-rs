"use client"
import UpdateProgressModal from "@/components/modals/aduan/updateProgress"
import { useState } from "react"

type HistoryAduanItem = {
    status: string
    note: string
    created_at: string
    updated_by: string
    updated_by_nama: string
}

export default function Timeline({ data }: { data: HistoryAduanItem[] }) {
    const [openModal, setOpenModal] = useState(false)
    return (
    <>
        <ul className="space-y-6 relative border-l-2 border-blue-500">
        {data?.map((item, index) => (
            <li key={index} className="ml-4 relative">
            <div className="absolute -left-[30px] top-1.5 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow">
                {index + 1}
            </div>
            <div className="pl-2">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{item.status}</p>
                <p className="text-base italic text-gray-600 dark:text-gray-400">{item.note}</p>
                <p className="text-xs text-gray-400 mt-1">
                {item.created_at} <br /> oleh <span className="font-semibold">{item.updated_by_nama}</span>
                </p>
            </div>
            </li>
        ))}
        </ul>

        <div className="flex justify-center mt-10">
        <button onClick={()=>{setOpenModal(true)}} className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            tanggapi aduan
        </button>
        </div>

        <UpdateProgressModal  isOpen={openModal} onClose={()=>{setOpenModal(false)}}/>
    </>
    )
}
