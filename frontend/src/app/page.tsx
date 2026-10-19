'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Database,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Users,
  Check
} from 'lucide-react';
import { Loan, LoanStats, HealthStatus, LoanStatus } from '../types/loan';
import {
  fetchHealth,
  fetchStats,
  fetchLoans,
  createLoan,
  updateLoan,
  updateLoanStatus,
  deleteLoan
} from '../lib/api';
import LoanModal from '../components/LoanModal';
import LoanDetailModal from '../components/LoanDetailModal';
import AivenHelpModal from '../components/AivenHelpModal';
import PresentationGuideModal from '../components/PresentationGuideModal';
import CreditCalculator from '../components/CreditCalculator';

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState<LoanStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isAivenModalOpen, setIsAivenModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'loans' | 'calculator'>('loans');

  // Toast / notification state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [healthData, statsData, loansData] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchStats().catch(() => null),
        fetchLoans({ status: statusFilter, search: searchQuery }).catch(() => [])
      ]);

      if (healthData) setHealth(healthData);
      if (statsData) setStats(statsData);
      setLoans(loansData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler CRUD
  const handleCreateOrUpdate = async (formData: Partial<Loan>) => {
    if (editingLoan) {
      await updateLoan(editingLoan.id, formData);
      showToast('Data pinjaman berhasil diperbarui!');
    } else {
      await createLoan(formData);
      showToast('Pengajuan pinjaman baru berhasil disimpan ke database!');
    }
    setEditingLoan(null);
    loadData();
  };

  const handleStatusChange = async (id: number, status: LoanStatus) => {
    try {
      await updateLoanStatus(id, status);
      showToast(`Status pinjaman #${id} berhasil diubah menjadi ${status}`);
      loadData();
      if (viewingLoan && viewingLoan.id === id) {
        setViewingLoan({ ...viewingLoan, status });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah status';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLoan(id);
      showToast('Data pinjaman berhasil dihapus.');
      setDeleteConfirmId(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus';
      showToast(msg, 'error');
    }
  };

  const handleApplyPreset = (amount: number, tenor: number) => {
    setEditingLoan(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                FinPinjam <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">v1.0</span>
              </h1>
              <p className="text-[11px] text-slate-400">Fintech Loan & Aiven Cloud</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <button
              onClick={() => setActiveNav('loans')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeNav === 'loans'
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Manajemen Pinjaman</span>
            </button>

            <button
              onClick={() => setActiveNav('calculator')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeNav === 'calculator'
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Simulasi Kredit Angsuran</span>
            </button>

            <div className="pt-4 pb-1">
              <span className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Pusat Edukasi & Pengujian
              </span>
            </div>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-indigo-400 hover:bg-indigo-950/40 border border-indigo-500/20 transition"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Bahan Tanya Jawab Guru</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setIsAivenModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-teal-400 hover:bg-teal-950/40 border border-teal-500/20 transition"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-teal-400" />
                <span>Panduan MySQL Aiven</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>
        </div>

        {/* Database Status in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-medium">Status Database:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                health?.database === 'CONNECTED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  health?.database === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              {health?.database === 'CONNECTED' ? 'AIVEN CONNECTED' : 'OFFLINE'}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 truncate">
            {health?.database === 'CONNECTED'
              ? 'Terhubung aman via SSL Cloud'
              : 'Klik untuk panduan koneksi Aiven'}
          </p>

          <button
            onClick={() => setIsAivenModalOpen(true)}
            className="mt-2.5 w-full py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
          >
            Pengaturan Aiven
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {activeNav === 'loans' ? 'Dashboard Data Pinjaman Online' : 'Kalkulator Simulasi Pinjaman'}
            </h2>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Desktop Version
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              disabled={loading}
              title="Refresh Data"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingLoan(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Ajukan Pinjaman Baru</span>
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Toast Notification */}
          {toast && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-sm transition animate-in fade-in ${
                toast.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Database offline notice banner if not connected */}
          {health && health.database === 'DISCONNECTED' && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-sm text-white">Database MySQL Aiven Belum Terkoneksi</p>
                  <p className="text-slate-300">
                    Masukkan Service URI Aiven Anda ke dalam file <code>backend/.env</code> untuk menghubungkan database cloud.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAivenModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shrink-0"
              >
                Lihat Cara Sambungkan
              </button>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Pengajuan
                </span>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white mt-2 font-mono">
                {stats?.totalLoans ?? loans.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Seluruh berkas peminjam terdaftar</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Dana Tersalurkan
                </span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">
                Rp {Number(stats?.totalDisbursedAmount || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Status Disetujui & Lunas</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Menunggu Review
                </span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-400 mt-2 font-mono">
                {stats?.pendingCount ?? 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Perlu tindakan verifikasi admin</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Pinjaman Lunas
                </span>
                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-sky-400 mt-2 font-mono">
                {stats?.paidCount ?? 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Kredit selesai & lunas</p>
            </div>
          </div>

          {/* Conditional View: Management Table or Credit Calculator */}
          {activeNav === 'calculator' ? (
            <CreditCalculator onApplyPreset={handleApplyPreset} />
          ) : (
            /* Table Data Pinjaman */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Table Toolbar */}
              <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {[
                    { id: 'ALL', label: 'Semua Status' },
                    { id: 'PENDING', label: 'Menunggu' },
                    { id: 'APPROVED', label: 'Disetujui' },
                    { id: 'REJECTED', label: 'Ditolak' },
                    { id: 'PAID', label: 'Lunas' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        statusFilter === tab.id
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama peminjam, NIK, HP..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">ID & Peminjam</th>
                      <th className="py-3.5 px-4">Kontak & NIK</th>
                      <th className="py-3.5 px-4">Plafon & Tenor</th>
                      <th className="py-3.5 px-4">Cicilan / Bln</th>
                      <th className="py-3.5 px-4">Total Bayar</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Aksi (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loading && loans.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                            <span>Memuat data dari MySQL Aiven...</span>
                          </div>
                        </td>
                      </tr>
                    ) : loans.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          <div className="max-w-sm mx-auto space-y-2">
                            <p className="font-semibold text-white">Tidak ada data pinjaman</p>
                            <p className="text-xs text-slate-500">
                              Belum ada pengajuan pinjaman yang cocok dengan filter atau database masih kosong.
                            </p>
                            <button
                              onClick={() => {
                                setEditingLoan(null);
                                setIsModalOpen(true);
                              }}
                              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah Pengajuan Pertama</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      loans.map((loan) => (
                        <tr
                          key={loan.id}
                          className="hover:bg-slate-800/40 transition group cursor-pointer"
                          onClick={() => setViewingLoan(loan)}
                        >
                          {/* ID & Nama */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-slate-500 text-[11px]">#{loan.id}</span>
                              <div>
                                <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                                  {loan.borrower_name}
                                </p>
                                <p className="text-[11px] text-slate-400">{loan.occupation}</p>
                              </div>
                            </div>
                          </td>

                          {/* Kontak & NIK */}
                          <td className="py-4 px-4 font-mono">
                            <p className="text-slate-300">{loan.phone}</p>
                            <p className="text-[11px] text-slate-500">{loan.nik}</p>
                          </td>

                          {/* Plafon & Tenor */}
                          <td className="py-4 px-4 font-mono">
                            <p className="font-bold text-emerald-400">
                              Rp {Number(loan.amount).toLocaleString('id-ID')}
                            </p>
                            <p className="text-[11px] text-slate-400 font-sans">
                              {loan.tenor_months} Bulan ({loan.interest_rate}% bunga)
                            </p>
                          </td>

                          {/* Cicilan per Bulan */}
                          <td className="py-4 px-4 font-mono font-bold text-sky-400">
                            Rp {Number(loan.monthly_installment).toLocaleString('id-ID')}
                          </td>

                          {/* Total Bayar */}
                          <td className="py-4 px-4 font-mono text-slate-300">
                            Rp {Number(loan.total_payment).toLocaleString('id-ID')}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4">
                            {loan.status === 'APPROVED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Disetujui
                              </span>
                            )}
                            {loan.status === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <XCircle className="w-3 h-3" /> Ditolak
                              </span>
                            )}
                            {loan.status === 'PAID' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                <Wallet className="w-3 h-3" /> Lunas
                              </span>
                            )}
                            {loan.status === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Clock className="w-3 h-3" /> Menunggu
                              </span>
                            )}
                          </td>

                          {/* Actions (CRUD) */}
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Detail Button */}
                              <button
                                onClick={() => setViewingLoan(loan)}
                                title="Lihat Detail Peminjam"
                                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingLoan(loan);
                                  setIsModalOpen(true);
                                }}
                                title="Edit Data"
                                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setDeleteConfirmId(loan.id)}
                                title="Hapus Pinjaman"
                                className="p-1.5 text-rose-400 hover:text-white bg-slate-800 hover:bg-rose-600 rounded-lg transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Hapus Data Pinjaman?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus pengajuan pinjaman #{deleteConfirmId}? Data akan dihapus permanen dari MySQL Aiven.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition shadow-lg shadow-rose-600/30"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Loan Modal */}
      <LoanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLoan(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingLoan}
      />

      {/* Loan Detail Modal */}
      <LoanDetailModal
        loan={viewingLoan}
        isOpen={!!viewingLoan}
        onClose={() => setViewingLoan(null)}
        onStatusChange={handleStatusChange}
        onEdit={(loan) => {
          setEditingLoan(loan);
          setIsModalOpen(true);
        }}
      />

      {/* Aiven MySQL Help Modal */}
      <AivenHelpModal
        isOpen={isAivenModalOpen}
        onClose={() => setIsAivenModalOpen(false)}
        dbStatus={health?.database || 'DISCONNECTED'}
      />

      {/* Presentation Guide Modal */}
      <PresentationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
