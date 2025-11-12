"use client";
import React, { useState, useEffect } from 'react'
import PegawaiForm from '@/components/form/PegawaiForm';
import { useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';

// Asumsi tipe data defaultPegawaiData disesuaikan dengan Employee interface yang Anda miliki.
// Saya mempertahankan defaultPegawaiData seperti di kode Anda.
const defaultPegawaiData = {
    id: '1',
    id_pegawai: '1',
    nama: 'nama',
    nip: 'nip',
    tempat_lahir: 'tempat_lahir',
    tanggal_lahir: '2020-01-01T00:00:00.000Z',
    umur: null,
    jenis_kelamin: 'jenis_kelamin',
    agama: 'agama',
    status_perkawinan: 'status_perkawinan',
    status_pekerjaan: 'status_pekerjaan',
    alamat_ktp: 'alamat_ktp',
    alamat_domisili: 'alamat_domisili',
    no_hp: { masked: '', unmasked: '' },
    email: 'email',
    avatar_url: '',
    is_deleted: false,
};

function PegawaiPage() {
    const user = useAppSelector((state) => state?.auth?.user);


    const params = useParams();
    // Logika untuk menentukan ID pegawai
    const id = (params?.id === "data-saya") ? user?.id_pegawai as string : params?.id as string;
    const idParam = id;
    const [editing, setEditing] = useState(false);
    const [pegawaiData, setPegawaiData] = useState(defaultPegawaiData);

    const { data: fetchedPegawai, isLoading } = useGetPegawaiById(idParam);


    useEffect(() => {
        if (fetchedPegawai) {
            // Asumsi fetchedPegawai adalah { data: PegawaiType }
            setPegawaiData(fetchedPegawai.data);
        }
    }, [fetchedPegawai]);

    // ✅ LOGIKA BARU: Tampilkan pesan jika loading selesai dan data tidak ditemukan
    if (!isLoading && !fetchedPegawai) {
        return (
            <div className="flex justify-center items-center p-10 min-h-[50vh]">
                <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-xl">
                    <h2 className="text-2xl font-bold text-red-500 mb-2 dark:text-red-400">Data Tidak Ditemukan ⚠️</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Pegawai dengan ID **{idParam}** tidak ditemukan atau gagal dimuat.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PegawaiForm 
                isLoading={isLoading}
                data={pegawaiData} 
                
                onCancel={() => setEditing(false)}
            />
        </div>
    );
}

export default PegawaiPage;