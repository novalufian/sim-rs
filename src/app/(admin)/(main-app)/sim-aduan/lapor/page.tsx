"use client"
import ComponentCard from '@/components/common/ComponentCard'
import PathBreadcrumb from '@/components/common/PathBreadcrumb'
import LaporForm from '@/components/form/(main-app)/lapor/page'
import React from 'react'

function page() {

    return (
        <div className='w-full grid grid-cols-12 gap-2 items-start'>
            <div className="col-span-12">
            <PathBreadcrumb />
            </div>

            <LaporForm />
            <ComponentCard title='Check list inputan :'  className="col-span-4 bg-white sticky top-20 h-fit">
                <ul className='list-decimal w-9/12 m-auto gap-1 text-gray-700'>
                <li><strong>Klasifikasi Laporan:</strong> Pilih salah satu: <em>Aduan</em>, <em>Aspirasi</em>, atau <em>Permintaan Informasi</em>.</li>
                <li><strong>Judul:</strong> Gunakan tata bahasa <em>singkat dan jelas</em> sesuai pokok masalah. Contoh: Jalan Berlubang di RT 03.</li>
                <li><strong>Prioritas:</strong> Tentukan tingkat urgensi: <em>Low</em>, <em>Medium</em>, atau <em>High</em>.</li>
                <li><strong>Bidang yang Dituju:</strong> Pilih instansi atau OPD terkait. <strong>Wajib diisi.</strong></li>
                <li><strong>Jenis Permasalahan:</strong> Pilih jenis masalah dari daftar skrining yang tersedia.</li>
                <li><strong>Sumber Media:</strong> Pilih dari: <em>Aplikasi</em>, <em>Media Sosial</em>, <em>Humas</em>, <em>WhatsApp</em>, <em>SP4N LAPOR</em>, atau <em>Tatap Muka</em>.</li>
                <li><strong>Tanggal Pelaporan:</strong> Isi tanggal kejadian atau pelaporan. Format: <code>YYYY-MM-DD</code>.</li>
                <li><strong>Isi Laporan / Uraian:</strong> Jelaskan secara <em>detail</em> kronologi dan keluhan. Hindari penjelasan yang terlalu umum.</li>
                <li><strong>NIK:</strong> Masukkan 16 digit nomor sesuai dengan KTP.</li>
                <li><strong>Nama Lengkap:</strong> Isi nama sesuai KTP.</li>
                <li><strong>Alamat:</strong> Masukkan alamat lengkap minimal 10 karakter.</li>
                <li><strong>Email:</strong> Masukkan alamat email aktif dan valid (contoh: email@example.com).</li>
                <li><strong>No. HP:</strong> Masukkan nomor HP yang dapat dihubungi, contoh: 08xxxxxxxxxx.</li>
                <li><strong>File Pendukung:</strong> Unggah dokumen, foto, atau bukti lainnya (opsional).</li>

                </ul>
            </ComponentCard>
        </div>
    )
}

export default page
