"use client";
import React, { useState, useEffect } from 'react'
import PegawaiForm from '@/components/form/PegawaiForm';
import { useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';


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
    const user = useAppSelector((state) => state.auth.user);


    const params = useParams();
    const id = (params?.id === "data-saya") ? user?.id_pegawai as string : params?.id as string;
    const idParam = id;
    const [editing, setEditing] = useState(false);
    const [pegawaiData, setPegawaiData] = useState(defaultPegawaiData);

    const { data: fetchedPegawai, isLoading } = useGetPegawaiById(idParam);


    useEffect(() => {
        if (fetchedPegawai) {
            setPegawaiData(fetchedPegawai.data);
        }
    }, [fetchedPegawai]);


    return (
        <div>
            <PegawaiForm 
                isLoading={isLoading}
                data={pegawaiData} 
                onSubmit={(data) => {
                    setPegawaiData(data);
                    setEditing(false);
                    console.log(data);
                }}
                onCancel={() => setEditing(false)}
            />
        </div>
    );
}

export default PegawaiPage;