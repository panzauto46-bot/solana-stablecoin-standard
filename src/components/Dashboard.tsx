import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Coins,
  Flame,
  ShieldCheck,
  Snowflake,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { tokenStats, minters, supplyHistory, txLogs } from '../data/mockData';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(10, 18, 33, 0.92)',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: '12px',
  color: '#f1f5f9',
  boxShadow: '0 18px 32px -28px rgba(2, 6, 23, 0.9)',
} as const;

type TokenFilter = 'all' | 'SSS-1' | 'SSS-2';

export function Dashboard() {
  const [selectedToken, setSelectedToken] = useState<TokenFilter>('all');

  const filteredStats = selectedToken === 'all' ? tokenStats : tokenStats.filter(t => t.symbol === selectedToken);
  const totalSupply = filteredStats.reduce((s, t) => s + t.totalSupply, 0);
  const totalCirculating = filteredStats.reduce((s, t) => s + t.circulatingSupply, 0);
  const totalBurned = filteredStats.reduce((s, t) => s + t.burned, 0);
  const totalFrozen = filteredStats.reduce((s, t) => s + t.frozen, 0);
  const totalHolders = filteredStats.reduce((s, t) => s + t.holders, 0);
  const totalTx24h = filteredStats.reduce((s, t) => s + t.transactions24h, 0);
  const recentLogs = txLogs.slice(0, 6);

  const metricCards = useMemo(
    () => [
      {
        label: 'Total Supply',
        value: formatNumber(totalSupply),
        icon: Coins,
        change: '+2.4%',
        up: true,
        iconWrap: 'border border-sky-500/30 bg-sky-500/15',
        iconColor: 'text-sky-500',
      },
      {
        label: 'Circulating',
        value: formatNumber(totalCirculating),
        icon: TrendingUp,
        change: '+1.8%',
        up: true,
        iconWrap: 'border border-emerald-500/30 bg-emerald-500/15',
        iconColor: 'text-emerald-500',
      },
      {
        label: 'Burned',
        value: formatNumber(totalBurned),
        icon: Flame,
        change: '+0.5%',
        up: true,
        iconWrap: 'border border-orange-500/30 bg-orange-500/15',
        iconColor: 'text-orange-500',
      },
      {
        label: 'Frozen',
        value: formatNumber(totalFrozen),
        icon: Snowflake,
        change: '-3.2%',
        up: false,
        iconWrap: 'border border-cyan-500/30 bg-cyan-500/15',
        iconColor: 'text-cyan-500',
      },
      {
        label: 'Holders',
        value: formatNumber(totalHolders),
        icon: Users,
        change: '+5.1%',
        up: true,
        iconWrap: 'border border-indigo-500/30 bg-indigo-500/15',
        iconColor: 'text-indigo-500',
      },
      {
        label: 'Txns (24h)',
        value: formatNumber(totalTx24h),
        icon: Activity,
        change: '+12.7%',
        up: true,
        iconWrap: 'border border-rose-500/30 bg-rose-500/15',
        iconColor: 'text-rose-500',
      },
    ],
    [totalBurned, totalCirculating, totalFrozen, totalHolders, totalSupply, totalTx24h],
  );

  return (
    <div className="space-y-7">
      <section className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              Live Metrics
            </p>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">Token Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Overview of SSS-1 and SSS-2 ecosystem performance.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'SSS-1', 'SSS-2'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedToken(t)}
                className={`modern-chip px-4 py-2 text-sm font-semibold ${selectedToken === t ? 'active' : ''}`}
              >
                {t === 'all' ? 'All Tokens' : t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metricCards.map(({ label, value, icon: Icon, change, up, iconWrap, iconColor }) => (
          <article key={label} className="metric-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className={`rounded-xl p-2.5 ${iconWrap}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                  up ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                }`}
              >
                {up ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                {change}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="glass-panel rounded-3xl p-5 sm:col-span-2 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Supply Trend</h3>
            <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
              +5.8% six month
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplyHistory}>
                <defs>
                  <linearGradient id="colorSss1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSss2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.33} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v: number) => formatNumber(v)} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number | string | undefined) => [formatNumber(Number(value ?? 0)), '']} />
                <Legend wrapperStyle={{ paddingTop: 12 }} />
                <Area type="monotone" dataKey="sss1" name="SSS-1" stroke="#0ea5e9" fill="url(#colorSss1)" strokeWidth={2.2} />
                <Area type="monotone" dataKey="sss2" name="SSS-2" stroke="#14b8a6" fill="url(#colorSss2)" strokeWidth={2.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="glass-panel rounded-3xl p-5 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">Active Minters</h3>
          <div className="space-y-2.5">
            {minters.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 p-3 transition-colors hover:bg-white/85 dark:border-slate-700/70 dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
              >
                <span className={`h-2 w-2 flex-shrink-0 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : m.status === 'paused' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{m.label}</p>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{m.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatNumber(m.mintedTotal)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.lastActivity}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    m.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : m.status === 'paused'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {tokenStats.map(token => (
          <article key={token.symbol} className="glass-panel rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <div
                className={`rounded-2xl p-2.5 ${
                  token.type === 'SSS-1'
                    ? 'border border-sky-500/30 bg-sky-500/15'
                    : 'border border-emerald-500/30 bg-emerald-500/15'
                }`}
              >
                <Coins className={`h-5 w-5 ${token.type === 'SSS-1' ? 'text-sky-500' : 'text-emerald-500'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">{token.name}</h3>
                <span
                  className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    token.type === 'SSS-1'
                      ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {token.symbol}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {[
                { label: 'Total Supply', val: formatNumber(token.totalSupply) },
                { label: 'Circulating', val: formatNumber(token.circulatingSupply) },
                { label: 'Burned', val: formatNumber(token.burned) },
                { label: 'Frozen', val: formatNumber(token.frozen) },
                { label: 'Holders', val: formatNumber(token.holders) },
                { label: '24h Txns', val: formatNumber(token.transactions24h) },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-slate-200/70 bg-white/55 p-2.5 dark:border-slate-700/70 dark:bg-slate-800/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.val}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="glass-panel rounded-3xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
            <Clock3 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Recent Activity
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Audited
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">From</th>
                <th className="pb-3 font-semibold">To</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Token</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map(log => (
                <tr key={log.id}>
                  <td className="py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{log.timestamp.split(' ')[1]}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        log.type === 'mint'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : log.type === 'burn'
                            ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
                            : log.type === 'freeze'
                              ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                              : log.type === 'seize'
                                ? 'bg-red-500/15 text-red-700 dark:text-red-300'
                                : 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {log.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{log.from}</td>
                  <td className="py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{log.to}</td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{log.amount > 0 ? formatNumber(log.amount) : '-'}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{log.token}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        log.status === 'confirmed'
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : log.status === 'pending'
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          log.status === 'confirmed' ? 'bg-emerald-500' : log.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
