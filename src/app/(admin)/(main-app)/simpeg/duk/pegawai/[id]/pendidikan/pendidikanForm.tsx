"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { 
    useCreateRiwayatPendidikan, 
    useUpdateRiwayatPendidikan 
} from "@/hooks/fetch/pegawai/usePegawaiRiwayatPendidikan";
import UploadIjazah from "./uploadIjazah";

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

const pendidikanSchema = z.object({
    id_pendidikan: z.union([z.string().uuid(), z.literal(""), z.null()]).optional(),
    status_pendidikan: z.string().min(1, "Status pendidikan wajib diisi"),
    jurusan: z.string().min(1, "Jurusan wajib diisi"),
    institusi: z.string().min(1, "Institusi wajib diisi"),
    tahun_mulai: z.number().min(1900, "Tahun mulai tidak valid"),
    tahun_selesai: z.number().min(1900, "Tahun selesai tidak valid"),
    no_ijazah: z.string().min(1, "Nomor ijazah wajib diisi"),
    gelar: z.string().nullable().optional(),
    dokumen_ijazah: z.any().optional(),
    dokumen_transkrip: z.any().optional(),
});

type FormValues = z.infer<typeof pendidikanSchema>;

interface PendidikanFormProps {
    isEdit: boolean; // jika ada, berarti edit
    selectedItem?: any; // jika ada, berarti edit
    onSuccess?: () => void; // callback setelah berhasil submit
    onClose?: () => void; // callback untuk menutup form
}

export default function PendidikanForm({
    isEdit,
    selectedItem,
    onSuccess,
    onClose,
}: PendidikanFormProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const params = useParams();
    const user = useAppSelector((state) => state.auth.user);
    const id = params?.id === "data-saya" ? user?.id_pegawai : params?.id;
    const idParam = id as string;

    // Mutation hooks
    const createMutation = useCreateRiwayatPendidikan();
    const updateMutation = useUpdateRiwayatPendidikan();

    const isLoading = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(pendidikanSchema),
        defaultValues: {
            id_pendidikan: selectedItem?.id_pendidikan ?? "",
            status_pendidikan: String(selectedItem?.status_pendidikan_id ?? ""),
            jurusan: selectedItem?.jurusan ?? "",
            institusi: selectedItem?.institusi ?? "",
            tahun_mulai: selectedItem?.tahun_mulai ?? new Date().getFullYear(),
            tahun_selesai: selectedItem?.tahun_selesai ?? new Date().getFullYear(),
            no_ijazah: selectedItem?.no_ijazah ?? "",
            gelar: selectedItem?.gelar ?? "",
        },
    });


    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        try {
            const payload = {
                pegawai_id: idParam,
                status_pendidikan_id: Number(data.status_pendidikan),
                institusi: data.institusi,
                jurusan: data.jurusan,
                tahun_mulai: data.tahun_mulai,
                tahun_selesai: data.tahun_selesai,
                no_ijazah: data.no_ijazah,
                gelar: data.gelar || undefined,
            };

            if (isEdit) {
                // Update existing
                await updateMutation.mutateAsync({
                    id_pegawai: idParam,
                    id_pendidikan: selectedItem.id,
                    data: payload,
                });
            } else {
                // Create new
                await createMutation.mutateAsync({
                    id_pegawai: idParam,
                    data: payload,
                });
            }

            // Call success callback
            onSuccess?.();
            onClose?.();
        } catch (error : any) {
            console.error('Error submitting form:', error);
            setErrorMessage(error.response.data.message);
        }
    };
    
    useEffect(() => {
        if (selectedItem) {
            reset({
                id_pendidikan: selectedItem.id_pendidikan ?? "",
                status_pendidikan: String(selectedItem.status_pendidikan_id ?? ""),
                jurusan: selectedItem.jurusan ?? "",
                institusi: selectedItem.institusi ?? "",
                tahun_mulai: Number(selectedItem.tahun_mulai) || new Date().getFullYear(),
                tahun_selesai: Number(selectedItem.tahun_selesai) || new Date().getFullYear(),
                no_ijazah: selectedItem.no_ijazah ?? "",
                gelar: selectedItem.gelar ?? "",
            });
        } else {
            // Reset form to default values when no selectedItem (create mode)
            reset({
                id_pendidikan: "",
                status_pendidikan: "",
                jurusan: "",
                institusi: "",
                tahun_mulai: new Date().getFullYear(),
                tahun_selesai: new Date().getFullYear(),
                no_ijazah: "",
                gelar: "",
            });
            setErrorMessage(""); // Clear error message when resetting
        }
    }, [selectedItem, reset]);
    
    const inputClass =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50";
    
    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="max-w-[800px]"
        >
        <div className="grid grid-cols-2 gap-4 ">
        {/* Status Pendidikan */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Status Pendidikan
        </label>
        <select
        className={inputClass}
        disabled={isLoading}
        {...register("status_pendidikan")}
        >
        <option value="">Pilih Status</option>
        {statusPendidikanOptions.map((opt) => (
            <option key={opt.id} value={`${opt.id}`}>
            {opt.nama}
            </option>
        ))}
        </select>
        {errors.status_pendidikan && (
            <p className="text-red-500 text-sm mt-1">
            {errors.status_pendidikan.message}
            </p>
        )}
        </div>
        
        {/* Jurusan */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Jurusan
        </label>
        <input
        type="text"
        className={inputClass}
        disabled={isLoading}
        {...register("jurusan")}
        placeholder="Nama jurusan"
        />
        {errors.jurusan && (
            <p className="text-red-500 text-sm mt-1">{errors.jurusan.message}</p>
        )}
        </div>
        
        {/* Institusi */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Institusi
        </label>
        <input
        type="text"
        className={inputClass}
        disabled={isLoading}
        {...register("institusi")}
        placeholder="Nama institusi"
        />
        </div>
        
        {/* Tahun Mulai */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tahun Mulai
        </label>
        <input
        type="number"
        className={inputClass}
        disabled={isLoading}
        {...register("tahun_mulai", { valueAsNumber: true })}
        />
        </div>
        
        {/* Tahun Selesai */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tahun Selesai
        </label>
        <input
        type="number"
        className={inputClass}
        disabled={isLoading}
        {...register("tahun_selesai", { valueAsNumber: true })}
        />
        </div>
        
        {/* Nomor Ijazah */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        No. Ijazah
        </label>
        <input
        type="text"
        className={inputClass}
        disabled={isLoading}
        {...register("no_ijazah")}
        />
        </div>
        
        {/* Gelar */}
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Gelar
        </label>
        <input
        type="text"
        className={inputClass}
        disabled={isLoading}
        {...register("gelar")}
        />
        </div>
        
        {/* Upload */}
        <div className="col-span-2 flex gap-3">
        <UploadIjazah
        title="Upload Ijazah"
        onFileChange={(file) => setValue("dokumen_ijazah", file)}
        />
        <UploadIjazah
        title="Upload Transkrip"
        onFileChange={(file) => setValue("dokumen_transkrip", file)}
        />
        </div>
        </div>
        
        {/* Error Display */}
        {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded w-full">
                Terjadi kesalahan saat menyimpan data. Silakan coba lagi. <br />
                {errorMessage}
            </div>
        )}

        <div className="flex justify-end mt-6 gap-3">
        <button
        type="submit"
        disabled={isLoading}
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {isLoading ? "Menyimpan..." : (selectedItem ? "Simpan Perubahan" : "Tambah Pendidikan")}
        </button>
        </div>
        </form>
    );
}
