'use client';

import React from 'react';
import { DollarSign, Building, ExternalLink, ShieldAlert, CheckCircle2, Award, FileText } from 'lucide-react';
import { FinancialCalculationResult } from '@/lib/types';

interface SubsidyPlannerProps {
  financialResult: FinancialCalculationResult;
  selectedState: string;
}

export const SubsidyPlanner: React.FC<SubsidyPlannerProps> = ({
  financialResult,
  selectedState,
}) => {
  return (
    <div className="tactical-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            GOVERNMENT SCHEMES & RENEWABLE SUBSIDY PLANNER
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
          Target State: {selectedState}
        </span>
      </div>

      {/* 3 Top Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">TOTAL GROSS PROJECT CAPEX</div>
          <div className="text-2xl font-black text-slate-100 my-1">
            ₹{financialResult.total_gross_project_cost_inr.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Civil + Thermal + Solar + Battery</div>
        </div>

        <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/40 text-center">
          <div className="text-[10px] text-teal-300 uppercase tracking-wider">TOTAL APPLICABLE SUBSIDIES/GRANTS</div>
          <div className="text-2xl font-black text-teal-300 my-1">
            - ₹{financialResult.total_applicable_subsidy_inr.toLocaleString()}
          </div>
          <div className="text-[11px] text-teal-400 font-semibold">Matched from National & State DB</div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-center">
          <div className="text-[10px] text-blue-300 uppercase tracking-wider">ESTIMATED NET PROJECT COST</div>
          <div className="text-2xl font-black text-blue-300 my-1">
            ₹{financialResult.estimated_net_cost_inr.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-400">Subject to official DBT verification</div>
        </div>
      </div>

      {/* Bill of Materials (BOM) Cost Breakdown */}
      <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="text-slate-300 font-bold uppercase text-[11px] tracking-wider flex items-center space-x-1.5">
          <Building className="w-4 h-4 text-teal-400" />
          <span>Detailed Capital Expenditure Breakdown (BOM)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-2.5 rounded bg-navy-900 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Civil & Foundation</div>
            <div className="text-slate-200 font-bold">₹{financialResult.civil_shelter_cost_inr.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded bg-navy-900 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Thermal Insulation Core</div>
            <div className="text-slate-200 font-bold">₹{financialResult.insulation_thermal_envelope_cost_inr.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded bg-navy-900 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Solar PV Modules (Tier 1)</div>
            <div className="text-amber-400 font-bold">₹{financialResult.solar_pv_modules_cost_inr.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded bg-navy-900 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Inverter, BOS & Protection</div>
            <div className="text-slate-200 font-bold">₹{financialResult.inverter_bos_cost_inr.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded bg-navy-900 border border-slate-800">
            <div className="text-slate-400 text-[10px]">Battery Energy Storage</div>
            <div className="text-slate-200 font-bold">₹{financialResult.battery_storage_cost_inr.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Matched Government Schemes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-200 font-bold uppercase tracking-wider">
            Eligible Central & State Government Schemes:
          </span>
          <span className="text-teal-400">{financialResult.applicable_schemes.length} Active Scheme(s) Matched</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {financialResult.applicable_schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-4 rounded-xl bg-navy-900/90 border border-teal-500/30 space-y-2 hover:border-teal-400 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {scheme.level}
                </span>
                <span className="text-sm font-black text-teal-300">
                  ₹{scheme.calculated_subsidy_inr.toLocaleString()}
                </span>
              </div>

              <h4 className="font-bold text-slate-100 text-sm">{scheme.name}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{scheme.description}</p>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800">
                <span>Verified: {scheme.last_verified_date}</span>
                <a
                  href={scheme.official_source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-500/30 text-[11px] text-amber-300/90 font-mono flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
        <div>
          <b>Official Eligibility Notice:</b> {financialResult.disclaimer} Always verify direct benefit transfer (DBT)
          regulations and state nodal agency guidelines before capital commitment.
        </div>
      </div>
    </div>
  );
};
