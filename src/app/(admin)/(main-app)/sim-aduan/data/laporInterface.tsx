export interface Lapor {
    id: number;
    judul: string;
    bidang: string;
    tanggal: string; // Format: YYYY-MM-DD
    isi: string;
    email: string;
    noHp: string;
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
}

export interface Column {
    id: string;
    label: string;
    width: string;
    sticky?: 'left' | 'right';
}

export interface DropdownState {
    [key: number]: boolean;
} 