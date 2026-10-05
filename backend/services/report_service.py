"""
Engineering PDF Report Generator for GEOTHERM SHIELD
Generates publication-quality technical dossier using ReportLab.
"""

import io
from datetime import datetime
from typing import Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from backend.models.schemas import ReportGenerationRequest

def generate_pdf_report(req: ReportGenerationRequest) -> bytes:
    """
    Generate comprehensive engineering PDF report.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    header_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0f172a"),
        alignment=TA_CENTER
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0d9488"),
        alignment=TA_CENTER
    )
    section_heading = ParagraphStyle(
        'SecHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0f766e"),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )
    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#64748b")
    )
    alert_style = ParagraphStyle(
        'AlertText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#b45309")
    )
    
    elements = []
    
    # Header Banner
    elements.append(Paragraph("GEOTHERM SHIELD", header_title_style))
    elements.append(Paragraph("Climate-Aware Passive Shelter & Solar Optimization Platform | SIH26051", subtitle_style))
    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0d9488"), spaceAfter=10))
    
    # Metadata Box
    date_str = datetime.now().strftime("%d-%b-%Y %H:%M UTC")
    proj_name = req.user_project_name or "Tactical Habitat Engineering Study"
    meta_table_data = [
        [
            Paragraph(f"<b>Project:</b> {proj_name}", body_style),
            Paragraph(f"<b>Target Location:</b> {req.location_profile.name}", body_style)
        ],
        [
            Paragraph(f"<b>Engineering Author:</b> {req.author_name or 'Defense Infrastructure Cell'}", body_style),
            Paragraph(f"<b>Generated:</b> {date_str}", meta_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[260, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 10))
    
    # 1. Executive Summary & Top Scores
    elements.append(Paragraph("1. EXECUTIVE TELEMETRY & SCORECARD", section_heading))
    
    t_score = req.simulation_result.thermal_comfort_score
    s_score = req.solar_result.solar_potential_score
    overall = int((t_score + s_score) / 2)
    
    score_data = [
        ["THERMAL COMFORT INDEX", "SOLAR POTENTIAL SCORE", "OVERALL COMPOSITE SCORE", "ESTIMATED NET COST"],
        [f"{t_score} / 100", f"{s_score} / 100", f"{overall} / 100", f"₹{int(req.financial_result.estimated_net_cost_inr):,}"],
        [
            f"Indoor Min: {req.simulation_result.min_indoor_temp_c}°C",
            f"Capacity: {req.solar_result.installed_capacity_kw} kWp",
            f"Comfort: {req.simulation_result.comfort_category}",
            f"Subsidy: ₹{int(req.financial_result.total_applicable_subsidy_inr):,}"
        ]
    ]
    score_table = Table(score_data, colWidths=[130, 130, 130, 130])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f766e")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#f0fdfa")),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,1), (-1,1), 13),
        ('TEXTCOLOR', (0,1), (-1,1), colors.HexColor("#0f172a")),
        ('FONTSIZE', (0,2), (-1,2), 7.5),
        ('TEXTCOLOR', (0,2), (-1,2), colors.HexColor("#475569")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0d9488")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#ccfbf1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(score_table)
    elements.append(Spacer(1, 10))
    
    # 2. GIS & Meteorological Profile
    elements.append(Paragraph("2. GEOGRAPHICAL & CLIMATOLOGICAL INTELLIGENCE", section_heading))
    loc = req.location_profile
    climate_data = [
        ["Parameter", "Observed Value", "Parameter", "Observed Value"],
        ["Latitude / Longitude", f"{loc.latitude:.3f}° N, {loc.longitude:.3f}° E", "Elevation MSL", f"{loc.elevation_m:.0f} m"],
        ["Climate Classification", loc.climate_zone, "Köppen Code", loc.koppen_code],
        ["Annual Solar GHI", f"{loc.annual_solar_ghi_kwh_m2} kWh/m²", "Sunshine Hours", f"{loc.avg_daily_sunshine_hours} hrs/day"],
        ["Winter Minimum Ambient", f"{loc.winter_min_temp_c} °C", "Summer Maximum Ambient", f"{loc.summer_max_temp_c} °C"],
        ["Atmospheric Pressure", f"{loc.atmospheric_pressure_kpa} kPa", "Dominant Wind Speed", f"{loc.avg_wind_speed_ms} m/s"]
    ]
    climate_table = Table(climate_data, colWidths=[130, 130, 130, 130])
    climate_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(climate_table)
    elements.append(Spacer(1, 10))
    
    # 3. Shelter Specification & Envelope Architecture
    elements.append(Paragraph("3. SHELTER ARCHITECTURE & THERMAL ENVELOPE", section_heading))
    g = req.geometry
    m = req.materials
    op = req.openings
    
    arch_data = [
        ["Component", "Specification", "Thermal / Geometric Property"],
        ["Footprint Dimensions", f"{g.length}m (L) x {g.width}m (W) x {g.height}m (H)", f"Internal Volume: {g.length*g.width*g.height:.1f} m³"],
        ["Orientation Azimuth", f"{g.orientation_azimuth}° (True South Alignment)", "Optimized for winter passive gain"],
        ["Wall Construction", m.wall_material_id.replace('_', ' ').title(), f"Thickness: {m.wall_thickness_m*100:.0f} cm"],
        ["Secondary Insulation", f"{m.insulation_material_id.replace('_', ' ').title()}", f"Insulation Core: {m.insulation_thickness_m*100:.0f} cm"],
        ["Roof Assembly", m.roof_material_id.replace('_', ' ').title(), f"Tilt Angle: {g.roof_angle}° ({g.roof_type.upper()})"],
        ["Glazing Assembly", m.glazing_type_id.replace('_', ' ').title(), f"South Window Area: {op.south_window_area_sqm} m²"],
        ["Airtightness / Infiltration", f"{op.infiltration_ach} ACH", f"Overall Envelope U-value: {req.simulation_result.envelope_overall_u_value_w_m2k} W/m²K"]
    ]
    arch_table = Table(arch_data, colWidths=[120, 200, 200])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(arch_table)
    elements.append(Spacer(1, 10))
    
    # 4. Thermal Simulation Results (24-Hour Diurnal Performance)
    elements.append(Paragraph("4. 24-HOUR DYNAMIC THERMAL SIMULATION & COMFORT", section_heading))
    sim = req.simulation_result
    
    # Sample hourly snapshot table (every 4 hours)
    sim_snap_data = [
        ["Hour (24h)", "Outdoor Temp (°C)", "Indoor Temp (°C)", "Solar Gain (W)", "Heat Loss (W)", "Status"]
    ]
    for h in [0, 4, 8, 12, 16, 20]:
        t_out = sim.hourly_outdoor_temp_c[h]
        t_in = sim.hourly_indoor_temp_c[h]
        q_sol = sim.hourly_solar_heat_gain_w[h]
        q_loss = sim.hourly_conduction_heat_loss_w[h] + sim.hourly_infiltration_loss_w[h]
        status = "Comfort" if t_in >= 16 else ("Caution" if t_in >= 10 else "Cold Risk")
        sim_snap_data.append([
            f"{h:02d}:00", f"{t_out:+.1f}", f"{t_in:+.1f}", f"{q_sol:.0f}", f"{q_loss:.0f}", status
        ])
        
    sim_table = Table(sim_snap_data, colWidths=[70, 90, 90, 90, 90, 90])
    sim_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f766e")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7.5),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(sim_table)
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(f"<b>Day/Night Thermal Diagnostic:</b> {sim.critical_cold_warning}", alert_style))
    elements.append(Spacer(1, 10))
    
    # 5. Solar PV Estimation & Financial Subsidy Breakdown
    elements.append(Paragraph("5. SOLAR PV YIELD & GOVERNMENT SUBSIDY PLANNER", section_heading))
    sol = req.solar_result
    fin = req.financial_result
    
    fin_data = [
        ["Line Item / Metric", "Amount / Value", "Notes & Source"],
        ["Installed Solar Capacity", f"{sol.installed_capacity_kw} kWp ({sol.number_of_panels} Panels)", f"Annual Yield: {sol.estimated_annual_generation_kwh:,.0f} kWh/yr"],
        ["Civil Foundation & Structural Frame", f"₹{fin.civil_shelter_cost_inr:,.0f}", "Engineered base structure"],
        ["Thermal Envelope & Insulation System", f"₹{fin.insulation_thermal_envelope_cost_inr:,.0f}", "High-R continuous vapor-sealed envelope"],
        ["Solar PV Array + Inverter & BOS", f"₹{fin.solar_pv_modules_cost_inr + fin.inverter_bos_cost_inr:,.0f}", "Tier-1 Mono PERC + MPPT PCU"],
        ["Battery Energy Storage (LiFePO4)", f"₹{fin.battery_storage_cost_inr:,.0f}", "Off-grid defense reserve capacity"],
        ["Total Gross Capital Cost", f"₹{fin.total_gross_project_cost_inr:,.0f}", "Before subsidies"],
        ["Applicable Government Subsidies", f"- ₹{fin.total_applicable_subsidy_inr:,.0f}", "Matched from National & State database"],
        ["Estimated Net Project Cost", f"₹{fin.estimated_net_cost_inr:,.0f}", "Final capital requirement"],
        ["Annual Operational Savings", f"₹{fin.annual_net_savings_inr:,.0f} / yr", f"Simple Payback: {fin.simple_payback_period_years} Years"],
        ["10-Year Cumulative Net Savings", f"₹{fin.ten_year_cumulative_savings_inr:,.0f}", f"Projected 10-Yr ROI: {fin.roi_percentage}%"]
    ]
    fin_table = Table(fin_data, colWidths=[180, 120, 220])
    fin_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('FONTNAME', (0,7), (1,7), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1,6), (1,6), colors.HexColor("#0f766e")),
        ('TEXTCOLOR', (1,7), (1,7), colors.HexColor("#1e3a8a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(fin_table)
    elements.append(Spacer(1, 10))
    
    # 6. Engineering Disclaimer
    elements.append(Paragraph("6. STATUTORY & ENGINEERING DISCLAIMERS", section_heading))
    disclaimer_text = (
        "<b>Notice:</b> This technical document contains software-derived preliminary simulations based on first-principles "
        "heat transfer, solar geometry transpositions, and government subsidy policies active as of the generation date. "
        "All thermal ratings, energy yield forecasts, and financial estimates are comparative and must be validated by licensed "
        "structural and electrical engineers before procurement, fabrication, or real-world defense outpost deployment."
    )
    elements.append(Paragraph(disclaimer_text, meta_style))
    
    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
