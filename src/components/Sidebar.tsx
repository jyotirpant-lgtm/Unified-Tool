import React from 'react';
import { 
  Building2, 
  Layers, 
  Calculator, 
  CheckCircle2, 
  Handshake, 
  FileSpreadsheet, 
  SlidersHorizontal, 
  Workflow, 
  Info,
  ChevronRight,
  ShieldCheck,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { StageId, Project } from '../types';

interface SidebarProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onOpenRateCard: () => void;
  onOpenArchitecture: () => void;
  onOpenParameters: () => void;
  onOpenNewProject: () => void;
  activeProject: Project;
  isRateCardModalOpen?: boolean;
  isArchitectureModalOpen?: boolean;
  isParametersModalOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStage,
  onSelectStage,
  onOpenRateCard,
  onOpenArchitecture,
  onOpenParameters,
  onOpenNewProject,
  activeProject,
}) => {
  const stageNavItems = [
    {
      id: 'stage-1' as StageId,
      stageNumber: '01',
      title: 'Feasibility & Specs',
      subtitle: 'Layer 1-4 Automation',
      icon: Layers,
      color: 'text-blue-600',
      activeBg: 'bg-blue-50 text-blue-900 border-blue-600',
    },
    {
      id: 'stage-2' as StageId,
      stageNumber: '02',
      title: 'Takeoff & BOQ Engine',
      subtitle: 'Plan Vision & Line Items',
      icon: Calculator,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50 text-indigo-900 border-indigo-600',
    },
    {
      id: 'stage-3' as StageId,
      stageNumber: '03',
      title: 'Trade Sign-offs',
      subtitle: 'C&I, MEP & FFE Reviews',
      icon: CheckCircle2,
      color: 'text-amber-600',
      activeBg: 'bg-amber-50 text-amber-900 border-amber-600',
      badge: '2/3 Signed',
    },
    {
      id: 'stage-4' as StageId,
      stageNumber: '04',
      title: 'Deal & ERP Handshake',
      subtitle: 'Amortization & Airtable',
      icon: Handshake,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50 text-emerald-900 border-emerald-600',
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-800 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 font-headline text-lg">
                BUILD<span className="text-blue-700">METRIC</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Fit-out Cost &amp; Deal Engine</p>
          </div>
        </div>
      </div>

      {/* Main Workspace Navigation */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {/* Core Process Stages */}
        <div>
          <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Workspace Scope</span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
              BRD 5.0 LIVE
            </span>
          </div>

          <nav className="space-y-1">
            {stageNavItems.map((item) => {
              const isActive = currentStage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectStage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all group ${
                    isActive
                      ? `${item.activeBg} font-semibold shadow-sm`
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                        isActive
                          ? 'bg-white shadow-xs text-slate-900'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.stageNumber}
                    </div>
                    <div>
                      <div className="text-sm leading-tight flex items-center gap-1.5">
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>

                  {item.badge ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-slate-800 translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Master Data */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Master Data &amp; Library
          </div>
          <div className="space-y-1">
            <button
              id="btn-nav-rate-cards"
              onClick={onOpenRateCard}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Enterprise Rate Cards</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                v2.4 Live
              </span>
            </button>

            <button
              id="btn-nav-parameters"
              onClick={onOpenParameters}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Fit-out Parameters</span>
              </div>
              <span className="text-[10px] text-slate-400">40% Limit</span>
            </button>
          </div>
        </div>

        {/* System Architecture & Porting Matrix */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Design &amp; Architecture
          </div>
          <button
            id="btn-nav-architecture"
            onClick={onOpenArchitecture}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 text-slate-800 hover:border-indigo-300 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Workflow className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Architecture &amp; Porting</div>
                <div className="text-[10px] text-indigo-700 mt-0.5">Existing Tool Porting Matrix &amp; Map</div>
              </div>
            </div>
            <Info className="w-3.5 h-3.5 text-indigo-500 opacity-70 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Active Project Lock Info Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Client Space Project
          </span>
          <button
            type="button"
            id="btn-sidebar-new-space"
            onClick={onOpenNewProject}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 hover:underline"
          >
            <Plus className="w-3 h-3" />
            <span>New Space</span>
          </button>
        </div>

        <div 
          id="sidebar-active-project-card"
          onClick={onOpenNewProject}
          title="Click to Switch Project or Look for New Office Space"
          className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1 group-hover:bg-blue-100 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Project
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">{activeProject.code}</span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
            {activeProject.name}
          </h4>

          <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
            <span className="truncate max-w-[110px] font-medium">{activeProject.clientName}</span>
            <span className="font-semibold text-slate-700 font-mono">{activeProject.totalUSF.toLocaleString()} USF</span>
          </div>

          {/* Selected Spaces Summary Pill */}
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md font-medium">
            <span className="truncate">
              {activeProject.selectedSpaces.length} {activeProject.selectedSpaces.length === 1 ? 'Space' : 'Spaces'}: {activeProject.selectedSpaces.map(s => s.suiteCode).join(', ')}
            </span>
            <ArrowRightLeft className="w-3 h-3 ml-1 text-blue-500 opacity-60 group-hover:opacity-100 flex-shrink-0" />
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {activeProject.dealStatus}
            </span>
            <span className="font-mono text-slate-600 font-semibold">
              SLA: {activeProject.deliverySLA.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
