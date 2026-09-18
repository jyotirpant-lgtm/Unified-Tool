import React from 'react';
import { FileSpreadsheet, History, Check, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { RATE_CARD_ITEMS } from '../data/mockData';

interface RateCardLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RateCardLibraryModal: React.FC<RateCardLibraryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base font-headline">Enterprise Master Rate Card Library</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-100 border border-emerald-500 font-bold">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Source: <code className="font-mono text-white">CHLC_BOQ_RateCard.xlsx</code> • Synchronized across all Bangalore projects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Recent Audit Highlight */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <strong>Latest Rate Card Adjustment (12 May 2026): </strong>
              Sheetel approved copper piping price calibration from ₹5,000 to ₹7,000 / RMT for all active fit-outs due to OEM raw material import tariff increases.
            </div>
          </div>

          {/* Rate Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                  <th className="py-2.5 px-3">Item Code &amp; Trade</th>
                  <th className="py-2.5 px-3">Specification Name</th>
                  <th className="py-2.5 px-3 text-center">Unit</th>
                  <th className="py-2.5 px-3 text-right">Previous</th>
                  <th className="py-2.5 px-3 text-right">Current Rate</th>
                  <th className="py-2.5 px-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RATE_CARD_ITEMS.map((item) => (
                  <tr key={item.itemCode} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-slate-800">{item.itemCode}</div>
                      <div className="text-[10px] text-slate-400">{item.trade}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">{item.itemName}</div>
                      <div className="text-[10px] text-slate-400 italic">{item.reason}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">{item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400 line-through">
                      ₹{item.previousRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{item.currentRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-700">{item.authorizedBy}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rate Card Version History */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Version Audit Logs</span>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-slate-600">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>v2.4 (Current) • May 12, 2026: Copper piping &amp; HVAC VAV rates updated</span>
                <span className="text-emerald-700 font-bold">LIVE</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>v2.3 • Apr 28, 2026: FFE meeting pod modular packages updated</span>
                <span className="text-slate-400">Archived</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <span>v2.2 • Apr 10, 2026: Demolition USF municipal cartage rates</span>
                <span className="text-slate-400">Archived</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 text-xs">
            Sync interval: Real-time webhook active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Rate Library
          </button>
        </div>
      </div>
    </div>
  );
};
