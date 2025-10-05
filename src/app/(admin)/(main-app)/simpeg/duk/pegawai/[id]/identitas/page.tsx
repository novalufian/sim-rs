"use client";
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const FormValuesSchema = z.object({
  no_hp: z.string().min(1, "No. HP wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  no_kk: z.string().min(1, "No. KK wajib diisi"),
  npwp: z.string().min(15, "NPWP kurang dari 15 angka").max(15,"NPWP tidak boleh lebih dari 15 angka"),
  bpjs: z.string().min(1, "BPJS wajib diisi"),
  nama_bank_gaji: z.string().min(1, "Nama Bank Gaji wajib diisi"),
  no_rekening: z.string().min(1, "No. Rekening wajib diisi"),
});

type FormValues = z.infer<typeof FormValuesSchema>;

export default function KontakDokumenPage() {
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id ;  
  const idParam = id as string;


  const { data, isLoading  : isLoadingPegawai} = useGetPegawaiById(idParam);
  const updatePegawai = useUpdatePegawai();

  const isLoading = isLoadingPegawai  || updatePegawai.isPending;

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ 
    resolver: zodResolver(FormValuesSchema),
    defaultValues: defaults, 
    values: defaults });

  const onSubmit = async (values: FormValues) => {
    console.log(values)
    await updatePegawai.mutateAsync({ id: idParam, formData: values });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`w-8/12 p-6 m-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6 ${isLoading ? 'opacity-50' : ''}`}>
      {isLoading && <div className='absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed'></div>}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">No. HP <p className="text-red-500 text-sm mt-1">{errors.no_hp && errors.no_hp.message ? `${errors.no_hp.message}` : ""}</p></label>  
          <input type="tel" className={inputClass + " " + (errors.no_hp ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('no_hp')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Email <p className="text-red-500 text-sm mt-1">{errors.email && errors.email.message ? `${errors.email.message}` : ""}</p></label>
          <input type="email" className={inputClass + " " + (errors.email ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('email', { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Format email tidak valid' } })} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">No. KK <p className="text-red-500 text-sm mt-1">{errors.no_kk && errors.no_kk.message ? `${errors.no_kk.message}` : ""}</p></label>
          <input type="text" className={inputClass + " " + (errors.no_kk ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('no_kk')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">NPWP <p className="text-red-500 text-sm mt-1">{errors.npwp && errors.npwp.message ? `${errors.npwp.message}` : ""}</p></label>
          <input type="text" className={inputClass + " " + (errors.npwp ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('npwp')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">BPJS <p className="text-red-500 text-sm mt-1">{errors.bpjs && errors.bpjs.message ? `${errors.bpjs.message}` : ""}</p></label>
          <input type="text" className={inputClass + " " + (errors.bpjs ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('bpjs')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Nama Bank Gaji <p className="text-red-500 text-sm mt-1">{errors.nama_bank_gaji && errors.nama_bank_gaji.message ? `${errors.nama_bank_gaji.message}` : ""}</p></label>
          <input type="text" className={inputClass + " " + (errors.nama_bank_gaji ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('nama_bank_gaji')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">No. Rekening <p className="text-red-500 text-sm mt-1">{errors.no_rekening && errors.no_rekening.message ? `${errors.no_rekening.message}` : ""}</p></label>
          <input type="text" className={inputClass + " " + (errors.no_rekening ? 'border-red-500 dark:border-red-500 bg-red-200' : "")} disabled={isLoading} {...register('no_rekening')} />
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>Simpan</button>
        </div>
      </form>
    </div>
  );
}

