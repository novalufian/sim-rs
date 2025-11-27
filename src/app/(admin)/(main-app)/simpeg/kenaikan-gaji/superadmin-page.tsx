"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import TotalBiayaPerTahunChart from "./state/charts/TotalBiayaPerTahunChart";
import RataRataKenaikanGajiCard from "./state/charts/RataRataKenaikanGajiCard";
import DistribusiPerGolonganChart from "./state/charts/DistribusiPerGolonganChart";
import TrendBiayaPerBulanChart from "./state/charts/TrendBiayaPerBulanChart";
import Proyeksi5TahunChart from "./state/charts/Proyeksi5TahunChart";
import StatistikStatusChart from "./state/charts/StatistikStatusChart";
import PerbandinganGajiChart from "./state/charts/PerbandinganGajiChart";
import StatistikDisetujuiVsPendingCard from "./state/charts/StatistikDisetujuiVsPendingCard";
import StatistikPerTahunChart from "./state/charts/StatistikPerTahunChart";
import PegawaiAkanNaikGajiTable from "./state/charts/PegawaiAkanNaikGajiTable";
import PerUnitKerjaChart from "./state/charts/PerUnitKerjaChart";
import TotalPengeluaranGajiCard from "./state/charts/TotalPengeluaranGajiCard";

export default function SuperAdminPage() {
    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Super Admin - Statistik Kenaikan Gaji Berkala" />
            </div>

            {/* Row 1: Total Biaya Per Tahun & Rata-Rata Kenaikan */}
            <div className="col-span-8">
                <TotalBiayaPerTahunChart />
            </div>
            <div className="col-span-4 flex flex-col gap-2">
                <RataRataKenaikanGajiCard />
                <TotalPengeluaranGajiCard />
            </div>

            {/* Row 2: Distribusi Per Golongan & Trend Biaya Per Bulan */}
            <div className="col-span-6">
                <DistribusiPerGolonganChart />
            </div>
            <div className="col-span-6">
                <TrendBiayaPerBulanChart />
            </div>

            {/* Row 3: Statistik Status & Perbandingan Gaji */}
            <div className="col-span-6">
                <StatistikStatusChart />
            </div>
            <div className="col-span-6">
                <PerbandinganGajiChart />
            </div>

            {/* Row 4: Proyeksi 5 Tahun & Statistik Disetujui Vs Pending */}
            <div className="col-span-6">
                <Proyeksi5TahunChart />
            </div>
            <div className="col-span-6">
                <StatistikDisetujuiVsPendingCard />
            </div>

            {/* Row 5: Statistik Per Tahun */}
            <div className="col-span-8">
                <StatistikPerTahunChart />
            </div>

            {/* Row 6: Per Unit Kerja */}
            <div className="col-span-8">
                <PerUnitKerjaChart />
            </div>

            {/* Row 7: Pegawai Akan Naik Gaji */}
            <div className="col-span-12">
                <PegawaiAkanNaikGajiTable />
            </div>
        </div>
    );
}

