"use client";

import React, { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import Pagination from "@/components/tables/Pagination";
import {
  useMasterPangkatGolongan,
  MasterPangkatGolonganItem,
} from "@/hooks/fetch/master/useMasterPangkatGolongan";

const ITEMS_PER_PAGE = 10;

const masterPangkatGolonganSchema = z.object({
  nama_pangkat: z.string().min(1, "Pangkat wajib diisi"),
  golongan: z.string().min(1, "Golongan wajib diisi"),
  ruang: z.string().optional(),
  urutan: z.number({ invalid_type_error: "Urutan wajib berupa angka" }),
  is_active: z.boolean().optional(),
});

type MasterPangkatGolonganFormValues = z.infer<typeof masterPangkatGolonganSchema>;

export default function MasterPangkatGolonganPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterPangkatGolonganItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<MasterPangkatGolonganItem | null>(null);

  const {
    masterPangkatGolongan,
    isLoading,
    createPangkatGolongan,
    updatePangkatGolongan,
    deletePangkatGolongan,
  } = useMasterPangkatGolongan();

  const list: MasterPangkatGolonganItem[] = Array.isArray(masterPangkatGolongan)
    ? masterPangkatGolongan
    : masterPangkatGolongan?.items ?? [];

  const filteredList = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;
    return list.filter(
      (item) =>
        item.nama_pangkat?.toLowerCase().includes(keyword) ||
        item.golongan?.toLowerCase().includes(keyword),
    );
  }, [list, search]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MasterPangkatGolonganFormValues>({
    resolver: zodResolver(masterPangkatGolonganSchema),
    defaultValues: {
      nama_pangkat: "",
      golongan: "",
      ruang: "",
      urutan: 1,
      is_active: true,
    },
  });

  const isActiveValue = watch("is_active");

  const openCreateModal = () => {
    setSelectedItem(null);
    reset({
      nama_pangkat: "",
      golongan: "",
      ruang: "",
      urutan: 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MasterPangkatGolonganItem) => {
    setSelectedItem(item);
    reset({
      nama_pangkat: item.nama_pangkat || "",
      golongan: item.golongan || "",
      ruang: item.ruang || "",
      urutan: item.urutan ?? 1,
      is_active: item.is_active ?? !item.is_deleted,
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

  const onSubmit = async (values: MasterPangkatGolonganFormValues) => {
    const payload = {
      nama_pangkat: values.nama_pangkat,
      golongan: values.golongan,
      ruang: values.ruang || undefined,
      urutan: values.urutan,
      is_active: values.is_active ?? true,
    };
    console.log('[PangkatGolongan] payload:', payload);

    if (selectedItem) {
      console.log('[PangkatGolongan] update id:', selectedItem.id, payload);
      await updatePangkatGolongan({ id: selectedItem.id, payload });
    } else {
      await createPangkatGolongan(payload);
    }
    closeModal();
  };

  const handleDelete = (item: MasterPangkatGolonganItem) => {
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await deletePangkatGolongan(deleteItem.id);
    closeDeleteModal();
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white";

  if (isLoading) {
    return <div className="p-6">Memuat master pangkat & golongan...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Pangkat & Golongan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola daftar pangkat dan golongan</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          Tambah Pangkat Golongan
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari pangkat atau golongan..."
          className={inputClass}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pangkat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Golongan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ruang</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Urutan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data pangkat & golongan
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => {
                  const isActive = item.is_active ?? !item.is_deleted;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama_pangkat}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.golongan}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.ruang || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.urutan ?? "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedItem ? "Edit Pangkat & Golongan" : "Tambah Pangkat & Golongan"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pastikan pangkat dan golongan diisi dengan benar.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pangkat</label>
            <input type="text" className={inputClass} {...register("nama_pangkat")} />
            {errors.nama_pangkat && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nama_pangkat.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Golongan</label>
            <input type="text" className={inputClass} {...register("golongan")} />
            {errors.golongan && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.golongan.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ruang</label>
            <input type="text" className={inputClass} {...register("ruang")} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Urutan</label>
            <input
              type="number"
              className={inputClass}
              {...register("urutan", { valueAsNumber: true })}
            />
            {errors.urutan && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.urutan.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!isActiveValue}
              onChange={(e) => setValue("is_active", e.target.checked)}
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">Aktif</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} className="max-w-[520px] p-5 lg:p-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hapus Pangkat & Golongan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Apakah kamu yakin ingin menghapus{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{deleteItem?.nama_pangkat}</span>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
