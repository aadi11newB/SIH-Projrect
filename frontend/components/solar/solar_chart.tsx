'use client';

import React from 'react';
import { BarChart3, Calendar, Zap } from 'lucide-react';
import { SolarEstimateResult } from '@/lib/types';

interface SolarChartProps {
  solarResult: SolarEstimateResult;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const SolarChart: React.FC<SolarChartProps> = ({ solarResult }) => {
  const monthly = solarResult.monthly_generation_kwh || [];
  const maxGen = Math.max(...monthly, 1);

  return (
    <div className="tactical-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            12-MONTH SOLAR HARVEST DISTRIBUTION (kWh)
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Zap className="w-3.5 h-3.5" />
          <span>Annual Total: {solarResult.estimated_annual_generation_kwh.toLocaleString()} kWh</span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="h-56 w-full pt-4 pb-2">
        <div className="h-full flex items-end justify-between gap-1.5 sm:gap-3 px-2">
          {monthly.map((val, idx) => {
            const heightPercent = Math.max(8, (val / maxGen) * 100);
            const isPeak = val === maxGen;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-950 text-teal-300 font-mono text-[10px] px-2 py-1 rounded border border-teal-500/40 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  {MONTH_NAMES[idx]}: {val} kWh
                </div>

                {/* Value on top of bar for peaks */}
                <span className="text-[9px] font-mono text-slate-400 mb-1 hidden sm:block">
                  {val}
                </span>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isPeak
                      ? 'bg-gradient-to-t from-teal-600 to-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-gradient-to-t from-blue-900 to-teal-500 hover:from-teal-600 hover:to-teal-300'
                  }`}
                />

                {/* Month label */}
                <span className={`text-[10px] font-mono mt-2 ${isPeak ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {MONTH_NAMES[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-amber-400" />
          <span>Summer Peak (May-Jun): Highest Radiation Window</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-blue-600" />
          <span>Winter Clear-Sky (Nov-Jan): Enhanced Albedo Capture</span>
        </div>
      </div>
    </div>
  );
};
