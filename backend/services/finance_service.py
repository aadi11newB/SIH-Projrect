"""
Government Subsidy Matching and Financial Planner Engine for GEOTHERM SHIELD
Computes complete project capital expenditure, applicable government subsidies/grants,
10-year lifecycle savings, and return-on-investment projections.
"""

from typing import List, Dict, Any
from backend.database.subsidies_data import SUBSIDY_SCHEMES
from backend.models.schemas import FinancialCalculationRequest, FinancialCalculationResult

def calculate_project_finances(req: FinancialCalculationRequest) -> FinancialCalculationResult:
    """
    Calculate full capital costs, government subsidies, lifecycle operating savings, and payback period.
    """
    area = req.shelter_floor_area_sqm
    kw = req.system_capacity_kw
    
    # 1. Capital Cost Breakdowns
    # Foundation, structural framing, flooring: ~₹3,500/m²
    civil_cost = round(area * 3500.0, 0)
    
    # Thermal Envelope: Walls + Roof + Insulation + Glazing
    # Base insulation + cladding: ~₹2,200/m² floor equivalent
    ins_factor = (req.insulation_thickness_cm / 8.0)
    envelope_cost = round(area * 2200.0 * ins_factor, 0)
    
    # Solar PV Components (Tier 1 Mono PERC / TOPCon modules): ~₹24,000 / kW
    pv_modules_cost = round(kw * 24000.0, 0)
    
    # Inverter, MPPT Charge Controller, Structure, Cabling & Protection BOS: ~₹16,000 / kW
    inverter_bos_cost = round(kw * 16000.0, 0)
    
    # Battery Energy Storage (LiFePO4 48V bank for defense/remote resilience, ~1.5h autonomy per kW): ~₹12,000 / kW
    battery_cost = round(kw * 12000.0, 0)
    
    gross_project_cost = civil_cost + envelope_cost + pv_modules_cost + inverter_bos_cost + battery_cost
    
    # 2. Match Government Subsidies from dynamic database
    matched_schemes: List[Dict[str, Any]] = []
    total_subsidy = 0.0
    
    state_clean = req.state.strip()
    
    for scheme in SUBSIDY_SCHEMES:
        states = scheme["applicable_states"]
        if "ALL" in states or any(s.lower() in state_clean.lower() for s in states):
            rules = scheme["rules"]
            sub_amount = 0.0
            
            # PM Surya Ghar Rule
            if scheme["id"] == "pm_surya_ghar_2024":
                if kw <= 1.0:
                    sub_amount = rules["tier1_amount"]
                elif kw <= 2.0:
                    sub_amount = rules["tier2_amount"]
                else:
                    sub_amount = rules["tier3_amount"]
                sub_amount = min(rules["max_subsidy"], sub_amount)
                
            # LREDA Cold Desert Strategic Scheme
            elif scheme["id"] == "ladakh_lreda_cold_desert":
                sub_amount = min(rules["max_subsidy"], (pv_modules_cost + inverter_bos_cost + envelope_cost) * rules["percentage"])
                
            # MNRE Special Category States
            elif scheme["id"] == "mnre_special_category_states":
                if kw <= 3.0:
                    sub_amount = kw * rules["rate_up_to_3kw"]
                else:
                    sub_amount = 3.0 * rules["rate_up_to_3kw"] + (kw - 3.0) * rules["rate_3_to_10kw"]
                sub_amount = min(rules["max_subsidy"], sub_amount)
                
            # DRDO / BADP Border Grant
            elif scheme["id"] == "drdo_border_energy_grant":
                sub_amount = min(rules["max_subsidy"], gross_project_cost * rules["percentage"])
                
            # Rajasthan Desert Scheme
            elif scheme["id"] == "rajasthan_rrec_desert_solar":
                sub_amount = min(rules["max_subsidy"], (pv_modules_cost + inverter_bos_cost) * rules["percentage"])
                
            if sub_amount > 0:
                matched_schemes.append({
                    "id": scheme["id"],
                    "name": scheme["name"],
                    "level": scheme["level"],
                    "category": scheme["category"],
                    "calculated_subsidy_inr": round(sub_amount, 0),
                    "description": scheme["description"],
                    "official_source": scheme["official_source"],
                    "last_verified_date": scheme["last_verified_date"]
                })
                total_subsidy = max(total_subsidy, sub_amount) # Apply highest eligible primary grant
                
    # In special high-altitude zones, stack primary central CFA + UT strategic insulation grant
    if "ladakh" in state_clean.lower():
        total_subsidy = min(gross_project_cost * 0.65, max(total_subsidy, 280000.0))
        
    net_project_cost = max(0.0, gross_project_cost - total_subsidy)
    
    # 3. Operating Savings and Payback Analysis
    # In high-altitude off-grid areas, energy is provided by diesel generators (₹28 - ₹35 / kWh delivered)
    # In grid-connected regions, tariff is ₹7.50 / kWh
    is_remote_defense = any(k in state_clean.lower() for k in ["ladakh", "kashmir", "arunachal", "dras", "kargil"])
    effective_tariff = req.diesel_replacement_cost_inr_per_kwh if is_remote_defense else req.grid_tariff_inr_per_kwh
    
    annual_gen = req.annual_solar_generation_kwh
    annual_heat_req = req.annual_heating_requirement_kwh
    
    # Baseline external energy cost (Heating + Basic Power without passive/solar optimization)
    baseline_energy_kwh = annual_heat_req * 1.6 + 3000.0 # Uninsulated shelter requires 60% more heating
    annual_cost_without_solar = round(baseline_energy_kwh * effective_tariff, 0)
    
    # Optimized energy cost (Solar offsets power + passive insulation reduces heating by 75%)
    remaining_external_kwh = max(0.0, (annual_heat_req * 0.25 + 3000.0) - annual_gen)
    annual_cost_with_solar = round(remaining_external_kwh * effective_tariff, 0)
    
    annual_savings = max(1000.0, annual_cost_without_solar - annual_cost_with_solar)
    
    payback_years = round(net_project_cost / max(1.0, annual_savings), 1)
    
    # 10-year cumulative savings (accounting for 4% annual fuel/grid tariff inflation and 0.8% PV degradation)
    ten_year_sum = 0.0
    for y in range(1, 11):
        inflation = (1.04) ** y
        pv_deg = (0.992) ** y
        yearly_save = (baseline_energy_kwh * effective_tariff * inflation) - (remaining_external_kwh * effective_tariff * inflation / pv_deg)
        ten_year_sum += yearly_save
        
    ten_year_net_savings = round(ten_year_sum - net_project_cost, 0)
    roi_pct = round((ten_year_net_savings / max(1.0, net_project_cost)) * 100.0, 1)
    
    return FinancialCalculationResult(
        civil_shelter_cost_inr=civil_cost,
        insulation_thermal_envelope_cost_inr=envelope_cost,
        solar_pv_modules_cost_inr=pv_modules_cost,
        inverter_bos_cost_inr=inverter_bos_cost,
        battery_storage_cost_inr=battery_cost,
        total_gross_project_cost_inr=gross_project_cost,
        applicable_schemes=matched_schemes,
        total_applicable_subsidy_inr=round(total_subsidy, 0),
        estimated_net_cost_inr=round(net_project_cost, 0),
        annual_external_energy_cost_without_solar_inr=annual_cost_without_solar,
        annual_energy_cost_with_solar_inr=annual_cost_with_solar,
        annual_net_savings_inr=annual_savings,
        simple_payback_period_years=payback_years,
        ten_year_cumulative_savings_inr=ten_year_net_savings,
        roi_percentage=roi_pct,
        disclaimer="Preliminary software-based financial estimate. Subject to official verification on respective government portals."
    )
