"use client";
import React from "react";
import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import SuperAdminState from "./state/superadmin-state";

export default function SuperAdminPage() {
    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
                <PathBreadcrumb defaultTitle="Super Admin - Statistik Pensiun" />
            </div>
            <div className="col-span-12">
                <SuperAdminState />
            </div>
        </div>
    );
}
