"use client";

 import React, { useMemo, useState } from "react";
 import { z } from "zod";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { Modal } from "@/components/ui/modal";
 import Pagination from "@/components/tables/Pagination";
 import { useJabatan, usePostJabatan, useUpdateJabatan, useJabatanDelete, JabatanItem } from "@/hooks/fetch/master/useJabatan";

 const ITEMS_PER_PAGE = 10;

 const jabatanSchema = z.object({
   nama_jabatan: z.string().min(1, "Nama jabatan wajib diisi"),
   tipe_jabatan: z.enum(["STRUKTURAL", "FUNGSIONAL"], {
     required_error: "Tipe jabatan wajib dipilih",
   }),
   tingkat_jabatan: z.string().optional(),
   parent_id: z.string().optional(),
 });

 type JabatanFormValues = z.infer<typeof jabatanSchema>;

 const renderTipeBadge = (tipe: string) => {
   const normalized = tipe.toUpperCase();
   const baseClasses = "px-2 py-1 rounded text-xs font-medium inline-block";
   if (normalized === "STRUKTURAL") {
     return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>{tipe}</span>;
   }
   if (normalized === "FUNGSIONAL") {
     return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>{tipe}</span>;
   }
   return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>{tipe}</span>;
 };

 export default function JabatanPage() {
   const [search, setSearch] = useState("");
   const [tipeFilter, setTipeFilter] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JabatanItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<JabatanItem | null>(null);

   const { data, isLoading, isError } = useJabatan({ page: 1, limit: 1000 });
   const createMutation = usePostJabatan();
   const updateMutation = useUpdateJabatan();
   const deleteMutation = useJabatanDelete();

   const jabatanList: JabatanItem[] = data?.data?.items || [];

   const filteredList = useMemo(() => {
     const keyword = search.trim().toLowerCase();
     return jabatanList.filter((item) => {
       const matchesSearch = !keyword || item.nama_jabatan?.toLowerCase().includes(keyword);
       const matchesTipe = !tipeFilter || item.tipe_jabatan?.toUpperCase() === tipeFilter;
       return matchesSearch && matchesTipe;
     });
   }, [jabatanList, search, tipeFilter]);

   const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const currentItems = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

   const {
     register,
     handleSubmit,
     formState: { errors },
     reset,
   } = useForm<JabatanFormValues>({
     resolver: zodResolver(jabatanSchema),
     defaultValues: {
       nama_jabatan: "",
       tipe_jabatan: "STRUKTURAL",
       tingkat_jabatan: "",
       parent_id: "",
     },
   });

   const openCreateModal = () => {
     setSelectedItem(null);
     reset({
       nama_jabatan: "",
       tipe_jabatan: "STRUKTURAL",
       tingkat_jabatan: "",
       parent_id: "",
     });
     setIsModalOpen(true);
   };

   const openEditModal = (item: JabatanItem) => {
     setSelectedItem(item);
     reset({
       nama_jabatan: item.nama_jabatan || "",
       tipe_jabatan: (item.tipe_jabatan?.toUpperCase() as "STRUKTURAL" | "FUNGSIONAL") || "STRUKTURAL",
       tingkat_jabatan: item.tingkat_jabatan || "",
       parent_id: item.parent_id || "",
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

   const onSubmit = async (values: JabatanFormValues) => {
     const payload = {
       nama_jabatan: values.nama_jabatan,
       tipe_jabatan: values.tipe_jabatan,
       tingkat_jabatan: values.tingkat_jabatan || null,
       parent_id: values.parent_id || null,
     };

     if (selectedItem) {
       await updateMutation.mutateAsync({ id: selectedItem.id, formData: payload });
     } else {
       await createMutation.mutateAsync(payload);
     }
     closeModal();
   };

  const handleDelete = (item: JabatanItem) => {
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await deleteMutation.mutateAsync(deleteItem.id);
    closeDeleteModal();
  };

   const inputClass =
     "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white";

   if (isLoading) {
     return <div className="p-6">Memuat data jabatan...</div>;
   }

   if (isError) {
     return <div className="p-6 text-red-600">Gagal memuat data jabatan.</div>;
   }

   return (
     <div className="p-6 space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Jabatan</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Kelola daftar jabatan dan tipe jabatan</p>
         </div>
         <button
           onClick={openCreateModal}
           className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
         >
           Tambah Jabatan
         </button>
       </div>

       <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
         <div className="grid grid-cols-12 gap-4">
           <div className="col-span-12 md:col-span-8">
             <input
               value={search}
               onChange={(e) => {
                 setSearch(e.target.value);
                 setCurrentPage(1);
               }}
               placeholder="Cari nama jabatan..."
               className={inputClass}
             />
           </div>
           <div className="col-span-12 md:col-span-4">
             <select
               value={tipeFilter}
               onChange={(e) => {
                 setTipeFilter(e.target.value);
                 setCurrentPage(1);
               }}
               className={inputClass}
             >
               <option value="">Semua Tipe</option>
               <option value="STRUKTURAL">Struktural</option>
               <option value="FUNGSIONAL">Fungsional</option>
             </select>
           </div>
         </div>
       </div>

       <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
             <thead className="bg-gray-100 dark:bg-gray-800">
               <tr>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">No</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nama Jabatan</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tipe</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tingkat</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Parent</th>
                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
               </tr>
             </thead>
             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
               {currentItems.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                     Tidak ada data jabatan
                   </td>
                 </tr>
               ) : (
                 currentItems.map((item, index) => (
                   <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                     <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                       {startIndex + index + 1}
                     </td>
                     <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.nama_jabatan}</td>
                     <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                       {renderTipeBadge(item.tipe_jabatan)}
                     </td>
                     <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                       {item.tingkat_jabatan || "-"}
                     </td>
                     <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                       {item.parent?.nama_jabatan || "-"}
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
               {selectedItem ? "Edit Jabatan" : "Tambah Jabatan"}
             </h2>
             <p className="text-sm text-gray-500 dark:text-gray-400">
               Lengkapi informasi jabatan di bawah ini
             </p>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Nama Jabatan
             </label>
             <input
               {...register("nama_jabatan")}
               className={`${inputClass} ${errors.nama_jabatan ? "border-red-500" : ""}`}
             />
             {errors.nama_jabatan && <p className="text-sm text-red-500 mt-1">{errors.nama_jabatan.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Tipe Jabatan
             </label>
             <select
               {...register("tipe_jabatan")}
               className={`${inputClass} ${errors.tipe_jabatan ? "border-red-500" : ""}`}
             >
               <option value="STRUKTURAL">Struktural</option>
               <option value="FUNGSIONAL">Fungsional</option>
             </select>
             {errors.tipe_jabatan && <p className="text-sm text-red-500 mt-1">{errors.tipe_jabatan.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Tingkat Jabatan
             </label>
             <input {...register("tingkat_jabatan")} className={inputClass} placeholder="Contoh: Administrator" />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Parent Jabatan
             </label>
             <select {...register("parent_id")} className={inputClass}>
               <option value="">Tidak ada</option>
               {jabatanList.map((jabatan) => (
                 <option key={jabatan.id} value={jabatan.id}>
                   {jabatan.nama_jabatan}
                 </option>
               ))}
             </select>
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hapus Jabatan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Apakah kamu yakin ingin menghapus jabatan{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {deleteItem?.nama_jabatan || "-"}
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
