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
    nama: string
    email: string
    no_hp: string
    alamat: string
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
        <div className="w-full mx-auto bg-white dark:bg-white/[0.03] rounded-2xl p-6 space-y-6 dark:text-white">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800  dark:text-white">Detail Aduan</h1>
            <span className="text-base text-gray-400">ID #{data?.id.slice(0, 8)}</span>
        </div>

        

        {/* Aduan Info */}
        <section className="space-y-2">
            <div className=" dark:bg-white/[0.03] rounded-lg p-4 space-y-2">
            <p className="text-4xl font-semibold tracking-tight mb-5">{data?.judul}</p>
            <div className="grid grid-cols-4 gap-2 text-base mt-2 mb-2">
                <Tag label={data?.klasifikasi} color="blue" />
                <Tag label={data?.media} color="green" />
                <Tag label={data?.priority} color="yellow" />
                <Tag label={data?.status} color="red" />
            </div>
            <p className='text-gray-200 ml-2 mt-8'>deskripsi :</p>
            <p className="text-base text-gray-700 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{data?.uraian}</p>

            {data?.tindak_lanjut && (
                <div className="text-base mt-10 text-gray-800 flex gap-2 items-start">
                <BsFillPinMapFill className='text-red-600'/> <span><p>Tindak Lanjut</p> <p className="text-gray-500">{data?.tindak_lanjut}</p></span>
                </div>
            )}
            </div>
        </section>

        {/* Personal Detail */}
        <section className="space-y-2 p-5">
            <h2 className="text-base font-medium text-gray-600 dark:text-white flex items-center gap-1">
            <AiOutlineUser /> Pelapor
            </h2>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                    <p className="text-base w-30 flex justify-between mr-3">Nama <span>:</span></p>
                    <p className="text-base">{data?.nama}</p>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                    <p className="text-base w-30 flex justify-between mr-3">NIK <span>:</span></p>
                    <p className="text-base">{data?.nik}</p>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                    <p className="text-base w-30 flex justify-between mr-3">No. HP <span>:</span></p>
                    <p className="text-base">{data?.no_hp} 
                    <span className='flex text-gray-400 items-center'><FaPhoneAlt size={16} className='mr-2'/> send wa</span></p>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                    <p className="text-base w-30 flex justify-between mr-3">Email<span>:</span></p>
                    <p className="text-base">{data?.email} <span className='flex text-gray-400 items-center'><FaEnvelope size={16} className='mr-2'/> send email</span></p>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                    <p className="text-base w-30 flex justify-between mr-3">Alamat<span>:</span></p>
                    <p className="text-base">{data?.alamat}</p>
                </div>

                <div className="flex space-x-3 text-gray-400 col-span-2 p-5">
                    
                    
                </div>
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

    function Tag({ label, color, className }: { label: string; color: string, className? : string }) {
    const colorMap: any = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        gray: 'bg-gray-100 text-gray-600',
    }
    return (
        <span className={`px-3 py-2 rounded-lg text-base text-center font-medium lowercase ${colorMap[color] || colorMap.gray} ${className}`}>
        {label}
        </span>
    )
    }
