# SYSTEM ARCHITECTURE SPECIFICATION
## GEOTHERM SHIELD: Climate-Aware Passive Shelter & Solar Optimization Platform

---

## 1. High-Level Modular Topology

The GeoTherm Shield architecture follows a decoupled, cloud-ready and local-first microservice topology:

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   Next.js 14 App Router (React 18, Tailwind CSS, Three.js, SVG Charts)  |
+--------------------+--------------------------------+-------------------+
                     |                                |
        REST API     | (JSON)            PDF Download | (application/pdf)
                     v                                v
+-------------------------------------------------------------------------+
|                         FASTAPI COMPUTATIONAL CORE                      |
|                                                                         |
|  +---------------------+  +---------------------+  +-----------------+  |
|  |  Climate & GIS Svc  |  |  Solar PV Yield Svc |  |  ReportLab Svc  |  |
|  +---------------------+  +---------------------+  +-----------------+  |
|  +---------------------+  +---------------------+  +-----------------+  |
|  |  Thermal RC Nodal   |  | Pareto Co-Optimizer |  |  Finance & Subs |  |
|  +---------------------+  +---------------------+  +-----------------+  |
+--------------------+--------------------------------+-------------------+
                     |                                |
                     v                                v
+------------------------------------+  +---------------------------------+
|       EXTERNAL WEATHER APIS        |  |        INTERNAL DATABASES       |
|  - Open-Meteo High-Resolution      |  |  - Materials Reference (IS3792) |
|  - NASA POWER Climatology Point    |  |  - Government Subsidies (MNRE)  |
|  (Automatic fallback active)       |  |  - Benchmark Location Reanalysis|
+------------------------------------+  +---------------------------------+
```

---

## 2. Component Subsystems

### A. GIS & Climatology Intelligence Subsystem (`backend/services/climate_service.py`)
- **Query Resolution**: Ingests coordinate tuples $(\text{lat}, \text{lon})$ or location IDs.
- **Elevation Integration**: Computes barometric pressure $P(h) = P_0 (1 - 2.25577 \cdot 10^{-5} h)^{5.25588}$ and adjusted atmospheric density $\rho_{air}(h)$.
- **Diurnal Curve Generation**: Synthesizes 24-hour hourly temperatures $T_{amb}(t)$, direct/diffuse horizontal irradiance $I_{ghi}(t)$, and dominant wind velocities $v_{wind}(t)$.
- **Resilience Strategy**: Executes live HTTP queries with 4.0s timeout; seamlessly falls back to IMD multi-year reanalysis baselines.

### B. Dynamic Thermal Simulation Engine (`backend/services/thermal_service.py`)
- **Model**: Lumped Capacitance / Thermal Resistance-Capacitance (RC) nodal differential equation.
- **Wall Conduction Resistance**: Evaluates multi-layer assemblies including core panels, structural framing, vapor barriers, and interior finishings.
- **Passive Solarium Influx**: Hourly geometric ray tracing on oriented vertical windows ($SHGC \cdot I_{tilt}$).
- **Sol-Air Surface Absorption**: Evaluates sol-air surface temperature $T_{sol-air} = T_{amb} + \frac{\alpha I - \epsilon \Delta R}{h_{out}}$.
- **Cyclic Steady State**: Solves 4 consecutive 24-hour cycles to eliminate transient initial condition bias.

### C. Solar Photovoltaic & Orientation Optimizer (`backend/services/solar_service.py`)
- **Astronomical Geometry**: Solves Cooper solar declination $\delta$, solar hour angle $\omega(t)$, solar zenith $\theta_z$, and surface incidence angle $\theta(\beta, \gamma)$.
- **Isotropic Diffuse Model**: Decomposes global horizontal irradiance into beam on tilt, diffuse sky on tilt, and snow/ground reflected albedo components.
- **Array Layout Engine**: Sizes string capacities, inter-row spacing, and roof zone packing with a 4% realistic shading margin.

### D. Multi-Objective Co-Optimization Engine (`backend/services/optimizer_service.py`)
- **Pareto Trade-Off Space**: Evaluates combinations of azimuth orientation ($\gamma$), insulation thickness ($d_{ins}$), glazing assembly ($U_g, SHGC$), solarium window area ($A_{win}$), and solar capacity ($kW_p$).
- **Objective Function Vector**:
  $$\max \left[ w_1 \cdot \text{TCI} + w_2 \cdot \text{SolarYield} - w_3 \cdot \text{HeatLoss} - w_4 \cdot \text{NetCapEx} \right]$$
- Generates 3 discrete actionable profiles:
  1. *Co-Optimized Strategic Hybrid* (Best Overall Balance)
  2. *Thermal Mass & Cold Resilience Specialist*
  3. *Cost-Optimized High-Yield Renewable Variant*

### E. Financial & Dynamic Subsidy Planner (`backend/services/finance_service.py`)
- **BOM Breakdown**: Categorizes capital costs into Civil Structure, Thermal Insulation, Tier-1 Mono PERC Solar PV, Inverter/BOS, and LiFePO4 Energy Storage.
- **Dynamic Rules Engine**: Matches active schemes from database:
  - *PM Surya Ghar: Muft Bijli Yojana*
  - *Ladakh Renewable Energy (LREDA) Strategic Subsidy*
  - *MNRE Special Category States & Hilly Terrain Subsidy*
  - *Border Area Development Programme (BADP) Strategic Grant*
- **10-Year Life-Cycle Cash Flow**: Computes simple payback period, cumulative net fuel savings vs baseline diesel generator operations, and internal return on investment (ROI).

### F. Automated PDF Dossier Compiler (`backend/services/report_service.py`)
- Uses ReportLab to generate publication-grade technical dossiers with corporate headers, GIS telemetry, architectural specifications, diurnal thermal snapshots, subsidy tables, and statutory engineering notices.
