export type StageId = 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4';

// Role-based permissions per Section 7.1 of the Engineering Spec
export type UserRole = 
  | 'sales'             // Sales / CS: Stage 1 edit/submit; view Stages 2-4
  | 'architect_supply'  // Architect / Supply: Stage 1 view; Stage 2 edit; Stage 3 edit; Stage 4 view
  | 'approver_trade'    // PM / MEP / Architect (approvers): Stage 3 approve/edit line items
  | 'procurement'       // Procurement: Stage 3 view (post-approval)
  | 'pricing'           // Pricing: Stage 4 edit; Stage 3 view
  | 'sales_head'        // Sales Head: Stage 4 approve
  // Backwards compatibility aliases
  | 'estimator' 
  | 'approver';

// 12-state workflow state machine per Section 6 of the Engineering Spec
export type WorkflowStatus = 
  | 'draft'
  | 'pending_proposal_approval'
  | 'proposal_approved'
  | 'layout_in_progress'
  | 'pending_layout_signoff'
  | 'layout_approved'
  | 'boq_in_progress'
  | 'pending_boq_approval'
  | 'boq_approved'
  | 'pending_deal_structuring'
  | 'pending_sales_head_approval'
  | 'closed';

export type DealDifficulty = 'L1 (Standard)' | 'L2 (Moderate)' | 'L3 (Complex)' | 'L4 (Custom Bespoke)';

export type ConstructionType = 'new_build' | 'reconfiguration';

export type TradeType = 'all' | 'ci' | 'mep' | 'ffe';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  entityType: 'feasibility' | 'boq_line_item' | 'rate_card' | 'approval_gate' | 'deal_structure';
  entityId: string;
  beforeValue?: string;
  afterValue?: string;
  details: string;
}

export interface LayoutDiffItem {
  id: string;
  spaceName: string;
  spaceType: string;
  changeType: 'addition' | 'removal' | 'reconfiguration';
  constructionType: ConstructionType;
  confidence: number; // 0 to 100 from Claude vision API
  manuallyCorrected: boolean;
  notes: string;
}

export interface RateCardItem {
  id: string;
  code: string;
  itemName: string;
  category: 'ci' | 'mep' | 'ffe';
  trade: string;
  unit: string;
  rate: number;
  previousRate?: number;
  effectiveDate: string;
  supersededBy?: string;
  changeReason?: string;
  version: string;
  status: 'Active' | 'Superseded';
}

export interface OfficeSpace {
  id: string;
  suiteCode: string;
  wingOrFloor: string;
  usf: number;
  plannedDesks: number;
  assetClass: string;
  fitoutStatus: 'Plug & Play' | 'Warm Shell' | 'Bare Shell' | 'Partial Fitout';
  baseRatePerSqFt: number;
  description?: string;
  recommendedUse?: string;
  // Reservables sheet characteristics
  reservableType?: string;
  hasWindow?: boolean;
  hasWindowLabel?: 'Yes' | 'Internal Room' | string;
  marketPrice?: number;
  roomType?: string;
  floorName?: string;
  market?: string;
  region?: string;
  confCredits?: string;
}

export interface BuildingAsset {
  id: string;
  name: string;
  city: string;
  microMarket: string;
  address: string;
  assetClass: string;
  totalFloors: number;
  availableSpaces: OfficeSpace[];
  imagePlaceholder?: string;
  market?: string;
  region?: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  buildingId: string;
  buildingName: string;
  city: string;
  selectedSpaceIds: string[];
  selectedSpaces: OfficeSpace[];
  totalUSF: number;
  plannedDesks: number;
  density: number;
  tenancyTerm: string;
  deliverySLA: string;
  targetBudget: number; // in Lakhs (INR)
  capType: string;
  dealStatus: 'Verified Deal' | 'In Pipeline' | 'Proposal Active';
  dealDifficulty?: DealDifficulty; // L1–L4
  salesOwner?: string;
  workflowStatus: WorkflowStatus;
  currentStage: StageId;
  createdAt: string;
  auditLogs?: AuditLogEntry[];
}

export interface ScopeModification {
  id: string;
  title: string;
  unitDelta: string;
  description: string;
  subTrade: string;
  iconName: string;
  type: 'add' | 'remove';
  category: 'civil' | 'pod' | 'pantry' | 'desks';
}

export interface BOQLineItem {
  id: string;
  code: string;
  specId: string;
  description: string;
  details: string;
  trade: 'ci' | 'mep' | 'ffe';
  tradeLabel: string;
  spaceTag: string;
  changeType: 'New Enclosed' | 'Reconfigured' | 'Division' | 'Demolished';
  constructionType?: ConstructionType; // new_build vs reconfiguration
  originalQty: number;
  qty: number;
  unit: string;
  masterRate: number;
  overrideRate: number | null;
  manuallyEdited?: boolean;
  rateVersion?: string;
  auditFlag?: string;
  flagType?: 'warning' | 'info' | 'edited' | 'demolished';
  subtotal: number;
  status: 'Approved' | 'Revision Review' | 'Pending';
  commentsCount?: number;
}

export interface TradeSignoff {
  tradeKey: 'ci' | 'mep' | 'ffe';
  tradeName: string;
  signatoryName: string;
  signatoryTitle: string;
  avatarInitials: string;
  status: 'Approved' | 'Changes Requested' | 'Pending';
  signedAt?: string;
  tradeTotal: number;
  deltaText: string;
  deltaIsPositive?: boolean;
  extraMeta?: string;
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole: string;
  avatarInitials: string;
  isApprover?: boolean;
  timestamp: string;
  message: string;
  auditLog?: string;
  flag?: string;
}

export interface DealAmortizationOption {
  id: 'A' | 'B' | 'C';
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  monthlySurcharge?: string;
  adjustedArpm?: string;
  immediateBilling?: string;
  recurringArpm?: string;
  downPayment?: string;
  amortizedDelta?: string;
}
