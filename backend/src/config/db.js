const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * File Konfigurasi Koneksi Database (db.js)
 * Berfungsi sebagai jembatan (connector) antara Express.js dan MySQL (Aiven/Lokal).
 */

function buildDatabaseConfig() {
  const dbUrl = process.env.DATABASE_URL;

  // Jika menggunakan Service URI dari Aiven
  if (dbUrl && dbUrl.trim() !== '') {
    try {
      const parsed = new URL(dbUrl);
      return {
        host: parsed.hostname,
        port: Number(parsed.port) || 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'defaultdb',
        ssl: {
          rejectUnauthorized: false // Memungkinkan koneksi aman ke SSL Aiven Cloud
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    } catch (err) {
      console.warn('⚠️ Gagal mem-parsing DATABASE_URL, beralih ke variabel individual:', err.message);
    }
  }

  // Jika menggunakan variabel individual (DB_HOST, DB_USER, dll)
  return {
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
  };
}

const pool = mysql.createPool(buildDatabaseConfig());

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
