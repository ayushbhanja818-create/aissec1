import React from 'react';
import { Layers, Crosshair, AlertTriangle, Clock } from 'lucide-react';

interface BengaluruKpiCardsProps {
  totalImages: number;
  totalContainers: number;
  highPriorityCount: number;
  awaitingInspectionCount: number;
  isSimulated?: boolean;
}

export const BengaluruKpiCards: React.FC<BengaluruKpiCardsProps> = ({
  totalImages,
  totalContainers,
  highPriorityCount,
  awaitingInspectionCount,
  isSimulated = true,
}) => {
  const cards = [
    {
      title: 'Images Analyzed',
      value: totalImages,
      subtext: 'Orthomosaic survey tiles',
      icon: Layers,
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      color: 'cyan',
    },
    {
      title: 'Potential Containers Detected',
      value: totalContainers,
      subtext: 'Oviposition micro-habitats',
      icon: Crosshair,
      borderColor: 'border-teal-500/30',
      iconBg: 'bg-teal-500/15 text-teal-400',
      color: 'teal',
    },
    {
      title: 'High-Priority Sites',
      value: highPriorityCount,
      subtext: 'Calculated risk score ≥ 70',
      icon: AlertTriangle,
      borderColor: 'border-red-500/40',
      iconBg: 'bg-red-500/20 text-red-400',
      color: 'red',
      badge: 'Action Required',
    },
    {
      title: 'Sites Awaiting Inspection',
      value: awaitingInspectionCount,
      subtext: 'Pending BBMP field visit',
      icon: Clock,
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400',
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Simulation status pill */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-cyan-400">
            Surveillance Overview • Ward 150 (Bellandur)
          </span>
          {isSimulated && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
              Demo Mode — Simulated Data
            </span>
          )}
        </div>
        <span className="text-slate-500 text-[11px] font-mono">Real-time Calculated Heuristics</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 bg-slate-900/90 backdrop-blur-md rounded-2xl border ${c.borderColor} shadow-xl relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {c.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                      {c.value}
                    </h3>
                    {c.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{c.subtext}</p>
                </div>

                <div className={`p-2.5 rounded-xl ${c.iconBg} border border-white/5 shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* Bottom colored bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  c.color === 'red'
                    ? 'bg-red-500'
                    : c.color === 'amber'
                    ? 'bg-amber-500'
                    : c.color === 'teal'
                    ? 'bg-teal-500'
                    : 'bg-cyan-500'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
