'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Compass,
  Sun,
  Flame,
  Cpu,
  BarChart3,
  Layers,
  ArrowRight,
  Download,
  Sparkles,
  CheckCircle2,
  Mountain,
  Activity,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DEMO_LOCATIONS } from '@/lib/demo_data';

export default function LandingPage() {
  const defaultLeh = DEMO_LOCATIONS['leh_ladakh'];

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-teal-500 selection:text-black">
      <Navbar currentLocation={defaultLeh} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Decorative Grid and Lighting */}
        <div className="absolute inset-0 defense-grid opacity-25 pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* SIH Banner Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span>SMART INDIA HACKATHON • PROBLEM STATEMENT SIH26051</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-100 max-w-5xl leading-tight">
          Design Shelters That{' '}
          <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Adapt to Their Climate.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
          GeoTherm Shield combines GIS intelligence, 24-hour thermal simulation, and solar optimization to design
          energy-efficient, location-specific shelters for extreme defense and high-altitude habitats.
        </p>

        {/* CTA Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-teal-500/25 flex items-center justify-center space-x-2 transition-all group"
          >
            <span>Start Designing Shelter</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard?preset=leh_ladakh"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy-900/90 hover:bg-navy-800 text-slate-200 border border-teal-500/30 font-bold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Explore Demo (Leh, Ladakh)</span>
          </Link>
        </div>

        {/* Animated Workflow Flowchart Visualization: GIS -> Climate -> Shelter -> Solar -> Optimization */}
        <div className="mt-16 w-full max-w-5xl">
          <div className="tactical-card p-6 bg-navy-900/60 border border-teal-500/30">
            <div className="text-[11px] font-mono text-teal-400 uppercase tracking-wider mb-4 text-center">
              END-TO-END COMPUTATIONAL PIPELINE
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {/* Step 1: GIS Map */}
              <div className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex flex-col items-center text-center space-y-1.5 hover:border-teal-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs font-mono text-slate-200">1. GIS Mapping</div>
                <div className="text-[10px] text-slate-400">Select coordinates & topography</div>
              </div>

              {/* Step 2: Climate */}
              <div className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex flex-col items-center text-center space-y-1.5 hover:border-blue-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <Mountain className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs font-mono text-slate-200">2. Climate Intel</div>
                <div className="text-[10px] text-slate-400">Solar GHI, diurnal temp, wind</div>
              </div>

              {/* Step 3: Shelter & 3D */}
              <div className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex flex-col items-center text-center space-y-1.5 hover:border-teal-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs font-mono text-slate-200">3. Shelter 3D</div>
                <div className="text-[10px] text-slate-400">High-R materials & solarium</div>
              </div>

              {/* Step 4: Solar PV */}
              <div className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex flex-col items-center text-center space-y-1.5 hover:border-amber-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs font-mono text-slate-200">4. Solar PV Engine</div>
                <div className="text-[10px] text-slate-400">Optimal tilt, yield & packing</div>
              </div>

              {/* Step 5: Optimization & Subsidy */}
              <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-500/50 flex flex-col items-center text-center space-y-1.5 hover:border-teal-300 transition-colors shadow-lg">
                <div className="w-8 h-8 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs font-mono text-teal-300">5. Co-Optimization</div>
                <div className="text-[10px] text-teal-400">Pareto ranking & subsidies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem */}
          <div className="tactical-card p-6 border-rose-500/30 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-rose-500/10 text-rose-300 text-xs font-mono font-bold">
              <span>THE CHALLENGE (SIH26051)</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              High-Altitude Cold Regions & Defense Shelters Suffer Severe Fuel Dependency
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              In strategic outposts such as Ladakh, Kargil, and Arunachal Pradesh, winter ambient temperatures plummet
              below -25°C. Traditional uninsulated shelters rely heavily on inefficient diesel generators (costing ₹28–₹35/kWh)
              and kerosene heaters, causing dangerous thermal swings, carbon emissions, and logistical vulnerabilities.
            </p>
          </div>

          {/* Solution */}
          <div className="tactical-card p-6 border-teal-500/40 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-teal-500/10 text-teal-300 text-xs font-mono font-bold">
              <span>OUR SOLUTION</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Scientific Co-Optimization of Passive Thermal Envelopes & Active Solar PV
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              GeoTherm Shield performs first-principles 24-hour dynamic RC thermal simulations, optimizes building orientation
              for maximum passive solar solarium gain, sizes rooftop solar PV with snow-shedding tilt angles, and matches
              eligible government grants (PM Surya Ghar & LREDA) to deliver net-zero capable habitats.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
            Engineered for Defense & Strategic Infrastructure
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Fully modular, scientifically explainable decision-support architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tactical-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">GIS Climatological Mapping</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Query any location in India for multi-year GHI solar radiation, diurnal temperature curves, altitude, and
              climate classification.
            </p>
          </div>

          <div className="tactical-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">24h Dynamic Thermal Simulator</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Lumped capacitance RC network models sol-air temperatures, phase lag, infiltration, and calculates the
              standardized Thermal Comfort Index (TCI).
            </p>
          </div>

          <div className="tactical-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">Solar PV Layout & Yield</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Calculates 100-point Solar Potential Score, optimal tilt with winter snow-shed bias, and generates 12-month
              generation distribution curves.
            </p>
          </div>

          <div className="tactical-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">Solar + Thermal Co-Optimization</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Pareto multi-objective solver balances passive thermal envelope insulation, active solar capacity, and total
              project capital expenditure.
            </p>
          </div>

          <div className="tactical-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">Government Subsidy Planner</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Integrated database with PM Surya Ghar, LREDA Cold Desert, and BADP Border grants with direct portal links
              and 10-year ROI forecasts.
            </p>
          </div>

          <div className="tactical-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">Instant Technical PDF Report</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              One-click download of publication-quality engineering PDF dossier containing specifications, diurnal charts,
              and BOM cost schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="tactical-card p-8 bg-gradient-to-r from-navy-950 via-teal-950/50 to-navy-950 border border-teal-500/40 shadow-2xl space-y-4">
          <Award className="w-10 h-10 text-teal-400 mx-auto" />
          <h3 className="text-2xl font-bold text-slate-100">Ready to Optimize Your Shelter?</h3>
          <p className="text-slate-300 text-xs max-w-xl mx-auto">
            Test the live platform with benchmark high-altitude scenarios or pick custom coordinates on the GIS map.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm inline-flex items-center space-x-2 transition-all shadow-lg"
            >
              <span>Launch GeoTherm Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
