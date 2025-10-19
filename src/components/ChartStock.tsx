"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartStockProps {
  data: {
    date: string;
    day: string;
    in: number;
    out: number;
  }[];
}

export default function ChartStock({ data }: ChartStockProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow px-6">
        {/* <h3 className="text-lg font-semibold mb-4 text-slate-800">Grafik Transaksi</h3> */}
        <div className="h-[350px] flex items-center justify-center text-gray-500">
          Tidak ada data transaksi
        </div>
      </div>
    );
  }

  const categories = data.map((item) => {
    const dateObj = new Date(item.date);
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });
  });

  const series = [
    {
      name: "Barang Masuk",
      data: data.map((item) => item.in),
    },
    {
      name: "Barang Keluar",
      data: data.map((item) => item.out),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        // easing: "easeinout",
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: "Jumlah",
      },
      labels: {
        formatter: function (val) {
          return Math.floor(val).toString();
        },
      },
    },
    colors: ["#2b80ff", "#ff2b72"],
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " unit";
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-center mb-4">
        {/* <h3 className="text-md font-semibold text-slate-800">Transaksi </h3> */}
        {/* <span className="text-md text-slate-500">
          Grafik Transaksi {data.length} hari terakhir
        </span> */}
      </div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
