"""
Unit Tests for GEOTHERM SHIELD Computational Core
"""

import pytest
from backend.models.schemas import (
    ThermalSimulationRequest, ShelterGeometry, ShelterMaterials, ShelterOpenings,
    SolarEstimateRequest, SolarPanelConfig, OptimizerRequest,
    FinancialCalculationRequest, LocationProfile, ReportGenerationRequest
)
from backend.services.thermal_service import simulate_shelter_thermal, calculate_envelope_u_values
from backend.services.solar_service import estimate_solar_yield, calculate_optimum_tilt_and_azimuth
from backend.services.optimizer_service import run_co_optimization
from backend.services.finance_service import calculate_project_finances
from backend.services.report_service import generate_pdf_report

def test_envelope_u_values():
    geom = ShelterGeometry(length=8.0, width=5.0, height=2.8)
    mats = ShelterMaterials(
        wall_material_id="insulated_composite_panel",
        wall_thickness_m=0.10,
        insulation_material_id="rockwool",
        insulation_thickness_m=0.08,
        roof_material_id="insulated_standing_seam",
        glazing_type_id="triple_low_e_argon"
    )
    u_props = calculate_envelope_u_values(geom, mats)
    assert u_props["u_wall"] < 0.35 # High-performance wall U-value < 0.35 W/m²K
    assert u_props["u_glazing"] <= 0.8 # Triple glazed low-e
    assert u_props["shgc"] > 0

def test_thermal_simulation_leh_winter():
    req = ThermalSimulationRequest(
        location_id="leh_ladakh",
        latitude=34.1526,
        longitude=77.5771,
        season="winter"
    )
    res = simulate_shelter_thermal(req)
    assert len(res.hourly_indoor_temp_c) == 24
    assert len(res.hourly_outdoor_temp_c) == 24
    # Passive solar + insulation should elevate indoor temp significantly above extreme ambient -18°C
    assert res.min_indoor_temp_c > -18.0
    assert res.thermal_comfort_score > 30
    assert res.total_daily_solar_energy_captured_kwh > 0

def test_solar_yield_estimation():
    req = SolarEstimateRequest(
        latitude=34.1526,
        longitude=77.5771,
        annual_ghi_kwh_m2=2150.0,
        panel_config=SolarPanelConfig(
            available_roof_area_sqm=40.0,
            panel_wattage_wp=450.0,
            system_capacity_kw=5.0
        )
    )
    res = estimate_solar_yield(req)
    assert res.installed_capacity_kw >= 4.5
    assert res.estimated_annual_generation_kwh > 6000.0
    assert len(res.monthly_generation_kwh) == 12
    assert res.solar_potential_score >= 80

def test_co_optimization():
    req = OptimizerRequest(
        location_id="leh_ladakh",
        latitude=34.1526,
        longitude=77.5771,
        desired_floor_area_sqm=40.0
    )
    res = run_co_optimization(req)
    assert res.best_overall_design is not None
    assert len(res.top_3_variants) == 3
    assert res.best_overall_design.overall_score >= res.top_3_variants[1].overall_score

def test_financial_calculation_and_subsidies():
    req = FinancialCalculationRequest(
        state="Ladakh",
        system_capacity_kw=8.0,
        shelter_floor_area_sqm=40.0
    )
    res = calculate_project_finances(req)
    assert res.total_gross_project_cost_inr > 0
    assert res.total_applicable_subsidy_inr > 0
    assert res.estimated_net_cost_inr < res.total_gross_project_cost_inr
    assert res.simple_payback_period_years > 0

def test_pdf_report_generation():
    loc = LocationProfile(
        id="leh_ladakh",
        name="Leh, Ladakh",
        state="Ladakh",
        country="India",
        latitude=34.1526,
        longitude=77.5771,
        elevation_m=3524.0,
        climate_zone="Cold Arid",
        koppen_code="BWk",
        avg_annual_temp_c=5.4,
        winter_min_temp_c=-18.5,
        summer_max_temp_c=28.2,
        annual_solar_ghi_kwh_m2=2150.0,
        avg_daily_sunshine_hours=8.8,
        avg_wind_speed_ms=3.8,
        atmospheric_pressure_kpa=66.5,
        solar_potential_score=94,
        shelter_suitability_score=88,
        dominant_challenge="Extreme cold",
        recommended_passive_strategy="Solar passive design"
    )
    t_sim = simulate_shelter_thermal(ThermalSimulationRequest(location_id="leh_ladakh"))
    s_est = estimate_solar_yield(SolarEstimateRequest(latitude=34.1526, longitude=77.5771))
    fin = calculate_project_finances(FinancialCalculationRequest(state="Ladakh"))
    
    rep_req = ReportGenerationRequest(
        location_profile=loc,
        geometry=ShelterGeometry(),
        materials=ShelterMaterials(),
        openings=ShelterOpenings(),
        simulation_result=t_sim,
        solar_result=s_est,
        financial_result=fin
    )
    pdf_data = generate_pdf_report(rep_req)
    assert len(pdf_data) > 1000 # PDF generated successfully
    assert pdf_data.startswith(b"%PDF")
