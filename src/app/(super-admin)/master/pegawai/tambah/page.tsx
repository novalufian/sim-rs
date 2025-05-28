// src/app/(admin)/(main-app)/sim-pegawai/components/PegawaiForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Assuming these are your custom UI components (adjust paths as needed)
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField'; // Assuming InputField is similar to your LaporForm's Input
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import DatePicker from 'react-flatpickr'; // Make sure react-flatpickr is installed

import { HiMiniPaperAirplane } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Import your defined schema and hooks
import { pegawaiSchema, PegawaiFormInput } from '@/app/(super-admin)/master/pegawai/pegawaiInterface';
import { usePostPegawai, useUpdatePegawai, useGetPegawaiById } from '@/hooks/fetch/pegawai/usePegawai'; // Assuming usePostPegawai also has useUpdatePegawai and useGetPegawaiById
import DropzoneComponent from '@/components/form/form-elements/DropZone';

// Define options for enums
const jenisKelaminOptions = [
    { value: "LAKI_LAKI", label: "Laki-laki" },
    { value: "PEREMPUAN", label: "Perempuan" },
];

const agamaOptions = [
    { value: "ISLAM", label: "Islam" },
    { value: "KRISTEN_PROTESTAN", label: "Kristen Protestan" },
    { value: "KATOLIK", label: "Katolik" },
    { value: "HINDU", label: "Hindu" },
    { value: "BUDHA", label: "Budha" },
    { value: "KONGHUCU", label: "Konghucu" },
];

const statusPerkawinanOptions = [
    { value: "BELUM_KAWIN", label: "Belum Kawin" },
    { value: "KAWIN", label: "Kawin" },
    { value: "CERAI_HIDUP", label: "Cerai Hidup" },
    { value: "CERAI_MATI", label: "Cerai Mati" },
];

const statusPekerjaanOptions = [
    { value: "AKTIF", label: "Aktif" },
    { value: "NON_AKTIF", label: "Non-Aktif" },
    { value: "PENSIUN", label: "Pensiun" },
    { value: "CUTI", label: "Cuti" },
];

export default function PegawaiForm() {
    const params = useParams();
    const id = params?.id as string; // Check if an ID exists for editing mode

    // Hooks for data operations
    const { mutate: postPegawai, isPending: isPosting, isSuccess: isPostSuccess, isError: isPostError, error: postError } = usePostPegawai();
    const { mutate: updatePegawai, isPending: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError } = useUpdatePegawai();
    const { data: pegawaiData, isLoading: isPegawaiLoading } = useGetPegawaiById(id);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(pegawaiSchema),
        defaultValues: {
            no_urut: 0, // Provide a default for required number fields to avoid "unknown" type issues initially
            nama: "",
            nip: "",
            status_pekerjaan: "AKTIF", // Default value
            // Explicitly set optional fields to null or empty string if you want to avoid `undefined` initially
            tempat_lahir: null,
            tanggal_lahir: null,
            umur: null,
            jenis_kelamin: null,
            agama: null,
            nik: null,
            no_kk: null,
            alamat_ktp: null,
            alamat_domisili: null,
            no_hp: null,
            email: null,
            npwp: null,
            bpjs: null,
            nama_bank_gaji: null,
            no_rekening: null,
            status_perkawinan: null,
            nama_pasangan: null,
            nama_anak: null,
        },
    });

    const onSubmit: SubmitHandler<PegawaiFormInput> = (data) => {
        // Zod and react-hook-form handle type conversion.
        // No explicit transformation needed here unless your API requires a different format.
        console.log("Form Data:", data);

        if (id) {
            // Update existing pegawai
            updatePegawai({ id, formData: data });
        } else {
            // Create new pegawai
            postPegawai(data);
        }
    };

    const onError = (err: any) => {
        console.error("Form validation errors:", err);
        // You might want to display a toast or alert for form validation errors
    };

    // Effect to populate form when editing an existing pegawai
    useEffect(() => {
        if (id && pegawaiData) {
            // Set form values based on fetched data
            setValue("no_urut", pegawaiData.no_urut);
            setValue("nama", pegawaiData.nama);
            setValue("nip", pegawaiData.nip);
            setValue("tempat_lahir", pegawaiData.tempat_lahir || null);
            // Convert Date object back to YYYY-MM-DD string for HTML date input
            setValue("tanggal_lahir", pegawaiData.tanggal_lahir ? new Date(pegawaiData.tanggal_lahir).toISOString().split('T')[0] : null);
            setValue("umur", pegawaiData.umur || null);
            setValue("jenis_kelamin", (pegawaiData.jenis_kelamin as PegawaiFormInput['jenis_kelamin']) || null);
            setValue("agama", (pegawaiData.agama as PegawaiFormInput['agama']) || null);
            setValue("nik", pegawaiData.nik || null);
            setValue("no_kk", pegawaiData.no_kk || null);
            setValue("alamat_ktp", pegawaiData.alamat_ktp || null);
            setValue("alamat_domisili", pegawaiData.alamat_domisili || null);
            setValue("no_hp", pegawaiData.no_hp || null);
            setValue("email", pegawaiData.email || null);
            setValue("npwp", pegawaiData.npwp || null);
            setValue("bpjs", pegawaiData.bpjs || null);
            setValue("nama_bank_gaji", pegawaiData.nama_bank_gaji || null);
            setValue("no_rekening", pegawaiData.no_rekening || null);
            setValue("status_perkawinan", (pegawaiData.status_perkawinan as PegawaiFormInput['status_perkawinan']) || null);
            setValue("nama_pasangan", pegawaiData.nama_pasangan || null);
            setValue("nama_anak", pegawaiData.nama_anak || null);
            setValue("status_pekerjaan", (pegawaiData.status_pekerjaan as PegawaiFormInput['status_pekerjaan']));
        }
    }, [id, pegawaiData, setValue]);

    // Handle success or error for mutations
    useEffect(() => {
        if (isPostSuccess) {
            alert('Pegawai created successfully!');
            reset(); // Clear the form on successful submission
        }
        if (isPostError) {
            alert(`Error creating pegawai: ${postError?.message}`);
        }
    }, [isPostSuccess, isPostError, postError, reset]);

    useEffect(() => {
        if (isUpdateSuccess) {
            alert('Pegawai updated successfully!');
            // Optionally, you might want to redirect or just show a message
        }
        if (isUpdateError) {
            alert(`Error updating pegawai: ${updateError?.message}`);
        }
    }, [isUpdateSuccess, isUpdateError, updateError]);


    const isFormLoading = isPegawaiLoading || isSubmitting || isPosting || isUpdating;

    return (
        <div className="grid grid-cols-12 gap-1">
            <ComponentCard title={id ? 'Edit Pegawai' : 'Tambah Pegawai Baru'} className='col-span-9 text-base'>
                {isPegawaiLoading && id ? (
                    <div className="text-center p-4 text-gray-500">Loading data pegawai...</div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <div className="w-full space-y-6 grid grid-cols-12 gap-4 mt-4">
                            {/* No. Urut */}
                            <div className='col-span-12 md:col-span-4'>
                                <Label required htmlFor="no_urut">No. Urut</Label>
                                <Input
                                    id="no_urut"
                                    type="number" // HTML input type is number
                                    {...register("no_urut", { valueAsNumber: true })} // Crucial for number conversion
                                    placeholder='Masukkan nomor urut'
                                    className={`${errors.no_urut ? 'border-red-500': ""}`}
                                />
                                {errors.no_urut && <p className='text-red-500 text-sm mt-1'>{errors.no_urut.message}</p>}
                            </div>

                            {/* Nama */}
                            <div className='col-span-12 md:col-span-8'>
                                <Label required htmlFor="nama">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    type="text"
                                    {...register("nama")}
                                    placeholder='Masukkan nama lengkap'
                                    className={`${errors.nama ? 'border-red-500': ""}`}
                                />
                                {errors.nama && <p className='text-red-500 text-sm mt-1'>{errors.nama.message}</p>}
                            </div>

                            {/* NIP */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label required htmlFor="nip">NIP</Label>
                                <Input
                                    id="nip"
                                    type="text"
                                    {...register("nip")}
                                    placeholder='Masukkan NIP'
                                    className={`${errors.nip ? 'border-red-500': ""}`}
                                />
                                {errors.nip && <p className='text-red-500 text-sm mt-1'>{errors.nip.message}</p>}
                            </div>

                            {/* Tempat Lahir */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="tempat_lahir"
                                    type="text"
                                    {...register("tempat_lahir")}
                                    placeholder='Masukkan tempat lahir'
                                />
                            </div>

                            {/* Tanggal Lahir */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Controller
                                    control={control}
                                    name="tanggal_lahir"
                                    render={({ field: { onChange, value, name, ref } }) => (
                                        <DatePicker
                                            value={value ? [new Date(value)] : []} // Ensure value is array of Date objects
                                            onChange={(selectedDates) => {
                                                const date = selectedDates?.[0];
                                                if (date) onChange(date.toISOString().split('T')[0]); // Convert to YYYY-MM-DD string
                                                else onChange(null); // Set to null if date is cleared/invalid
                                            }}
                                            options={{ dateFormat: "Y-m-d", allowInput: true }}
                                            className={`w-full h-11 border rounded px-3 text-sm ${errors.tanggal_lahir ? 'border-red-500' : ''}`}
                                            name={name}
                                            ref={ref}
                                        />
                                    )}
                                />
                                {errors.tanggal_lahir && (
                                    <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir.message}</p>
                                )}
                            </div>

                            {/* Umur */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="umur">Umur</Label>
                                <Input
                                    id="umur"
                                    type="number" // HTML input type is number
                                    {...register("umur", { valueAsNumber: true })} // Crucial for number conversion
                                    placeholder='Umur'
                                />
                                {errors.umur && <p className='text-red-500 text-sm mt-1'>{errors.umur.message}</p>}
                            </div>

                            {/* Jenis Kelamin */}
                            <div className='col-span-12 md:col-span-4'>
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <select
                                    id="jenis_kelamin"
                                    {...register("jenis_kelamin")}
                                    className="w-full h-11 border rounded px-3 text-sm"
                                >
                                    <option value="">Pilih Jenis Kelamin</option>
                                    {jenisKelaminOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Agama */}
                            <div className='col-span-12 md:col-span-4'>
                                <Label htmlFor="agama">Agama</Label>
                                <select
                                    id="agama"
                                    {...register("agama")}
                                    className="w-full h-11 border rounded px-3 text-sm"
                                >
                                    <option value="">Pilih Agama</option>
                                    {agamaOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Perkawinan */}
                            <div className='col-span-12 md:col-span-4'>
                                <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                                <select
                                    id="status_perkawinan"
                                    {...register("status_perkawinan")}
                                    className="w-full h-11 border rounded px-3 text-sm"
                                >
                                    <option value="">Pilih Status Perkawinan</option>
                                    {statusPerkawinanOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* NIK */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    type="text"
                                    {...register("nik")}
                                    placeholder='Masukkan NIK (16 digit)'
                                    className={`${errors.nik ? 'border-red-500' : ""}`}
                                />
                                {errors.nik && <p className='text-red-500 text-sm mt-1'>{errors.nik.message}</p>}
                            </div>

                            {/* No KK */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="no_kk">No. KK</Label>
                                <Input
                                    id="no_kk"
                                    type="text"
                                    {...register("no_kk")}
                                    placeholder='Masukkan Nomor Kartu Keluarga'
                                />
                            </div>

                            {/* Alamat KTP */}
                            <div className='col-span-12'>
                                <Label htmlFor="alamat_ktp">Alamat KTP</Label>
                                <TextArea
                                    id="alamat_ktp"
                                    rows={3}
                                    {...register("alamat_ktp")}
                                    placeholder='Masukkan alamat sesuai KTP'
                                />
                            </div>

                            {/* Alamat Domisili */}
                            <div className='col-span-12'>
                                <Label htmlFor="alamat_domisili">Alamat Domisili</Label>
                                <TextArea
                                    id="alamat_domisili"
                                    rows={3}
                                    {...register("alamat_domisili")}
                                    placeholder='Masukkan alamat domisili'
                                />
                            </div>

                            {/* No. HP */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="no_hp">No. HP</Label>
                                <Input
                                    id="no_hp"
                                    type="tel"
                                    {...register("no_hp")}
                                    placeholder='Contoh: 081234567890'
                                />
                            </div>

                            {/* Email */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder='Contoh: nama@example.com'
                                    className={`${errors.email ? 'border-red-500' : ""}`}
                                />
                                {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                            </div>

                            {/* NPWP */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="npwp">NPWP</Label>
                                <Input
                                    id="npwp"
                                    type="text"
                                    {...register("npwp")}
                                    placeholder='Masukkan NPWP'
                                />
                            </div>

                            {/* BPJS */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="bpjs">BPJS</Label>
                                <Input
                                    id="bpjs"
                                    type="text"
                                    {...register("bpjs")}
                                    placeholder='Masukkan nomor BPJS'
                                />
                            </div>

                            {/* Nama Bank Gaji */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="nama_bank_gaji">Nama Bank Gaji</Label>
                                <Input
                                    id="nama_bank_gaji"
                                    type="text"
                                    {...register("nama_bank_gaji")}
                                    placeholder='Contoh: BCA, Mandiri'
                                />
                            </div>

                            {/* No Rekening */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="no_rekening">No. Rekening</Label>
                                <Input
                                    id="no_rekening"
                                    type="text"
                                    {...register("no_rekening")}
                                    placeholder='Masukkan nomor rekening'
                                />
                            </div>

                            {/* Nama Pasangan */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="nama_pasangan">Nama Pasangan</Label>
                                <Input
                                    id="nama_pasangan"
                                    type="text"
                                    {...register("nama_pasangan")}
                                    placeholder='Nama pasangan (jika sudah menikah)'
                                />
                            </div>

                            {/* Nama Anak */}
                            <div className='col-span-12 md:col-span-6'>
                                <Label htmlFor="nama_anak">Nama Anak</Label>
                                <Input
                                    id="nama_anak"
                                    type="text"
                                    {...register("nama_anak")}
                                    placeholder='Nama anak (jika ada)'
                                />
                            </div>

                            {/* Status Pekerjaan */}
                            <div className='col-span-12'>
                                <Label required htmlFor="status_pekerjaan">Status Pekerjaan</Label>
                                <select
                                    id="status_pekerjaan"
                                    {...register("status_pekerjaan")}
                                    className="w-full h-11 border rounded px-3 text-sm"
                                >
                                    <option value="">Pilih Status Pekerjaan</option>
                                    {statusPekerjaanOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {errors.status_pekerjaan && <p className='text-red-500 text-sm mt-1'>{errors.status_pekerjaan.message}</p>}
                            </div>


                            {/* Action Buttons */}
                            <div className="col-span-12 flex justify-end">
                                <Button
                                    btntype="button"
                                    size="sm"
                                    className="w-auto bg-gray-300 hover:bg-gray-800 mr-3 text-gray-800 hover:text-white"
                                    onClick={() => reset()} // Reset form on cancel
                                >
                                    Batalkan
                                </Button>
                                <Button
                                    btntype="submit"
                                    size="sm"
                                    className={`w-auto ${isFormLoading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                                    disabled={isFormLoading}
                                >
                                    {isFormLoading ? "Memproses..." : (id ? "Update Pegawai" : "Tambah Pegawai")}
                                    {isFormLoading ? (
                                        <AiOutlineLoading3Quarters className="inline-block animate-spin ml-2" />
                                    ) : (
                                        <HiMiniPaperAirplane className="inline-block ml-2" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </ComponentCard>
            <div className='col-span-3 h-auto '>
                <DropzoneComponent />
            </div>
        </div>
    );
}