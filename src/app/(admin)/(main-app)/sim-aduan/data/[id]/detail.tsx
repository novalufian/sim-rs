    import { FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaTag } from 'react-icons/fa'
    import { MdOutlineAttachFile, MdHistory } from 'react-icons/md'
    import { AiOutlineUser } from 'react-icons/ai'
    import { BsFillPinMapFill } from 'react-icons/bs'

    type History = {
    status: string
    note: string
    created_at: string
    updated_by: string
    updated_by_nama: string
    }

    type AduanDetailProps = {
    id: string
    klasifikasi: string
    media: string
    judul: string
    uraian: string
    tanggal_pelaporan: string
    nik: string
    email: string
    file_aduan?: string
    skrining_masalah: string
    priority: string
    status: string
    tanggal_tindak_lanjut?: string
    tindak_lanjut?: string
    history_aduan?: History[]
    }

    export default function AduanDetail({ data }: { data: AduanDetailProps }) {
    return (
        <div className="w-full mx-auto bg-white rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Detail Aduan</h1>
            <span className="text-base text-gray-400">ID #{data?.id.slice(0, 8)}</span>
        </div>

        {/* Personal Detail */}
        <section className="space-y-2">
            <h2 className="text-base font-medium text-gray-500 flex items-center gap-1">
            <AiOutlineUser /> Pelapor
            </h2>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div>
                <p className="text-base font-semibold">{data?.email}</p>
                <p className="text-base text-gray-500">NIK: {data?.nik}</p>
            </div>
            <div className="flex space-x-3 text-gray-400">
                <FaEnvelope size={16} />
                <FaPhoneAlt size={16} />
            </div>
            </div>
        </section>

        {/* Aduan Info */}
        <section className="space-y-2">
            <h2 className="text-base font-medium text-gray-500 flex items-center gap-1">
            <FaTag /> Informasi Aduan
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-lg font-semibold">{data?.judul}</p>
            <p className="text-base text-gray-600">{data?.uraian}</p>

            <div className="flex flex-wrap gap-2 text-base mt-2">
                <Tag label={data?.klasifikasi} color="blue" />
                <Tag label={data?.media} color="green" />
                <Tag label={data?.priority} color="yellow" />
                <Tag label={data?.status} color="red" />
            </div>

            {data?.tindak_lanjut && (
                <div className="text-base mt-3 text-gray-500 flex gap-2 items-center">
                <BsFillPinMapFill /> <span>Tindak Lanjut: {data?.tindak_lanjut}</span>
                </div>
            )}
            </div>
        </section>

        

        {/* Optional File Preview */}
        {data?.file_aduan && (
            <section>
            <h2 className="text-base font-medium text-gray-500 flex items-center gap-1">
                <MdOutlineAttachFile /> Lampiran
            </h2>
            <a
                href={data?.file_aduan}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-base"
            >
                Lihat File Aduan
            </a>
            </section>
        )}

        {/* Tanggal */}
        <section className="flex items-center gap-2 text-base text-gray-500">
            <FaCalendarAlt /> Tanggal Pelaporan: {data?.tanggal_pelaporan}
        </section>
        </div>
    )
    }

    function Tag({ label, color }: { label: string; color: string }) {
    const colorMap: any = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        gray: 'bg-gray-100 text-gray-600',
    }
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[color] || colorMap.gray}`}>
        {label}
        </span>
    )
    }
