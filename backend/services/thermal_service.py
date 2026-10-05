"""
Dynamic 24-Hour Thermal Simulation Engine for GEOTHERM SHIELD
Implements lumped capacitance RC differential network with solar-air temperature,
multi-layer envelope U-value synthesis, thermal inertia phase-lag, and comfort index scoring.
"""

import math
import numpy as np
from typing import List, Dict, Any, Tuple
from backend.database.materials_data import WALL_MATERIALS, INSULATION_MATERIALS, ROOF_MATERIALS, GLAZING_MATERIALS
from backend.database.locations_data import get_location_by_coords_or_id
from backend.models.schemas import (
    ThermalSimulationRequest, ThermalSimulationResult,
    ShelterGeometry, ShelterMaterials, ShelterOpenings
)
from backend.services.solar_service import calculate_tilted_irradiance

def calculate_envelope_u_values(geom: ShelterGeometry, mats: ShelterMaterials) -> Dict[str, float]:
    """
    Calculate overall heat transfer coefficients (U-values in W/m²·K) according to IS 3792 & ISO 6946.
    """
    # Surface film resistances
    r_si = 0.13 # Inside surface resistance m²·K/W
    r_se = 0.04 # Outside surface resistance m²·K/W
    r_ground = 0.40 # Sub-slab contact resistance
    
    # Wall assembly
    wall_mat = WALL_MATERIALS.get(mats.wall_material_id, WALL_MATERIALS["insulated_composite_panel"])
    ins_mat = INSULATION_MATERIALS.get(mats.insulation_material_id, INSULATION_MATERIALS["rockwool"])
    
    r_wall_core = mats.wall_thickness_m / max(0.001, wall_mat["conductivity"])
    r_wall_ins = mats.insulation_thickness_m / max(0.001, ins_mat["conductivity"])
    r_wall_total = r_si + r_wall_core + r_wall_ins + r_se
    u_wall = 1.0 / max(0.05, r_wall_total)
    
    # Roof assembly
    roof_mat = ROOF_MATERIALS.get(mats.roof_material_id, ROOF_MATERIALS["insulated_standing_seam"])
    r_roof_core = mats.roof_thickness_m / max(0.001, roof_mat["conductivity"])
    r_roof_total = r_si + r_roof_core + r_se
    u_roof = 1.0 / max(0.05, r_roof_total)
    
    # Floor assembly (50mm default floor insulation)
    r_floor_ins = mats.floor_insulation_thickness_m / 0.034
    r_floor_total = r_si + 0.15/1.4 + r_floor_ins + r_ground # 150mm concrete slab + insulation + ground
    u_floor = 1.0 / max(0.05, r_floor_total)
    
    # Glazing
    glazing_mat = GLAZING_MATERIALS.get(mats.glazing_type_id, GLAZING_MATERIALS["triple_low_e_argon"])
    u_glazing = glazing_mat["u_value"]
    
    return {
        "u_wall": u_wall,
        "u_roof": u_roof,
        "u_floor": u_floor,
        "u_glazing": u_glazing,
        "shgc": glazing_mat["shgc"],
        "wall_absorptance": wall_mat.get("solar_absorptance", 0.60),
        "wall_density": wall_mat.get("density", 1000.0),
        "wall_cp": wall_mat.get("specific_heat", 1000.0)
    }

def simulate_shelter_thermal(req: ThermalSimulationRequest) -> ThermalSimulationResult:
    """
    Execute multi-node diurnal thermal simulation over 24 hours.
    Uses 3-day cyclic warmup to reach true dynamic periodic equilibrium.
    """
    geom = req.geometry
    mats = req.materials
    openings = req.openings
    
    # Fetch climate data
    loc = get_location_by_coords_or_id(location_id=req.location_id, lat=req.latitude, lon=req.longitude)
    
    if req.custom_ambient_temps and len(req.custom_ambient_temps) == 24:
        hourly_t_amb = req.custom_ambient_temps
    elif req.season == "summer" and "hourly_diurnal_summer" in loc:
        hourly_t_amb = loc["hourly_diurnal_summer"]["ambient_temps"]
    else:
        hourly_t_amb = loc.get("hourly_diurnal_winter", {}).get("ambient_temps", [0.0]*24)
        
    if req.custom_solar_ghi and len(req.custom_solar_ghi) == 24:
        hourly_ghi = req.custom_solar_ghi
    elif req.season == "summer" and "hourly_diurnal_summer" in loc:
        hourly_ghi = loc["hourly_diurnal_summer"]["solar_radiation_ghi"]
    else:
        hourly_ghi = loc.get("hourly_diurnal_winter", {}).get("solar_radiation_ghi", [0.0]*24)
        
    # Calculate geometric surface areas
    # Assume length is East-West axis, width is North-South axis
    # Orientation azimuth 180° = Main facade facing South
    area_floor = geom.length * geom.width
    area_roof = (geom.length * geom.width) / max(0.2, math.cos(math.radians(geom.roof_angle)))
    
    area_wall_south_gross = geom.length * geom.height
    area_wall_north_gross = geom.length * geom.height
    area_wall_east_gross = geom.width * geom.height
    area_wall_west_gross = geom.width * geom.height
    
    area_win_south = min(area_wall_south_gross * 0.8, openings.south_window_area_sqm)
    area_win_north = min(area_wall_north_gross * 0.8, openings.north_window_area_sqm)
    area_win_east = min(area_wall_east_gross * 0.8, openings.east_window_area_sqm)
    area_win_west = min(area_wall_west_gross * 0.8, openings.west_window_area_sqm)
    area_door = min(area_wall_south_gross * 0.3, openings.door_area_sqm)
    
    area_wall_south_net = max(0.0, area_wall_south_gross - area_win_south - area_door)
    area_wall_north_net = max(0.0, area_wall_north_gross - area_win_north)
    area_wall_east_net = max(0.0, area_wall_east_gross - area_win_east)
    area_wall_west_net = max(0.0, area_wall_west_gross - area_win_west)
    area_walls_total_net = area_wall_south_net + area_wall_north_net + area_wall_east_net + area_wall_west_net
    area_glazing_total = area_win_south + area_win_north + area_win_east + area_win_west
    
    volume_internal = geom.length * geom.width * geom.height
    
    # Calculate U-values
    u_props = calculate_envelope_u_values(geom, mats)
    u_wall = u_props["u_wall"]
    u_roof = u_props["u_roof"]
    u_floor = u_props["u_floor"]
    u_glazing = u_props["u_glazing"]
    u_door = 1.2 # Standard insulated door
    shgc = u_props["shgc"]
    
    # Conductance (UA in W/K)
    ua_walls = (area_wall_south_net + area_wall_north_net + area_wall_east_net + area_wall_west_net) * u_wall
    ua_roof = area_roof * u_roof
    ua_floor = area_floor * u_floor
    ua_glazing = area_glazing_total * u_glazing
    ua_door = area_door * u_door
    ua_envelope = ua_walls + ua_roof + ua_floor + ua_glazing + ua_door
    
    total_envelope_area = area_walls_total_net + area_roof + area_floor + area_glazing_total + area_door
    overall_u_val = round(ua_envelope / max(1.0, total_envelope_area), 3)
    
    # Atmospheric air density adjustment
    elev = loc.get("elevation_m", 1000.0)
    p_atm = loc.get("atmospheric_pressure_kpa", 85.0)
    rho_air = (p_atm * 1000.0) / (287.05 * 273.15) # kg/m³
    cp_air = 1005.0 # J/kg·K
    
    # Infiltration conductance
    # Infiltration heat capacity flow rate W/K
    h_inf = (rho_air * cp_air * volume_internal * openings.infiltration_ach) / 3600.0
    
    # Effective internal thermal capacitance C_total in Joules/Kelvin
    # Participating thermal mass: internal air + ~40% of inner wall mass + floor slab
    wall_mass_kg = area_walls_total_net * mats.wall_thickness_m * u_props["wall_density"]
    floor_mass_kg = area_floor * 0.10 * 2200.0 # 100mm concrete
    
    c_air = volume_internal * rho_air * cp_air
    c_walls = wall_mass_kg * u_props["wall_cp"] * 0.35 # 35% participating
    c_floor = floor_mass_kg * 880.0 * 0.40
    c_total = c_air + c_walls + c_floor
    
    # Precompute hourly tilted irradiance on 4 vertical walls and roof
    lat = loc.get("latitude", 34.0)
    day_idx = 15 if req.season == "winter" else 195
    
    hourly_q_sol_win = []
    hourly_q_sol_walls = []
    
    for h in range(24):
        ghi = hourly_ghi[h]
        if ghi > 0:
            # Solar gain through South, North, East, West windows
            # Azimuth convention: South=180, North=0, East=90, West=270
            # Geometry orientation modifies base azimuth
            az_offset = geom.orientation_azimuth - 180.0
            
            i_tilt_south = calculate_tilted_irradiance(ghi, lat, h + 0.5, day_idx, 90.0, (180.0 + az_offset) % 360)
            i_tilt_north = calculate_tilted_irradiance(ghi, lat, h + 0.5, day_idx, 90.0, (0.0 + az_offset) % 360)
            i_tilt_east = calculate_tilted_irradiance(ghi, lat, h + 0.5, day_idx, 90.0, (90.0 + az_offset) % 360)
            i_tilt_west = calculate_tilted_irradiance(ghi, lat, h + 0.5, day_idx, 90.0, (270.0 + az_offset) % 360)
            i_tilt_roof = calculate_tilted_irradiance(ghi, lat, h + 0.5, day_idx, geom.roof_angle, (180.0 + az_offset) % 360)
            
            # Solar window transmitted heat gain (Watts)
            q_win = (
                area_win_south * i_tilt_south +
                area_win_north * i_tilt_north +
                area_win_east * i_tilt_east +
                area_win_west * i_tilt_west
            ) * shgc
            
            # Opaque envelope absorbed solar gain (sol-air contribution converted to interior flux)
            # Sol-air delta T = alpha * I / h_out (with h_out ~ 20 W/m²K)
            h_out = 20.0
            alpha = u_props["wall_absorptance"]
            q_wall_sol = (
                area_wall_south_net * u_wall * (alpha * i_tilt_south / h_out) +
                area_wall_north_net * u_wall * (alpha * i_tilt_north / h_out) +
                area_wall_east_net * u_wall * (alpha * i_tilt_east / h_out) +
                area_wall_west_net * u_wall * (alpha * i_tilt_west / h_out) +
                area_roof * u_roof * (0.50 * i_tilt_roof / h_out)
            )
        else:
            q_win = 0.0
            q_wall_sol = 0.0
            
        hourly_q_sol_win.append(q_win)
        hourly_q_sol_walls.append(q_wall_sol)
        
    # Internal gains (occupants: 90W sensible each + appliances)
    q_internal = openings.occupants_count * 90.0 + openings.internal_heat_gain_w
    
    # Dynamic Simulation using Euler integration with fine time step dt = 60 seconds (1440 steps/day)
    # Run 4 consecutive 24-hour cycles to eliminate initial transient condition
    dt = 60.0 # seconds
    t_in = float(np.mean(hourly_t_amb)) # Initial state
    
    total_steps = 4 * 24 * 60
    final_cycle_t_in = [0.0] * 24
    step_counts = [0] * 24
    
    for step in range(total_steps):
        time_hours_float = (step * dt / 3600.0) % 24.0
        h_idx = int(time_hours_float)
        next_h_idx = (h_idx + 1) % 24
        frac = time_hours_float - h_idx
        
        # Interpolate ambient temperature and solar
        t_amb = hourly_t_amb[h_idx] * (1.0 - frac) + hourly_t_amb[next_h_idx] * frac
        q_sol = (hourly_q_sol_win[h_idx] + hourly_q_sol_walls[h_idx]) * (1.0 - frac) + (hourly_q_sol_win[next_h_idx] + hourly_q_sol_walls[next_h_idx]) * frac
        
        # Heat transfer rate dQ/dt (Watts)
        # Conduction heat flow: UA * (T_amb - T_in)
        # Infiltration heat flow: H_inf * (T_amb - T_in)
        q_conduction = ua_envelope * (t_amb - t_in)
        q_infiltration = h_inf * (t_amb - t_in)
        q_net = q_conduction + q_infiltration + q_sol + q_internal
        
        # Update indoor temperature
        dT = (q_net / c_total) * dt
        t_in += dT
        
        # If in the 4th (converged) cycle, record
        if step >= 3 * 24 * 60:
            final_cycle_t_in[h_idx] += t_in
            step_counts[h_idx] += 1
            
    # Compute hourly averages for final 24h cycle
    hourly_indoor_temps = [round(final_cycle_t_in[h] / max(1, step_counts[h]), 2) for h in range(24)]
    
    # Compute energy flow breakdowns
    hourly_q_loss_cond = []
    hourly_q_loss_inf = []
    hourly_q_gain_sol = []
    hourly_q_net = []
    
    for h in range(24):
        t_out = hourly_t_amb[h]
        t_in_h = hourly_indoor_temps[h]
        q_gain_s = hourly_q_sol_win[h] + hourly_q_sol_walls[h]
        q_cond_loss = max(0.0, ua_envelope * (t_in_h - t_out))
        q_inf_loss = max(0.0, h_inf * (t_in_h - t_out))
        
        q_net_h = (q_gain_s + q_internal) - (q_cond_loss + q_inf_loss)
        
        hourly_q_gain_sol.append(round(q_gain_s, 1))
        hourly_q_loss_cond.append(round(q_cond_loss, 1))
        hourly_q_loss_inf.append(round(q_inf_loss, 1))
        hourly_q_net.append(round(q_net_h, 1))
        
    peak_in = round(max(hourly_indoor_temps), 1)
    min_in = round(min(hourly_indoor_temps), 1)
    avg_in = round(float(np.mean(hourly_indoor_temps)), 1)
    swing = round(peak_in - min_in, 1)
    
    # Total energy values (kWh/day)
    total_sol_kwh = round(sum(hourly_q_gain_sol) / 1000.0, 2)
    total_loss_kwh = round((sum(hourly_q_loss_cond) + sum(hourly_q_loss_inf)) / 1000.0, 2)
    
    # Auxiliary heating energy required to maintain minimum 18°C baseline (IS 3792 standard)
    aux_heating_needed_kwh = round(
        sum(max(0.0, (18.0 - t_in_h) * (ua_envelope + h_inf)) for t_in_h in hourly_indoor_temps) / 1000.0, 2
    )
    
    # Thermal Comfort Index (TCI: 0 - 100 comparative software rating)
    # Evaluates:
    # 1. Thermal lift benefit: How effectively the passive envelope lifts indoor temperature above harsh outdoor freeze
    # 2. Indoor minimum temperature safety margin (>12°C is livable, >18°C is fully comfortable)
    # 3. Diurnal temperature damping (lower swing = higher stability)
    # 4. Solar passive harvest efficiency (solar gain relative to envelope loss)
    
    t_out_min = min(hourly_t_amb)
    thermal_lift = max(0.0, min_in - t_out_min) # Lift above freezing outdoor trough
    lift_score = min(35.0, thermal_lift * 1.8) # Up to 35 pts for passive lift
    
    # Comfort band evaluation (Target: 18°C - 24°C)
    if avg_in >= 18.0 and avg_in <= 25.0:
        band_score = 45.0
    elif avg_in < 18.0:
        band_score = max(5.0, 45.0 - (18.0 - avg_in) * 2.5)
    else:
        band_score = max(10.0, 45.0 - (avg_in - 25.0) * 3.0)
        
    # Stability bonus (penalty for large swing)
    stability_score = max(0.0, 15.0 - max(0.0, swing - 4.0) * 1.5)
    
    # Passive solar fraction score
    solar_fraction = total_sol_kwh / max(1.0, total_loss_kwh)
    solar_bonus = min(10.0, solar_fraction * 10.0)
    
    raw_comfort = lift_score + band_score + stability_score + solar_bonus
    comfort_score = int(min(98, max(25, round(raw_comfort))))
    
    if comfort_score >= 75:
        comfort_category = "Optimal (Passive Comfort Maintained)"
    elif comfort_score >= 50:
        comfort_category = "Moderate Caution (Intermittent Heating Needed)"
    else:
        comfort_category = "High Thermal Risk (Severe Cold Infiltration)"
        
    # Day vs Night Diagnostics
    # Night hours: 20:00 to 07:00
    night_hours = [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7]
    night_temps = [hourly_indoor_temps[h] for h in night_hours]
    critical_cold = [h for h in range(24) if hourly_indoor_temps[h] < 12.0]
    
    night_retention = int(min(98, max(25, 100.0 - (max(hourly_indoor_temps) - min(night_temps)) * 4.0)))
    day_storage_eff = round(min(95.0, (total_sol_kwh / max(1.0, total_loss_kwh)) * 100.0), 1)
    
    if critical_cold:
        start_h = min(critical_cold)
        end_h = max(critical_cold)
        cold_warning = f"High heat-loss & hypothermia risk period predicted between {start_h:02d}:00–{end_h:02d}:00 (Indoor: {min_in}°C)."
    else:
        cold_warning = "Envelope thermal mass maintains indoor temperature safely above hypothermia threshold 24/7."
        
    return ThermalSimulationResult(
        hourly_hours=list(range(24)),
        hourly_outdoor_temp_c=hourly_t_amb,
        hourly_indoor_temp_c=hourly_indoor_temps,
        hourly_solar_heat_gain_w=hourly_q_gain_sol,
        hourly_conduction_heat_loss_w=hourly_q_loss_cond,
        hourly_infiltration_loss_w=hourly_q_loss_inf,
        hourly_net_heat_flow_w=hourly_q_net,
        peak_indoor_temp_c=peak_in,
        min_indoor_temp_c=min_in,
        avg_indoor_temp_c=avg_in,
        diurnal_temperature_swing_c=swing,
        thermal_comfort_score=comfort_score,
        comfort_category=comfort_category,
        total_daily_solar_energy_captured_kwh=total_sol_kwh,
        total_daily_heat_loss_kwh=total_loss_kwh,
        auxiliary_heating_energy_needed_kwh=aux_heating_needed_kwh,
        envelope_overall_u_value_w_m2k=overall_u_val,
        day_solar_storage_efficiency_pct=day_storage_eff,
        night_thermal_retention_score=night_retention,
        critical_cold_period_hours=critical_cold,
        critical_cold_warning=cold_warning,
        data_method="24-Hour First-Principles Lumped Capacitance RC Dynamic Simulation"
    )
