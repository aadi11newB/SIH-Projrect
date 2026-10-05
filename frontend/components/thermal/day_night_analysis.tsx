'use client';

import React from 'react';
import { Sun, Moon, AlertTriangle, ShieldCheck, Flame, Snowflake, Clock } from 'lucide-react';
import { ThermalSimulationResult } from '@/lib/types';

interface DayNightAnalysisProps {
  simulationResult: ThermalSimulationResult;
}

export const DayNightAnalysis: React.FC<DayNightAnalysisProps> = ({
  simulationResult,
}) => {
  const hasRisk = simulationResult.critical_cold_period_hours && simulationResult.critical_cold_period_hours.length > 0;

  return (
    <div className="tactical-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            DAY / NIGHT THERMAL DYNAMICS & HYPOTHERMIA RISK MONITOR
          </h3>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          hasRisk
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {hasRisk ? '⚠️ Caution: Nocturnal Drop Detected' : '✓ Safe Thermal Retention Zone'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Day Dynamics */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-navy-900 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs font-mono">
              <Sun className="w-4 h-4" />
              <span>DAYTIME SOLAR CHARGE (07:00 - 18:00)</span>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">
              {simulationResult.day_solar_storage_efficiency_pct}% Efficiency
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ☀️ <b>Solar Aperture Influx:</b> South glazing solarium captures and converts up to{' '}
            <b className="text-amber-300">{simulationResult.total_daily_solar_energy_captured_kwh} kWh</b> of direct
            solar irradiation.
          </p>
          <p className="text-xs text-slate-400">
            🔥 <b>Thermal Mass Damping:</b> Internal floor and wall core absorbs peak daytime radiation, preventing
            overheating while storing sensible heat for night discharge.
          </p>
        </div>

        {/* Night Dynamics */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-navy-900 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs font-mono">
              <Moon className="w-4 h-4" />
              <span>NIGHTTIME HEAT RETENTION (19:00 - 06:00)</span>
            </div>
            <span className="text-xs font-mono text-teal-300 font-bold">
              Score: {simulationResult.night_thermal_retention_score}/100
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ❄️ <b>Nocturnal Infiltration Resistance:</b> Continuous high-R envelope with{' '}
            <b className="text-teal-300">U = {simulationResult.envelope_overall_u_value_w_m2k} W/m²K</b> reduces conductive heat loss rate by ~75%.
          </p>
          <p className="text-xs text-slate-400">
            🏠 <b>Thermal Decay Resistance:</b> Stored heat in thermal mass discharges inward into living quarters during midnight sub-zero lows.
          </p>
        </div>
      </div>

      {/* Critical Cold Warning Box */}
      <div className={`p-3.5 rounded-lg border font-mono text-xs flex items-start space-x-3 ${
        hasRisk
          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          : 'bg-teal-950/40 border-teal-500/30 text-teal-200'
      }`}>
        {hasRisk ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div className="font-bold text-slate-100">
            {hasRisk ? 'HIGH THERMAL RISK PERIOD ALERT' : 'THERMAL ENVELOPE VERIFICATION COMPLETE'}
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            {simulationResult.critical_cold_warning}
          </p>
        </div>
      </div>
    </div>
  );
};
