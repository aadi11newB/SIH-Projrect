'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Flame, Compass, Download, Sparkles, Activity } from 'lucide-react';
import { LocationProfile } from '@/lib/types';

interface NavbarProps {
  currentLocation?: LocationProfile;
  onOpenReportModal?: () => void;
  onSelectPreset?: (locId: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onOpenReportModal,
  onSelectPreset,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-teal-500/20 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-navy-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-slate-100 group-hover:text-teal-400 transition-colors">
                GEOTHERM SHIELD
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                SIH26051
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Climate-Aware Passive Shelter & Solar Optimization
            </p>
          </div>
        </Link>

        {/* Center: Active Telemetry Badge */}
        {currentLocation && (
          <div className="hidden md:flex items-center space-x-3 bg-navy-900/80 px-3 py-1.5 rounded-full border border-teal-500/30 text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>{currentLocation.name}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentLocation.latitude.toFixed(2)}°N, {currentLocation.longitude.toFixed(2)}°E</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              <span>Min {currentLocation.winter_min_temp_c}°C</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-teal-300">
              <Zap className="w-3.5 h-3.5" />
              <span>Score {currentLocation.solar_potential_score}/100</span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center space-x-1.5 transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>Dashboard</span>
          </Link>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20 flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Report</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
