"""
Thermal Materials Reference Database for GEOTHERM SHIELD
Data verified against IS 3792 (Code of practice for design and construction of cold storage)
and NBC 2016 (National Building Code of India) Part 8 Building Services, Section 3 Thermal Comfort.
"""

from typing import Dict, Any

WALL_MATERIALS: Dict[str, Dict[str, Any]] = {
    "insulated_composite_panel": {
        "name": "Insulated Composite Panel (PUF Core)",
        "conductivity": 0.024,  # W/m·K
        "density": 42.0,        # kg/m³
        "specific_heat": 1450.0,# J/kg·K
        "default_thickness": 0.10, # 100mm
        "cost_per_sqm": 1850.0, # INR/m²
        "emissivity": 0.85,
        "solar_absorptance": 0.40,
        "category": "High-Efficiency Prefab",
        "description": "Polyurethane foam core with pre-painted galvanized steel skins. Ideal for extreme cold / high altitude defense shelters."
    },
    "aerated_autoclaved_concrete": {
        "name": "Autoclaved Aerated Concrete (AAC Block)",
        "conductivity": 0.16,
        "density": 550.0,
        "specific_heat": 1000.0,
        "default_thickness": 0.20,
        "cost_per_sqm": 1200.0,
        "emissivity": 0.90,
        "solar_absorptance": 0.65,
        "category": "Masonry",
        "description": "Lightweight cellular concrete with high thermal resistance and moderate thermal mass."
    },
    "rammed_earth_stabilized": {
        "name": "Stabilized Rammed Earth (Trombe-ready)",
        "conductivity": 0.75,
        "density": 1900.0,
        "specific_heat": 1260.0,
        "default_thickness": 0.35,
        "cost_per_sqm": 950.0,
        "emissivity": 0.92,
        "solar_absorptance": 0.75,
        "category": "Vernacular / High Thermal Mass",
        "description": "Traditional high thermal-mass walling suitable for passive solar heating in Ladakh & cold arid regions."
    },
    "standard_brick_masonry": {
        "name": "Standard Burnt Clay Brick Masonry",
        "conductivity": 0.81,
        "density": 1800.0,
        "specific_heat": 880.0,
        "default_thickness": 0.23,
        "cost_per_sqm": 1400.0,
        "emissivity": 0.90,
        "solar_absorptance": 0.70,
        "category": "Conventional Masonry",
        "description": "Standard 230mm brick wall with cement plaster on both sides."
    },
    "timber_log_insulated": {
        "name": "Insulated Timber Frame with Wood Cladding",
        "conductivity": 0.13,
        "density": 500.0,
        "specific_heat": 1600.0,
        "default_thickness": 0.15,
        "cost_per_sqm": 2400.0,
        "emissivity": 0.88,
        "solar_absorptance": 0.55,
        "category": "Timber / Bio-Composite",
        "description": "Treated structural timber frame with natural low thermal bridging."
    },
    "reinforced_concrete": {
        "name": "Reinforced Cement Concrete (RCC)",
        "conductivity": 1.74,
        "density": 2400.0,
        "specific_heat": 920.0,
        "default_thickness": 0.15,
        "cost_per_sqm": 1600.0,
        "emissivity": 0.90,
        "solar_absorptance": 0.70,
        "category": "Structural Concrete",
        "description": "Standard structural RCC wall. Requires dedicated insulation layer in severe climates."
    }
}

INSULATION_MATERIALS: Dict[str, Dict[str, Any]] = {
    "rockwool": {
        "name": "High-Density Rockwool / Mineral Wool",
        "conductivity": 0.034,
        "density": 80.0,
        "specific_heat": 840.0,
        "default_thickness": 0.075,
        "cost_per_sqm": 650.0,
        "fire_rating": "Class A1 Non-combustible",
        "description": "Non-combustible stone wool insulation with superior acoustic and thermal properties."
    },
    "extruded_polystyrene_xps": {
        "name": "Extruded Polystyrene (XPS)",
        "conductivity": 0.028,
        "density": 35.0,
        "specific_heat": 1450.0,
        "default_thickness": 0.05,
        "cost_per_sqm": 720.0,
        "fire_rating": "Self-extinguishing Class B1",
        "description": "Moisture-resistant closed cell insulation, ideal for perimeter, sub-slab, and sub-zero exterior envelopes."
    },
    "expanded_polystyrene_eps": {
        "name": "Expanded Polystyrene (EPS)",
        "conductivity": 0.038,
        "density": 20.0,
        "specific_heat": 1300.0,
        "default_thickness": 0.05,
        "cost_per_sqm": 380.0,
        "fire_rating": "Class B2",
        "description": "Cost-effective lightweight rigid foam insulation."
    },
    "aerogel_blanket": {
        "name": "Silica Aerogel Thermal Blanket",
        "conductivity": 0.015,
        "density": 150.0,
        "specific_heat": 1000.0,
        "default_thickness": 0.02,
        "cost_per_sqm": 3200.0,
        "fire_rating": "Class A1 Non-combustible",
        "description": "Ultra-thin high-performance nano-porous insulation for extreme weight/space-constrained tactical shelters."
    },
    "sheep_wool_natural": {
        "name": "Treated Himalayan Sheep Wool",
        "conductivity": 0.039,
        "density": 25.0,
        "specific_heat": 1800.0,
        "default_thickness": 0.08,
        "cost_per_sqm": 580.0,
        "fire_rating": "Naturally Flame Retardant",
        "description": "Locally sourceable bio-insulation with natural humidity buffering."
    }
}

ROOF_MATERIALS: Dict[str, Dict[str, Any]] = {
    "insulated_standing_seam": {
        "name": "Insulated Standing Seam Metal Roof (100mm PUF)",
        "conductivity": 0.024,
        "density": 45.0,
        "specific_heat": 1400.0,
        "default_thickness": 0.10,
        "cost_per_sqm": 2100.0,
        "emissivity": 0.82,
        "solar_absorptance": 0.45,
        "solar_pv_friendly": True,
        "description": "Leak-proof standing seam steel roof with integrated continuous insulation and PV mounting clamps."
    },
    "timber_green_roof": {
        "name": "Extensive Green Roof on Timber Deck",
        "conductivity": 0.35,
        "density": 1200.0,
        "specific_heat": 1500.0,
        "default_thickness": 0.20,
        "cost_per_sqm": 2800.0,
        "emissivity": 0.95,
        "solar_absorptance": 0.70,
        "solar_pv_friendly": False,
        "description": "Vegetative roof layer providing massive evaporative cooling in summer and thermal damping in winter."
    },
    "corrugated_galvanized_uninsulated": {
        "name": "Corrugated Galvanized Iron (CGI) Sheet (Uninsulated)",
        "conductivity": 45.0,
        "density": 7800.0,
        "specific_heat": 480.0,
        "default_thickness": 0.001,
        "cost_per_sqm": 450.0,
        "emissivity": 0.25,
        "solar_absorptance": 0.65,
        "solar_pv_friendly": True,
        "description": "Low-cost uninsulated corrugated sheet. Poor thermal performance without secondary insulation."
    },
    "rcc_slab_insulated": {
        "name": "RCC Roof Slab (150mm) with 50mm XPS & Screed",
        "conductivity": 0.038,
        "density": 1600.0,
        "specific_heat": 1050.0,
        "default_thickness": 0.22,
        "cost_per_sqm": 2200.0,
        "emissivity": 0.90,
        "solar_absorptance": 0.60,
        "solar_pv_friendly": True,
        "description": "Heavy concrete roof slab with over-deck XPS insulation and waterproof screed."
    }
}

GLAZING_MATERIALS: Dict[str, Dict[str, Any]] = {
    "triple_low_e_argon": {
        "name": "Triple Glazed Low-E Argon Filled (4-12-4-12-4)",
        "u_value": 0.8,  # W/m²·K
        "shgc": 0.50,    # Solar Heat Gain Coefficient
        "vlt": 0.65,     # Visible Light Transmittance
        "cost_per_sqm": 4800.0,
        "description": "Highest efficiency thermal envelope glazing for severe sub-zero environments like Ladakh."
    },
    "double_low_e_air": {
        "name": "Double Glazed Low-E (6-12-6 Air)",
        "u_value": 1.6,
        "shgc": 0.58,
        "vlt": 0.72,
        "cost_per_sqm": 2600.0,
        "description": "Standard energy-efficient double glazing with low-emissivity coating."
    },
    "double_clear_air": {
        "name": "Double Glazed Clear (6-12-6 Air)",
        "u_value": 2.8,
        "shgc": 0.76,
        "vlt": 0.81,
        "cost_per_sqm": 1800.0,
        "description": "Clear double glazing allowing high passive solar gain."
    },
    "single_clear": {
        "name": "Single Clear Glass (4mm)",
        "u_value": 5.8,
        "shgc": 0.86,
        "vlt": 0.89,
        "cost_per_sqm": 750.0,
        "description": "Standard single-pane glass. High heat loss, unsuited for extreme cold without thermal shutters."
    }
}
