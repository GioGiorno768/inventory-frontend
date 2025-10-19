"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Transaction, Item, PaginatedResponse } from "@/lib/types";
import DataTable from "@/components/DataTable";
import ModalForm from "@/components/ModalForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Plus, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function TransactionsPage() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    item_id: "",
    type: "in" as "in" | "out",
    quantity: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetchTransactions();
    fetchItems();
  }, [typeFilter, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append("type", typeFilter);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const { data } = await api.get<PaginatedResponse<Transaction>>(
        `/transactions?${params}`
      );
      setTransactions(data.data);
    } catch (error) {
      toast.error("Gagal memuat data transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Item>>(
        "/items?per_page=100"
      );
      setItems(data.data);
    } catch (error) {
      console.error("Gagal memuat data barang");
    }
  };

  const handleOpenModal = () => {
    setFormData({
      item_id: "",
      type: "in",
      quantity: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("item_id", formData.item_id);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("quantity", formData.quantity.toString());
      formDataToSend.append("date", formData.date);
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      await api.post("/transactions", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Transaksi berhasil ditambahkan");
      handleCloseModal();
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal menyimpan transaksi");
    }
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/transactions/${transactionToDelete.id}`);
      toast.success("Transaksi berhasil dihapus");
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal menghapus transaksi");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleDownloadFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const columns = [
    {
      key: "date",
      label: "Tanggal",
      render: (item: Transaction) =>
        format(new Date(item.date), "dd MMM yyyy", { locale: id }),
    },
    {
      key: "item",
      label: "Barang",
      render: (item: Transaction) => item.item?.name || "-",
    },
    {
      key: "type",
      label: "Tipe",
      render: (item: Transaction) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.type === "in"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.type === "in" ? "Masuk" : "Keluar"}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Jumlah",
      render: (item: Transaction) =>
        `${item.quantity} ${item.item?.unit || ""}`,
    },
    {
      key: "user",
      label: "Petugas",
      render: (item: Transaction) => item.user?.name || "-",
    },
    {
      key: "description",
      label: "Keterangan",
      render: (item: Transaction) => item.description || "-",
    },
    // {
    //   key: "file",
    //   label: "File",
    //   render: (item: Transaction) =>
    //     item.file_path ? (
    //       <button
    //         onClick={() => handleDownloadFile(item.file_path!)}
    //         className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
    //       >
    //         <Download className="w-4 h-4" />
    //         Lihat
    //       </button>
    //     ) : (
    //       "-"
    //     ),
    // },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Data Transaksi</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline-block">Tambah Transaksi</span>
          
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              <option value="in">Barang Masuk</option>
              <option value="out">Barang Keluar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
            />
          </div>

          {(typeFilter || startDate || endDate) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setTypeFilter("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={transactions}
        columns={columns}
        onDelete={isAdmin ? handleDeleteClick : undefined}
        // onEdit={isAdmin ? handleEditClick : undefined}
        isLoading={isLoading}
      />

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Tambah Transaksi"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barang *
            </label>
            <select
              value={formData.item_id}
              onChange={(e) =>
                setFormData({ ...formData, item_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Barang</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Stok: {item.stock} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Transaksi *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "in" | "out",
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
              required
            >
              <option value="in">Barang Masuk</option>
              <option value="out">Barang Keluar</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
              rows={3}
              placeholder="Keterangan tambahan..."
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Bukti (Optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files?.[0] || null })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: JPG, PNG, PDF, DOC, XLS (Max 2MB)
            </p>
          </div> */}
        </div>
      </ModalForm>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Hapus Transaksi"
        message={`Apakah Anda yakin ingin menghapus transaksi ${
          transactionToDelete?.type === "in" ? "masuk" : "keluar"
        } barang "${transactionToDelete?.item?.name}" sebanyak ${
          transactionToDelete?.quantity
        } ${
          transactionToDelete?.item?.unit
        }? Stok barang akan dikembalikan ke kondisi sebelumnya.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
