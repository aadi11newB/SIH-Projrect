'use client';

import React from 'react';
import { Grid, Sun, Shield, Layers, ArrowUpRight } from 'lucide-react';
import { SolarEstimateResult } from '@/lib/types';

interface SolarLayoutPreviewProps {
  solarResult: SolarEstimateResult;
  roofAreaSqm: number;
}

export const SolarLayoutPreview: React.FC<SolarLayoutPreviewProps> = ({
  solarResult,
  roofAreaSqm,
}) => {
  const panelCount = solarResult.number_of_panels;
  // Compute rows and columns for visual grid
  const cols = Math.min(8, Math.max(3, Math.ceil(Math.sqrt(panelCount * 1.5))));
  const rows = Math.ceil(panelCount / cols);

  return (
    <div className="tactical-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Grid className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            ROOF SOLAR ARRAY PACKING & LAYOUT PREVIEW
          </h3>
        </div>
        <span className="text-[11px] font-mono text-teal-400">
          Optimal Tilt: {solarResult.recommended_tilt_deg}° | Azimuth: 180° (South)
        </span>
      </div>

      {/* Visual Roof Grid Simulation */}
      <div className="relative p-6 rounded-xl bg-gradient-to-b from-slate-900 to-navy-950 border border-teal-500/30 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
        {/* Sun Vector Indicator */}
        <div className="absolute top-3 right-4 flex items-center space-x-1.5 text-xs font-mono text-amber-400 bg-navy-950/80 px-2.5 py-1 rounded-md border border-amber-500/30">
          <Sun className="w-4 h-4 animate-spin-slow" />
          <span>Peak Insolation: South</span>
        </div>

        {/* Roof Envelope Bounds */}
        <div className="relative p-4 rounded-lg bg-slate-900/90 border-2 border-dashed border-teal-500/40 shadow-2xl max-w-full">
          <div className="text-[10px] font-mono text-teal-300/70 mb-2 text-center uppercase tracking-wider">
            ROOF ZONE A — ACTIVE PV MOUNTING APERTURE ({roofAreaSqm} m²)
          </div>

          {/* Grid of Photovoltaic Modules */}
          <div
            className="grid gap-1.5 justify-center"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: panelCount }).map((_, idx) => (
              <div
                key={idx}
                className="w-9 h-14 sm:w-12 sm:h-18 rounded bg-gradient-to-br from-blue-900 via-sky-950 to-blue-900 border border-teal-400/60 shadow flex flex-col justify-between p-1 group hover:border-amber-400 hover:scale-105 transition-all cursor-pointer relative"
                title={`PV String Module #${idx + 1} (450Wp Mono PERC)`}
              >
                {/* Silicon cell lines */}
                <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-0.5 opacity-60">
                  {Array.from({ length: 6 }).map((_, cIdx) => (
                    <div key={cIdx} className="bg-sky-400/20 rounded-[1px]" />
                  ))}
                </div>
                <div className="text-[7px] font-mono text-teal-300 text-center truncate">
                  P{idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>← East Facade</span>
            <span className="text-teal-400 font-bold">▲ South Slope ({solarResult.recommended_tilt_deg}°)</span>
            <span>West Facade →</span>
          </div>
        </div>
      </div>

      {/* Diagnostics metrics */}
      <div className="grid grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded bg-navy-900/60 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Estimated Shading Loss</div>
          <div className="text-slate-200 font-bold">4.0% (Low Margin)</div>
        </div>
        <div className="p-2.5 rounded bg-navy-900/60 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Inter-Row Spacing</div>
          <div className="text-slate-200 font-bold">0.85 m (Zero Shadow)</div>
        </div>
        <div className="p-2.5 rounded bg-navy-900/60 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px]">Array Tilt Clearance</div>
          <div className="text-teal-400 font-bold">Snow-Shed Ready</div>
        </div>
      </div>
    </div>
  );
};
