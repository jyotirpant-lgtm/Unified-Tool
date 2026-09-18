import React from 'react';
import { 
  Building, 
  Sparkles, 
  FileSpreadsheet, 
  Layers, 
  Calculator, 
  CheckCircle2, 
  Handshake, 
  Workflow, 
  Bell, 
  UserCheck,
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  History,
  ChevronDown
} from 'lucide-react';
import { StageId, UserRole, Project, WorkflowStatus } from '../types';

interface HeaderProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onOpenRateCard: () => void;
  onOpenArchitecture: () => void;
  onOpenNewProject: () => void;
  onOpenAuditTrail?: () => void;
  activeProject: Project;
  isRateLocked?: boolean;
}

const ROLE_DISPLAY_NAMES: Record<UserRole, { label: string; desc: string }> = {
  sales: { label: 'Sales / CS', desc: 'Stage 1 edit/submit; Stages 2-4 view' },
  architect_supply: { label: 'Architect / Supply', desc: 'Stage 1 view; Stages 2-3 edit; Stage 4 view' },
  approver_trade: { label: 'Trade Approver', desc: 'PM / MEP / Architect: Stage 3 approve/edit line items' },
  procurement: { label: 'Procurement', desc: 'Stage 3 view (post-approval)' },
  pricing: { label: 'Pricing Team', desc: 'Stage 4 edit; Stage 3 view' },
  sales_head: { label: 'Sales Head', desc: 'Stage 1 & Stage 4 approve' },
  // aliases
  estimator: { label: 'Estimator (Architect)', desc: 'Stages 2-3 takeoff & line item editing' },
  approver: { label: 'Approver (Trade Head)', desc: 'Stage 3 trade sign-off gate' }
};

const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
  pending_proposal_approval: { label: 'Pending Proposal Approval', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-200' },
  proposal_approved: { label: 'Proposal Approved', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-200' },
  layout_in_progress: { label: 'Layout In Progress', color: 'text-indigo-800', bg: 'bg-indigo-100 border-indigo-200' },
  pending_layout_signoff: { label: 'Pending Layout Sign-off', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-200' },
  layout_approved: { label: 'Layout Approved', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-200' },
  boq_in_progress: { label: 'BOQ In Progress', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-200' },
  pending_boq_approval: { label: 'Pending BOQ Approval', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-200' },
  boq_approved: { label: 'BOQ Approved (All Signed)', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-200' },
  pending_deal_structuring: { label: 'Pending Deal Structuring', color: 'text-indigo-800', bg: 'bg-indigo-100 border-indigo-200' },
  pending_sales_head_approval: { label: 'Pending Sales Head Sign-off', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-200' },
  closed: { label: 'Closed (Handed to PM)', color: 'text-teal-800', bg: 'bg-teal-100 border-teal-200' },
};

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  onSelectStage,
  userRole,
  onChangeUserRole,
  onOpenRateCard,
  onOpenArchitecture,
  onOpenNewProject,
  onOpenAuditTrail,
  activeProject,
  isRateLocked = false,
}) => {
  const stages = [
    { id: 'stage-1' as StageId, num: '1', name: 'Feasibility & Specs', icon: Layers },
    { id: 'stage-2' as StageId, num: '2', name: 'Takeoff & BOQ', icon: Calculator },
    { id: 'stage-3' as StageId, num: '3', name: 'Trade Sign-offs', icon: CheckCircle2 },
    { id: 'stage-4' as StageId, num: '4', name: 'Deal Structuring', icon: Handshake },
  ];

  const statusInfo = WORKFLOW_STATUS_CONFIG[activeProject.workflowStatus] || {
    label: activeProject.workflowStatus,
    color: 'text-blue-800',
    bg: 'bg-blue-100 border-blue-200'
  };

  const auditLogCount = activeProject.auditLogs?.length || 4;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Top Banner Row */}
      <div className="px-6 py-3 flex items-center justify-between gap-4 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 font-headline">
                {activeProject.name}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {statusInfo.label}
              </span>
              {activeProject.dealDifficulty && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {activeProject.dealDifficulty}
                </span>
              )}
              <button
                type="button"
                id="btn-header-change-space"
                onClick={onOpenNewProject}
                className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                title="Search New Spaces or Create Live Project"
              >
                <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                <span>Change Space / New Project</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
              <span>Client: <strong className="text-slate-700">{activeProject.clientName}</strong></span>
              <span>•</span>
              <span>{activeProject.city}</span>
              <span>•</span>
              <span>Fit-out Scope: <strong className="text-slate-700">{activeProject.totalUSF.toLocaleString()} USF</strong> ({activeProject.selectedSpaces.map(s => s.suiteCode).join(' + ')})</span>
              <span>•</span>
              <span>Base Desks: <strong className="text-slate-700">{activeProject.plannedDesks}</strong></span>
              {activeProject.salesOwner && (
                <>
                  <span>•</span>
                  <span>Owner: <strong className="text-slate-700">{activeProject.salesOwner}</strong></span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live Budget Indicators & Quick Tools */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden lg:flex items-center gap-4 py-1.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Target Budget</div>
              <div className="text-xs font-bold text-slate-700 font-mono tabular-nums">₹{activeProject.targetBudget.toFixed(2)} Lakhs</div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Stage 1 Indicative</div>
              <div className="text-xs font-bold text-blue-700 font-mono tabular-nums">
                ₹{((activeProject.totalUSF * 395) / 100000).toFixed(2)} Lakhs
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Detailed BOQ</div>
              <div className={`text-xs font-bold font-mono tabular-nums ${isRateLocked ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isRateLocked ? '₹39.84 Lakhs (Locked)' : '₹41.20 Lakhs'}
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2">
            {onOpenAuditTrail && (
              <button
                id="btn-header-audit"
                onClick={onOpenAuditTrail}
                title="View Immutable Audit Trail (Section 7.2)"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Audit Trail</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {auditLogCount}
                </span>
              </button>
            )}

            <button
              id="btn-header-ratecard"
              onClick={onOpenRateCard}
              title="Open Enterprise Rate Cards"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Rate Cards</span>
            </button>

            <button
              id="btn-header-architecture"
              onClick={onOpenArchitecture}
              title="View Architecture Specification & State Machine"
              className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-xs font-medium text-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Spec Map</span>
            </button>

            {/* Role Switcher with Spec 7.1 Breakdown */}
            <div className="relative">
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 px-1 hidden md:inline">ROLE:</span>
                <select
                  id="select-user-role"
                  value={userRole}
                  onChange={(e) => onChangeUserRole(e.target.value as UserRole)}
                  className="text-xs font-bold text-slate-800 bg-transparent border-0 outline-none pr-5 py-0.5 cursor-pointer"
                  title="Switch User Role to test Section 7.1 Role Permissions"
                >
                  <option value="sales">Sales / CS (Stage 1 Edit)</option>
                  <option value="architect_supply">Architect / Supply (Stage 2-3 Edit)</option>
                  <option value="approver_trade">Trade Approver (Stage 3 Sign-off)</option>
                  <option value="procurement">Procurement (Post-Approval View)</option>
                  <option value="pricing">Pricing (Stage 4 Edit)</option>
                  <option value="sales_head">Sales Head (Stage 1 & 4 Approve)</option>
                </select>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold" title={`Current Role: ${ROLE_DISPLAY_NAMES[userRole]?.label || userRole}`}>
              <UserCheck className="w-4 h-4 text-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progress Bar / Sub-Navigation */}
      <div className="px-6 py-2 bg-slate-50/50 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {stages.map((stage, idx) => {
            const isActive = currentStage === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  id={`header-step-${stage.id}`}
                  onClick={() => onSelectStage(stage.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-800 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stage.num}
                  </span>
                  <span className="whitespace-nowrap">{stage.name}</span>
                </button>
                {idx < stages.length - 1 && (
                  <span className="text-slate-300 font-bold px-0.5">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-slate-600">
              Role: <strong>{ROLE_DISPLAY_NAMES[userRole]?.label || userRole}</strong>
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>State: {statusInfo.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

