
import { Doughnut, Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { useStatistikPermohonanCuti } from '@/hooks/fetch/cuti/useCutiState';

// Pastikan pendaftaran ini mencakup LineElement dan PointElement
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, PointElement, LineElement);

interface ChartProps { title: string; data: { label: string; value: number; }[]; }

// Type definitions untuk response API
interface DistribusiItem {
    status?: string;
    jenisNama?: string;
    jumlah: number;
}

interface TrendBulanItem {
    bulan: string;
    jumlah: number;
}

interface TopPegawaiItem {
    nip: string;
    nama: string;
    totalHari: number;
}

interface StatistikPermohonanCutiData {
    totalPermohonan: number;
    rataRataLamaCuti: number;
    distribusiStatus: DistribusiItem[];
    distribusiJenisCuti: DistribusiItem[];
    trendPermohonanPerBulan: TrendBulanItem[];
    topPegawaiCutiTerbanyak: TopPegawaiItem[];
}
const panzeColors = [
    '#5883F8', // Biru terang
    '#FFC23B', // Kuning terang
    '#4ADF97', // Hijau terang
    '#FF85A2', // Pink muda
    '#9B59B6', // Ungu
    // ... colors lainnya
];

// --- Statistik Doughnut Chart (Legend Kanan & Fix Type Error) ---
const StatistikDoughnutChart: React.FC<ChartProps> = ({ title, data }) => {
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            label: 'Jumlah',
            data: data.map(item => item.value),
            backgroundColor: panzeColors.slice(0, data.length),
            borderColor: 'rgba(255, 255, 255, 0.9)', 
            borderWidth: 4, 
            hoverOffset: 12, 
        }],
    };
    
    const options = { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { 
            legend: { 
                position: 'right' as const, // Legend dipindah ke kanan
                labels: { 
                    usePointStyle: true,
                    boxWidth: 8, 
                    padding: 15, 
                    // Menghapus 'font' properti untuk menghindari Type Error
                } 
            }, 
            title: { 
                display: false,
            } 
        },
        cutout: '70%', 
    } as any; // Menggunakan 'as any' sementara jika error tetap muncul, tapi idealnya perbaikan di atas cukup

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-[400px] flex flex-col items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full text-center">{title}</h3>
            <div className="w-full max-w-sm flex-grow">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

// --- Statistik Line Chart (Menggantikan Bar Chart) ---
const StatistikLineChart: React.FC<ChartProps> = ({ title, data }) => {
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            label: 'Jumlah Permohonan',
            data: data.map(item => item.value),
            backgroundColor: panzeColors[0],
            borderColor: panzeColors[0],
            borderWidth: 3,
            fill: false, // Penting untuk Line Chart
            tension: 0.4, // Untuk garis yang melengkung
            pointRadius: 6,
            pointBackgroundColor: 'white',
            pointBorderWidth: 2,
        }],
    };
    const options = { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            title: { 
                display: true, 
                text: title, 
                font: { size: 18, weight: 'bold' as const }, 
                color: '#333' 
            } 
        }, 
        scales: { 
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            },
            y: { 
                beginAtZero: true,
                grid: { color: '#f0f0f0' },
                ticks: { font: { size: 11 } }
            }
        }
    };
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-[400px]">
            <Line data={chartData} options={options} /> {/* Menggunakan komponen Line */}
        </div>
    );
};

// --- Komponen Ringkasan Kecil ---
const RingkasanCard: React.FC<{ title: string; value: string | number; description: string; icon?: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between items-start">
        <div className="flex items-center space-x-2 mb-2">
            {icon && <div className="text-blue-500 text-xl">{icon}</div>}
            <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
);


// =========================================================================
// 🚀 KOMPONEN UTAMA
// =========================================================================

interface DashboardProps { filters: any }

export const StatistikPermohonanCutiDashboard: React.FC<DashboardProps> = ({ filters }) => {
    const { 
        data: apiResponse, 
        isLoading, 
        isError, 
        error 
    } = useStatistikPermohonanCuti(filters);
    
    const apiData = apiResponse?.data as StatistikPermohonanCutiData | undefined;

    // ... (Loading dan Error states) ...
    if (isLoading) {
        return <div className="p-8 text-center text-lg text-blue-600 rounded-2xl border border-gray-100 bg-white">Memuat Statistik Permohonan Cuti...</div>;
    }

    if (isError) {
        return <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            ❌ Gagal memuat data: {error?.message}
        </div>;
    }

    if (!apiData) {
        return <div className="p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-2xl">
            Data statistik permohonan cuti tidak tersedia.
        </div>;
    }

    const statusDataForChart = apiData.distribusiStatus.map((item: DistribusiItem) => ({
        label: item.status!.replace(/_/g, ' '), 
        value: item.jumlah
    }));

    const jenisCutiDataForChart = apiData.distribusiJenisCuti.map((item: DistribusiItem) => ({
        label: item.jenisNama!,
        value: item.jumlah
    }));
    
    const trendDataForChart = apiData.trendPermohonanPerBulan.map((item: TrendBulanItem) => ({
        label: item.bulan,
        value: item.jumlah
    }));

    // --- Render Component ---
    return (
        <div className="space-y-6 p-4 md:p-8 rounded-3xl bg-gray-50 min-h-screen"> 
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Project Dashboard</h1>

            {/* Ringkasan Kunci */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RingkasanCard 
                    title="Total Permohonan" 
                    value={apiData.totalPermohonan.toLocaleString()} 
                    description="Jumlah permohonan cuti dalam periode ini."
                    icon="📋"
                />
                <RingkasanCard 
                    title="Rata-rata Lama Cuti" 
                    value={`${apiData.rataRataLamaCuti.toFixed(2)} Hari`} 
                    description="Rata-rata hari yang diajukan per permohonan."
                    icon="⏱️"
                />
                <RingkasanCard 
                    title="Permohonan Terbanyak" 
                    value={apiData.topPegawaiCutiTerbanyak[0]?.totalHari || 0} 
                    description={`Pegawai: ${apiData.topPegawaiCutiTerbanyak[0]?.nama || '-'}`}
                    icon="🥇"
                />
            </div>
            
            {/* Distribusi (Doughnut Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatistikDoughnutChart
                    title="Distribusi Permohonan Berdasarkan Status"
                    data={statusDataForChart}
                />
                <StatistikDoughnutChart
                    title="Distribusi Permohonan Berdasarkan Jenis Cuti"
                    data={jenisCutiDataForChart}
                />
            </div>

            {/* Tren & Top Pegawai */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tren Permohonan Per Bulan (Line Chart) */}
                <div className="lg:col-span-2">
                    <StatistikLineChart // Menggunakan Line Chart
                        title="Tren Permohonan Cuti Per Bulan"
                        data={trendDataForChart}
                    />
                </div>

                {/* Top Pegawai (Table/List) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">🥇 Top 5 Pegawai Cuti Terbanyak</h3>
                    <ul className="space-y-2">
                        {apiData.topPegawaiCutiTerbanyak.map((pegawai: any, index: number) => (
                            <li key={pegawai.nip} className="p-3 border-b border-gray-100 last:border-b-0 flex justify-between items-center">
                                <span className="font-medium text-gray-700">{index + 1}. {pegawai.nama}</span>
                                <span className="text-sm font-bold text-blue-600">{pegawai.totalHari} Hari</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};