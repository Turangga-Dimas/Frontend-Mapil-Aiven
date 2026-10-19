# 🏦 FinPinjam - Sistem FinTech Pinjaman Online Desktop Fullstack

Aplikasi fullstack desktop modern bertema **Pinjaman Online (FinTech Lending)** dengan integrasi database cloud **MySQL Aiven**, backend REST API **Express.js**, dan antarmuka dashboard interaktif **Next.js (React 19 & Tailwind CSS)**. Dilengkapi fungsi **CRUD (Create, Read, Update, Delete)** lengkap, kalkulator simulasi kredit otomatis, validasi data peminjam, dan panduan komprehensif untuk pengujian/tanya jawab oleh guru.

---

## 🚀 Fitur Utama

1. **Dashboard Desktop FinTech Interaktif**:
   - Ringkasan KPI: Total Pengajuan, Total Dana Tersalurkan, Menunggu Review, Pinjaman Lunas.
   - Status Indikator Database MySQL Aiven (Real-time Health Check).
2. **Operasi CRUD Lengkap**:
   - **Create**: Pengajuan pinjaman baru dengan validasi NIK (16 digit), nomor telepon, email, pekerjaan, dan penghasilan.
   - **Read**: Tabel data pinjaman dengan pencarian real-time (Nama, NIK, No. HP) dan filter status tab (`Semua`, `Menunggu`, `Disetujui`, `Ditolak`, `Lunas`).
   - **Update**: Edit data profil peminjam, nominal, tenor, serta aksi cepat persetujuan (*Approve*, *Reject*, *Mark as Paid*).
   - **Delete**: Hapus data pengajuan pinjaman dengan modal dialog konfirmasi keamanan.
3. **Kalkulator Simulasi Angsuran & Kredit**:
   - Perhitungan otomatis bunga flat (1.5%/bulan), pokok cicilan, bunga cicilan, dan total pembayaran.
   - Analisis rasio beban cicilan terhadap pendapatan (*Debt Service Ratio* / DSR).
4. **Cloud Database Ready (Aiven MySQL)**:
   - Dukungan koneksi aman SSL/TLS (`ssl: { rejectUnauthorized: false }`).
   - Otomatis membuat tabel `loans` dan mengisi data simulasi awal (*auto-seed*) saat pertama kali dijalankan.
5. **Modal Pusat Edukasi & Pengujian Guru**:
   - Tombol khusus di sidebar yang menyajikan contekan teknis arsitektur 3-tier, penjelasan skema database, dan jawaban atas pertanyaan guru.

---

## 🛠️ Tech Stack

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) (v16 App Router) | React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | [Express.js](https://expressjs.com/) (Node.js) | RESTful API, CORS, Dotenv, Morgan Logger |
| **Database Driver** | [mysql2](https://github.com/sidorares/node-mysql2) | Promise-based Connection Pool dengan SSL Aiven Cloud |
| **Cloud Database** | [Aiven for MySQL](https://console.aiven.io/) | Managed MySQL Database di Cloud dengan enkripsi SSL/TLS |

---

## 📁 Struktur Direktori

```text
Fullstack-Mapil-Aiven/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # Koneksi MySQL pool, SSL Aiven, auto-migration & auto-seed
│   │   ├── controllers/
│   │   │   └── loanController.js# Logika CRUD & agregasi statistik dashboard
│   │   ├── routes/
│   │   │   └── loanRoutes.js    # Definisi route /api/loans dan /api/stats
│   │   └── server.js            # Inisialisasi Express, CORS, health check, middleware
│   ├── .env.example             # Contoh konfigurasi koneksi Aiven
│   ├── .env                     # File konfigurasi lokal (tidak di-commit ke Git)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css      # Styling Tailwind CSS
│   │   │   ├── layout.tsx       # Root layout Next.js
│   │   │   └── page.tsx         # Dashboard desktop utama
│   │   ├── components/
│   │   │   ├── LoanModal.tsx    # Modal form Create & Edit
│   │   │   ├── LoanDetailModal.tsx # Modal detail profil & amortisasi
│   │   │   ├── CreditCalculator.tsx# Widget kalkulator simulasi kredit
│   │   │   ├── AivenHelpModal.tsx  # Panduan setting Service URI Aiven
│   │   │   └── PresentationGuideModal.tsx # Contekan ujian tanya jawab guru
│   │   ├── lib/
│   │   │   └── api.ts           # Client Fetch API penghubung frontend & backend
│   │   └── types/
│   │       └── loan.ts          # Definisi tipe data TypeScript
│   ├── .env.example
│   └── package.json
├── package.json                 # Skrip runner root
├── .gitignore
└── README.md
```

---

## ⚙️ Panduan Menghubungkan ke Aiven MySQL

1. Buka konsol Aiven: [https://console.aiven.io/profile](https://console.aiven.io/profile)
2. Buat atau pilih service **MySQL** Anda.
3. Di tab **Overview**, cari bagian **Service URI** atau **Connection Details**, lalu salin string koneksinya:
   ```text
   mysql://avnadmin:PASSWORD_ANDA@mysql-xxxxx.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED
   ```
4. Buka file `backend/.env` di project ini, lalu masukkan Service URI tersebut:
   ```env
   PORT=5000
   DATABASE_URL=mysql://avnadmin:PASSWORD_ANDA@mysql-xxxxx.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED
   ```
5. Buka query editor MySQL Anda (misalnya melalui Aiven CLI, DBeaver, HeidiSQL, atau phpMyAdmin) dan jalankan script SQL berikut untuk membuat tabel:

```sql
CREATE TABLE IF NOT EXISTS loans (
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

-- (Opsional) Data Dummy Awal untuk Pengujian CRUD
INSERT INTO loans (borrower_name, nik, phone, email, occupation, monthly_income, amount, tenor_months, interest_rate, monthly_installment, total_payment, purpose, status)
VALUES
('Budi Santoso', '3201123456780001', '081234567890', 'budi.santoso@gmail.com', 'Karyawan Swasta', 8000000.00, 10000000.00, 12, 1.50, 983333.33, 11800000.00, 'Renovasi rumah bagian dapur', 'APPROVED'),
('Siti Rahmawati', '3201987654320002', '082198765432', 'siti.rahma@gmail.com', 'Wirausaha Kuliner', 12000000.00, 25000000.00, 24, 1.50, 1416666.67, 34000000.00, 'Ekspansi cabang outlet baru', 'PENDING');
```

---

## 💻 Cara Menjalankan Project

### 1. Menjalankan Backend Express.js
```bash
cd backend
npm run dev
```
Backend akan aktif di `http://localhost:5000`.

### 2. Menjalankan Frontend Next.js
Buka terminal baru:
```bash
cd frontend
npm run dev
```
Frontend akan aktif di `http://localhost:3000`. Buka di browser desktop Anda.

---

## 📡 Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Cek status server & live koneksi ke database Aiven |
| `GET` | `/api/stats` | Rekapitulasi nominal pinjaman & status KPI |
| `GET` | `/api/loans` | Ambil semua data pinjaman (mendukung filter `?status=` dan `?search=`) |
| `GET` | `/api/loans/:id` | Ambil detail 1 data pinjaman |
| `POST` | `/api/loans` | Tambah pengajuan pinjaman baru |
| `PUT` | `/api/loans/:id` | Perbarui data peminjam & pinjaman |
| `PATCH` | `/api/loans/:id/status` | Ubah status pinjaman (`PENDING`, `APPROVED`, `REJECTED`, `PAID`) |
| `DELETE` | `/api/loans/:id` | Hapus data pinjaman |

---

## 🎓 Materi Persiapan Tanya Jawab dengan Guru

### 1. "Apa peran masing-masing teknologi di project ini?"
> **Jawaban:** 
> - **Next.js (Frontend):** Bertindak sebagai antarmuka (User Interface) desktop yang modern. Mengatur state aplikasi, merender tabel, form interaktif, dan kalkulator simulasi angsuran.
> - **Express.js (Backend):** Bertindak sebagai REST API Server yang mengatur alur bisnis, menghitung rumus bunga pinjaman, memvalidasi input NIK dan keuangan, serta menjembatani query ke database.
> - **MySQL di Aiven (Database):** Sebagai penyimpanan data terpusat di Cloud (Database-as-a-Service) dengan enkripsi SSL/TLS, sehingga data pinjaman aman dan persisten.

### 2. "Mengapa menggunakan Aiven dan bukan MySQL lokal (XAMPP)?"
> **Jawaban:** 
> Aiven merupakan layanan cloud database terkelola (DBaaS) berstandar industri. Keunggulannya:
> 1. Database dapat diakses secara online dari mana saja.
> 2. Memiliki fitur keamanan bawaan menggunakan enkripsi SSL/TLS secara default.
> 3. Bebas ketergantungan pada software lokal seperti XAMPP yang harus dinyalakan manual di satu laptop.

### 3. "Bagaimana rumus perhitungan angsuran pinjaman dihitung?"
> **Jawaban:**
> Menggunakan sistem bunga flat dengan formula:
> - **Pokok per bulan** = `Nominal Pinjaman / Tenor (Bulan)`
> - **Bunga per bulan** = `Nominal Pinjaman x Suku Bunga (1.5%)`
> - **Cicilan per bulan** = `Pokok per bulan + Bunga per bulan`
> - **Total pembayaran** = `Cicilan per bulan x Tenor (Bulan)`

### 4. "Bagaimana alur CRUD pada project ini?"
> **Jawaban:**
> - **Create (C):** Pengguna mengisi form -> Frontend mengirim `POST` JSON -> Express memvalidasi data dan menghitung cicilan -> Menjalankan `INSERT INTO loans` di Aiven.
> - **Read (R):** Frontend memanggil `GET /api/loans` -> Express menjalankan `SELECT * FROM loans` dengan filter/pencarian -> Data ditampilkan di tabel.
> - **Update (U):** Pengguna mengedit data atau menekan tombol persetujuan (Approve/Reject/Paid) -> Mengirim request `PUT` atau `PATCH` -> Query `UPDATE loans` dieksekusi.
> - **Delete (D):** Pengguna mengklik tombol hapus -> Muncul konfirmasi -> Mengirim request `DELETE /api/loans/:id` -> Query `DELETE FROM loans WHERE id = ?` dieksekusi.
