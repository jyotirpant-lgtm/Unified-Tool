import React, { useState } from 'react';
import { Workflow, Layers, ArrowRight, ShieldCheck, Database, CheckCircle, FileText, Sparkles, Server } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'map' | 'approach'>('matrix');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base font-headline">System Architecture &amp; Porting Design</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40 font-bold">
                  BRD 5.0 LIVE
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Consolidated blueprint porting Twinkal Kale, Devyani Jadhav, &amp; Jyotir Pant tools into BUILDMETRIC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-blue-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Existing Tool Porting Matrix
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'map'
                ? 'border-blue-600 text-blue-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            High-Level Component Architecture (Component Map)
          </button>
          <button
            onClick={() => setActiveTab('approach')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'approach'
                ? 'border-blue-600 text-blue-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Automation Approach Q&amp;A (Image 11)
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto text-xs text-slate-700 space-y-6">
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                The BUILDMETRIC unified PropTech platform merges three previously isolated tools into a single, real-time workflow pipeline:
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                      <th className="py-3 px-4">Original Legacy Tool</th>
                      <th className="py-3 px-4">Key Responsibilities</th>
                      <th className="py-3 px-4">Ported Destination in BUILDMETRIC</th>
                      <th className="py-3 px-4">Unified Upgrades</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Twinkal Kale's Sales/Feasibility Tool
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Intake client constraints, desk count, target budget, feasibility check.
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-blue-700">
                        Stage 1: Sales Feasibility &amp; High-Level Cost
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Automated 4-layer validation pipeline, 45% desk ratio rule, historical regression R²=0.94.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Devyani Jadhav's BOQ Generation Tool
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Manual plan review, Excel line item takeoffs, rate card lookups.
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-700">
                        Stage 2: Layout AI Diff &amp; Detailed BOQ Engine
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Dual Plan Vision AI comparison, automated spatial diff bounding, live rate card v2.4 sync.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Jyotir Pant's Approver Tool
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Email approval rounds, PDF redlines, untracked changes.
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-amber-700">
                        Stage 3: Multi-Trade Approval &amp; Inline Comments
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Interactive threaded line-item commenting, immutable SHA-256 audit trail, role-based sign-offs.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        New Unified Module
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        Capex recovery, lease term amortization, ERP handover.
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        Stage 4: Deal Structuring &amp; Tracker Handoff
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        3 Amortization options, SVG break-even modeling, direct API push to PM-OPS-DELIVERY Airtable.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                End-to-end component communication flow across services, UI clients, and persistent databases:
              </p>

              {/* Visual Map Layout */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-6">
                {/* Layer 1: Client UI */}
                <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      1. Unified Web Application (Single-Page App)
                    </span>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      React 19 + Tailwind 4
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">Stage 1: Feasibility</div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">Stage 2: BOQ Workbench</div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">Stage 3: Sign-Off Workspace</div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">Stage 4: Deal Structuring</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="h-6 w-px bg-slate-300"></div>
                </div>

                {/* Layer 2: Core Domain Services */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                    <div className="font-bold text-indigo-900 text-xs">Feasibility &amp; Rules Engine</div>
                    <p className="text-[11px] text-slate-500 mt-1">Evaluates 40% desk ratio rule, regression cost rules</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                    <div className="font-bold text-indigo-900 text-xs">Vision AI Plan Diff Engine</div>
                    <p className="text-[11px] text-slate-500 mt-1">Detects spatial deltas, matches room polygons</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                    <div className="font-bold text-indigo-900 text-xs">Trade Sign-Off &amp; Locking</div>
                    <p className="text-[11px] text-slate-500 mt-1">Manages C&amp;I, MEP, FFE sign-offs &amp; audit hashes</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="h-6 w-px bg-slate-300"></div>
                </div>

                {/* Layer 3: External & Enterprise Services */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs flex items-center gap-3">
                    <Database className="w-5 h-5 text-emerald-700" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Master Rate Card (Excel / DB)</div>
                      <div className="text-[11px] text-slate-500">CHLC_BOQ_RateCard.xlsx v2.4 live sync</div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-purple-200 shadow-2xs flex items-center gap-3">
                    <Server className="w-5 h-5 text-purple-700" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Airtable Delivery Pipeline</div>
                      <div className="text-[11px] text-slate-500">PM-OPS-DELIVERY-2026 Active_Buildouts API</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approach' && (
            <div className="space-y-6">
              {/* Q1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="font-bold text-slate-900 text-sm mb-2 text-blue-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">Q1</span>
                  What does your MVP do end-to-end?
                </div>
                <div className="space-y-2 text-slate-700 leading-relaxed text-xs">
                  <p>
                    The BUILDMETRIC MVP guides a commercial real estate deal from the moment sales inputs client modifications to site mobilization:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                    <li>
                      <strong>Sales Intake &amp; Feasibility:</strong> Takes in project specs (e.g. 8,500 USF, 120 desks, ₹30.00L ceiling), flags if desk stripping exceeds 40%, and estimates first-pass pricing using historical regressions.
                    </li>
                    <li>
                      <strong>AI Layout Takeoff:</strong> Compares original vs proposed CAD plans using vision bounding boxes, detects room conversions (e.g. Storage to Demo, Desks to Pods), and automatically matches items to Master Rate Card v2.4.
                    </li>
                    <li>
                      <strong>Trade Collaboration:</strong> Sends scoped line items to trade leads (Rahul V. for Civil, Jyotir Pant for MEP, Sneha M. for FFE). Allows inline review comments, item quantity recalibration, and digital signatures.
                    </li>
                    <li>
                      <strong>Deal Handshake:</strong> Once all 3 trades sign, locks the final ₹39.84L BOQ, structures Capex into monthly ARPM, and pushes the turnkey scope payload directly to the project manager's Delivery Airtable.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Q2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="font-bold text-slate-900 text-sm mb-2 text-indigo-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs">Q2</span>
                  What layers or structure does your build have?
                </div>
                <div className="space-y-3 text-slate-700 leading-relaxed text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-slate-900 block">Layer 1: Project Scope &amp; Commercial Configuration</strong>
                    Captures asset location, client commercials, spatial constraints, and requested modifications.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-slate-900 block">Layer 2: Validation &amp; Processing Engine</strong>
                    Runs rule engine (checking 40% desk removal threshold), outputs architectural demolition diagrams, and extracts takeoff metrics.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-slate-900 block">Layer 3: Costing Engine (Independent Calculation Rules)</strong>
                    Decoupled calculation modules for Civil, MEP, FFE, and Demolition backed by a 1,000+ project dataset regression and selectable markup factors.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-slate-900 block">Layer 4: Output &amp; Decision Section</strong>
                    Outputs indicative first-pass rate (₹395.6/sq.ft), highlights primary cost drivers, models Capex recovery options, and manages downstream ERP sync.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
