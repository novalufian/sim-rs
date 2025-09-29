"use client";
import React, { useMemo} from 'react';
import { useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';

type RiwayatPendidikan = {
  status_pendidikan: { nama: string };
  jurusan: string;
  institusi: string;
  tahun_mulai: number;
  tahun_selesai: number;
  no_ijazah: string;
  dokumen_ijazah: string;
  dokumen_transkrip: string;
  gelar: string | null;
};

type FormValues = {
  riwayat_pendidikan: RiwayatPendidikan[];
};

const statusPendidikanOptions = [
  'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3', 'Profesi', 'Spesialis'
];

export default function PendidikanPage() {
  const params = useParams();
  const id = params?.id as string;
  const idParam = id;
  

  const { data, isLoading } = useGetPegawaiById(idParam);
  const updatePegawai = useUpdatePegawai();

  const defaults: FormValues = useMemo(() => {
    const d = data?.data as any;
    return {
      riwayat_pendidikan: d?.riwayat_pendidikan || [],
    };
  }, [data]);

  const { register, handleSubmit, control, reset } = useForm<FormValues>({ 
    defaultValues: defaults,
    values: defaults 
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "riwayat_pendidikan"
  });

  // Update form when data changes
  React.useEffect(() => {
    reset(defaults);
  }, [data, reset, defaults]);

  const onSubmit = async (values: FormValues) => {
    await updatePegawai.mutateAsync({ id: idParam, formData: values });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full mx-auto p-6">
      
      {/* Riwayat Pendidikan Section */}
      <div className="">

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">Pendidikan {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  disabled={isLoading}
                >
                  Hapus
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Pendidikan</label>
                  <select className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.status_pendidikan.nama`)}>
                    <option value="">Pilih Status</option>
                    {statusPendidikanOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jurusan</label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.jurusan`)} placeholder="Nama jurusan" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institusi</label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.institusi`)} placeholder="Nama institusi" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun Mulai</label>
                  <input type="number" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.tahun_mulai`, { valueAsNumber: true })} placeholder="2000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun Selesai</label>
                  <input type="number" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.tahun_selesai`, { valueAsNumber: true })} placeholder="2004" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. Ijazah</label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.no_ijazah`)} placeholder="Nomor ijazah" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gelar</label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.gelar`)} placeholder="S.Kom, M.Kom, dll" />
                </div>
                </div>
                <div className="col-span-1 flex justify-center items-center">
                  <div className='h-60 w-40 bg-white rounded-xl p-6 border border-gray-200 flex flex-col  shadow-sm hover:shadow-xl -rotate-12 -translate-y-10 -translate-x-10 hover:z-50 hover:-rotate-0 transition-all hover:scale-110 cursor-pointer'>
                    <p>Ijazah</p>
                  </div>
                  <div className='h-60 w-40 bg-white rounded-xl p-6 border border-gray-200 flex flex-col justify-center items-center shadow-sm hover:shadow-xl rotate-12 hover:z-50 hover:rotate-0 transition-all hover:scale-110 absolute right-30 cursor-pointer'>
                    <p>Transkrip</p>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Belum ada riwayat pendidikan. Klik "Tambah Pendidikan" untuk menambahkan.</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button type="button" onClick={handleSubmit(onSubmit)} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
            Simpan Semua
          </button>

          <button
            type="button"
            onClick={() => append({
              status_pendidikan: { nama: '' },
              jurusan: '',
              institusi: '',
              tahun_mulai: new Date().getFullYear(),
              tahun_selesai: new Date().getFullYear(),
              no_ijazah: '',
              dokumen_ijazah: '',
              dokumen_transkrip: '',
              gelar: null
            })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            + Tambah Pendidikan
          </button>
        </div>
      </div>
    </div>
  );
}


