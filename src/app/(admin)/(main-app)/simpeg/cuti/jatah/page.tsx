"use client";
import React, { useState, useEffect } from "react";
import Pagination from "@/components/tables/Pagination";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import { useCutiJatah, CutiJatahFilters, CutiJatahItem, useUpdateCutiJatah, useAutoGenerateJatahCuti, AutoGenerateJatahCutiInput } from "@/hooks/fetch/cuti/useCutiJatah";
import { usePegawai, Pegawai } from "@/hooks/fetch/pegawai/usePegawai";
import GeneratingPage from "@/components/loading/GeneratingPage";
import { BsCloudSlash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { IoAddCircleSharp } from "react-icons/io5";
import LeftDrawer from "@/components/drawer/leftDrawer";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ITEMS_PER_PAGE = 10;

// Generate tahun options (5 tahun ke belakang dan 5 tahun ke depan dari tahun saat ini)
const generateTahunOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push(i);
    }
    return years;
};

// Schema untuk form edit jatah cuti
const jatahCutiEditSchema = z.object({
    jumlah_jatah: z.number().min(0, "Jumlah jatah harus lebih dari atau sama dengan 0"),
});

type JatahCutiEditFormValues = z.infer<typeof jatahCutiEditSchema>;

// Schema untuk form auto-generate
const autoGenerateSchema = z.object({
    tahun: z.number().min(2000, "Tahun harus valid").max(2100, "Tahun harus valid"),
    jumlah_jatah: z.number().min(0, "Jumlah jatah harus lebih dari atau sama dengan 0"),
});

type AutoGenerateFormValues = z.infer<typeof autoGenerateSchema>;

function Page() {
    const currentYear = new Date().getFullYear();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTahun, setSelectedTahun] = useState<number>(currentYear);
    const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CutiJatahItem | null>(null);
    const [isAutoGenerateModalOpen, setIsAutoGenerateModalOpen] = useState(false);
    
    const updateMutation = useUpdateCutiJatah();
    const autoGenerateMutation = useAutoGenerateJatahCuti();

    // Fetch list pegawai untuk dropdown filter
    const { data: pegawaiData } = usePegawai({ 
        limit: 1000, // Ambil semua pegawai untuk dropdown
        page: 1 
    });

    // Filters untuk jatah cuti
    const filters: CutiJatahFilters = {
        tahun: selectedTahun,
        id_pegawai: selectedPegawaiId || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
    };

    // Fetch jatah cuti data
    const { data: jatahCutiData, isLoading, isError } = useCutiJatah(filters);

    // Extract data
    const jatahCutiList: CutiJatahItem[] = jatahCutiData?.data?.items || [];
    const totalItems = jatahCutiData?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    // Extract pegawai list untuk dropdown
    const pegawaiList = pegawaiData?.data?.pegawai || [];

    const handleTahunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTahun(Number(e.target.value));
        setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
    };

    const handlePegawaiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPegawaiId(e.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEditClick = (item: CutiJatahItem) => {
        setSelectedItem(item);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    // Check if tahun is in the past
    const isTahunPast = (tahun: number): boolean => {
        return tahun < currentYear;
    };

    if (isLoading) {
        return <GeneratingPage />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                <BsCloudSlash className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Terjadi kesalahan saat memuat data jatah cuti</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <PathBreadcrumb defaultTitle="Jatah Cuti" />

            {/* Header with Auto Generate Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jatah Cuti</h1>
                <button
                    onClick={() => setIsAutoGenerateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    <IoAddCircleSharp className="w-5 h-5 mr-2" />
                    Auto Generate
                </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Filter Tahun */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tahun
                        </label>
                        <select
                            value={selectedTahun}
                            onChange={handleTahunChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        >
                            {generateTahunOptions().map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Pegawai */}
                    <div className="flex-1 min-w-[300px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pegawai
                        </label>
                        <select
                            value={selectedPegawaiId}
                            onChange={handlePegawaiChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">Semua Pegawai</option>
                            {pegawaiList.map((pegawai: Pegawai) => (
                                <option key={pegawai.id_pegawai} value={pegawai.id_pegawai}>
                                    {pegawai.nip} - {pegawai.nama}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Tahun
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    NIP
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Nama Pegawai
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Jenis Kelamin
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Jatah Cuti
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Sisa Jatah
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {jatahCutiList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        Tidak ada data jatah cuti
                                    </td>
                                </tr>
                            ) : (
                                jatahCutiList.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {item.tahun}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {item.pegawai_nip || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {item.pegawai_nama || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {item.pegawai_jenis_kelamin || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white text-right">
                                            {item.jumlah_jatah}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                            {item.sisa_jatah}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <FiEdit className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Edit Form Drawer */}
            <LeftDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title="Edit Jatah Cuti"
                width="600px"
            >
                {selectedItem && <EditJatahCutiForm item={selectedItem} onSuccess={handleCloseDrawer} onCancel={handleCloseDrawer} />}
            </LeftDrawer>

            {/* Auto Generate Modal */}
            <Modal
                isOpen={isAutoGenerateModalOpen}
                onClose={() => setIsAutoGenerateModalOpen(false)}
                className="max-w-[500px] p-5 lg:p-10"
            >
                <AutoGenerateForm
                    onSuccess={() => {
                        setIsAutoGenerateModalOpen(false);
                    }}
                    onCancel={() => setIsAutoGenerateModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

// Component untuk form edit jatah cuti
interface EditJatahCutiFormProps {
    item: CutiJatahItem;
    onSuccess: () => void;
    onCancel: () => void;
}

function EditJatahCutiForm({ item, onSuccess, onCancel }: EditJatahCutiFormProps) {
    const currentYear = new Date().getFullYear();
    const isTahunPast = item.tahun < currentYear;
    const updateMutation = useUpdateCutiJatah();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<JatahCutiEditFormValues>({
        resolver: zodResolver(jatahCutiEditSchema),
        defaultValues: {
            jumlah_jatah: item.jumlah_jatah,
        },
    });

    useEffect(() => {
        reset({
            jumlah_jatah: item.jumlah_jatah,
        });
    }, [item, reset]);

    const onSubmit = async (data: JatahCutiEditFormValues) => {
        try {
            await updateMutation.mutateAsync({
                id: item.id,
                formData: {
                    id_pegawai: item.id_pegawai,
                    tahun: item.tahun,
                    jumlah_jatah: data.jumlah_jatah,
                    sisa_jatah: item.sisa_jatah, // Tetap menggunakan nilai asli, tidak bisa diubah
                },
            });
            onSuccess();
        } catch (error) {
            // Error handling sudah di hook
        }
    };

    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Info Pegawai */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">NIP:</span> {item.pegawai_nip || '-'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Nama:</span> {item.pegawai_nama || '-'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tahun:</span> {item.tahun}
                </p>
                {isTahunPast && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        ⚠️ Tahun yang sudah lewat tidak dapat diubah
                    </p>
                )}
            </div>

            {/* Jumlah Jatah */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jumlah Jatah Cuti
                </label>
                <input
                    type="number"
                    {...register('jumlah_jatah', { valueAsNumber: true })}
                    className={inputClass + (errors.jumlah_jatah ? ' border-red-500' : '')}
                    disabled={isTahunPast || updateMutation.isPending}
                    min="0"
                />
                {errors.jumlah_jatah && (
                    <p className="mt-1 text-sm text-red-500">{errors.jumlah_jatah.message}</p>
                )}
            </div>

            {/* Sisa Jatah - Read Only */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sisa Jatah Cuti <span className="text-gray-500 text-xs">(Read Only)</span>
                </label>
                <input
                    type="number"
                    value={item.sisa_jatah}
                    className={inputClass + " bg-gray-50 dark:bg-gray-700 cursor-not-allowed"}
                    readOnly
                    disabled
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Sisa jatah cuti tidak dapat diubah secara manual
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={updateMutation.isPending}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTahunPast || updateMutation.isPending}
                >
                    {updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}

// Component untuk form auto-generate
interface AutoGenerateFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

function AutoGenerateForm({ onSuccess, onCancel }: AutoGenerateFormProps) {
    const currentYear = new Date().getFullYear();
    const autoGenerateMutation = useAutoGenerateJatahCuti();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AutoGenerateFormValues>({
        resolver: zodResolver(autoGenerateSchema),
        defaultValues: {
            tahun: currentYear,
            jumlah_jatah: 12,
        },
    });

    const onSubmit = async (data: AutoGenerateFormValues) => {
        try {
            const formData: AutoGenerateJatahCutiInput = {
                tahun: data.tahun,
                jumlah_jatah: data.jumlah_jatah,
            };
            await autoGenerateMutation.mutateAsync(formData);
            reset();
            onSuccess();
        } catch (error) {
            // Error handling sudah di hook
        }
    };

    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Auto Generate Jatah Cuti
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Generate jatah cuti secara otomatis untuk semua pegawai pada tahun yang dipilih.
                </p>
            </div>

            {/* Tahun Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tahun <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('tahun', { valueAsNumber: true })}
                    className={inputClass + (errors.tahun ? ' border-red-500' : '')}
                    disabled={autoGenerateMutation.isPending}
                >
                    {generateTahunOptions().map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                {errors.tahun && (
                    <p className="mt-1 text-sm text-red-500">{errors.tahun.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Pilih tahun untuk generate jatah cuti
                </p>
            </div>

            {/* Jumlah Jatah Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jumlah Jatah Cuti <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    {...register('jumlah_jatah', { valueAsNumber: true })}
                    className={inputClass + (errors.jumlah_jatah ? ' border-red-500' : '')}
                    disabled={autoGenerateMutation.isPending}
                    min="0"
                />
                {errors.jumlah_jatah && (
                    <p className="mt-1 text-sm text-red-500">{errors.jumlah_jatah.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Jumlah jatah cuti yang akan diberikan untuk setiap pegawai (default: 12)
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={autoGenerateMutation.isPending}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={autoGenerateMutation.isPending}
                >
                    {autoGenerateMutation.isPending ? 'Memproses...' : 'Generate'}
                </button>
            </div>
        </form>
    );
}

export default Page;
