'use client';

import React from 'react';
import { TrendingUp, BarChart2, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { FinancialCalculationResult } from '@/lib/types';

interface FinancialProjectionsProps {
  financialResult: FinancialCalculationResult;
}

export const FinancialProjections: React.FC<FinancialProjectionsProps> = ({
  financialResult,
}) => {
  return (
    <div className="tactical-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            LIFECYCLE FINANCIAL COMPARISON & 10-YEAR ROI PROJECTIONS
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-300">
          Simple Payback: <b className="text-sm font-bold text-teal-300">{financialResult.simple_payback_period_years} Years</b>
        </span>
      </div>

      {/* Without Solar vs With Solar Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Without Solar */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-navy-900 border border-rose-500/30 space-y-3">
          <div className="text-rose-400 font-bold uppercase tracking-wider text-xs border-b border-rose-500/20 pb-2 flex items-center justify-between">
            <span>WITHOUT SOLAR & PASSIVE INSULATION</span>
            <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded">Baseline</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Heating / Diesel Power Fuel:</span>
              <span className="text-slate-200 font-bold">₹{financialResult.annual_external_energy_cost_without_solar_inr.toLocaleString()} / yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DG Set Carbon Footprint:</span>
              <span className="text-rose-400 font-bold">~14.2 Tonnes CO₂/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">10-Year Fuel Cost:</span>
              <span className="text-rose-300 font-bold">₹{(financialResult.annual_external_energy_cost_without_solar_inr * 12.0 / 100000).toFixed(2)} Lakhs</span>
            </div>
          </div>
        </div>

        {/* With Solar */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-teal-950/40 to-navy-900 border border-teal-500/40 space-y-3">
          <div className="text-teal-400 font-bold uppercase tracking-wider text-xs border-b border-teal-500/20 pb-2 flex items-center justify-between">
            <span>WITH GEOTHERM SHIELD OPTIMIZATION</span>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">Optimized</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Residual Energy Cost:</span>
              <span className="text-teal-300 font-bold">₹{financialResult.annual_energy_cost_with_solar_inr.toLocaleString()} / yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Annual Net Savings:</span>
              <span className="text-emerald-400 font-bold">₹{financialResult.annual_net_savings_inr.toLocaleString()} / yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">10-Year Net Cash Flow Gain:</span>
              <span className="text-emerald-300 font-bold">₹{(financialResult.ten_year_cumulative_savings_inr / 100000).toFixed(2)} Lakhs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Year Cumulative Projections Summary Bar */}
      <div className="p-4 rounded-xl bg-navy-950/80 border border-teal-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center text-xs">
        <div>
          <div className="text-slate-400 text-[10px] uppercase">CAPITAL INVESTMENT PAYBACK</div>
          <div className="text-2xl font-black text-teal-300 my-1">{financialResult.simple_payback_period_years} Years</div>
          <div className="text-[11px] text-slate-400">Fast payback via high energy offset</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px] uppercase">10-YEAR CUMULATIVE RETURN</div>
          <div className="text-2xl font-black text-emerald-400 my-1">+{financialResult.roi_percentage}%</div>
          <div className="text-[11px] text-emerald-400">Internal Rate of Return (IRR)</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px] uppercase">10-YEAR NET BENEFIT</div>
          <div className="text-2xl font-black text-blue-400 my-1">₹{financialResult.ten_year_cumulative_savings_inr.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">After all CapEx recovery</div>
        </div>
      </div>
    </div>
  );
};
