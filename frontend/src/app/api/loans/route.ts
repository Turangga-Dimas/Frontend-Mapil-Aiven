import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

function calculateLoanDetails(amount: number, tenorMonths: number, interestRate = 1.5) {
  const principal = parseFloat(String(amount));
  const tenor = parseInt(String(tenorMonths), 10);
  const monthlyRate = parseFloat(String(interestRate)) / 100;

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM loans WHERE 1=1';
    const params: (string | number)[] = [];

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
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data pinjaman: ' + errorMsg
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    if (!borrower_name || !nik || !phone || !email || !occupation || !monthly_income || !amount || !tenor_months) {
      return NextResponse.json(
        { success: false, message: 'Mohon lengkapi seluruh field yang wajib diisi.' },
        { status: 400 }
      );
    }

    if (String(nik).length < 16) {
      return NextResponse.json(
        { success: false, message: 'NIK harus berjumlah minimal 16 digit angka.' },
        { status: 400 }
      );
    }

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
    const insertId = (result as ResultSetHeader).insertId;
    const [createdRows] = await pool.query('SELECT * FROM loans WHERE id = ?', [insertId]);
    const createdData = Array.isArray(createdRows) && createdRows.length > 0 ? createdRows[0] : null;

    return NextResponse.json(
      {
        success: true,
        message: 'Pengajuan pinjaman berhasil dibuat!',
        data: createdData
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal membuat pengajuan: ' + errorMsg
      },
      { status: 500 }
    );
  }
}
