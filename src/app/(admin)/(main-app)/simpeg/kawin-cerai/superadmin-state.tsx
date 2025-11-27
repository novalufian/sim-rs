"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import DistribusiStatusPernikahanChart from "./data/charts/DistribusiStatusPernikahanChart";
import StatistikPernikahanPerTahunChart from "./data/charts/StatistikPernikahanPerTahunChart";
import StatistikPerceraianPerTahunChart from "./data/charts/StatistikPerceraianPerTahunChart";
import TrendPernikahanPerBulanChart from "./data/charts/TrendPernikahanPerBulanChart";
import TrendPerceraianPerBulanChart from "./data/charts/TrendPerceraianPerBulanChart";
import DistribusiAlasanPerceraianChart from "./data/charts/DistribusiAlasanPerceraianChart";
import RataRataUsiaPernikahanCard from "./data/charts/RataRataUsiaPernikahanCard";
import RataRataDurasiPernikahanCard from "./data/charts/RataRataDurasiPernikahanCard";
import StatistikStatusPersetujuanPernikahanChart from "./data/charts/StatistikStatusPersetujuanPernikahanChart";
import StatistikStatusPersetujuanPerceraianChart from "./data/charts/StatistikStatusPersetujuanPerceraianChart";
import RiwayatPernikahanPegawaiTable from "./data/charts/RiwayatPernikahanPegawaiTable";
import RiwayatPerceraianPegawaiTable from "./data/charts/RiwayatPerceraianPegawaiTable";
import ProyeksiPernikahan5TahunChart from "./data/charts/ProyeksiPernikahan5TahunChart";
import PerbandinganPernikahanVsPerceraianChart from "./data/charts/PerbandinganPernikahanVsPerceraianChart";
import StatistikPerUnitKerjaChart from "./data/charts/StatistikPerUnitKerjaChart";

export default function SuperAdminState() {
    return (
        <div className="grid grid-cols-12 gap-2">
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
