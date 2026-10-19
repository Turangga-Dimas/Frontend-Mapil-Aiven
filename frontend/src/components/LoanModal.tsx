'use client';

import React, { useState, useEffect } from 'react';
import { Loan } from '../types/loan';
import { X, Calculator, UserCheck, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Loan>) => Promise<void>;
  initialData?: Loan | null;
}

export default function LoanModal({ isOpen, onClose, onSubmit, initialData }: LoanModalProps) {
  const [formData, setFormData] = useState({
    borrower_name: '',
    nik: '',
    phone: '',
    email: '',
    occupation: 'Karyawan Swasta',
    monthly_income: '7500000',
    amount: '10000000',
    tenor_months: 12,
    purpose: '',
    interest_rate: 1.5,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        borrower_name: initialData.borrower_name,
        nik: initialData.nik,
        phone: initialData.phone,
        email: initialData.email,
        occupation: initialData.occupation,
        monthly_income: String(initialData.monthly_income),
        amount: String(initialData.amount),
        tenor_months: Number(initialData.tenor_months),
        purpose: initialData.purpose || '',
        interest_rate: Number(initialData.interest_rate) || 1.5,
      });
    } else {
      setFormData({
        borrower_name: '',
        nik: '',
        phone: '',
        email: '',
        occupation: 'Karyawan Swasta',
        monthly_income: '7500000',
        amount: '10000000',
        tenor_months: 12,
        purpose: '',
        interest_rate: 1.5,
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Kalkulasi Simulasi
  const principal = parseFloat(formData.amount) || 0;
  const tenor = Number(formData.tenor_months) || 1;
  const rate = Number(formData.interest_rate) / 100;
  const monthlyInterest = principal * rate;
  const monthlyPrincipal = principal / tenor;
  const monthlyInstallment = Math.round(monthlyPrincipal + monthlyInterest);
  const totalPayment = monthlyInstallment * tenor;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.borrower_name || !formData.nik || !formData.phone || !formData.email) {
      setError('Harap lengkapi semua data profil peminjam.');
      return;
    }

    if (formData.nik.length < 16) {
      setError('NIK harus minimal 16 digit.');
      return;
    }

    if (principal < 1000000) {
      setError('Minimal pinjaman adalah Rp 1.000.000');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        borrower_name: formData.borrower_name,
        nik: formData.nik,
        phone: formData.phone,
        email: formData.email,
        occupation: formData.occupation,
        monthly_income: parseFloat(formData.monthly_income),
        amount: principal,
        tenor_months: tenor,
        purpose: formData.purpose,
        interest_rate: formData.interest_rate,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Data Pengajuan Pinjaman' : 'Form Pengajuan Pinjaman Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Pencatatan data peminjam & simulasi angsuran berbasis MySQL Aiven
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nama Lengkap Peminjam *
              </label>
              <input
                type="text"
                required
                value={formData.borrower_name}
                onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* NIK */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                NIK (KTP 16 Digit) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                placeholder="3201123456780001"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* No WhatsApp / HP */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                No. WhatsApp / Telepon *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Email Peminjam *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="budi.santoso@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Pekerjaan */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Pekerjaan Peminjam *
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="Karyawan Swasta">Karyawan Swasta</option>
                <option value="Pegawai Negeri Sipil">Pegawai Negeri Sipil (PNS)</option>
                <option value="Wirausaha / UMKM">Wirausaha / UMKM</option>
                <option value="Freelancer / Profesional">Freelancer / Profesional</option>
                <option value="Tenaga Medis / Pengajar">Tenaga Medis / Pengajar</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Pendapatan Bulanan */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Pendapatan Bulanan (Rp) *
              </label>
              <input
                type="number"
                min="1000000"
                step="500000"
                required
                value={formData.monthly_income}
                onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Section Pinjaman & Tenor */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Detail Pinjaman & Tenor</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jumlah Pinjaman */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Jumlah Pinjaman (Rp) *
                </label>
                <input
                  type="number"
                  min="1000000"
                  step="500000"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition font-mono"
                />
              </div>

              {/* Tenor */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Tenor Pinjaman *
                </label>
                <select
                  value={formData.tenor_months}
                  onChange={(e) => setFormData({ ...formData, tenor_months: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={18}>18 Bulan (1.5 Tahun)</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                  <option value={36}>36 Bulan (3 Tahun)</option>
                </select>
              </div>

              {/* Bunga per Bulan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Suku Bunga / Bulan (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 1.5 })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition font-mono"
                />
              </div>
            </div>

            {/* Preview Kalkulasi Otomatis */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center">
                <span className="text-slate-400">Cicilan per Bulan:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  Rp {monthlyInstallment.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center">
                <span className="text-slate-400">Total Pengembalian:</span>
                <span className="font-bold text-sky-400 font-mono text-sm">
                  Rp {totalPayment.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Keperluan Pinjaman */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Keperluan / Tujuan Pinjaman
            </label>
            <textarea
              rows={2}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Contoh: Modal tambahan untuk pengadaan bahan baku usaha restoran"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{initialData ? 'Simpan Perubahan' : 'Ajukan Pinjaman'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
