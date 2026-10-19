export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Loan {
  id: number;
  borrower_name: string;
  nik: string;
  phone: string;
  email: string;
  occupation: string;
  monthly_income: number | string;
  amount: number | string;
  tenor_months: number;
  interest_rate: number | string;
  monthly_installment: number | string;
  total_payment: number | string;
  purpose: string;
  status: LoanStatus;
  created_at: string;
  updated_at: string;
}

export interface LoanStats {
  totalLoans: number;
  totalRequestedAmount: number | string;
  totalDisbursedAmount: number | string;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  paidCount: number;
}

export interface HealthStatus {
  status: 'UP' | 'DEGRADED';
  database: 'CONNECTED' | 'DISCONNECTED';
  db_host?: string;
  error?: string;
  help?: string;
  timestamp?: string;
}
