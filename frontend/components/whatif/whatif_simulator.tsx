'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, Sparkles, RefreshCw, Flame, Sun, Shield, DollarSign } from 'lucide-react';

interface WhatIfSimulatorProps {
  initialInsulationCm?: number;
  initialOrientationDeg?: number;
  initialWindowSqm?: number;
  initialSolarKw?: number;
  baseOutdoorMin?: number;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialInsulationCm = 10.0,
  initialOrientationDeg = 180.0,
  initialWindowSqm = 8.0,
  initialSolarKw = 8.0,
  baseOutdoorMin = -18.5,
}) => {
  const [insulationCm, setInsulationCm] = useState(initialInsulationCm);
  const [orientationDeg, setOrientationDeg] = useState(initialOrientationDeg);
  const [windowSqm, setWindowSqm] = useState(initialWindowSqm);
  const [solarKw, setSolarKw] = useState(initialSolarKw);

  // Real-time instantaneous recalculations
  const results = useMemo(() => {
    // Orientation penalty factor (0° = North, 180° = South)
    const orientationAlignment = Math.max(0.2, Math.cos(((orientationDeg - 180) * Math.PI) / 180));
    
    // Insulation thermal resistance
    const rIns = insulationCm / 3.4; // 10cm -> R ~ 2.94
    const uOverall = Math.max(0.12, 1.0 / (0.17 + rIns + 0.15)); // W/m²K
    
    // Passive solar heat gain
    const passiveSolarGainKwh = windowSqm * 2.8 * orientationAlignment; // kWh/day in winter
    
    // Total heat loss
    const totalHeatLossKwh = Math.max(10, 180 * uOverall * 0.7);
    
    // Indoor temperatures
    const tempLift = (insulationCm * 1.4) + (passiveSolarGainKwh * 0.9) - (1.0 - orientationAlignment) * 8.0;
    const minIndoor = Number((baseOutdoorMin + tempLift + 6.0).toFixed(1));
    const peakIndoor = Number((minIndoor + 8.5 + (windowSqm * 0.5)).toFixed(1));
    
    // Solar generation (kWh/year)
    const annualGenKwh = Math.round(solarKw * 1650 * (0.85 + orientationAlignment * 0.15));
    
    // Cost estimation
    const grossCost = 350000 + (insulationCm * 18000) + (windowSqm * 4800) + (solarKw * 52000);
    const subsidy = Math.min(350000, 78000 + solarKw * 22000);
    const netCost = Math.max(0, grossCost - subsidy);
    
    // Scores
    const thermalScore = Math.min(98, Math.max(30, Math.round(50 + (minIndoor + 10) * 2.2)));
    const solarScore = Math.min(99, Math.max(40, Math.round((solarKw / 10.0) * 45 + orientationAlignment * 45 + 10)));
    const overallScore = Math.round((thermalScore * 0.5) + (solarScore * 0.3) + (Math.max(50, 100 - (netCost / 1200000) * 30) * 0.2));

    return {
      minIndoor,
      peakIndoor,
      totalHeatLossKwh: Number(totalHeatLossKwh.toFixed(1)),
      annualGenKwh,
      netCost,
      overallScore,
      thermalScore,
      solarScore,
      uOverall: Number(uOverall.toFixed(3)),
    };
  }, [insulationCm, orientationDeg, windowSqm, solarKw, baseOutdoorMin]);

  const handleReset = () => {
    setInsulationCm(10.0);
    setOrientationDeg(180.0);
    setWindowSqm(8.0);
    setSolarKw(8.0);
  };

  return (
    <div className="tactical-card p-6 space-y-6 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-950 border border-teal-500/40 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-teal-400 animate-pulse-subtle" />
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              REAL-TIME “WHAT IF?” INTERACTIVE SIMULATOR
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Adjust parameters below to see instantaneous recalculation of comfort, energy yield, and cost.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono flex items-center space-x-1 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Sliders vs Instant Telemetry Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive Sliders */}
        <div className="lg:col-span-7 space-y-5 bg-navy-900/60 p-4 rounded-xl border border-slate-800 font-mono">
          {/* Slider 1: Insulation */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Wall Insulation Thickness:</span>
              </span>
              <span className="text-teal-300 font-bold bg-teal-950 px-2 py-0.5 rounded border border-teal-500/40">
                {insulationCm} cm
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="25.0"
              step="0.5"
              value={insulationCm}
              onChange={(e) => setInsulationCm(parseFloat(e.target.value))}
              className="w-full accent-teal-400 h-2 bg-navy-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>2 cm (Minimal)</span>
              <span>10 cm (Recommended)</span>
              <span>25 cm (Extreme Sub-Arctic)</span>
            </div>
          </div>

          {/* Slider 2: Orientation */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Shelter Orientation Azimuth:</span>
              </span>
              <span className="text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                {orientationDeg}° ({orientationDeg === 180 ? 'True South' : orientationDeg < 180 ? 'East of South' : 'West of South'})
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="360.0"
              step="5.0"
              value={orientationDeg}
              onChange={(e) => setOrientationDeg(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-navy-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0° (North)</span>
              <span>90° (East)</span>
              <span>180° (True South Optimal)</span>
              <span>270° (West)</span>
            </div>
          </div>

          {/* Slider 3: South Window Solarium Area */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>South Window Glazing Area:</span>
              </span>
              <span className="text-rose-300 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
                {windowSqm} m²
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              value={windowSqm}
              onChange={(e) => setWindowSqm(parseFloat(e.target.value))}
              className="w-full accent-rose-400 h-2 bg-navy-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 m² (Minimalist)</span>
              <span>8 m² (Balanced Solarium)</span>
              <span>20 m² (Full Trombe Wall)</span>
            </div>
          </div>

          {/* Slider 4: Solar PV Capacity */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <Sun className="w-4 h-4 text-teal-400" />
                <span>Solar PV Array Capacity:</span>
              </span>
              <span className="text-teal-300 font-bold bg-teal-950 px-2 py-0.5 rounded border border-teal-500/40">
                {solarKw} kWp
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.5"
              value={solarKw}
              onChange={(e) => setSolarKw(parseFloat(e.target.value))}
              className="w-full accent-teal-400 h-2 bg-navy-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 kW (Emergency Only)</span>
              <span>8 kW (Full Autonomy)</span>
              <span>25 kW (Micro-Grid Hub)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Real-Time Dynamic Outputs */}
        <div className="lg:col-span-5 space-y-3 font-mono flex flex-col justify-between">
          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-950/60 to-navy-900 border border-teal-500/50 shadow-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              DYNAMIC COMPOSITE SCORE
            </div>
            <div className="text-4xl font-black text-teal-300">
              {results.overallScore}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="text-xs text-teal-400 font-semibold mt-1">
              Thermal: {results.thermalScore} | Solar: {results.solarScore}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-navy-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Min Indoor Temp</div>
              <div className="text-teal-400 font-bold text-sm">+{results.minIndoor}°C</div>
            </div>
            <div className="p-3 rounded-lg bg-navy-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Peak Indoor Temp</div>
              <div className="text-amber-400 font-bold text-sm">+{results.peakIndoor}°C</div>
            </div>
            <div className="p-3 rounded-lg bg-navy-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Annual Solar Yield</div>
              <div className="text-emerald-400 font-bold text-sm">{results.annualGenKwh.toLocaleString()} kWh</div>
            </div>
            <div className="p-3 rounded-lg bg-navy-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Est. Net Project Cost</div>
              <div className="text-blue-400 font-bold text-sm">₹{(results.netCost / 100000).toFixed(2)}L</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 text-[11px] text-slate-400">
            <b>Live Thermal Damping:</b> Envelope U-value = <b className="text-teal-300">{results.uOverall} W/m²K</b> | Daily Heat Loss = <b className="text-rose-300">{results.totalHeatLossKwh} kWh</b>
          </div>
        </div>
      </div>
    </div>
  );
};
