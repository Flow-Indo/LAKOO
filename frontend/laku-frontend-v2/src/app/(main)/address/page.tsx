'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, MapPin, Phone, User, Building, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from '@/types/checkout';

// Mock addresses - in production, this would come from API/database
const initialAddresses: Address[] = [
  {
    id: '1',
    recipientName: 'John Doe',
    phone: '+62 812-3456-7890',
    fullAddress: 'Jl. Sudirman No. 123, Kelurahan Senayan, Kecamatan Kebayoran Baru',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    postalCode: '12190',
    isDefault: true,
  },
  {
    id: '2',
    recipientName: 'Jane Smith',
    phone: '+62 821-9876-5432',
    fullAddress: 'Jl. Thamrin No. 45, Kecamatan Menteng',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    district: 'Menteng',
    postalCode: '10310',
    isDefault: false,
  },
  {
    id: '3',
    recipientName: 'Robert Wilson',
    phone: '+62 856-1234-5678',
    fullAddress: 'Jl. Braga No. 78, Kelurahan Braga',
    province: 'Jawa Barat',
    city: 'Bandung',
    district: 'Sumur Bandung',
    postalCode: '40111',
    isDefault: false,
  },
];

export default function AddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({});

  const handleBack = () => {
    router.back();
  };

  const handleAddNew = () => {
    setFormData({
      recipientName: '',
      phone: '',
      fullAddress: '',
      province: '',
      city: '',
      district: '',
      postalCode: '',
      isDefault: addresses.length === 0,
    });
    setEditingId('new');
    setIsEditing(true);
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  const handleSave = () => {
    if (!formData.recipientName || !formData.phone || !formData.fullAddress) {
      alert('Mohon lengkapi semua data alamat');
      return;
    }

    if (editingId === 'new') {
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
      } as Address;
      setAddresses([...addresses, newAddress]);
    } else {
      setAddresses(addresses.map(a =>
        a.id === editingId ? { ...formData, id: a.id } as Address : a
      ));
    }

    setIsEditing(false);
    setEditingId(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({});
  };

  // Form validation
  const isFormValid = formData.recipientName && formData.phone && formData.fullAddress &&
    formData.province && formData.city && formData.district && formData.postalCode;

  if (isEditing) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handleCancel}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {editingId === 'new' ? 'Tambah Alamat' : 'Ubah Alamat'}
            </h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <User className="h-4 w-4" />
              Nama Penerima
            </label>
            <input
              type="text"
              value={formData.recipientName || ''}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="Nama lengkap"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442]"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 xxx-xxxx-xxxx"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442]"
            />
          </div>

          {/* Region */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Building className="h-4 w-4" />
              Wilayah
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.province || ''}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442] bg-white"
              >
                <option value="">Provinsi</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
              </select>
              <select
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442] bg-white"
              >
                <option value="">Kota/Kabupaten</option>
                <option value="Jakarta Selatan">Jakarta Selatan</option>
                <option value="Jakarta Pusat">Jakarta Pusat</option>
                <option value="Jakarta Barat">Jakarta Barat</option>
                <option value="Jakarta Timur">Jakarta Timur</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
              </select>
            </div>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Kecamatan/Kelurahan</label>
            <input
              type="text"
              value={formData.district || ''}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="Contoh: Kebayoran Baru, Senayan"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442]"
            />
          </div>

          {/* Detailed Address */}
          <div className="[py-2]">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Alamat Lengkap
            </label>
            <textarea
              value={formData.fullAddress || ''}
              onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
              placeholder="Contoh: Jl. Sudirman No. 123, Rt 003/Rw 002"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442] resize-none"
            />
          </div>

          {/* Postal Code */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Kode Pos</label>
            <input
              type="text"
              value={formData.postalCode || ''}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              placeholder="12345"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442]"
            />
          </div>

          {/* Set as Default */}
          <button
            onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              formData.isDefault
                ? 'border-[#FF2442] bg-[#FF2442]'
                : 'border-gray-300'
            }`}>
              {formData.isDefault && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700">Jadikan alamat utama</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button
            onClick={handleSave}
            disabled={!isFormValid}
            className="w-full py-4 text-base font-medium border-2 border-[#FF2442] bg-white text-[#FF2442] hover:bg-[#FFF0F3] rounded-full disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Simpan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Alamat Pengiriman</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Address List */}
      <div className="px-4 py-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Belum ada alamat tersimpan</p>
            <Button
              onClick={handleAddNew}
              className="px-6 py-3 border-2 border-[#FF2442] bg-white text-[#FF2442] hover:bg-[#FFF0F3] rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Alamat
            </Button>
          </div>
        ) : (
          <div className="py-4">
            {addresses.map((address, index) => (
              <div key={address.id}>
                <div
                  className={`
                    p-4 border rounded-xl transition-colors
                    ${address.isDefault ? 'border-[#FF2442] bg-[#FFF0F3]' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-[#FF2442] text-white text-xs font-medium rounded">
                            Utama
                          </span>
                        )}
                        <span className="font-semibold text-gray-900">
                          {address.recipientName}
                        </span>
                        <span className="text-gray-500">
                          {address.phone}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {address.fullAddress}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.district}, {address.city}, {address.province} {address.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#FF2442] hover:bg-[#FFF0F3] rounded-lg transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Jadikan Utama
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </div>
                {index < addresses.length - 1 && (
                  <div className="h-4" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Button */}
        <button
          onClick={handleAddNew}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-[#FF2442] hover:text-[#FF2442] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Tambah Alamat Baru</span>
        </button>
      </div>
    </div>
  );
}
