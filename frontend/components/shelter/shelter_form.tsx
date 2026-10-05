'use client';

import React from 'react';
import { Sliders, Home, Compass, Layers, ShieldCheck, Users, Wind } from 'lucide-react';
import { ShelterGeometry, ShelterMaterials, ShelterOpenings } from '@/lib/types';

interface ShelterFormProps {
  geometry: ShelterGeometry;
  materials: ShelterMaterials;
  openings: ShelterOpenings;
  onChangeGeometry: (geom: ShelterGeometry) => void;
  onChangeMaterials: (mats: ShelterMaterials) => void;
  onChangeOpenings: (openings: ShelterOpenings) => void;
}

export const ShelterForm: React.FC<ShelterFormProps> = ({
  geometry,
  materials,
  openings,
  onChangeGeometry,
  onChangeMaterials,
  onChangeOpenings,
}) => {
  return (
    <div className="tactical-card p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Home className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            SHELTER PARAMETRIC GEOMETRY & ENVELOPE DESIGN
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Floor Area: <b className="text-teal-300 font-bold">{(geometry.length * geometry.width).toFixed(1)} m²</b>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Geometry */}
        <div className="space-y-4 bg-navy-900/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>Dimensions & Orientation</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Length (East-West Axis):</span>
              <span className="text-teal-300 font-bold">{geometry.length} m</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="20.0"
              step="0.5"
              value={geometry.length}
              onChange={(e) => onChangeGeometry({ ...geometry, length: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Width (North-South Axis):</span>
              <span className="text-teal-300 font-bold">{geometry.width} m</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="15.0"
              step="0.5"
              value={geometry.width}
              onChange={(e) => onChangeGeometry({ ...geometry, width: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Ceiling Height:</span>
              <span className="text-teal-300 font-bold">{geometry.height} m</span>
            </div>
            <input
              type="range"
              min="2.4"
              max="4.5"
              step="0.1"
              value={geometry.height}
              onChange={(e) => onChangeGeometry({ ...geometry, height: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Roof Pitch Tilt:</span>
              <span className="text-amber-300 font-bold">{geometry.roof_angle}°</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="60.0"
              step="1.0"
              value={geometry.roof_angle}
              onChange={(e) => onChangeGeometry({ ...geometry, roof_angle: parseFloat(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Orientation Azimuth:</span>
              <span className="text-teal-300 font-bold">{geometry.orientation_azimuth}° (180° = South)</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="360.0"
              step="5.0"
              value={geometry.orientation_azimuth}
              onChange={(e) => onChangeGeometry({ ...geometry, orientation_azimuth: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>
        </div>

        {/* Column 2: Envelope Materials */}
        <div className="space-y-4 bg-navy-900/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Envelope Materials & Insulation</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Wall Core Material:</label>
            <select
              value={materials.wall_material_id}
              onChange={(e) => onChangeMaterials({ ...materials, wall_material_id: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
            >
              <option value="insulated_composite_panel">Insulated Composite Panel (PUF Core)</option>
              <option value="rammed_earth_stabilized">Stabilized Rammed Earth (High Thermal Mass)</option>
              <option value="aerated_autoclaved_concrete">Autoclaved Aerated Concrete (AAC)</option>
              <option value="timber_log_insulated">Insulated Timber Log Frame</option>
              <option value="standard_brick_masonry">Standard Burnt Clay Brick (230mm)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Insulation Thickness:</span>
              <span className="text-teal-300 font-bold">{(materials.insulation_thickness_m * 100).toFixed(0)} cm</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.25"
              step="0.01"
              value={materials.insulation_thickness_m}
              onChange={(e) => onChangeMaterials({ ...materials, insulation_thickness_m: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Insulation Type:</label>
            <select
              value={materials.insulation_material_id}
              onChange={(e) => onChangeMaterials({ ...materials, insulation_material_id: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
            >
              <option value="rockwool">High-Density Rockwool (Class A1 Non-combustible)</option>
              <option value="extruded_polystyrene_xps">Extruded Polystyrene (XPS Closed Cell)</option>
              <option value="expanded_polystyrene_eps">Expanded Polystyrene (EPS)</option>
              <option value="aerogel_blanket">Silica Aerogel Ultra-Thin Blanket</option>
              <option value="sheep_wool_natural">Treated Himalayan Sheep Wool</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Glazing Assembly:</label>
            <select
              value={materials.glazing_type_id}
              onChange={(e) => onChangeMaterials({ ...materials, glazing_type_id: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
            >
              <option value="triple_low_e_argon">Triple Glazed Low-E Argon (U = 0.8 W/m²K)</option>
              <option value="double_low_e_air">Double Glazed Low-E (U = 1.6 W/m²K)</option>
              <option value="double_clear_air">Double Glazed Clear (U = 2.8 W/m²K)</option>
              <option value="single_clear">Single Clear Glass (U = 5.8 W/m²K)</option>
            </select>
          </div>
        </div>

        {/* Column 3: Openings & Infiltration */}
        <div className="space-y-4 bg-navy-900/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>Passive Solarium & Infiltration</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">South Window (Passive Solar Aperture):</span>
              <span className="text-amber-300 font-bold">{openings.south_window_area_sqm} m²</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="20.0"
              step="0.5"
              value={openings.south_window_area_sqm}
              onChange={(e) => onChangeOpenings({ ...openings, south_window_area_sqm: parseFloat(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Airtightness (ACH):</span>
              <span className="text-teal-300 font-bold">{openings.infiltration_ach} ACH</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={openings.infiltration_ach}
              onChange={(e) => onChangeOpenings({ ...openings, infiltration_ach: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              {openings.infiltration_ach <= 0.3 ? '✓ Passivhaus Airtight Specification' : 'Standard Ventilation Rate'}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Occupancy Count:</span>
              <span className="text-slate-200 font-bold">{openings.occupants_count} Personnel</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={openings.occupants_count}
              onChange={(e) => onChangeOpenings({ ...openings, occupants_count: parseInt(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Internal Equipment Gain:</span>
              <span className="text-slate-200 font-bold">{openings.internal_heat_gain_w} W</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={openings.internal_heat_gain_w}
              onChange={(e) => onChangeOpenings({ ...openings, internal_heat_gain_w: parseFloat(e.target.value) })}
              className="w-full accent-teal-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
