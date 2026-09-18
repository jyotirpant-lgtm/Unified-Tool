import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Send, 
  Check, 
  ShieldCheck, 
  FileText, 
  Download, 
  ExternalLink, 
  Lock, 
  ArrowRight, 
  User, 
  History,
  Sparkles,
  RefreshCw,
  Mail
} from 'lucide-react';
import { TradeSignoff, CommentItem, UserRole } from '../types';
import { INITIAL_TRADE_SIGNOFFS, INITIAL_COMMENTS } from '../data/mockData';

interface Stage3ApprovalsProps {
  onProceedToStage4: () => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onConfirmAllSigned: () => void;
}

export const Stage3Approvals: React.FC<Stage3ApprovalsProps> = ({
  onProceedToStage4,
  userRole,
  onChangeUserRole,
  onConfirmAllSigned,
}) => {
  const [tradeSignoffs, setTradeSignoffs] = useState<TradeSignoff[]>(INITIAL_TRADE_SIGNOFFS);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [replyText, setReplyText] = useState('');
  const [isItemResolved, setIsItemResolved] = useState(false);
  const [showHandshakeModal, setShowHandshakeModal] = useState(false);
  const [activeSignatoryRole, setActiveSignatoryRole] = useState<'jyotir' | 'devyani'>('jyotir');

  const allApproved = tradeSignoffs.every((t) => t.status === 'Approved');
  const approvedCount = tradeSignoffs.filter((t) => t.status === 'Approved').length;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      authorName: activeSignatoryRole === 'jyotir' ? 'Jyotir Pant' : 'Devyani Jadhav',
      authorRole: activeSignatoryRole === 'jyotir' ? 'MEP Lead Approver' : 'Senior Estimator',
      avatarInitials: activeSignatoryRole === 'jyotir' ? 'JP' : 'DJ',
      isApprover: activeSignatoryRole === 'jyotir',
      timestamp: 'Just now',
      message: replyText,
    };

    setComments([...comments, newComment]);
    setReplyText('');
  };

  const handleResolveItem = () => {
    setIsItemResolved(true);
    const updatedComments: CommentItem[] = [
      ...comments,
      {
        id: `comm-res-${Date.now()}`,
        authorName: 'Jyotir Pant',
        authorRole: 'MEP Lead Approver',
        avatarInitials: 'JP',
        isApprover: true,
        timestamp: 'Just now',
        message: '“Recalibration verified against Riser 4B drawings. Revised quantity of 12.00 RMT is accepted. Scope revision cleared.”',
        auditLog: 'Audit #LOG-410: Scope Flag Resolved by J. Pant | All MEP line items in agreement',
      },
    ];
    setComments(updatedComments);
  };

  const handleSignOffMEP = () => {
    const updated = tradeSignoffs.map((t) => {
      if (t.tradeKey === 'mep') {
        return {
          ...t,
          status: 'Approved' as const,
          signedAt: 'Today, 2:18 PM IST',
          extraMeta: 'Digitally Sealed & Hard-Locked',
        };
      }
      return t;
    });

    setTradeSignoffs(updated);
    setIsItemResolved(true);
    onConfirmAllSigned();
    setShowHandshakeModal(true);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner: BOQ Review & Multi-Trade Progress */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                Stage 3 Approvals
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                BRD 5.3 Work Order Compliance Rev v3.8-Live
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-headline flex items-center gap-2">
              <span>BOQ IN REVIEW • {approvedCount} OF 3 TRADES SIGNED OFF</span>
              {allApproved && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ALL TRADES APPROVED
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Decoupled trade governance: Civil &amp; Interiors, Services &amp; MEP, and FFE specialists independently review line items, comment in threads, and sign off.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Approval package email dispatched to Trade Heads with HTML & CSV attachments.')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Send HTML &amp; CSV Package</span>
            </button>

            {allApproved ? (
              <button
                id="btn-stage3-to-stage4"
                onClick={onProceedToStage4}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 transition-all shadow-sm shadow-emerald-500/20"
              >
                <span>Proceed to Stage 4: Deal Structuring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-trigger-mep-sign"
                onClick={handleSignOffMEP}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 transition-all shadow-sm shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign Off MEP Scope</span>
              </button>
            )}
          </div>
        </div>

        {/* Stepper Progress Header */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">1. Pending BOQ Approval</div>
              <div className="text-[11px] text-slate-500">Draft finalized in Stage 2</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">2. Line Items Edited / Resubmit</div>
              <div className="text-[11px] text-amber-700">MEP Riser 4B recalibration in review</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500">3. BOQ Approve &amp; Deal Handshake</div>
              <div className="text-[11px] text-slate-400">Unlocks Stage 4 Capex modeling</div>
            </div>
          </div>
        </div>

        {/* Auto-lock timer strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto-lock deadline: <strong>Today 18:00 IST</strong> (Fast-track SLA compliance)</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Immutable Audit Trail Hash: SHA-256: 7f8a9e...3d2
          </div>
        </div>
      </div>

      {/* ================= 3 TRADE SIGN-OFF CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tradeSignoffs.map((trade) => {
          const isApproved = trade.status === 'Approved';
          return (
            <div
              key={trade.tradeKey}
              className={`rounded-2xl border p-5 bg-white transition-all shadow-xs flex flex-col justify-between ${
                isApproved ? 'border-emerald-200' : 'border-amber-200 bg-amber-50/10'
              }`}
            >
              <div>
                {/* Header with status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {trade.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    ₹{(trade.tradeTotal / 100000).toFixed(2)} Lakhs
                  </span>
                </div>

                {/* Trade title */}
                <h3 className="text-sm font-extrabold text-slate-900 font-headline">
                  {trade.tradeName}
                </h3>

                {/* Signatory Info */}
                <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                    {trade.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{trade.signatoryName}</div>
                    <div className="text-[11px] text-slate-500 leading-none mt-0.5">{trade.signatoryTitle}</div>
                  </div>
                </div>

                {/* Signed timestamp or status */}
                <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {trade.signedAt ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Signed at {trade.signedAt}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{trade.extraMeta}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    Variance Delta: {trade.deltaText}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {isApproved ? (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Trade Scope Locked
                  </span>
                ) : (
                  <button
                    onClick={handleSignOffMEP}
                    className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
                  >
                    Approve &amp; Sign Off MEP
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= SECTION 5.3: GRANULAR LINE-ITEM REVIEW & COMMENTING THREAD ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              5.3
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Granular Line-Item Review &amp; Commenting Thread
              </h3>
              <p className="text-[11px] text-slate-500">
                Traceable communication loop between Approver (Jyotir Pant) and Estimator (Devyani Jadhav)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Viewing as:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveSignatoryRole('jyotir')}
                className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                  activeSignatoryRole === 'jyotir'
                    ? 'bg-white text-amber-800 font-bold shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Jyotir Pant (Approver)
              </button>
              <button
                onClick={() => setActiveSignatoryRole('devyani')}
                className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                  activeSignatoryRole === 'devyani'
                    ? 'bg-white text-blue-800 font-bold shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Devyani Jadhav (Estimator)
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Flagged Item Card */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    ITEM #MEP-C01 • HVAC-COPPER-410A
                  </span>
                  <span className="text-xs text-slate-500">Sub-trade: MEP Services • Common Riser 4B</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  VRV Copper Refrigerant Piping (Class-0 insulation)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Master Rate Card v2.4 (Sheetel): <strong>₹7,000 / RMT</strong>
                </p>
              </div>

              {/* Recalibration summary readout */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Original Takeoff</div>
                  <div className="text-xs font-mono line-through text-slate-400">18.00 RMT • ₹1,26,000</div>
                </div>
                <div className="text-amber-600 font-bold text-sm">→</div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-600">Recalibrated Takeoff</div>
                  <div className="text-sm font-mono font-extrabold text-emerald-700">12.00 RMT • ₹84,000</div>
                </div>
                <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  -₹42,000 Net
                </div>
              </div>
            </div>

            {/* Comment Thread */}
            <div className="pt-4 space-y-4">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-4 rounded-xl border ${
                    comm.isApprover
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-blue-200 bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          comm.isApprover ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {comm.avatarInitials}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{comm.authorName}</span>
                      <span className="text-[11px] text-slate-500">({comm.authorRole})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{comm.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-normal italic">
                    {comm.message}
                  </p>

                  {comm.auditLog && (
                    <div className="mt-2.5 pt-2 border-t border-blue-200/60 text-[10px] font-mono text-blue-900 bg-blue-100/50 p-1.5 rounded">
                      {comm.auditLog}
                    </div>
                  )}
                </div>
              ))}

              {/* Reply Form */}
              <form onSubmit={handleSendComment} className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply as ${activeSignatoryRole === 'jyotir' ? 'Jyotir Pant (Approver)' : 'Devyani Jadhav (Estimator)'}...`}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-hidden focus:border-amber-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>

                {/* Quick actions for Approver */}
                {!isItemResolved && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Quick Approver actions:</span>
                    <button
                      type="button"
                      onClick={handleResolveItem}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept &amp; Resolve Item</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Item 2: Approved Inline */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  HVAC Diffuser Relocation &amp; VAV Damper Touch-up (SPECS #MEP-H12)
                </div>
                <div className="text-[11px] text-slate-500">4 Points • ₹4,800/Pt = ₹19,200 (Approved inline by Jyotir Pant)</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Hard-Approved
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 z-20 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Approver Workspace:</span>
          <span className="text-xs font-bold text-slate-900">
            {allApproved ? '3 of 3 Trades Signed' : '2 of 3 Trades Signed (MEP Pending Sign-off)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Downloading trade-specific BOQ CSV for site audit...')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Trade BOQ (.csv)</span>
          </button>

          {!allApproved ? (
            <button
              onClick={handleSignOffMEP}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 transition-all shadow-md shadow-amber-600/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approve Trade Scope &amp; Sign Off</span>
            </button>
          ) : (
            <button
              onClick={onProceedToStage4}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
            >
              <span>Proceed to Stage 4: Deal Structuring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ================= MODAL: ALL TRADES SIGNED HANDSHAKE ================= */}
      {showHandshakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-black font-headline">
                All 3 Trade Sign-Offs Completed!
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                Civil &amp; Interiors, MEP, and FFE lead engineers have signed off on all line items.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>C&amp;I (Rahul V.):</span>
                  <span className="text-emerald-700">Signed 10:42 AM IST • ₹24.80L</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Services &amp; MEP (Jyotir Pant):</span>
                  <span className="text-emerald-700">Signed 2:18 PM IST • ₹9.84L</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>FFE (Sneha M.):</span>
                  <span className="text-emerald-700">Signed 11:15 AM IST • ₹6.56L</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Grand Turnkey Scope:</span>
                  <span className="font-mono text-emerald-800">₹39.84 Lakhs (Locked)</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                The BOQ is now permanently locked and transitioned to <strong>Stage 4: Deal Structuring &amp; Tracker Handoff</strong>. You can now configure Capex recovery options, review executive commercial returns, and sync directly to the PM Airtable pipeline.
              </p>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setShowHandshakeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Stay on Sign-offs
                </button>
                <button
                  onClick={() => {
                    setShowHandshakeModal(false);
                    onProceedToStage4();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-600/20"
                >
                  <span>Go to Stage 4: Deal Structuring</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
