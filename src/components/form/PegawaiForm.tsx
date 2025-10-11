"use client";
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useUploadPegawaiPhoto } from '@/hooks/fetch/pegawai/usePegawaiPhoto';
import { useDropzone } from 'react-dropzone';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { env } from 'process';

    const pegawaiSchema = z.object({
        nama: z.string().min(1, "wajib diisi"),
        nip: z.string().min(1, "wajib diisi"),
        tempat_lahir: z.string().min(1, "wajib diisi"),
        tanggal_lahir: z.string().min(1, "wajib diisi"),
        jenis_kelamin: z.string().min(1, "wajib diisi"),
        agama: z.string().min(1, "wajib diisi"),
        status_perkawinan: z.string().min(1, "wajib diisi"),
        status_pekerjaan: z.string().min(1, "wajib diisi"),
        alamat_ktp: z.string().min(1, "wajib diisi"),
        alamat_domisili: z.string().min(1, "wajib diisi"),
        no_hp: z.string().min(1, "wajib diisi "),
        email: z.string().min(1, "wajib diisi"),
        avatar_url: z.string().min(1, "wajib diisi"),
    });

    interface PegawaiData {
    id: string;
    id_pegawai: string;
    nama: string;
    nip: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    umur: number | null;
    jenis_kelamin: string;
    agama: string;
    status_perkawinan: string;
    status_pekerjaan: string;
    alamat_ktp: string;
    alamat_domisili: string;
    avatar_url: string;
    no_hp: { masked: string; unmasked: string };
    email: string;
    is_deleted: boolean;
    }

    interface PegawaiFormProps {
    data: PegawaiData;
    onCancel: () => void;
    isLoading: boolean;
    }

    export default function PegawaiForm({ data, onCancel, isLoading }: PegawaiFormProps) {
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm({
        resolver: zodResolver(pegawaiSchema),
        reValidateMode: "onBlur",
        mode: "onBlur",
        defaultValues: {
        // id: data.id,
            nama: data.nama,
            nip: data.nip,
            tempat_lahir: data.tempat_lahir,
            tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir).toISOString().split('T')[0] : '',
            jenis_kelamin: data.jenis_kelamin,
            agama: data.agama,
            status_perkawinan: data.status_perkawinan,
            status_pekerjaan: data.status_pekerjaan,
            alamat_ktp: data.alamat_ktp,
            alamat_domisili: data.alamat_domisili,
            email: data.email,
            no_hp: data.no_hp?.unmasked || '',
            avatar_url : data.avatar_url || '',
        }
    });

    // Update form when data changes
    React.useEffect(() => {
        reset({
        // id: data.id,
        nama: data.nama,
        nip: data.nip,
        tempat_lahir: data.tempat_lahir,
        tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir).toISOString().split('T')[0] : '',
        jenis_kelamin: data.jenis_kelamin,
        agama: data.agama,
        status_perkawinan: data.status_perkawinan,
        status_pekerjaan: data.status_pekerjaan,
        alamat_ktp: data.alamat_ktp,
        alamat_domisili: data.alamat_domisili,
        email: data.email,
        no_hp: data.no_hp?.unmasked || '',
        avatar_url : data.avatar_url || '',
        });
    }, [data, reset]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // const updatePegawai = useUpdatePegawai();
    const { mutate: updatePegawai, isPending : isLoadingUpdate,  isError : errorOnSubmit, error : errorMessage, isSuccess } = useUpdatePegawai()
    const uploadPhoto= useUploadPegawaiPhoto();
    const isFormLoading = isLoadingUpdate || isLoading   ;


    const previewUrl = useMemo(() => selectedFile ? URL.createObjectURL(selectedFile) : data.avatar_url || '', [selectedFile, data.avatar_url]);

    const onDrop = useCallback((accepted: File[]) => {
        if (accepted?.[0]) setSelectedFile(accepted[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'image/*': [] },
        maxSize: 5 * 1024 * 1024,
        noClick: true,
        noKeyboard: true,
    });

    const onFormSubmit = async (formData: any) => {
        try {
            let avatarUrl = data.avatar_url.split('3001')[1] || data.avatar_url; // default lama
        
            if (selectedFile) {
                const resUploadPhoto = await uploadPhoto.mutateAsync({
                id_pegawai: data.id_pegawai || data.id,
                file: selectedFile,
                });
                avatarUrl = resUploadPhoto.data.file_url;
            }
        
            const payload = { 
                ...formData, 
                id: data.id, 
                avatar_url: avatarUrl, // ✅ masukkan ke payload update
            };

            console.log(payload)
        
            await updatePegawai({ 
                id: data.id_pegawai || data.id, 
                formData: payload 
            });
        
            // onSubmit(payload); // update state dengan data yang sudah fix
        } catch (err) {
        console.error(err);
        }
    };

    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-0 focus:border-gray-300";

    useEffect(() => {
        if(errorOnSubmit){
            console.log(errorOnSubmit)
        }

        if(errorMessage){
            console.log(errorMessage.response.data.data)
        }

        if(isSuccess){
            console.log(isSuccess)
        }
    },[errorOnSubmit, errorMessage, isSuccess, uploadPhoto.isError, uploadPhoto.error, uploadPhoto.isSuccess])

    return (
        <div className={`w-full mx-auto p-6  relative ${isFormLoading ? ' opacity-50' : ''}`}>
            {isFormLoading && (<div className='absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed'></div>)}
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-12 gap-2 relative auto-rows-auto ">

            {/* Left Panel: Form Fields */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 col-span-8">
            {/* Header */}
            <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                </div>
                <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Data Pegawai</h2>
                <p className="text-gray-600 dark:text-gray-400">Update informasi pegawai dengan data terbaru</p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opa">
                <div>
                    <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Nama Lengkap <p className="text-red-500 text-sm mt-1">{errors.nama && errors.nama.message ? `${errors.nama.message}` : ""}</p></label>
                    <input {...register('nama', { required: 'wajib diisi' })} type="text" className={inputClass + " " + (errors.nama ? 'border-red-500' : "")} placeholder="Masukkan nama lengkap" disabled={isFormLoading} />
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">NIP <p className="text-red-500 text-sm mt-1">{errors.nip && errors.nip.message ? `${errors.nip.message}` : ""}</p></label>
                <input {...register('nip', { required: 'wajib diisi' })} type="text" className={inputClass + " " + (errors.nip ? 'border-red-500' : "")} placeholder="Masukkan NIP" disabled={isFormLoading} />
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Tempat Lahir <p className="text-red-500 text-sm mt-1">{errors.tempat_lahir && errors.tempat_lahir.message ? `${errors.tempat_lahir.message}` : ""}</p></label>
                <input {...register('tempat_lahir')} type="text" className={inputClass + " " + (errors.tempat_lahir ? 'border-red-500' : "")} placeholder="Masukkan tempat lahir" disabled={isFormLoading} />
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Tanggal Lahir <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir && errors.tanggal_lahir.message ? `${errors.tanggal_lahir.message}` : ""}</p></label>
                <input {...register('tanggal_lahir')} type="date" className={inputClass + " " + (errors.tanggal_lahir ? 'border-red-500' : "")} disabled={isFormLoading} />
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Jenis Kelamin <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin && errors.jenis_kelamin.message ? `${errors.jenis_kelamin.message}` : ""}</p></label>
                <select {...register('jenis_kelamin')} className={inputClass + " " + (errors.jenis_kelamin ? 'border-red-500' : "")} disabled={isFormLoading}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Agama <p className="text-red-500 text-sm mt-1">{errors.agama && errors.agama.message ? `${errors.agama.message}` : ""}</p></label>
                <select {...register('agama')} className={inputClass + " " + (errors.agama ? 'border-red-500' : "")} disabled={isFormLoading}>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                </select>
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Status Perkawinan <p className="text-red-500 text-sm mt-1">{errors.status_perkawinan && errors.status_perkawinan.message ? `${errors.status_perkawinan.message}` : ""}</p></label>
                <select {...register('status_perkawinan')} className={inputClass + " " + (errors.status_perkawinan ? 'border-red-500' : "")} disabled={isFormLoading}>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                </select>
                </div>

                <div>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Status Pekerjaan <p className="text-red-500 text-sm mt-1">{errors.status_pekerjaan && errors.status_pekerjaan.message ? `${errors.status_pekerjaan.message}` : ""}</p></label>
                <select {...register('status_pekerjaan')} className={inputClass + " " + (errors.status_pekerjaan ? 'border-red-500' : "")} disabled={isFormLoading}>
                    <option value="PNS">PNS</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Honorer">Honorer</option>
                </select>
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Email <p className="text-red-500 text-sm mt-1">{errors.email && errors.email.message ? `${errors.email.message}` : ""}</p></label>
                <input {...register('email', { 
                    required: 'wajib diisi',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Format email tidak valid' }
                })} type="email" className={inputClass + " " + (errors.email ? 'border-red-500' : "")} placeholder="Masukkan email" disabled={isFormLoading} />
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">No. HP <p className="text-red-500 text-sm mt-1">{errors.no_hp && errors.no_hp.message ? `${errors.no_hp.message}` : ""}</p></label>
                <input 
                    {...register('no_hp', { required: 'wajib diisi' })} 
                    type="tel" 
                    className={inputClass + " " + (errors.no_hp ? 'border-red-500' : "")} placeholder="Masukkan nomor HP" disabled={isFormLoading} />
                </div>

            </div>

            {/* Address */}
            <div className="space-y-6 mt-6">
                <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Alamat KTP <p className="text-red-500 text-sm mt-1">{errors.alamat_ktp && errors.alamat_ktp.message ? `${errors.alamat_ktp.message}` : ""}</p></label>
                <textarea {...register('alamat_ktp', { required: 'wajib diisi' })} rows={3} className={inputClass + " " + (errors.alamat_ktp ? 'border-red-500' : "")} placeholder="Masukkan alamat sesuai KTP" disabled={isFormLoading} />
                </div>
                <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">Alamat Domisili <p className="text-red-500 text-sm mt-1">{errors.alamat_domisili && errors.alamat_domisili.message ? `${errors.alamat_domisili.message}` : ""}</p></label>
                <textarea {...register('alamat_domisili', { required: 'wajib diisi' })} rows={3} className={inputClass + " " + (errors.alamat_domisili ? 'border-red-500' : "")} placeholder="Masukkan alamat domisili" disabled={isFormLoading} />
                </div>
            </div>

            </div>

            {/* Right Panel: Upload */}
            <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 col-span-4 sticky top-0 z-5'>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Upload Photo</h2>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer ${isDragActive ? 'border-blue-400 bg-blue-50/40 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} ${isFormLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                {previewUrl ? <img src={previewUrl} alt="Preview" className="w-2/3 min-h-24 rounded-lg object-cover" /> : <p className="text-gray-600 dark:text-gray-400">Drag & drop image here or browse</p>}
                <button type="button" onClick={open} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" disabled={isLoading}>Browse files</button>
                {selectedFile && <p className="text-sm text-green-600 dark:text-green-400">Selected: {selectedFile.name}</p>}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end space-y-2 pt-6">
                <button type="button" onClick={onCancel} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" disabled={isLoading}>Cancel</button>
                <button type="button" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" disabled={isLoading}>Reset Data</button>
                <button type="submit" className={`px-6 py-3 rounded-lg transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            </div>
        </form>
        </div>
    );
}
