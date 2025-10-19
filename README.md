# 🧭 Smart Inventory Management System (Frontend)

> **Smart Inventory Management System** adalah aplikasi web berbasis cloud yang dirancang untuk membantu perusahaan dalam mengelola inventori barang secara efisien dan real-time.  
> Aplikasi ini dikembangkan menggunakan **Next.js + TypeScript**, dan terintegrasi penuh dengan backend **Laravel RESTful API**.

---
---

## 📋 Table of Contents

- [Tentang Aplikasi](#tentang-aplikasi)
- [Tech Stack](#tech-stack)
- [Fitur Utama](#fitur-utama)
- [Struktur Folder](#struktur-folder)
- [Instalasi dan Konfigurasi](#instalasi-dan-konfigurasi)
- [Environment Variables](#environment-variables)
- [Perintah Penggunaan](#perintah-penggunaan)
- [Deployment](#deployment)
- [Akun Demo](#akun-demo)
- [Lisensi dan Informasi](#lisensi-dan-informasi)

---

## 🧾 Tentang Aplikasi

**Smart Inventory Management System** membantu perusahaan atau tim gudang dalam:
- Mencatat dan memantau stok barang secara digital.
- Mengelola transaksi barang masuk dan keluar.
- Menyediakan laporan otomatis dalam format PDF.
- Memberikan notifikasi otomatis untuk stok rendah.
- Mempercepat efisiensi operasional gudang.

### 🎯 Tujuan Utama
- Digitalisasi manajemen stok barang.
- Otomatisasi laporan inventori.
- Monitoring transaksi real-time.
- Meningkatkan efisiensi operasional gudang/inventori.

---

## ⚙️ Tech Stack

| Kategori | Teknologi | Versi | Keterangan |
|-----------|------------|--------|-------------|
| **Framework** | Next.js | 14+ | Frontend utama |
| **Bahasa** | TypeScript | 5.x | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 3.x | Styling modern dan responsif |
| **State Management** | Zustand | Latest | Global store untuk state user & data |
| **HTTP Client** | Axios | Latest | Komunikasi dengan REST API backend |
| **Notification** | React Hot Toast | Latest | Notifikasi feedback interaktif |
| **Chart** | ApexCharts | Latest | Visualisasi data dashboard |
| **Date Utility** | Date-fns | Latest | Format & manipulasi tanggal |

---

## 🚀 Fitur Utama

### 🔐 Autentikasi Multi-Role
- Login dengan JWT Token.
- Role-based Routing (Admin / Staff).

### 📊 Dashboard Interaktif
- Statistik real-time jumlah barang & transaksi.
- Visualisasi grafik menggunakan ApexCharts.

### 📦 Manajemen Barang
- CRUD (Create, Read, Update, Delete) data barang.
- Filter & notifikasi stok rendah.

### 🔁 Transaksi Barang
- Catatan barang masuk & keluar.

### 📑 Laporan Otomatis
- Export laporan **barang**, **transaksi**, dan **stok** ke PDF.
- Filter tanggal untuk laporan transaksi.

### 👥 Manajemen User (Admin Only)
- Tambah, edit, dan hapus user (Admin & Staff).

---

## 📂 Struktur Folder

src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ ├── login/
│ ├── dashboard/
│ ├── items/
│ ├── transactions/
│ ├── reports/
│ └── users/
├── components/
│ ├── Navbar.tsx
│ ├── Sidebar.tsx
│ ├── ModalForm.tsx
│ └── ...
├── lib/
│ ├── api.ts
│ ├── store.ts
│ └── utils.ts
├── hooks/
│ └── useAuth.ts
└── styles/
└── globals.css


