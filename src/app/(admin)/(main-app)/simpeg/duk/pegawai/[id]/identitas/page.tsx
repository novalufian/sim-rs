"use client";
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';

type FormValues = {
  no_hp?: string | null;
  email?: string | null;
  no_kk?: string | null;
  npwp?: string | null;
  bpjs?: string | null;
  nama_bank_gaji?: string | null;
  no_rekening?: string | null;
};

export default function KontakDokumenPage() {
  const params = useParams();
  const id = params?.id as string;
  const idParam = id;


  const { data, isLoading } = useGetPegawaiById(idParam);
  const updatePegawai = useUpdatePegawai();

  const defaults: FormValues = useMemo(() => {
    const d = data?.data;
    return {
      no_hp: d?.no_hp.unmasked ?? '',
      email: d?.email ?? '',
      no_kk: d?.no_kk?.unmasked ?? '',
      npwp: (d as any)?.npwp ?? '',
      bpjs: (d as any)?.bpjs ?? '',
      nama_bank_gaji: (d as any)?.nama_bank_gaji ?? '',
      no_rekening: d?.no_rekening.unmasked ?? '',
    };
  }, [data]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: defaults, values: defaults });

  const onSubmit = async (values: FormValues) => {
    await updatePegawai.mutateAsync({ id: idParam, formData: values });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. HP</label>
          <input type="tel" className={inputClass} disabled={isLoading} {...register('no_hp')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input type="email" className={inputClass} disabled={isLoading} {...register('email', { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Format email tidak valid' } })} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. KK</label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('no_kk')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NPWP</label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('npwp')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">BPJS</label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('bpjs')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Bank Gaji</label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('nama_bank_gaji')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. Rekening</label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('no_rekening')} />
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>Simpan</button>
        </div>
      </form>
    </div>
  );
}

