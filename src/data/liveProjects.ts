// Live Projects from CSV - Stage 1 Sales Feasibility Reference
export interface LiveProject {
  id: string;
  projectName: string;
  projectStatus: 'Concept' | 'Construction' | 'Completed';
  building: string;
  city: string;
  level: 'L1' | 'L2' | 'L3' | 'L4';
  customizationCost?: number;
  signedOffByClient?: boolean;
  conceptBudget?: number;
  sowCost?: number;
  costCharged?: number;
}

export const LIVE_PROJECTS: LiveProject[] = [
  {
    id: 'proj-001',
    projectName: 'Infovision - Olympia Cyberspace',
    projectStatus: 'Concept',
    building: 'Olympia Cyberspace_CHN_A',
    city: 'CHN',
    level: 'L3',
    costCharged: 1770000
  },
  {
    id: 'proj-002',
    projectName: 'OFS IT - Roshni Tech Hub',
    projectStatus: 'Concept',
    building: 'Kalyani Roshni Tech Hub P2_BLR_A',
    city: 'BLR',
    level: 'L3',
    costCharged: 2124000
  },
  {
    id: 'proj-003',
    projectName: 'Moss Adams - EGL Cherry Hills',
    projectStatus: 'Concept',
    building: 'EGL Cherry Hills_BLR_A',
    city: 'BLR',
    level: 'L4',
    costCharged: 6513600
  },
  {
    id: 'proj-004',
    projectName: 'LUCASFILM - NESCO IT Park',
    projectStatus: 'Construction',
    building: 'NESCO IT Park_MUM_A',
    city: 'MUM',
    level: 'L2',
    costCharged: 1
  },
  {
    id: 'proj-005',
    projectName: 'Two Circles India - RMZ Spire',
    projectStatus: 'Construction',
    building: 'RMZ Spire - Tower 100_HYD_A',
    city: 'HYD',
    level: 'L2',
    costCharged: 1180000
  },
  {
    id: 'proj-006',
    projectName: 'KCI Day 3 - Embassy Quest',
    projectStatus: 'Construction',
    building: 'Embassy Quest_BLR_A',
    city: 'BLR',
    level: 'L3',
    customizationCost: 0,
    conceptBudget: 5081324,
    costCharged: 0
  },
  {
    id: 'proj-007',
    projectName: 'Paylocity - EGL Sunriver D1',
    projectStatus: 'Construction',
    building: 'EGL Sunriver D1_BLR_A',
    city: 'BLR',
    level: 'L1',
    customizationCost: 978369,
    conceptBudget: 978370,
    costCharged: 978369
  },
  {
    id: 'proj-008',
    projectName: 'Mesa School - Salarpuria Symbiosis',
    projectStatus: 'Construction',
    building: 'Salarpuria Symbiosis_BLR_A',
    city: 'BLR',
    level: 'L1',
    customizationCost: 0,
    conceptBudget: 944207,
    costCharged: 0
  },
  {
    id: 'proj-009',
    projectName: 'Mitsui - RMZ Latitude',
    projectStatus: 'Construction',
    building: 'RMZ Latitude D1_BLR_A',
    city: 'BLR',
    level: 'L2',
    customizationCost: 1744040,
    conceptBudget: 1744040,
    costCharged: 1784821
  },
  {
    id: 'proj-010',
    projectName: 'Truemeds - Vaishnavi Signature',
    projectStatus: 'Construction',
    building: 'Vaishnavi Signature_BLR_A',
    city: 'BLR',
    level: 'L2',
    customizationCost: 236000,
    conceptBudget: 765820,
    costCharged: 236000
  },
  {
    id: 'proj-011',
    projectName: 'Figma Phase 2 - Prestige Cube',
    projectStatus: 'Construction',
    building: 'Prestige Cube_BLR_A',
    city: 'BLR',
    level: 'L3',
    customizationCost: 4166604,
    conceptBudget: 4166604,
    costCharged: 4878734
  },
  {
    id: 'proj-012',
    projectName: 'Presidio - Vaishnavi Signature',
    projectStatus: 'Construction',
    building: 'Vaishnavi Signature_BLR_A',
    city: 'BLR',
    level: 'L3',
    customizationCost: 0,
    conceptBudget: 3186000,
    costCharged: 0
  },
  {
    id: 'proj-013',
    projectName: 'Areoveda - Olympia Cyberspace D3',
    projectStatus: 'Construction',
    building: 'Olympia Cyberspace D3_CHN_A',
    city: 'CHN',
    level: 'L2',
    customizationCost: 590000,
    conceptBudget: 590000,
    costCharged: 590000
  },
  {
    id: 'proj-014',
    projectName: 'Double Verify - 37 Cunningham',
    projectStatus: 'Construction',
    building: '37 Cunningham_BLR_A',
    city: 'BLR',
    level: 'L3',
    customizationCost: 1628400,
    conceptBudget: 1628400,
    costCharged: 1528100
  },
  {
    id: 'proj-015',
    projectName: 'Barracuda Networks - Embassy Tech Village',
    projectStatus: 'Construction',
    building: 'Embassy Tech Village Parcel 8C_BLR_A',
    city: 'BLR',
    level: 'L4',
    customizationCost: 0,
    conceptBudget: 170684546,
    costCharged: 117817500
  },
  {
    id: 'proj-016',
    projectName: 'Happy Fox - Infinix Phalladium',
    projectStatus: 'Construction',
    building: 'Infinix Phalladium_BLR_A',
    city: 'BLR',
    level: 'L3',
    customizationCost: 1740500,
    conceptBudget: 1976568,
    costCharged: 1770000
  }
];
