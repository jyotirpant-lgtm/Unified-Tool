import React, { useState, useId } from 'react';
import { 
  Building2, 
  MapPin, 
  Check, 
  Plus, 
  Layers, 
  Sparkles, 
  X, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  CheckSquare, 
  Square, 
  ArrowRight,
  User,
  Briefcase,
  Sun,
  Filter
} from 'lucide-react';
import { Project, BuildingAsset, OfficeSpace } from '../types';
import { RESERVABLES_MARKETS, RESERVABLES_TYPES } from '../data/reservablesCatalog';
import { BUILDINGS_CATALOG } from '../data/mockData';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: Project;
  allProjects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (newProject: Project) => void;
  initialMode?: 'create' | 'switch';
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  allProjects,
  onSelectProject,
  onCreateProject,
  initialMode = 'create',
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'switch'>(initialMode);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    activeProject ? activeProject.buildingId : BUILDINGS_CATALOG[0].id
  );
  const [selectedMarket, setSelectedMarket] = useState<string>('All Markets');
  const [buildingSearchQuery, setBuildingSearchQuery] = useState<string>('');
  const [spaceTypeFilter, setSpaceTypeFilter] = useState<string>('All Types');
  const [windowOnlyFilter, setWindowOnlyFilter] = useState<boolean>(false);

  // Form states for new project
  const [clientName, setClientName] = useState<string>('');
  const [projectCode, setProjectCode] = useState<string>(() => `BLR-${Math.floor(600 + Math.random() * 300)}`);
  const [tenancyTerm, setTenancyTerm] = useState<string>('24 Months');
  const [deliverySLA, setDeliverySLA] = useState<string>('24 Days (Express Buildout)');
  const [targetBudget, setTargetBudget] = useState<number>(30.0);
  const [capType, setCapType] = useState<string>('Hard Client Cap');

  // Multi-space selection IDs
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const clientNameId = useId();
  const projectCodeId = useId();
  const tenancyTermId = useId();
  const deliverySLAId = useId();
  const targetBudgetId = useId();
  const capTypeId = useId();

  if (!isOpen) return null;

  const currentBuilding = BUILDINGS_CATALOG.find((b) => b.id === selectedBuildingId) || BUILDINGS_CATALOG[0];

  // Quick pick clients
  const PRESET_CLIENTS = [
    'Acme Corp',
    'Razorpay Enterprise',
    'Zerodha Capital',
    'Uber Technologies',
    'PhonePe Private Ltd',
    'Swiggy Tech Hub',
    'CRED Experiences',
    'Infosys Digital Hub'
  ];

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    // When changing building, clear space selection or select first space as default
    const newBld = BUILDINGS_CATALOG.find((b) => b.id === buildingId);
    if (newBld && newBld.availableSpaces.length > 0) {
      setSelectedSpaceIds([newBld.availableSpaces[0].id]);
    } else {
      setSelectedSpaceIds([]);
    }
  };

  const handleToggleSpace = (spaceId: string) => {
    setSelectedSpaceIds((prev) => {
      if (prev.includes(spaceId)) {
        return prev.filter((id) => id !== spaceId);
      } else {
        return [...prev, spaceId];
      }
    });
  };

  const handleSelectAllSpacesInBuilding = () => {
    const allIds = currentBuilding.availableSpaces.map((s) => s.id);
    setSelectedSpaceIds(allIds);
  };

  const handleClearAllSpaces = () => {
    setSelectedSpaceIds([]);
  };

  // Aggregated calculations for selected spaces
  const selectedSpaces: OfficeSpace[] = currentBuilding.availableSpaces.filter((s) =>
    selectedSpaceIds.includes(s.id)
  );

  const totalSelectedUSF = selectedSpaces.reduce((acc, s) => acc + s.usf, 0);
  const totalPlannedDesks = selectedSpaces.reduce((acc, s) => acc + s.plannedDesks, 0);
  const combinedDensity = totalPlannedDesks > 0 ? Number((totalSelectedUSF / totalPlannedDesks).toFixed(1)) : 0;
  const totalMarketRent = selectedSpaces.reduce((acc, s) => acc + (s.marketPrice || (s.usf * s.baseRatePerSqFt)), 0);

  // Filtered buildings based on market and search query
  const filteredBuildings = BUILDINGS_CATALOG.filter((bld) => {
    const matchesMarket = selectedMarket === 'All Markets' || bld.market === selectedMarket || bld.city.toLowerCase() === selectedMarket.toLowerCase();
    const matchesSearch = !buildingSearchQuery || 
      bld.name.toLowerCase().includes(buildingSearchQuery.toLowerCase()) || 
      bld.city.toLowerCase().includes(buildingSearchQuery.toLowerCase()) || 
      bld.microMarket.toLowerCase().includes(buildingSearchQuery.toLowerCase());
    return matchesMarket && matchesSearch;
  });

  // Filtered available spaces for current building
  const filteredSpaces = currentBuilding.availableSpaces.filter((space) => {
    const matchesType = spaceTypeFilter === 'All Types' || space.reservableType === spaceTypeFilter;
    const matchesWindow = !windowOnlyFilter || space.hasWindow;
    return matchesType && matchesWindow;
  });

  const handleCreateAndLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const finalClient = clientName.trim() || 'New Enterprise Client';

    if (selectedSpaceIds.length === 0) {
      setValidationError('Please select at least one office space in the selected building.');
      return;
    }

    setValidationError(null);

    // Build human-friendly project name from building & suites
    const suiteLabels = selectedSpaces.map((s) => s.suiteCode).join(' & ');
    const projectName = `${currentBuilding.name.split(',')[0]} — ${suiteLabels || 'Custom Wing'}`;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      code: projectCode.trim() || `PRJ-${Math.floor(100 + Math.random() * 899)}`,
      name: projectName,
      clientName: finalClient,
      buildingId: currentBuilding.id,
      buildingName: currentBuilding.name,
      city: currentBuilding.city,
      selectedSpaceIds: [...selectedSpaceIds],
      selectedSpaces: [...selectedSpaces],
      totalUSF: totalSelectedUSF || 5000,
      plannedDesks: totalPlannedDesks || 70,
      density: combinedDensity || 71.4,
      tenancyTerm,
      deliverySLA,
      targetBudget: Number(targetBudget) || 30.0,
      capType,
      dealStatus: 'Verified Deal',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Space Search &amp; Project Configurator
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Live Multi-Space
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Select commercial building asset and configure multiple office spaces live for client
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
              <button
                type="button"
                id="tab-btn-create-project"
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'create'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                + New Space Project
              </button>
              <button
                type="button"
                id="tab-btn-switch-project"
                onClick={() => setActiveTab('switch')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'switch'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Active Projects ({allProjects.length})
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'create' ? (
          <form onSubmit={handleCreateAndLaunch} className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Section 1: Client & Commercial Terms */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>1. Client &amp; Commercial Requirement</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Auto-populates Layer 1 Feasibility
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Client Name with Quick Preset Pills */}
                  <div className="md:col-span-1 space-y-1.5">
                    <label htmlFor={clientNameId} className="block text-xs font-semibold text-slate-700">
                      Client / Enterprise Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={clientNameId}
                      required
                      placeholder="e.g. Acme Corp, Razorpay"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {PRESET_CLIENTS.slice(0, 4).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setClientName(preset)}
                          className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-600 transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Code & Tenancy Term */}
                  <div className="space-y-1.5">
                    <label htmlFor={projectCodeId} className="block text-xs font-semibold text-slate-700">
                      Project Reference Code
                    </label>
                    <input
                      type="text"
                      id={projectCodeId}
                      value={projectCode}
                      onChange={(e) => setProjectCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <div className="pt-1">
                      <label htmlFor={tenancyTermId} className="block text-[11px] font-medium text-slate-500 mb-1">
                        Tenancy Term
                      </label>
                      <select
                        id={tenancyTermId}
                        value={tenancyTerm}
                        onChange={(e) => setTenancyTerm(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="12 Months">12 Months (Pilot Term)</option>
                        <option value="24 Months">24 Months (Standard Enterprise)</option>
                        <option value="36 Months">36 Months (Preferred Multi-Year)</option>
                        <option value="48 Months">48 Months (Strategic Campus)</option>
                        <option value="60 Months">60 Months (Long-term Anchor)</option>
                      </select>
                    </div>
                  </div>

                  {/* SLA & Target Fit-out Budget */}
                  <div className="space-y-1.5">
                    <label htmlFor={deliverySLAId} className="block text-xs font-semibold text-slate-700">
                      Turnaround Delivery SLA
                    </label>
                    <select
                      id={deliverySLAId}
                      value={deliverySLA}
                      onChange={(e) => setDeliverySLA(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15 Days (Urgent Fast-Track)">15 Days (Urgent Fast-Track)</option>
                      <option value="24 Days (Express Buildout)">24 Days (Express Buildout)</option>
                      <option value="30 Days (Standard SLA)">30 Days (Standard SLA)</option>
                      <option value="45 Days (Phased Handover)">45 Days (Phased Handover)</option>
                      <option value="60 Days (Custom Complex Turnkey)">60 Days (Custom Complex)</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label htmlFor={targetBudgetId} className="block text-[11px] font-medium text-slate-500 mb-1">
                          Budget Cap (₹ Lakhs)
                        </label>
                        <input
                          type="number"
                          id={targetBudgetId}
                          step="1"
                          min="10"
                          max="150"
                          value={targetBudget}
                          onChange={(e) => setTargetBudget(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor={capTypeId} className="block text-[11px] font-medium text-slate-500 mb-1">
                          Cap Protocol
                        </label>
                        <select
                          id={capTypeId}
                          value={capType}
                          onChange={(e) => setCapType(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Hard Client Cap">Hard Client Cap</option>
                          <option value="Flex Capex (+10% Buffer)">Flex Capex (+10%)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Building Selection with Market Filters from Reservables */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>2. Select Prime Commercial Asset / Building</span>
                  </div>
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search building or micromarket..."
                      value={buildingSearchQuery}
                      onChange={(e) => setBuildingSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Market Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                  {RESERVABLES_MARKETS.map((mkt) => {
                    const isActive = selectedMarket === mkt;
                    return (
                      <button
                        key={mkt}
                        type="button"
                        onClick={() => setSelectedMarket(mkt)}
                        className={`text-[11px] px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {mkt}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                  {filteredBuildings.map((bld) => {
                    const isSelected = bld.id === selectedBuildingId;
                    const totalVacantUSF = bld.availableSpaces.reduce((acc, s) => acc + s.usf, 0);

                    return (
                      <button
                        type="button"
                        key={bld.id}
                        id={`bld-card-${bld.id}`}
                        onClick={() => handleSelectBuilding(bld.id)}
                        className={`text-left p-3 rounded-xl border transition-all relative ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                            {bld.name}
                          </h4>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{bld.microMarket} • {bld.city}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {bld.region || bld.assetClass}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {bld.availableSpaces.length} Spaces ({totalVacantUSF.toLocaleString()} USF)
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {filteredBuildings.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-slate-400 text-xs">
                      No buildings match the selected market or search query.
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Multi-Office Space Selection (Core Request!) */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>3. Select Multiple Office Spaces in {currentBuilding.name.split(',')[0]}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select one or more office spaces, wings, or demised suites to combine into this project. Data sourced from Reservables catalog.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      id="btn-select-all-spaces"
                      onClick={handleSelectAllSpacesInBuilding}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      Select All ({currentBuilding.availableSpaces.length})
                    </button>
                    <button
                      type="button"
                      id="btn-clear-spaces"
                      onClick={handleClearAllSpaces}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-500 font-medium transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Space Characteristics Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 p-2 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1">
                      <Filter className="w-3 h-3 text-slate-500" /> Type:
                    </span>
                    {['All Types', 'Standard Office', 'Managed Office', 'Full Floor Office', 'Dynamic Inventory'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSpaceTypeFilter(t)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                          spaceTypeFilter === t
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={windowOnlyFilter}
                      onChange={(e) => setWindowOnlyFilter(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Natural Light / Window Only</span>
                  </label>
                </div>

                {validationError && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Grid of Available Office Spaces for Multi-Select */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {filteredSpaces.map((space) => {
                    const isChecked = selectedSpaceIds.includes(space.id);

                    return (
                      <div
                        key={space.id}
                        id={`space-card-${space.id}`}
                        onClick={() => handleToggleSpace(space.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Custom Checkbox */}
                          <div className="pt-0.5 flex-shrink-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-blue-600 text-white'
                                  : 'border-2 border-slate-300 bg-white hover:border-slate-400'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Space Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                {space.suiteCode}
                              </h5>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  space.fitoutStatus === 'Plug & Play'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : space.fitoutStatus === 'Warm Shell'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {space.fitoutStatus}
                              </span>
                            </div>

                            {/* Reservables Characteristics Badges */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                                {space.floorName || space.wingOrFloor}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 font-semibold text-blue-700 border border-blue-100">
                                {space.reservableType || 'Standard Office'}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 ${
                                space.hasWindow 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-200'
                              }`}>
                                {space.hasWindow && <Sun className="w-2.5 h-2.5 text-amber-500" />}
                                {space.hasWindow ? 'Exterior Window' : 'Internal Room'}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-2 py-1.5 px-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                              <div>
                                <div className="text-[10px] text-slate-400 uppercase font-semibold">Area</div>
                                <div className="text-xs font-bold text-slate-800 font-mono">
                                  {space.usf.toLocaleString()} USF
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</div>
                                <div className="text-xs font-bold text-slate-800 font-mono">
                                  {space.plannedDesks} Desks
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-400 uppercase font-semibold">Market Rent</div>
                                <div className="text-xs font-bold text-emerald-700 font-mono">
                                  {space.marketPrice ? `₹${(space.marketPrice / 100000).toFixed(1)}L/m` : `₹${space.baseRatePerSqFt}/sft`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredSpaces.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                      No spaces in this building match the selected characteristics filter.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Aggregation & Action Bar */}
            <div className="p-4.5 bg-slate-900 text-white border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
              {/* Aggregated Totals */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs w-full md:w-auto">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Selected Spaces</div>
                  <div className="font-bold text-sm text-blue-300 font-mono">
                    {selectedSpaces.length} {selectedSpaces.length === 1 ? 'Space' : 'Spaces'}
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-700 hidden sm:block"></div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Combined USF</div>
                  <div className="font-bold text-sm text-white font-mono">
                    {totalSelectedUSF.toLocaleString()} USF
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-700 hidden sm:block"></div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Combined Desks</div>
                  <div className="font-bold text-sm text-emerald-400 font-mono">
                    {totalPlannedDesks} Desks
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-700 hidden sm:block"></div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Floor Density</div>
                  <div className="font-bold text-sm text-indigo-300 font-mono">
                    {combinedDensity} USF/Seat
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-700 hidden lg:block"></div>

                <div className="hidden lg:block">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Est. Market Rent</div>
                  <div className="font-bold text-sm text-emerald-400 font-mono">
                    ₹{(totalMarketRent / 100000).toFixed(2)} L/mo
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="btn-confirm-create-project"
                  disabled={selectedSpaces.length === 0}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                    selectedSpaces.length > 0
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Launch Live Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Tab 2: Switch Between Existing Projects */
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Active Enterprise Client Projects</h4>
                <p className="text-xs text-slate-500">
                  Switch the active workspace to any client's configured space search.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Space Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allProjects.map((p) => {
                const isActive = p.id === activeProject.id;

                return (
                  <div
                    key={p.id}
                    id={`project-card-${p.id}`}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {p.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{p.clientName}</span>
                        </div>
                        <h5 className="text-xs font-semibold text-slate-700 mt-1">{p.name}</h5>
                      </div>

                      {isActive ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProject(p.id);
                            onClose();
                          }}
                          className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition-colors"
                        >
                          Switch
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{p.buildingName} • {p.city}</span>
                    </div>

                    {/* Selected spaces pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.selectedSpaces.map((sp) => (
                        <span
                          key={sp.id}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                        >
                          {sp.suiteCode} ({sp.usf.toLocaleString()} USF)
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div>
                        <div className="text-[10px] text-slate-400">Total USF</div>
                        <div className="font-bold text-slate-800 font-mono">
                          {p.totalUSF.toLocaleString()} USF
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Capacity</div>
                        <div className="font-bold text-slate-800 font-mono">{p.plannedDesks} Desks</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Delivery SLA</div>
                        <div className="font-bold text-slate-800 font-mono truncate">{p.deliverySLA.split(' ')[0]}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
