import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'PAID'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Status tidak valid. Harus salah satu dari: PENDING, APPROVED, REJECTED, PAID'
        },
        { status: 400 }
      );
    }

    const [result] = await pool.query('UPDATE loans SET status = ? WHERE id = ?', [status, id]);
    const affected = (result as ResultSetHeader).affectedRows;

    if (affected === 0) {
      return NextResponse.json({ success: false, message: 'Data pinjaman tidak ditemukan.' }, { status: 404 });
    }

    const [updatedRows] = await pool.query('SELECT * FROM loans WHERE id = ?', [id]);
    const updatedData = Array.isArray(updatedRows) && updatedRows.length > 0 ? updatedRows[0] : null;

    return NextResponse.json({
      success: true,
      message: `Status pinjaman berhasil diubah menjadi ${status}!`,
      data: updatedData
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
