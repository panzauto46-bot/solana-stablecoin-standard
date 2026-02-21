import { useState } from 'react';
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
} from 'lucide-react';

type Page = 'dashboard' | 'mintburn' | 'compliance' | 'terminal';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mintburn', label: 'Mint & Burn', icon: Coins },
  { id: 'compliance', label: 'Compliance', icon: ShieldAlert, badge: 'SSS-2' },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
];

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
                  <Hexagon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">SSS Token</h1>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">Command Center</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Main Menu</p>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>System Online</span>
              <span className="ml-auto">v2.1.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Home</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {NAV_ITEMS.find(n => n.id === activePage)?.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600" />
                )}
              </button>
              {/* Network Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Mainnet</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
