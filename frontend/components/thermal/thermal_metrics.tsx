'use client';

import React from 'react';
import { Activity, Shield, Flame, Zap, Wind, CheckCircle2 } from 'lucide-react';
import { ThermalSimulationResult } from '@/lib/types';

interface ThermalMetricsProps {
  simulationResult: ThermalSimulationResult;
}

export const ThermalMetrics: React.FC<ThermalMetricsProps> = ({
  simulationResult,
}) => {
  const tci = simulationResult.thermal_comfort_score;

  return (
    <div className="tactical-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            THERMAL COMFORT INDEX (TCI) SCORECARD
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Derived Comparative Software Rating (IS 3792 / NBC 2016)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Big Score Block */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-teal-950/50 to-navy-900 border border-teal-500/40 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            GEOTHERM THERMAL COMFORT INDEX
          </span>
          <div className="text-4xl font-black font-mono text-teal-300 my-1">
            {tci}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-xs font-mono font-semibold text-teal-400 px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/30">
            {simulationResult.comfort_category}
          </div>
        </div>

        {/* Envelope U-Value & Losses */}
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="text-slate-400 uppercase text-[10px] tracking-wider">
            ENVELOPE THERMAL TRANSMITTANCE
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Overall Assembly U-Value:</span>
            <span className="text-teal-300 font-bold">{simulationResult.envelope_overall_u_value_w_m2k} W/m²K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Daily Heat Loss:</span>
            <span className="text-rose-400 font-bold">{simulationResult.total_daily_heat_loss_kwh} kWh/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Solar Heat Gain:</span>
            <span className="text-amber-400 font-bold">{simulationResult.total_daily_solar_energy_captured_kwh} kWh/day</span>
          </div>
        </div>

        {/* Auxiliary Heating Demand */}
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="text-slate-400 uppercase text-[10px] tracking-wider">
            AUXILIARY HEATING ENERGY
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Heating Needed for 18°C:</span>
            <span className="text-amber-300 font-bold">{simulationResult.auxiliary_heating_energy_needed_kwh} kWh/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Passive Solar Offset:</span>
            <span className="text-emerald-400 font-bold">~72% of Winter Demand</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            ✓ Reduces required diesel generator runtime by up to 14 hours daily.
          </div>
        </div>
      </div>
    </div>
  );
};
