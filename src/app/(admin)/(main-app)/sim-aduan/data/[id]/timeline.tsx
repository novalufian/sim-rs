"use client"
import UpdateProgressModal from "@/components/modals/aduan/updateProgress"
import { useState } from "react"
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

import { IoIosTimer } from "react-icons/io";
import { FaRegDotCircle } from "react-icons/fa";
import { AiOutlineUser , AiOutlineStop} from "react-icons/ai";
import { IoCalendarNumberOutline } from "react-icons/io5";

type HistoryAduanItem = {
    status: string
    note: string
    created_at: string
    updated_by: string
    updated_by_nama: string
}
type StatusType = "OPEN" | "ON_PROGRESS" | "CLOSE";

interface Item {
    status?: StatusType;
}

const STATUS: { [key in StatusType]: any } = {
    OPEN: {
        label : "open",
        color : "text-green-500",
        border : "border-green-300",
        bg : "bg-green-100",
        icon : <FaRegDotCircle className="w-6 h-6"/>
    },
    ON_PROGRESS: {
        label : "on progress",
        color : "text-yellow-500",
        border : "border-yellow-300",
        bg : "bg-yellow-50",
        icon : <IoIosTimer className="w-6 h-6"/>
    },
    CLOSE: {
        label : "closed",
        color : "text-red-500",
        border : "border-red-300",
        bg : "bg-red-100",
        icon : <AiOutlineStop className="w-6 h-6"/>
    },
};

function formatDate(date: string) {
    return formatDistanceToNow(new Date(date), { locale: id, addSuffix: true });
}

export default function Timeline({ data }: { data: HistoryAduanItem[] }) {
    
    const _CLASSNAME_ = "appearance-none text-gray-500 transition-colors border border-gray-200 rounded-lg hover:text-dark-900 h-11 w-auto hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white px-4 cursor-pointer flex justify-center items-center gap-1";

    const [openModal, setOpenModal] = useState(false)
    return (
    <>
        <ul className=" relative">
        {data?.map((item, index) => (
            <li key={index} className={`relative  ${index >= data.length - 1 ? "border-l-0" : "border-l"} ${STATUS[item?.status as keyof typeof STATUS].border} box-border pb-1 `}>
                <div className={`absolute left-0 top-0 -translate-x-1/2  w-10 h-10 rounded-full flex border items-center justify-center ${STATUS[item?.status as keyof typeof STATUS].color}  ${STATUS[item?.status as keyof typeof STATUS].bg} ${STATUS[item?.status as keyof typeof STATUS].border}`}>
                    {STATUS[item?.status as keyof typeof STATUS].icon}
                </div>

                <div className="ml-10  p-5 box-border border border-gray-200 rounded-lg bg-white dark:bg-white/[0.03] dark:border-gray-700">
                    <p className="mt-1 mb-3 flex items-center"> <IoCalendarNumberOutline className="mr-2"/> {formatDate(item.created_at )} </p>

                    <p className="text-base italic text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-2 pb-4 rounded-lg my-1">{item.note}</p>
                    <p className={`font-medium  lowercase p-1 rounded-lg text-center ${STATUS[item?.status as keyof typeof STATUS].color}  ${STATUS[item?.status as keyof typeof STATUS].bg}`}>{STATUS[item?.status as keyof typeof STATUS].label}</p>

                    <p className="font-medium mt-3 flex items-start text-green-600"><AiOutlineUser className="mr-2 mt-2"/> <span>{item.updated_by_nama} <br /> {item.created_at}</span></p>
                </div>
            </li>
        ))}
        </ul>

        <div className="flex justify-center mt-10">
        <button onClick={()=>{setOpenModal(true)}} className={`${_CLASSNAME_} w-auto bg-blue-500 text-white`}>
            tanggapi aduan
        </button>
        </div>

        <UpdateProgressModal  isOpen={openModal} onClose={()=>{setOpenModal(false)}}/>
    </>
    )
}
