"use client";
import React, { useMemo} from 'react';
import { useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useGetPegawaiById, useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// schema tiap item pendidikan
const riwayatPendidikanSchema = z.object({
  status_pendidikan: z.object({
    nama: z.string().min(1, "Status pendidikan wajib diisi"),
  }),
  jurusan: z.string().min(1, "Jurusan wajib diisi"),
  institusi: z.string().min(1, "Institusi wajib diisi"),
  tahun_mulai: z.number().min(1900, "Tahun mulai tidak valid"),
  tahun_selesai: z.number().min(1900, "Tahun selesai tidak valid"),
  no_ijazah: z.string().min(1, "Nomor ijazah wajib diisi"),
  dokumen_ijazah: z.string().optional(),
  dokumen_transkrip: z.string().optional(),
  gelar: z.string().nullable().optional(),
  addnew : z.boolean().optional(),
});

// schema utama
const pendidikanSchema = z.object({
  riwayat_pendidikan: z.array(riwayatPendidikanSchema).min(1, "Minimal 1 riwayat pendidikan"),
});

type FormValues = z.infer<typeof pendidikanSchema>;

// Ganti array lama
const statusPendidikanOptions = [
    { id: 1, nama: 'SMP' },
    { id: 2, nama: 'SMA' },
    { id: 3, nama: 'D1' },
    { id: 4, nama: 'D2' },
    { id: 5, nama: 'D3' },
    { id: 6, nama: 'S1' },
    { id: 7, nama: 'S2' },
    { id: 8, nama: 'S3' },
    { id: 9, nama: 'Profesi' },
    { id: 10, nama: 'Spesialis' },
];

export default function PendidikanPage() {
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = (params?.id === "data-saya") ? user?.id_pegawai : params?.id;
  const idParam = id as string;
  

  const { data, isLoading : isLoadingPegawai } = useGetPegawaiById(idParam);
  const updatePegawai = useUpdatePegawai();

  const isLoading = isLoadingPegawai || updatePegawai.isPending;
  const defaults: FormValues = useMemo(() => {
    const list = data?.data?.riwayat_pendidikan ?? [];
    return {
      riwayat_pendidikan: list.map((r: any) => ({
        status_pendidikan: r?.status_pendidikan?.id ||"",
        jurusan: r?.jurusan || "",
        institusi: r?.institusi || "",
        tahun_mulai: Number(r?.tahun_mulai) || new Date().getFullYear(),
        tahun_selesai: Number(r?.tahun_selesai) || new Date().getFullYear(),
        no_ijazah: r?.no_ijazah || "",
        dokumen_ijazah: r?.dokumen_ijazah || "",
        dokumen_transkrip: r?.dokumen_transkrip || "",
        gelar: r?.gelar || "",
        addnew : false,
      })),
    };
  }, [data]);
  

  console.log(defaults)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({ 
    defaultValues: defaults,
    values: defaults,
    reValidateMode: "onBlur",
    mode: "onBlur",
    resolver: zodResolver(pendidikanSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "riwayat_pendidikan" as const
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
    <div className={`w-full mx-auto p-6 ${isLoading ? 'opacity-50' : ''}`}>
      
      {isLoading && <div className='absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed'></div>}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Pendidikan <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.status_pendidikan && errors.riwayat_pendidikan?.[index]?.status_pendidikan.message ? `${errors.riwayat_pendidikan?.[index]?.status_pendidikan.message}` : ""}</p></label>
                  <select className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.status_pendidikan`)}
                  >
                    <option value="">Pilih Status</option>
                    {statusPendidikanOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.nama}</option>  
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jurusan <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.jurusan && errors.riwayat_pendidikan?.[index]?.jurusan.message ? `${errors.riwayat_pendidikan?.[index]?.jurusan.message}` : ""}</p></label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.jurusan`)} placeholder="Nama jurusan" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institusi <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.institusi && errors.riwayat_pendidikan?.[index]?.institusi.message ? `${errors.riwayat_pendidikan?.[index]?.institusi.message}` : ""}</p></label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.institusi`)} placeholder="Nama institusi" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun Mulai <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.tahun_mulai && errors.riwayat_pendidikan?.[index]?.tahun_mulai.message ? `${errors.riwayat_pendidikan?.[index]?.tahun_mulai.message}` : ""}</p></label>
                  <input type="number" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.tahun_mulai`, { valueAsNumber: true })} placeholder="2000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tahun Selesai <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.tahun_selesai && errors.riwayat_pendidikan?.[index]?.tahun_selesai.message ? `${errors.riwayat_pendidikan?.[index]?.tahun_selesai.message}` : ""}</p></label>
                  <input type="number" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.tahun_selesai`, { valueAsNumber: true })} placeholder="2004" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. Ijazah <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.no_ijazah && errors.riwayat_pendidikan?.[index]?.no_ijazah.message ? `${errors.riwayat_pendidikan?.[index]?.no_ijazah.message}` : ""}</p></label>
                  <input type="text" className={inputClass} disabled={isLoading} {...register(`riwayat_pendidikan.${index}.no_ijazah`)} placeholder="Nomor ijazah" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gelar <p className="text-red-500 text-sm mt-1">{errors.riwayat_pendidikan?.[index]?.gelar && errors.riwayat_pendidikan?.[index]?.gelar.message ? `${errors.riwayat_pendidikan?.[index]?.gelar.message}` : ""}</p></label>
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
              gelar: '',
              addnew : true,
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



function uploadDokument(){
  return(
    <>  </>
  )
}
