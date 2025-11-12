"use client";

import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";

import {
  useStatistikPermohonanCuti,
  useStatistikPersetujuan,
  useStatistikJatahCuti,
  useStatistikGabungan,
  useDashboardStatistik,
  useStatistikPembuatPermohonan,
  useStatistikDetailApprover,
  useStatistikEfisiensiPersetujuan,
  useStatistikPuncakPermohonan,
  useStatistikPrediksiKebutuhan,
  useStatistikHealthCheck,
  StatistikFilters,
  DashboardStatistik,
} from "@/hooks/fetch/cuti/useCutiState";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

// 📊 Dummy hook untuk Statistik Realtime (jika belum ada di hooks utama)
const useStatistikRealtime = (filters: StatistikFilters = {}) => ({
  data: { data: [] },
  isLoading: false,
  isError: false,
  error: null,
});

// 🎨 Warna palet grafik
const panzeColors = [
  "#5883F8",
  "#FFC23B",
  "#4ADF97",
  "#FF85A2",
  "#9B59B6",
  "#3498DB",
  "#E74C3C",
  "#F39C12",
  "#1ABC9C",
  "#95A5A6",
];

// ========================================================================
// 🧩 CHART COMPONENTS
// ========================================================================

interface ChartProps {
  title: string;
  data: { label: string; value: number }[];
}

const StatistikDoughnutChart: React.FC<ChartProps> = ({ title, data }) => {
  if (!data?.length)
    return <EmptyState message={`Tidak ada data ${title}`} />;

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Jumlah",
        data: data.map((d) => d.value),
        backgroundColor: panzeColors.slice(0, data.length),
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="h-[320px]">
        <Doughnut data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

const StatistikLineChart: React.FC<ChartProps> = ({ title, data }) => {
  if (!data?.length)
    return <EmptyState message={`Tidak ada data ${title}`} />;

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Jumlah",
        data: data.map((d) => d.value),
        borderColor: panzeColors[0],
        backgroundColor: panzeColors[0],
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};

const StatistikBarChart: React.FC<ChartProps> = ({ title, data }) => {
  if (!data?.length)
    return <EmptyState message={`Tidak ada data ${title}`} />;

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Jumlah",
        data: data.map((d) => d.value),
        backgroundColor: panzeColors[0],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

// ========================================================================
// 🧩 REUSABLE UI ELEMENTS
// ========================================================================

const LoadingState = ({ message = "Memuat data..." }) => (
  <div className="p-8 text-center text-blue-600 bg-white border rounded-2xl">
    {message}
  </div>
);

const ErrorState = ({ error }: { error: any }) => (
  <div className="p-8 text-red-600 bg-red-50 border border-red-300 rounded-2xl">
    ❌ Gagal memuat data: {error?.message || "Terjadi kesalahan"}
  </div>
);

const EmptyState = ({ message = "Data tidak tersedia" }) => (
  <div className="p-8 text-yellow-700 bg-yellow-50 border border-yellow-300 rounded-2xl">
    {message}
  </div>
);

const RingkasanCard = ({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon?: string;
}) => (
  <div className="bg-white p-6 rounded-2xl border flex flex-col justify-between">
    <div className="flex items-center space-x-2 mb-2">
      {icon && <span className="text-xl">{icon}</span>}
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

// ========================================================================
// 🚀 DASHBOARD UTAMA
// ========================================================================

export const AllStatistikCutiDashboard = ({
  filters,
}: {
  filters: StatistikFilters;
}) => {
  const statistikPermohonan = useStatistikPermohonanCuti(filters);
  const statistikPersetujuan = useStatistikPersetujuan(filters);
  const statistikJatah = useStatistikJatahCuti(filters);
  const statistikGabungan = useStatistikGabungan(filters);
  const dashboardStatistik = useDashboardStatistik(filters);
  const statistikPembuatPermohonan = useStatistikPembuatPermohonan(filters);
  const statistikDetailApprover = useStatistikDetailApprover(filters);
  const statistikEfisiensi = useStatistikEfisiensiPersetujuan(filters);
  const statistikPuncak = useStatistikPuncakPermohonan(filters);
  const statistikPrediksi = useStatistikPrediksiKebutuhan(filters);
  const statistikRealtime = useStatistikRealtime(filters);
  const statistikHealth = useStatistikHealthCheck();

  const isLoading =
    statistikPermohonan.isLoading ||
    statistikPersetujuan.isLoading ||
    statistikJatah.isLoading ||
    dashboardStatistik.isLoading ||
    statistikPembuatPermohonan.isLoading ||
    statistikDetailApprover.isLoading ||
    statistikEfisiensi.isLoading ||
    statistikPuncak.isLoading ||
    statistikPrediksi.isLoading ||
    statistikHealth.isLoading;

  if (isLoading) return <LoadingState message="Memuat semua statistik..." />;

  const dashboardData = dashboardStatistik.data?.data as DashboardStatistik;

  const toChartData = <T,>(
    arr: T[],
    labelKey: keyof T,
    valueKey: keyof T
  ): { label: string; value: number }[] =>
    Array.isArray(arr)
      ? arr.map((item: any) => ({
          label: String(item[labelKey]),
          value: Number(item[valueKey]),
        }))
      : [];

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        📊 Dashboard Statistik Cuti
      </h1>

      {/* RINGKASAN */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <RingkasanCard
            title="Total Permohonan"
            value={dashboardData.totalPermohonan || 0}
            description="Jumlah total permohonan cuti"
            icon="📋"
          />
          <RingkasanCard
            title="Total Pegawai"
            value={dashboardData.totalPegawai || 0}
            description="Jumlah pegawai aktif"
            icon="👥"
          />
          <RingkasanCard
            title="Rata-rata Waktu Persetujuan"
            value={dashboardData.rataRataWaktuPersetujuan?.toFixed(2) || "0"}
            description="Waktu persetujuan rata-rata"
            icon="⏱️"
          />
          <RingkasanCard
            title="Catatan"
            value="OK"
            description={dashboardData.catatan || ""}
            icon="📝"
          />
        </div>
      )}

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatistikDoughnutChart
          title="Distribusi Status Permohonan"
          data={toChartData(
            statistikPermohonan.data?.data?.distribusiStatus || [],
            "status",
            "jumlah"
          )}
        />
        <StatistikBarChart
          title="Distribusi Jenis Cuti"
          data={toChartData(
            statistikPermohonan.data?.data?.distribusiJenisCuti || [],
            "jenisNama",
            "jumlah"
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatistikLineChart
          title="Trend Permohonan per Bulan"
          data={toChartData(
            statistikPermohonan.data?.data?.trendPermohonanPerBulan || [],
            "bulan",
            "jumlah"
          )}
        />
        <StatistikLineChart
          title="Trend Tahunan Cuti"
          data={toChartData(
            statistikJatah.data?.data?.trendTahunan || [],
            "tahun",
            "totalPermohonan"
          )}
        />
      </div>

      {/* HEALTH CHECK */}
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-4">🔍 Health Check</h3>
        {statistikHealth.isError ? (
          <ErrorState error={statistikHealth.error} />
        ) : statistikHealth.data?.data ? (
          <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
            {JSON.stringify(statistikHealth.data.data, null, 2)}
          </pre>
        ) : (
          <EmptyState message="Data health check tidak tersedia" />
        )}
      </div>
    </div>
  );
};

export default AllStatistikCutiDashboard;
