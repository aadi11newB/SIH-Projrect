'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Layers,
  Sun,
  Thermometer,
  Mountain,
  Compass,
  Search,
  CheckCircle,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { LocationProfile } from '@/lib/types';
import { DEMO_LOCATIONS } from '@/lib/demo_data';

interface MapViewProps {
  currentLocation: LocationProfile;
  onSelectLocation: (lat: number, lon: number, locationId?: string) => void;
}

type LayerMode = 'standard' | 'solar' | 'temperature' | 'elevation' | 'suitability';

export const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  onSelectLocation,
}) => {
  const [activeLayer, setActiveLayer] = useState<LayerMode>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [customLat, setCustomLat] = useState(currentLocation.latitude.toString());
  const [customLon, setCustomLon] = useState(currentLocation.longitude.toString());
  const [zoomLevel, setZoomLevel] = useState(5.5);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Sync state if current location changes from outside
  useEffect(() => {
    setCustomLat(currentLocation.latitude.toFixed(4));
    setCustomLon(currentLocation.longitude.toFixed(4));
  }, [currentLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    const found = Object.values(DEMO_LOCATIONS).find(
      l => l.name.toLowerCase().includes(query) || l.state.toLowerCase().includes(query) || l.id.includes(query)
    );
    if (found) {
      onSelectLocation(found.latitude, found.longitude, found.id);
      setSearchQuery('');
    } else {
      // Coordinate parse fallback "lat, lon"
      const parts = query.split(',').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        onSelectLocation(parts[0], parts[1]);
        setSearchQuery('');
      }
    }
  };

  const handleCoordinateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      onSelectLocation(lat, lon);
    }
  };

  // Convert lat/lon to percentage position inside Indian subcontinent bounding box
  // Lat: 8.0 to 37.5, Lon: 68.0 to 97.5
  const getMapPositionPercent = (lat: number, lon: number) => {
    const latMin = 8.0;
    const latMax = 37.5;
    const lonMin = 68.0;
    const lonMax = 97.5;

    const x = Math.max(5, Math.min(95, ((lon - lonMin) / (lonMax - lonMin)) * 100));
    const y = Math.max(5, Math.min(95, (1.0 - (lat - latMin) / (latMax - latMin)) * 100));
    return { x, y };
  };

  const currentPos = getMapPositionPercent(currentLocation.latitude, currentLocation.longitude);

  // Interactive click on the tactical GIS grid
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const latMin = 8.0;
    const latMax = 37.5;
    const lonMin = 68.0;
    const lonMax = 97.5;

    const lon = Number((lonMin + clickX * (lonMax - lonMin)).toFixed(4));
    const lat = Number((latMax - clickY * (latMax - latMin)).toFixed(4));

    onSelectLocation(lat, lon);
  };

  return (
    <div className="tactical-card p-5 overflow-hidden flex flex-col space-y-4">
      {/* Top Search and Layer Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search strategic location (e.g. Leh, Ladakh, Dras, Jaisalmer)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-3.5 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded-lg text-xs font-semibold"
          >
            Locate
          </button>
        </form>

        {/* Layer Switcher Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveLayer('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeLayer === 'standard'
                ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GIS Base</span>
          </button>

          <button
            onClick={() => setActiveLayer('solar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeLayer === 'solar'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Solar GHI Heatmap</span>
          </button>

          <button
            onClick={() => setActiveLayer('temperature')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeLayer === 'temperature'
                ? 'bg-blue-500 text-slate-950 font-semibold shadow-md shadow-blue-500/20'
                : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-slate-800'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Diurnal Temp</span>
          </button>

          <button
            onClick={() => setActiveLayer('elevation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeLayer === 'elevation'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                : 'bg-navy-900 text-slate-300 hover:bg-navy-800 border border-slate-800'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Topography (MSL)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative w-full h-[400px] lg:h-[460px] rounded-xl bg-gradient-to-b from-slate-950 via-navy-900 to-slate-950 border border-teal-500/30 overflow-hidden cursor-crosshair group shadow-inner"
      >
        {/* Tactical Grid Background */}
        <div className="absolute inset-0 defense-grid opacity-35 pointer-events-none" />

        {/* Heatmap Overlay Shader depending on selected layer */}
        {activeLayer === 'solar' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 via-yellow-500/30 to-red-600/25 pointer-events-none mix-blend-screen" />
        )}
        {activeLayer === 'temperature' && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-700/35 via-teal-600/20 to-amber-600/25 pointer-events-none mix-blend-screen" />
        )}
        {activeLayer === 'elevation' && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/30 via-slate-800/40 to-teal-700/25 pointer-events-none" />
        )}

        {/* Topographic Contour Lines SVG Mock Overlay for Defense Cartography */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="45%" cy="30%" rx="180" ry="90" fill="none" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 3" />
          <ellipse cx="45%" cy="30%" rx="130" ry="65" fill="none" stroke="#14b8a6" strokeWidth="1.2" />
          <ellipse cx="45%" cy="30%" rx="75" ry="38" fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
          <ellipse cx="30%" cy="55%" rx="140" ry="70" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
          <ellipse cx="30%" cy="55%" rx="90" ry="45" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
        </svg>

        {/* Benchmark Preset Location Markers */}
        {Object.values(DEMO_LOCATIONS).map(loc => {
          const pos = getMapPositionPercent(loc.latitude, loc.longitude);
          const isSelected = loc.id === currentLocation.id;

          return (
            <div
              key={loc.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectLocation(loc.latitude, loc.longitude, loc.id);
              }}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/marker"
            >
              <div className="relative flex items-center justify-center">
                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-teal-400 flex items-center justify-center shadow-lg shadow-teal-400/50 animate-bounce">
                    <Crosshair className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-400 hover:border-amber-400 flex items-center justify-center transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 group-hover/marker:bg-amber-400" />
                  </div>
                )}

                {/* Marker Tooltip Label */}
                <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-medium shadow-md transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold border border-teal-300'
                    : 'bg-navy-950/90 text-slate-200 border border-slate-700 opacity-80 group-hover/marker:opacity-100'
                }`}>
                  {loc.name.split(',')[0]}
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Picked Marker if not snapping to presets */}
        {!Object.values(DEMO_LOCATIONS).some(l => l.id === currentLocation.id) && (
          <div
            style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 pointer-events-none"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/50 animate-pulse">
              <MapPin className="w-4 h-4 text-slate-950" />
            </div>
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap shadow">
              Custom Target
            </div>
          </div>
        )}

        {/* Compass Rose in Corner */}
        <div className="absolute top-4 right-4 bg-navy-950/80 p-2.5 rounded-lg border border-teal-500/30 text-teal-400 flex flex-col items-center shadow-lg backdrop-blur-sm pointer-events-none">
          <Compass className="w-5 h-5 animate-spin-slow" />
          <span className="text-[9px] font-mono mt-0.5 text-slate-300">N 000°</span>
        </div>

        {/* Bottom Status Telemetry Overlay inside Map */}
        <div className="absolute bottom-3 left-3 right-3 bg-navy-950/90 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-slate-300 font-semibold">{currentLocation.name}</span>
            <span className="text-slate-500">|</span>
            <span className="text-teal-400">{currentLocation.latitude.toFixed(4)}°N, {currentLocation.longitude.toFixed(4)}°E</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-slate-400">Elev: <b className="text-slate-200">{currentLocation.elevation_m}m</b></span>
            <span className="text-slate-400">GHI: <b className="text-amber-400">{currentLocation.annual_solar_ghi_kwh_m2} kWh/m²</b></span>
            <span className="text-slate-400">Solar: <b className="text-teal-400">{currentLocation.solar_potential_score}/100</b></span>
          </div>
        </div>
      </div>

      {/* Manual Coordinate Input & Quick Teleport Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-t border-slate-800">
        <form onSubmit={handleCoordinateSubmit} className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-mono">Direct Coords:</span>
          <input
            type="number"
            step="0.0001"
            placeholder="Latitude"
            value={customLat}
            onChange={e => setCustomLat(e.target.value)}
            className="w-24 px-2 py-1 bg-navy-900 border border-slate-700 rounded text-slate-200 font-mono focus:outline-none focus:border-teal-500"
          />
          <input
            type="number"
            step="0.0001"
            placeholder="Longitude"
            value={customLon}
            onChange={e => setCustomLon(e.target.value)}
            className="w-24 px-2 py-1 bg-navy-900 border border-slate-700 rounded text-slate-200 font-mono focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded font-semibold transition-colors"
          >
            Set
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Presets:</span>
          {Object.values(DEMO_LOCATIONS).slice(0, 5).map(loc => (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc.latitude, loc.longitude, loc.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                currentLocation.id === loc.id
                  ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {loc.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
