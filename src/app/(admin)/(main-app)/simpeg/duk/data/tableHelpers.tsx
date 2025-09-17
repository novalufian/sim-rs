import { Employee } from "@/app/(admin)/(main-app)/simpeg/duk/data/employee";

const renderStatusPekerjaanBadge = (status: string) => {
    const baseClasses =
    "px-2 py-1 rounded-full text-xs font-medium inline-block";
    
    switch (status.toLowerCase()) {
        case "pns":
        return (
            <span className={`${baseClasses} bg-green-500 text-white`}>
            {status}
            </span>
        );
        case "kontrak":
        return (
            <span className={`${baseClasses} bg-orange-500 text-white`}>
            {status}
            </span>
        );
        case "honorer":
        return (
            <span className={`${baseClasses} bg-yellow-400 text-black`}>
            {status}
            </span>
        );
        default:
        return (
            <span className={`${baseClasses} bg-gray-300 text-gray-800`}>
            {status}
            </span>
        );
    }
};

const renderJenisKelaminBadge = (gender: string) => {
    const baseClasses =
    "px-2 py-1 rounded-full text-xs font-medium inline-block";
    
    switch (gender.toLowerCase()) {
        case "laki-laki":
        return (
            <span className={`${baseClasses} bg-blue-500 text-white`}>
            {gender}
            </span>
        );
        case "perempuan":
        return (
            <span className={`${baseClasses} bg-pink-500 text-white`}>
            {gender}
            </span>
        );
        default:
        return (
            <span className={`${baseClasses} bg-gray-300 text-gray-800`}>
            {gender}
            </span>
        );
    }
};

export const getColumnValue = (
    employee: Employee,
    columnId: string
): React.ReactNode => {
    switch (columnId) {
        case "nama":
        return employee.nama || "";
        case "nip":
        return <span className="text-gray-500 dark:text-gray-300">{employee.nip}</span>;
        case "tempat_lahir":
        return employee.tempat_lahir || "";
        case "tanggal_lahir":
        return employee.tanggal_lahir
        ? new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short", // otomatis jadi 3 huruf (Jan, Feb, Mar, dst.)
            year: "numeric",
        }).format(new Date(employee.tanggal_lahir))
        : "";
        
        case "umur":
        return employee.umur ? employee.umur.toString() : "";
        case "jenis_kelamin":
        return renderJenisKelaminBadge(employee.jenis_kelamin || "");
        case "agama":
        return employee.agama || "";
        case "status_perkawinan":
        return employee.status_perkawinan || "";
        case "status_pekerjaan":
        return renderStatusPekerjaanBadge(employee.status_pekerjaan || "");
        case "alamat_ktp":
        return employee.alamat_ktp || "";
        case "alamat_domisili":
        return employee.alamat_domisili || "";
        case "no_kk":
        return employee.no_kk?.masked || "";
        case "no_rekening":
        return employee.no_rekening?.masked || "";
        case "no_hp":
        return employee.no_hp?.masked || "";
        case "email":
        return employee.email || "";
        case "tmt_pangkat":
        return employee.tmt_pangkat || "";
        case "tmt_jabatan":
        return employee.tmt_jabatan || "";
        default:
        return "";
    }
};
