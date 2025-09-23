"use client";
import React, { useState } from 'react'
import PegawaiForm from '@/components/form/PegawaiForm';

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
        <PegawaiForm 
            data={pegawaiData} 
            onSubmit={(data) => {
                setPegawaiData(data);
                setEditing(false);
                console.log(data);
            }}
            onCancel={() => setEditing(false)}
        />
    );
}

export default PegawaiPage;