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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Data pinjaman tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      status,
      interest_rate = 1.50
    } = body;

    const [existing] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);
    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ success: false, message: 'Data pinjaman tidak ditemukan.' }, { status: 404 });
    }

    const currentLoan = existing[0] as Record<string, any>;
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
    const updatedData = Array.isArray(updatedRows) && updatedRows.length > 0 ? updatedRows[0] : null;

    return NextResponse.json({
      success: true,
      message: 'Data pinjaman berhasil diperbarui!',
      data: updatedData
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result] = await pool.query('DELETE FROM loans WHERE id = ?', [id]);
    const affected = (result as ResultSetHeader).affectedRows;

    if (affected === 0) {
      return NextResponse.json({ success: false, message: 'Data pinjaman tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Data pinjaman berhasil dihapus!'
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
