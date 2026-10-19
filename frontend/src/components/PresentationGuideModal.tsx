'use client';

import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Layers,
  Database,
  Server,
  Monitor,
  Code2,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PresentationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PresentationGuideModal({ isOpen, onClose }: PresentationGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'arsitektur' | 'database' | 'crud' | 'tanyaJawab'>('arsitektur');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Bahan Presentasi & Tanya Jawab Pengujian Guru
              </h3>
              <p className="text-xs text-slate-400">
                Panduan materi teknis untuk menjawab pertanyaan guru seputar arsitektur & kode sistem
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700 bg-slate-900/40 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('arsitektur')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'arsitektur'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. Arsitektur Fullstack
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'database'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            2. Aiven Cloud & Database
          </button>
          <button
            onClick={() => setActiveTab('crud')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'crud'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            3. Alur Kerja CRUD
          </button>
          <button
            onClick={() => setActiveTab('tanyaJawab')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'tanyaJawab'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            4. Bocoran Tanya Jawab Guru
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
          {activeTab === 'arsitektur' && (
            <div className="space-y-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Struktur 3-Tier Architecture
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aplikasi ini menggunakan standar industri modern yaitu <strong>Client-Server-Database</strong>:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-1">
                      <Monitor className="w-4 h-4" /> Frontend (Next.js)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      React 19 & Tailwind CSS. Bertugas menyajikan Dashboard desktop fintech interaktif, formulir pengajuan, simulasi angsuran kredit secara real-time, dan komunikasi asinkron via Fetch API.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                      <Server className="w-4 h-4" /> Backend (Express.js)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Node.js & Express. Menyediakan RESTful API endpoints, validasi NIK/nominal pinjaman, kalkulasi rumus bunga pinjaman flat, serta mengelola koneksi database pooling.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs mb-1">
                      <Database className="w-4 h-4" /> Cloud DB (Aiven MySQL)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Database MySQL tersertifikasi di cloud Aiven dengan enkripsi SSL/TLS. Menjamin integritas data peminjam dan status pengajuan pinjaman tetap aman dan persisten.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                  Mengapa Memisahkan Next.js dan Express.js?
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  <li><strong>Separation of Concerns:</strong> Frontend fokus pada interaksi pengguna (UI/UX), backend fokus pada bisnis proses finansial & keamanan data.</li>
                  <li><strong>Skalabilitas:</strong> Backend API dapat dikonsumsi oleh berbagai platform lain di masa depan (misalnya aplikasi mobile Android/iOS Flutter).</li>
                  <li><strong>Keamanan:</strong> Kredensial rahasia database tersimpan di server backend (environment variable) dan tidak bocor ke browser pengguna.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Koneksi Aiven Cloud & Fitur SSL
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Aiven adalah penyedia Database-as-a-Service (DBaaS) berbasis cloud. Berbeda dengan localhost (XAMPP), Aiven MySQL memerlukan komunikasi terenkripsi SSL (Secure Sockets Layer).
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
                  mysql.createPool({`{`} <br />
                  &nbsp;&nbsp;host: &apos;mysql-xxxx.aivencloud.com&apos;, <br />
                  &nbsp;&nbsp;port: 11894, <br />
                  &nbsp;&nbsp;ssl: {`{ rejectUnauthorized: false }`}, // Wajib untuk SSL Aiven <br />
                  &nbsp;&nbsp;waitForConnections: true, <br />
                  &nbsp;&nbsp;connectionLimit: 10 <br />
                  {`}`})
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                  Skema Tabel `loans`
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2">Kolom</th>
                        <th>Tipe Data</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      <tr><td className="py-1.5 text-emerald-400">id</td><td>INT PK AUTO_INC</td><td className="font-sans text-slate-300">ID unik pengajuan</td></tr>
                      <tr><td className="py-1.5 text-emerald-400">borrower_name</td><td>VARCHAR(150)</td><td className="font-sans text-slate-300">Nama lengkap peminjam</td></tr>
                      <tr><td className="py-1.5 text-emerald-400">nik</td><td>VARCHAR(20)</td><td className="font-sans text-slate-300">Nomor KTP (16 digit)</td></tr>
                      <tr><td className="py-1.5 text-emerald-400">amount</td><td>DECIMAL(15,2)</td><td className="font-sans text-slate-300">Plafon pinjaman diajukan</td></tr>
                      <tr><td className="py-1.5 text-emerald-400">tenor_months</td><td>INT</td><td className="font-sans text-slate-300">Jangka waktu (3, 6, 12, 24 bln)</td></tr>
                      <tr><td className="py-1.5 text-emerald-400">monthly_installment</td><td>DECIMAL(15,2)</td><td className="font-sans text-slate-300">Nominal cicilan per bulan</td></tr>
                      <tr><td className="py-1.5 text-emerald-400">status</td><td>ENUM(...)</td><td className="font-sans text-slate-300">PENDING, APPROVED, REJECTED, PAID</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crud' && (
            <div className="space-y-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2">Penerapan Fungsi CRUD (Create, Read, Update, Delete)</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">CREATE</span>
                    <div>
                      <p className="font-semibold text-white">POST /api/loans</p>
                      <p className="text-slate-400">
                        Admin atau peminjam mengisi form pengajuan. Backend menghitung bunga secara otomatis dan menyimpan row baru ke tabel <code>loans</code> dengan status awal PENDING.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold shrink-0">READ</span>
                    <div>
                      <p className="font-semibold text-white">GET /api/loans & GET /api/stats</p>
                      <p className="text-slate-400">
                        Menampilkan daftar pinjaman dengan dukungan fitur pencarian real-time (Nama/NIK/HP) dan filter tab status (Semua, Pending, Disetujui, Ditolak, Lunas), serta agregasi statistik nominal di card atas.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">UPDATE</span>
                    <div>
                      <p className="font-semibold text-white">PUT /api/loans/:id & PATCH /api/loans/:id/status</p>
                      <p className="text-slate-400">
                        Mengubah data peminjam dan plafon tenor, serta aksi cepat approval: mengubah status menjadi APPROVED, REJECTED, atau PAID setelah pelunasan.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold shrink-0">DELETE</span>
                    <div>
                      <p className="font-semibold text-white">DELETE /api/loans/:id</p>
                      <p className="text-slate-400">
                        Menghapus data pengajuan pinjaman tertentu dengan konfirmasi dialog pengamanan untuk mencegah penghapusan tidak sengaja.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tanyaJawab' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono">Q1:</span> Apa fungsi Aiven di sini dan kenapa tidak pakai MySQL XAMPP lokal saja?
                </p>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                  <span className="font-bold text-emerald-400">Jawaban:</span> Aiven menyediakan database MySQL yang berada di server Cloud (Production Ready). Keunggulannya data dapat diakses online 24/7 dari mana saja secara tersentralisasi, sudah memiliki sertifikat keamanan SSL/TLS otomatis, dan tidak bergantung pada komputer lokal yang harus menyalakan Apache/MySQL di XAMPP.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono">Q2:</span> Bagaimana rumus perhitungan angsuran pinjaman di sistem ini?
                </p>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                  <span className="font-bold text-emerald-400">Jawaban:</span> Menggunakan metode flat interest rate (1.5% per bulan). Pokok cicilan dihitung dari <code>Jumlah Pinjaman / Tenor Bulan</code>. Bunga per bulan dihitung dari <code>Jumlah Pinjaman x 1.5%</code>. Cicilan per bulan adalah <code>Pokok + Bunga</code>, dan total pengembalian adalah <code>Cicilan per Bulan x Tenor Bulan</code>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono">Q3:</span> Bagaimana cara frontend Next.js berkomunikasi dengan backend Express?
                </p>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                  <span className="font-bold text-emerald-400">Jawaban:</span> Melalui protokol HTTP/REST API menggunakan Fetch API asinkron (async/await). Frontend mengirimkan request JSON ke endpoint Express (misalnya <code>POST /api/loans</code>), Express memvalidasi dan menjalankan query SQL menggunakan <code>mysql2/promise</code>, lalu mengembalikan respon JSON terstruktur.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono">Q4:</span> Apa fungsi CORS pada backend Express?
                </p>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                  <span className="font-bold text-emerald-400">Jawaban:</span> CORS (Cross-Origin Resource Sharing) diperlukan karena frontend berjalan di port 3000 dan backend berjalan di port 5000. Middleware CORS memberi izin kepada browser untuk mengizinkan pertukaran data antar port atau domain yang berbeda secara aman.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-700 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Siap untuk presentasi tugas akhir sekolah / kuliah
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
