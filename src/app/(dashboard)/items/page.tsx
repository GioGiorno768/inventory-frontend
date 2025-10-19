'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Item, PaginatedResponse } from '@/lib/types';
import DataTable from '@/components/DataTable';
import ModalForm from '@/components/ModalForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Plus, Search, Filter } from 'lucide-react';

export default function ItemsPage() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    unit: '',
    threshold: 0,
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [search, category]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const { data } = await api.get<PaginatedResponse<Item>>(`/items?${params}`);
      setItems(data.data);
    } catch (error) {
      toast.error('Gagal memuat data barang');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get<string[]>('/items/categories');
      setCategories(data);
    } catch (error) {
      console.error('Gagal memuat kategori');
    }
  };

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        stock: item.stock,
        unit: item.unit,
        threshold: item.threshold,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: '',
        stock: 0,
        unit: '',
        threshold: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await api.put(`/items/${editingItem.id}`, formData);
        toast.success('Barang berhasil diupdate');
      } else {
        await api.post('/items', formData);
        toast.success('Barang berhasil ditambahkan');
      }
      
      handleCloseModal();
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Gagal menyimpan data');
    }
  };

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/items/${itemToDelete.id}`);
      toast.success('Barang berhasil dihapus');
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Gagal menghapus barang');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    { key: 'name', label: 'Nama Barang' },
    { key: 'category', label: 'Kategori' },
    {
      key: 'stock',
      label: 'Stok',
      render: (item: Item) => (
        <span className={item.stock <= item.threshold ? 'text-red-600 font-bold' : ''}>
          {item.stock} {item.unit}
        </span>
      ),
    },
    {
      key: 'threshold',
      label: 'Min. Stok',
      render: (item: Item) => `${item.threshold} ${item.unit}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Item) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.stock <= item.threshold
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {item.stock <= item.threshold ? 'Stok Rendah' : 'Normal'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Data Barang</h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span className='hidden sm:inline-block'>Tambah Barang</span>
            
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800  focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {(search || category) && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={items}
        columns={columns}
        onEdit={isAdmin ? handleOpenModal : undefined}
        onDelete={isAdmin ? handleDeleteClick : undefined}
        isLoading={isLoading}
      />

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Barang' : 'Tambah Barang'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Barang *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
              list="categories"
              required
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-slate-800 focus:ring-blue-500"
                placeholder="pcs, kg, liter"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batas Minimum Stok *
            </label>
            <input
              type="number"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  text-slate-800 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </div>
      </ModalForm>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Hapus Barang"
        message={`Apakah Anda yakin ingin menghapus barang "${itemToDelete?.name}"? Semua transaksi terkait barang ini juga akan terhapus.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}