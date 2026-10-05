export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationProfile {
  id: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  climate_zone: string;
  koppen_code: string;
  avg_annual_temp_c: number;
  winter_min_temp_c: number;
  summer_max_temp_c: number;
  annual_solar_ghi_kwh_m2: number;
  avg_daily_sunshine_hours: number;
  avg_wind_speed_ms: number;
  atmospheric_pressure_kpa: number;
  solar_potential_score: number;
  shelter_suitability_score: number;
  dominant_challenge: string;
  recommended_passive_strategy: string;
  is_live_data?: boolean;
  data_source?: string;
}

export interface ShelterGeometry {
  length: number;
  width: number;
  height: number;
  roof_type: string;
  roof_angle: number;
  orientation_azimuth: number;
}

export interface ShelterMaterials {
  wall_material_id: string;
  wall_thickness_m: number;
  insulation_material_id: string;
  insulation_thickness_m: number;
  roof_material_id: string;
  roof_thickness_m: number;
  floor_insulation_thickness_m: number;
  glazing_type_id: string;
}

export interface ShelterOpenings {
  south_window_area_sqm: number;
  north_window_area_sqm: number;
  east_window_area_sqm: number;
  west_window_area_sqm: number;
  door_area_sqm: number;
  infiltration_ach: number;
  occupants_count: number;
  internal_heat_gain_w: number;
}

export interface SolarPanelConfig {
  available_roof_area_sqm: number;
  panel_wattage_wp: number;
  panel_efficiency: number;
  panel_length_m: number;
  panel_width_m: number;
  tilt_angle_deg: number;
  azimuth_deg: number;
  system_capacity_kw?: number;
  shading_factor: number;
}

export interface ThermalSimulationResult {
  hourly_hours: number[];
  hourly_outdoor_temp_c: number[];
  hourly_indoor_temp_c: number[];
  hourly_solar_heat_gain_w: number[];
  hourly_conduction_heat_loss_w: number[];
  hourly_infiltration_loss_w: number[];
  hourly_net_heat_flow_w: number[];
  peak_indoor_temp_c: number;
  min_indoor_temp_c: number;
  avg_indoor_temp_c: number;
  diurnal_temperature_swing_c: number;
  thermal_comfort_score: number;
  comfort_category: string;
  total_daily_solar_energy_captured_kwh: number;
  total_daily_heat_loss_kwh: number;
  auxiliary_heating_energy_needed_kwh: number;
  envelope_overall_u_value_w_m2k: number;
  day_solar_storage_efficiency_pct: number;
  night_thermal_retention_score: number;
  critical_cold_period_hours: number[];
  critical_cold_warning: string;
  data_method: string;
}

export interface SolarEstimateResult {
  solar_potential_score: number;
  recommended_tilt_deg: number;
  recommended_azimuth_deg: number;
  installed_capacity_kw: number;
  number_of_panels: number;
  panel_area_used_sqm: number;
  roof_utilization_pct: number;
  estimated_annual_generation_kwh: number;
  estimated_daily_avg_generation_kwh: number;
  monthly_generation_kwh: number[];
  co2_offset_tonnes_per_year: number;
  method: string;
}

export interface OptimizedDesignVariant {
  rank: number;
  title: string;
  shelter_orientation_deg: number;
  dimensions: { [key: string]: number };
  wall_material_id: string;
  wall_material_name: string;
  insulation_material_id: string;
  insulation_material_name: string;
  insulation_thickness_cm: number;
  roof_material_id: string;
  roof_material_name: string;
  glazing_type_id: string;
  glazing_type_name: string;
  south_window_area_sqm: number;
  solar_capacity_kw: number;
  thermal_comfort_score: number;
  solar_potential_score: number;
  energy_efficiency_score: number;
  cost_score: number;
  overall_score: number;
  min_indoor_temp_c: number;
  peak_indoor_temp_c: number;
  annual_solar_generation_kwh: number;
  estimated_project_cost_inr: number;
  estimated_net_cost_inr: number;
  rationales: string[];
}

export interface CoOptimizationResult {
  best_overall_design: OptimizedDesignVariant;
  top_3_variants: OptimizedDesignVariant[];
  optimization_summary: string;
  method: string;
}

export interface SubsidySchemeInfo {
  id: string;
  name: string;
  level: string;
  category: string;
  calculated_subsidy_inr: number;
  description: string;
  official_source: string;
  last_verified_date: string;
}

export interface FinancialCalculationResult {
  civil_shelter_cost_inr: number;
  insulation_thermal_envelope_cost_inr: number;
  solar_pv_modules_cost_inr: number;
  inverter_bos_cost_inr: number;
  battery_storage_cost_inr: number;
  total_gross_project_cost_inr: number;
  applicable_schemes: SubsidySchemeInfo[];
  total_applicable_subsidy_inr: number;
  estimated_net_cost_inr: number;
  annual_external_energy_cost_without_solar_inr: number;
  annual_energy_cost_with_solar_inr: number;
  annual_net_savings_inr: number;
  simple_payback_period_years: number;
  ten_year_cumulative_savings_inr: number;
  roi_percentage: number;
  disclaimer: string;
}

export interface RankedSite {
  rank: number;
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  solar_potential_score: number;
  thermal_suitability_score: number;
  installation_feasibility_score: number;
  composite_site_score: number;
  annual_ghi_kwh_m2: number;
  winter_min_temp_c: number;
  feasibility_notes: string;
}
