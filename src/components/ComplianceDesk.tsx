import { useState } from 'react';
import { AlertTriangle, Ban, CheckCircle2, Eye, Gavel, Plus, Search, ShieldAlert, Trash2, X } from 'lucide-react';
import { blacklist as initialBlacklist, type BlacklistEntry } from '../data/mockData';

interface SeizeRecord {
  address: string;
  amount: string;
  destination: string;
  timestamp: string;
}

export function ComplianceDesk() {
  const [blacklistEntries, setBlacklistEntries] = useState<BlacklistEntry[]>(initialBlacklist);
  const [newAddress, setNewAddress] = useState('');
  const [newReason, setNewReason] = useState('');
  const [seizeAddress, setSeizeAddress] = useState('');
  const [seizeAmount, setSeizeAmount] = useState('');
  const [seizeDest, setSeizeDest] = useState('Treasury');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showSeizeSuccess, setShowSeizeSuccess] = useState(false);
  const [seizeHistory, setSeizeHistory] = useState<SeizeRecord[]>([]);
  const [showConfirmSeize, setShowConfirmSeize] = useState(false);

  const filteredEntries = blacklistEntries.filter(e => {
    const q = searchTerm.toLowerCase();
    return e.address.toLowerCase().includes(q) || e.reason.toLowerCase().includes(q);
  });

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress || !newReason) return;
    const entry: BlacklistEntry = {
      address: newAddress,
      reason: newReason,
      addedAt: new Date().toLocaleString(),
      addedBy: 'Admin',
      status: 'active',
    };
    setBlacklistEntries(prev => [entry, ...prev]);
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2500);
    setNewAddress('');
    setNewReason('');
  };

  const handleRemove = (address: string) => {
    setBlacklistEntries(prev => prev.map(e => (e.address === address ? { ...e, status: 'removed' as const } : e)));
  };

  const handleReactivate = (address: string) => {
    setBlacklistEntries(prev => prev.map(e => (e.address === address ? { ...e, status: 'active' as const } : e)));
  };

  const handleSeize = () => {
    if (!seizeAddress || !seizeAmount) return;
    const record: SeizeRecord = {
      address: seizeAddress,
      amount: seizeAmount,
      destination: seizeDest,
      timestamp: new Date().toLocaleString(),
    };
    setSeizeHistory(prev => [record, ...prev]);
    setShowSeizeSuccess(true);
    setShowConfirmSeize(false);
    setTimeout(() => setShowSeizeSuccess(false), 2500);
    setSeizeAddress('');
    setSeizeAmount('');
  };

  const activeCount = blacklistEntries.filter(e => e.status === 'active').length;
  const removedCount = blacklistEntries.filter(e => e.status === 'removed').length;

  return (
    <div className="space-y-7">
      <section className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/35 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              Risk Operations
            </p>
            <h1 className="mt-3 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-50">Compliance Desk</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">SSS-2 policy controls for blacklist management and asset seizure workflows.</p>
          </div>
          <div className="rounded-2xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-right text-xs text-rose-700 dark:text-rose-300">
            <p className="font-semibold uppercase tracking-[0.12em]">Current Regime</p>
            <p className="mt-1 text-base font-bold">Strict Enforcement</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="glass-panel rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-600 dark:text-rose-300">Active Blacklisted</p>
          <p className="mt-2 text-3xl font-bold text-rose-700 dark:text-rose-300">{activeCount}</p>
        </article>
        <article className="glass-panel rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">Removed</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{removedCount}</p>
        </article>
        <article className="glass-panel rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-600 dark:text-amber-300">Assets Seized</p>
          <p className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-300">{seizeHistory.length}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-5 rounded-2xl border border-rose-500/35 bg-gradient-to-r from-rose-500/22 to-red-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-rose-500/20 p-2.5">
                <Plus className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Add to Blacklist</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">Block address from all SSS-2 operations.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddBlacklist} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Wallet Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="modern-input px-4 py-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Reason</label>
              <select
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                className="modern-input px-4 py-2.5 text-sm"
              >
                <option value="">Select reason...</option>
                <option value="Exploit - Flash loan attack">Exploit - Flash loan attack</option>
                <option value="Sanctions - OFAC flagged entity">Sanctions - OFAC flagged entity</option>
                <option value="Money laundering suspected">Money laundering suspected</option>
                <option value="Rug pull linked wallet">Rug pull linked wallet</option>
                <option value="Phishing / Social engineering">Phishing / Social engineering</option>
                <option value="Other - Manual review">Other - Manual review</option>
              </select>
            </div>

            {showAddSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Address added to blacklist.</span>
              </div>
            )}

            <button type="submit" disabled={!newAddress || !newReason} className="modern-button modern-button-danger flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold">
              <Ban className="h-4 w-4" />
              Add to Blacklist
            </button>
          </form>
        </article>

        <article className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/22 to-orange-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/20 p-2.5">
                <Gavel className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Seize Assets</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">Confiscate balances from compromised wallets.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Target Address</label>
              <input
                type="text"
                value={seizeAddress}
                onChange={e => setSeizeAddress(e.target.value)}
                placeholder="0x... (blacklisted address)"
                className="modern-input px-4 py-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Amount to Seize</label>
              <input
                type="number"
                value={seizeAmount}
                onChange={e => setSeizeAmount(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                className="modern-input px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Destination</label>
              <input
                type="text"
                value={seizeDest}
                onChange={e => setSeizeDest(e.target.value)}
                className="modern-input px-4 py-2.5 text-sm"
              />
            </div>

            <div className="flex items-start gap-2 rounded-2xl border border-rose-400/35 bg-rose-500/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
              <span className="text-xs font-medium text-rose-800 dark:text-rose-300">
                Seizure is a critical action. Tokens are forcibly moved to destination and this action is fully logged.
              </span>
            </div>

            {showSeizeSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Assets seized successfully.</span>
              </div>
            )}

            <button
              onClick={() => setShowConfirmSeize(true)}
              disabled={!seizeAddress || !seizeAmount}
              className="modern-button modern-button-warn flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
            >
              <Gavel className="h-4 w-4" />
              Seize Assets
            </button>
          </div>
        </article>
      </section>

      {showConfirmSeize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="glass-panel-strong w-full max-w-md rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-50">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                Confirm Seizure
              </h3>
              <button
                onClick={() => setShowConfirmSeize(false)}
                className="rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 space-y-2.5">
              <div className="rounded-2xl border border-slate-200/80 bg-white/65 p-3 dark:border-slate-700/80 dark:bg-slate-800/45">
                <p className="text-xs text-slate-500 dark:text-slate-400">Target</p>
                <p className="font-mono text-sm text-slate-900 dark:text-slate-100">{seizeAddress}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/65 p-3 dark:border-slate-700/80 dark:bg-slate-800/45">
                <p className="text-xs text-slate-500 dark:text-slate-400">Amount</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{Number(seizeAmount).toLocaleString()} SSS-2</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/65 p-3 dark:border-slate-700/80 dark:bg-slate-800/45">
                <p className="text-xs text-slate-500 dark:text-slate-400">Destination</p>
                <p className="text-sm text-slate-900 dark:text-slate-100">{seizeDest}</p>
              </div>
            </div>

            <p className="mb-4 text-sm font-medium text-rose-700 dark:text-rose-300">This action cannot be undone.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSeize(false)}
                className="flex-1 rounded-xl border border-slate-300/80 bg-white/70 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600/80 dark:bg-slate-800/65 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button onClick={handleSeize} className="modern-button modern-button-danger flex-1 px-3 py-2.5 text-sm font-semibold">
                Confirm Seizure
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="glass-panel rounded-3xl p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
            <Eye className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Blacklist Registry
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search address or reason..."
              className="modern-input w-full py-2.5 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-semibold">Address</th>
                <th className="pb-3 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">Added</th>
                <th className="pb-3 font-semibold">By</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, i) => (
                <tr key={`${entry.address}-${i}`}>
                  <td className="py-3 font-mono text-xs text-slate-900 dark:text-slate-100">{entry.address}</td>
                  <td className="max-w-xs py-3 text-xs text-slate-600 dark:text-slate-300">{entry.reason}</td>
                  <td className="py-3 text-xs text-slate-500 dark:text-slate-400">{entry.addedAt}</td>
                  <td className="py-3 text-xs text-slate-500 dark:text-slate-400">{entry.addedBy}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        entry.status === 'active'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {entry.status === 'active' ? 'BLOCKED' : 'REMOVED'}
                    </span>
                  </td>
                  <td className="py-3">
                    {entry.status === 'active' ? (
                      <button
                        onClick={() => handleRemove(entry.address)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-400/35 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(entry.address)}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-300"
                      >
                        <Ban className="h-3 w-3" />
                        Re-block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {seizeHistory.length > 0 && (
        <section className="glass-panel rounded-3xl p-5 sm:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
            <Gavel className="h-5 w-5 text-amber-500" />
            Seizure Audit Log
          </h3>
          <div className="space-y-2.5">
            {seizeHistory.map((rec, i) => (
              <div
                key={`${rec.timestamp}-${i}`}
                className="flex flex-col gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 sm:flex-row sm:items-center"
              >
                <Gavel className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    Seized <span className="font-bold">{Number(rec.amount).toLocaleString()}</span> SSS-2 from{' '}
                    <span className="font-mono text-xs">{rec.address}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">to {rec.destination} at {rec.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
