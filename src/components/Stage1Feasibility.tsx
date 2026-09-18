import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  MapPin, 
  Building, 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  Percent, 
  Maximize2,
  Sun,
  ShieldAlert,
  Info,
  ChevronRight,
  ChevronDown,
  Database,
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Sparkles,
  Building2,
  ArrowRightLeft
} from 'lucide-react';
import { ScopeModification, StageId, Project, OfficeSpace, AuditLogEntry } from '../types';
import { BUILDINGS_CATALOG } from '../data/mockData';
import { RESERVABLES_TYPES, RESERVABLES_BUILDINGS_CATALOG } from '../data/reservablesCatalog';
import { INITIAL_SCOPE_MODIFICATIONS } from '../data/mockData';

interface Stage1FeasibilityProps {
  onProceedToStage2: () => void;
  activeProject?: Project;
  onOpenNewProject?: () => void;
  onUpdateProject?: (updated: Partial<Project>) => void;
  onAddAuditLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  onShowProjectDetails?: () => void;
}

// Preset options for Layer 1 dropdown selectors
// Dynamic building choices derived from Reservables sheet
const ASSET_OPTIONS = BUILDINGS_CATALOG.map((b) => b.name);

const WINDOW_OPTIONS = [
  'Exterior Window (Natural Light)',
  'Internal Room'
];

const SUITE_OPTIONS = [
  'Suite 502 • BLR-CBD-43',
  'Suite 301 • BLR-ORR-12',
  'Suite 804 • BLR-EPIP-08',
  'Suite 102 • BLR-MG-01',
  'Wing B, Floor 4 • BLR-HEB-05',
];

const ASSET_CLASS_OPTIONS = [
  'Grade-A IT',
  'Grade-A Commercial',
  'Warm Shell Special',
  'SEZ Tech Park',
  'Non-SEZ Prime Commercial',
];

const CLIENT_OPTIONS = [
  'Acme FinTech Ltd',
  'Razorpay Enterprise',
  'Zerodha Capital',
  'Flipkart Logistics',
  'Google Cloud Partner',
  'Infosys BPM',
  'Microsoft India Ops',
];

const TENANCY_TERM_OPTIONS = [
  '12 Months',
  '24 Months',
  '36 Months',
  '48 Months',
  '60 Months',
];

const DELIVERY_SLA_OPTIONS = [
  '15 Days (Urgent Turnkey)',
  '20 Days (Fast Track)',
  '24 Days (Express Buildout)',
  '30 Days (Standard SLA)',
  '45 Days (Phased Handover)',
  '60 Days (Comprehensive)',
];

const USF_OPTIONS = [
  5000,
  6500,
  8500,
  10000,
  12500,
  15000,
];

const DESK_CAPACITY_OPTIONS = [
  60,
  80,
  100,
  120,
  150,
  180,
  200,
];

const TARGET_BUDGET_OPTIONS = [
  20.00,
  25.00,
  30.00,
  35.00,
  40.00,
  45.00,
  50.00,
];

const CAP_TYPE_OPTIONS = [
  'Hard Client Cap',
  'Soft Budget Guideline',
  'Capex Amortized Pool',
  'Flex Capex (+10% Buffer)',
];

const MODULE_TITLE_OPTIONS = [
  'Conf. Room (10P)',
  'Conf. Room (6P)',
  'Board Room (14P)',
  'Huddle Room (4P)',
  'Training Room (24P)',
  'Focus Pods',
  'Phone Booths (1P)',
  'Acoustic Pods (2P)',
  'Modular 4P Meeting Pods',
  'Pantry Expansion',
  'Wet Pantry Bar',
  'Mini Cafeteria',
  'Coffee & Breakout Kiosk',
  'Open Workstations',
  'Linear Workstations',
  'Hot Desking Bank',
  'Executive Cabins',
];

const ADD_UNIT_DELTA_OPTIONS = [
  '+1 Unit',
  '+2 Units',
  '+3 Units',
  '+4 Units',
  '+5 Units',
  '+6 Units',
  '+1 Zone',
  '+2 Zones',
];

const REMOVE_DESK_DELTA_OPTIONS = [
  '-20 Desks',
  '-30 Desks',
  '-40 Desks',
  '-50 Desks',
  '-54 Desks',
  '-60 Desks',
  '-70 Desks',
  '-80 Desks',
];

const SPECIFICATION_OPTIONS = [
  'Double-glazed acoustic partitioning',
  'Single-glazed 12mm toughened glass',
  'Demountable acoustic modular partition',
  'Solid gypsum with acoustic rockwool',
  'Micro HVAC tap & acoustic seal',
  'Integrated recirc ventilation & power',
  'Plug-and-play acoustic pod unit',
  'Prefabricated acoustic enclosure',
  'Wet services shift & plumbing stack',
  'Dry pantry counter & storage cabinet',
  'Core plumbing tie-in & grease trap',
  'Full barista counter & drainage line',
  'Stripped & converted to collab spaces',
  'Demolished for agile breakout pods',
  'Salvaged & stored for future expansion',
  'Removed for wet lounge expansion',
];

const SUB_TRADE_OPTIONS = [
  'Sub-trade: Civil & Glazing',
  'Sub-trade: Modular FFE',
  'Sub-trade: MEP Wet Works',
  'Sub-trade: Demolition & Salvage',
  'Sub-trade: Electrical & Low Voltage',
  'Sub-trade: HVAC Services',
];

export const Stage1Feasibility: React.FC<Stage1FeasibilityProps> = ({
  onProceedToStage2,
  activeProject,
  onOpenNewProject,
  onShowProjectDetails,
}) => {
  // Layer 1 Interactive Dropdown States
  const [selectedAsset, setSelectedAsset] = useState<string>(
    activeProject?.buildingName || BUILDINGS_CATALOG[0].name
  );
  const [selectedSuite, setSelectedSuite] = useState<string>(
    activeProject?.selectedSpaces.map(s => s.suiteCode).join(' + ') || BUILDINGS_CATALOG[0].availableSpaces[0].suiteCode
  );
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('Grade-A IT');
  const [selectedClient, setSelectedClient] = useState<string>(
    activeProject?.clientName || 'Acme Corp'
  );
  const [selectedTenancyTerm, setSelectedTenancyTerm] = useState<string>(
    activeProject?.tenancyTerm || '24 Months'
  );
  const [selectedDeliverySLA, setSelectedDeliverySLA] = useState<string>(
    activeProject?.deliverySLA || '24 Days (Express Buildout)'
  );
  const [selectedUSF, setSelectedUSF] = useState<number>(
    activeProject?.totalUSF || BUILDINGS_CATALOG[0].availableSpaces[0].usf
  );
  const [selectedPlannedDesks, setSelectedPlannedDesks] = useState<number>(
    activeProject?.plannedDesks || BUILDINGS_CATALOG[0].availableSpaces[0].plannedDesks
  );
  const [selectedBudget, setSelectedBudget] = useState<number>(
    activeProject?.targetBudget || 30.00
  );
  const [selectedCapType, setSelectedCapType] = useState<string>(
    activeProject?.capType || 'Hard Client Cap'
  );

  // Reservables Space Characteristics States
  const [selectedReservableType, setSelectedReservableType] = useState<string>(
    activeProject?.selectedSpaces[0]?.reservableType || BUILDINGS_CATALOG[0].availableSpaces[0].reservableType || 'Standard Office'
  );
  const [selectedFloor, setSelectedFloor] = useState<string>(
    activeProject?.selectedSpaces[0]?.floorName || BUILDINGS_CATALOG[0].availableSpaces[0].floorName || 'Ground Floor'
  );
  const [selectedWindow, setSelectedWindow] = useState<string>(
    activeProject?.selectedSpaces[0]?.hasWindowLabel === 'Internal Room' ? 'Internal Room' : 'Exterior Window (Natural Light)'
  );
  const [selectedMarketPrice, setSelectedMarketPrice] = useState<number>(
    activeProject?.selectedSpaces.reduce((acc, s) => acc + (s.marketPrice || 0), 0) || BUILDINGS_CATALOG[0].availableSpaces[0].marketPrice || 1820000
  );

  // Derived building object & available spaces from Reservables catalog
  const currentBuildingAsset = BUILDINGS_CATALOG.find((b) => b.name === selectedAsset) || BUILDINGS_CATALOG[0];
  const buildingSpaces = currentBuildingAsset.availableSpaces;
  const buildingFloors = Array.from(new Set(buildingSpaces.map((s) => s.floorName || s.wingOrFloor))).filter(Boolean);

  // Handler when user selects a different building from dropdown
  const handleAssetChange = (newAssetName: string) => {
    setSelectedAsset(newAssetName);
    const targetBld = BUILDINGS_CATALOG.find((b) => b.name === newAssetName) || BUILDINGS_CATALOG[0];
    if (targetBld && targetBld.availableSpaces.length > 0) {
      const firstSp = targetBld.availableSpaces[0];
      setSelectedSuite(firstSp.suiteCode);
      setSelectedUSF(firstSp.usf);
      setSelectedPlannedDesks(firstSp.plannedDesks);
      setSelectedReservableType(firstSp.reservableType || 'Standard Office');
      setSelectedFloor(firstSp.floorName || firstSp.wingOrFloor);
      setSelectedWindow(firstSp.hasWindowLabel === 'Internal Room' ? 'Internal Room' : 'Exterior Window (Natural Light)');
      setSelectedMarketPrice(firstSp.marketPrice || 0);
    }
  };

  // Handler when user selects a specific suite/room from dropdown
  const handleSuiteChange = (suiteCodeVal: string) => {
    setSelectedSuite(suiteCodeVal);
    const matchedSpace = buildingSpaces.find((s) => s.suiteCode === suiteCodeVal);
    if (matchedSpace) {
      setSelectedUSF(matchedSpace.usf);
      setSelectedPlannedDesks(matchedSpace.plannedDesks);
      setSelectedReservableType(matchedSpace.reservableType || 'Standard Office');
      setSelectedFloor(matchedSpace.floorName || matchedSpace.wingOrFloor);
      setSelectedWindow(matchedSpace.hasWindowLabel === 'Internal Room' ? 'Internal Room' : 'Exterior Window (Natural Light)');
      setSelectedMarketPrice(matchedSpace.marketPrice || 0);
    }
  };

  // Sync when activeProject changes
  useEffect(() => {
    if (activeProject) {
      setSelectedAsset(activeProject.buildingName);
      setSelectedClient(activeProject.clientName);
      setSelectedUSF(activeProject.totalUSF);
      setSelectedPlannedDesks(activeProject.plannedDesks);
      setSelectedBudget(activeProject.targetBudget);
      setSelectedTenancyTerm(activeProject.tenancyTerm);
      setSelectedDeliverySLA(activeProject.deliverySLA);
      setSelectedCapType(activeProject.capType);
      setSelectedSuite(activeProject.selectedSpaces.map(s => s.suiteCode).join(' + '));
      if (activeProject.selectedSpaces.length > 0) {
        const first = activeProject.selectedSpaces[0];
        setSelectedReservableType(first.reservableType || 'Standard Office');
        setSelectedFloor(first.floorName || first.wingOrFloor);
        setSelectedWindow(first.hasWindowLabel === 'Internal Room' ? 'Internal Room' : 'Exterior Window (Natural Light)');
        const totalRent = activeProject.selectedSpaces.reduce((acc, s) => acc + (s.marketPrice || 0), 0);
        setSelectedMarketPrice(totalRent);
      }
    }
  }, [activeProject]);

  // Layer 1 Scope Modification Modules
  const [scopeMods, setScopeMods] = useState<ScopeModification[]>(INITIAL_SCOPE_MODIFICATIONS);

  // Layer 3 & validation state
  const [markupFactor, setMarkupFactor] = useState<18 | 20>(18);
  const [overrideAcknowledged, setOverrideAcknowledged] = useState(true);
  const [isAirtableSyncing, setIsAirtableSyncing] = useState(false);
  const [airtableSynced, setAirtableSynced] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Extract desks removed from scope modules
  const deskMod = scopeMods.find(m => m.category === 'desks' || m.type === 'remove' || m.title.toLowerCase().includes('workstation') || m.unitDelta.includes('Desk'));
  const desksRemoved = deskMod ? Math.abs(parseInt(deskMod.unitDelta.replace(/[^0-9]/g, ''), 10) || 54) : 54;
  
  // Real-time calculation of desk removal ratio
  const deskRemovalRatio = ((desksRemoved / selectedPlannedDesks) * 100).toFixed(1);
  const exceedsDeskRule = Number(deskRemovalRatio) > 40;
  const remainingDesks = Math.max(0, selectedPlannedDesks - desksRemoved);

  // Density calculation
  const density = (selectedUSF / selectedPlannedDesks).toFixed(1);
  const targetRatePerSqFt = ((selectedBudget * 100000) / selectedUSF).toFixed(1);

  // Conference room, pod, pantry counts for scaling costs
  const confRoomMod = scopeMods.find(m => m.category === 'civil' || m.title.toLowerCase().includes('conf') || m.title.toLowerCase().includes('board') || m.title.toLowerCase().includes('room'));
  const confQty = confRoomMod ? (parseInt(confRoomMod.unitDelta.replace(/[^0-9]/g, ''), 10) || 1) : 1;

  const podMod = scopeMods.find(m => m.category === 'pod' || m.title.toLowerCase().includes('pod') || m.title.toLowerCase().includes('booth'));
  const podQty = podMod ? (parseInt(podMod.unitDelta.replace(/[^0-9]/g, ''), 10) || 3) : 3;

  const pantryMod = scopeMods.find(m => m.category === 'pantry' || m.title.toLowerCase().includes('pantry') || m.title.toLowerCase().includes('cafe'));
  const pantryQty = pantryMod ? (parseInt(pantryMod.unitDelta.replace(/[^0-9]/g, ''), 10) || 1) : 1;

  // Dynamic cost engine
  const areaRatio = selectedUSF / 8500;
  const civilCost = +(14.80 * (confQty / 1) * (0.8 + 0.2 * areaRatio)).toFixed(2);
  const mepCost = +(9.40 * (pantryQty / 1) * (0.7 + 0.3 * (desksRemoved / 54))).toFixed(2);
  const ffeCost = +(6.95 * (podQty / 3) * (0.8 + 0.2 * areaRatio)).toFixed(2);
  const demoCost = +(2.48 * (desksRemoved / 54) * (0.5 + 0.5 * areaRatio)).toFixed(2);
  const subtotalBeforeMarkup = +(civilCost + mepCost + ffeCost + demoCost).toFixed(2);

  const markupMultiplier = markupFactor === 18 ? 1.00 : 1.017;
  const indicativeCost = +(subtotalBeforeMarkup * markupMultiplier).toFixed(2);
  const varianceAmount = +(indicativeCost - selectedBudget).toFixed(2);
  const variancePct = Math.abs((varianceAmount / selectedBudget) * 100).toFixed(1);
  const effectiveRatePerSqFt = ((indicativeCost * 100000) / selectedUSF).toFixed(1);

  // Handlers for modifying scope items
  const handleUpdateScopeMod = (id: string, field: keyof ScopeModification, value: any) => {
    setScopeMods(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unitDelta') {
          updated.type = String(value).startsWith('-') ? 'remove' : 'add';
        }
        return updated;
      }
      return item;
    }));
  };

  const handleAddScopeMod = () => {
    const newId = `mod-${Date.now()}`;
    const newMod: ScopeModification = {
      id: newId,
      title: 'Conf. Room (6P)',
      unitDelta: '+1 Unit',
      description: 'Double-glazed acoustic partitioning',
      subTrade: 'Sub-trade: Civil & Glazing',
      iconName: 'meeting_room',
      type: 'add',
      category: 'civil',
    };
    setScopeMods(prev => [...prev, newMod]);
  };

  const handleRemoveScopeMod = (id: string) => {
    if (scopeMods.length <= 1) return;
    setScopeMods(prev => prev.filter(item => item.id !== id));
  };

  const handleResetToDefaults = () => {
    setSelectedAsset('WeWork Galaxy, Bangalore');
    setSelectedSuite('Suite 502 • BLR-CBD-43');
    setSelectedAssetClass('Grade-A IT');
    setSelectedClient('Acme FinTech Ltd');
    setSelectedTenancyTerm('24 Months');
    setSelectedDeliverySLA('30 Days (Standard SLA)');
    setSelectedUSF(8500);
    setSelectedPlannedDesks(120);
    setSelectedBudget(30.00);
    setSelectedCapType('Hard Client Cap');
    setScopeMods(INITIAL_SCOPE_MODIFICATIONS);
  };

  const handleSyncAirtable = () => {
    setIsAirtableSyncing(true);
    setTimeout(() => {
      setIsAirtableSyncing(false);
      setAirtableSynced(true);
    }, 1000);
  };

  const showToast = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              Stage 1 Automation
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Ported from Twinkal Kale’s Sales &amp; Feasibility Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-headline">
            Sales Feasibility &amp; High-Level Cost Modeling
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Autonomous 4-layer validation pipeline: Validates project parameters, evaluates spatial demolition feasibility, applies regression rules, and generates executive first-pass estimations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowProjectDetails}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            View Project Details
          </button>
          <button
            onClick={handleSyncAirtable}
            disabled={isAirtableSyncing}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            {isAirtableSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            ) : airtableSynced ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Database className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span>{airtableSynced ? 'Synced to Airtable Queue' : 'Sync Request Queue'}</span>
          </button>

          <button
            id="btn-stage1-proceed"
            onClick={onProceedToStage2}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <span>Proceed to Stage 2: Detailed BOQ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportNotice && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg flex items-center justify-between animate-fade-in">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="text-slate-400 hover:text-white ml-3 text-xs">Dismiss</button>
        </div>
      )}

      {/* ================= LAYER 1 ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              L1
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Layer 1: Project Scope &amp; Commercial Configuration
              </h3>
              <p className="text-[11px] text-slate-500">
                Asset metadata, occupancy targets, client budget constraints &amp; requested deltas (Fully selectable inputs)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Reset all inputs to WeWork Galaxy default values"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset Defaults</span>
            </button>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Dropdown Inputs Active
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Space Configuration Banner */}
          {activeProject && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {activeProject.buildingName}
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {activeProject.selectedSpaces.length} {activeProject.selectedSpaces.length === 1 ? 'Office Space' : 'Office Spaces Combined'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    {activeProject.selectedSpaces.map((sp) => (
                      <span
                        key={sp.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-blue-200 text-slate-700 font-medium flex items-center gap-1 shadow-2xs"
                      >
                        <span className="font-bold text-blue-900">{sp.suiteCode}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">{sp.usf.toLocaleString()} USF</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 font-semibold">{sp.plannedDesks} D</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  id="btn-stage1-change-spaces"
                  onClick={onOpenNewProject}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 hover:border-blue-500 text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select / Add Spaces</span>
                </button>
              </div>
            </div>
          )}

          {/* Metadata Cards Grid - All inputs selectable from dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Asset & Location */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Asset &amp; Location
                  </span>
                  <span className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Select</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[10px] text-slate-400 font-medium">Building / Property</label>
                      <span className="text-[9px] font-semibold text-blue-600">{currentBuildingAsset.city} • {currentBuildingAsset.region}</span>
                    </div>
                    <div className="relative">
                      <select
                        id="select-asset"
                        value={selectedAsset}
                        onChange={(e) => handleAssetChange(e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors cursor-pointer shadow-2xs"
                      >
                        {BUILDINGS_CATALOG.map((bld) => (
                          <option key={bld.id} value={bld.name}>
                            {bld.name} ({bld.city})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Office Space / Reservable Unit</label>
                    <div className="relative">
                      <select
                        id="select-suite"
                        value={selectedSuite}
                        onChange={(e) => handleSuiteChange(e.target.value)}
                        className="w-full text-xs text-slate-700 font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors cursor-pointer shadow-2xs"
                      >
                        {buildingSpaces.map((sp) => (
                          <option key={sp.id} value={sp.suiteCode}>
                            {sp.suiteCode} • {sp.floorName} • {sp.usf.toLocaleString()} Sq.Ft • {sp.plannedDesks} D • {sp.reservableType} • Win: {sp.hasWindowLabel}
                          </option>
                        ))}
                        {buildingSpaces.length === 0 && (
                          <option value={selectedSuite}>{selectedSuite}</option>
                        )}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Floor Level</label>
                  <div className="relative">
                    <select
                      id="select-floor"
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="w-full text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 pr-6 appearance-none hover:border-blue-400 focus:border-blue-500 outline-none transition-colors cursor-pointer"
                    >
                      {buildingFloors.map((fl) => (
                        <option key={fl} value={fl}>{fl}</option>
                      ))}
                      {buildingFloors.length === 0 && <option value="Ground Floor">Ground Floor</option>}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Asset Class</label>
                  <div className="relative">
                    <select
                      id="select-asset-class"
                      value={selectedAssetClass}
                      onChange={(e) => setSelectedAssetClass(e.target.value)}
                      className="w-full text-[11px] font-mono font-bold text-blue-700 bg-blue-50/70 border border-blue-200 rounded-lg px-2 py-1 pr-6 appearance-none hover:border-blue-400 focus:border-blue-500 outline-none transition-colors cursor-pointer"
                    >
                      {ASSET_CLASS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-blue-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Client Commercials */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    Client Commercials
                  </span>
                  <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">Select</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Enterprise Client</label>
                    <div className="relative">
                      <select
                        id="select-client"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer shadow-2xs"
                      >
                        {CLIENT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Tenancy Duration</label>
                    <div className="relative">
                      <select
                        id="select-tenancy-term"
                        value={selectedTenancyTerm}
                        onChange={(e) => setSelectedTenancyTerm(e.target.value)}
                        className="w-full text-xs text-slate-700 font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer shadow-2xs"
                      >
                        {TENANCY_TERM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>Tenancy Term: {opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80">
                <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Turnaround Target</label>
                <div className="relative">
                  <select
                    id="select-delivery-sla"
                    value={selectedDeliverySLA}
                    onChange={(e) => setSelectedDeliverySLA(e.target.value)}
                    className="w-full text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200 rounded-lg px-2.5 py-1 pr-7 appearance-none hover:border-emerald-400 focus:border-emerald-500 outline-none transition-colors cursor-pointer"
                  >
                    {DELIVERY_SLA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>Delivery SLA: {opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Card 3: Spatial Specs & Reservable Characteristics */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-purple-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                    Space Characteristics
                  </span>
                  <span className="text-[9px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">Reservables Base</span>
                </div>

                <div className="space-y-2">
                  {/* Reservable Type Dropdown */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Reservable Space Type</label>
                    <div className="relative">
                      <select
                        id="select-reservable-type"
                        value={selectedReservableType}
                        onChange={(e) => setSelectedReservableType(e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-purple-400 focus:border-purple-500 outline-none transition-colors cursor-pointer shadow-2xs"
                      >
                        {RESERVABLES_TYPES.filter(t => t !== 'All Types').map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Window View / Natural Light Dropdown */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Natural Light / Window View</label>
                    <div className="relative">
                      <select
                        id="select-window-view"
                        value={selectedWindow}
                        onChange={(e) => setSelectedWindow(e.target.value)}
                        className="w-full text-xs text-slate-700 font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-purple-400 focus:border-purple-500 outline-none transition-colors cursor-pointer shadow-2xs"
                      >
                        {WINDOW_OPTIONS.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Area (Sq. Ft)</label>
                      <input
                        type="number"
                        id="input-usf"
                        value={selectedUSF}
                        onChange={(e) => setSelectedUSF(Number(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none hover:border-purple-400 focus:border-purple-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Capacity (Desks)</label>
                      <input
                        type="number"
                        id="input-planned-desks"
                        value={selectedPlannedDesks}
                        onChange={(e) => setSelectedPlannedDesks(Number(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none hover:border-purple-400 focus:border-purple-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-white p-1.5 px-2.5 rounded-lg border border-slate-200">
                  <span>Density:</span>
                  <span className="font-mono font-bold text-purple-700">{density} USF/Seat</span>
                </div>
                {selectedMarketPrice > 0 && (
                  <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-800 bg-emerald-50/70 p-1 px-2.5 rounded-lg border border-emerald-200/60">
                    <span>Base Market Rent:</span>
                    <span className="font-mono font-bold">₹{(selectedMarketPrice / 100000).toFixed(2)} L/mo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: Target Budget Ceiling */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:border-blue-400 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-700 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-700" />
                    Target Budget Ceiling
                  </span>
                  <span className="text-[9px] font-mono text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">Select</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-blue-900/60 block mb-0.5 font-medium">Capex Budget Ceiling</label>
                    <div className="relative">
                      <select
                        id="select-target-budget"
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(Number(e.target.value))}
                        className="w-full text-xs font-black text-blue-950 bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors cursor-pointer shadow-2xs font-mono"
                      >
                        {TARGET_BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>₹{opt.toFixed(2)} Lakhs Target</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="text-xs text-blue-800 font-mono font-semibold px-2 py-1 bg-white/70 rounded border border-blue-100 flex items-center justify-between">
                    <span className="text-[10px] font-normal text-blue-600">Target Rate:</span>
                    <span>₹{targetRatePerSqFt} / sq.ft</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-200/60">
                <label className="text-[10px] text-blue-900/60 block mb-0.5 font-medium">Budget Enforcement Model</label>
                <div className="relative">
                  <select
                    id="select-cap-type"
                    value={selectedCapType}
                    onChange={(e) => setSelectedCapType(e.target.value)}
                    className="w-full text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200 rounded-lg px-2.5 py-1 pr-7 appearance-none hover:border-amber-400 focus:border-amber-500 outline-none transition-colors cursor-pointer"
                  >
                    {CAP_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Requested Scope Modifications (Selectable Dropdown Modules) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Requested Scope Modification Modules
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    {scopeMods.length} Active Items
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Client design adjustments for {selectedSuite} • Select titles, deltas, specs &amp; sub-trades from dropdowns
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-add-scope-item"
                  onClick={handleAddScopeMod}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Scope Item</span>
                </button>
              </div>
            </div>

            {/* Scope Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {scopeMods.map((mod) => {
                const isRemoval = mod.unitDelta.startsWith('-') || mod.type === 'remove';
                const deltaOptions = isRemoval ? REMOVE_DESK_DELTA_OPTIONS : ADD_UNIT_DELTA_OPTIONS;

                return (
                  <div
                    key={mod.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between gap-2.5 relative group"
                  >
                    {/* Top Row: Module Title Dropdown & Unit Delta Dropdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="relative flex-1">
                          <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold uppercase">Scope Element</label>
                          <select
                            value={mod.title}
                            onChange={(e) => handleUpdateScopeMod(mod.id, 'title', e.target.value)}
                            className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 pr-6 appearance-none hover:border-blue-400 focus:border-blue-500 focus:bg-white outline-none transition-colors cursor-pointer"
                          >
                            {MODULE_TITLE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-[22px] pointer-events-none" />
                        </div>

                        {scopeMods.length > 1 && (
                          <button
                            onClick={() => handleRemoveScopeMod(mod.id)}
                            className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors mt-3"
                            title="Remove this scope modification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Quantity / Delta Dropdown */}
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold uppercase">Unit Delta</label>
                        <div className="relative">
                          <select
                            value={mod.unitDelta}
                            onChange={(e) => handleUpdateScopeMod(mod.id, 'unitDelta', e.target.value)}
                            className={`w-full text-xs font-extrabold font-mono px-2.5 py-1 pr-6 rounded-lg border appearance-none transition-colors cursor-pointer outline-none ${
                              isRemoval
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400 focus:border-rose-500'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400 focus:border-emerald-500'
                            }`}
                          >
                            {deltaOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                            isRemoval ? 'text-rose-500' : 'text-emerald-600'
                          }`} />
                        </div>
                      </div>

                      {/* Specification Dropdown */}
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold uppercase">Specification / Detail</label>
                        <div className="relative">
                          <select
                            value={mod.description}
                            onChange={(e) => handleUpdateScopeMod(mod.id, 'description', e.target.value)}
                            className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1.5 pr-6 appearance-none hover:border-blue-400 focus:border-blue-500 outline-none transition-colors cursor-pointer"
                          >
                            {SPECIFICATION_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Sub-trade Dropdown */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="relative">
                        <select
                          value={mod.subTrade}
                          onChange={(e) => handleUpdateScopeMod(mod.id, 'subTrade', e.target.value)}
                          className="w-full text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 pr-6 appearance-none hover:border-blue-400 focus:border-blue-500 outline-none transition-colors cursor-pointer"
                        >
                          {SUB_TRADE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= LAYER 2 ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              L2
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Layer 2: Validation &amp; Processing Engine
              </h3>
              <p className="text-[11px] text-slate-500">
                Rule engine evaluation, layout plan demolition takeoffs &amp; MEP impact analysis
              </p>
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
            exceedsDeskRule
              ? 'text-amber-800 bg-amber-100 border-amber-200'
              : 'text-emerald-800 bg-emerald-100 border-emerald-200'
          }`}>
            {exceedsDeskRule ? <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{exceedsDeskRule ? 'Desk Ratio Warning' : 'Desk Ratio Compliant'}</span>
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* 4 Health & Ratio Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="text-[11px] font-medium text-slate-500">Scope Completeness</div>
              <div className="text-xl font-extrabold text-emerald-700 font-headline mt-1">100%</div>
              <div className="text-[10px] text-slate-400 mt-1">All parameters populated</div>
            </div>

            <div className={`p-4 rounded-xl border ${exceedsDeskRule ? 'border-amber-200 bg-amber-50/40' : 'border-emerald-200 bg-emerald-50/40'}`}>
              <div className={`text-[11px] font-medium flex items-center gap-1 ${exceedsDeskRule ? 'text-amber-800' : 'text-emerald-800'}`}>
                <span>Desk Removal Ratio</span>
                <Info className={`w-3 h-3 ${exceedsDeskRule ? 'text-amber-600' : 'text-emerald-600'}`} />
              </div>
              <div className={`text-xl font-extrabold font-headline mt-1 ${exceedsDeskRule ? 'text-amber-800' : 'text-emerald-800'}`}>
                {deskRemovalRatio}%
              </div>
              <div className={`text-[10px] font-bold mt-1 ${exceedsDeskRule ? 'text-amber-700' : 'text-emerald-700'}`}>
                {exceedsDeskRule ? 'Exceeds 40% Max Rule' : 'Compliant (<40% Max Rule)'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="text-[11px] font-medium text-slate-500">Feasibility Score</div>
              <div className="text-xl font-extrabold text-slate-800 font-headline mt-1">
                {exceedsDeskRule ? '74 / 100' : '92 / 100'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {exceedsDeskRule ? 'Conditional approval req.' : 'Automated Green Pass'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="text-[11px] font-medium text-slate-500">MEP &amp; Wall Impact</div>
              <div className={`text-xl font-extrabold font-headline mt-1 ${exceedsDeskRule ? 'text-rose-700' : 'text-amber-700'}`}>
                {exceedsDeskRule ? 'High' : 'Moderate'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Sprinklers &amp; Riser reroutes</div>
            </div>
          </div>

          {/* Alert Message Box */}
          {exceedsDeskRule ? (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="font-bold text-amber-950">High Desk Reduction Ratio Alert ({deskRemovalRatio}% &gt; 40.0% Standard Threshold): </strong>
                Converting {desksRemoved} open workstations into enclosed rooms and expanded wet pantry triggers significant MEP HVAC rerouting ({Math.round(desksRemoved * 0.33)} diffuser shifts) and sprinkler zoning. Requires engineering override sign-off.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong className="font-bold text-emerald-950">Desk Reduction Ratio Compliant ({deskRemovalRatio}% ≤ 40.0% Threshold): </strong>
                Converting {desksRemoved} workstations maintains balanced HVAC distribution and standard airflow balance across the {selectedUSF.toLocaleString()} USF floorplate. No special structural engineering override required.
              </div>
            </div>
          )}

          {/* Spatial Blueprint & Demolition Schematic */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Spatial Layout &amp; Demolition Schematic Takeoff ({selectedAsset})
                </h4>
                <p className="text-[11px] text-slate-500">Visual mapping of stripped workstations, pod footprints and acoustic partitions for {selectedClient}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                AutoCAD / Revit Sync: Ready
              </span>
            </div>

            {/* Interactive SVG Floor Plan Schematic */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-hidden relative">
              <svg
                viewBox="0 0 850 320"
                className="w-full h-auto max-h-[300px] select-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="850" height="320" fill="url(#grid)" />

                {/* Outer Perimeter */}
                <rect x="20" y="20" width="810" height="280" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" rx="8" />

                {/* Building Core & Wet Riser Stack */}
                <rect x="20" y="20" width="160" height="130" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                <text x="100" y="75" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700">SERVICE CORE</text>
                <text x="100" y="95" textAnchor="middle" fill="#64748b" fontSize="10">AHU &amp; Riser 4B</text>

                {/* Pantry Expansion Area (Wet Works) */}
                <rect x="180" y="20" width="180" height="130" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                <rect x="190" y="30" width="160" height="30" fill="#bfdbfe" rx="4" />
                <text x="270" y="50" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="700">WET PANTRY EXPANSION</text>
                <text x="270" y="90" textAnchor="middle" fill="#2563eb" fontSize="10">+{pantryQty} Zone (+150 sqft)</text>
                <text x="270" y="110" textAnchor="middle" fill="#3b82f6" fontSize="9">Plumbing Shift + Drainage</text>

                {/* Demolished Open Desks Zone */}
                <rect x="380" y="20" width="430" height="140" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 3" />
                <text x="595" y="55" textAnchor="middle" fill="#be123c" fontSize="13" fontWeight="800">
                  DEMOLITION &amp; STRIP ZONE (-{desksRemoved} DESKS)
                </text>
                <text x="595" y="78" textAnchor="middle" fill="#e11d48" fontSize="11">
                  {Math.round(selectedUSF * (desksRemoved / selectedPlannedDesks))} USF Affected ({deskRemovalRatio}% Floorplate Strip)
                </text>
                {/* Removed desks markers */}
                <g opacity="0.6">
                  {[0, 1, 2, 3, 4, 5].map((col) => (
                    <rect key={col} x={410 + col * 65} y={100} width="50" height="40" fill="#fecdd3" stroke="#fda4af" rx="2" />
                  ))}
                </g>

                {/* Conference Room (New Acoustic Glazing) */}
                <rect x="40" y="170" width="220" height="115" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                <text x="150" y="210" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="700">
                  {confRoomMod ? confRoomMod.title : 'CONF. ROOM'}
                </text>
                <text x="150" y="230" textAnchor="middle" fill="#16a34a" fontSize="10">Double Acoustic Glazed 12mm</text>
                <text x="150" y="250" textAnchor="middle" fill="#4ade80" fontSize="9">HVAC VAV Tap + Sprinklers</text>

                {/* Focus Pods */}
                <g>
                  {Array.from({ length: Math.min(podQty, 3) }).map((_, idx) => (
                    <g key={idx}>
                      <rect x={280 + idx * 85} y={170} width="70" height="115" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" rx="6" />
                      <text x={315 + idx * 85} y={210} textAnchor="middle" fill="#6d28d9" fontSize="11" fontWeight="700">POD {idx + 1}</text>
                      <text x={315 + idx * 85} y={230} textAnchor="middle" fill="#7c3aed" fontSize="9">Modular</text>
                      <text x={315 + idx * 85} y={250} textAnchor="middle" fill="#8b5cf6" fontSize="8">Plug &amp; Play</text>
                    </g>
                  ))}
                </g>

                {/* Remaining Linear Workstations */}
                <rect x="555" y="180" width="255" height="105" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="682" y="220" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
                  RETAINED WORKSTATIONS ({remainingDesks} DESKS)
                </text>
                <text x="682" y="240" textAnchor="middle" fill="#64748b" fontSize="10">
                  Linear Benches • Retained Trunking
                </text>
              </svg>
            </div>

            {/* Spatial Takeoff Metrics Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Demising Wall Length</span>
                <div className="text-sm font-bold text-slate-800 font-mono">{Math.round(142 * (selectedUSF / 8500))} RMT</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">HVAC Diffuser Shifts</span>
                <div className="text-sm font-bold text-amber-700 font-mono">{Math.round(18 * (desksRemoved / 54))} Points</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Sprinkler Drops Relocated</span>
                <div className="text-sm font-bold text-blue-700 font-mono">{Math.round(12 * (selectedUSF / 8500))} Heads</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Structured Cabling</span>
                <div className="text-sm font-bold text-slate-800 font-mono">{Math.round(48 * (remainingDesks / 66))} Cat6A Drops</div>
              </div>
            </div>

            {/* Sign-off override checkbox */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-override"
                  checked={overrideAcknowledged}
                  onChange={(e) => setOverrideAcknowledged(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">
                  I acknowledge high desk removal ratio ({deskRemovalRatio}%) and approve MEP trunking revisions for fast-track turnaround.
                </span>
              </label>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 block font-mono">Digitally Approved By:</span>
                <span className="text-xs font-bold text-slate-800">Twinkal K. (Sales Lead)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LAYER 3 & 4 COMBINED ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* ================= LAYER 3 ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              L3
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Layer 3: Costing Engine (Independent Calculation Rules)
              </h3>
              <p className="text-[11px] text-slate-500">
                Decoupled trade cost rules, historical regression dataset matching &amp; selectable markup factors
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            R² = 0.94 Match
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Historical Dataset Matcher */}
          <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Historical Fit-out Regression Matcher
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Calibrated against <strong>1,000+ commercial fit-outs</strong> in Bangalore CBD. Historical average for similar {selectedUSF.toLocaleString()} USF specs: <strong>₹{(selectedBudget * 0.95).toFixed(2)}L</strong> (Range: ₹{(selectedBudget * 0.90).toFixed(2)}L – ₹{(selectedBudget * 1.05).toFixed(2)}L).
              </p>
            </div>

            {/* Markup Factor Selector */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex-shrink-0">
              <span className="text-xs font-semibold text-slate-500">Markup Factor:</span>
              <button
                id="btn-markup-18"
                onClick={() => setMarkupFactor(18)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  markupFactor === 18
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                18% Aggressive
              </button>
              <button
                id="btn-markup-20"
                onClick={() => setMarkupFactor(20)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  markupFactor === 20
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                20% Standard
              </button>
            </div>
          </div>

          {/* 4 Modular Decoupled Cost Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Civil &amp; Partitions</span>
                <span className="text-[10px] font-mono font-bold text-blue-600">
                  {((civilCost / subtotalBeforeMarkup) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">₹{civilCost.toFixed(2)} Lakhs</div>
              <p className="text-[11px] text-slate-500 mt-1">Acoustic glass {Math.round(142 * areaRatio)} RMT &amp; plaster demising</p>
            </div>

            {/* Category 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>MEP &amp; HVAC Shifts</span>
                <span className="text-[10px] font-mono font-bold text-amber-600">
                  {((mepCost / subtotalBeforeMarkup) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">₹{mepCost.toFixed(2)} Lakhs</div>
              <p className="text-[11px] text-slate-500 mt-1">{Math.round(18 * (desksRemoved / 54))} diffuser shifts, sprinkler loops &amp; riser</p>
            </div>

            {/* Category 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Modular FFE &amp; Pods</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600">
                  {((ffeCost / subtotalBeforeMarkup) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">₹{ffeCost.toFixed(2)} Lakhs</div>
              <p className="text-[11px] text-slate-500 mt-1">{podQty}x acoustic pods &amp; collaboration loose items</p>
            </div>

            {/* Category 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Demolition &amp; Enabling</span>
                <span className="text-[10px] font-mono font-bold text-rose-600">
                  {((demoCost / subtotalBeforeMarkup) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">₹{demoCost.toFixed(2)} Lakhs</div>
              <p className="text-[11px] text-slate-500 mt-1">{desksRemoved} desk salvage strip &amp; debris carting</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LAYER 4 ================= */}
      <section className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-white/20 text-white font-mono font-bold text-xs flex items-center justify-center">
              L4
            </span>
            <div>
              <h3 className="text-base font-bold font-headline">
                Layer 4: Output &amp; Decision Section (First-Pass Estimate)
              </h3>
              <p className="text-xs text-blue-200">
                Executive cost outcome, variance bounds against target budget &amp; key cost drivers
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-blue-200">Total Indicative Cost</div>
            <div className="text-2xl font-black font-mono">₹{indicativeCost.toFixed(2)} Lakhs</div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Variance Readout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Indicative First-Pass Rate</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                ₹{effectiveRatePerSqFt} <span className="text-xs font-normal text-slate-500">/ sq.ft</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Based on {selectedUSF.toLocaleString()} USF usable floor area</p>
            </div>

            <div className={`p-4 rounded-xl border ${varianceAmount > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'}`}>
              <span className={`text-xs font-medium ${varianceAmount > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                Variance vs Target Budget (₹{selectedBudget.toFixed(2)}L)
              </span>
              <div className={`text-2xl font-extrabold font-mono mt-1 ${varianceAmount > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                {varianceAmount >= 0 ? `+₹${varianceAmount.toFixed(2)} Lakhs` : `-₹${Math.abs(varianceAmount).toFixed(2)} Lakhs`}
              </div>
              <p className={`text-[11px] mt-1 ${varianceAmount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {varianceAmount >= 0 ? `+${variancePct}% variance from target ceiling` : `${variancePct}% under target ceiling`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Model Confidence Bound</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                88% <span className="text-xs font-normal text-slate-500">(±4.5%)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Contingent on site MEP riser audit</p>
            </div>
          </div>

          {/* Budget Meter Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
              <span>Budget Distribution (Client Ceiling: ₹{selectedBudget.toFixed(2)} Lakhs • {selectedCapType})</span>
              <span className="font-mono font-bold text-slate-900">₹{indicativeCost.toFixed(2)}L / ₹{selectedBudget.toFixed(2)}L</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${Math.min(100, Math.round((selectedBudget / Math.max(selectedBudget, indicativeCost)) * 75))}%` }} className="bg-blue-600 h-full" title={`Target Budget Ceiling: ₹${selectedBudget.toFixed(2)}L`}></div>
              <div style={{ width: `${Math.min(25, Math.max(5, Math.round((Math.abs(varianceAmount) / Math.max(selectedBudget, indicativeCost)) * 25)))}%` }} className={varianceAmount > 0 ? "bg-amber-500 h-full" : "bg-emerald-500 h-full"} title={`Variance Delta: ${varianceAmount >= 0 ? '+' : '-' }₹${Math.abs(varianceAmount).toFixed(2)}L`}></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Base Ceiling (₹{selectedBudget.toFixed(2)}L)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${varianceAmount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <span>Scope Delta ({varianceAmount >= 0 ? '+' : '-'}₹{Math.abs(varianceAmount).toFixed(2)}L)</span>
              </div>
              <span>Total: ₹{indicativeCost.toFixed(2)}L</span>
            </div>
          </div>

          {/* Visibility into Major Cost Drivers */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Identified Primary Cost Drivers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Wet Services &amp; Drainage Shift</div>
                  <div className="text-[11px] text-slate-500">Pantry expansion core riser connection ({pantryQty} zone)</div>
                </div>
                <span className="text-xs font-extrabold text-amber-700 font-mono">+₹{(1.85 * (pantryQty / 1)).toFixed(2)} Lakhs</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Acoustic Glass Partitioning</div>
                  <div className="text-[11px] text-slate-500">12mm toughened glazing for {confRoomMod ? confRoomMod.title : 'Conf Room'}</div>
                </div>
                <span className="text-xs font-extrabold text-blue-700 font-mono">+₹{(1.40 * (confQty / 1)).toFixed(2)} Lakhs</span>
              </div>
            </div>
          </div>

          {/* Export & Next Stage CTA */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                id="btn-export-pdf"
                onClick={() => showToast('Exporting Stage 1 Feasibility Briefing (.pdf)...')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Export Briefing (.pdf)
              </button>
              <button
                id="btn-export-excel"
                onClick={() => showToast('Exporting Stage 1 Feasibility Data (.xlsx)...')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Export Excel (.xlsx)
              </button>
            </div>

            <button
              id="btn-stage1-next"
              onClick={onProceedToStage2}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <span>Transition to Stage 2: Layout AI Diff &amp; Detailed BOQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      </div>
      {/* ================= END LAYER 3 & 4 ================= */}
    </div>
  );
};
