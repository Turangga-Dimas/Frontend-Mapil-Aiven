const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * File Konfigurasi Koneksi Database (db.js)
 * Berfungsi sebagai jembatan (connector) antara Express.js dan MySQL (Aiven/Lokal).
 * File ini TIDAK menjalankan pembuatan tabel (migration) maupun seed data.
 * Pembuatan tabel dilakukan secara manual oleh Anda di database MySQL.
 */

// Membaca konfigurasi dari file .env
const pool = mysql.createPool(
  process.env.DATABASE_URL
    ? {
        uri: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Wajib untuk SSL Aiven Cloud
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'defaultdb',
        ssl: process.env.DB_HOST?.includes('aivencloud.com') || process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      }
);

// Fungsi sederhana untuk menguji apakah koneksi ke MySQL berhasil
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Koneksi ke Database MySQL (Aiven) BERHASIL!');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terhubung ke MySQL:', error.message);
    console.log('💡 Silakan pastikan data Host, User, Password di backend/.env sudah benar.');
  }
}

module.exports = {
  pool,
  testConnection
};
