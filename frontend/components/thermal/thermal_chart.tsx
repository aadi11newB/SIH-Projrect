'use client';

import React, { useState } from 'react';
import { LineChart, Thermometer, Sun, Snowflake, Eye, Zap } from 'lucide-react';
import { ThermalSimulationResult } from '@/lib/types';

interface ThermalChartProps {
  simulationResult: ThermalSimulationResult;
}

export const ThermalChart: React.FC<ThermalChartProps> = ({ simulationResult }) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [showSolarGain, setShowSolarGain] = useState(true);
  const [showHeatLoss, setShowHeatLoss] = useState(true);

  const hours = simulationResult.hourly_hours || Array.from({ length: 24 }, (_, i) => i);
  const tOut = simulationResult.hourly_outdoor_temp_c || [];
  const tIn = simulationResult.hourly_indoor_temp_c || [];
  const qSol = simulationResult.hourly_solar_heat_gain_w || [];
  const qLoss = (simulationResult.hourly_conduction_heat_loss_w || []).map(
    (c, i) => c + (simulationResult.hourly_infiltration_loss_w?.[i] || 0)
  );

  // Compute chart scale bounds
  const minTemp = Math.min(...tOut, ...tIn, -25);
  const maxTemp = Math.max(...tOut, ...tIn, 30);
  const tempRange = Math.max(20, maxTemp - minTemp);

  const maxPower = Math.max(...qSol, ...qLoss, 1000);

  // Helper coordinate mapper
  const getYForTemp = (temp: number) => {
    return 100 - ((temp - minTemp) / tempRange) * 100;
  };

  // Generate SVG polyline path strings
  const getPolylinePath = (data: number[], scaleFn: (v: number) => number) => {
    return data
      .map((val, idx) => {
        const x = (idx / 23) * 100;
        const y = scaleFn(val);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const pathIndoor = getPolylinePath(tIn, getYForTemp);
  const pathOutdoor = getPolylinePath(tOut, getYForTemp);

  // Comfort band Y coordinates (18°C to 24°C)
  const yComfortTop = getYForTemp(24);
  const yComfortBottom = getYForTemp(18);
  const comfortHeight = Math.max(4, yComfortBottom - yComfortTop);

  return (
    <div className="tactical-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            24-HOUR DYNAMIC THERMAL PERFORMANCE (DIURNAL CYCLE)
          </h3>
        </div>

        {/* Legend toggles */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1 text-teal-300">
            <span className="w-3 h-1 rounded bg-teal-400" />
            <span>Indoor Temp</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-400">
            <span className="w-3 h-1 rounded bg-blue-400 border-dashed" />
            <span>Outdoor Ambient</span>
          </div>
          <button
            onClick={() => setShowSolarGain(!showSolarGain)}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] ${
              showSolarGain ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' : 'text-slate-500'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Solar Flux</span>
          </button>
          <button
            onClick={() => setShowHeatLoss(!showHeatLoss)}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] ${
              showHeatLoss ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30' : 'text-slate-500'
            }`}
          >
            <Snowflake className="w-3 h-3" />
            <span>Heat Loss</span>
          </button>
        </div>
      </div>

      {/* Main SVG Vector Graph */}
      <div className="relative w-full h-[260px] sm:h-[300px] bg-navy-950/90 rounded-xl border border-teal-500/30 p-4 select-none">
        {/* SVG Canvas */}
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredHour(null)}
        >
          {/* Comfort Band Highlight (18°C - 24°C) */}
          <rect
            x="0"
            y={yComfortTop}
            width="100"
            height={comfortHeight}
            fill="#14b8a6"
            fillOpacity="0.08"
            stroke="#14b8a6"
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />

          {/* Zero degree freeze line */}
          {minTemp < 0 && maxTemp > 0 && (
            <line
              x1="0"
              y1={getYForTemp(0)}
              x2="100"
              y2={getYForTemp(0)}
              stroke="#38bdf8"
              strokeWidth="0.4"
              strokeDasharray="1 2"
              opacity="0.4"
            />
          )}

          {/* Solar Flux Area (Optional) */}
          {showSolarGain && (
            <polygon
              points={`0,100 ${getPolylinePath(qSol, (q) => 100 - (q / maxPower) * 45)} 100,100`}
              fill="url(#solarGradient)"
              opacity="0.25"
            />
          )}

          {/* Outdoor Ambient Temperature Line */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            points={pathOutdoor}
          />

          {/* Indoor Simulated Temperature Line */}
          <polyline
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="2.0"
            points={pathIndoor}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="solarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Hover interactive bars */}
          {hours.map((h, i) => {
            const x = (i / 23) * 100;
            return (
              <rect
                key={h}
                x={x - 2}
                y="0"
                width="4"
                height="100"
                fill="transparent"
                onMouseEnter={() => setHoveredHour(h)}
                className="cursor-pointer hover:fill-teal-400/10"
              />
            );
          })}
        </svg>

        {/* Y Axis Reference Labels */}
        <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between text-[9px] font-mono text-slate-500 pointer-events-none">
          <span>{maxTemp.toFixed(0)}°C</span>
          <span className="text-teal-400/80">24°C Comfort</span>
          <span className="text-teal-400/80">18°C Baseline</span>
          {minTemp < 0 && <span className="text-blue-400/80">0°C Freezing</span>}
          <span>{minTemp.toFixed(0)}°C</span>
        </div>

        {/* Hover Tooltip Telemetry */}
        {hoveredHour !== null && (
          <div className="absolute top-3 right-3 bg-navy-950/95 border border-teal-500/50 p-3 rounded-lg shadow-xl font-mono text-xs z-30 pointer-events-none space-y-1">
            <div className="text-teal-300 font-bold border-b border-slate-800 pb-1">
              TIME: {hoveredHour.toString().padStart(2, '0')}:00 HRS
            </div>
            <div className="text-teal-400">
              Indoor Temp: <b>{tIn[hoveredHour]}°C</b>
            </div>
            <div className="text-blue-400">
              Outdoor Ambient: <b>{tOut[hoveredHour]}°C</b>
            </div>
            <div className="text-amber-400">
              Solar Aperture Gain: <b>{qSol[hoveredHour]} W</b>
            </div>
            <div className="text-rose-400">
              Envelope Heat Loss: <b>{qLoss[hoveredHour].toFixed(0)} W</b>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Key Simulation Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-lg bg-navy-900/60 border border-slate-800">
          <div className="text-slate-400 text-[10px]">Peak Indoor Temp</div>
          <div className="text-amber-400 font-bold text-sm">+{simulationResult.peak_indoor_temp_c}°C</div>
        </div>
        <div className="p-2.5 rounded-lg bg-navy-900/60 border border-slate-800">
          <div className="text-slate-400 text-[10px]">Min Indoor Temp</div>
          <div className="text-teal-400 font-bold text-sm">+{simulationResult.min_indoor_temp_c}°C</div>
        </div>
        <div className="p-2.5 rounded-lg bg-navy-900/60 border border-slate-800">
          <div className="text-slate-400 text-[10px]">Diurnal Damping Swing</div>
          <div className="text-slate-200 font-bold text-sm">{simulationResult.diurnal_temperature_swing_c}°C (Stable)</div>
        </div>
        <div className="p-2.5 rounded-lg bg-navy-900/60 border border-slate-800">
          <div className="text-slate-400 text-[10px]">Daily Solar Captured</div>
          <div className="text-emerald-400 font-bold text-sm">{simulationResult.total_daily_solar_energy_captured_kwh} kWh</div>
        </div>
      </div>
    </div>
  );
};
