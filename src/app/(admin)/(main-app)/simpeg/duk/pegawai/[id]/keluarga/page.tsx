
"use client";
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';

type FormValues = {
  status_perkawinan?: string | null;
  nama_pasangan?: string | null;
  nama_anak?: string | null;
  no_kk?: string | null;
};

export default function KeluargaPage() {
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;
  const { data, isLoading } = useGetPegawaiById(idParam);
  const updatePegawai = useUpdatePegawai();

  const defaults: FormValues = useMemo(() => {
    const d = data?.data;
    return {
      status_perkawinan: d?.status_perkawinan ?? '',
      nama_pasangan: d?.nama_pasangan ?? '',
      nama_anak: d?.nama_anak ?? '',
      no_kk: d?.no_kk?.unmasked ?? '',
    };
  }, [data]);

  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: defaults, values: defaults });

  const onSubmit = async (values: FormValues) => {
    await updatePegawai.mutateAsync({ id: idParam, formData: values });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
      <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className=" gap-6">
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No Kartu Keluarga</label>
            <input type="text" className={inputClass} disabled={isLoading} {...register('no_kk')} />
          </div>
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Perkawinan</label>
            <select className={inputClass} disabled={isLoading} {...register('status_perkawinan')}>
              <option value="">Pilih</option>
              <option value="Belum Kawin">Belum Kawin</option>
              <option value="Kawin">Kawin</option>
              <option value="Cerai Hidup">Cerai Hidup</option>
              <option value="Cerai Mati">Cerai Mati</option>
            </select>
          </div>
          
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Pasangan</label>
            <input type="text" className={inputClass} disabled={isLoading} {...register('nama_pasangan')} />
          </div>
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Anak</label>
            <textarea rows={3} className={inputClass} disabled={isLoading} {...register('nama_anak')} placeholder="Pisahkan dengan koma jika lebih dari satu" />
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>Simpan</button>
          </div>
        </form>
      </div>
  );
}