import { HealthStatus, Loan, LoanStats, LoanStatus } from '../types/loan';

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend offline';
    return {
      status: 'DEGRADED',
      database: 'DISCONNECTED',
      error: 'Backend Express belum aktif atau tidak dapat dijangkau: ' + message
    };
  }
}

export async function fetchStats(): Promise<LoanStats> {
  const res = await fetch(`${API_BASE}/stats`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Gagal mengambil statistik dashboard');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchLoans(params?: { status?: string; search?: string }): Promise<Loan[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'ALL') {
    query.set('status', params.status);
  }
  if (params?.search) {
    query.set('search', params.search);
  }

  const res = await fetch(`${API_BASE}/loans?${query.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Gagal mengambil data pinjaman');
  }
  const json = await res.json();
  return json.data;
}

export async function createLoan(payload: Partial<Loan>): Promise<Loan> {
  const res = await fetch(`${API_BASE}/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal membuat pengajuan pinjaman');
  }
  return json.data;
}

export async function updateLoan(id: number, payload: Partial<Loan>): Promise<Loan> {
  const res = await fetch(`${API_BASE}/loans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal memperbarui data pinjaman');
  }
  return json.data;
}

export async function updateLoanStatus(id: number, status: LoanStatus): Promise<Loan> {
  const res = await fetch(`${API_BASE}/loans/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal mengubah status pinjaman');
  }
  return json.data;
}

export async function deleteLoan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/loans/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menghapus data pinjaman');
  }
}
