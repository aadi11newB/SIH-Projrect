# DATA SOURCES & METEOROLOGICAL STANDARDS
## GEOTHERM SHIELD: Climate-Aware Passive Shelter & Solar Optimization Platform

---

## 1. Meteorological & GIS Data Sources

| Provider | Data Extracted | Access Method | Fallback Strategy |
|---|---|---|---|
| **Open-Meteo API** | Global GFS/ECMWF numerical weather models, elevation, surface pressure, ambient temperature, wind speeds. | Live REST API (`https://api.open-meteo.com/v1/forecast`) | In-memory cached reference datasets calibrated to IMD 30-year normals. |
| **NASA POWER** | Surface meteorology and Solar Energy (SSE) global dataset, direct normal irradiance (DNI), global horizontal irradiance (GHI). | Live REST API (`https://power.larc.nasa.gov/api`) | Regional benchmark dataset with annual solar averages. |
| **India Meteorological Department (IMD)** | Multi-year climate normals for Leh, Srinagar, Delhi, Pune, Jaisalmer, Dras, and Tawang. | Calibrated static database (`backend/database/locations_data.py`) | Always available offline in Demo Mode. |
| **OpenStreetMap Cartography** | Base cartographic boundaries, terrain contour lines, topography. | Vector/Raster map tile integration | Lightweight SVG topographic contour mesh. |

---

## 2. Thermal Envelope Material Standards

All physical thermal conductivity ($k$), density ($\rho$), and specific heat ($c_p$) parameters are benchmarked against:
1. **IS 3792: 1978** — *Code of practice for design and construction of cold storage.*
2. **NBC 2016** — *National Building Code of India, Part 8: Building Services, Section 3: Thermal Comfort.*
3. **ISO 6946: 2017** — *Building components and building elements — Thermal resistance and thermal transmittance — Calculation methods.*

| Material Name | Thermal Conductivity $k$ (W/m·K) | Density $\rho$ (kg/m³) | Specific Heat $c_p$ (J/kg·K) | Default Thickness |
|---|---|---|---|---|
| **Insulated Composite Panel (PUF Core)** | 0.024 | 42.0 | 1450.0 | 100 mm |
| **High-Density Rockwool Insulation** | 0.034 | 80.0 | 840.0 | 80 mm |
| **Extruded Polystyrene (XPS Closed Cell)** | 0.028 | 35.0 | 1450.0 | 50 mm |
| **Stabilized Rammed Earth (Trombe Core)** | 0.750 | 1900.0 | 1260.0 | 350 mm |
| **Autoclaved Aerated Concrete (AAC)** | 0.160 | 550.0 | 1000.0 | 200 mm |
| **Silica Aerogel Thermal Blanket** | 0.015 | 150.0 | 1000.0 | 20 mm |
| **Triple Glazed Low-E Argon Window** | $U = 0.80\text{ W/m}^2\text{K}$ | $SHGC = 0.50$ | $VLT = 0.65$ | 4-12-4-12-4 mm |

---

## 3. Government Subsidy & Policy Database

All subsidy rules and capital grants are verified against official government directives:

1. **PM Surya Ghar: Muft Bijli Yojana (2024)**
   - *Authority*: Ministry of New and Renewable Energy (MNRE), Govt of India.
   - *Official Portal*: [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in)
   - *Rules*: Fixed ₹30,000 for 1 kW, ₹60,000 for 2 kW, ₹78,000 for $\ge 3$ kW.

2. **Ladakh Renewable Energy (LREDA) Cold Arid Strategic Shelter Subsidy**
   - *Authority*: Ladakh Renewable Energy Development Agency (UT Ladakh).
   - *Official Portal*: [https://lreda.ladakh.gov.in](https://lreda.ladakh.gov.in)
   - *Rules*: 50% capital grant up to ₹3,50,000 on composite solar-passive thermal infrastructure.

3. **MNRE Special Category & Hilly Terrain Subsidy**
   - *Authority*: MNRE (NE & Himalayan States).
   - *Rules*: ₹33,000/kW up to 3 kW, ₹16,500/kW for 3–10 kW (Max ₹1,50,000).

4. **Border Area Development Programme (BADP) Strategic Defense Grant**
   - *Authority*: Ministry of Home Affairs / Department of Border Management.
   - *Rules*: 60% capital grant up to ₹5,00,000 on off-grid renewable shelters in forward posts.
