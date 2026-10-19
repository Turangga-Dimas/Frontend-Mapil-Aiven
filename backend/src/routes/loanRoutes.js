const express = require('express');
const router = express.Router();
const {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  updateLoanStatus,
  deleteLoan,
  getLoanStats
} = require('../controllers/loanController');

// Route statistik dashboard
router.get('/stats', getLoanStats);

// Route CRUD Pinjaman
router.get('/loans', getAllLoans);
router.get('/loans/:id', getLoanById);
router.post('/loans', createLoan);
router.put('/loans/:id', updateLoan);
router.patch('/loans/:id/status', updateLoanStatus);
router.delete('/loans/:id', deleteLoan);

module.exports = router;
