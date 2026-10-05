'use client';

import React from 'react';
import { Trophy, Compass, Sun, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import { RankedSite } from '@/lib/types';

interface SiteRankingProps {
  rankedSites: RankedSite[];
  selectedSiteId: string;
  onSelectSite: (lat: number, lon: number, id: string) => void;
}

export const SiteRanking: React.FC<SiteRankingProps> = ({
  rankedSites,
  selectedSiteId,
  onSelectSite,
}) => {
  return (
    <div className="tactical-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            GIS STRATEGIC SITE RANKING MATRIX
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Ranked by Solar + Thermal + Topographic Suitability
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-navy-900/50">
              <th className="py-2.5 px-3">RANK</th>
              <th className="py-2.5 px-3">LOCATION</th>
              <th className="py-2.5 px-3">ELEVATION</th>
              <th className="py-2.5 px-3">SOLAR GHI</th>
              <th className="py-2.5 px-3">WINTER MIN</th>
              <th className="py-2.5 px-3">SOLAR SCORE</th>
              <th className="py-2.5 px-3">THERMAL SCORE</th>
              <th className="py-2.5 px-3">COMPOSITE</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rankedSites.map((site) => {
              const isSelected = site.id === selectedSiteId;
              return (
                <tr
                  key={site.id}
                  className={`hover:bg-teal-500/5 transition-colors cursor-pointer ${
                    isSelected ? 'bg-teal-500/10 border-l-2 border-teal-400' : ''
                  }`}
                  onClick={() => onSelectSite(site.latitude, site.longitude, site.id)}
                >
                  <td className="py-3 px-3">
                    <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-bold text-[10px] ${
                      site.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' :
                      site.rank === 2 ? 'bg-slate-300 text-slate-950' :
                      site.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {site.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    <div className="flex items-center space-x-1.5">
                      <span>{site.name}</span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {site.state} ({site.latitude.toFixed(2)}°N, {site.longitude.toFixed(2)}°E)
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{site.elevation_m} m</td>
                  <td className="py-3 px-3 text-amber-400">{site.annual_ghi_kwh_m2} kWh/m²</td>
                  <td className="py-3 px-3 text-blue-400">{site.winter_min_temp_c} °C</td>
                  <td className="py-3 px-3">
                    <span className="text-teal-400 font-bold">{site.solar_potential_score}</span>/100
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 font-bold">{site.thermal_suitability_score}</span>/100
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm font-bold text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                      {site.composite_site_score}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSite(site.latitude, site.longitude, site.id);
                      }}
                      className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 rounded border border-teal-500/40 text-[11px] font-medium inline-flex items-center space-x-1 transition-all"
                    >
                      <span>Deploy</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
