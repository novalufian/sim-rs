"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";

// ** HOOK
import { useGetPegawaiById , useUpdatePegawai} from "@/hooks/fetch/pegawai/usePegawai";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pegawaiSchema, PegawaiFormInput } from '@/app/(super-admin)/master/pegawai/pegawaiInterface';

// ** COMPONENT
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "react-flatpickr";
import TextArea from "@/components/form/input/TextArea";

// ** ICON
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiMiniPaperAirplane } from "react-icons/hi2";
import { GoX ,GoPencil} from "react-icons/go";

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
    { value: "PNS", label: "PNS" },
    { value: "AKTIF", label: "Aktif" },
    { value: "NON_AKTIF", label: "Non-Aktif" },
    { value: "PENSIUN", label: "Pensiun" },
    { value: "CUTI", label: "Cuti" },
];

export default function PegawaiProfile({ userId }: { userId: string }) {
        const [isEditing, setIsEditing] = useState(false);
        const [pegawai, setPegawai] = useState<any>(null);
        const {data: dataPegawai , isLoading: isPegawaiLoading, refetch: refetchPegawai} = useGetPegawaiById(userId || "");
        const {mutate: updatePegawai, isPending: isUpdateLoading, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError} = useUpdatePegawai();
        const isFormLoading = isPegawaiLoading || isUpdateLoading;

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
            status_pekerjaan: "PNS", // Default value
            // Explicitly set optional fields to null or empty string if you want to avoid `undefined` initially
            tempat_lahir: null,
            tanggal_lahir: null,
            umur: null,
            jenis_kelamin: "LAKI_LAKI",
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
        // Prepare payload matching Postman's successful format
        const payload = {
            ...data,
            id_pegawai: pegawai?.id_pegawai,
            // Convert all dates to ISO format
            tanggal_lahir: data.tanggal_lahir 
                ? new Date(data.tanggal_lahir).toISOString()
                : null,
            // Ensure enum values match backend expectations
            jenis_kelamin: data.jenis_kelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
        };
    
        // Remove null values if backend prefers undefined for optional fields
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== null)
        );
    
        console.log("Final Payload:", cleanPayload);
        updatePegawai({ id: pegawai?.id_pegawai, formData: cleanPayload });
        refetchPegawai();
        setIsEditing(false);
    };

    const onError = (err: any) => {
        console.error("Form validation errors:", err);
        // You might want to display a toast or alert for form validation errors
    };

    useEffect(() => {
        if(isUpdateSuccess){
            refetchPegawai();
        }
    },[isUpdateSuccess])

    useEffect(() => {
        if(isUpdateError){
            console.log(isUpdateError)
        }
    },[isUpdateSuccess])
    

    useEffect(() => {
        if(dataPegawai){
            setPegawai(dataPegawai.data)
        }
        if (pegawai) {
            // Set form values based on fetched data
            setValue("no_urut", pegawai.no_urut);
            setValue("nama", pegawai.nama);
            setValue("nip", pegawai.nip);
            setValue("tempat_lahir", pegawai.tempat_lahir || null);
            // Convert Date object back to YYYY-MM-DD string for HTML date input
            // In your useEffect that sets form values:
            setValue("tanggal_lahir", 
                pegawai.tanggal_lahir 
                ? new Date(pegawai.tanggal_lahir).toISOString().split('T')[0] 
                : null
            );
            setValue("umur", pegawai.umur || null);
            setValue("jenis_kelamin", (pegawai.jenis_kelamin as PegawaiFormInput['jenis_kelamin']) || null);
            setValue("agama", (pegawai.agama as PegawaiFormInput['agama']) || null);
            setValue("nik", pegawai.nik || null);
            setValue("no_kk", pegawai.no_kk || null);
            setValue("alamat_ktp", pegawai.alamat_ktp || null);
            setValue("alamat_domisili", pegawai.alamat_domisili || null);
            setValue("no_hp", pegawai.no_hp || null);
            setValue("email", pegawai.email || null);
            setValue("npwp", pegawai.npwp || null);
            setValue("bpjs", pegawai.bpjs || null);
            setValue("nama_bank_gaji", pegawai.nama_bank_gaji || null);
            setValue("no_rekening", pegawai.no_rekening || null);
            setValue("status_perkawinan", (pegawai.status_perkawinan as PegawaiFormInput['status_perkawinan']) || null);
            setValue("nama_pasangan", pegawai.nama_pasangan || null);
            setValue("nama_anak", pegawai.nama_anak || null);
            setValue("status_pekerjaan", (pegawai.status_pekerjaan as PegawaiFormInput['status_pekerjaan']));
        }
    }, [dataPegawai, pegawai, setValue]);
    return (
        <div className="flex flex-col gap-6 w-full items-center justify-center px-4 sm:px-6 lg:px-8 ">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] w-9/10">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4 ml-6 flex items-end">Data Pribadi : </h1>

                <div className="space-y-6">
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <Image
                                width={80}
                                height={80}
                                src="/images/user/owner.jpg"
                                alt="user"
                            />
                            </div>
                            <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {pegawai?.nama}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                NIP : {pegawai?.nip}
                                </p>
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                Arizona, United States
                                </p>
                            </div>
                            </div>
                        </div>
                        <button
                            onClick={()=>{setIsEditing(!isEditing)}}
                            className={`flex w-full items-center justify-center gap-2 rounded-full border  px-4 py-3 text-sm font-medium shadow-theme-xs  lg:inline-flex lg:w-auto ${!isEditing ? " dark:border-gray-700 border-gray-300  bg-white dark:bg-gray-800  cursor-not-allowed text-gray-700 dark:hover:text-gray-200 dark:text-gray-400 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.03] " : "bg-red-300 text-red-600 hover:bg-red-600 hover:text-white border-red-600"}`}
                        >
                            {isEditing ? (
                                <>
                                <GoX className="w-6 h-6"/>
                                Batalkan
                                </>
                            ) : (
                                <>  
                                <GoPencil className="w-6 h-6"/>
                                Edit
                                </>
                            )}
                            
                        </button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, onError)}>

                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 grid grid-cols-12 gap-6 mb-6">
                        {/* No. Urut */}
                        <div className="col-span-12 md:col-span-6">
                            <div className="flex items-center">
                                <Label required htmlFor="no_urut" >No. Urut </Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            
                            <Input
                                id="no_urut"
                                type="number" // HTML input type is number
                                loading={isFormLoading}
                                {...register("no_urut", { valueAsNumber: true })} // Crucial for number conversion
                                placeholder='Masukkan nomor urut'
                                className={`${errors.no_urut ? 'border-red-500': ""} bg-white dark:bg-transparent`}
                                disabled={true}
                            />
                            {errors.no_urut && <p className='text-red-500 text-sm mt-1'>{errors.no_urut.message}</p>}
                        </div>

                        {/* Nama */}
                        <div className="col-span-12 md:col-span-6">
                            <div className="flex items-center">
                                <Label required htmlFor="nama" >Nama Lengkap </Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            
                            <Input
                                id="nama"
                                type="text"
                                loading={isFormLoading}
                                {...register("nama")}
                                placeholder='Masukkan nama lengkap'
                                className={`${errors.nama ? 'border-red-500': ""}  ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                            {errors.nama && <p className='text-red-500 text-sm mt-1'>{errors.nama.message}</p>}
                        </div>

                        {/* NIP */}
                        <div className='col-span-12 md:col-span-6'>
                            <div className="flex items-center">
                                <Label required htmlFor="nip">NIP</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <Input
                                id="nip"
                                type="text"
                                loading={isFormLoading}
                                {...register("nip")}
                                placeholder='Masukkan NIP'
                                className={`${errors.nip ? 'border-red-500': ""}  ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                            {errors.nip && <p className='text-red-500 text-sm mt-1'>{errors.nip.message}</p>}
                        </div>

                        {/* Tempat Lahir */}
                        <div className='col-span-12 md:col-span-6'>
                            <div className="flex items-center">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <Input
                                id="tempat_lahir"
                                type="text"
                                loading={isFormLoading}
                                {...register("tempat_lahir")}
                                placeholder='Masukkan tempat lahir'

                                className={` ${errors.tempat_lahir ? 'border-red-500': ""}  ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Tanggal Lahir */}
                        <div className='col-span-12 md:col-span-6'>
                            <div className="flex items-center">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
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
                                        className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${errors.tanggal_lahir ? 'border-red-500' : ''} ${ isEditing ? "dark:bg-gray-900" : "cursor-not-allowed bg-transparent "}`}
                                        name={name}
                                        ref={ref}
                                        disabled={!isEditing}
                                    />
                                )}
                            />
                            {errors.tanggal_lahir && (
                                <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir.message}</p>
                            )}
                        </div>

                        {/* Umur */}
                        <div className='col-span-12 md:col-span-6'>
                            <div className="flex items-center">
                                <Label htmlFor="umur">Umur</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <Input
                                id="umur"
                                type="number" // HTML input type is number
                                {...register("umur", { valueAsNumber: true })} // Crucial for number conversion
                                placeholder='Umur'
                                loading={isFormLoading}
                                className={` ${errors.umur ? 'border-red-500': ""}  ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                            {errors.umur && <p className='text-red-500 text-sm mt-1'>{errors.umur.message}</p>}
                        </div>

                        {/* Jenis Kelamin */}
                        <div className='col-span-12 md:col-span-4'>
                            <div className="flex items-center">
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <select
                                id="jenis_kelamin"
                                {...register("jenis_kelamin")}
                                className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${errors.jenis_kelamin ? 'border-red-500' : ''} ${ isEditing ? "dark:bg-gray-900" : "cursor-not-allowed bg-transparent "}`}
                                disabled={!isEditing}
                            >
                                <option value="LAKI_LAKI" selected>laki - laki</option>
                                <option value="PEREMPUAN" >Perempuan</option>
                            </select>
                        </div>

                        {/* Agama */}
                        <div className='col-span-12 md:col-span-4'>
                            <div className="flex items-center">
                                <Label htmlFor="agama">Agama</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <select
                                id="agama"
                                {...register("agama")}
                                className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${errors.agama ? 'border-red-500' : ''} ${ isEditing ? "dark:bg-gray-900" : "cursor-not-allowed bg-transparent "}`}
                                disabled={!isEditing}
                            >
                                <option value="">Pilih Agama</option>
                                {agamaOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Perkawinan */}
                        <div className='col-span-12 md:col-span-4'>
                            <div className="flex items-center">
                                <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <select
                                id="status_perkawinan"
                                {...register("status_perkawinan")}
                                className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${errors.status_perkawinan ? 'border-red-500' : ''} ${ isEditing ? "dark:bg-gray-900" : "cursor-not-allowed bg-transparent "}`}
                                disabled={!isEditing}
                            >
                                <option value="">Pilih Status Perkawinan</option>
                                {statusPerkawinanOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4 ml-6">Alamat : </h1>
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 grid gap-6 mb-6">
                        {/* NIK */}
                        <div className='col-span-12 md:col-span-6'>
                            <div className="flex items-center">
                                <Label htmlFor="nik">NIK</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <Input
                                id="nik"
                                type="text"
                                loading={isFormLoading}
                                {...register("nik")}
                                placeholder='Masukkan NIK (16 digit)'
                                className={`${errors.nik ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                            {errors.nik && <p className='text-red-500 text-sm mt-1'>{errors.nik.message}</p>}
                        </div>

                        {/* No KK */}
                        <div className='col-span-12 md:col-span-6'>
                            <div className="flex items-center">
                                <Label htmlFor="no_kk">No. KK</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <Input
                                id="no_kk"
                                type="text"
                                loading={isFormLoading}
                                {...register("no_kk")}
                                placeholder='Masukkan Nomor Kartu Keluarga'
                                className={`${errors.no_kk ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Alamat KTP */}
                        <div className='col-span-12'>
                            <div className="flex items-center">
                                <Label htmlFor="alamat_ktp">Alamat KTP</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <TextArea
                                id="alamat_ktp"
                                rows={3}
                                {...register("alamat_ktp")}
                                placeholder='Masukkan alamat sesuai KTP'
                                className={`${errors.alamat_ktp ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Alamat Domisili */}
                        <div className='col-span-12'>
                            <div className="flex items-center">
                                <Label htmlFor="alamat_domisili">Alamat Domisili</Label>
                                {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                            </div>
                            <TextArea
                                id="alamat_domisili"
                                rows={3}
                                {...register("alamat_domisili")}
                                placeholder='Masukkan alamat domisili'
                                className={`${errors.alamat_domisili ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4 ml-6">Informasi Pribadi : </h1>

                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 grid gap-6">
                            {/* No. HP */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="no_hp">No. HP</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="no_hp"
                                    type="tel"
                                    loading={isFormLoading}
                                    {...register("no_hp")}
                                    placeholder='Contoh: 081234567890'
                                    className={`${errors.no_hp ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* Email */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="email">Email</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    loading={isFormLoading}
                                    {...register("email")}
                                    placeholder='Contoh: nama@example.com'
                                    className={`${errors.email ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                                {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                            </div>

                            {/* NPWP */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="npwp">NPWP</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="npwp"
                                    type="text"
                                    loading={isFormLoading}
                                    {...register("npwp")}
                                    placeholder='Masukkan NPWP'
                                    className={`${errors.npwp ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* BPJS */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="bpjs">BPJS</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="bpjs"
                                    type="text"
                                    loading={isFormLoading}
                                    {...register("bpjs")}
                                    placeholder='Masukkan nomor BPJS'
                                    className={`${errors.bpjs ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* Nama Bank Gaji */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="nama_bank_gaji">Nama Bank Gaji</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="nama_bank_gaji"
                                    type="text"
                                    loading={isFormLoading}
                                    {...register("nama_bank_gaji")}
                                    placeholder='Contoh: BCA, Mandiri'
                                    className={`${errors.nama_bank_gaji ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* No Rekening */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="no_rekening">No. Rekening</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="no_rekening"
                                    type="text"
                                    loading={isFormLoading}
                                    {...register("no_rekening")}
                                    placeholder='Masukkan nomor rekening'
                                    className={`${errors.no_rekening ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* Nama Pasangan */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="nama_pasangan">Nama Pasangan</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="nama_pasangan"
                                    type="text"
                                    loading={isFormLoading}
                                    {...register("nama_pasangan")}
                                    placeholder='Nama pasangan (jika sudah menikah)'
                                    className={`${errors.nama_pasangan ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* Nama Anak */}
                            <div className='col-span-12 md:col-span-6'>
                                <div className="flex items-center">
                                    <Label htmlFor="nama_anak">Nama Anak</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <Input
                                    id="nama_anak"
                                    type="text"
                                    loading={isFormLoading}
                                    {...register("nama_anak")}
                                    placeholder='Nama anak (jika ada)'
                                    className={`${errors.nama_anak ? 'border-red-500' : ""} ${!isEditing ? "bg-white dark:bg-transparent" : ""}`}
                                disabled={!isEditing}
                                />
                            </div>

                            {/* Status Pekerjaan */}
                            <div className='col-span-12'>
                                <div className="flex items-center">
                                    <Label required htmlFor="status_pekerjaan">Status Pekerjaan</Label>
                                    {(isEditing) ? <p className="ml-3 text-green-600 text-sm font-normal">( Edit mode )</p> : ""}
                                </div>
                                <select
                                    id="status_pekerjaan"
                                    {...register("status_pekerjaan")}
                                    className={`text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700  dark:text-white/90 dark:focus:border-brand-800 w-full h-11 border  border-gray-100 rounded px-3 text-sm ${errors.status_pekerjaan ? 'border-red-500' : ''} ${ isEditing ? "dark:bg-gray-900" : "cursor-not-allowed bg-transparent "}`}
                                disabled={!isEditing}
                                >
                                    <option value="">Pilih Status Pekerjaan</option>
                                    {statusPekerjaanOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {errors.status_pekerjaan && <p className='text-red-500 text-sm mt-1'>{errors.status_pekerjaan.message}</p>}
                            </div>


                            {/* Action Buttons */}
                            {isEditing && (
                            <div className="col-span-12 flex justify-end">
                                <Button
                                    btntype="button"
                                    size="sm"
                                    className="w-auto bg-gray-300 hover:bg-gray-800 mr-3 text-gray-800 hover:text-white"
                                    onClick={() => {
                                        // reset()
                                        setIsEditing(false)
                                    }} // Reset form on cancel
                                >
                                    Batalkan
                                </Button>
                                <Button
                                    btntype="submit"
                                    size="sm"
                                    className={`w-auto ${isFormLoading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                                    disabled={isFormLoading}
                                >
                                    {isFormLoading ? "Memproses..." : "Update Profile"}
                                    {isFormLoading ? (
                                        <AiOutlineLoading3Quarters className="inline-block animate-spin ml-2" />
                                    ) : (
                                        <HiMiniPaperAirplane className="inline-block ml-2" />
                                    )}
                                </Button>
                            </div>
                            )}
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}