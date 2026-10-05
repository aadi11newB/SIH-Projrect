"""
Pydantic Schemas for GEOTHERM SHIELD
Strict typed models for GIS, Climate, Shelter Geometry, Materials, Thermal Simulation, Solar Optimization, and Finance.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")

class LocationProfile(BaseModel):
    id: str
    name: str
    state: str
    country: str = "India"
    latitude: float
    longitude: float
    elevation_m: float
    climate_zone: str
    koppen_code: str
    avg_annual_temp_c: float
    winter_min_temp_c: float
    summer_max_temp_c: float
    annual_solar_ghi_kwh_m2: float
    avg_daily_sunshine_hours: float
    avg_wind_speed_ms: float
    atmospheric_pressure_kpa: float
    solar_potential_score: int
    shelter_suitability_score: int
    dominant_challenge: str
    recommended_passive_strategy: str
    is_live_data: bool = False
    data_source: str = "Reference / Historical Multi-Year Reanalysis"

class ClimateQuery(BaseModel):
    latitude: float = Field(34.1526, ge=-90.0, le=90.0)
    longitude: float = Field(77.5771, ge=-180.0, le=180.0)
    location_id: Optional[str] = "leh_ladakh"
    season: Optional[str] = "winter" # "winter" or "summer"

class HourlyClimateData(BaseModel):
    hours: List[int] = Field(default_factory=lambda: list(range(24)))
    ambient_temps: List[float]
    solar_radiation_ghi: List[float] # W/m²
    wind_speeds: List[float] # m/s
    data_source: str = "Calibrated Climate Reanalysis"

class ShelterGeometry(BaseModel):
    length: float = Field(8.0, ge=2.0, le=50.0, description="Length along east-west axis in meters")
    width: float = Field(5.0, ge=2.0, le=30.0, description="Width along north-south axis in meters")
    height: float = Field(2.8, ge=2.0, le=10.0, description="Ceiling height in meters")
    roof_type: str = Field("shed", description="Roof design: shed, gable, or flat")
    roof_angle: float = Field(30.0, ge=0.0, le=75.0, description="Roof pitch tilt angle in degrees")
    orientation_azimuth: float = Field(180.0, ge=0.0, le=360.0, description="Azimuth: 180° = South facing, 90° = East, 270° = West, 0° = North")

class ShelterMaterials(BaseModel):
    wall_material_id: str = Field("insulated_composite_panel", description="Wall core material")
    wall_thickness_m: float = Field(0.10, ge=0.02, le=0.60, description="Wall thickness in meters")
    insulation_material_id: str = Field("rockwool", description="Secondary insulation layer")
    insulation_thickness_m: float = Field(0.08, ge=0.0, le=0.30, description="Insulation thickness in meters")
    roof_material_id: str = Field("insulated_standing_seam", description="Roof material")
    roof_thickness_m: float = Field(0.10, ge=0.02, le=0.40)
    floor_insulation_thickness_m: float = Field(0.05, ge=0.0, le=0.20)
    glazing_type_id: str = Field("triple_low_e_argon", description="Glazing assembly")

class ShelterOpenings(BaseModel):
    south_window_area_sqm: float = Field(6.0, ge=0.0, le=40.0, description="Glazing area facing South (passive solar capture)")
    north_window_area_sqm: float = Field(0.8, ge=0.0, le=20.0, description="Glazing area facing North")
    east_window_area_sqm: float = Field(1.2, ge=0.0, le=20.0, description="Glazing area facing East")
    west_window_area_sqm: float = Field(1.0, ge=0.0, le=20.0, description="Glazing area facing West")
    door_area_sqm: float = Field(2.1, ge=1.0, le=10.0, description="Insulated entry door area in m²")
    infiltration_ach: float = Field(0.35, ge=0.05, le=3.0, description="Air changes per hour (airtightness)")
    occupants_count: int = Field(4, ge=1, le=50, description="Number of personnel inside shelter")
    internal_heat_gain_w: float = Field(400.0, ge=0.0, le=10000.0, description="Appliance/lighting heat in Watts")

class SolarPanelConfig(BaseModel):
    available_roof_area_sqm: float = Field(40.0, ge=5.0, le=500.0)
    panel_wattage_wp: float = Field(450.0, ge=200.0, le=700.0, description="Rated peak power per panel")
    panel_efficiency: float = Field(0.21, ge=0.10, le=0.26)
    panel_length_m: float = Field(2.0, ge=1.0, le=3.0)
    panel_width_m: float = Field(1.0, ge=0.8, le=1.5)
    tilt_angle_deg: float = Field(34.0, ge=0.0, le=90.0)
    azimuth_deg: float = Field(180.0, ge=0.0, le=360.0)
    system_capacity_kw: Optional[float] = Field(None, ge=0.5, le=100.0)
    shading_factor: float = Field(0.04, ge=0.0, le=0.5)

class ThermalSimulationRequest(BaseModel):
    location: Optional[LocationProfile] = None
    location_id: Optional[str] = "leh_ladakh"
    latitude: Optional[float] = 34.1526
    longitude: Optional[float] = 77.5771
    season: str = "winter"
    geometry: ShelterGeometry = Field(default_factory=ShelterGeometry)
    materials: ShelterMaterials = Field(default_factory=ShelterMaterials)
    openings: ShelterOpenings = Field(default_factory=ShelterOpenings)
    custom_ambient_temps: Optional[List[float]] = None
    custom_solar_ghi: Optional[List[float]] = None

class ThermalSimulationResult(BaseModel):
    hourly_hours: List[int]
    hourly_outdoor_temp_c: List[float]
    hourly_indoor_temp_c: List[float]
    hourly_solar_heat_gain_w: List[float]
    hourly_conduction_heat_loss_w: List[float]
    hourly_infiltration_loss_w: List[float]
    hourly_net_heat_flow_w: List[float]
    
    # Summary key indicators
    peak_indoor_temp_c: float
    min_indoor_temp_c: float
    avg_indoor_temp_c: float
    diurnal_temperature_swing_c: float
    thermal_comfort_score: int # 0-100 score
    comfort_category: str # "Optimal", "Moderate Caution", "High Thermal Risk"
    
    total_daily_solar_energy_captured_kwh: float
    total_daily_heat_loss_kwh: float
    auxiliary_heating_energy_needed_kwh: float
    envelope_overall_u_value_w_m2k: float
    
    # Day vs Night Diagnostics
    day_solar_storage_efficiency_pct: float
    night_thermal_retention_score: int
    critical_cold_period_hours: List[int]
    critical_cold_warning: str
    
    data_method: str = "24-Hour First-Principles Lumped Capacitance RC Simulation"

class SolarEstimateRequest(BaseModel):
    latitude: float = 34.1526
    longitude: float = 77.5771
    annual_ghi_kwh_m2: Optional[float] = 2150.0
    panel_config: SolarPanelConfig = Field(default_factory=SolarPanelConfig)
    location_name: Optional[str] = "Leh, Ladakh"

class SolarEstimateResult(BaseModel):
    solar_potential_score: int
    recommended_tilt_deg: float
    recommended_azimuth_deg: float
    installed_capacity_kw: float
    number_of_panels: int
    panel_area_used_sqm: float
    roof_utilization_pct: float
    estimated_annual_generation_kwh: float
    estimated_daily_avg_generation_kwh: float
    monthly_generation_kwh: List[float]
    co2_offset_tonnes_per_year: float
    method: str = "Photovoltaic Clear-Sky & Geometric Tilt Integration Model"

class OptimizerRequest(BaseModel):
    location_id: str = "leh_ladakh"
    latitude: float = 34.1526
    longitude: float = 77.5771
    season: str = "winter"
    desired_floor_area_sqm: float = Field(40.0, ge=15.0, le=200.0)
    budget_limit_inr: Optional[float] = 1200000.0
    prioritize_cost: bool = False

class OptimizedDesignVariant(BaseModel):
    rank: int
    title: str
    shelter_orientation_deg: float
    dimensions: Dict[str, float]
    wall_material_id: str
    wall_material_name: str
    insulation_material_id: str
    insulation_material_name: str
    insulation_thickness_cm: float
    roof_material_id: str
    roof_material_name: str
    glazing_type_id: str
    glazing_type_name: str
    south_window_area_sqm: float
    solar_capacity_kw: float
    
    thermal_comfort_score: int
    solar_potential_score: int
    energy_efficiency_score: int
    cost_score: int
    overall_score: int
    
    min_indoor_temp_c: float
    peak_indoor_temp_c: float
    annual_solar_generation_kwh: float
    estimated_project_cost_inr: float
    estimated_net_cost_inr: float
    rationales: List[str]

class CoOptimizationResult(BaseModel):
    best_overall_design: OptimizedDesignVariant
    top_3_variants: List[OptimizedDesignVariant]
    optimization_summary: str
    method: str = "Multi-Objective Pareto Trade-off Analysis (Thermal + PV + Lifecycle Cost)"

class FinancialCalculationRequest(BaseModel):
    state: str = "Ladakh"
    system_capacity_kw: float = 5.0
    shelter_floor_area_sqm: float = 40.0
    wall_material_id: str = "insulated_composite_panel"
    insulation_thickness_cm: float = 8.0
    roof_material_id: str = "insulated_standing_seam"
    annual_solar_generation_kwh: float = 8500.0
    annual_heating_requirement_kwh: float = 6200.0
    grid_tariff_inr_per_kwh: float = 7.5
    diesel_replacement_cost_inr_per_kwh: float = 28.0 # For off-grid cold defense posts running DG sets

class FinancialCalculationResult(BaseModel):
    # Costs
    civil_shelter_cost_inr: float
    insulation_thermal_envelope_cost_inr: float
    solar_pv_modules_cost_inr: float
    inverter_bos_cost_inr: float
    battery_storage_cost_inr: float
    total_gross_project_cost_inr: float
    
    # Subsidies
    applicable_schemes: List[Dict[str, Any]]
    total_applicable_subsidy_inr: float
    estimated_net_cost_inr: float
    
    # Savings & Payback
    annual_external_energy_cost_without_solar_inr: float
    annual_energy_cost_with_solar_inr: float
    annual_net_savings_inr: float
    simple_payback_period_years: float
    ten_year_cumulative_savings_inr: float
    roi_percentage: float
    disclaimer: str = "Preliminary software-based financial estimate. Subject to official verification on respective government portals."

class RankedSite(BaseModel):
    rank: int
    id: str
    name: str
    state: str
    latitude: float
    longitude: float
    elevation_m: float
    solar_potential_score: int
    thermal_suitability_score: int
    installation_feasibility_score: int
    composite_site_score: int
    annual_ghi_kwh_m2: float
    winter_min_temp_c: float
    feasibility_notes: str

class ReportGenerationRequest(BaseModel):
    location_profile: LocationProfile
    geometry: ShelterGeometry
    materials: ShelterMaterials
    openings: ShelterOpenings
    simulation_result: ThermalSimulationResult
    solar_result: SolarEstimateResult
    financial_result: FinancialCalculationResult
    recommended_design: Optional[OptimizedDesignVariant] = None
    user_project_name: Optional[str] = "High-Altitude Tactical Habitat Alpha"
    author_name: Optional[str] = "Defense Infrastructure Engineering Cell"
