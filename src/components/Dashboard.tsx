import { useState } from 'react';
import { Coins, Users, Flame, Snowflake, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Clock } from 'lucide-react';
import { tokenStats, minters, supplyHistory, txLogs } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function Dashboard() {
  const [selectedToken, setSelectedToken] = useState<'all' | 'SSS-1' | 'SSS-2'>('all');

  const filteredStats = selectedToken === 'all' ? tokenStats : tokenStats.filter(t => t.symbol === selectedToken);
  const totalSupply = filteredStats.reduce((s, t) => s + t.totalSupply, 0);
  const totalCirculating = filteredStats.reduce((s, t) => s + t.circulatingSupply, 0);
  const totalBurned = filteredStats.reduce((s, t) => s + t.burned, 0);
  const totalFrozen = filteredStats.reduce((s, t) => s + t.frozen, 0);
  const totalHolders = filteredStats.reduce((s, t) => s + t.holders, 0);
  const totalTx24h = filteredStats.reduce((s, t) => s + t.transactions24h, 0);

  const recentLogs = txLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Token Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of SSS-1 & SSS-2 token ecosystem</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'SSS-1', 'SSS-2'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedToken(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedToken === t
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t === 'all' ? 'All Tokens' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Supply', value: formatNumber(totalSupply), icon: Coins, color: 'indigo', change: '+2.4%', up: true },
          { label: 'Circulating', value: formatNumber(totalCirculating), icon: TrendingUp, color: 'emerald', change: '+1.8%', up: true },
          { label: 'Total Burned', value: formatNumber(totalBurned), icon: Flame, color: 'orange', change: '+0.5%', up: true },
          { label: 'Frozen Supply', value: formatNumber(totalFrozen), icon: Snowflake, color: 'cyan', change: '-3.2%', up: false },
          { label: 'Holders', value: formatNumber(totalHolders), icon: Users, color: 'violet', change: '+5.1%', up: true },
          { label: 'Txns (24h)', value: formatNumber(totalTx24h), icon: Activity, color: 'rose', change: '+12.7%', up: true },
        ].map(({ label, value, icon: Icon, color, change, up }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                <Icon className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <span className={`flex items-center text-xs font-medium ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {change}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts & Minters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supply Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supply Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplyHistory}>
                <defs>
                  <linearGradient id="colorSss1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSss2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v: number) => formatNumber(v)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number | string | undefined) => [formatNumber(Number(value ?? 0)), '']}
                />
                <Legend />
                <Area type="monotone" dataKey="sss1" name="SSS-1" stroke="#6366f1" fill="url(#colorSss1)" strokeWidth={2} />
                <Area type="monotone" dataKey="sss2" name="SSS-2" stroke="#10b981" fill="url(#colorSss2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Minters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Minters</h3>
          <div className="space-y-3">
            {minters.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  m.status === 'active' ? 'bg-emerald-500' : m.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{m.address}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatNumber(m.mintedTotal)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{m.lastActivity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tokenStats.map(token => (
          <div key={token.symbol} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${token.type === 'SSS-1' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                <Coins className={`w-5 h-5 ${token.type === 'SSS-1' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{token.name}</h3>
                <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                  token.type === 'SSS-1' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                }`}>{token.symbol}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Supply', val: formatNumber(token.totalSupply) },
                { label: 'Circulating', val: formatNumber(token.circulatingSupply) },
                { label: 'Burned', val: formatNumber(token.burned) },
                { label: 'Frozen', val: formatNumber(token.frozen) },
                { label: 'Holders', val: formatNumber(token.holders) },
                { label: '24h Txns', val: formatNumber(token.transactions24h) },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">From</th>
                <th className="pb-3 font-medium">To</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Token</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 text-gray-600 dark:text-gray-300 font-mono text-xs">{log.timestamp.split(' ')[1]}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      log.type === 'mint' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                      log.type === 'burn' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                      log.type === 'freeze' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' :
                      log.type === 'seize' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {log.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{log.from}</td>
                  <td className="py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{log.to}</td>
                  <td className="py-3 font-semibold text-gray-900 dark:text-white">{log.amount > 0 ? formatNumber(log.amount) : '—'}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{log.token}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      log.status === 'confirmed' ? 'text-emerald-600 dark:text-emerald-400' :
                      log.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'confirmed' ? 'bg-emerald-500' :
                        log.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
