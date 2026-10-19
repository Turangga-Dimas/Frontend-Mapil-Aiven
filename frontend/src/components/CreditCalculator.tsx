'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, DollarSign, Calendar, Percent, ShieldCheck } from 'lucide-react';

interface CreditCalculatorProps {
  onApplyPreset?: (amount: number, tenor: number) => void;
}

export default function CreditCalculator({ onApplyPreset }: CreditCalculatorProps) {
  const [amount, setAmount] = useState(10000000);
  const [tenor, setTenor] = useState(12);
  const [interestRate, setInterestRate] = useState(1.5);

  const monthlyRate = interestRate / 100;
  const monthlyPrincipal = amount / tenor;
  const monthlyInterest = amount * monthlyRate;
  const monthlyInstallment = Math.round(monthlyPrincipal + monthlyInterest);
  const totalPayment = monthlyInstallment * tenor;
  const totalInterest = totalPayment - amount;

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Simulasi Pinjaman Fintech</h3>
            <p className="text-xs text-slate-400">Kalkulator estimasi angsuran bulanan & total pengembalian</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Bunga Flat {interestRate}% / bln
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders and Controls */}
        <div className="space-y-5">
          {/* Slider Jumlah Pinjaman */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400 font-medium">Jumlah Pengajuan Pinjaman:</span>
              <span className="text-white font-bold font-mono text-sm">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="500000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>Rp 1.000.000</span>
              <span>Rp 25.000.000</span>
              <span>Rp 50.000.000</span>
            </div>
          </div>

          {/* Pilihan Tenor */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">Pilih Jangka Waktu (Tenor):</span>
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 12, 24].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenor(t)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                    tenor === t
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t} Bulan
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-700/80 flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Estimasi Cicilan per Bulan
            </p>
            <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              Rp {monthlyInstallment.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sudah termasuk pokok cicilan dan margin bunga flat
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Total Bunga:</span>
                <span className="font-semibold text-amber-400 font-mono">
                  Rp {totalInterest.toLocaleString('id-ID')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Pembayaran:</span>
                <span className="font-semibold text-sky-400 font-mono">
                  Rp {totalPayment.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {onApplyPreset && (
            <button
              type="button"
              onClick={() => onApplyPreset(amount, tenor)}
              className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <span>Ajukan Sekarang dengan Skema Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
