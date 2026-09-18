import React, { useState } from 'react';
import { StageId, UserRole, BOQLineItem, Project, AuditLogEntry, WorkflowStatus } from './types';
import { INITIAL_BOQ_ITEMS, INITIAL_PROJECTS, INITIAL_AUDIT_LOGS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Stage1Feasibility } from './components/Stage1Feasibility';
import { Stage2BOQEngine } from './components/Stage2BOQEngine';
import { Stage3Approvals } from './components/Stage3Approvals';
import { Stage4DealStructuring } from './components/Stage4DealStructuring';
import { RateCardLibraryModal } from './components/RateCardLibraryModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { FitoutParametersModal } from './components/FitoutParametersModal';
import { NewProjectModal } from './components/NewProjectModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { ProjectDetailsPanel } from './components/ProjectDetailsPanel';
import { LiveProjectsPanel } from './components/LiveProjectsPanel';
import { ShieldAlert, Info } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState<StageId>('stage-1');
  const [userRole, setUserRole] = useState<UserRole>('sales');
  const [boqItems, setBoqItems] = useState<BOQLineItem[]>(INITIAL_BOQ_ITEMS);
  const [isRateLocked, setIsRateLocked] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);

  // Global Audit Logs (Section 7.2)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals state
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAuditTrailModalOpen, setIsAuditTrailModalOpen] = useState(false);
  const [isProjectDetailsVisible, setIsProjectDetailsVisible] = useState(false);
  const [isAirtableSubmitting, setIsAirtableSubmitting] = useState(false);

  // Active Project resolution
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleAddAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    // Also update project's local audit logs
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, auditLogs: [newLog, ...(p.auditLogs || [])] }
          : p
      )
    );
  };

  const handleUpdateProject = (updated: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, ...updated } : p))
    );
  };

  const handleStageSelect = (stage: StageId) => {
    setCurrentStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmAllSigned = () => {
    setIsRateLocked(true);
    // Auto-advance rule per Section 6: once all three trade approvers sign off -> advances to boq_approved
    handleUpdateProject({
      workflowStatus: 'boq_approved',
    });
    handleAddAuditLog({
      actor: 'System Auto-Advance',
      actorRole: 'Workflow Engine',
      action: 'BOQ Approved Auto-Transition',
      entityType: 'approval_gate',
      entityId: activeProject.code,
      beforeValue: 'State: pending_boq_approval',
      afterValue: 'State: boq_approved',
      details: 'All 3 trade approvers (C&I, MEP, FFE) signed off. System automatically advanced project to boq_approved without manual intervention.',
    });
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setCurrentStage('stage-1');
    handleAddAuditLog({
      actor: 'Sales Lead',
      actorRole: 'Sales / CS',
      action: 'New Deal Space Feasibility Created',
      entityType: 'feasibility',
      entityId: newProject.code,
      beforeValue: 'None',
      afterValue: `${newProject.name} (${newProject.totalUSF} USF)`,
      details: `Project initialized with client ${newProject.clientName} in ${newProject.buildingName}. Status: Draft.`,
    });
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const handleSubmitToAirtable = async () => {
    setIsAirtableSubmitting(true);
    try {
      // Simulate Airtable API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      handleAddAuditLog({
        actor: 'Sales Lead',
        actorRole: 'Sales / CS',
        action: 'Project Details Submitted to Airtable',
        entityType: 'feasibility',
        entityId: activeProject.code,
        beforeValue: `Status: ${activeProject.dealStatus}`,
        afterValue: 'Submitted to PM Operations Queue',
        details: `Project ${activeProject.name} (${activeProject.totalUSF} USF) submitted to Airtable with Stage 1 feasibility details. Target Budget: ₹${(activeProject.targetBudget * 100000).toLocaleString()}`,
      });

      setIsProjectDetailsVisible(false);
      alert('Project details submitted to Airtable successfully!');
    } catch (error) {
      console.error('Airtable submission failed:', error);
      alert('Failed to submit to Airtable');
    } finally {
      setIsAirtableSubmitting(false);
    }
  };

  // Section 7.1 Role permissions evaluation
  const getRoleStageAdvisory = () => {
    if (userRole === 'sales' && currentStage !== 'stage-1') {
      return {
        type: 'info' as const,
        msg: 'Sales / CS Role: View-only mode for Stage 2–4. Full proposal editing is enabled in Stage 1.',
      };
    }
    if (userRole === 'architect_supply' && currentStage === 'stage-1') {
      return {
        type: 'info' as const,
        msg: 'Architect / Supply Role: Stage 1 is read-only (managed by Sales). Edit mode is active in Stage 2 (Takeoff & BOQ) and Stage 3 (Trade Sign-offs).',
      };
    }
    if (userRole === 'pricing' && currentStage !== 'stage-4') {
      return {
        type: 'info' as const,
        msg: 'Pricing Team Role: Stage 4 (Deal Structuring & Amortization) is your active editing workspace.',
      };
    }
    return null;
  };

  const roleAdvisory = getRoleStageAdvisory();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col antialiased">
      <div className="flex-1 flex flex-row">
        {/* Persistent Workspace Sidebar */}
        <Sidebar
          currentStage={currentStage}
          onSelectStage={handleStageSelect}
          onOpenRateCard={() => setIsRateCardModalOpen(true)}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onOpenParameters={() => setIsParametersModalOpen(true)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          activeProject={activeProject}
          isRateCardModalOpen={isRateCardModalOpen}
          isArchitectureModalOpen={isArchitectureModalOpen}
          isParametersModalOpen={isParametersModalOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <Header
            currentStage={currentStage}
            onSelectStage={handleStageSelect}
            userRole={userRole}
            onChangeUserRole={setUserRole}
            onOpenRateCard={() => setIsRateCardModalOpen(true)}
            onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenAuditTrail={() => setIsAuditTrailModalOpen(true)}
            activeProject={activeProject}
            isRateLocked={isRateLocked}
          />

          {/* Section 7.1 Role Advisory Banner if applicable */}
          {roleAdvisory && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{roleAdvisory.msg}</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                Section 7.1 RBAC
              </span>
            </div>
          )}

          {/* Active Stage View Container */}
          <main className="flex-1 p-6 md:p-8 w-full mx-auto">
            {currentStage === 'stage-1' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <div className="lg:col-span-2">
                  <Stage1Feasibility
                    onProceedToStage2={() => {
                      handleUpdateProject({ workflowStatus: 'layout_in_progress', currentStage: 'stage-2' });
                      handleStageSelect('stage-2');
                    }}
                    activeProject={activeProject}
                    onOpenNewProject={() => setIsNewProjectModalOpen(true)}
                    onUpdateProject={handleUpdateProject}
                    onAddAuditLog={handleAddAuditLog}
                    onShowProjectDetails={() => setIsProjectDetailsVisible(true)}
                  />
                </div>
                <div className="space-y-6">
                  {isProjectDetailsVisible && (
                    <ProjectDetailsPanel
                      project={activeProject}
                      onSubmitToAirtable={handleSubmitToAirtable}
                      isSubmitting={isAirtableSubmitting}
                    />
                  )}
                  <LiveProjectsPanel
                    onSelectProject={(projectName) => {
                      const projectToActivate = INITIAL_PROJECTS.find(p => p.name.includes(projectName.split(' - ')[0]));
                      if (projectToActivate) {
                        setActiveProjectId(projectToActivate.id);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {currentStage === 'stage-2' && (
              <Stage2BOQEngine
                onProceedToStage3={() => {
                  handleUpdateProject({ workflowStatus: 'pending_boq_approval', currentStage: 'stage-3' });
                  handleStageSelect('stage-3');
                }}
                onOpenRateCard={() => setIsRateCardModalOpen(true)}
                items={boqItems}
                onUpdateItems={setBoqItems}
                activeProject={activeProject}
                onAddAuditLog={handleAddAuditLog}
              />
            )}

            {currentStage === 'stage-3' && (
              <Stage3Approvals
                onProceedToStage4={() => {
                  handleUpdateProject({ workflowStatus: 'pending_deal_structuring', currentStage: 'stage-4' });
                  handleStageSelect('stage-4');
                }}
                userRole={userRole}
                onChangeUserRole={setUserRole}
                onConfirmAllSigned={handleConfirmAllSigned}
                activeProject={activeProject}
                onAddAuditLog={handleAddAuditLog}
              />
            )}

            {currentStage === 'stage-4' && (
              <Stage4DealStructuring 
                onBackToStage3={() => handleStageSelect('stage-3')}
                activeProject={activeProject}
                onAddAuditLog={handleAddAuditLog}
                onCloseDeal={() => {
                  handleUpdateProject({ workflowStatus: 'closed' });
                  handleAddAuditLog({
                    actor: 'Pricing Lead & Sales Head',
                    actorRole: 'Pricing & Sales Head',
                    action: 'Deal Closing & PM Handoff Complete',
                    entityType: 'deal_structure',
                    entityId: activeProject.code,
                    beforeValue: 'State: pending_sales_head_approval',
                    afterValue: 'State: closed',
                    details: `Project closed and mobilized for site delivery. PM ops payload dispatched to Airtable.`,
                  });
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        activeProject={activeProject}
        allProjects={projects}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
      />

      <RateCardLibraryModal
        isOpen={isRateCardModalOpen}
        onClose={() => setIsRateCardModalOpen(false)}
      />

      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <FitoutParametersModal
        isOpen={isParametersModalOpen}
        onClose={() => setIsParametersModalOpen(false)}
      />

      <AuditTrailModal
        isOpen={isAuditTrailModalOpen}
        onClose={() => setIsAuditTrailModalOpen(false)}
        auditLogs={auditLogs}
        activeProject={activeProject}
      />
    </div>
  );
}

