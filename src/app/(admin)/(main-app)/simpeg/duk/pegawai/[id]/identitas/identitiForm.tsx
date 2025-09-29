//     "use client";
//     import React, { Suspense, useMemo } from 'react';
//     import { useForm } from 'react-hook-form';
//     import { useSearchParams } from 'next/navigation';
//     import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';

//     type FormValues = {
//     no_urut?: number | string;
//     nama: string;
//     nip: string;
//     tempat_lahir?: string | null;
//     tanggal_lahir?: string | null;
//     jenis_kelamin?: string | null;
//     agama?: string | null;
//     nik?: string | null;
//     avatar_url?: string | null;
//     };

//     const normalizeDateString = (raw?: string | null): string => {
//     if (!raw) return '';
//     const trimmed = String(raw).trim();
//     if (!trimmed) return '';
//     const isoLike = /^\d{4}-\d{2}-\d{2}$/;
//     if (isoLike.test(trimmed)) return trimmed;
//     const d = new Date(trimmed);
//     if (!isNaN(d.getTime())) {
//         const y = d.getFullYear();
//         const m = String(d.getMonth() + 1).padStart(2, '0');
//         const day = String(d.getDate()).padStart(2, '0');
//         return `${y}-${m}-${day}`;
//     }
//     const m1 = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
//     if (m1) {
//         const dd = Number(m1[1]);
//         const mm = Number(m1[2]);
//         const yy = Number(m1[3]);
//         if (yy >= 1000 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
//         return `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
//         }
//     }
//     const m2 = trimmed.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
//     if (m2) {
//         const yy = Number(m2[1]);
//         const mm = Number(m2[2]);
//         const dd = Number(m2[3]);
//         if (yy >= 1000 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
//         return `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
//         }
//     }
//     return '';
//     };

// export default function IdentitasForm() {
//     const searchParams = useSearchParams();
//     const idParam = searchParams.get('id') || '';
//     const { data, isLoading } = useGetPegawaiById(idParam);
//     const updatePegawai = useUpdatePegawai();

//     const defaults: FormValues = useMemo(() => {
//         const d = data?.data;
//         return {
//         no_urut: d?.no_urut ?? '',
//         nama: d?.nama ?? '',
//         nip: d?.nip ?? '',
//         tempat_lahir: d?.tempat_lahir ?? '',
//         tanggal_lahir: normalizeDateString((d?.tanggal_lahir as any) ?? ''),
//         jenis_kelamin: d?.jenis_kelamin ?? '',
//         agama: d?.agama ?? '',
//         nik: d?.nik ?? '',
//         avatar_url: (d as any)?.avatar_url ?? '',
//         };
//     }, [data]);

//     const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: defaults, values: defaults });

//     const onSubmit = async (values: FormValues) => {
//         await updatePegawai.mutateAsync({ id: idParam, formData: values });
//     };

//     const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

//     return (
//         <div className="w-full mx-auto p-6">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Step 1 — Data Pribadi</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No Urut</label>
//             <input type="number" className={inputClass} disabled={isLoading} {...register('no_urut')} />
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama</label>
//             <input type="text" className={inputClass} disabled={isLoading} {...register('nama', { required: 'Wajib diisi' })} />
//             {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>}
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIP</label>
//             <input type="text" className={inputClass} disabled={isLoading} {...register('nip', { required: 'Wajib diisi' })} />
//             {errors.nip && <p className="text-red-500 text-sm mt-1">{errors.nip.message}</p>}
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tempat Lahir</label>
//             <input type="text" className={inputClass} disabled={isLoading} {...register('tempat_lahir')} />
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal Lahir</label>
//             <input type="date" className={inputClass} disabled={isLoading} {...register('tanggal_lahir')} />
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Kelamin</label>
//             <select className={inputClass} disabled={isLoading} {...register('jenis_kelamin')}>
//                 <option value="">Pilih</option>
//                 <option value="Laki-laki">Laki-laki</option>
//                 <option value="Perempuan">Perempuan</option>
//             </select>
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agama</label>
//             <select className={inputClass} disabled={isLoading} {...register('agama')}>
//                 <option value="">Pilih</option>
//                 <option value="Islam">Islam</option>
//                 <option value="Kristen">Kristen</option>
//                 <option value="Katolik">Katolik</option>
//                 <option value="Hindu">Hindu</option>
//                 <option value="Buddha">Buddha</option>
//                 <option value="Konghucu">Konghucu</option>
//             </select>
//             </div>
//             <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIK</label>
//             <input type="text" className={inputClass} disabled={isLoading} {...register('nik')} />
//             </div>
//             <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar URL</label>
//             <input type="text" className={inputClass} disabled={isLoading} {...register('avatar_url')} placeholder="https://..." />
//             </div>
//             <div className="md:col-span-2 flex gap-3 justify-end">
//             <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>Simpan</button>
//             </div>
//         </form>
//         </div>
//     );
// }

export default function IdentitasForm() {
    return (
        <div className="w-full mx-auto p-6"></div>
    );
}