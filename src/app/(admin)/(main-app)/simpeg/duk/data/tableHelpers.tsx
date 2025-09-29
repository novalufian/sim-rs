import { Employee } from "@/app/(admin)/(main-app)/simpeg/duk/data/employee";

// --- badge helpers ---
const renderStatusPekerjaanBadge = (status: string) => {
    const baseClasses ="px-2 py-1 rounded-full text-xs font-medium inline-block";

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

const renderAgamaBadge = (agama: string) => {
    const baseClasses =
    "px-2 py-1 rounded-full text-xs font-medium inline-block";

    switch (agama.toLowerCase()) {
    case "islam":
        return (
        <span className={`${baseClasses} bg-green-500 text-white`}>
            {agama}
        </span>
        );
    case "kristen":
    case "kristen protestan":
        return (
        <span className={`${baseClasses} bg-blue-600 text-white`}>
            {agama}
        </span>
        );
    case "katolik":
        return (
        <span className={`${baseClasses} bg-red-500 text-white`}>
            {agama}
        </span>
        );
    case "hindu":
        return (
        <span className={`${baseClasses} bg-orange-500 text-white`}>
            {agama}
        </span>
        );
    case "buddha":
        return (
        <span className={`${baseClasses} bg-yellow-500 text-gray-900`}>
            {agama}
        </span>
        );
    case "konghucu":
        return (
        <span className={`${baseClasses} bg-purple-500 text-white`}>
            {agama}
        </span>
        );
    default:
        return (
        <span className={`${baseClasses} bg-gray-300 text-gray-800`}>
            {agama || "Tidak Diketahui"}
        </span>
        );
    }
};
  

const renderJenisKelaminBadge = (gender: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium inline-block";

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

// --- date formatter ---
const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "";
    try {
        return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        }).format(new Date(dateStr));
    } catch {
        return dateStr; // fallback kalau invalid
    }
};

// --- main renderer ---
export const getColumnValue = (
    employee: Employee,
    columnId: string
): React.ReactNode => {
switch (columnId) {
    case "nama":
    return employee.nama || "";
    case "nip":
    return (
        <span className="text-gray-500 dark:text-gray-300">
        {employee.nip}
        </span>
    );
    case "tempat_lahir":
    return employee.tempat_lahir || "";
    case "tanggal_lahir":
    return formatDate(employee.tanggal_lahir);
    case "umur":
    return employee.umur || "";
    case "jenis_kelamin":
    return renderJenisKelaminBadge(employee.jenis_kelamin || "");
    case "agama":
    return renderAgamaBadge(employee.agama || "") ;
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

    // tambahan dari API
    case "pengangkatan_tmt":
    return formatDate(employee.pengangkatan_tmt);
    case "pengangkatan_nomor_sk":
    return employee.pengangkatan_nomor_sk || "";
    case "pengangkatan_masakerja":
    return employee.pengangkatan_masakerja || "";
    case "pangkat_tmt":
    return employee.pangkat_tmt || "";
    case "jabatan":
    return employee.jabatan || "";
    case "jabatan_tmt":
    return employee.jabatan_tmt || "";

    // pendidikan
    case "pendidikan_jurusan":
    return employee.pendidikan_jurusan || "";
    case "pendidikan_jenjang":
        return employee.pendidikan_jenjang || "";
    
    case "pendidikan_institusi":
    return employee.pendidikan_institusi || "";
    case "pendidikan_tahun_selesai":
    return employee.pendidikan_tahun_selesai || "";
    case "pendidikan_gelar":
    return employee.pendidikan_gelar || "";

    default:
    return "";
}
};
