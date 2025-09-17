"use client";
import React, { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdatePegawai } from '@/hooks/fetch/pegawai/usePegawai';
import { useUploadPegawaiPhoto } from '@/hooks/fetch/usePegawaiPhoto';
import { useDropzone } from 'react-dropzone';

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
    no_kk: {
        masked: string;
        unmasked: string;
    };
    no_rekening: {
        masked: string;
        unmasked: string;
    };
    no_hp: {
        masked: string;
        unmasked: string;
    };
    email: string;
    tmt_pangkat: string | null;
    tmt_jabatan: string | null;
    is_deleted: boolean;
}

interface PegawaiFormProps {
    data: PegawaiData;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function PegawaiForm({ data, onSubmit, onCancel }: PegawaiFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
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
            no_kk: data.no_kk.unmasked,
            no_rekening: data.no_rekening.unmasked,
            no_hp: data.no_hp.unmasked,
            tmt_pangkat: data.tmt_pangkat ? new Date(data.tmt_pangkat).toISOString().split('T')[0] : '',
            tmt_jabatan: data.tmt_jabatan ? new Date(data.tmt_jabatan).toISOString().split('T')[0] : '',
        }
    });
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const updatePegawai = useUpdatePegawai();
    const uploadPhoto = useUploadPegawaiPhoto();
    
    const previewUrl = useMemo(() => {
        if (selectedFile) return URL.createObjectURL(selectedFile);
        return data.avatar_url || '';
    }, [selectedFile, data.avatar_url]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    const onDrop = useCallback((accepted: File[]) => {
        if (accepted?.[0]) setSelectedFile(accepted[0]);
    }, []);
    
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'image/*': [] },
        maxSize: 5 * 1024 * 1024,
        noClick: true,           // prevent auto open on root click
        noKeyboard: true,        // avoid keyboard focusing opening dialog
    });
    
    const onFormSubmit = async (formData: any) => {
        // Update Pegawai basic data first
        const payload = { ...formData };
        try {
            await updatePegawai.mutateAsync({ id: data.id_pegawai || data.id, formData: payload });
            // Then upload photo if selected
            if (selectedFile) {
                await uploadPhoto.mutateAsync({ id_pegawai: data.id_pegawai || data.id, file: selectedFile });
            }
            onSubmit({ ...formData, avatar: selectedFile });
        } catch (err) {
            // Let caller handle notifications if needed
        }
    };
    
    return (
        <div className="w-full mx-auto p-6">
            <form onSubmit={handleSubmit(onFormSubmit)} className=" grid grid-cols-12 gap-2 relative auto-rows-auto">

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 col-span-8">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path 
                                    fillRule="evenodd" 
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Edit Data Pegawai
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Update informasi pegawai dengan data terbaru
                            </p>
                        </div>
                    </div>
                    
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                {...register('nama', { required: 'Nama wajib diisi' })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nama.message}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                NIP
                            </label>
                            <input
                                {...register('nip', { required: 'NIP wajib diisi' })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan NIP"
                            />
                            {errors.nip && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nip.message}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tempat Lahir
                            </label>
                            <input
                                {...register('tempat_lahir')}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan tempat lahir"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tanggal Lahir
                            </label>
                            <input
                                {...register('tanggal_lahir')}
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Jenis Kelamin
                            </label>
                            <select
                                {...register('jenis_kelamin')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            >
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Agama
                            </label>
                            <select
                                {...register('agama')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            >
                                <option value="Islam">Islam</option>
                                <option value="Kristen">Kristen</option>
                                <option value="Katolik">Katolik</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddha">Buddha</option>
                                <option value="Konghucu">Konghucu</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status Perkawinan
                            </label>
                            <select
                                {...register('status_perkawinan')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            >
                                <option value="Belum Kawin">Belum Kawin</option>
                                <option value="Kawin">Kawin</option>
                                <option value="Cerai Hidup">Cerai Hidup</option>
                                <option value="Cerai Mati">Cerai Mati</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status Pekerjaan
                            </label>
                            <select
                                {...register('status_pekerjaan')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            >
                                <option value="PNS">PNS</option>
                                <option value="Kontrak">Kontrak</option>
                                <option value="Honorer">Honorer</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                {...register('email', { 
                                    required: 'Email wajib diisi',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Format email tidak valid'
                                    }
                                })}
                                type="email"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                No. HP
                            </label>
                            <input
                                {...register('no_hp')}
                                type="tel"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan nomor HP"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                No. KK
                            </label>
                            <input
                                {...register('no_kk')}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan nomor KK"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                No. Rekening
                            </label>
                            <input
                                {...register('no_rekening')}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan nomor rekening"
                            />
                        </div>
                    </div>
                    
                    {/* Address Information */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Alamat KTP
                            </label>
                            <textarea
                                {...register('alamat_ktp')}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan alamat sesuai KTP"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Alamat Domisili
                            </label>
                            <textarea
                                {...register('alamat_domisili')}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                placeholder="Masukkan alamat domisili"
                            />
                        </div>
                    </div>
                    
                    {/* Employment Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                TMT Pangkat
                            </label>
                            <input
                                {...register('tmt_pangkat')}
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                TMT Jabatan
                            </label>
                            <input
                                {...register('tmt_jabatan')}
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>
                    
                    
                    
                    
                </div>

                {/* File Upload */}
                <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 col-span-4 sticky top-0 z-10 '>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                        Upload Photo
                    </h2>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed ${
                            isDragActive 
                                ? 'border-blue-400 bg-blue-50/40 dark:bg-blue-900/20' 
                                : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg p-4 sm:p-6 text-center cursor-pointer`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-3">
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="w-2/3 min-h-24 rounded-lg object-cover" 
                                />
                            ) : (
                                <svg 
                                    className="w-12 h-12 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                    />
                                </svg>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                                {isDragActive 
                                    ? 'Drop the image here...' 
                                    : 'Drag & drop image here or'
                                }
                            </p>
                            <button
                                type="button"
                                onClick={open}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Browse files
                            </button>
                            {selectedFile && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Selected: {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col justify-end space-y-2 pt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Reset Data
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}