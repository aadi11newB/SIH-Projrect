'use client';

import React from 'react';
import { Cpu, CheckCircle, Shield, Sun, Sparkles, ArrowRight } from 'lucide-react';
import { CoOptimizationResult, OptimizedDesignVariant } from '@/lib/types';

interface OptimizerPanelProps {
  optimizationResult: CoOptimizationResult;
  onSelectVariant: (variant: OptimizedDesignVariant) => void;
}

export const OptimizerPanel: React.FC<OptimizerPanelProps> = ({
  optimizationResult,
  onSelectVariant,
}) => {
  return (
    <div className="space-y-6">
      <div className="tactical-card p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              TOP 3 RECOMMENDED DESIGNS MATRIX
            </h3>
          </div>
          <span className="text-[11px] font-mono text-teal-300">
            Multi-Objective Pareto Optimal Variants
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {optimizationResult.top_3_variants.map((v) => {
            const isRank1 = v.rank === 1;

            return (
              <div
                key={v.rank}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] ${
                  isRank1
                    ? 'bg-navy-900/90 border-teal-400/50 shadow-lg shadow-teal-500/10'
                    : 'bg-navy-950/70 border-slate-800'
                }`}
              >
                <div>
                  {/* Rank Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isRank1
                        ? 'bg-teal-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      RANK #{v.rank}
                    </span>
                    <span className="text-sm font-black font-mono text-teal-300">
                      Score: {v.overall_score}/100
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm mb-2 leading-snug">
                    {v.title}
                  </h4>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3">
                    <div className="p-2 rounded bg-navy-950/80 border border-slate-800/80">
                      <div className="text-slate-400 text-[9px]">Thermal Score</div>
                      <div className="text-emerald-400 font-bold">{v.thermal_comfort_score}/100</div>
                    </div>
                    <div className="p-2 rounded bg-navy-950/80 border border-slate-800/80">
                      <div className="text-slate-400 text-[9px]">Solar Score</div>
                      <div className="text-amber-400 font-bold">{v.solar_potential_score}/100</div>
                    </div>
                    <div className="p-2 rounded bg-navy-950/80 border border-slate-800/80">
                      <div className="text-slate-400 text-[9px]">Solar Array</div>
                      <div className="text-slate-200 font-bold">{v.solar_capacity_kw} kWp</div>
                    </div>
                    <div className="p-2 rounded bg-navy-950/80 border border-slate-800/80">
                      <div className="text-slate-400 text-[9px]">Net Est. Cost</div>
                      <div className="text-teal-300 font-bold">₹{(v.estimated_net_cost_inr / 100000).toFixed(2)}L</div>
                    </div>
                  </div>

                  {/* Summary bullets */}
                  <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                    <div>• <b>Wall:</b> {v.wall_material_name}</div>
                    <div>• <b>Insulation:</b> {v.insulation_thickness_cm}cm {v.insulation_material_name}</div>
                    <div>• <b>Window:</b> {v.south_window_area_sqm}m² ({v.glazing_type_name.split(' ')[0]})</div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectVariant(v)}
                  className={`w-full py-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all ${
                    isRank1
                      ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md'
                      : 'bg-navy-900 hover:bg-navy-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>Select Rank #{v.rank}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
