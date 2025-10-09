"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { useRiwayatPendidikanList } from "@/hooks/fetch/pegawai/usePegawaiRiwayatPendidikan";
import PendidikanForm from "./pendidikanForm";
import LeftDrawer from "@/components/drawer/leftDrawer";

const statusPendidikanOptions = [
  { id: 1, nama: "SMP" },
  { id: 2, nama: "SMA" },
  { id: 3, nama: "D1" },
  { id: 4, nama: "D2" },
  { id: 5, nama: "D3" },
  { id: 6, nama: "S1" },
  { id: 7, nama: "S2" },
  { id: 8, nama: "S3" },
  { id: 9, nama: "Profesi" },
  { id: 10, nama: "Spesialis" },
  { id: 11, nama: "Subspesialis" },
  { id: 12, nama: "Non Formal" },
  { id: 13, nama: "Pelatihan" },
  { id: 14, nama: "Kursus" },
];

export default function PendidikanList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const user = useAppSelector((state) => state.auth.user);
  const params = useParams();
  const id = params?.id === "data-saya" ? user?.id_pegawai : params?.id;
  const idParam = id as string;

  const { data, isLoading } = useRiwayatPendidikanList(idParam);
  const list = useMemo(() => data?.data ?? [], [data]);

  const inputClass =
    "px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white";

  return (
    <div className={`w-full mx-auto p-6 ${isLoading ? "opacity-50" : ""}`}>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed"></div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold dark:text-white">
          Riwayat Pendidikan
        </h3>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsOpen(true);
          }}
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Tambah Pendidikan
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Belum ada riwayat pendidikan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {list.map((item: any, index: number) => {
            const statusNama =
              statusPendidikanOptions.find(
                (opt) =>
                  opt.id ===
                  (Number(item.status_pendidikan_id) ||
                    Number(item.status_pendidikan))
              )?.nama || "-";

            return (
              <div
                key={item.id_pendidikan || index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                    {statusNama} — {item.jurusan || "-"}
                  </h4>
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedItem(item);
                    }}
                    type="button"
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Institusi:
                    </span>{" "}
                    {item.institusi || "-"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Tahun:
                    </span>{" "}
                    {item.tahun_mulai} – {item.tahun_selesai}
                  </p>

                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      No. Ijazah:
                    </span>{" "}
                    {item.no_ijazah || "-"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Gelar:
                    </span>{" "}
                    {item.gelar || "-"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Dokumen Ijazah:
                    </span>{" "}
                    {item.dokumen_ijazah ? (
                      <a
                        href={item.dokumen_ijazah}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        Lihat File
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>

                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Transkrip Nilai:
                    </span>{" "}
                    {item.dokumen_transkrip ? (
                      <a
                        href={item.dokumen_transkrip}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        Lihat File
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <LeftDrawer title={selectedItem ? "Edit Pendidikan" : "Tambah Pendidikan"} isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setSelectedItem(null);
      }}>
        <PendidikanForm 
          isEdit = {selectedItem ? true : false}
          selectedItem={selectedItem}
          onSuccess={() => {
            setIsOpen(false);
            setSelectedItem(null);
            // Data will be automatically refetched due to query invalidation
          }}
          onClose={() => {
            setIsOpen(false);
            setSelectedItem(null);
          }}
        />
      </LeftDrawer>
    </div>
  );
}
