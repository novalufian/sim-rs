// src/app/(admin)/(main-app)/sim-pegawai/data/tableHelpers.ts

import { Pegawai } from "./pegawaiInterface"; // Adjust path if needed

// Helper function to safely get nested column values
export const getColumnValue = (data: Pegawai, columnId: string): React.ReactNode => {
    switch (columnId) {
        case 'no':
        // 'no' is handled directly in the component, not here
        return '';
        case 'nip':
        return data.nip|| nullValue();
        case 'nama':
        return data.nama || nullValue();
        case 'jenis_kelamin' :
        return data.jenis_kelamin || nullValue();
        case 'status_pekerjaan':
        return data.status_pekerjaan || nullValue();
        case 'no_hp':
        return data.no_hp || nullValue() ;
        case 'email':
        return data.email || nullValue();
        // Add other cases for any complex or nested fields if needed
        // case 'user_username':
        //   return data.user?.username;
        default:
        // Fallback for direct properties
        return (data as any)[columnId];
    }
};


function nullValue() {
        return <p className="text-red-500 text-center block w-full"> - </p>;
}