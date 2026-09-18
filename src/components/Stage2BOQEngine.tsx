import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Layers, 
  Eye, 
  FileSpreadsheet, 
  Plus, 
  Check, 
  AlertCircle, 
  Info, 
  ArrowRight, 
  Edit2, 
  Trash2, 
  History, 
  Sliders, 
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { BOQLineItem, TradeType } from '../types';
import { INITIAL_BOQ_ITEMS } from '../data/mockData';

interface Stage2BOQEngineProps {
  onProceedToStage3: () => void;
  onOpenRateCard: () => void;
  items: BOQLineItem[];
  onUpdateItems: (items: BOQLineItem[]) => void;
}

export const Stage2BOQEngine: React.FC<Stage2BOQEngineProps> = ({
  onProceedToStage3,
  onOpenRateCard,
  items,
  onUpdateItems,
}) => {
  const [activeTradeFilter, setActiveTradeFilter] = useState<TradeType>('all');
  const [demolitionRate, setDemolitionRate] = useState<number>(50);
  const [affectedUsf] = useState<number>(2975); // 35% of 8500
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showValueEngineeringModal, setShowValueEngineeringModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddLineItemModal, setShowAddLineItemModal] = useState(false);
  const [aiCorrectionPrompt, setAiCorrectionPrompt] = useState('');
  const [isRefiningVision, setIsRefiningVision] = useState(false);
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string>('all');

  // Form state for adding custom line item
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemTrade, setNewItemTrade] = useState<'ci' | 'mep' | 'ffe'>('ci');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState('Nos');
  const [newItemRate, setNewItemRate] = useState<number>(5000);
  const [newItemSpace, setNewItemSpace] = useState('General Suite 502');

  // Dynamic calculations
  const totalBOQ = items.reduce((acc, curr) => acc + curr.subtotal, 0);
  const targetBudget = 3000000; // ₹30.00 Lakhs
  const varianceAmt = totalBOQ - targetBudget;
  const variancePct = ((varianceAmt / targetBudget) * 100).toFixed(1);

  const ciTotal = items.filter((i) => i.trade === 'ci').reduce((a, b) => a + b.subtotal, 0);
  const mepTotal = items.filter((i) => i.trade === 'mep').reduce((a, b) => a + b.subtotal, 0);
  const ffeTotal = items.filter((i) => i.trade === 'ffe').reduce((a, b) => a + b.subtotal, 0);

  const filteredItems = items.filter((item) => {
    if (activeTradeFilter !== 'all' && item.trade !== activeTradeFilter) return false;
    if (selectedSpaceFilter !== 'all' && item.spaceTag !== selectedSpaceFilter) return false;
    return true;
  });

  const handleUpdateItem = (id: string, newQty: number, newOverrideRate?: number | null) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const rate = newOverrideRate !== undefined && newOverrideRate !== null ? newOverrideRate : (item.overrideRate || item.masterRate);
        const subtotal = Math.round(newQty * rate);
        return {
          ...item,
          qty: newQty,
          overrideRate: newOverrideRate !== undefined ? newOverrideRate : item.overrideRate,
          subtotal,
          auditFlag: 'Manually edited in BOQ workbench',
          flagType: 'edited' as const,
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleDemolitionRateChange = (rate: number) => {
    setDemolitionRate(rate);
    const updated = items.map((item) => {
      if (item.id === 'boq-5') {
        const subtotal = affectedUsf * rate;
        return {
          ...item,
          masterRate: rate,
          subtotal,
          auditFlag: `Recalculated via Demolition Modifier (₹${rate}/USF)`,
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleAddLineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDesc.trim()) return;

    const newItem: BOQLineItem = {
      id: `boq-custom-${Date.now()}`,
      code: `CUSTOM-${Math.floor(Math.random() * 900 + 100)}`,
      specId: `CUSTOM-SPEC`,
      description: newItemDesc,
      details: `Trade: ${newItemTrade.toUpperCase()} • Custom Added Item`,
      trade: newItemTrade,
      tradeLabel: newItemTrade === 'ci' ? 'C&I Civil & Interiors' : newItemTrade === 'mep' ? 'MEP Services' : 'FFE Modular',
      spaceTag: newItemSpace,
      changeType: 'New Enclosed',
      originalQty: newItemQty,
      qty: newItemQty,
      unit: newItemUnit,
      masterRate: newItemRate,
      overrideRate: null,
      subtotal: newItemQty * newItemRate,
      auditFlag: 'Added as custom billable item by Estimator',
      flagType: 'info',
      status: 'Approved',
    };

    onUpdateItems([...items, newItem]);
    setShowAddLineItemModal(false);
    setNewItemDesc('');
  };

  const handleRunAiDiffRefine = () => {
    setIsRefiningVision(true);
    setTimeout(() => {
      setIsRefiningVision(false);
      alert('AI Plan Vision scan completed. 4 spatial changes re-verified against Revit boundary vector.');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Stat & Variance Distribution Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                Stage 2 Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Layout AI Diff &amp; Detailed BOQ Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-headline">
              Live Fit-out Feasibility &amp; Variance Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-plan architectural vision diff, live rate card synchronization &amp; multi-trade line item takeoff.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-run-ve"
              onClick={() => setShowValueEngineeringModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Run Value Engineering AI</span>
            </button>

            <button
              id="btn-stage2-to-stage3"
              onClick={onProceedToStage3}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20"
            >
              <span>Proceed to Stage 3: Sign-offs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Variance Bar & Numbers */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Total Detailed BOQ</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              ₹{(totalBOQ / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              ₹{(totalBOQ / 8500).toFixed(1)} / USF (8,500 sq.ft)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Target Budget Ceiling</div>
            <div className="text-2xl font-black text-blue-800 font-mono mt-1">
              ₹{(targetBudget / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">₹352.9 / USF (Approved in S1)</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
              <span>Variance Over Client Target</span>
              <span className="font-mono font-bold">+₹{(varianceAmt / 100000).toFixed(2)} Lakhs (+{variancePct}%)</span>
            </div>
            <div className="h-3 w-full bg-amber-100 rounded-full overflow-hidden flex mt-2">
              <div style={{ width: '72%' }} className="bg-blue-700 h-full" title="Target Budget Ceiling: ₹30.00L"></div>
              <div style={{ width: '28%' }} className="bg-amber-500 h-full" title="Over Budget Variance"></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-amber-800 mt-1.5 font-medium">
              <span>Target Ceiling: ₹30.00L</span>
              <span className="font-bold">Over Target by ₹{(varianceAmt / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* Floor Parameters & Demolition Modifiers Strip */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Usable Floor Area</span>
              <div className="text-xs font-bold text-slate-800 font-mono">8,500 USF</div>
            </div>
            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Demolition Scope</span>
              <div className="text-xs font-bold text-slate-800 font-mono">
                Partial (35% affected = {affectedUsf} USF)
              </div>
            </div>
            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Demolition Rate / USF</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-mono text-slate-500">₹</span>
                  <input
                    type="number"
                    id="input-demo-rate"
                    value={demolitionRate}
                    onChange={(e) => handleDemolitionRateChange(Number(e.target.value))}
                    className="w-20 px-2 py-0.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400">/ sq.ft</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Demolition BOQ</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                ₹{((affectedUsf * demolitionRate) / 100000).toFixed(2)} Lakhs
              </span>
            </div>
            <button
              onClick={() => handleDemolitionRateChange(demolitionRate)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              Recalculate Demo
            </button>
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: SPATIAL DIFF (EXISTING VS PROPOSED) ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-700 text-white font-mono font-bold text-xs flex items-center justify-center">
              01
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Section 1: Spatial Diff: Existing vs Proposed
              </h3>
              <p className="text-[11px] text-slate-500">Dual Plan Vision Comparison &amp; AI delta bounding boxes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-edit-space-class"
              onClick={() => alert('Space Classification editor active. Click on room bounding boxes to toggle categories.')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Classification</span>
            </button>
            <button
              id="btn-add-missed-room"
              onClick={() => setShowAddRoomModal(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add Missed Room (+)</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Dual Plan Images Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Plan Card */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 flex flex-col">
              <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-slate-200 border-b border-slate-800">
                <span className="text-xs font-bold font-headline uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Existing Base Plan (As-Is)
                </span>
                <span className="text-[10px] font-mono text-slate-400">DWG REV 2.1 • Baseline</span>
              </div>
              <div className="relative p-2 flex-1 flex items-center justify-center bg-slate-950 min-h-[300px]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT2lPtqhiN0rjSE-r801lUh1DPBRMe7ZmjzLVXG63n8ZWaG4o8qnXj2egz_yjHxrtjM5ZUnEwDLEp8h13O0XNmdSDBm-TS3-2szxOgts41NH8kLcUlMZERdZ0fjkcESLZQb05d4bF4Gigg5PNEysfAjT4NClvDj-splq7bT0CVEHb0rX3EUa76Yr37HOoe0_B9UKRxu2MgUVZ554zKXk00NNxwtUBN84IgoF0HSf2rCpf6bAhpy6Snwg"
                  alt="Existing Floor Plan Base"
                  referrerPolicy="no-referrer"
                  className="max-h-[340px] w-auto object-contain rounded-lg shadow-inner"
                />

                {/* Spatial Overlays for Existing */}
                <div className="absolute top-8 left-8 bg-slate-900/80 backdrop-blur-xs text-rose-300 text-[10px] font-bold px-2 py-1 rounded border border-rose-500/40">
                  Storage 1 (Demolish)
                </div>
                <div className="absolute bottom-12 right-12 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-1 rounded border border-amber-500/40">
                  Exec Cabin A (Reconfig)
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 text-xs text-slate-400 border-t border-slate-800 flex items-center justify-between">
                <span>Original layout: 120 open workstations + 1 storage room</span>
                <span className="text-[11px] font-mono text-slate-500">Scale: 1:100</span>
              </div>
            </div>

            {/* Proposed Plan Card (AI Annotated) */}
            <div className="border border-indigo-200 rounded-xl overflow-hidden bg-slate-950 flex flex-col shadow-xs">
              <div className="bg-indigo-950 px-4 py-2.5 flex items-center justify-between text-indigo-100 border-b border-indigo-900">
                <span className="text-xs font-bold font-headline uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  Proposed Vision Diff (AI Annotated)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 border border-indigo-700">
                  4 Spatial Changes Detected
                </span>
              </div>
              <div className="relative p-2 flex-1 flex items-center justify-center bg-slate-950 min-h-[300px]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnyTa6bbaCZn1IUX5sR8NeHFlMHNusi6DqXGSeKc9G98Xff4CCOEhvXXZ6wRJEMdI4NNDA1OrmpztaOuB5bCUyXHaokpPb3VcerlWb7yWfJqBVOE5xH50Oe8_sdbi750EFYTzbyBGTMSyM7W5fLJwMU17mJ3WMslzPvEGynsNQAyENan0C79kKB6MkOg6-NnfUjJmTa4GJ-35ka8ywu_a6BaMsB1U3ULd3EmiUBHlXJkxeTFH5OaJk5w"
                  alt="Proposed Floor Plan with AI Diff Overlays"
                  referrerPolicy="no-referrer"
                  className="max-h-[340px] w-auto object-contain rounded-lg shadow-inner"
                />

                {/* Spatial Overlays for Proposed */}
                <div className="absolute top-10 right-10 bg-blue-900/90 backdrop-blur-xs text-blue-200 text-[10px] font-bold px-2 py-1 rounded border border-blue-400 shadow-md">
                  Pod 4P (New Enclosed)
                </div>
                <div className="absolute bottom-10 left-10 bg-purple-900/90 backdrop-blur-xs text-purple-200 text-[10px] font-bold px-2 py-1 rounded border border-purple-400 shadow-md">
                  Conf 6P (Reconfigured)
                </div>
              </div>
              <div className="p-3 bg-indigo-950/90 text-xs text-indigo-200 border-t border-indigo-900 flex items-center justify-between">
                <span>AI vision bounding verified against architectural spec</span>
                <button
                  onClick={handleRunAiDiffRefine}
                  disabled={isRefiningVision}
                  className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefiningVision ? 'animate-spin' : ''}`} />
                  <span>Re-run AI Diff</span>
                </button>
              </div>
            </div>
          </div>

          {/* Identified Space Changes (4 AI Deltas from Vision) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Identified Space Changes (Plan Vision Deltas)
              </h4>
              <span className="text-[11px] text-slate-500">Automatic categorization linked to trade rate cards</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Room 1 */}
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    Reconfigured
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Room #1</span>
                </div>
                <div className="text-xs font-bold text-slate-900">Exec Cabin A → Conf 6P</div>
                <p className="text-[11px] text-slate-600 mt-1">Converts private office into 6-person shared meeting room</p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-purple-700">HVAC Relocation: 4 Pts</div>
              </div>

              {/* Room 2 */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    New Enclosed
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Room #2</span>
                </div>
                <div className="text-xs font-bold text-slate-900">Open Desks → Pod 4P</div>
                <p className="text-[11px] text-slate-600 mt-1">Turnkey acoustic modular pod deployed in open zone</p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-blue-700">Package Cost: ₹3.00 Lakhs</div>
              </div>

              {/* Room 3 */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    Demolished
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Room #3</span>
                </div>
                <div className="text-xs font-bold text-slate-900">Storage 1 → Clear Floor</div>
                <p className="text-[11px] text-slate-600 mt-1">Demolished to make space for pantry expansion zone</p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-rose-700">Demolition: 2,975 USF</div>
              </div>

              {/* Room 4 */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Division
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Room #4</span>
                </div>
                <div className="text-xs font-bold text-slate-900">Collab Lounge → 2 Focus</div>
                <p className="text-[11px] text-slate-600 mt-1">Split with 12mm double acoustic glass partitions</p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-amber-800">Glazing Length: 14 RFT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: MASTER RATE CARD SYNC ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/40 to-slate-50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Master Rate Card Sync Status
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  CHLC_BOQ_RateCard.xlsx v2.4
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Active synchronization with enterprise master rate card. <strong>Copper Piping rate updated: ₹5,000 → ₹7,000 / RMT</strong> (Authorized by Sheetel on May 12, 2026).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="btn-rate-card-logs"
              onClick={onOpenRateCard}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Version Logs (6)</span>
            </button>
            <button
              onClick={() => alert('Checking rate card sync. Master sheet is fresh and verified.')}
              className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Check Fresh Sheet</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: DETAILED BOQ LINE ITEMS TABLE ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Section 3: Detailed BOQ Line Items Workbench
              </h3>
              <p className="text-[11px] text-slate-500">
                Interactive bill of quantities split by trade. Edit quantities and unit rates inline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-line-item"
              onClick={() => setShowAddLineItemModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Line Item</span>
            </button>
          </div>
        </div>

        {/* Trade Filter Tabs Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTradeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTradeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Trades (₹{(totalBOQ / 100000).toFixed(2)}L)
            </button>
            <button
              onClick={() => setActiveTradeFilter('ci')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTradeFilter === 'ci'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              C&amp;I Civil &amp; Interiors (₹{(ciTotal / 100000).toFixed(2)}L)
            </button>
            <button
              onClick={() => setActiveTradeFilter('mep')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTradeFilter === 'mep'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              MEP Services (₹{(mepTotal / 100000).toFixed(2)}L)
            </button>
            <button
              onClick={() => setActiveTradeFilter('ffe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTradeFilter === 'ffe'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              FFE Modular (₹{(ffeTotal / 100000).toFixed(2)}L)
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Showing {filteredItems.length} items</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3 px-4">Space Tag &amp; Change</th>
                <th className="py-3 px-4">Line Item Description</th>
                <th className="py-3 px-4 text-center">Qty / Unit</th>
                <th className="py-3 px-4 text-right">Master Rate</th>
                <th className="py-3 px-4 text-right">Override Rate</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4">Audit / Logic Flag</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => {
                const isEditing = editingItemId === item.id;
                const effectiveRate = item.overrideRate !== null && item.overrideRate !== undefined ? item.overrideRate : item.masterRate;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Space Tag & Change Type */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.spaceTag}</div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          item.changeType === 'Division'
                            ? 'bg-amber-100 text-amber-800'
                            : item.changeType === 'New Enclosed'
                            ? 'bg-blue-100 text-blue-800'
                            : item.changeType === 'Demolished'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.changeType}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900">{item.description}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.details}</div>
                    </td>

                    {/* Qty & Unit */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            defaultValue={item.qty}
                            id={`input-qty-${item.id}`}
                            className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold border border-blue-400 rounded text-center outline-hidden"
                          />
                          <span className="text-[11px] text-slate-500 font-mono">{item.unit}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-mono font-bold text-slate-800">{item.qty.toFixed(2)}</span>
                          <span className="text-[11px] text-slate-500 ml-1">{item.unit}</span>
                        </div>
                      )}
                    </td>

                    {/* Master Rate */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                      ₹{item.masterRate.toLocaleString('en-IN')}
                    </td>

                    {/* Override Rate */}
                    <td className="py-3 px-4 text-right font-mono whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          placeholder="Override"
                          defaultValue={item.overrideRate || ''}
                          id={`input-override-${item.id}`}
                          className="w-20 px-1.5 py-0.5 text-xs font-mono font-bold border border-blue-400 rounded text-right outline-hidden"
                        />
                      ) : item.overrideRate ? (
                        <span className="text-blue-700 font-bold">
                          ₹{item.overrideRate.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None</span>
                      )}
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 whitespace-nowrap">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </td>

                    {/* Audit / Logic Flag */}
                    <td className="py-3 px-4 max-w-[220px]">
                      {item.auditFlag ? (
                        <span
                          className={`text-[11px] block leading-tight ${
                            item.flagType === 'warning'
                              ? 'text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200'
                              : item.flagType === 'edited'
                              ? 'text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200'
                              : item.flagType === 'demolished'
                              ? 'text-rose-800 bg-rose-50 px-2 py-1 rounded border border-rose-200'
                              : 'text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200'
                          }`}
                        >
                          {item.auditFlag}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isEditing ? (
                        <button
                          onClick={() => {
                            const qtyInput = document.getElementById(`input-qty-${item.id}`) as HTMLInputElement;
                            const overrideInput = document.getElementById(`input-override-${item.id}`) as HTMLInputElement;
                            const newQty = Number(qtyInput?.value || item.qty);
                            const overrideVal = overrideInput?.value ? Number(overrideInput.value) : null;
                            handleUpdateItem(item.id, newQty, overrideVal);
                            setEditingItemId(null);
                          }}
                          className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                          title="Save Changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingItemId(item.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                          title="Edit Line Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Subtotal Summary Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Trade Subtotal Breakdown:</span>
            <span className="font-semibold text-blue-700">C&amp;I: ₹{(ciTotal / 100000).toFixed(2)}L</span>
            <span>•</span>
            <span className="font-semibold text-amber-700">MEP: ₹{(mepTotal / 100000).toFixed(2)}L</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">FFE: ₹{(ffeTotal / 100000).toFixed(2)}L</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 mr-2">Grand Total BOQ:</span>
            <span className="text-base font-black text-slate-900 font-mono">
              ₹{(totalBOQ / 100000).toFixed(2)} Lakhs
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Shelf */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 z-20 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="text-xs">
            <span className="text-slate-500">Stage 2 Live BOQ:</span>{' '}
            <strong className="font-mono text-slate-900 font-bold text-sm">
              ₹{(totalBOQ / 100000).toFixed(2)} Lakhs
            </strong>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <div className="text-xs hidden sm:block">
            <span className="text-slate-500">Delta vs Target:</span>{' '}
            <span className="text-amber-700 font-bold font-mono">+₹{(varianceAmt / 100000).toFixed(2)}L (+{variancePct}%)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Draft saved to cloud local cache.')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => alert('Exporting BOQ .xlsx file...')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export BOQ (.xlsx)</span>
          </button>
          <button
            id="btn-bottom-to-stage3"
            onClick={onProceedToStage3}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
          >
            <span>Proceed to Stage 3: Trade Sign-offs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MODAL: VALUE ENGINEERING AI ================= */}
      {showValueEngineeringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-slate-950" />
                <h3 className="font-extrabold text-base font-headline">
                  Value Engineering AI Recommendations
                </h3>
              </div>
              <button
                onClick={() => setShowValueEngineeringModal(false)}
                className="text-slate-950 font-bold hover:bg-black/10 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              <p className="text-slate-600">
                AI analyzed the ₹41.20L BOQ against the ₹30.00L target budget. Here are 3 primary value engineering substitutions to bridge the +₹11.20L variance:
              </p>

              {/* Suggestion 1 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Substitute 12mm Acoustic Glass with 10mm Laminated Single Glaze
                  </div>
                  <div className="text-slate-500 mt-1">
                    Affects Focus Rooms &amp; Conf Room 6P. Achieves 38dB STC rating with ₹1,200/RFT savings.
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold font-mono text-emerald-700 text-sm">-₹1.68 Lakhs</div>
                  <button
                    onClick={() => {
                      handleUpdateItem('boq-1', 14, 3250);
                      setShowValueEngineeringModal(false);
                    }}
                    className="mt-2 px-2.5 py-1 rounded bg-slate-900 text-white font-bold hover:bg-slate-800"
                  >
                    Apply Sub
                  </button>
                </div>
              </div>

              {/* Suggestion 2 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Switch 4P Premium Pod to Standard Acoustical Enclosure
                  </div>
                  <div className="text-slate-500 mt-1">
                    Retains dual ventilation and power; switches external powder-coated cladding to acoustic fabric.
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold font-mono text-emerald-700 text-sm">-₹60,000</div>
                  <button
                    onClick={() => {
                      handleUpdateItem('boq-2', 1, 240000);
                      setShowValueEngineeringModal(false);
                    }}
                    className="mt-2 px-2.5 py-1 rounded bg-slate-900 text-white font-bold hover:bg-slate-800"
                  >
                    Apply Sub
                  </button>
                </div>
              </div>

              {/* Suggestion 3 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Chilled Water Tie-in Optimization (Riser 4B)
                  </div>
                  <div className="text-slate-500 mt-1">
                    Direct branch connection skips secondary branch manifold. Recommended by Jyotir Pant.
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold font-mono text-emerald-700 text-sm">-₹42,000</div>
                  <button
                    onClick={() => {
                      handleUpdateItem('boq-4', 12, 7000);
                      setShowValueEngineeringModal(false);
                    }}
                    className="mt-2 px-2.5 py-1 rounded bg-slate-900 text-white font-bold hover:bg-slate-800"
                  >
                    Apply Sub
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowValueEngineeringModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800"
              >
                Close Suggestions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CUSTOM LINE ITEM ================= */}
      {showAddLineItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm font-headline">Add Custom Billable Line Item</h3>
              </div>
              <button
                onClick={() => setShowAddLineItemModal(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLineItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surface mounted LED linear lighting 28W"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trade</label>
                  <select
                    value={newItemTrade}
                    onChange={(e) => setNewItemTrade(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    <option value="ci">Civil &amp; Interiors (C&amp;I)</option>
                    <option value="mep">MEP Services</option>
                    <option value="ffe">Furniture &amp; Fixtures (FFE)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Space Tag</label>
                  <input
                    type="text"
                    value={newItemSpace}
                    onChange={(e) => setNewItemSpace(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    <option value="Nos">Nos</option>
                    <option value="RFT">RFT</option>
                    <option value="RMT">RMT</option>
                    <option value="USF">USF</option>
                    <option value="Pts">Pts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemRate}
                    onChange={(e) => setNewItemRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 text-right">
                <span className="text-slate-500 mr-2">Calculated Subtotal:</span>
                <strong className="text-sm font-mono text-slate-900">
                  ₹{(newItemQty * newItemRate).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLineItemModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold"
                >
                  Insert Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD MISSED ROOM ================= */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 font-headline mb-2">
              Add Missed Room Boundary to AI Scan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter room identifier to append to the proposed vision plan diff:
            </p>
            <input
              type="text"
              placeholder="e.g. Wellness Room / Lactation Suite (120 sqft)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Appended spatial tag to vision canvas.');
                  setShowAddRoomModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800"
              >
                Add Boundary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
