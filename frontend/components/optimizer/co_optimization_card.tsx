'use client';

import React from 'react';
import { Sparkles, Award, Compass, Sun, Shield, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { OptimizedDesignVariant } from '@/lib/types';

interface CoOptimizationCardProps {
  bestDesign: OptimizedDesignVariant;
  onApplyDesign?: (design: OptimizedDesignVariant) => void;
}

export const CoOptimizationCard: React.FC<CoOptimizationCardProps> = ({
  bestDesign,
  onApplyDesign,
}) => {
  return (
    <div className="tactical-card p-6 bg-gradient-to-br from-teal-950/40 via-navy-900/90 to-blue-950/40 border-2 border-teal-500/50 shadow-2xl relative overflow-hidden space-y-5">
      {/* Decorative glow badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-500/30 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/30">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest text-teal-300 font-bold">
                ELITE CO-OPTIMIZATION FEATURE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 font-bold">
                RANK #1 CO-OPTIMAL
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-wide">
              {bestDesign.title}
            </h2>
          </div>
        </div>

        {onApplyDesign && (
          <button
            onClick={() => onApplyDesign(bestDesign)}
            className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-1.5 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Configuration</span>
          </button>
        )}
      </div>

      {/* Top 4 Score Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
        <div className="p-3 rounded-lg bg-navy-950/80 border border-teal-500/30">
          <div className="text-[10px] text-slate-400 uppercase">OVERALL SCORE</div>
          <div className="text-2xl font-black text-teal-300">{bestDesign.overall_score}/100</div>
        </div>
        <div className="p-3 rounded-lg bg-navy-950/80 border border-teal-500/30">
          <div className="text-[10px] text-slate-400 uppercase">THERMAL COMFORT</div>
          <div className="text-2xl font-black text-emerald-400">{bestDesign.thermal_comfort_score}/100</div>
        </div>
        <div className="p-3 rounded-lg bg-navy-950/80 border border-teal-500/30">
          <div className="text-[10px] text-slate-400 uppercase">SOLAR YIELD</div>
          <div className="text-2xl font-black text-amber-400">{bestDesign.solar_potential_score}/100</div>
        </div>
        <div className="p-3 rounded-lg bg-navy-950/80 border border-teal-500/30">
          <div className="text-[10px] text-slate-400 uppercase">NET ESTIMATED COST</div>
          <div className="text-2xl font-black text-blue-400">₹{(bestDesign.estimated_net_cost_inr / 100000).toFixed(2)}L</div>
        </div>
      </div>

      {/* Detailed Specifications Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-2 p-3.5 rounded-lg bg-navy-950/60 border border-slate-800">
          <div className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <Shield className="w-4 h-4" />
            <span>THERMAL ENVELOPE ARCHITECTURE</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Wall Assembly:</span>
            <span className="font-semibold">{bestDesign.wall_material_name}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Secondary Insulation:</span>
            <span className="font-semibold text-teal-300">{bestDesign.insulation_thickness_cm} cm {bestDesign.insulation_material_name}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Glazing Core:</span>
            <span className="font-semibold">{bestDesign.glazing_type_name}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Passive Solarium Aperture:</span>
            <span className="font-semibold text-amber-300">{bestDesign.south_window_area_sqm} m² (South)</span>
          </div>
        </div>

        <div className="space-y-2 p-3.5 rounded-lg bg-navy-950/60 border border-slate-800">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <Sun className="w-4 h-4" />
            <span>SOLAR PV & ORIENTATION</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Shelter Azimuth:</span>
            <span className="font-semibold text-teal-300">{bestDesign.shelter_orientation_deg}° True South</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Solar PV Capacity:</span>
            <span className="font-semibold text-amber-400">{bestDesign.solar_capacity_kw} kWp</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Annual Solar Generation:</span>
            <span className="font-semibold text-emerald-400">{bestDesign.annual_solar_generation_kwh.toLocaleString()} kWh/yr</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Gross / Net Cost:</span>
            <span className="font-semibold">₹{bestDesign.estimated_project_cost_inr.toLocaleString()} / <b className="text-teal-300">₹{bestDesign.estimated_net_cost_inr.toLocaleString()}</b></span>
          </div>
        </div>
      </div>

      {/* Engineering Rationales Bullet List */}
      <div className="p-3.5 rounded-lg bg-navy-950/80 border border-teal-500/20 space-y-1.5 text-xs font-mono">
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          ENGINEERING CO-OPTIMIZATION RATIONALES:
        </div>
        {bestDesign.rationales.map((rat, i) => (
          <div key={i} className="flex items-start space-x-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">{rat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
