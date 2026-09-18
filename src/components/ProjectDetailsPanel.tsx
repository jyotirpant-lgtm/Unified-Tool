import React from 'react';
import { Project } from '../types';
import { MapPin, Building2, Users, DollarSign, Calendar, Zap } from 'lucide-react';

interface ProjectDetailsPanelProps {
  project: Project | null;
  onSubmitToAirtable?: () => void;
  isSubmitting?: boolean;
}

export const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({
  project,
  onSubmitToAirtable,
  isSubmitting = false
}) => {
  if (!project) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">Active Project</h3>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h2>
        <p className="text-sm text-gray-600">{project.clientName}</p>
      </div>

      <div className="space-y-4 mb-6">
        <DetailRow
          icon={<MapPin className="w-4 h-4" />}
          label="Location"
          value={`${project.buildingName}, ${project.city}`}
        />
        <DetailRow
          icon={<Building2 className="w-4 h-4" />}
          label="Difficulty Level"
          value={project.dealDifficulty || 'L3 (Complex)'}
          badge={project.dealDifficulty?.split(' ')[0]}
        />
        <DetailRow
          icon={<Users className="w-4 h-4" />}
          label="Planned Desks"
          value={project.plannedDesks.toLocaleString()}
        />
        <DetailRow
          icon={<Zap className="w-4 h-4" />}
          label="Total USF"
          value={`${project.totalUSF.toLocaleString()} sq ft`}
        />
        <DetailRow
          icon={<DollarSign className="w-4 h-4" />}
          label="Target Budget"
          value={`₹${(project.targetBudget * 100000).toLocaleString()}`}
        />
        <DetailRow
          icon={<Calendar className="w-4 h-4" />}
          label="Tenancy Term"
          value={project.tenancyTerm}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Status:</span> {project.dealStatus || 'In Pipeline'}
        </p>
        <p className="text-xs text-blue-700 mt-1">Workflow: {project.workflowStatus}</p>
      </div>

      <button
        onClick={onSubmitToAirtable}
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        {isSubmitting ? 'Submitting to Airtable...' : 'Submit Details to Airtable'}
      </button>
    </div>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  badge?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, badge }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-900">{value}</span>
      {badge && (
        <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">
          {badge}
        </span>
      )}
    </div>
  </div>
);
