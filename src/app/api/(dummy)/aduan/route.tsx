import { NextResponse } from "next/server";

const laporData = [
    {
        "id": 1,
        "judul": "Laporan kerusakan jaringan",
        "bidang": "development",
        "tanggal": "2025-03-28",
        "isi": "Jaringan internet mengalami gangguan sejak pagi.",
        "email": "user1@example.com",
        "noHp": "081234567890",
        "createdAt": "2025-03-28T08:00:00.000Z",
        "updatedAt": "2025-03-28T08:15:00.000Z"
    },
    {
        "id": 2,
        "judul": "Laporan bug pada aplikasi",
        "bidang": "development",
        "tanggal": "2025-03-29",
        "isi": "Aplikasi crash ketika membuka halaman login.",
        "email": "user2@example.com",
        "noHp": "081234567891",
        "createdAt": "2025-03-29T09:00:00.000Z",
        "updatedAt": "2025-03-29T09:15:00.000Z"
    },
    {
        "id": 3,
        "judul": "Laporan server down",
        "bidang": "infrastructure",
        "tanggal": "2025-03-30",
        "isi": "Server utama tidak merespons permintaan.",
        "email": "user3@example.com",
        "noHp": "081234567892",
        "createdAt": "2025-03-30T10:00:00.000Z",
        "updatedAt": "2025-03-30T10:15:00.000Z"
    },
    {
        "id": 4,
        "judul": "Laporan error database",
        "bidang": "database",
        "tanggal": "2025-03-31",
        "isi": "Database gagal menyimpan data baru.",
        "email": "user4@example.com",
        "noHp": "081234567893",
        "createdAt": "2025-03-31T11:00:00.000Z",
        "updatedAt": "2025-03-31T11:15:00.000Z"
    },
    {
        "id": 5,
        "judul": "Laporan kegagalan sinkronisasi",
        "bidang": "development",
        "tanggal": "2025-04-01",
        "isi": "Sinkronisasi data antar server gagal.",
        "email": "user5@example.com",
        "noHp": "081234567894",
        "createdAt": "2025-04-01T12:00:00.000Z",
        "updatedAt": "2025-04-01T12:15:00.000Z"
    },
    {
        "id": 6,
        "judul": "Laporan downtime aplikasi",
        "bidang": "development",
        "tanggal": "2025-04-02",
        "isi": "Aplikasi tidak dapat diakses selama 2 jam.",
        "email": "user6@example.com",
        "noHp": "081234567895",
        "createdAt": "2025-04-02T13:00:00.000Z",
        "updatedAt": "2025-04-02T13:15:00.000Z"
    },
    {
        "id": 7,
        "judul": "Laporan masalah API",
        "bidang": "development",
        "tanggal": "2025-04-03",
        "isi": "API tidak merespons permintaan dengan benar.",
        "email": "user7@example.com",
        "noHp": "081234567896",
        "createdAt": "2025-04-03T14:00:00.000Z",
        "updatedAt": "2025-04-03T14:15:00.000Z"
    },
    {
        "id": 8,
        "judul": "Laporan masalah UI/UX",
        "bidang": "design",
        "tanggal": "2025-04-04",
        "isi": "Desain tampilan tidak sesuai dengan spesifikasi.",
        "email": "user8@example.com",
        "noHp": "081234567897",
        "createdAt": "2025-04-04T15:00:00.000Z",
        "updatedAt": "2025-04-04T15:15:00.000Z"
    },
    {
        "id": 9,
        "judul": "Laporan masalah autentikasi",
        "bidang": "security",
        "tanggal": "2025-04-05",
        "isi": "Sistem autentikasi gagal memverifikasi pengguna.",
        "email": "user9@example.com",
        "noHp": "081234567898",
        "createdAt": "2025-04-05T16:00:00.000Z",
        "updatedAt": "2025-04-05T16:15:00.000Z"
    },
    {
        "id": 10,
        "judul": "Laporan masalah backup",
        "bidang": "infrastructure",
        "tanggal": "2025-04-06",
        "isi": "Backup data gagal dilakukan semalam.",
        "email": "user10@example.com",
        "noHp": "081234567899",
        "createdAt": "2025-04-06T17:00:00.000Z",
        "updatedAt": "2025-04-06T17:15:00.000Z"
    },
    {
        "id": 11,
        "judul": "Laporan masalah cache",
        "bidang": "performance",
        "tanggal": "2025-04-07",
        "isi": "Cache tidak terhapus secara otomatis.",
        "email": "user11@example.com",
        "noHp": "081234567800",
        "createdAt": "2025-04-07T18:00:00.000Z",
        "updatedAt": "2025-04-07T18:15:00.000Z"
    },
    {
        "id": 12,
        "judul": "Laporan masalah firewall",
        "bidang": "security",
        "tanggal": "2025-04-08",
        "isi": "Firewall memblokir akses yang sah.",
        "email": "user12@example.com",
        "noHp": "081234567801",
        "createdAt": "2025-04-08T19:00:00.000Z",
        "updatedAt": "2025-04-08T19:15:00.000Z"
    },
    {
        "id": 13,
        "judul": "Laporan masalah logging",
        "bidang": "monitoring",
        "tanggal": "2025-04-09",
        "isi": "Log sistem tidak mencatat aktivitas penting.",
        "email": "user13@example.com",
        "noHp": "081234567802",
        "createdAt": "2025-04-09T20:00:00.000Z",
        "updatedAt": "2025-04-09T20:15:00.000Z"
    },
    {
        "id": 14,
        "judul": "Laporan masalah notifikasi",
        "bidang": "development",
        "tanggal": "2025-04-10",
        "isi": "Notifikasi email tidak terkirim ke pengguna.",
        "email": "user14@example.com",
        "noHp": "081234567803",
        "createdAt": "2025-04-10T21:00:00.000Z",
        "updatedAt": "2025-04-10T21:15:00.000Z"
    },
    {
        "id": 15,
        "judul": "Laporan masalah integrasi",
        "bidang": "integration",
        "tanggal": "2025-04-11",
        "isi": "Integrasi dengan pihak ketiga gagal.",
        "email": "user15@example.com",
        "noHp": "081234567804",
        "createdAt": "2025-04-11T22:00:00.000Z",
        "updatedAt": "2025-04-11T22:15:00.000Z"
    },
    {
        "id": 16,
        "judul": "Laporan masalah load balancer",
        "bidang": "infrastructure",
        "tanggal": "2025-04-12",
        "isi": "Load balancer tidak mendistribusikan beban dengan baik.",
        "email": "user16@example.com",
        "noHp": "081234567805",
        "createdAt": "2025-04-12T23:00:00.000Z",
        "updatedAt": "2025-04-12T23:15:00.000Z"
    },
    {
        "id": 17,
        "judul": "Laporan masalah CDN",
        "bidang": "performance",
        "tanggal": "2025-04-13",
        "isi": "CDN tidak menyediakan konten dengan cepat.",
        "email": "user17@example.com",
        "noHp": "081234567806",
        "createdAt": "2025-04-13T00:00:00.000Z",
        "updatedAt": "2025-04-13T00:15:00.000Z"
    },
    {
        "id": 18,
        "judul": "Laporan masalah DNS",
        "bidang": "network",
        "tanggal": "2025-04-14",
        "isi": "DNS tidak meresolve domain dengan benar.",
        "email": "user18@example.com",
        "noHp": "081234567807",
        "createdAt": "2025-04-14T01:00:00.000Z",
        "updatedAt": "2025-04-14T01:15:00.000Z"
    },
    {
        "id": 19,
        "judul": "Laporan masalah SSL",
        "bidang": "security",
        "tanggal": "2025-04-15",
        "isi": "Sertifikat SSL kedaluwarsa.",
        "email": "user19@example.com",
        "noHp": "081234567808",
        "createdAt": "2025-04-15T02:00:00.000Z",
        "updatedAt": "2025-04-15T02:15:00.000Z"
    },
    {
        "id": 20,
        "judul": "Laporan masalah storage",
        "bidang": "infrastructure",
        "tanggal": "2025-04-16",
        "isi": "Penyimpanan data penuh dan perlu diperbesar.",
        "email": "user20@example.com",
        "noHp": "081234567809",
        "createdAt": "2025-04-16T03:00:00.000Z",
        "updatedAt": "2025-04-16T03:15:00.000Z"
    }
];


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const bidang = searchParams.get("bidang");
        const limit = parseInt(searchParams.get("limit") || "0");

        let filteredData = laporData;

        // Optional filters
        if (email) {
            filteredData = filteredData.filter(item =>
                item.email?.toLowerCase().includes(email.toLowerCase())
            );
        }

        if (bidang) {
            filteredData = filteredData.filter(item =>
                item["bidang"]?.toLowerCase().includes(bidang.toLowerCase())
            );
        }

        // Optional limit
        const limitedData = limit > 0 ? filteredData.slice(0, limit) : filteredData;

        return NextResponse.json(
            {
                data: limitedData,
                total: filteredData.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /api/aduan:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

