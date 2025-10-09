'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePegawaiAndUser } from '@/hooks/fetch/pegawai/usePegawai'
import toast from 'react-hot-toast'

interface FormData {
    nip: string
}

export default function PegawaiInitForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
    const { mutate: createPegawai, isPending : isLoading } = useCreatePegawaiAndUser()
    const [loading, setLoading] = useState(false)
    
    const onSubmit = (data: FormData) => {
        setLoading(true)
        createPegawai(
            { data: { nip: data.nip } }, // kirim data ke hook
            {
                onSuccess: () => {
                    toast.success('Pegawai & user berhasil dibuat!', { position: 'bottom-right' })
                    reset() // reset form
                    // delay 1 detik untuk loading
                    setTimeout(() => setLoading(false), 1000)
                },
                onError: (err: any) => {
                    console.error(err)
                    toast.error('Gagal membuat pegawai!', { position: 'bottom-right' })
                    setLoading(false)
                },
            }
        )
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl  space-y-4">
        
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NIP Pegawai</label>
        <input
        {...register('nip', { required: 'NIP wajib diisi' })}
        type="text"
        placeholder="Masukkan NIP"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.nip && <p className="text-red-500 text-sm mt-1">{errors.nip.message}</p>}
        </div>
        
        <button
        type="submit"
        disabled={loading || isLoading}
        className={`w-full py-3 rounded-lg text-white ${loading || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
        >
        {loading || isLoading ? 'Menyimpan...' : 'Buat Pegawai'}
        </button>
        </form>
    )
}
