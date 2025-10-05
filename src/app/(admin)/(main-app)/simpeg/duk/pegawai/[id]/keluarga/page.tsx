
"use client";
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import {z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const keluargaSchema = z.object({
  status_perkawinan: z.string().min(1, "Status perkawinan wajib diisi"),
  nama_pasangan: z.string().min(1, "Nama pasangan wajib diisi"),
  nama_anak: z.string().min(1, "Nama anak wajib diisi"),
  no_kk: z.string().min(1, "No kartu keluarga wajib diisi"),
}); 
type FormValues = z.infer<typeof keluargaSchema>;

export default function KeluargaPage() {
  const [ isError, setIsError ] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;
  const { data, isLoading : isLoadingGet } = useGetPegawaiById(idParam);
  const { mutate: updatePegawai, isPending : isLoadingUpdate,  isError : errorOnSubmit, error, isSuccess } = useUpdatePegawai()

  // local state for form
  const isLoading = isLoadingGet || isLoadingUpdate;

  //form henadle 
  if(errorOnSubmit){
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 5000);
  }

  // langsung infer dari schema
  const defaults: FormValues = useMemo(() => {
    const d = data?.data;
    return {
      status_perkawinan: d?.status_perkawinan ?? '',
      nama_pasangan: d?.nama_pasangan ?? '',
      nama_anak: d?.nama_anak ?? '',
      no_kk: d?.no_kk?.unmasked ?? '',
    };
  }, [data]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: defaults, values: defaults, resolver: zodResolver(keluargaSchema) });

  const onSubmit = async (values: FormValues) => {
    updatePegawai({ id: idParam, formData: values });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
      <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
        {isError && <span className='bg-red-200 border-red-500 w-full p-6 rounded-xl mb-4 text-center flex flex-row justify-between items-center'> 
          <p className="text-red-500 text-sm mt-1 ">Terjadi kesalahan pada server, silahkan coba beberapa saat lagi</p>
          <button className='bg-red-500 text-white rounded-lg p-2 px-4 hover:bg-red-600 transition-colors' onClick={() => setIsError(false)}>Tutup</button>
        </span>}

        <form onSubmit={handleSubmit(onSubmit)} className=" gap-6">
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No Kartu Keluarga <p className="text-red-500 text-sm mt-1">{errors.no_kk && errors.no_kk.message ? `${errors.no_kk.message}` : ""}</p></label>
            <input type="text" className={inputClass + " " + (errors.no_kk ? 'border-red-500' : "")} disabled={isLoading} {...register('no_kk')} />
          </div>
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Perkawinan <p className="text-red-500 text-sm mt-1">{errors.status_perkawinan && errors.status_perkawinan.message ? `${errors.status_perkawinan.message}` : ""}</p></label>
            <select className={inputClass + " " + (errors.status_perkawinan ? 'border-red-500' : "")} disabled={isLoading} {...register('status_perkawinan')}>
              <option value="">Pilih</option>
              <option value="Belum Kawin">Belum Kawin</option>
              <option value="Kawin">Kawin</option>
              <option value="Cerai Hidup">Cerai Hidup</option>
              <option value="Cerai Mati">Cerai Mati</option>
            </select>
          </div>
          
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Pasangan <p className="text-red-500 text-sm mt-1">{errors.nama_pasangan && errors.nama_pasangan.message ? `${errors.nama_pasangan.message}` : ""}</p></label>
            <input type="text" className={inputClass + " " + (errors.nama_pasangan ? 'border-red-500' : "")} disabled={isLoading} {...register('nama_pasangan')} />
          </div>
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Anak <p className="text-red-500 text-sm mt-1">{errors.nama_anak && errors.nama_anak.message ? `${errors.nama_anak.message}` : ""}</p></label>
            <textarea rows={3} className={inputClass + " " + (errors.nama_anak ? 'border-red-500' : "")} disabled={isLoading} {...register('nama_anak')} placeholder="Pisahkan dengan koma jika lebih dari satu" />
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>Simpan</button>
          </div>
        </form>
      </div>
  );
}