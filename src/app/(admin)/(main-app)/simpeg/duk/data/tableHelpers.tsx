import { Employee } from "@/app/(admin)/(main-app)/simpeg/duk/data/employee";

export const getColumnValue = (employee: Employee, columnId: string): string => {
    const columnMapping: { [key: string]: keyof Employee } = {
        nama: "NAMA",
        nip: "NIP/NIPPPK",
        pangkat: "PANGKAT",
        gol: "GOL",
        tmt: "TMT",
        jabatan: "JABATAN",
        no_sk: "NO. SK PANGKAT AKHIR",
        tmt_jabatan: "TMTJAB",
        eselon: "ESELON",
        masa_kerja: "TH MSKRJ",
        pendidikan: "PENDIDIKAN",
        tahun_lulus: "TAHUN LULUS",
        gelar: "GELAR",
        tingkat: "TINGKAT",
        tempat_lahir: "TMPT LHR",
        tanggal_lahir: "TGLLHR",
        umur: "UMUR",
        jenis_kelamin: "JENIS KELAMIN",
        agama: "AGAMA"
    };
    
    const key = columnMapping[columnId];
    return key ? employee[key] : "";
}; 