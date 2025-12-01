"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import StatistikJenisPensiunChart from "./charts/StatistikJenisPensiunChart";
import StatistikStatusPermohonanChart from "./charts/StatistikStatusPermohonanChart";
import DistribusiUsiaChart from "./charts/DistribusiUsiaChart";
import PegawaiAkanPensiunPerUnitChart from "./charts/PegawaiAkanPensiunPerUnitChart";
import TrendPerBulanChart from "./charts/TrendPerBulanChart";
import SLACard from "./charts/SLACard";
import Proyeksi5TahunChart from "./charts/Proyeksi5TahunChart";
import PegawaiAkanPensiunTable from "./charts/PegawaiAkanPensiunTable";
import JabatanAkanKosongTable from "./charts/JabatanAkanKosongTable";
import RiwayatPengajuanTable from "./charts/RiwayatPengajuanTable";
import PegawaiLewatMasaPensiunTable from "./charts/PegawaiLewatMasaPensiunTable";

export default function SuperAdminState() {
    return (
        <>
            {/* Seksi konten chart/statistik */}
            <div className="col-span-12 grid grid-cols-12 gap-2 mb-10">
                <div className="col-span-4">
                    <StatistikJenisPensiunChart />
                </div>
                <div className="col-span-8">
                    <StatistikStatusPermohonanChart />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-6">
                    <TrendPerBulanChart />
                </div>
                <div className="col-span-6">
                    <DistribusiUsiaChart />
                </div>

                <div className="col-span-4 flex flex-col gap-2">
                    <SLACard />
                </div>
                <div className="col-span-4">
                    <PegawaiAkanPensiunPerUnitChart />
                </div>
                <div className="col-span-4">
                    <Proyeksi5TahunChart />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2 mt-10">
                <div className="col-span-6">
                    <PegawaiAkanPensiunTable />
                </div>
                <div className="col-span-6">
                    <JabatanAkanKosongTable />
                </div>
            </div>

            <div className="col-span-12 grid grid-cols-12 gap-2 mt-10">
                <div className="col-span-6">
                    <PegawaiLewatMasaPensiunTable />
                </div>
                <div className="col-span-6">
                    <RiwayatPengajuanTable />
                </div>
            </div>
        </>
    );
}

