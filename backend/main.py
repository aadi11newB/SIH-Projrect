"""
GEOTHERM SHIELD Backend API Server
FastAPI application providing scientific GIS, climate intelligence, thermal simulation,
solar PV yield modeling, multi-objective co-optimization, subsidy matching, and PDF generation.
"""

from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

from backend.database.materials_data import WALL_MATERIALS, INSULATION_MATERIALS, ROOF_MATERIALS, GLAZING_MATERIALS
from backend.database.subsidies_data import SUBSIDY_SCHEMES
from backend.database.locations_data import BENCHMARK_LOCATIONS, get_location_by_coords_or_id
from backend.models.schemas import (
    LocationProfile, HourlyClimateData, ClimateQuery,
    ThermalSimulationRequest, ThermalSimulationResult,
    SolarEstimateRequest, SolarEstimateResult,
    OptimizerRequest, CoOptimizationResult,
    FinancialCalculationRequest, FinancialCalculationResult,
    RankedSite, ReportGenerationRequest
)
from backend.services.climate_service import fetch_climate_profile, get_hourly_climate
from backend.services.solar_service import estimate_solar_yield
from backend.services.thermal_service import simulate_shelter_thermal
from backend.services.optimizer_service import run_co_optimization
from backend.services.finance_service import calculate_project_finances
from backend.services.report_service import generate_pdf_report

app = FastAPI(
    title="GEOTHERM SHIELD API",
    description="Scientific Engine for Climate-Aware Passive Shelter & Solar Optimization (SIH26051)",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "GEOTHERM SHIELD Computational Core",
        "version": "1.0.0",
        "supported_locations": list(BENCHMARK_LOCATIONS.keys())
    }

@app.get("/api/climate", response_model=LocationProfile)
async def get_climate_data(
    latitude: float = Query(34.1526, ge=-90.0, le=90.0),
    longitude: float = Query(77.5771, ge=-180.0, le=180.0),
    location_id: Optional[str] = Query(None)
):
    """Fetch climate intelligence and terrain characteristics for coordinates."""
    return await fetch_climate_profile(latitude=latitude, longitude=longitude, location_id=location_id)

@app.get("/api/climate/hourly", response_model=HourlyClimateData)
def get_hourly_climate_data(
    latitude: float = Query(34.1526),
    longitude: float = Query(77.5771),
    location_id: Optional[str] = Query(None),
    season: str = Query("winter")
):
    """Fetch 24-hour diurnal ambient temperatures and solar GHI."""
    return get_hourly_climate(latitude=latitude, longitude=longitude, location_id=location_id, season=season)

@app.get("/api/solar/potential")
def get_solar_potential(
    latitude: float = Query(34.1526),
    longitude: float = Query(77.5771),
    location_id: Optional[str] = Query(None)
):
    """Get quick location solar potential score and irradiance baseline."""
    loc = get_location_by_coords_or_id(location_id=location_id, lat=latitude, lon=longitude)
    return {
        "location_name": loc["name"],
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "annual_solar_ghi_kwh_m2": loc["annual_solar_ghi_kwh_m2"],
        "avg_daily_sunshine_hours": loc["avg_daily_sunshine_hours"],
        "solar_potential_score": loc["solar_potential_score"],
        "recommended_tilt_deg": round(loc["latitude"] + 5.0, 1),
        "recommended_orientation": "South-Facing (180° Azimuth)"
    }

@app.post("/api/solar/estimate", response_model=SolarEstimateResult)
def estimate_solar(req: SolarEstimateRequest):
    """Calculate detailed solar PV layout packing, tilt gain, and 12-month generation."""
    return estimate_solar_yield(req)

@app.post("/api/thermal/simulate", response_model=ThermalSimulationResult)
def simulate_thermal(req: ThermalSimulationRequest):
    """Execute 24-hour dynamic RC lumped capacitance thermal simulation."""
    return simulate_shelter_thermal(req)

@app.post("/api/optimizer/run", response_model=CoOptimizationResult)
def optimize_shelter(req: OptimizerRequest):
    """Execute multi-objective solar + thermal co-optimization."""
    return run_co_optimization(req)

@app.post("/api/financial/calculate", response_model=FinancialCalculationResult)
def calculate_financials(req: FinancialCalculationRequest):
    """Calculate capital cost, dynamic subsidy entitlement, and 10-year financial projection."""
    return calculate_project_finances(req)

@app.get("/api/materials")
def get_materials_catalog():
    """Retrieve catalog of verified building envelope materials."""
    return {
        "wall_materials": WALL_MATERIALS,
        "insulation_materials": INSULATION_MATERIALS,
        "roof_materials": ROOF_MATERIALS,
        "glazing_materials": GLAZING_MATERIALS
    }

@app.get("/api/subsidies")
def get_subsidies_catalog():
    """Retrieve verified government schemes and subsidy rules."""
    return {
        "schemes": SUBSIDY_SCHEMES,
        "count": len(SUBSIDY_SCHEMES)
    }

@app.get("/api/locations/rank", response_model=List[RankedSite])
def rank_candidate_locations():
    """Rank benchmark geographic locations for strategic shelter and solar feasibility."""
    ranked: List[RankedSite] = []
    
    for loc_id, loc in BENCHMARK_LOCATIONS.items():
        s_score = loc["solar_potential_score"]
        t_score = loc["shelter_suitability_score"]
        feasibility = 85 if loc["elevation_m"] < 3000 else 78
        composite = int(s_score * 0.40 + t_score * 0.40 + feasibility * 0.20)
        
        ranked.append(RankedSite(
            rank=1,
            id=loc["id"],
            name=loc["name"],
            state=loc["state"],
            latitude=loc["latitude"],
            longitude=loc["longitude"],
            elevation_m=loc["elevation_m"],
            solar_potential_score=s_score,
            thermal_suitability_score=t_score,
            installation_feasibility_score=feasibility,
            composite_site_score=composite,
            annual_ghi_kwh_m2=loc["annual_solar_ghi_kwh_m2"],
            winter_min_temp_c=loc["winter_min_temp_c"],
            feasibility_notes=f"{loc['climate_zone']} — {loc['recommended_passive_strategy'][:80]}..."
        ))
        
    ranked.sort(key=lambda x: x.composite_site_score, reverse=True)
    for idx, r in enumerate(ranked):
        r.rank = idx + 1
        
    return ranked

@app.post("/api/reports/generate")
def generate_report(req: ReportGenerationRequest):
    """Generate engineering PDF report and return as downloadable byte stream."""
    pdf_bytes = generate_pdf_report(req)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=GeoTherm_Shield_Report_{req.location_profile.id}.pdf"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
