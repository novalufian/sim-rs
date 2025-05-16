// LaporForm.tsx"use client";
"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
// import DropzoneComponent from '@/components/form/form-elements/DropZone';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import DatePicker from 'react-flatpickr';

import { HiMiniPaperAirplane } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePostAduan , useUpdateAduan, useAduanId} from '@/hooks/fetch/useAduan';
import { useBidang , useSkriningMasalah} from '@/hooks/fetch/openapi/useApi';
import DefaultModal from '@/components/modals/defaultModal';


export const aduanSchema = z.object({
    klasifikasi: z.string().min(1, "Klasifikasi wajib diisi"),
    media: z.string().min(1, "Media wajib diisi"),
    judul: z.string().min(1, "Judul wajib diisi"),
    uraian: z.string().min(1, "Uraian wajib diisi"),
    tanggal_pelaporan: z.string().datetime("Format tanggal pelaporan tidak valid"),
    nik: z.string().min(16, "NIK minimal 16 karakter"),
    nama: z.string().min(1, "nama wajib diisi"),
    alamat: z.string().min(10, "alamat wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    no_hp: z.string().min(1, "Jaminan wajib diisi"),
    priority: z.enum(["LOW", "MEDIUM", "HIGHT"], {
        required_error: "Prioritas wajib diisi",
    }),
    tindak_lanjut_id: z.string().min(1, "Tindak lanjut wajib diisi"),
    skirining_masalah_id: z.string().min(1, "jenis masalah wajib diisi"),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"], {
        required_error: "Status wajib diisi",
    }),
    created_by: z.string().min(1, "Pembuat wajib diisi"),
})


const optionsKlasifiaksi = [
    { label: "Aduan", value: "PENGADUAN" },
    { label: "Aspirasi", value: "ASPIRASI" },
    { label: "Permintaan Informasi", value: "PERMINTAAN_INFORMASI" }
];

const optionPriority = [
    { value: "HIGHT", label: "Hight" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
];

const optionsMedia = [
    { value: "APLIKASI", label: "Aplikasi" },
    { value: "MEDIA_SOSIAL", label: "Media Sosial" },
    { value: "HUMAS", label: "Humas" },
    { value: "WHATSAPP", label: "Whatsapp" },
    { value: "SP4N_LAPOR", label: "SP4N Lapor" },
    { value: "TATAP_MUKA", label: "Tatap Muka" },
];

export default function LaporForm() {
    const params = useParams();
    const id = params?.id as string;

    // hook
    const { mutate: postAduan, status, isPending, isSuccess, isError  } = usePostAduan();
    const {mutate : updateAduan, isPending : updatePending, isError : updateError, isSuccess : updateSuccess} = useUpdateAduan();
    const { data: bidang , isLoading : useBidangLoading} = useBidang();
    const { data: laporData, isLoading : useLaporLoading} = useAduanId(id ?? "");
    const { data: skriningMasalah , isLoading : useSkriningMasalahLoading} = useSkriningMasalah();

    const bidangList = bidang?.data?.bidangTindakLanjut ?? [];
    const skriningMasalahList = skriningMasalah?.data?.skriningMasalah ?? [];

    const [lapor, setLapor] = useState<any>(null);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(aduanSchema),
        defaultValues: {
        klasifikasi: "PENGADUAN",
        status : "OPEN",
        created_by: "uuid-current-user",
        },
    });

    const [selectedKlasifikasi, setSelectedKlasifikasi] = useState("PENGADUAN");
    const [openModal, setOpenModal] = useState(false);

    const handleKlasifikasiChange = (value: string) => {
        setSelectedKlasifikasi(value);
        setValue("klasifikasi", value);
    };

    const onSubmit = (data: any) => {
        if(params.id){
            const updateDate ={
                id : id.toString(),
                formData : data
            }
            updateAduan(updateDate);
        }else{
            postAduan(data);
        }
        // postAduan(data);
    };

    // Handle success or error
    const onerror = (err : any) => {
        console.log(err)
    }


    useEffect(() => {
        if (isSuccess || updateSuccess) {
            setOpenModal(true);
            reset({
                klasifikasi: "PENGADUAN",
                status : "OPEN",
                created_by: "uuid-current-user",
            });
            setSelectedKlasifikasi("PENGADUAN");
        }
    }
    , [isSuccess, updateSuccess]);

    useEffect(() => {
        if(laporData){
            // setValue("id", id);
            setLapor(laporData.data);
            setSelectedKlasifikasi(laporData.data.klasifikasi);
            setValue("judul", laporData.data.judul);
            setValue("uraian", laporData.data.uraian);
            setValue("tanggal_pelaporan",new Date(laporData.data.tanggal_pelaporan.split("T")[0]).toISOString().slice(0, 10));
            setValue("nik", laporData.data.nik);
            setValue("nama", laporData.data.nama);
            setValue("alamat", laporData.data.alamat);
            setValue("email", laporData.data.email || ""); // Handle null email
            setValue("no_hp", laporData.data.no_hp);
            setValue("priority", laporData.data.priority);
            setValue("tindak_lanjut_id", laporData.data.tindak_lanjut_id);
            setValue("skirining_masalah_id", laporData.data.skirining_masalah_id);
            setValue("media", laporData.data.media);
            setSelectedKlasifikasi(laporData.data.klasifikasi);
        }
    }, [laporData]);

    return (
        <ComponentCard title='Form aduan' className='col-span-8 text-base'>

        <form onSubmit={handleSubmit(onSubmit, onerror)}>
            <div className="space-y-1 w-full">
            <Label required>Pilih Klasifikasi Laporan</Label>
            <div className="grid grid-cols-3 border border-red-500 rounded-sm overflow-hidden w-full">
                {optionsKlasifiaksi.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`col-span-1 px-4 py-4 text-sm font-semibold uppercase transition-all duration-200
                    ${selectedKlasifikasi === option.value ? 'bg-red-600 text-white' : 'text-red-600 bg-white hover:bg-red-100 dark:bg-white/[0.03] dark:hover:bg-red-100'}`}
                    onClick={() => handleKlasifikasiChange(option.value)}
                >
                    {selectedKlasifikasi === option.value && "✔ "}
                    {option.label}
                </button>
                ))}
            </div>
            </div>

            <div className="w-full space-y-6 grid grid-cols-12 gap-4 mt-4">
            <div className='col-span-12'>
                <Label required>Judul Laporan</Label>
                <Input {...register("judul")} placeholder='Laporan...' className={`${errors.judul ? 'border-red-500': ""}`} />
                {errors.judul && <p className='text-red-500 mt-1'>{errors.judul.message}</p>}
            </div>

            <div className='col-span-4'>
                <Label required>Set Priority</Label>
                <select {...register("priority")}
                className="w-full h-11 border rounded px-3 text-sm">
                <option value="">Pilih Priority</option>
                {optionPriority.map(opt => (
                    <option key={opt.value} value={opt.value} >{opt.label}</option>
                ))}
                </select>
                {errors.priority && <p className='text-red-500'>{errors.priority.message}</p>}
            </div>

            <div className='col-span-4'>
                <Label required>Bidang yang dituju</Label>
                <select {...register("tindak_lanjut_id")}
                className="w-full h-11 border rounded px-3 text-sm" disabled={useBidangLoading}>
                <option value="">Pilih bidang</option>
                {bidangList.map((opt : any) => (
                    <option key={opt.id} value={opt.id} >{opt.nama}</option>
                ))}
                </select>
                {errors.tindak_lanjut_id && <p className='text-red-500'>{errors.tindak_lanjut_id.message}</p>}
            </div>

            <div className='col-span-4'>
                <Label required>Jenis Permasalahan</Label>
                <select {...register("skirining_masalah_id")}
                className="w-full h-11 border rounded px-3 text-sm" disabled={useSkriningMasalahLoading}>
                <option value="">- masalah - </option>
                {skriningMasalahList.map((opt : any) => (
                    <option key={opt.id} value={opt.id}>{opt.nama}</option>
                ))}
                </select>
                {errors.skirining_masalah_id && <p className='text-red-500'>{errors.skirining_masalah_id.message}</p>}
            </div>

            <div className='col-span-4'>
                <Label required>Sumber Media</Label>
                <select {...register("media")}
                className="w-full h-11 border rounded px-3 text-sm">
                <option value="">Pilih media</option>
                {optionsMedia.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                </select>
                {errors.media && <p className='text-red-500'>{errors.media.message}</p>}
            </div>

            <div className='col-span-4'>
                <Label required>Tanggal Aduan</Label>
                <Controller
                    control={control}
                    name="tanggal_pelaporan"
                    render={({ field: { onChange, value, name, ref } }) => (
                        <DatePicker
                        value={ value && typeof value === "string" ? [new Date(value)] : []}
                        onChange={(selectedDates) => {
                            console.log(selectedDates)
                            const date = selectedDates?.[0];
                            if (date) onChange(date.toISOString()); // convert back to string
                        }}
                        options={{ dateFormat: "Y-m-d" }}
                        className={`w-full h-11 border rounded px-3 text-sm ${errors.tanggal_pelaporan ? 'border-red-500' : ''}`}
                        name={name}
                        ref={ref}
                        />
                    )}
                    />
                    {errors.tanggal_pelaporan && (
                        <p className="text-red-500 text-sm mt-1">{errors.tanggal_pelaporan.message}</p>
                    )}
            </div>

            <div className='col-span-12'>
                <Label required>Isi Laporan</Label>
                <TextArea rows={6} {...register("uraian")}/>
                {errors.uraian && <p className='text-red-500'>{errors.uraian.message}</p>}
            </div>

            <div className='col-span-6'>
                <Label required>NIK</Label>
                <Input type="number" {...register("nik")} placeholder='Isi sesuai KTP' />
                {errors.nik && <p className='text-red-500'>{errors.nik.message}</p>}
            </div>

            <div className='col-span-6'>
                <Label required>Nama Lengkap</Label>
                <Input type="text" {...register("nama")} placeholder='Isi sesuai KTP' />
                {errors.nama && <p className='text-red-500'>{errors.nama.message}</p>}
            </div>

            <div className='col-span-12'>
                <Label required>Alamat</Label>
                <TextArea rows={3} {...register("alamat")} />
                {errors.alamat && <p className='text-red-500'>{errors.alamat.message}</p>}
            </div>

            <div className='col-span-6'>
                <Label required>Email</Label>
                <Input type="email" {...register("email")} placeholder='emailkamu@gmail.com' />
                {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
            </div>

            <div className='col-span-6'>
                <Label required>No. HP</Label>
                <Input type="tel" {...register("no_hp")} placeholder='08xxxxxxxxxx' />
                {errors.no_hp && <p className='text-red-500'>{errors.no_hp.message}</p>}
            </div>

            {/* <div className='col-span-12'>
                <DropzoneComponent />
            </div> */}
            {errors.status && <p className='text-red-500'>{errors.status.message}</p>}
            <div className="col-span-12 flex justify-end">
                <Button btntype="button" size="sm" className="w-auto bg-gray-300 hover:bg-gray-800 mr-3 text-gray-800 hover:text-white">
                Batalkan
                </Button>
                <Button btntype="submit" size="sm" className={`w-auto ${isPending ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} text-white`} >
                {isPending ? "Mengirim..." : "Kirim Laporan"}
                <HiMiniPaperAirplane className={`${!isPending ? "inline-block": "hidden"}`}/>
                <AiOutlineLoading3Quarters className={`animate-spin ${isPending ? "inline-block" : "hidden"}`} />
                </Button>
            </div>
            </div>
        </form>
        <DefaultModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
        />
        </ComponentCard>
    );
}
