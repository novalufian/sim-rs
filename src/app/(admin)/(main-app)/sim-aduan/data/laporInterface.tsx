import { PiLockKeyFill,PiClockCountdownBold } from "react-icons/pi";
import { AiFillAlert, AiOutlineQuestion } from "react-icons/ai";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { TiLockOpenOutline } from "react-icons/ti";

export interface Lapor {
    id: string;
    judul: string;
    uraian: string;
    media: string;
    klasifikasi: string;
    tanggal_pelaporan: string;
    priority: string;
    status: string;
    masked_email: string;
    tindak_lanjut_nama : string;
    created_at: string;
}

export interface Column {
    id: string;
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

export interface DropdownState {
    [key: number]: boolean;
} 

export const statusConfig = {
    OPEN: {
        label: "Open", 
        icon: <TiLockOpenOutline className="w-4 h-4 " />,
        color: "text-emerald-700",
        bgColor: "bg-emerald-700/[0.3] ",
    },
    ON_PROGRESS: {
        label: "In Progress",
        icon: <PiClockCountdownBold className="w-4 h-4 " />,
        color: "text-amber-500",
        bgColor: "bg-amber-700/[0.3]",
    },
    CLOSE: {
        label: "Closed",
        icon: <PiLockKeyFill className="w-4 h-4 " />,
        color: "text-slate-700 ",
        bgColor: "bg-slate-600/[0.1]",
    }
};

export const klasifikasiConfig = {
    PENGADUAN: {
        label: "Aduan",
        icon: <AiFillAlert className="w-4 h-4" />,
        color: "text-indigo-700",
        bgColor: "bg-transparent dark:bg-white/[0.5]",
        borderColor: "border-red-200"
    },
    ASPIRASI: {
        label: "Aspirasi",
        icon: <MdOutlineTipsAndUpdates className="w-4 h-4" />,
        color: "text-fuchsia-700",
        bgColor: "dark:bg-white/[0.5]",
        borderColor: "border-yellow-200"
    },
    PERMINTAAN_INFORMASI: {
        label: "Permintaan Informasi",
        icon: <AiOutlineQuestion className="w-4 h-4 text-purple-600 font-bold" />,
        color: "text-purple-600",
        bgColor: "bg-transparent dark:bg-white/[0.5]",
        borderColor: "border-purple-200"
    }
};

export const priorityConfig = {
    HIGHT: {
        label: "Hight",
        icon: "",
        color: "text-red-700",
        bgColor: "bg-red-600/[0.2]",
        borderColor: "border-red-200"
    },
    MEDIUM: {
        label: "Medium",
        icon: "",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/[0.2]",
        borderColor: "border-yellow-200"
    },
    LOW: {
        label: "Low",
        icon: "",
        color: "text-sky-600",
        bgColor: "bg-sky-600/[0.2]",
        borderColor: "border-purple-200"
    }
};