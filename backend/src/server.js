const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const loanRoutes = require('./routes/loanRoutes');
const { pool, testConnection } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Memungkinkan akses dari frontend desktop/Next.js
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Route Cek Status Kesehatan Sistem & Koneksi Aiven MySQL
app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS solution');
    const isConnected = result && result[0].solution === 2;
    res.json({
      status: 'UP',
      database: isConnected ? 'CONNECTED' : 'DISCONNECTED',
      db_host: process.env.DATABASE_URL ? 'Aiven Cloud URI' : (process.env.DB_HOST || 'localhost'),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'DEGRADED',
      database: 'DISCONNECTED',
      error: err.message,
      help: 'Silakan isi kredensial MySQL Aiven di file backend/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME)'
    });
  }
});

// Main API routes
app.use('/api', loanRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Pinjaman Online Aiven Cloud Express.js Aktif',
    endpoints: {
      health: 'GET /api/health',
      stats: 'GET /api/stats',
      loans: 'GET /api/loans',
      createLoan: 'POST /api/loans',
      loanDetail: 'GET /api/loans/:id',
      updateLoan: 'PUT /api/loans/:id',
      updateStatus: 'PATCH /api/loans/:id/status',
      deleteLoan: 'DELETE /api/loans/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server: ' + err.message
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 Server Backend Express berjalan di http://localhost:${PORT}`);
  console.log(`📡 Menghubungkan ke MySQL Aiven...`);
  console.log(`====================================================`);
  await testConnection();
});
