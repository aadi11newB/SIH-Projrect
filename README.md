# GEOTHERM SHIELD
### Climate-Aware Passive Shelter & Solar Optimization Platform
**SIH Problem Statement SIH26051**: *“Software Based Model Development for Design of Area Specific Shelter for Thermal Comfort Maintenance.”*

---

## 1. Project Overview & Problem Statement
In extreme geographical regions of India—such as the high-altitude cold desert of **Ladakh**, sub-arctic mountainous outposts in **Kargil / Dras**, high-moisture alpine borders in **Arunachal Pradesh**, and scorching arid expanses in **Rajasthan**—maintaining thermal comfort inside human shelters is critical for physiological safety, defense logistics, and operational readiness.

Traditional prefabricated or uninsulated shelters in sub-zero zones (-20°C to -35°C) rely heavily on continuous diesel generators (operating at ₹28–₹35/kWh delivered fuel cost) and kerosene bukharis. This creates severe logistical dependency, fire hazards, high carbon emissions, and rapid nocturnal heat loss during cold hours (02:00–05:00).

**GeoTherm Shield** is a production-quality scientific software platform that combines GIS geographical intelligence, solar geometric modeling, first-principles 24-hour dynamic thermal simulation (RC network), multi-objective Pareto optimization, and real-time government subsidy matching (PM Surya Ghar, LREDA, MNRE) to engineer site-specific, net-zero capable shelters.

---

## 2. Key System Architecture & Technologies

### Frontend
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling & Theme**: Tailwind CSS with dark-mode defense telemetry aesthetic
- **3D Visualization**: Lightweight Three.js canvas for parametric shelter orientation, roof pitch, and solar array preview
- **GIS Mapping**: Tactical MapLibre/OpenStreetMap multi-layer cartography with coordinate picking and solar/thermal heatmaps
- **Charts & Telemetry**: SVG vector charts for 24-hour diurnal temperatures, solar flux, and 12-month PV harvest curves

### Backend Computational Core
- **Framework**: Python FastAPI + Pydantic v2
- **Scientific Computing**: NumPy, SciPy (Euler dynamic ODE solver, Pareto multi-objective search)
- **Reporting**: ReportLab automated PDF generator producing publication-grade technical dossiers
- **Meteorological Service**: Live Open-Meteo & NASA POWER API client with instant calibrated fallback to regional IMD baselines

---

## 3. Core Scientific Simulation Methodology

### A. 24-Hour Dynamic Thermal Simulation (RC Network)
The internal temperature state $T_{in}(t)$ is governed by the dynamic lumped thermal capacitance equation:

$$C_{total} \frac{dT_{in}}{dt} = \sum U_i A_i (T_{amb}(t) - T_{in}(t)) + H_{inf} (T_{amb}(t) - T_{in}(t)) + \dot{Q}_{sol,win}(t) + \dot{Q}_{sol,wall}(t) + \dot{Q}_{int}$$

Where:
- **Envelope U-Values ($U_i$)**: Synthesized from multi-layer conduction resistances ($R_{si} + \frac{d_{core}}{k_{core}} + \frac{d_{ins}}{k_{ins}} + R_{se}$) compliant with **IS 3792** and **NBC 2016**.
- **Solarium Passive Aperture ($\dot{Q}_{sol,win}$)**: Computed using isotropic diffuse transposition of direct beam and diffuse solar irradiance across 4 vertical facades and tilted roof.
- **Participating Thermal Mass ($C_{total}$)**: Accounts for concrete foundation slabs, inner wall mass participation, and air heat capacity.
- **Integration**: Solved using fine sub-minute time steps ($\Delta t = 60\text{s}$) over 4 consecutive 24-hour diurnal cycles to reach periodic steady-state equilibrium.

### B. Solar Potential & Photovoltaic Yield Modeling
- **Optimal Tilt ($\beta_{opt}$)**: Automatically computed based on latitude with winter snow-shedding bias for high-altitude zones ($\beta = \text{Lat} + 5^\circ$ to $10^\circ$).
- **PV Array String Yield**: Temperature derated with standard inverter, cabling, and soiling losses (18% BOS margin).

### C. Solar + Thermal Co-Optimization (Elite Feature)
Rather than sizing solar and insulation independently, the Pareto solver co-optimizes building orientation azimuth, insulation thickness (2–25 cm), South solarium window area, and rooftop PV array capacity to maximize composite comfort while minimizing life-cycle capital and operating expenditure.

---

## 4. Repository Structure

```
.
├── backend/
│   ├── api/
│   │   └── routes/
│   ├── database/
│   │   ├── locations_data.py   # Benchmark meteorological datasets (Leh, Srinagar, Delhi, Pune, Jaisalmer, Dras)
│   │   ├── materials_data.py   # Certified thermal properties (PUF, XPS, Rockwool, Trombe Rammed Earth, Triple Low-E)
│   │   └── subsidies_data.py   # Government renewable schemes (PM Surya Ghar, LREDA, MNRE, BADP)
│   ├── models/
│   │   └── schemas.py          # Pydantic v2 typed request/response models
│   ├── services/
│   │   ├── climate_service.py  # Live weather fetching + fallback
│   │   ├── solar_service.py    # Geometric transposition & PV yield
│   │   ├── thermal_service.py  # 24-Hour dynamic lumped capacitance solver
│   │   ├── optimizer_service.py# Multi-objective Pareto co-optimizer
│   │   ├── finance_service.py  # Capital BOM, subsidies, 10-year cash flow
│   │   └── report_service.py   # ReportLab PDF generator
│   ├── tests/
│   │   └── test_computational_core.py # Pytest test suites (All passing)
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── globals.css         # Tactical defense aesthetic & grid shaders
│   │   ├── layout.tsx
│   │   ├── page.tsx            # High-impact Landing Page
│   │   └── dashboard/
│   │       └── page.tsx        # Unified Engineering Decision Platform
│   ├── components/
│   │   ├── gis/                # MapLibre/OSM map & Site Ranking
│   │   ├── solar/              # Potential scorecard, layout grid & monthly chart
│   │   ├── shelter/            # Three.js 3D model & parametric form
│   │   ├── thermal/            # 24h diurnal graph & Day/Night analysis
│   │   ├── optimizer/          # Co-optimization card & Top 3 variants
│   │   ├── whatif/             # Real-time instant recalculation simulator
│   │   ├── finance/            # Subsidies matching & 10-year ROI
│   │   └── comparison/         # Design comparison studio
│   ├── lib/
│   │   ├── api.ts              # Resilient client with automatic fallback
│   │   ├── demo_data.ts        # Offline benchmark profiles
│   │   └── types.ts            # TypeScript definitions
│   └── package.json
├── .env.example
├── ARCHITECTURE.md
├── DATA_SOURCES.md
├── DEMO_GUIDE.md
└── README.md
```

---

## 5. Quickstart & Installation

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: 18+ (tested on Node v22.14.0, npm 10.9.2)

### Step 1: Start Backend Server
```bash
# In project root
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at `http://127.0.0.1:8000/docs`.

### Step 2: Start Frontend Web Application
```bash
# In frontend directory
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 6. Running Unit Tests
```bash
# Run backend computational verification suite
python -m pytest backend/tests/test_computational_core.py -v
```
Output: `6 passed in < 1s`.

---

## 7. Official Engineering Disclaimer
*GeoTherm Shield provides software-derived preliminary engineering simulations based on physical heat transfer principles, astronomical solar geometry, and verified government subsidy policies. All ratings and financial forecasts are comparative estimates and must be validated by qualified structural, electrical, and HVAC engineers prior to procurement or deployment.*
