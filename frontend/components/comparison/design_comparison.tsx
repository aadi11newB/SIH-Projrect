'use client';

import React, { useState } from 'react';
import { GitCompare, Plus, Trash2, CheckCircle2, Shield, Sun, DollarSign } from 'lucide-react';
import { ShelterGeometry, ShelterMaterials, ShelterOpenings, ThermalSimulationResult, SolarEstimateResult } from '@/lib/types';

export interface SavedDesign {
  id: string;
  name: string;
  geometry: ShelterGeometry;
  materials: ShelterMaterials;
  openings: ShelterOpenings;
  simulationResult: ThermalSimulationResult;
  solarResult: SolarEstimateResult;
  netCostInr: number;
}

interface DesignComparisonProps {
  currentGeometry: ShelterGeometry;
  currentMaterials: ShelterMaterials;
  currentOpenings: ShelterOpenings;
  currentSimulation: ThermalSimulationResult;
  currentSolar: SolarEstimateResult;
  currentNetCost: number;
}

export const DesignComparison: React.FC<DesignComparisonProps> = ({
  currentGeometry,
  currentMaterials,
  currentOpenings,
  currentSimulation,
  currentSolar,
  currentNetCost,
}) => {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([
    {
      id: 'design_base_standard',
      name: 'Design Variant A (Standard Prefab)',
      geometry: { ...currentGeometry, orientation_azimuth: 180 },
      materials: { ...currentMaterials, wall_material_id: 'insulated_composite_panel', insulation_thickness_m: 0.05 },
      openings: { ...currentOpenings, south_window_area_sqm: 4.0 },
      simulationResult: { ...currentSimulation, min_indoor_temp_c: 4.5, peak_indoor_temp_c: 18.2, thermal_comfort_score: 72 },
      solarResult: { ...currentSolar, installed_capacity_kw: 5.0, estimated_annual_generation_kwh: 8250 },
      netCostInr: 420000,
    },
    {
      id: 'design_optimized_hybrid',
      name: 'Design Variant B (High-R Solarium)',
      geometry: { ...currentGeometry, orientation_azimuth: 180 },
      materials: { ...currentMaterials, wall_material_id: 'insulated_composite_panel', insulation_thickness_m: 0.10 },
      openings: { ...currentOpenings, south_window_area_sqm: 10.0 },
      simulationResult: { ...currentSimulation, min_indoor_temp_c: 12.8, peak_indoor_temp_c: 23.4, thermal_comfort_score: 92 },
      solarResult: { ...currentSolar, installed_capacity_kw: 8.0, estimated_annual_generation_kwh: 13200 },
      netCostInr: 535000,
    }
  ]);

  const handleSaveCurrentDesign = () => {
    const newDesign: SavedDesign = {
      id: `design_${Date.now()}`,
      name: `Design Variant ${String.fromCharCode(65 + savedDesigns.length)} (${currentMaterials.wall_material_id.split('_')[0].toUpperCase()})`,
      geometry: { ...currentGeometry },
      materials: { ...currentMaterials },
      openings: { ...currentOpenings },
      simulationResult: { ...currentSimulation },
      solarResult: { ...currentSolar },
      netCostInr: currentNetCost,
    };
    setSavedDesigns([...savedDesigns, newDesign]);
  };

  const handleDeleteDesign = (id: string) => {
    setSavedDesigns(savedDesigns.filter(d => d.id !== id));
  };

  return (
    <div className="tactical-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <GitCompare className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            DESIGN COMPARISON STUDIO (MULTI-VARIANT MATRIX)
          </h3>
        </div>

        <button
          onClick={handleSaveCurrentDesign}
          className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Current Design as Variant</span>
        </button>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-navy-900/50">
              <th className="py-3 px-3">METRIC / SPECIFICATION</th>
              {savedDesigns.map((d) => (
                <th key={d.id} className="py-3 px-3 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{d.name}</span>
                    {savedDesigns.length > 1 && (
                      <button
                        onClick={() => handleDeleteDesign(d.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete variant"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr>
              <td className="py-2.5 px-3 text-slate-400 font-semibold">Thermal Comfort Index</td>
              {savedDesigns.map((d) => (
                <td key={d.id} className="py-2.5 px-3">
                  <span className={`font-bold text-sm ${
                    d.simulationResult.thermal_comfort_score >= 85 ? 'text-teal-300' : 'text-amber-400'
                  }`}>
                    {d.simulationResult.thermal_comfort_score}/100
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-400">Indoor Temp (Min / Peak)</td>
              {savedDesigns.map((d) => (
                <td key={d.id} className="py-2.5 px-3 text-slate-200 font-semibold">
                  +{d.simulationResult.min_indoor_temp_c}°C / +{d.simulationResult.peak_indoor_temp_c}°C
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-400">Envelope U-Value</td>
              {savedDesigns.map((d) => (
                <td key={d.id} className="py-2.5 px-3 text-teal-400">
                  {d.simulationResult.envelope_overall_u_value_w_m2k} W/m²K
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-400">Wall Insulation Core</td>
              {savedDesigns.map((d) => (
                <td key={d.id} className="py-2.5 px-3 text-slate-300">
                  {(d.materials.insulation_thickness_m * 100).toFixed(0)} cm ({d.materials.insulation_material_id.split('_')[0]})
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-400">Solar PV Power & Generation</td>
              {savedDesigns.map((d) => (
                <td key={d.id} className="py-2.5 px-3 text-amber-400 font-semibold">
                  {d.solarResult.installed_capacity_kw} kWp ({d.solarResult.estimated_annual_generation_kwh.toLocaleString()} kWh/yr)
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-400">Estimated Net Capital Cost</td>
              {savedDesigns.map((d) => (
                <td key={d.id} className="py-2.5 px-3 text-blue-400 font-bold text-sm">
                  ₹{d.netCostInr.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
