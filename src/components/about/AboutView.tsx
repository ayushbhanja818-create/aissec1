import React from 'react';
import { CONTAINER_TYPES_META } from '../../data/bengaluruSites';
import {
  ShieldAlert,
  Info,
  Droplet,
  Building2,
  HeartPulse,
  Scale,
  Sparkles,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          Epidemiological AI Governance & Methodology
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          About The Last Bite & Methodology
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How autonomous aerial computer vision transforms Indian municipal vector surveillance while
          maintaining rigorous scientific transparency.
        </p>
      </div>

      {/* Primary Public-Health Disclaimer */}
      <div className="p-6 bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-500/15 text-cyan-400 rounded-xl shrink-0 mt-0.5">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white">
              Surrogate Habitat Detection vs. Biological Larvae
            </h3>
            <p>
              Optical drone sensors flying at 35–55m altitude cannot directly resolve 3mm mosquito larvae
              or detect active viral circulation. Instead, <strong>The Last Bite</strong> identifies{' '}
              <strong>potential mosquito breeding containers</strong> (artificial micro-habitats such as
              unsealed rooftop Sintex tanks, blue HDPE water drums, discarded tyres, and tender coconut shells).
            </p>
            <p>
              These containers serve as high-probability surrogate indicators for <em>Aedes aegypti</em> and{' '}
              <em>Aedes albopictus</em> oviposition, enabling BBMP health officers to dispatch field teams
              efficiently to high-risk zones.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide">
              Rule-Based Risk Scoring Heuristic
            </span>
            <p className="mt-0.5">
              Current risk scores (0–100) are rule-based multi-factor estimates incorporating container
              volume, open-air sun exposure, water presence, recent rainfall, and residential density.
              They represent <strong>inspection priority</strong>, not a medical probability of dengue infection.
            </p>
          </div>
        </div>
      </div>

      {/* Indian Container Taxonomies */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Indian Container Scoring Rubric</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4">Container Type</th>
                <th className="py-3 px-4">Base Weight</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Indian Epidemiological Vector Niche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.values(CONTAINER_TYPES_META).map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">{item.label}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                    {item.defaultRiskWeight}/100
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{item.typicalWaterVolume}</td>
                  <td className="py-3 px-4 text-slate-300 leading-relaxed">{item.indianContext}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UN Sustainable Development Goals (SDG) Alignment */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">United Nations Sustainable Development Goals (SDGs)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SDG 3 */}
          <div className="p-6 bg-slate-900/90 border border-emerald-500/30 rounded-2xl shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-extrabold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-white">SDG 3: Good Health & Well-being</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Target 3.3:</strong> Combats neglected tropical and vector-borne diseases. Dengue
              infects an estimated 33 million individuals annually in India. Drone-directed vector
              surveillance halts transmission cycles before hospitalizations surge.
            </p>
          </div>

          {/* SDG 6 */}
          <div className="p-6 bg-slate-900/90 border border-sky-500/30 rounded-2xl shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-extrabold text-lg flex items-center justify-center">
              6
            </div>
            <h3 className="text-base font-bold text-white">SDG 6: Clean Water & Sanitation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Target 6.3:</strong> Enhances urban water sanitation by locating unsealed, neglected
              domestic storage reservoirs and standing wastewater pools, prompting installation of
              mosquito-proof mesh covers.
            </p>
          </div>

          {/* SDG 11 */}
          <div className="p-6 bg-slate-900/90 border border-amber-500/30 rounded-2xl shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold text-lg flex items-center justify-center">
              11
            </div>
            <h3 className="text-base font-bold text-white">SDG 11: Sustainable Cities & Communities</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Target 11.5 & 11.b:</strong> Equips municipal corporations like BBMP with climate-adapted
              early warning spatial infrastructure, turning static inspection rosters into agile, data-driven
              vector interventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
