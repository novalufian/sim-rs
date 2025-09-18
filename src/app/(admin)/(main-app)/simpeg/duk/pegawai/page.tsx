"use client";
import React, { useState } from 'react'
import PegawaiForm from '@/components/form/PegawaiForm';
import Link from 'next/link';

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
    no_kk: { masked: '', unmasked: '' },
    no_rekening: { masked: '', unmasked: '' },
    no_hp: { masked: '', unmasked: '' },
    email: 'email',
    tmt_pangkat: null,
    tmt_jabatan: null,
    avatar_url: '',
    is_deleted: false,
};

function PegawaiPage() {
    const [editing, setEditing] = useState(false);
    const [pegawaiData, setPegawaiData] = useState(defaultPegawaiData);

    return (
        <div className='grid grid-cols-12 gap-2'>
            <div className="col-span-2 pt-6">
            <div className="flex flex-col justify-start gap-1 items-start mb-4  p-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Menu Utama</h1>
                <Link href="/simpeg/duk/pegawai" className="text-base font-medium text-gray-700 dark:text-gray-300 bg-blue-900 w-full p-2 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors duration-300">Daftar Pegawai</Link>
                <Link href="/simpeg/duk/pegawai" className="text-base font-medium text-gray-700 dark:text-gray-300  w-full p-2 rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors duration-300">Authentikasi</Link>
            </div>
            </div>
            
            <div className="col-span-10">

                <PegawaiForm 
                    data={pegawaiData} 
                    onSubmit={(data) => {
                        setPegawaiData(data);
                        setEditing(false);
                        console.log(data);
                    }}
                    onCancel={() => setEditing(false)}
                />
            </div>
                
            
        </div>
    );
}

export default PegawaiPage;