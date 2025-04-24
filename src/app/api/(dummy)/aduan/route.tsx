import { NextResponse } from "next/server";

const laporData = [
    {
        "id": "7b8e86a5-4b8f-4a2e-933d-63ac8a5a5ff0",
        "judul": "Laporan kerusakan jaringan",
        "bidang": "development",
        "tanggal": "2025-03-28",
        "isi": "Sejak pagi hari ini, jaringan internet mengalami gangguan yang menyebabkan koneksi menjadi sangat lambat bahkan terputus total. Hal ini berdampak pada aktivitas kerja tim development yang bergantung pada layanan cloud dan repository online untuk menyelesaikan tugas harian. Mohon segera dilakukan pengecekan untuk mengetahui penyebab pastinya dan dilakukan perbaikan secepat mungkin agar aktivitas dapat kembali normal tanpa hambatan.",
        "email": "user1@example.com",
        "noHp": "081234567890",
        "createdBy": "John Doe",
        "type": "aduan",
        "status": "closed",
        "createdAt": "2025-03-28T08:00:00.000Z",
        "updatedAt": "2025-03-28T08:15:00.000Z"
    },
    {
        "id": "8c9f97b6-5c9g-5b3f-a44e-74bd9b6b6gg1",
        "judul": "Masalah login sistem",
        "bidang": "it-support",
        "tanggal": "2025-03-29",
        "isi": "Sistem login perusahaan tidak dapat diakses sejak kemarin malam karena muncul error 403 forbidden setiap kali mencoba masuk. Hal ini mengganggu produktivitas tim yang membutuhkan akses segera ke sistem internal untuk menyelesaikan pekerjaan penting. Mohon diperiksa dan diperbaiki sesegera mungkin agar kami bisa melanjutkan tugas tanpa kendala lebih lanjut.",
        "email": "user2@example.com",
        "noHp": "081345678901",
        "createdBy": "Jane Smith",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-03-29T09:30:00.000Z",
        "updatedAt": "2025-03-29T09:45:00.000Z"
    },
    {
        "id": "9d0g08c7-6d0h-6c4g-b55f-85ce0c7c7hh2",
        "judul": "Printer tidak berfungsi",
        "bidang": "administrasi",
        "tanggal": "2025-03-30",
        "isi": "Printer di lantai 3 tidak dapat mencetak dokumen sejak pagi ini meskipun sudah dicoba restart beberapa kali namun tetap menunjukkan pesan error. Hal ini menghambat proses administrasi yang membutuhkan cetakan fisik untuk laporan bulanan dan dokumen penting lainnya. Mohon segera diperbaiki agar pekerjaan dapat selesai tepat waktu tanpa penundaan lebih lanjut.",
        "email": "user3@example.com",
        "noHp": "081456789012",
        "createdBy": "Michael Tan",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-03-30T10:15:00.000Z",
        "updatedAt": "2025-03-30T10:20:00.000Z"
    },
    {
        "id": "ae1h19d8-7e1i-7d5h-c66g-96df1d8d8ii3",
        "judul": "Server down",
        "bidang": "infrastruktur",
        "tanggal": "2025-03-31",
        "isi": "Server utama mengalami downtime sejak pukul 02:00 dini hari tanpa pemberitahuan sebelumnya, menyebabkan semua layanan yang bergantung padanya tidak dapat diakses oleh pengguna. Hal ini sangat mengganggu operasional perusahaan, terutama untuk tim yang bekerja shift malam. Mohon segera diperiksa dan diperbaiki agar sistem kembali online sesegera mungkin tanpa menimbulkan kerugian lebih besar.",
        "email": "user4@example.com",
        "noHp": "081567890123",
        "createdBy": "Sarah Lee",
        "type": "aduan",
        "status": "closed",
        "createdAt": "2025-03-31T02:30:00.000Z",
        "updatedAt": "2025-03-31T02:45:00.000Z"
    },
    {
        "id": "bf2i2ae9-8f2j-8e6i-d77h-a7eg2e9e9jj4",
        "judul": "Kamera CCTV mati",
        "bidang": "keamanan",
        "tanggal": "2025-04-01",
        "isi": "Kamera CCTV di gerbang utama tidak berfungsi sejak semalam, sehingga tidak ada rekaman aktivitas yang masuk atau keluar area perusahaan selama periode tersebut. Ini menimbulkan risiko keamanan yang serius karena kami tidak dapat memantau situasi secara real-time. Mohon segera diperiksa dan diperbaiki untuk memastikan keamanan gedung tetap terjaga dengan baik.",
        "email": "user5@example.com",
        "noHp": "081678901234",
        "createdBy": "David Wong",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-04-01T07:00:00.000Z",
        "updatedAt": "2025-04-01T07:10:00.000Z"
    },
    {
        "id": "cg3j3bf0-9g3k-9f7j-e88i-b8fh3f0f0kk5",
        "judul": "AC tidak dingin",
        "bidang": "fasilitas",
        "tanggal": "2025-04-02",
        "isi": "AC di ruang meeting lantai 5 tidak dingin sejak pagi ini, meskipun sudah diatur ke suhu terendah, sehingga ruangan terasa pengap dan tidak nyaman untuk rapat. Hal ini mengganggu kenyamanan karyawan dan tamu yang hadir. Mohon segera diperiksa dan diperbaiki agar ruangan dapat digunakan dengan optimal untuk keperluan rapat penting hari ini.",
        "email": "user6@example.com",
        "noHp": "081789012345",
        "createdBy": "Lisa Chen",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-04-02T08:45:00.000Z",
        "updatedAt": "2025-04-02T09:00:00.000Z"
    },
    {
        "id": "dh4k4cg1-ah4l-ag8k-f99j-c9gi4g1g1ll6",
        "judul": "Aplikasi crash",
        "bidang": "development",
        "tanggal": "2025-04-03",
        "isi": "Aplikasi internal perusahaan sering crash saat membuka modul tertentu, terutama saat memproses data dalam jumlah besar, sehingga menghambat proses pengembangan dan pengujian fitur baru. Hal ini menyebabkan penundaan jadwal rilis yang sudah ditetapkan. Mohon tim IT segera menyelidiki penyebabnya dan memberikan solusi agar kami dapat melanjutkan pekerjaan tanpa gangguan lebih lanjut.",
        "email": "user7@example.com",
        "noHp": "081890123456",
        "createdBy": "Robert Kim",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-04-03T11:00:00.000Z",
        "updatedAt": "2025-04-03T11:15:00.000Z"
    },
    {
        "id": "ei5l5dh2-bi5m-bh9l-gaak-dahj5h2h2mm7",
        "judul": "Email tidak terkirim",
        "bidang": "it-support",
        "tanggal": "2025-04-04",
        "isi": "Email dari domain perusahaan tidak dapat terkirim ke klien sejak pagi ini, selalu muncul pesan error 'delivery failed' meskipun koneksi internet stabil. Hal ini mengganggu komunikasi dengan mitra bisnis yang membutuhkan respons cepat untuk proyek penting. Mohon diperiksa server email dan segera diperbaiki agar komunikasi dapat berjalan lancar kembali.",
        "email": "user8@example.com",
        "noHp": "081901234567",
        "createdBy": "Emma Park",
        "type": "aduan",
        "status": "closed",
        "createdAt": "2025-04-04T13:30:00.000Z",
        "updatedAt": "2025-04-04T13:45:00.000Z"
    },
    {
        "id": "fj6m6ei3-cj6n-ciak-hbbl-ebik6i3i3nn8",
        "judul": "Listrik padam",
        "bidang": "fasilitas",
        "tanggal": "2025-04-05",
        "isi": "Listrik di lantai 2 padam sejak siang ini tanpa pemberitahuan sebelumnya, menyebabkan semua perangkat elektronik mati dan pekerjaan terhenti total di area tersebut. Hal ini sangat mengganggu aktivitas tim yang sedang menyelesaikan laporan penting. Mohon segera diperiksa sumber masalahnya dan dipulihkan agar kami dapat melanjutkan pekerjaan tanpa kehilangan waktu lebih banyak.",
        "email": "user9@example.com",
        "noHp": "082012345678",
        "createdBy": "Thomas Lim",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-04-05T14:00:00.000Z",
        "updatedAt": "2025-04-05T14:10:00.000Z"
    },
    {
        "id": "gk7n7fj4-dk7o-djbl-iccm-fcjl7j4j4oo9",
        "judul": "Backup gagal",
        "bidang": "infrastruktur",
        "tanggal": "2025-04-06",
        "isi": "Proses backup harian gagal sejak tadi malam karena storage penuh, sehingga data penting perusahaan tidak tersimpan dengan aman seperti biasanya. Hal ini meningkatkan risiko kehilangan data jika terjadi masalah pada sistem utama. Mohon segera tambahkan kapasitas storage atau lakukan pembersihan agar proses backup dapat berjalan normal kembali tanpa kegagalan.",
        "email": "user10@example.com",
        "noHp": "082123456789",
        "createdBy": "Anna Wu",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-04-06T03:00:00.000Z",
        "updatedAt": "2025-04-06T03:15:00.000Z"
    },
    {
        "id": "hl8o8gk5-el8p-ekcm-jddn-gdkm8k5k5pp0",
        "judul": "Website down",
        "bidang": "development",
        "tanggal": "2025-04-07",
        "isi": "Website perusahaan tidak dapat diakses sejak pagi ini, selalu menampilkan pesan error 503 yang mengindikasikan masalah server atau maintenance yang tidak terjadwal. Hal ini berdampak buruk pada reputasi perusahaan di mata klien dan pengguna. Mohon segera diperiksa dan diperbaiki agar website dapat kembali online sesegera mungkin tanpa menimbulkan kerugian lebih lanjut.",
        "email": "user11@example.com",
        "noHp": "082234567890",
        "createdBy": "James Liu",
        "type": "aduan",
        "status": "closed",
        "createdAt": "2025-04-07T06:30:00.000Z",
        "updatedAt": "2025-04-07T06:45:00.000Z"
    },
    {
        "id": "im9p9hl6-fm9q-flcn-keeo-helm9l6l6qq1",
        "judul": "Mouse rusak",
        "bidang": "administrasi",
        "tanggal": "2025-04-08",
        "isi": "Mouse di komputer saya tidak berfungsi dengan baik sejak kemarin, kursor sering macet dan klik tidak responsif, sehingga menyulitkan saya menyelesaikan tugas administrasi harian seperti input data dan pengeditan dokumen. Mohon segera diganti atau diperbaiki agar saya dapat bekerja dengan nyaman dan efisien tanpa gangguan teknis yang berkepanjangan ini.",
        "email": "user12@example.com",
        "noHp": "082345678901",
        "createdBy": "Clara Ho",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-04-08T09:00:00.000Z",
        "updatedAt": "2025-04-08T09:05:00.000Z"
    },
    {
        "id": "jn0q0im7-gn0r-gmdo-lffp-ifmn0m7m7rr2",
        "judul": "VPN error",
        "bidang": "it-support",
        "tanggal": "2025-04-09",
        "isi": "Koneksi VPN sering terputus saat bekerja dari rumah sejak dua hari terakhir, menyebabkan akses ke sistem internal perusahaan menjadi tidak stabil dan menghambat penyelesaian tugas penting. Hal ini sangat mengganggu produktivitas kerja jarak jauh. Mohon segera diperiksa dan diperbaiki agar koneksi VPN kembali stabil dan kami dapat bekerja dengan lancar.",
        "email": "user13@example.com",
        "noHp": "082456789012",
        "createdBy": "Peter Yang",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-04-09T10:30:00.000Z",
        "updatedAt": "2025-04-09T10:45:00.000Z"
    },
    {
        "id": "ko1r1jn8-ho1s-hnep-mggq-jgno1n8n8ss3",
        "judul": "Lampu mati",
        "bidang": "fasilitas",
        "tanggal": "2025-04-10",
        "isi": "Lampu di koridor lantai 4 mati total sejak sore ini, menyebabkan area tersebut gelap dan berpotensi membahayakan karyawan yang lelet jalannya, terutama saat pulang kerja. Hal ini juga mengganggu estetika gedung perusahaan. Mohon segera diperiksa dan diganti lampunya agar koridor kembali terang dan aman untuk dilewati kapan saja.",
        "email": "user14@example.com",
        "noHp": "082567890123",
        "createdBy": "Linda Zhang",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-04-10T15:00:00.000Z",
        "updatedAt": "2025-04-10T15:15:00.000Z"
    },
    {
        "id": "lp2s2ko9-ip2t-iofq-nhhr-khop2o9o9tt4",
        "judul": "Database error",
        "bidang": "infrastruktur",
        "tanggal": "2025-04-11",
        "isi": "Database utama mengalami error saat menjalankan query besar sejak pagi ini, menyebabkan aplikasi yang bergantung padanya tidak dapat berfungsi dengan baik dan sering timeout. Hal ini menghambat operasional tim yang membutuhkan data real-time. Mohon segera diperiksa dan diperbaiki agar sistem dapat kembali normal tanpa mengganggu produktivitas lebih lanjut.",
        "email": "user15@example.com",
        "noHp": "082678901234",
        "createdBy": "Mark Zhou",
        "type": "aduan",
        "status": "closed",
        "createdAt": "2025-04-11T12:00:00.000Z",
        "updatedAt": "2025-04-11T12:15:00.000Z"
    },
    {
        "id": "mq3t3lp0-jq3u-jpgr-oiis-lipq3p0p0uu5",
        "judul": "Monitor blank",
        "bidang": "administrasi",
        "tanggal": "2025-04-12",
        "isi": "Monitor di meja saya tiba-tiba blank saat digunakan tadi pagi, meskipun komputer masih menyala dan kabel sudah diperiksa, sehingga saya tidak bisa melanjutkan pekerjaan seperti biasa. Hal ini mengganggu proses input data harian. Mohon segera diperbaiki atau diganti agar saya dapat menyelesaikan tugas tanpa penundaan yang lebih lama lagi.",
        "email": "user16@example.com",
        "noHp": "082789012345",
        "createdBy": "Sophie Xu",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-04-12T14:30:00.000Z",
        "updatedAt": "2025-04-12T14:45:00.000Z"
    },
    {
        "id": "nr4u4mq1-kr4v-kqhs-pjjt-mjqr4q1q1vv6",
        "judul": "Jaringan WiFi lelet",
        "bidang": "it-support",
        "tanggal": "2025-04-13",
        "isi": "Kecepatan WiFi di lantai 6 sangat lambat sejak pagi ini, menyebabkan loading aplikasi dan akses internet menjadi terhambat, bahkan untuk tugas sederhana seperti mengirim email atau browsing. Hal ini mengganggu produktivitas tim secara keseluruhan. Mohon segera diperiksa dan ditingkatkan kecepatannya agar kami dapat bekerja dengan efisien kembali.",
        "email": "user17@example.com",
        "noHp": "082890123456",
        "createdBy": "Kevin Sun",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-04-13T08:15:00.000Z",
        "updatedAt": "2025-04-13T08:30:00.000Z"
    },
    {
        "id": "os5v5nr2-ls5w-lrit-qkku-nkrs5r2r2ww7",
        "judul": "Kursi rusak",
        "bidang": "fasilitas",
        "tanggal": "2025-04-14",
        "isi": "Kursi di ruang rapat lantai 3 patah sandarannya sejak kemarin, menyebabkan ketidaknyamanan saat digunakan dan berpotensi membahayakan pengguna karena tidak stabil. Hal ini juga mengurangi profesionalisme ruangan saat ada tamu. Mohon segera diganti atau diperbaiki agar ruang rapat dapat digunakan dengan nyaman dan aman untuk semua orang.",
        "email": "user18@example.com",
        "noHp": "082901234567",
        "createdBy": "Grace Li",
        "type": "aduan",
        "status": "closed",
        "createdAt": "2025-04-14T11:45:00.000Z",
        "updatedAt": "2025-04-14T12:00:00.000Z"
    },
    {
        "id": "pt6w6os3-mt6x-msju-rllv-olst6s3s3xx8",
        "judul": "API error",
        "bidang": "development",
        "tanggal": "2025-04-15",
        "isi": "API untuk modul pembayaran mengembalikan error 500 sejak pagi ini, menyebabkan transaksi online tidak dapat diproses dan mengganggu pengalaman pengguna serta potensi pendapatan perusahaan. Hal ini sangat mendesak karena berhubungan dengan klien eksternal. Mohon segera diperiksa dan diperbaiki agar sistem pembayaran kembali berfungsi normal tanpa masalah lebih lanjut.",
        "email": "user19@example.com",
        "noHp": "083012345678",
        "createdBy": "Brian Cao",
        "type": "aduan",
        "status": "process",
        "createdAt": "2025-04-15T09:30:00.000Z",
        "updatedAt": "2025-04-15T09:45:00.000Z"
    },
    {
        "id": "qu7x7pt4-nu7y-ntkv-smmw-pmtu7t4t4yy9",
        "judul": "UPS mati",
        "bidang": "infrastruktur",
        "tanggal": "2025-04-16",
        "isi": "UPS di ruang server tidak berfungsi saat listrik padam tadi malam, menyebabkan server mati mendadak dan data yang belum disimpan berisiko hilang, serta downtime yang tidak perlu. Hal ini sangat kritis untuk kelangsungan operasional. Mohon segera diperiksa dan diperbaiki agar UPS dapat melindungi server dari gangguan listrik di masa mendatang.",
        "email": "user20@example.com",
        "noHp": "083123456789",
        "createdBy": "Nancy Guo",
        "type": "aduan",
        "status": "open",
        "createdAt": "2025-04-16T13:00:00.000Z",
        "updatedAt": "2025-04-16T13:15:00.000Z"
    }
]; 


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const bidang = searchParams.get("bidang");
        const id = searchParams.get("id");
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

        if (id) {
            filteredData = filteredData.filter(item =>
                item.id === id
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

