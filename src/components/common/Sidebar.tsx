import React from 'react';
import {
  Home,
  UploadCloud,
  Map,
  ClipboardList,
  FileBarChart,
  Info,
  Crosshair,
  ShieldAlert,
} from 'lucide-react';

export type ActiveTab = 'home' | 'upload' | 'map' | 'inspection' | 'reports' | 'about';

interface SidebarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  pendingCount: number;
  highRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  pendingCount,
  highRiskCount,
}) => {
  const menuItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'upload' as const, label: 'Upload Images', icon: UploadCloud },
    {
      id: 'map' as const,
      label: 'Results & Map',
      icon: Map,
      badge: `${highRiskCount} High`,
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/40',
    },
    {
      id: 'inspection' as const,
      label: 'Inspection Tasks',
      icon: ClipboardList,
      badge: `${pendingCount} Due`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    { id: 'reports' as const, label: 'Reports & Export', icon: FileBarChart },
    { id: 'about' as const, label: 'About & SDGs', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Top Brand Header */}
      <div>
        <div
          onClick={() => onNavigate('home')}
          className="p-5 border-b border-slate-800/80 cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-950/60 border border-cyan-400/30">
            <Crosshair className="w-5 h-5 text-slate-950 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white font-mono tracking-tight leading-none">
              The Last Bite
            </h1>
            <p className="text-[10px] text-cyan-400 font-mono mt-1">
              Dengue Habitat Intelligence
            </p>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
              Bengaluru Pilot
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                id={`sidebar-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Compact SDG Cards & Prototype Notice */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          UN SDG Alignment
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
            <span className="block text-emerald-400 font-black text-xs font-mono">SDG 3</span>
            <span className="text-[9px] text-slate-400 leading-none">Health</span>
          </div>
          <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 text-center">
            <span className="block text-sky-400 font-black text-xs font-mono">SDG 6</span>
            <span className="text-[9px] text-slate-400 leading-none">Water</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-center">
            <span className="block text-amber-400 font-black text-xs font-mono">SDG 11</span>
            <span className="text-[9px] text-slate-400 leading-none">Cities</span>
          </div>
        </div>

        <div className="pt-1 text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span>BBMP Ward 150 GIS Engine</span>
        </div>
      </div>
    </aside>
  );
};
