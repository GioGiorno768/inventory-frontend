"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start_date: format(new Date(), "yyyy-MM-01"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  });

  const handleDownloadReport = async (reportType: "items" | "transactions") => {
    setIsLoading(reportType);

    try {
      let url = `/reports/${reportType}/pdf`;

      if (reportType === "transactions") {
        url += `?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`;
      }

      const response = await api.get(url, {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `laporan-${reportType}-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Laporan berhasil didownload");
    } catch (error: any) {
      toast.error("Gagal mendownload laporan");
    } finally {
      setIsLoading(null);
    }
  };

  const reports = [
    {
      id: "items",
      title: "Laporan Data Barang",
      description: "Daftar lengkap semua barang dengan status stok",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      bgDownloadColor: "bg-blue-600",
      // hasDateFilter: true,
    },
    {
      id: "transactions",
      title: "Laporan Transaksi",
      description: "Riwayat transaksi barang masuk dan keluar",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      bgDownloadColor: "bg-green-600",
      hasDateFilter: true,
    },
    // {
    //   id: "stock",
    //   title: "Laporan Stok Barang",
    //   description: "Laporan stok barang dengan peringatan stok rendah",
    //   icon: FileText,
    //   color: "yellow",
    // },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <p className="text-gray-600 mt-1">Download laporan dalam format PDF</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div
              className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center mb-4`}
            >
              <report.icon className={`w-6 h-6 ${report.color}`} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>

            {report.hasDateFilter && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={dateRange.start_date}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={dateRange.end_date}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() =>
                handleDownloadReport(report.id as "items" | "transactions")
              }
              disabled={isLoading === report.id}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${report.bgDownloadColor} text-white rounded-lg hover:${report.bgDownloadColor}-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading === report.id ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        ))}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Informasi</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Laporan akan didownload dalam format PDF</li>
            <li>
              • Laporan Transaksi dapat difilter berdasarkan rentang tanggal
            </li>
            <li>• Laporan Stok menampilkan barang dengan stok rendah</li>
            <li>• Semua laporan mencantumkan tanggal cetak dan nama petugas</li>
          </ul>
        </div>
      </div>

      {/* Info Section */}
    </div>
  );
}
