import React from 'react';
import { LIVE_PROJECTS } from '../data/liveProjects';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface LiveProjectsPanelProps {
  onSelectProject?: (projectName: string) => void;
}

export const LiveProjectsPanel: React.FC<LiveProjectsPanelProps> = ({ onSelectProject }) => {
  const groupedByStatus = {
    Concept: LIVE_PROJECTS.filter(p => p.projectStatus === 'Concept'),
    Construction: LIVE_PROJECTS.filter(p => p.projectStatus === 'Construction'),
    Completed: LIVE_PROJECTS.filter(p => p.projectStatus === 'Completed'),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concept':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'Construction':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'L1':
        return 'bg-green-100 text-green-800';
      case 'L2':
        return 'bg-blue-100 text-blue-800';
      case 'L3':
        return 'bg-amber-100 text-amber-800';
      case 'L4':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">Live Projects Pipeline</h3>
        <p className="text-xs text-gray-500 mt-1">{LIVE_PROJECTS.length} total projects</p>
      </div>

      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {Object.entries(groupedByStatus).map(([status, projects]) => (
          <div key={status}>
            {projects.length > 0 && (
              <div className="bg-gray-50 px-4 py-2 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {status}
                  </span>
                  <span className="ml-auto text-xs font-bold text-gray-500">{projects.length}</span>
                </div>
              </div>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => onSelectProject?.(project.projectName)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {project.projectName}
                  </h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${getLevelColor(project.level)}`}>
                    {project.level}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-1">{project.building}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{project.city}</span>
                  {project.costCharged && (
                    <span className="font-semibold text-gray-700">
                      ₹{(project.costCharged / 100000).toFixed(2)}L
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
