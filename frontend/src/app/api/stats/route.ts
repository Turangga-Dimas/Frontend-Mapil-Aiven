import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
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

    const data = Array.isArray(rows) && rows.length > 0 ? rows[0] : {};
    return NextResponse.json({
      success: true,
      data
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil statistik: ' + errorMsg
      },
      { status: 500 }
    );
  }
}
