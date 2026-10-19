import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS solution');
    const isConnected = Array.isArray(result) && (result[0] as { solution: number })?.solution === 2;
    return NextResponse.json({
      status: 'UP',
      database: isConnected ? 'CONNECTED' : 'DISCONNECTED',
      db_host: process.env.DATABASE_URL ? 'Aiven Cloud' : (process.env.DB_HOST || 'localhost'),
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown database error';
    return NextResponse.json(
      {
        status: 'DEGRADED',
        database: 'DISCONNECTED',
        error: errorMsg,
        help: 'Silakan isi Environment Variable DATABASE_URL di Dashboard Vercel.'
      },
      { status: 503 }
    );
  }
}
