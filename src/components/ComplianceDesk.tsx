import { useState } from 'react';
import { ShieldAlert, Plus, Trash2, AlertTriangle, CheckCircle2, Ban, Gavel, Search, Eye, X } from 'lucide-react';
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

  const filteredEntries = blacklistEntries.filter(e =>
    e.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    setTimeout(() => setShowAddSuccess(false), 3000);
    setNewAddress('');
    setNewReason('');
  };

  const handleRemove = (address: string) => {
    setBlacklistEntries(prev =>
      prev.map(e => e.address === address ? { ...e, status: 'removed' as const } : e)
    );
  };

  const handleReactivate = (address: string) => {
    setBlacklistEntries(prev =>
      prev.map(e => e.address === address ? { ...e, status: 'active' as const } : e)
    );
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
    setTimeout(() => setShowSeizeSuccess(false), 3000);
    setSeizeAddress('');
    setSeizeAmount('');
  };

  const activeCount = blacklistEntries.filter(e => e.status === 'active').length;
  const removedCount = blacklistEntries.filter(e => e.status === 'removed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          Compliance Desk
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">SSS-2 Security Token — Blacklist management & asset seizure</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">Active Blacklisted</span>
          </div>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{activeCount}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Removed</span>
          </div>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{removedCount}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gavel className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Assets Seized</span>
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{seizeHistory.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add to Blacklist */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add to Blacklist</h2>
              <p className="text-red-200 text-xs">Block address from all SSS-2 operations</p>
            </div>
          </div>
          <form onSubmit={handleAddBlacklist} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Wallet Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reason</label>
              <select
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">Select reason...</option>
                <option value="Exploit — Flash loan attack">Exploit — Flash loan attack</option>
                <option value="Sanctions — OFAC flagged entity">Sanctions — OFAC flagged</option>
                <option value="Money laundering suspected">Money laundering suspected</option>
                <option value="Rug pull linked wallet">Rug pull linked wallet</option>
                <option value="Phishing / Social engineering">Phishing / Social engineering</option>
                <option value="Other — Manual review">Other — Manual review</option>
              </select>
            </div>
            {showAddSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Address added to blacklist!</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!newAddress || !newReason}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              <Ban className="w-4 h-4" />
              Add to Blacklist
            </button>
          </form>
        </div>

        {/* Seize Assets */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Gavel className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Seize Assets</h2>
              <p className="text-amber-200 text-xs">Confiscate balance from compromised wallet</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Address</label>
              <input
                type="text"
                value={seizeAddress}
                onChange={e => setSeizeAddress(e.target.value)}
                placeholder="0x... (blacklisted address)"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount to Seize</label>
              <input
                type="number"
                value={seizeAmount}
                onChange={e => setSeizeAmount(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Destination</label>
              <input
                type="text"
                value={seizeDest}
                onChange={e => setSeizeDest(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 dark:text-red-300">Seizure is a critical compliance action. This will forcibly transfer tokens from the target to the destination. An audit log will be created.</span>
            </div>
            {showSeizeSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Assets seized successfully!</span>
              </div>
            )}
            <button
              onClick={() => setShowConfirmSeize(true)}
              disabled={!seizeAddress || !seizeAmount}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              <Gavel className="w-4 h-4" />
              Seize Assets
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSeize && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Confirm Seizure
              </h3>
              <button onClick={() => setShowConfirmSeize(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{seizeAddress}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{Number(seizeAmount).toLocaleString()} SSS-2</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
                <p className="text-sm text-gray-900 dark:text-white">{seizeDest}</p>
              </div>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmSeize(false)} className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSeize} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
                Confirm Seizure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blacklist Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            Blacklist Registry
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search address or reason..."
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">Address</th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium">Added</th>
                <th className="pb-3 font-medium">By</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredEntries.map((entry, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 font-mono text-xs text-gray-900 dark:text-white">{entry.address}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300 text-xs max-w-xs truncate">{entry.reason}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{entry.addedAt}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{entry.addedBy}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      entry.status === 'active'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {entry.status === 'active' ? 'BLOCKED' : 'REMOVED'}
                    </span>
                  </td>
                  <td className="py-3">
                    {entry.status === 'active' ? (
                      <button
                        onClick={() => handleRemove(entry.address)}
                        className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(entry.address)}
                        className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
                      >
                        <Ban className="w-3 h-3" />
                        Re-block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seize History */}
      {seizeHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-500" />
            Seizure Audit Log
          </h3>
          <div className="space-y-2">
            {seizeHistory.map((rec, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <Gavel className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Seized <span className="font-bold">{Number(rec.amount).toLocaleString()}</span> SSS-2 from <span className="font-mono text-xs">{rec.address}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">→ {rec.destination} at {rec.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
