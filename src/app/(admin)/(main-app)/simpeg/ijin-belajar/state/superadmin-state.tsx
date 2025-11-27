"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import StatistikJenisPermohonanChart from "./charts/StatistikJenisPermohonanChart";
import DistribusiStatusPermohonanChart from "./charts/DistribusiStatusPermohonanChart";
import TopProgramStudiChart from "./charts/TopProgramStudiChart";
import TopInstitusiPendidikanChart from "./charts/TopInstitusiPendidikanChart";
import PermohonanPerUnitKerjaChart from "./charts/PermohonanPerUnitKerjaChart";
import DistribusiBiayaDitanggungChart from "./charts/DistribusiBiayaDitanggungChart";
import TrendPerBulanChart from "./charts/TrendPerBulanChart";
import RataRataLamaStudiCard from "./charts/RataRataLamaStudiCard";
import PegawaiSedangBelajarTable from "./charts/PegawaiSedangBelajarTable";
import PermohonanAkanDimulaiTable from "./charts/PermohonanAkanDimulaiTable";
import StatistikStatusPersetujuanChart from "./charts/StatistikStatusPersetujuanChart";
import Proyeksi5TahunChart from "./charts/Proyeksi5TahunChart";
import RiwayatPengajuanTable from "./charts/RiwayatPengajuanTable";
import StatistikGelarDiperolehChart from "./charts/StatistikGelarDiperolehChart";

export default function SuperAdminState() {
    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Super Admin - Statistik Ijin Belajar" />
            </div>

            {/* Row 1: Statistik Jenis Permohonan & Distribusi Status Permohonan */}
            <div className="col-span-4">
                <StatistikJenisPermohonanChart />
            </div>
            <div className="col-span-4">
                <DistribusiStatusPermohonanChart />
            </div>
            <div className="col-span-4">
                <DistribusiBiayaDitanggungChart />
            </div>

            {/* Row 2: Top Program Studi & Top Institusi Pendidikan */}
            <div className="col-span-6">
                <TopProgramStudiChart />
            </div>
            <div className="col-span-6">
                <TopInstitusiPendidikanChart />
            </div>

            {/* Row 3: Trend Per Bulan & Permohonan Per Unit Kerja */}
            <div className="col-span-6">
                <TrendPerBulanChart />
            </div>
            <div className="col-span-6">
                <PermohonanPerUnitKerjaChart />
            </div>

            {/* Row 4: Rata-Rata Lama Studi Card & Statistik Status Persetujuan */}
            <div className="col-span-4">
                <RataRataLamaStudiCard />
            </div>
            <div className="col-span-4">
                <StatistikStatusPersetujuanChart />
            </div>
            <div className="col-span-4">
                <StatistikGelarDiperolehChart />
            </div>

            {/* Row 5: Proyeksi 5 Tahun */}
            <div className="col-span-12">
                <Proyeksi5TahunChart />
            </div>

            {/* Row 6: Tables - Pegawai Sedang Belajar & Permohonan Akan Dimulai */}
            <div className="col-span-6">
                <PegawaiSedangBelajarTable />
            </div>
            <div className="col-span-6">
                <PermohonanAkanDimulaiTable />
            </div>

            {/* Row 7: Riwayat Pengajuan Table */}
            <div className="col-span-12">
                <RiwayatPengajuanTable />
            </div>
        </div>
    );
}

