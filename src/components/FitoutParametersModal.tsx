import React, { useState } from 'react';
import { SlidersHorizontal, Settings, Check, RefreshCw } from 'lucide-react';

interface FitoutParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitoutParametersModal: React.FC<FitoutParametersModalProps> = ({ isOpen, onClose }) => {
  const [deskRatioThreshold, setDeskRatioThreshold] = useState(40);
  const [defaultDemoRate, setDefaultDemoRate] = useState(50);
  const [slaDays, setSlaDays] = useState(24);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm font-headline">Enterprise Fit-out Parameters</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Desk Conversion Warning Threshold (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="80"
                value={deskRatioThreshold}
                onChange={(e) => setDeskRatioThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
              <span className="font-mono text-slate-500 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Trigger rule 5.1.A MEP impact warning when desk reduction exceeds this percentage.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Default Demolition Coefficient Rate (₹ / USF)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                value={defaultDemoRate}
                onChange={(e) => setDefaultDemoRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
              <span className="font-mono text-slate-500 font-bold">₹/sqft</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Municipal dumping, labor carting &amp; strip rates for commercial offices.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Standard Fit-out Delivery SLA (Calendar Days)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                value={slaDays}
                onChange={(e) => setSlaDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
              <span className="font-mono text-slate-500 font-bold">Days</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Turnkey mobilization to client handover calendar target.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold flex items-center gap-1.5"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Saved!' : 'Save Parameters'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
