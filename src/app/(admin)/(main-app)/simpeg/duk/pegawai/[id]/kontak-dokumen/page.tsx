"use client";
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const kontakDokumenSchema = z.object({
  alamat_ktp: z.string().min(1, "Alamat KTP wajib diisi"),
  alamat_domisili: z.string().min(1, "Alamat Domisili wajib diisi"),
  no_hp: z.string().min(1, "No HP wajib diisi"),
  email: z.string().min(1, "Email wajib diisi"),
  no_kk: z.string().min(1, "No Kartu Keluarga wajib diisi"),
  npwp: z.string().min(1, "NPWP wajib diisi"),
  bpjs: z.string().min(1, "BPJS wajib diisi"),
  nama_bank_gaji: z.string().min(1, "Nama Bank Gaji wajib diisi"),
  no_rekening: z.string().min(1, "No Rekening wajib diisi"),
});
type FormValues = z.infer<typeof kontakDokumenSchema>;

export default function KontakDokumenPage() {

  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;


  const { data, isLoading } = useGetPegawaiById(idParam);
  const updatePegawai = useUpdatePegawai();

  const defaults: FormValues = useMemo(() => {
    const d = data?.data;
    return {
      alamat_ktp: d?.alamat_ktp ?? '',
      alamat_domisili: d?.alamat_domisili ?? '',
      no_hp: d?.no_hp ?? '',
      email: d?.email ?? '',
      no_kk: d?.no_kk ?? '',
      npwp: (d as any)?.npwp ?? '',
      bpjs: (d as any)?.bpjs ?? '',
      nama_bank_gaji: (d as any)?.nama_bank_gaji ?? '',
      no_rekening: d?.no_rekening ?? '',
    };
  }, [data]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: defaults, values: defaults, resolver: zodResolver(kontakDokumenSchema) });

  const onSubmit = async (values: FormValues) => {
    await updatePegawai.mutateAsync({ id: idParam, formData: values });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat KTP <p className="text-red-500 text-sm mt-1">{errors.alamat_ktp && errors.alamat_ktp.message ? `${errors.alamat_ktp.message}` : ""}</p></label>
          <textarea rows={3} className={inputClass + " " + (errors.alamat_ktp ? 'border-red-500' : "")} disabled={isLoading} {...register('alamat_ktp')} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat Domisili <p className="text-red-500 text-sm mt-1">{errors.alamat_domisili && errors.alamat_domisili.message ? `${errors.alamat_domisili.message}` : ""}</p></label>
          <textarea rows={3} className={inputClass + " " + (errors.alamat_domisili ? 'border-red-500' : "")} disabled={isLoading} {...register('alamat_domisili')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. HP <p className="text-red-500 text-sm mt-1">{errors.no_hp && errors.no_hp.message ? `${errors.no_hp.message}` : ""}</p></label>
          <input type="tel" className={inputClass + " " + (errors.no_hp ? 'border-red-500' : "")} disabled={isLoading} {...register('no_hp')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email <p className="text-red-500 text-sm mt-1">{errors.email && errors.email.message ? `${errors.email.message}` : ""}</p></label>
          <input type="email" className={inputClass + " " + (errors.email ? 'border-red-500' : "")} disabled={isLoading} {...register('email', { pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Format email tidak valid' } })} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. KK <p className="text-red-500 text-sm mt-1">{errors.no_kk && errors.no_kk.message ? `${errors.no_kk.message}` : ""}</p></label>
          <input type="text" className={inputClass + " " + (errors.no_kk ? 'border-red-500' : "")} disabled={isLoading} {...register('no_kk')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NPWP <p className="text-red-500 text-sm mt-1">{errors.npwp && errors.npwp.message ? `${errors.npwp.message}` : ""}</p></label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('npwp')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">BPJS <p className="text-red-500 text-sm mt-1">{errors.bpjs && errors.bpjs.message ? `${errors.bpjs.message}` : ""}</p></label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('bpjs')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Bank Gaji <p className="text-red-500 text-sm mt-1">{errors.nama_bank_gaji && errors.nama_bank_gaji.message ? `${errors.nama_bank_gaji.message}` : ""}</p></label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('nama_bank_gaji')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. Rekening <p className="text-red-500 text-sm mt-1">{errors.no_rekening && errors.no_rekening.message ? `${errors.no_rekening.message}` : ""}</p></label>
          <input type="text" className={inputClass} disabled={isLoading} {...register('no_rekening')} />
        </div>
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>Simpan</button>
        </div>
      </form>
    </div>
  );
}

