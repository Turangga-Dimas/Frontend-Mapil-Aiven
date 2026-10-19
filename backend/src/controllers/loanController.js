const { pool } = require('../config/db');

// Helper kalkulasi simulasi angsuran
function calculateLoanDetails(amount, tenorMonths, interestRate = 1.5) {
  const principal = parseFloat(amount);
  const tenor = parseInt(tenorMonths, 10);
  const monthlyRate = parseFloat(interestRate) / 100;

  // Bunga flat per bulan
  const monthlyInterest = principal * monthlyRate;
  const monthlyPrincipal = principal / tenor;
  const monthlyInstallment = Math.round((monthlyPrincipal + monthlyInterest) * 100) / 100;
  const totalPayment = Math.round((monthlyInstallment * tenor) * 100) / 100;

  return {
    interest_rate: interestRate,
    monthly_installment: monthlyInstallment,
    total_payment: totalPayment
  };
}

/**
 * GET /api/loans
 * Mengambil daftar pinjaman dengan filter status & pencarian
 */
async function getAllLoans(req, res) {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let query = 'SELECT * FROM loans WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (borrower_name LIKE ? OR nik LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.query(query, params);

    // Ambil total count untuk pagination info
    let countQuery = 'SELECT COUNT(*) as total FROM loans WHERE 1=1';
    const countParams = [];
    if (status && status !== 'ALL') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (search) {
      countQuery += ' AND (borrower_name LIKE ? OR nik LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const keyword = `%${search}%`;
      countParams.push(keyword, keyword, keyword, keyword);
    }
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: rows,
      meta: {
        total: countResult[0].total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }
    });
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pinjaman: ' + err.message
    });
  }
}

/**
 * GET /api/loans/:id
 * Mengambil detail satu pinjaman
 */
async function getLoanById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data pinjaman tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('Error fetching loan detail:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pinjaman: ' + err.message
    });
  }
}

/**
 * POST /api/loans
 * Tambah pengajuan pinjaman baru
 */
async function createLoan(req, res) {
  try {
    const {
      borrower_name,
      nik,
      phone,
      email,
      occupation,
      monthly_income,
      amount,
      tenor_months,
      purpose,
      interest_rate = 1.50
    } = req.body;

    // Validasi data wajib
    if (!borrower_name || !nik || !phone || !email || !occupation || !monthly_income || !amount || !tenor_months) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi seluruh field yang wajib diisi.'
      });
    }

    if (nik.length < 16) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus berjumlah minimal 16 digit angka.'
      });
    }

    // Hitung cicilan
    const calc = calculateLoanDetails(amount, tenor_months, interest_rate);

    const insertQuery = `
      INSERT INTO loans 
      (borrower_name, nik, phone, email, occupation, monthly_income, amount, tenor_months, interest_rate, monthly_installment, total_payment, purpose, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    const values = [
      borrower_name,
      nik,
      phone,
      email,
      occupation,
      parseFloat(monthly_income),
      parseFloat(amount),
      parseInt(tenor_months, 10),
      calc.interest_rate,
      calc.monthly_installment,
      calc.total_payment,
      purpose || ''
    ];

    const [result] = await pool.query(insertQuery, values);

    // Ambil data yang baru dibuat
    const [createdRows] = await pool.query('SELECT * FROM loans WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Pengajuan pinjaman berhasil dibuat!',
      data: createdRows[0]
    });
  } catch (err) {
    console.error('Error creating loan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat pengajuan pinjaman: ' + err.message
    });
  }
}

/**
 * PUT /api/loans/:id
 * Update data pinjaman
 */
async function updateLoan(req, res) {
  try {
    const { id } = req.params;
    const {
      borrower_name,
      nik,
      phone,
      email,
      occupation,
      monthly_income,
      amount,
      tenor_months,
      purpose,
      status,
      interest_rate = 1.50
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data pinjaman tidak ditemukan.'
      });
    }

    const currentLoan = existing[0];
    const newAmount = amount !== undefined ? parseFloat(amount) : parseFloat(currentLoan.amount);
    const newTenor = tenor_months !== undefined ? parseInt(tenor_months, 10) : currentLoan.tenor_months;
    const newRate = interest_rate !== undefined ? parseFloat(interest_rate) : parseFloat(currentLoan.interest_rate);

    const calc = calculateLoanDetails(newAmount, newTenor, newRate);

    const updateQuery = `
      UPDATE loans SET
        borrower_name = ?,
        nik = ?,
        phone = ?,
        email = ?,
        occupation = ?,
        monthly_income = ?,
        amount = ?,
        tenor_months = ?,
        interest_rate = ?,
        monthly_installment = ?,
        total_payment = ?,
        purpose = ?,
        status = ?
      WHERE id = ?
    `;

    const values = [
      borrower_name || currentLoan.borrower_name,
      nik || currentLoan.nik,
      phone || currentLoan.phone,
      email || currentLoan.email,
      occupation || currentLoan.occupation,
      monthly_income !== undefined ? parseFloat(monthly_income) : currentLoan.monthly_income,
      newAmount,
      newTenor,
      calc.interest_rate,
      calc.monthly_installment,
      calc.total_payment,
      purpose !== undefined ? purpose : currentLoan.purpose,
      status || currentLoan.status,
      id
    ];

    await pool.query(updateQuery, values);
    const [updatedRows] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Data pinjaman berhasil diperbarui!',
      data: updatedRows[0]
    });
  } catch (err) {
    console.error('Error updating loan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data pinjaman: ' + err.message
    });
  }
}

/**
 * PATCH /api/loans/:id/status
 * Update status persetujuan pinjaman (PENDING, APPROVED, REJECTED, PAID)
 */
async function updateLoanStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'PAID'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Harus salah satu dari: PENDING, APPROVED, REJECTED, PAID'
      });
    }

    const [result] = await pool.query('UPDATE loans SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data pinjaman tidak ditemukan.'
      });
    }

    const [updatedRows] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Status pinjaman berhasil diubah menjadi ${status}!`,
      data: updatedRows[0]
    });
  } catch (err) {
    console.error('Error updating loan status:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah status pinjaman: ' + err.message
    });
  }
}

/**
 * DELETE /api/loans/:id
 * Hapus data pinjaman
 */
async function deleteLoan(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM loans WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data pinjaman tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      message: 'Data pinjaman berhasil dihapus!'
    });
  } catch (err) {
    console.error('Error deleting loan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data pinjaman: ' + err.message
    });
  }
}

/**
 * GET /api/stats
 * Statistik dashboard pinjaman online
 */
async function getLoanStats(req, res) {
  try {
    const [totals] = await pool.query(`
      SELECT 
        COUNT(*) as totalLoans,
        COALESCE(SUM(amount), 0) as totalRequestedAmount,
        COALESCE(SUM(CASE WHEN status = 'APPROVED' OR status = 'PAID' THEN amount ELSE 0 END), 0) as totalDisbursedAmount,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pendingCount,
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as approvedCount,
        COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejectedCount,
        COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paidCount
      FROM loans
    `);

    res.json({
      success: true,
      data: totals[0]
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik: ' + err.message
    });
  }
}

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  updateLoanStatus,
  deleteLoan,
  getLoanStats
};
