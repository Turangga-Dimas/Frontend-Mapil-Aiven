'use client';

import React from 'react';
import { Loan, LoanStatus } from '../types/loan';
import {
  X,
  User,
  CreditCard,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  FileText
} from 'lucide-react';

interface LoanDetailModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: LoanStatus) => Promise<void>;
  onEdit: (loan: Loan) => void;
}

export default function LoanDetailModal({
  loan,
  isOpen,
  onClose,
  onStatusChange,
  onEdit
}: LoanDetailModalProps) {
  if (!isOpen || !loan) return null;

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> DISETUJUI
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> DITOLAK
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Wallet className="w-3.5 h-3.5" /> LUNAS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> MENUNGGU REVIEW
          </span>
        );
    }
  };

  const amountNum = Number(loan.amount) || 0;
  const installmentNum = Number(loan.monthly_installment) || 0;
  const totalPaymentNum = Number(loan.total_payment) || 0;
  const incomeNum = Number(loan.monthly_income) || 0;

  // Rasio Cicilan terhadap Pendapatan (Debt Service Ratio)
  const dsr = incomeNum > 0 ? ((installmentNum / incomeNum) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">Detail Pengajuan #{loan.id}</h3>
                {getStatusBadge(loan.status)}
              </div>
              <p className="text-xs text-slate-400">
                Diajukan pada: {new Date(loan.created_at).toLocaleString('id-ID')}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ringkasan Angsuran Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
              <p className="text-xs text-slate-400 font-medium">Nominal Pinjaman</p>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-1">
                Rp {amountNum.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Tenor: {loan.tenor_months} Bulan</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
              <p className="text-xs text-slate-400 font-medium">Angsuran per Bulan</p>
              <p className="text-xl font-bold text-sky-400 font-mono mt-1">
                Rp {installmentNum.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Bunga: {loan.interest_rate}% / bln</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
              <p className="text-xs text-slate-400 font-medium">Total Pengembalian</p>
              <p className="text-xl font-bold text-violet-400 font-mono mt-1">
                Rp {totalPaymentNum.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Beban DSR: <span className="font-semibold text-amber-400">{dsr}%</span> gaji
              </p>
            </div>
          </div>

          {/* Profil Peminjam */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Informasi Pribadi & Kontak Peminjam
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Nama Lengkap</span>
                  <span className="font-medium text-white">{loan.borrower_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Nomor KTP (NIK)</span>
                  <span className="font-mono text-white">{loan.nik}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Nomor HP / WhatsApp</span>
                  <span className="font-medium text-white">{loan.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Email Aktif</span>
                  <span className="font-medium text-white">{loan.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Pekerjaan</span>
                  <span className="font-medium text-white">{loan.occupation}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Penghasilan Bulanan</span>
                  <span className="font-mono text-white">
                    Rp {incomeNum.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Keperluan Pinjaman */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Keperluan & Tujuan Pengajuan
            </h4>
            <p className="text-sm text-slate-200 italic">
              &ldquo;{loan.purpose || 'Tidak mencantumkan keterangan tujuan spesifik.'}&rdquo;
            </p>
          </div>

          {/* Action Status Fast Buttons */}
          <div className="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Ubah Status:</span>
              <button
                onClick={() => onStatusChange(loan.id, 'APPROVED')}
                disabled={loan.status === 'APPROVED'}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition disabled:opacity-40"
              >
                Setujui (Approve)
              </button>
              <button
                onClick={() => onStatusChange(loan.id, 'REJECTED')}
                disabled={loan.status === 'REJECTED'}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition disabled:opacity-40"
              >
                Tolak (Reject)
              </button>
              <button
                onClick={() => onStatusChange(loan.id, 'PAID')}
                disabled={loan.status === 'PAID'}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600/20 text-sky-300 hover:bg-sky-600 hover:text-white border border-sky-500/30 transition disabled:opacity-40"
              >
                Tandai Lunas
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(loan);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Edit Data Lengkap
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
