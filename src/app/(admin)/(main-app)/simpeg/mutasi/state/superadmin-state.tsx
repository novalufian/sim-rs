"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import StatistikStatusChart from "./charts/StatistikStatusChart";
import StatistikDisetujuiVsPendingChart from "./charts/StatistikDisetujuiVsPendingChart";
import TopInstansiTujuanChart from "./charts/TopInstansiTujuanChart";
import PerUnitKerjaAsalChart from "./charts/PerUnitKerjaAsalChart";
import TrendPerBulanChart from "./charts/TrendPerBulanChart";
import SLAPersetujuanCard from "./charts/SLAPersetujuanCard";
import StatistikStatusPersetujuanChart from "./charts/StatistikStatusPersetujuanChart";
import Proyeksi5TahunChart from "./charts/Proyeksi5TahunChart";
import RiwayatPegawaiTable from "./charts/RiwayatPegawaiTable";
import StatistikPerTahunChart from "./charts/StatistikPerTahunChart";

export default function SuperAdminState() {
    return (
        <>
            {/* Seksi konten chart/statistik */}
            <div className="col-span-12 grid grid-cols-12 gap-2 mb-10">
                <div className="col-span-4">
                    <StatistikStatusChart />
                </div>
                <div className="col-span-8">
                    <StatistikPerTahunChart />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-6">
                    <TrendPerBulanChart />
                </div>
                <div className="col-span-6">
                    <PerUnitKerjaAsalChart />
                </div>

                <div className="col-span-4">
                    <StatistikStatusPersetujuanChart />
                </div>
                <div className="col-span-4 flex flex-col gap-2">
                    <StatistikDisetujuiVsPendingChart />
                </div>
                <div className="col-span-4">
                    <SLAPersetujuanCard />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2 mt-10">
                <div className="col-span-4">
                    <TopInstansiTujuanChart />
                </div>
                <div className="col-span-8">
                    <Proyeksi5TahunChart />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2 mt-10">
                <div className="col-span-12">
                    <RiwayatPegawaiTable />
                </div>
            </div>
        </>
    );
}
