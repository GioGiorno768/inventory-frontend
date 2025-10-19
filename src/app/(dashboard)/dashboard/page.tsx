"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import CardSummary from "@/components/CardSummary";
import ChartStock from "@/components/ChartStock";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartDays, setChartDays] = useState(7);

  useEffect(() => {
    fetchStats();
  }, [chartDays]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [chartDays]);

  const fetchStats = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setIsRefreshing(true);

      const { data } = await api.get<DashboardStats>(
        `/dashboard?days=${chartDays}`
      );
      setStats(data);

      if (silent) {
        toast.success("Data berhasil diperbarui", { duration: 2000 });
      }
    } catch (error: any) {
      if (!silent) {
        toast.error("Gagal memuat data dashboard");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSummary
          title="Total Barang"
          value={stats?.summary.total_items || 0}
          icon={Package}
          color="blue"
          subtitle={`Total stok: ${stats?.summary.total_stock || 0}`}
        />
        <CardSummary
          title="Transaksi Hari Ini"
          value={stats?.summary.today_transactions || 0}
          icon={TrendingUp}
          color="green"
          subtitle={`Bulan ini: ${stats?.summary.month_transactions || 0}`}
        />
        <CardSummary
          title="Total Transaksi"
          value={stats?.summary.total_transactions || 0}
          icon={TrendingDown}
          color="yellow"
        />
        <CardSummary
          title="Stok Rendah"
          value={stats?.summary.low_stock_count || 0}
          icon={AlertTriangle}
          color="red"
          subtitle="Perlu restock"
        />
      </div>

      {/* Chart dengan Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Grafik Transaksi
            </h3>
            <h3 className="text-md font text-slate-500">
              {stats?.chart_data.length} Hari Terakhir
            </h3>
            {/* {stats?.chart_period && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(stats.chart_period.start).toLocaleDateString("id-ID")}{" "}
                - {new Date(stats.chart_period.end).toLocaleDateString("id-ID")}
              </p>
            )} */}
          </div>

          {/* DROPDOWN FILTER WITH ICON */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 pointer-events-none" />
            <select
              value={chartDays}
              onChange={(e) => setChartDays(Number(e.target.value))}
              className="pl-10 pr-8 py-2 text-sm border border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer text-blue-900"
            >
              <option value={7}>7 Hari</option>
              <option value={14}>14 Hari</option>
              <option value={30}>30 Hari</option>
              <option value={60}>60 Hari</option>
              <option value={90}>90 Hari</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {stats?.chart_data && stats.chart_data.length > 0 ? (
          <ChartStock data={stats.chart_data} />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            Tidak ada data transaksi
          </div>
        )}
      </div>

      <div className="flex justify-stretch  gap-5 lg:flex-row flex-col">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow flex-1">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Transaksi Terbaru
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats?.recent_transactions &&
              stats.recent_transactions.length > 0 ? (
                stats.recent_transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "in"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "in" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.item?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.user?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.type === "in"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "in" ? "+" : "-"}
                        {transaction.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.date), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Belum ada transaksi
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow flex-1 h-fit">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Barang Stok Rendah
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats?.low_stock_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#ff2b72]">
                      {item.stock} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {item.threshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* {stats?.low_stock_items && stats.low_stock_items.length > 0 && (
        )} */}
      </div>
    </div>
  );
}
