import React, { useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  Search, 
  Filter, 
  Download, 
  User, 
  Clock, 
  Layers, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { AuditLogEntry, Project } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLogEntry[];
  activeProject: Project;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  auditLogs,
  activeProject,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType !== 'all' && log.entityType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAuditCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Before Value', 'After Value', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      l.entityType,
      l.entityId,
      `"${(l.beforeValue || '').replace(/"/g, '""')}"`,
      `"${(l.afterValue || '').replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Trail_${activeProject.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base font-headline">Enterprise Audit Trail &amp; Governance Log</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  Immutable Record
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Full lifecycle audit history for <strong className="text-white">{activeProject.name}</strong> ({activeProject.code}) • Section 7.2 Mandate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search actor, action, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterType === 'all' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({auditLogs.length})
              </button>
              <button
                onClick={() => setFilterType('feasibility')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterType === 'feasibility' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Feasibility
              </button>
              <button
                onClick={() => setFilterType('boq_line_item')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterType === 'boq_line_item' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                BOQ Edits
              </button>
              <button
                onClick={() => setFilterType('rate_card')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterType === 'rate_card' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rate Cards
              </button>
            </div>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>

        {/* Audit Logs Timeline / Table */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No matching audit logs found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.entityType === 'feasibility'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : log.entityType === 'boq_line_item'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : log.entityType === 'rate_card'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {log.entityType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{log.action}</span>
                    <span className="text-[11px] font-mono text-slate-400">• {log.entityId}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {log.details}
                </p>

                {/* Before / After Snapshot */}
                {(log.beforeValue || log.afterValue) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    {log.beforeValue && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Before Value:</span>
                        <span className="text-rose-700 font-mono text-[11px] break-words">{log.beforeValue}</span>
                      </div>
                    )}
                    {log.afterValue && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">After Value:</span>
                        <span className="text-emerald-700 font-mono text-[11px] font-semibold break-words">{log.afterValue}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Actor: <strong className="text-slate-700">{log.actor}</strong> ({log.actorRole})</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Section 7.2: Soft warnings logged safely; every override is logged and nothing is silently blocked.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
