import { createContext, useContext, useState } from "react";

export const DetailPegawaiContext = createContext({});

export const DetailPegawaiProvider = ({ children }: { children: React.ReactNode }) => {
    const [detailPegawai, setDetailPegawai] = useState<any>({});

    return <DetailPegawaiContext.Provider value={{ detailPegawai, setDetailPegawai }}>{children}</DetailPegawaiContext.Provider>;
};

export const useDetailPegawai = () => {
    return useContext(DetailPegawaiContext);
};