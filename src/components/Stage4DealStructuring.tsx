import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Send, 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Layers, 
  Sliders, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  Code
} from 'lucide-react';
import { DealAmortizationOption } from '../types';

interface Stage4DealStructuringProps {
  onBackToStage3: () => void;
}

export const Stage4DealStructuring: React.FC<Stage4DealStructuringProps> = ({ onBackToStage3 }) => {
  const [selectedAmortOption, setSelectedAmortOption] = useState<'A' | 'B' | 'C'>('A');
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeComplete, setHandshakeComplete] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [salesSigned, setSalesSigned] = useState(true);

  const baselineBudget = 30.00; // In Lakhs
  const finalBOQ = 39.84; // Reconciled post-MEP sign-off
  const stage1Feasibility = 38.40;
  const accuracyCorrelationDelta = +(finalBOQ - stage1Feasibility).toFixed(2); // +1.44L
  const accuracyPct = (((finalBOQ - stage1Feasibility) / stage1Feasibility) * 100).toFixed(1);

  const handleTriggerAirtableHandshake = () => {
    setIsHandshaking(true);
    setTimeout(() => {
      setIsHandshaking(false);
      setHandshakeComplete(true);
    }, 1500);
  };

  const payloadJson = {
    event: "DEAL_CLOSING_HANDSHAKE",
    timestamp: new Date().toISOString(),
    project_id: "BLR-502-PTC",
    asset: "Prestige Tech Cloud — Wing B, Suite 502",
    client: "Acme Corp",
    total_usf: 8500,
    tenancy_months: 24,
    commercial_model: selectedAmortOption === 'A' ? "AMORTIZED_ARPM" : selectedAmortOption === 'B' ? "BULLET_INVOICE" : "HYBRID_RISK_SHARE",
    financials: {
      client_baseline_budget_lakhs: 30.00,
      stage1_indicative_lakhs: 38.40,
      final_approved_boq_lakhs: 39.84,
      reconciled_savings_mep: 1.36,
      effective_rate_per_usf: 93.74,
      blended_yield_pct: 19.4,
      payback_months: 14.2
    },
    trade_signoffs: [
      { trade: "Civil & Interiors", signatory: "Rahul V.", amount_lakhs: 19.10, status: "LOCKED" },
      { trade: "Services & MEP", signatory: "Jyotir Pant", amount_lakhs: 12.00, status: "LOCKED" },
      { trade: "FFE & Furnishing", signatory: "Sneha M.", amount_lakhs: 8.74, status: "LOCKED" }
    ],
    pki_signatures: {
      sales_vp: "Vikram Sen",
      hash: "0x9F4C2A_SHA256_VERIFIED",
      signed_at: "2026-05-18T14:35:00Z"
    },
    pm_delivery_target: {
      assigned_pm: "Karan Mehra",
      target_base: "PM-OPS-DELIVERY-2026",
      table: "Active_Buildouts",
      sla_days: 24,
      mobilization_day: "Day 0"
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner: Stage 4 Deal Closing Unlocked */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Gate Status: Stage 4 Active
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">BRD 5.4 Deal Structuring &amp; Handshake</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-headline flex items-center gap-2">
              <span>Deal Structuring, Commercial Amortization &amp; PM Handoff</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Turnkey BOQ hard-approved by C&amp;I, MEP, and FFE leads. Structure Capex recovery into monthly ARPM, verify commercial yield, and transmit full buildout scope into the live Delivery Ops Airtable.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPayloadModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Code className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Sync Payload</span>
            </button>

            <button
              onClick={() => alert('Generating executed Turnkey SOW contract PDF...')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export SOW (.pdf)</span>
            </button>
          </div>
        </div>

        {/* Site Handover Card with hotlinked photo */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="space-y-3 z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ready for Immediate Site Mobilization</span>
            </div>
            <h3 className="text-lg font-black font-headline tracking-tight">
              Prestige Tech Cloud — Wing B (Suite 502)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              42,500 USF Building footprint • 8,500 USF Demised Fit-out Floorplate • 120 Workstation configuration (66 dedicated open desks, 3 modular meeting pods, 1 10P board room &amp; expanded wet pantry).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <span className="text-slate-300">
                Client: <strong className="text-white">Acme Corp</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">
                Mobilization: <strong className="text-emerald-400">Day 0 (Immediate)</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">
                Delivery SLA: <strong className="text-white">24 Calendar Days</strong>
              </span>
            </div>
          </div>

          <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden border border-white/20 shadow-lg flex-shrink-0 relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvGyTYcUBdK1hAwsag74osP2pU_zO_BwLXGLWRBO6gd44zn2qwhtypZlrvmwPFRqwomvRrUjsokDZ-NNjOa7ma3wIVO5cXIFsURkubjFnxSTzwdGePlerWD_MkvJklL1n7_ODHwPWJ57Ezc_8uvgYVI9Mfas-qIrLT_WffSLD3lwe7CEBcPcFZrI54PFZOZxU0JEKHCJ7JeUrvtMByMZugWXNVwf3fpV7rX6bn-K2z85AbE-RZX2iRKg"
              alt="Site Handover Preview - Prestige Tech Cloud"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
              Handover Zone 4B
            </span>
          </div>
        </div>
      </div>

      {/* ================= 4 ANALYTICAL METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            1. Baseline Client Budget
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">₹30.00 Lakhs</div>
          <div className="text-xs text-slate-500 mt-1 font-mono">₹70.58 / USF Target</div>
          <div className="text-[10px] text-slate-400 mt-2">Standard turnkey ceiling</div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>2. Final Approved BOQ</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Locked</span>
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono mt-1">₹39.84 Lakhs</div>
          <div className="text-xs text-emerald-700 mt-1 font-mono">
            -₹1.36L Post-MEP • ₹93.74/USF
          </div>
          <div className="text-[10px] text-emerald-600 mt-2">All 3 Trade Sign-offs Completed</div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
            3. Accuracy Correlation
          </div>
          <div className="text-2xl font-black text-blue-900 font-mono mt-1">+{accuracyCorrelationDelta} Lakhs</div>
          <div className="text-xs text-blue-700 mt-1 font-mono">
            +{accuracyPct}% vs S1 (₹{stage1Feasibility}L)
          </div>
          <div className="text-[10px] text-blue-600 mt-2">R² = 0.94 Regression Fit</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
          <div className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">
            4. Commercial Return
          </div>
          <div className="text-2xl font-black text-indigo-900 font-mono mt-1">19.4% Blended</div>
          <div className="text-xs text-indigo-700 mt-1 font-mono">Payback: 14.2 Months</div>
          <div className="text-[10px] text-indigo-600 mt-2">24-Month Tenancy Term</div>
        </div>
      </div>

      {/* ================= CAPITAL RECOVERY & ARPM AMORTIZATION ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-700 text-white font-mono font-bold text-xs flex items-center justify-center">
              02
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Commercial Capital Recovery &amp; ARPM Impact Models
              </h3>
              <p className="text-[11px] text-slate-500">
                Select commercial structure to recover ₹39.84 Lakhs fit-out Capex across the 24-month lease
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Base ARPM: <strong>₹18,500 / desk / mo</strong></span>
            <span>•</span>
            <span>Capacity: <strong>120 Desks</strong></span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 3 Interactive Amortization Option Radio Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option A */}
            <div
              onClick={() => setSelectedAmortOption('A')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAmortOption === 'A'
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Option A • Recommended
                </span>
                <input
                  type="radio"
                  name="amort-option"
                  checked={selectedAmortOption === 'A'}
                  onChange={() => setSelectedAmortOption('A')}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Fully Amortized Capex into ARPM</h4>
              <p className="text-xs text-slate-500 mt-1">Zero upfront capital outlay for client; 100% financed across 24-month tenancy.</p>

              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Capex Surcharge:</span>
                  <span className="font-mono font-bold text-blue-800">+₹2,515 / desk / mo</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 pt-1">
                  <span>Adjusted Monthly ARPM:</span>
                  <span className="font-mono text-sm text-blue-900">₹21,015 / desk</span>
                </div>
              </div>
            </div>

            {/* Option B */}
            <div
              onClick={() => setSelectedAmortOption('B')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAmortOption === 'B'
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Option B • Bullet
                </span>
                <input
                  type="radio"
                  name="amort-option"
                  checked={selectedAmortOption === 'B'}
                  onChange={() => setSelectedAmortOption('B')}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Upfront Capex Bullet Invoice</h4>
              <p className="text-xs text-slate-500 mt-1">Client pays full turnkey fit-out invoice prior to site handover Day 0.</p>

              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Immediate Billing:</span>
                  <span className="font-mono font-bold text-slate-800">₹39,84,000</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 pt-1">
                  <span>Monthly Recurring ARPM:</span>
                  <span className="font-mono text-sm text-slate-800">₹18,500 / desk</span>
                </div>
              </div>
            </div>

            {/* Option C */}
            <div
              onClick={() => setSelectedAmortOption('C')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAmortOption === 'C'
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Option C • Hybrid
                </span>
                <input
                  type="radio"
                  name="amort-option"
                  checked={selectedAmortOption === 'C'}
                  onChange={() => setSelectedAmortOption('C')}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Hybrid Risk-Share Facility</h4>
              <p className="text-xs text-slate-500 mt-1">50% down-payment at Day 0; remaining 50% amortized across 24 monthly invoices.</p>

              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Down Payment (50%):</span>
                  <span className="font-mono font-bold text-amber-800">₹19,92,000</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 pt-1">
                  <span>Amortized ARPM:</span>
                  <span className="font-mono text-sm text-amber-900">₹19,757 / desk</span>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Cash Flow & Capex Recovery Projection Chart */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Capex Break-Even &amp; Net Operational Cash Flow Trajectory
                </h4>
                <p className="text-[11px] text-slate-500">24-Month cumulative recovery under Option {selectedAmortOption}</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Cumulative Invoiced
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Net Operational Margin
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Capex Deficit
                </span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-hidden">
              <svg viewBox="0 0 800 240" className="w-full h-auto select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line x1="60" y1="40" x2="760" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="90" x2="760" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="140" x2="760" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="190" x2="760" y2="190" stroke="#e2e8f0" strokeWidth="1.5" />

                {/* Axis Labels */}
                <text x="50" y="45" textAnchor="end" fill="#94a3b8" fontSize="10">₹60L</text>
                <text x="50" y="95" textAnchor="end" fill="#94a3b8" fontSize="10">₹40L</text>
                <text x="50" y="145" textAnchor="end" fill="#94a3b8" fontSize="10">₹20L</text>
                <text x="50" y="195" textAnchor="end" fill="#94a3b8" fontSize="10">₹0</text>

                {/* Month Ticks */}
                {[0, 3, 6, 9, 12, 14.2, 18, 21, 24].map((m, idx) => {
                  const x = 60 + (m / 24) * 700;
                  return (
                    <g key={idx}>
                      <line x1={x} y1="190" x2={x} y2="195" stroke="#94a3b8" strokeWidth="1" />
                      <text x={x} y="210" textAnchor="middle" fill="#64748b" fontSize="10">
                        {m === 14.2 ? 'M14.2*' : `M${m}`}
                      </text>
                    </g>
                  );
                })}

                {/* Capex Break-Even Vertical Marker (Month 14.2) */}
                <line x1={60 + (14.2 / 24) * 700} y1="30" x2={60 + (14.2 / 24) * 700} y2="190" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                <rect x={60 + (14.2 / 24) * 700 - 55} y="15" width="110" height="20" fill="#ecfdf5" stroke="#10b981" rx="4" />
                <text x={60 + (14.2 / 24) * 700} y="29" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="700">
                  Break-Even: M14.2
                </text>

                {/* Shaded Area Under Curve */}
                <path
                  d={`M 60 190 
                     C 220 180, 350 140, ${60 + (14.2 / 24) * 700} 95 
                     C 550 65, 680 45, 760 35 
                     L 760 190 Z`}
                  fill="url(#curveGrad)"
                />

                {/* Trajectory Line */}
                <path
                  d={`M 60 190 
                     C 220 180, 350 140, ${60 + (14.2 / 24) * 700} 95 
                     C 550 65, 680 45, 760 35`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                />

                {/* End Point Marker */}
                <circle cx="760" cy="35" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="755" y="24" textAnchor="end" fill="#1e40af" fontSize="11" fontWeight="800">
                  Total Collected: ₹60.52L
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECONCILED TRADE SIGN-OFF BREAKDOWN TABLE ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Reconciled Trade Sign-off Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">Verified scope totals by discipline lead</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
            Hard-Locked by Approver Signatures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3 px-4">Discipline / Trade</th>
                <th className="py-3 px-4">Lead Signatory</th>
                <th className="py-3 px-4">Verification Timestamp</th>
                <th className="py-3 px-4 text-right">Reconciled Total</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Civil &amp; Interiors (C&amp;I)</td>
                <td className="py-3.5 px-4 text-slate-700">Rahul V. (Lead Architect)</td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">Today, 10:42 AM IST</td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">₹19,10,000</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Approved
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Services &amp; MEP</td>
                <td className="py-3.5 px-4 text-slate-700">Jyotir Pant (MEP Engineering Lead)</td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">Today, 2:18 PM IST</td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">₹12,00,000</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Approved
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Fixtures &amp; Furnishing (FFE)</td>
                <td className="py-3.5 px-4 text-slate-700">Sneha M. (Procurement Lead)</td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">Today, 11:15 AM IST</td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">₹8,74,000</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Approved
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan={3} className="py-3 px-4 text-slate-700">
                  Grand Turnkey Capex Total (Locked):
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-800 text-sm font-black">
                  ₹39,84,000
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ================= SALES HEAD DIGITAL SIGN-OFF & AIRTABLE HANDSHAKE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Sign-Off Box */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900 font-headline">
                Sales Executive Digital Sign-Off
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Formal verification by Enterprise Sales VP confirming agreement with commercial structure and tenure duration.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Signatory: Vikram Sen</span>
                <span className="text-[10px] font-mono text-slate-400">VP Sales &amp; Enterprise Growth</span>
              </div>
              <div className="mt-2 text-[11px] font-mono text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PKI Digital Hash: #0x9F4C2A-SHA256 (Signed &amp; Valid)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <strong>Commercial Agreement Executed</strong></span>
            <span className="text-emerald-700 font-bold">100% Ready</span>
          </div>
        </div>

        {/* Live Airtable PM Handoff Box */}
        <div className="p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-700" />
                <h4 className="text-sm font-bold text-slate-900 font-headline">
                  Delivery Ops Airtable Handshake
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold">
                PM-OPS-DELIVERY-2026
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Direct API transmission to Delivery Operations base. Initializes buildout record, locks bill of quantities, and triggers Day 0 site contractor mobilization.
            </p>

            <div className="mt-3 p-3 bg-white/80 rounded-xl border border-indigo-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Table:</span>
                <span className="font-mono font-bold text-slate-800">Active_Buildouts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Lead PM:</span>
                <span className="font-bold text-slate-800">Karan Mehra</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SLA Calendar:</span>
                <span className="font-bold text-indigo-800">24 Calendar Days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between">
            {handshakeComplete ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>Transmitted to Airtable Record #REC-9821</span>
              </div>
            ) : (
              <button
                id="btn-complete-handshake"
                onClick={handleTriggerAirtableHandshake}
                disabled={isHandshaking}
                className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                {isHandshaking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Transmitting Payload to PM-OPS-DELIVERY...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Complete Deal Closing &amp; Handshake to PM Airtable</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL: JSON PAYLOAD PREVIEW ================= */}
      {showPayloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono text-xs font-bold uppercase text-slate-200">
                  Airtable API Integration Payload (Active_Buildouts)
                </h3>
              </div>
              <button
                onClick={() => setShowPayloadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <pre className="font-mono text-[11px] text-emerald-400 leading-relaxed select-all">
                {JSON.stringify(payloadJson, null, 2)}
              </pre>
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPayloadModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
