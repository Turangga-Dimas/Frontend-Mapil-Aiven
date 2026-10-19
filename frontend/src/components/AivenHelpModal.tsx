'use client';

import React from 'react';
import { X, Database, ExternalLink, Key, CheckCircle, Copy, AlertTriangle, Code2 } from 'lucide-react';

interface AivenHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: 'CONNECTED' | 'DISCONNECTED';
}

export default function AivenHelpModal({ isOpen, onClose, dbStatus }: AivenHelpModalProps) {
  const [copiedEnv, setCopiedEnv] = React.useState(false);
  const [copiedSql, setCopiedSql] = React.useState(false);

  if (!isOpen) return null;

  const sampleEnv = `DATABASE_URL=mysql://avnadmin:AVNS_xxxxxx@mysql-3xxxx-yourname.aivencloud.com:11894/defaultdb?ssl-mode=REQUIRED`;

  const rawSql = `CREATE TABLE IF NOT EXISTS loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_name VARCHAR(150) NOT NULL,
  nik VARCHAR(20) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(100) NOT NULL,
  occupation VARCHAR(100) NOT NULL,
  monthly_income DECIMAL(15,2) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  tenor_months INT NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL DEFAULT 1.50,
  monthly_installment DECIMAL(15,2) NOT NULL,
  total_payment DECIMAL(15,2) NOT NULL,
  purpose TEXT,
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- (Opsional) Data Dummy Awal untuk Test CRUD
INSERT INTO loans (borrower_name, nik, phone, email, occupation, monthly_income, amount, tenor_months, interest_rate, monthly_installment, total_payment, purpose, status)
VALUES
('Budi Santoso', '3201123456780001', '081234567890', 'budi.santoso@gmail.com', 'Karyawan Swasta', 8000000.00, 10000000.00, 12, 1.50, 983333.33, 11800000.00, 'Renovasi rumah bagian dapur', 'APPROVED'),
('Siti Rahmawati', '3201987654320002', '082198765432', 'siti.rahma@gmail.com', 'Wirausaha Kuliner', 12000000.00, 25000000.00, 24, 1.50, 1416666.67, 34000000.00, 'Ekspansi cabang outlet baru', 'PENDING');`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(rawSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Panduan Koneksi & SQL Manual MySQL Aiven</h3>
              <p className="text-xs text-slate-400">
                Langkah menghubungkan database Aiven dan mengeksekusi query SQL secara manual
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
        <div className="p-6 space-y-5 text-sm max-h-[80vh] overflow-y-auto">
          {/* Status Sekarang */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              dbStatus === 'CONNECTED'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {dbStatus === 'CONNECTED' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm">
                Status Koneksi: {dbStatus === 'CONNECTED' ? 'MySQL Terhubung ✅' : 'Menunggu Kredensial MySQL Aiven'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                {dbStatus === 'CONNECTED'
                  ? 'Server Express berhasil berkomunikasi dengan database MySQL di Aiven.'
                  : 'Backend saat ini belum terhubung ke Aiven Cloud. Ikuti langkah di bawah ini untuk menghubungkannya.'}
              </p>
            </div>
          </div>

          {/* Langkah-langkah */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Buka Konsol Aiven Anda</p>
                <p className="text-xs text-slate-300">
                  Kunjungi konsol Aiven melalui browser dan buka service MySQL yang telah dibuat:
                </p>
                <a
                  href="https://console.aiven.io/profile"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline mt-1"
                >
                  Buka Console Aiven <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Salin Service URI</p>
                <p className="text-xs text-slate-300">
                  Di halaman Overview service MySQL Aiven Anda, cari bagian <strong>Service URI</strong> (atau Quick Connect), lalu klik tombol Copy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-2 w-full">
                <p className="font-semibold text-white">Tempelkan ke file <code>backend/.env</code></p>
                <p className="text-xs text-slate-300">
                  Buka file <code>backend/.env</code> pada project ini dan isi variabel <code>DATABASE_URL</code> dengan Service URI dari Aiven:
                </p>
                <div className="relative bg-slate-900 p-3 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 break-all">
                  {sampleEnv}
                  <button
                    onClick={handleCopyEnv}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedEnv ? 'Tersalin' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-2 w-full">
                <p className="font-semibold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Jalankan Perintah SQL Pembuatan Tabel di MySQL Anda
                </p>
                <p className="text-xs text-slate-300">
                  Salin kode SQL di bawah ini, lalu jalankan di tool database Anda (Aiven Query Editor / DBeaver / Navicat / CLI / phpMyAdmin):
                </p>
                <div className="relative bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{rawSql}</pre>
                  <button
                    onClick={handleCopySql}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded border border-slate-700 transition flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedSql ? 'Tersalin' : 'Salin SQL'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
