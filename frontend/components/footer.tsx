import React from 'react';
import { Shield, ExternalLink, Cpu, Database, BarChart3 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-navy-950/80 mt-16 text-slate-400 text-xs py-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-slate-100 font-bold mb-3">
            <Shield className="w-5 h-5 text-teal-400" />
            <span>GEOTHERM SHIELD</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            Software Based Model Development for Design of Area Specific Shelter for Thermal Comfort Maintenance.
            Developed for Smart India Hackathon problem statement SIH26051.
          </p>
          <div className="text-[11px] font-mono text-teal-400/80">
            Defense & High-Altitude Strategic Habitat Platform
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Scientific Engines</span>
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>• 24-Hour Lumped Capacitance RC Simulation</li>
            <li>• Isotropic Clear-Sky Tilt Transposition Model</li>
            <li>• Multi-Objective Pareto Co-Optimization</li>
            <li>• NBC 2016 / IS 3792 Thermal Comfort Index</li>
            <li>• Diurnal Solar-Air Temperature Solver</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Data Sources & APIs</span>
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>• Open-Meteo High-Resolution Weather Model</li>
            <li>• NASA POWER Climatology & Solar Reanalysis</li>
            <li>• India Meteorological Dept (IMD) Climate Normals</li>
            <li>• MNRE & PM Surya Ghar Subsidy Directives</li>
            <li>• OpenStreetMap Topographic Cartography</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Official Disclaimers</span>
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            All thermal predictions, solar energy estimates, and government subsidy calculations provided by GeoTherm Shield
            are software-derived engineering estimates. Field validation by certified structural and MEP engineers is required prior to deployment.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
        <div>
          © {new Date().getFullYear()} GEOTHERM SHIELD • SIH26051 • All rights reserved.
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span className="text-teal-400 font-mono">v1.0.0-PROD</span>
          <span>•</span>
          <span className="text-slate-400">Built for Smart India Hackathon</span>
        </div>
      </div>
    </footer>
  );
};
