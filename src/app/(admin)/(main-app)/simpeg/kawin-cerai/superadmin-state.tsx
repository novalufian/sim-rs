"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import DistribusiStatusPernikahanChart from "./state/charts/DistribusiStatusPernikahanChart";
import StatistikPernikahanPerTahunChart from "./state/charts/StatistikPernikahanPerTahunChart";
import StatistikPerceraianPerTahunChart from "./state/charts/StatistikPerceraianPerTahunChart";
import TrendPernikahanPerBulanChart from "./state/charts/TrendPernikahanPerBulanChart";
import TrendPerceraianPerBulanChart from "./state/charts/TrendPerceraianPerBulanChart";
import DistribusiAlasanPerceraianChart from "./state/charts/DistribusiAlasanPerceraianChart";
import RataRataUsiaPernikahanCard from "./state/charts/RataRataUsiaPernikahanCard";
import RataRataDurasiPernikahanCard from "./state/charts/RataRataDurasiPernikahanCard";
import StatistikStatusPersetujuanPernikahanChart from "./state/charts/StatistikStatusPersetujuanPernikahanChart";
import StatistikStatusPersetujuanPerceraianChart from "./state/charts/StatistikStatusPersetujuanPerceraianChart";
import RiwayatPernikahanPegawaiTable from "./state/charts/RiwayatPernikahanPegawaiTable";
import RiwayatPerceraianPegawaiTable from "./state/charts/RiwayatPerceraianPegawaiTable";
import ProyeksiPernikahan5TahunChart from "./state/charts/ProyeksiPernikahan5TahunChart";
import PerbandinganPernikahanVsPerceraianChart from "./state/charts/PerbandinganPernikahanVsPerceraianChart";
import StatistikPerUnitKerjaChart from "./state/charts/StatistikPerUnitKerjaChart";

export default function SuperAdminState() {
    return (
        <div className="grid grid-cols-12 gap-2 col-span-12">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Super Admin - Statistik Kawin Cerai" />
            </div>

            {/* Row 1: Distribusi Status Pernikahan & Statistik Pernikahan Per Tahun */}
            <div className="col-span-4">
                <DistribusiStatusPernikahanChart />
            </div>
            <div className="col-span-8">
                <StatistikPernikahanPerTahunChart />
            </div>

            {/* Row 2: Statistik Perceraian Per Tahun & Trend Pernikahan Per Bulan */}
            <div className="col-span-6">
                <StatistikPerceraianPerTahunChart />
            </div>
            <div className="col-span-6">
                <TrendPernikahanPerBulanChart />
            </div>

            {/* Row 3: Trend Perceraian Per Bulan & Distribusi Alasan Perceraian */}
            <div className="col-span-6">
                <TrendPerceraianPerBulanChart />
            </div>
            <div className="col-span-6">
                <DistribusiAlasanPerceraianChart />
            </div>

            {/* Row 4: Cards - Rata-Rata Usia & Durasi */}
            <div className="col-span-4 flex flex-col gap-2">
                <RataRataUsiaPernikahanCard />
                <RataRataDurasiPernikahanCard />
            </div>

            {/* Row 4: Statistik Status Persetujuan */}
            <div className="col-span-4">
                <StatistikStatusPersetujuanPernikahanChart />
            </div>
            <div className="col-span-4">
                <StatistikStatusPersetujuanPerceraianChart />
            </div>

            {/* Row 5: Proyeksi & Perbandingan */}
            <div className="col-span-6">
                <ProyeksiPernikahan5TahunChart />
            </div>
            <div className="col-span-6">
                <PerbandinganPernikahanVsPerceraianChart />
            </div>

            {/* Row 6: Statistik Per Unit Kerja */}
            <div className="col-span-8">
                <StatistikPerUnitKerjaChart />
            </div>

            {/* Row 7: Riwayat Tables */}
            <div className="col-span-6">
                <RiwayatPernikahanPegawaiTable />
            </div>
            <div className="col-span-6">
                <RiwayatPerceraianPegawaiTable />
            </div>
        </div>
    );
}
