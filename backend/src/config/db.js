const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Konfigurasi Koneksi Database MySQL (Aiven Supported)
 * Aiven MySQL memerlukan SSL secara default (ssl-mode=REQUIRED).
 * Mendukung format DATABASE_URL / MYSQL_URL maupun variable terpisah.
 */

function createDbPool() {
  const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

  if (connectionUri) {
    try {
      const url = new URL(connectionUri);
      return mysql.createPool({
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname ? url.pathname.replace(/^\//, '') : 'defaultdb',
        ssl: {
          rejectUnauthorized: false // Memungkinkan koneksi aman ke Aiven Cloud SSL
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    } catch (err) {
      console.warn('⚠️ Gagal parse DATABASE_URL, menggunakan konfigurasi fallback individual env:', err.message);
    }
  }

  // Gunakan variabel individual
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pinjaman_online_db',
    ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('aivencloud.com') ? {
      rejectUnauthorized: false
    } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

const pool = createDbPool();

/**
 * Inisialisasi Tabel dan Seed Data Awal
 */
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Berhasil terhubung ke database MySQL (Aiven/Local)!');

    // Buat tabel loans jika belum ada
    const createTableQuery = `
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
    `;

    await connection.query(createTableQuery);
    console.log('✅ Tabel `loans` siap digunakan.');

    // Cek apakah tabel kosong, jika iya masukkan contoh data simulasi
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM loans');
    if (rows[0].count === 0) {
      console.log('🌱 Menambahkan seed data simulasi pinjaman online...');
      const seedQuery = `
        INSERT INTO loans (borrower_name, nik, phone, email, occupation, monthly_income, amount, tenor_months, interest_rate, monthly_installment, total_payment, purpose, status)
        VALUES
        ('Budi Santoso', '3201123456780001', '081234567890', 'budi.santoso@gmail.com', 'Karyawan Swasta', 8000000.00, 10000000.00, 12, 1.50, 983333.33, 11800000.00, 'Renovasi rumah bagian dapur', 'APPROVED'),
        ('Siti Rahmawati', '3201987654320002', '082198765432', 'siti.rahma@gmail.com', 'Wirausaha Kuliner', 12000000.00, 25000000.00, 24, 1.50, 1416666.67, 34000000.00, 'Ekspansi cabang outlet baru', 'PENDING'),
        ('Ahmad Fauzi', '3171556677880003', '085711223344', 'ahmad.fauzi@yahoo.com', 'Pegawai Negeri Sipil', 7500000.00, 5000000.00, 6, 1.50, 908333.33, 5450000.00, 'Biaya masuk kuliah anak', 'PAID'),
        ('Dewi Lestari', '3301445566770004', '087833445566', 'dewi.lestari@gmail.com', 'Freelancer Desain', 6000000.00, 3000000.00, 3, 1.50, 1045000.00, 3135000.00, 'Upgrade perangkat laptop kerja', 'REJECTED');
      `;
      await connection.query(seedQuery);
      console.log('✅ Seed data berhasil dimasukkan.');
    }

    connection.release();
  } catch (err) {
    console.error('❌ Gagal menginisialisasi database:', err.message);
    console.log('ℹ️ Pastikan konfigurasi Aiven di file backend/.env sudah sesuai (Host, User, Password, Port, DB Name).');
  }
}

module.exports = {
  pool,
  initializeDatabase
};
