'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Compass,
  Sun,
  Flame,
  Home,
  Cpu,
  Sliders,
  DollarSign,
  GitCompare,
  Download,
  Shield,
  Activity,
  Award,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { MapView } from '@/components/gis/map_view';
import { SiteRanking } from '@/components/gis/site_ranking';
import { SolarPotentialCard } from '@/components/solar/solar_potential_card';
import { SolarLayoutPreview } from '@/components/solar/solar_layout_preview';
import { SolarChart } from '@/components/solar/solar_chart';
import { ThreeShelterView } from '@/components/shelter/three_shelter_view';
import { ShelterForm } from '@/components/shelter/shelter_form';
import { ThermalChart } from '@/components/thermal/thermal_chart';
import { DayNightAnalysis } from '@/components/thermal/day_night_analysis';
import { ThermalMetrics } from '@/components/thermal/thermal_metrics';
import { CoOptimizationCard } from '@/components/optimizer/co_optimization_card';
import { OptimizerPanel } from '@/components/optimizer/optimizer_panel';
import { WhatIfSimulator } from '@/components/whatif/whatif_simulator';
import { SubsidyPlanner } from '@/components/finance/subsidy_planner';
import { FinancialProjections } from '@/components/finance/financial_projections';
import { DesignComparison } from '@/components/comparison/design_comparison';

import {
  LocationProfile,
  ShelterGeometry,
  ShelterMaterials,
  ShelterOpenings,
  ThermalSimulationResult,
  SolarEstimateResult,
  FinancialCalculationResult,
  CoOptimizationResult,
  RankedSite,
  OptimizedDesignVariant
} from '@/lib/types';
import {
  DEMO_LOCATIONS,
  DEFAULT_SHELTER_GEOMETRY,
  DEFAULT_SHELTER_MATERIALS,
  DEFAULT_SHELTER_OPENINGS,
  DEMO_RANKED_SITES
} from '@/lib/demo_data';
import {
  fetchClimateProfileApi,
  simulateThermalApi,
  estimateSolarApi,
  runOptimizerApi,
  calculateFinancialsApi,
  fetchRankedLocationsApi,
  downloadReportPdfApi
} from '@/lib/api';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialPreset = searchParams?.get('preset') || 'leh_ladakh';

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('gis');

  // Core Simulation States
  const [location, setLocation] = useState<LocationProfile>(
    DEMO_LOCATIONS[initialPreset] || DEMO_LOCATIONS['leh_ladakh']
  );
  const [geometry, setGeometry] = useState<ShelterGeometry>(DEFAULT_SHELTER_GEOMETRY);
  const [materials, setMaterials] = useState<ShelterMaterials>(DEFAULT_SHELTER_MATERIALS);
  const [openings, setOpenings] = useState<ShelterOpenings>(DEFAULT_SHELTER_OPENINGS);

  // Computed Results States
  const [thermalResult, setThermalResult] = useState<ThermalSimulationResult | null>(null);
  const [solarResult, setSolarResult] = useState<SolarEstimateResult | null>(null);
  const [financialResult, setFinancialResult] = useState<FinancialCalculationResult | null>(null);
  const [optimizerResult, setOptimizerResult] = useState<CoOptimizationResult | null>(null);
  const [rankedSites, setRankedSites] = useState<RankedSite[]>(DEMO_RANKED_SITES);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Recalculate full engineering state when location, geometry, materials or openings change
  const refreshAllCalculations = async (targetLoc: LocationProfile, geom: ShelterGeometry, mats: ShelterMaterials, ops: ShelterOpenings) => {
    setIsLoading(true);
    try {
      // 1. Thermal Simulation
      const tRes = await simulateThermalApi({
        location_id: targetLoc.id,
        latitude: targetLoc.latitude,
        longitude: targetLoc.longitude,
        season: 'winter',
        geometry: geom,
        materials: mats,
        openings: ops,
      });
      setThermalResult(tRes);

      // 2. Solar PV Yield
      const sRes = await estimateSolarApi({
        latitude: targetLoc.latitude,
        longitude: targetLoc.longitude,
        annual_ghi_kwh_m2: targetLoc.annual_solar_ghi_kwh_m2,
        panel_config: {
          available_roof_area_sqm: (geom.length * geom.width) / 0.866,
          panel_wattage_wp: 450,
          panel_efficiency: 0.21,
          panel_length_m: 2.0,
          panel_width_m: 1.0,
          tilt_angle_deg: targetLoc.latitude + 5.0,
          azimuth_deg: geom.orientation_azimuth,
          system_capacity_kw: 8.0,
          shading_factor: 0.04,
        },
      });
      setSolarResult(sRes);

      // 3. Financial and Subsidies
      const fRes = await calculateFinancialsApi({
        state: targetLoc.state,
        system_capacity_kw: sRes.installed_capacity_kw,
        shelter_floor_area_sqm: geom.length * geom.width,
        insulation_thickness_cm: mats.insulation_thickness_m * 100,
        annual_solar_generation_kwh: sRes.estimated_annual_generation_kwh,
        annual_heating_requirement_kwh: tRes.total_daily_heat_loss_kwh * 180, // ~180 winter days
      });
      setFinancialResult(fRes);

      // 4. Co-Optimization Engine
      const optRes = await runOptimizerApi({
        location_id: targetLoc.id,
        latitude: targetLoc.latitude,
        longitude: targetLoc.longitude,
        desired_floor_area_sqm: geom.length * geom.width,
      });
      setOptimizerResult(optRes);

      // 5. Site Ranking
      const rankList = await fetchRankedLocationsApi();
      setRankedSites(rankList);
    } catch (err) {
      console.error('Calculation pipeline error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshAllCalculations(location, geometry, materials, openings);
  }, []);

  // Location selector handler
  const handleSelectLocation = async (lat: number, lon: number, locationId?: string) => {
    const locProfile = await fetchClimateProfileApi(lat, lon, locationId);
    setLocation(locProfile);
    refreshAllCalculations(locProfile, geometry, materials, openings);
  };

  // Parameter change handlers
  const handleGeometryChange = (geom: ShelterGeometry) => {
    setGeometry(geom);
    refreshAllCalculations(location, geom, materials, openings);
  };

  const handleMaterialsChange = (mats: ShelterMaterials) => {
    setMaterials(mats);
    refreshAllCalculations(location, geometry, mats, openings);
  };

  const handleOpeningsChange = (ops: ShelterOpenings) => {
    setOpenings(ops);
    refreshAllCalculations(location, geometry, materials, ops);
  };

  // Apply optimized variant
  const handleApplyVariant = (v: OptimizedDesignVariant) => {
    const newGeom = {
      ...geometry,
      length: v.dimensions.length_m || geometry.length,
      width: v.dimensions.width_m || geometry.width,
      roof_angle: v.dimensions.roof_pitch_deg || geometry.roof_angle,
      orientation_azimuth: v.shelter_orientation_deg,
    };
    const newMats = {
      ...materials,
      wall_material_id: v.wall_material_id,
      insulation_material_id: v.insulation_material_id,
      insulation_thickness_m: v.insulation_thickness_cm / 100.0,
      roof_material_id: v.roof_material_id,
      glazing_type_id: v.glazing_type_id,
    };
    const newOps = {
      ...openings,
      south_window_area_sqm: v.south_window_area_sqm,
    };

    setGeometry(newGeom);
    setMaterials(newMats);
    setOpenings(newOps);
    refreshAllCalculations(location, newGeom, newMats, newOps);
    setActiveTab('thermal');
  };

  // Download PDF Report Handler
  const handleDownloadReport = async () => {
    if (!thermalResult || !solarResult || !financialResult) return;
    setIsGeneratingPdf(true);
    try {
      const payload = {
        location_profile: location,
        geometry: geometry,
        materials: materials,
        openings: openings,
        simulation_result: thermalResult,
        solar_result: solarResult,
        financial_result: financialResult,
        recommended_design: optimizerResult?.best_overall_design,
        user_project_name: `Tactical Shelter Study (${location.name.split(',')[0]})`,
        author_name: 'Defense Infrastructure Engineering Cell',
      };

      const blob = await downloadReportPdfApi(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GeoTherm_Shield_Report_${location.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Report generator generated local fallback. Please ensure backend is running.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-teal-500 selection:text-black">
      <Navbar
        currentLocation={location}
        onOpenReportModal={handleDownloadReport}
        onSelectPreset={(id) => {
          const l = DEMO_LOCATIONS[id];
          if (l) handleSelectLocation(l.latitude, l.longitude, l.id);
        }}
      />

      {/* Top Telemetry Header Bar */}
      <section className="bg-navy-900/80 border-b border-teal-500/20 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Active Target */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 text-sm">{location.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {location.climate_zone}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                {location.latitude.toFixed(3)}°N, {location.longitude.toFixed(3)}°E • Elev: {location.elevation_m}m • GHI: {location.annual_solar_ghi_kwh_m2} kWh/m²
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center space-x-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Solar Score:</span>
              <span className="text-amber-400 font-bold">{solarResult?.solar_potential_score || location.solar_potential_score}/100</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center space-x-2">
              <Flame className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-400">Thermal Comfort:</span>
              <span className="text-teal-300 font-bold">{thermalResult?.thermal_comfort_score || 88}/100</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-teal-500/30 flex items-center space-x-2">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Net Est. Cost:</span>
              <span className="text-blue-300 font-bold">
                ₹{financialResult ? (financialResult.estimated_net_cost_inr / 100000).toFixed(2) : '5.35'}L
              </span>
            </div>

            {/* Download PDF Trigger */}
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold flex items-center space-x-1.5 transition-all shadow-md disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Stepper Navigation */}
      <div className="border-b border-slate-800 bg-navy-950/90 sticky top-14 z-40 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none font-mono text-xs">
          {[
            { id: 'gis', label: '1. GIS & Location', icon: Compass },
            { id: 'solar', label: '2. Solar Site & PV', icon: Sun },
            { id: 'shelter', label: '3. Shelter & 3D', icon: Home },
            { id: 'thermal', label: '4. Thermal Simulator', icon: Flame },
            { id: 'optimizer', label: '5. Co-Optimization', icon: Cpu },
            { id: 'whatif', label: '6. “What If?”', icon: Sliders },
            { id: 'finance', label: '7. Subsidies & Finance', icon: DollarSign },
            { id: 'comparison', label: '8. Design Studio', icon: GitCompare },
            { id: 'recommendation', label: '9. Final Recommendation', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Loading Indicator Overlay */}
        {isLoading && (
          <div className="bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono px-4 py-2 rounded-lg flex items-center space-x-2 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Computing First-Principles Diurnal Thermal & Solar Yield Models...</span>
          </div>
        )}

        {/* TAB 1: GIS & LOCATION INTELLIGENCE */}
        {activeTab === 'gis' && (
          <div className="space-y-6">
            <MapView currentLocation={location} onSelectLocation={handleSelectLocation} />
            <SiteRanking
              rankedSites={rankedSites}
              selectedSiteId={location.id}
              onSelectSite={handleSelectLocation}
            />
          </div>
        )}

        {/* TAB 2: SOLAR SITE & PV ANALYZER */}
        {activeTab === 'solar' && solarResult && (
          <div className="space-y-6">
            <SolarPotentialCard location={location} solarResult={solarResult} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SolarLayoutPreview
                solarResult={solarResult}
                roofAreaSqm={Number(((geometry.length * geometry.width) / 0.866).toFixed(1))}
              />
              <SolarChart solarResult={solarResult} />
            </div>
          </div>
        )}

        {/* TAB 3: SHELTER PARAMETRIC DESIGN & 3D VISUALIZER */}
        {activeTab === 'shelter' && (
          <div className="space-y-6">
            <ThreeShelterView
              geometry={geometry}
              materials={materials}
              openings={openings}
              showSolarPanels={true}
            />
            <ShelterForm
              geometry={geometry}
              materials={materials}
              openings={openings}
              onChangeGeometry={handleGeometryChange}
              onChangeMaterials={handleMaterialsChange}
              onChangeOpenings={handleOpeningsChange}
            />
          </div>
        )}

        {/* TAB 4: 24-HOUR THERMAL SIMULATION & DAY/NIGHT DIAGNOSTICS */}
        {activeTab === 'thermal' && thermalResult && (
          <div className="space-y-6">
            <ThermalChart simulationResult={thermalResult} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DayNightAnalysis simulationResult={thermalResult} />
              <ThermalMetrics simulationResult={thermalResult} />
            </div>
          </div>
        )}

        {/* TAB 5: AI & CO-OPTIMIZATION ENGINE */}
        {activeTab === 'optimizer' && optimizerResult && (
          <div className="space-y-6">
            <CoOptimizationCard
              bestDesign={optimizerResult.best_overall_design}
              onApplyDesign={handleApplyVariant}
            />
            <OptimizerPanel
              optimizationResult={optimizerResult}
              onSelectVariant={handleApplyVariant}
            />
          </div>
        )}

        {/* TAB 6: WHAT IF? SIMULATOR */}
        {activeTab === 'whatif' && (
          <div className="space-y-6">
            <WhatIfSimulator
              initialInsulationCm={materials.insulation_thickness_m * 100}
              initialOrientationDeg={geometry.orientation_azimuth}
              initialWindowSqm={openings.south_window_area_sqm}
              initialSolarKw={solarResult?.installed_capacity_kw || 8.0}
              baseOutdoorMin={location.winter_min_temp_c}
            />
          </div>
        )}

        {/* TAB 7: FINANCIAL PLANNER & SUBSIDY DATABASE */}
        {activeTab === 'finance' && financialResult && (
          <div className="space-y-6">
            <SubsidyPlanner financialResult={financialResult} selectedState={location.state} />
            <FinancialProjections financialResult={financialResult} />
          </div>
        )}

        {/* TAB 8: DESIGN COMPARISON STUDIO */}
        {activeTab === 'comparison' && thermalResult && solarResult && financialResult && (
          <div className="space-y-6">
            <DesignComparison
              currentGeometry={geometry}
              currentMaterials={materials}
              currentOpenings={openings}
              currentSimulation={thermalResult}
              currentSolar={solarResult}
              currentNetCost={financialResult.estimated_net_cost_inr}
            />
          </div>
        )}

        {/* TAB 9: FINAL RECOMMENDATION & PDF REPORT */}
        {activeTab === 'recommendation' && optimizerResult && thermalResult && solarResult && financialResult && (
          <div className="space-y-6">
            <div className="tactical-card p-6 bg-gradient-to-br from-navy-950 via-teal-950/40 to-navy-900 border-2 border-teal-500/50 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-teal-300 font-bold">
                      FINAL OPTIMIZED RECOMMENDATION CARD
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                      Recommended Shelter Configuration for {location.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={handleDownloadReport}
                  disabled={isGeneratingPdf}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-xl shadow-teal-500/25 flex items-center space-x-2 transition-all self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Compiling Dossier...' : 'Download Official PDF Report'}</span>
                </button>
              </div>

              {/* Grid of Recommended Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 space-y-2">
                  <div className="text-teal-400 font-bold uppercase text-[11px]">LOCATION & ORIENTATION</div>
                  <div><b>Site:</b> {location.name} ({location.elevation_m}m MSL)</div>
                  <div><b>Climate:</b> {location.climate_zone}</div>
                  <div><b>Azimuth:</b> True South (180° Optimal)</div>
                  <div><b>Roof Pitch:</b> 30° (Snow-Shed Clear Sky)</div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold uppercase text-[11px]">ENVELOPE & PASSIVE MASS</div>
                  <div><b>Wall:</b> Insulated Composite Panel (100mm)</div>
                  <div><b>Insulation:</b> 10cm High-Density Rockwool</div>
                  <div><b>Glazing:</b> Triple Low-E Argon (U = 0.8 W/m²K)</div>
                  <div><b>Solarium Aperture:</b> 10.0 m² South Window</div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 space-y-2">
                  <div className="text-blue-400 font-bold uppercase text-[11px]">SOLAR PV & CAPITAL NET COST</div>
                  <div><b>Solar Array:</b> {solarResult.installed_capacity_kw} kWp ({solarResult.estimated_annual_generation_kwh.toLocaleString()} kWh/yr)</div>
                  <div><b>Gross Project Cost:</b> ₹{financialResult.total_gross_project_cost_inr.toLocaleString()}</div>
                  <div><b>Applicable Subsidies:</b> - ₹{financialResult.total_applicable_subsidy_inr.toLocaleString()}</div>
                  <div className="text-teal-300 font-bold text-sm">
                    Net Project Cost: ₹{financialResult.estimated_net_cost_inr.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Statutory Engineering Disclaimer */}
              <div className="p-3.5 bg-navy-950/90 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
                <b>Engineering Notice:</b> This is a preliminary software-based engineering estimate and must be validated
                by qualified engineers and official authorities before real-world construction or installation.
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-teal-400 font-mono text-sm">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-teal-400 animate-ping" />
          <span>INITIALIZING GEOTHERM TELEMETRY ENGINE...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  );
}
