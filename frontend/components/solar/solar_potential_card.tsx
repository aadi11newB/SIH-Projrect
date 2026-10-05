'use client';

import React from 'react';
import { Sun, Compass, Zap, Leaf, ShieldAlert, Award } from 'lucide-react';
import { SolarEstimateResult, LocationProfile } from '@/lib/types';

interface SolarPotentialCardProps {
  location: LocationProfile;
  solarResult: SolarEstimateResult;
}

export const SolarPotentialCard: React.FC<SolarPotentialCardProps> = ({
  location,
  solarResult,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-teal-400 border-teal-500/40 bg-teal-950/40';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  return (
    <div className="tactical-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            SOLAR SITE & POTENTIAL ANALYZER
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Preliminary Software Estimate
        </span>
      </div>

      {/* Main Score & Top Specs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score Badge */}
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(solarResult.solar_potential_score)}`}>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            SOLAR POTENTIAL SCORE
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-teal-300">
            {solarResult.solar_potential_score}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-[10px] font-mono mt-1 text-teal-400">
            {solarResult.solar_potential_score >= 90 ? '★ Exceptional Yield Zone' : '✓ Highly Viable Zone'}
          </div>
        </div>

        {/* Optimal Tilt & Orientation */}
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>OPTICAL GEOMETRY</span>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Recommended Tilt:</div>
            <div className="text-sm font-bold text-slate-200">{solarResult.recommended_tilt_deg}° (Latitude Biased)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Recommended Orientation:</div>
            <div className="text-sm font-bold text-teal-400">True South (180° Azimuth)</div>
          </div>
        </div>

        {/* Capacity & Panels */}
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>SYSTEM CAPACITY</span>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Installed Array Power:</div>
            <div className="text-sm font-bold text-amber-400">{solarResult.installed_capacity_kw} kWp</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Panel Modules:</div>
            <div className="text-sm font-bold text-slate-200">{solarResult.number_of_panels} Units ({solarResult.panel_area_used_sqm} m²)</div>
          </div>
        </div>

        {/* Annual Yield & Carbon Offset */}
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESTIMATED HARVEST</span>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Annual Solar Yield:</div>
            <div className="text-sm font-bold text-emerald-400">{solarResult.estimated_annual_generation_kwh.toLocaleString()} kWh/yr</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Carbon Offset:</div>
            <div className="text-sm font-bold text-slate-200">{solarResult.co2_offset_tonnes_per_year} Tonnes CO₂/yr</div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-navy-950/80 rounded-lg border border-teal-500/20 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-teal-400" />
          <span><b>Methodology:</b> {solarResult.method} (Clear Sky + Isotropic Transposition Model)</span>
        </div>
        <span className="text-teal-400">Roof Area Utilization: {solarResult.roof_utilization_pct}%</span>
      </div>
    </div>
  );
};
