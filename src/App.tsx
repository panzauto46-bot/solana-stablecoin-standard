import { useMemo, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Dashboard } from './components/Dashboard';
import { MintBurn } from './components/MintBurn';
import { ComplianceDesk } from './components/ComplianceDesk';
import { AdminTUI } from './components/AdminTUI';
import {
  LayoutDashboard,
  Coins,
  ShieldAlert,
  Terminal,
  Sun,
  Moon,
  Menu,
  X,
  RefreshCw,
  Hexagon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

type Page = 'dashboard' | 'mintburn' | 'compliance' | 'terminal';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mintburn', label: 'Mint & Burn', icon: Coins },
  { id: 'compliance', label: 'Compliance', icon: ShieldAlert, badge: 'SSS-2' },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
];

const PAGE_META: Record<Page, { title: string; subtitle: string; tag: string }> = {
  dashboard: {
    title: 'Token Intelligence Hub',
    subtitle: 'Track supply movement, operator activity, and cross-token performance in one view.',
    tag: 'Analytics Layer',
  },
  mintburn: {
    title: 'Mint & Burn Workspace',
    subtitle: 'Execute controlled supply operations with clear guardrails and instant session history.',
    tag: 'Execution Layer',
  },
  compliance: {
    title: 'Compliance Command Desk',
    subtitle: 'Manage blacklist policy and seizure operations with auditable operator actions.',
    tag: 'Risk Layer',
  },
  terminal: {
    title: 'Admin Terminal Stream',
    subtitle: 'Live operational feed with command shortcuts for incident and performance monitoring.',
    tag: 'Ops Layer',
  },
};

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageMeta = useMemo(() => PAGE_META[activePage], [activePage]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'mintburn': return <MintBurn />;
      case 'compliance': return <ComplianceDesk />;
      case 'terminal': return <AdminTUI />;
    }
  };

  return (
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="app-ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-flow-band ambient-flow-band-top" />
        <div className="ambient-flow-band ambient-flow-band-left" />
        <div className="ambient-orb ambient-orb-a" />
        <div className="ambient-orb ambient-orb-b" />
        <div className="ambient-orb ambient-orb-c" />
        <div className="ambient-beam ambient-beam-a" />
        <div className="ambient-beam ambient-beam-b" />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full p-3">
          <div className="glass-panel-strong flex h-full flex-col overflow-hidden rounded-[1.75rem]">
            <div className="border-b border-slate-200/70 px-5 py-5 dark:border-slate-700/55">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 p-2.5 shadow-[0_20px_42px_-26px_rgba(14,165,233,0.8)]">
                    <Hexagon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">SSS Forge</h1>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">Command Center</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100/80 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/75 dark:hover:text-slate-100 lg:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                Navigation
              </p>
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? 'border-sky-400/35 bg-gradient-to-r from-sky-500/18 to-teal-500/18 text-sky-900 shadow-[0_12px_32px_-24px_rgba(14,165,233,0.8)] dark:text-sky-100'
                        : 'border-transparent text-slate-600 hover:border-slate-200/80 hover:bg-white/45 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700/80 dark:hover:bg-slate-700/45 dark:hover:text-slate-50'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? 'text-sky-600 dark:text-sky-300'
                          : 'text-slate-400 group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300'
                      }`}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/65 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200'
                            : 'bg-slate-200/80 text-slate-500 dark:bg-slate-700/70 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-slate-200/70 p-4 dark:border-slate-700/55">
              <div className="rounded-2xl border border-slate-200/75 bg-white/55 p-3 dark:border-slate-700/65 dark:bg-slate-800/40">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-xs font-bold text-white">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">Admin</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
                  </div>
                  <span className="status-dot live" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>System online</span>
                  <span className="ml-auto rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] dark:bg-slate-700/70">v2.1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6">
          <div className="glass-panel-strong rounded-3xl px-4 py-3.5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>Home</span>
                    <span>/</span>
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {NAV_ITEMS.find(n => n.id === activePage)?.label}
                    </span>
                  </div>
                  <p className="mt-0.5 hidden text-xs text-slate-500 sm:block dark:text-slate-400">{pageMeta.tag}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="rounded-xl border border-slate-200/80 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={toggleTheme}
                  className="rounded-xl border border-slate-200/80 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-800"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                </button>
                <div className="hidden items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-500/10 px-3 py-1.5 sm:flex">
                  <span className="status-dot live" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Mainnet</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-3 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
          <div className="mx-auto max-w-[1380px] stagger-in">
            <section className="glass-panel mb-6 rounded-3xl px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">SSS Forge Control Layer</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">{pageMeta.title}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pageMeta.subtitle}</p>
                </div>
                <div className="modern-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                  <span>{pageMeta.tag}</span>
                </div>
              </div>
            </section>

            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
