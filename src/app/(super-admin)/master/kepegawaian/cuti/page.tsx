"use client";

import React, { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import Pagination from "@/components/tables/Pagination";
import {
    useJenisCuti,
    usePostJenisCuti,
    useUpdateJenisCuti,
    useDeleteJenisCuti,
    JenisCutiItem,
} from "@/hooks/fetch/master/useJenisCuti";

const ITEMS_PER_PAGE = 10;

const jenisCutiSchema = z.object({
    nama: z.string().min(1, "Nama jenis cuti wajib diisi"),
    max_hari: z.number().min(0, "Max hari harus >= 0"),
});

type JenisCutiFormValues = z.infer<typeof jenisCutiSchema>;

export default function JenisCutiPage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<JenisCutiItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<JenisCutiItem | null>(null);
    
    const { data, isLoading, isError } = useJenisCuti({ page: 1, limit: 1000 });
    const createMutation = usePostJenisCuti();
    const updateMutation = useUpdateJenisCuti();
    const deleteMutation = useDeleteJenisCuti();
    
    const jenisCutiList: JenisCutiItem[] = data?.data?.items || [];
    
    const filteredList = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return jenisCutiList;
        return jenisCutiList.filter((item) => item.nama?.toLowerCase().includes(keyword));
    }, [jenisCutiList, search]);
    
    const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<JenisCutiFormValues>({
        resolver: zodResolver(jenisCutiSchema),
        defaultValues: {
            nama: "",
            max_hari: 0,
        },
    });
    
    const openCreateModal = () => {
        setSelectedItem(null);
        reset({
            nama: "",
            max_hari: 0,
        });
        setIsModalOpen(true);
    };
    
    const openEditModal = (item: JenisCutiItem) => {
        setSelectedItem(item);
        reset({
            nama: item.nama || "",
            max_hari: item.max_hari ?? 0,
        });
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };
    
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
    };
    
    const onSubmit = async (values: JenisCutiFormValues) => {
        const payload = {
            nama: values.nama,
            max_hari: values.max_hari,
        };
        
        if (selectedItem) {
            await updateMutation.mutateAsync({ id: String(selectedItem.id), formData: payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        closeModal();
    };
    
    const handleDelete = (item: JenisCutiItem) => {
        setDeleteItem(item);
        setIsDeleteModalOpen(true);
    };
    
    const confirmDelete = async () => {
        if (!deleteItem) return;
        await deleteMutation.mutateAsync(String(deleteItem.id));
        closeDeleteModal();
    };
    
    const inputClass =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white";
    
    if (isLoading) {
        return <div className="p-6">Memuat data jenis cuti...</div>;
    }
    
    if (isError) {
        return <div className="p-6 text-red-600">Gagal memuat data jenis cuti.</div>;
    }
    
    return (
        <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Jenis Cuti</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola daftar jenis cuti</p>
        </div>
        <button
        onClick={openCreateModal}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
        Tambah Jenis Cuti
        </button>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <input
        value={search}
        onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
        }}
        placeholder="Cari jenis cuti..."
        className={inputClass}
        />
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">No</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nama</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Max Hari</th>
        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
        </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {currentItems.length === 0 ? (
            <tr>
            <td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            Tidak ada data jenis cuti
            </td>
            </tr>
        ) : (
            currentItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                {startIndex + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.max_hari ?? "-"}</td>
                <td className="px-4 py-3 text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                <button
                onClick={() => openEditModal(item)}
                className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                >
                Edit
                </button>
                <button
                onClick={() => handleDelete(item)}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                Hapus
                </button>
                </div>
                </td>
                </tr>
            ))
        )}
        </tbody>
        </table>
        </div>
        
        {totalPages > 1 && (
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        )}
        </div>
        
        <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {selectedItem ? "Edit Jenis Cuti" : "Tambah Jenis Cuti"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
        Lengkapi informasi jenis cuti di bawah ini
        </p>
        </div>
        
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Nama Jenis Cuti
        </label>
        <input
        {...register("nama")}
        className={`${inputClass} ${errors.nama ? "border-red-500" : ""}`}
        />
        {errors.nama && <p className="text-sm text-red-500 mt-1">{errors.nama.message}</p>}
        </div>
        
        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Max Hari
        </label>
        <input
        type="number"
        {...register("max_hari", { valueAsNumber: true })}
        className={`${inputClass} ${errors.max_hari ? "border-red-500" : ""}`}
        min={0}
        />
        {errors.max_hari && <p className="text-sm text-red-500 mt-1">{errors.max_hari.message}</p>}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
        type="button"
        onClick={closeModal}
        className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        >
        Batal
        </button>
        <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        disabled={createMutation.isPending || updateMutation.isPending}
        >
        {selectedItem ? "Simpan" : "Tambah"}
        </button>
        </div>
        </form>
        </Modal>
        
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} className="max-w-[520px] p-5 lg:p-8">
        <div className="space-y-6">
        <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hapus Jenis Cuti</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
        Apakah kamu yakin ingin menghapus jenis cuti{" "}
        <span className="font-medium text-gray-900 dark:text-white">
        {deleteItem?.nama || "-"}
        </span>
        ?
        </p>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
        type="button"
        onClick={closeDeleteModal}
        className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        disabled={deleteMutation.isPending}
        >
        Batal
        </button>
        <button
        type="button"
        onClick={confirmDelete}
        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={deleteMutation.isPending}
        >
        {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
        </button>
        </div>
        </div>
        </Modal>
        </div>
    );
}
