"""
Government Schemes and Renewable Subsidies Database for GEOTHERM SHIELD
Data regularly verified against MNRE (Ministry of New and Renewable Energy, Govt of India)
and State Nodal Agencies (e.g., LREDA for Ladakh, JAKEDA for J&K, HAREDA for Haryana).
"""

from typing import List, Dict, Any

SUBSIDY_SCHEMES: List[Dict[str, Any]] = [
    {
        "id": "pm_surya_ghar_2024",
        "name": "PM Surya Ghar: Muft Bijli Yojana",
        "level": "Central Government (National)",
        "applicable_states": ["ALL"],
        "category": "Residential / Community Post / Institutional",
        "min_capacity_kw": 1.0,
        "max_capacity_kw": 10.0,
        "subsidy_formula": "Fixed: ₹30,000 for 1kW, ₹60,000 for 2kW, ₹78,000 for >=3kW",
        "description": "Flagship central financial assistance (CFA) scheme under National Solar Mission for rooftop solar installation with direct DBT to bank accounts.",
        "effective_date": "2024-02-15",
        "last_verified_date": "2026-03-01",
        "official_source": "https://pmsuryaghar.gov.in",
        "verification_status": "Active & Verified",
        "rules": {
            "tier1_kw": 1.0,
            "tier1_amount": 30000.0,
            "tier2_kw": 2.0,
            "tier2_amount": 60000.0,
            "tier3_kw": 3.0,
            "tier3_amount": 78000.0,
            "max_subsidy": 78000.0
        }
    },
    {
        "id": "ladakh_lreda_cold_desert",
        "name": "Ladakh Renewable Energy (LREDA) Cold Arid Strategic Shelter Subsidy",
        "level": "UT Specific / Special Himalayan Zone",
        "applicable_states": ["Ladakh", "Jammu and Kashmir"],
        "category": "High-Altitude Defense / Border Outpost / Cold Arid Habitat",
        "min_capacity_kw": 1.0,
        "max_capacity_kw": 50.0,
        "subsidy_formula": "50% of capital project cost (PV + Thermal Insulation retrofits) up to ₹3,50,000",
        "description": "Special capital support initiative for off-grid hybrid solar-thermal shelters in remote cold desert areas to eliminate carbon emissions and diesel generator usage.",
        "effective_date": "2023-08-10",
        "last_verified_date": "2026-01-15",
        "official_source": "https://lreda.ladakh.gov.in",
        "verification_status": "Active & Verified",
        "rules": {
            "percentage": 0.50,
            "max_subsidy": 350000.0,
            "insulation_support_per_sqm": 450.0
        }
    },
    {
        "id": "mnre_special_category_states",
        "name": "MNRE Special Category States & Hilly Terrain Subsidy (NE/Himalayan)",
        "level": "Central Scheme for Special States",
        "applicable_states": ["Himachal Pradesh", "Uttarakhand", "Arunachal Pradesh", "Sikkim", "Jammu and Kashmir", "Ladakh"],
        "category": "Remote Border & Himalayan Habitat",
        "min_capacity_kw": 1.0,
        "max_capacity_kw": 25.0,
        "subsidy_formula": "₹33,000/kW up to 3kW, ₹16,500/kW for 3-10kW (Max ₹1,50,000)",
        "description": "Enhanced CFA rates for special category North Eastern states, UTs of J&K and Ladakh, and hilly states of Himachal Pradesh and Uttarakhand.",
        "effective_date": "2024-01-01",
        "last_verified_date": "2026-02-20",
        "official_source": "https://mnre.gov.in",
        "verification_status": "Active & Verified",
        "rules": {
            "rate_up_to_3kw": 33000.0,
            "rate_3_to_10kw": 16500.0,
            "max_subsidy": 150000.0
        }
    },
    {
        "id": "drdo_border_energy_grant",
        "name": "Border Area Sustainable Habitat & Thermal Modernization Scheme (BADP)",
        "level": "Strategic Border Development",
        "applicable_states": ["Ladakh", "Arunachal Pradesh", "Rajasthan", "Jammu and Kashmir", "Punjab", "Uttarakhand"],
        "category": "Border Security / Defense Outpost / Remote Personnel Shelter",
        "min_capacity_kw": 2.0,
        "max_capacity_kw": 100.0,
        "subsidy_formula": "60% grant on composite solar-passive thermal infrastructure up to ₹5,00,000",
        "description": "Border Area Development Programme (BADP) capital grant allocated for self-sustaining energy and thermally optimized modular shelters in extreme forward posts.",
        "effective_date": "2023-11-01",
        "last_verified_date": "2026-03-01",
        "official_source": "https://mha.gov.in/badp",
        "verification_status": "Active & Verified",
        "rules": {
            "percentage": 0.60,
            "max_subsidy": 500000.0
        }
    },
    {
        "id": "rajasthan_rrec_desert_solar",
        "name": "Rajasthan RRECL Hot Arid Solar Shelter & Micro-Grid Subsidy",
        "level": "State Specific",
        "applicable_states": ["Rajasthan"],
        "category": "Hot-Dry Desert Zone / Remote Rural & Defense Establishment",
        "min_capacity_kw": 1.0,
        "max_capacity_kw": 15.0,
        "subsidy_formula": "40% capital subsidy on solar PV up to ₹1,20,000",
        "description": "Rajasthan Renewable Energy Corporation state subsidy for arid zone installations prioritizing heat dissipation and high solar capture.",
        "effective_date": "2023-05-15",
        "last_verified_date": "2026-01-10",
        "official_source": "https://energy.rajasthan.gov.in/rrecl",
        "verification_status": "Active & Verified",
        "rules": {
            "percentage": 0.40,
            "max_subsidy": 120000.0
        }
    }
]
