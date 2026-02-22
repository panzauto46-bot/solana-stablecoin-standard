import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Terminal } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'SYSTEM';
  module: string;
  message: string;
}

const MODULES = ['MINT', 'BURN', 'FREEZE', 'SEIZE', 'BLACKLIST', 'TRANSFER', 'ORACLE', 'BRIDGE', 'AUDIT', 'SYNC'];
const ADDRESSES = ['0x7a23...F4c1', '0xB891...A3d7', '0x1fE3...9Bc0', '0xDEAD...1337', '0xBAD0...F00D', '0xCd42...7E18', '0x9A07...D5f2'];
const TOKENS = ['SSS-1', 'SSS-2'];

function generateLog(): LogEntry {
  const now = new Date();
  const ts = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
  const mod = MODULES[Math.floor(Math.random() * MODULES.length)];
  const level: LogEntry['level'] = (['INFO', 'INFO', 'INFO', 'SUCCESS', 'WARN', 'ERROR', 'SYSTEM'] as const)[Math.floor(Math.random() * 7)];
  const addr = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)];
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const amount = (Math.floor(Math.random() * 10000) * 100).toLocaleString();

  const messages: Record<string, string[]> = {
    MINT: [`Minted ${amount} ${token} -> ${addr}`, `Mint request queued for ${addr} (${amount} ${token})`, `Minter role verified for ${addr}`],
    BURN: [`Burned ${amount} ${token} from ${addr}`, `Burn confirmation pending - ${amount} ${token}`, `Supply reduction: -${amount} ${token}`],
    FREEZE: [`Account ${addr} frozen - compliance hold`, `Freeze lifted for ${addr}`, `Freeze scan: ${Math.floor(Math.random() * 50)} accounts flagged`],
    SEIZE: [`Seized ${amount} ${token} from ${addr} -> Treasury`, `Seizure order executed - block #${Math.floor(Math.random() * 1000000)}`, `Asset recovery: ${amount} ${token} reclaimed`],
    BLACKLIST: [`${addr} added to blacklist - reason: sanctions`, `Blacklist check passed for ${addr}`, `Blacklist sync: ${Math.floor(Math.random() * 200)} entries active`],
    TRANSFER: [
      `Transfer ${amount} ${token}: ${addr} -> ${ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]}`,
      `Transfer validated - gas: ${(Math.random() * 0.01).toFixed(6)} ETH`,
    ],
    ORACLE: [
      `Price feed updated: ${token} = $${(Math.random() * 2 + 0.5).toFixed(4)}`,
      `Oracle heartbeat OK - latency ${Math.floor(Math.random() * 50)}ms`,
      `Price deviation alert: ${token} +/- ${(Math.random() * 5).toFixed(2)}%`,
    ],
    BRIDGE: [
      `Cross-chain bridge: ${amount} ${token} locked on L1`,
      `Bridge relay confirmed - ${Math.floor(Math.random() * 12)} confirmations`,
      `Bridge liquidity: ${(Math.random() * 100).toFixed(1)}M ${token} available`,
    ],
    AUDIT: [
      `Audit log entry #${Math.floor(Math.random() * 99999)} recorded`,
      `Compliance report generated - ${new Date().toLocaleDateString()}`,
      `Role change: ${addr} permissions updated`,
    ],
    SYNC: [
      `Block sync: #${(18_000_000 + Math.floor(Math.random() * 100000)).toLocaleString()} processed`,
      `Mempool scan: ${Math.floor(Math.random() * 500)} pending txns`,
      `Node peers: ${Math.floor(Math.random() * 50 + 10)} connected`,
    ],
  };

  const modMessages = messages[mod] || [`Operation completed on ${addr}`];
  const message = modMessages[Math.floor(Math.random() * modMessages.length)];
  return { timestamp: ts, level, module: mod, message };
}

const BANNER = `
  _____ _____ _____   _______ ____  _  _______ _   _
 / ____/ ____/ ____| |__   __/ __ \\| |/ / ____| \\ | |
| (___| (___| (___      | | | |  | | ' /| |__  |  \\| |
 \\___ \\\\___ \\\\___ \\     | | | |  | |  < |  __| | . \` |
 ____) |___) |___) |    | | | |__| | . \\| |____| |\\  |
|_____/_____/_____/     |_|  \\____/|_|\\_\\______|_| \\_|

               COMMAND CENTER v2.1.0 - ADMIN TERMINAL
`;

const HELP_TEXT = [
  'Available Commands:',
  '  help          - Show this help message',
  '  status        - Show system status',
  '  stats         - Show token statistics',
  '  minters       - List active minters',
  '  blacklist     - Show blacklisted addresses',
  '  clear         - Clear terminal',
  '  pause         - Pause log stream',
  '  resume        - Resume log stream',
  '  speed <ms>    - Set log interval (default: 1500ms)',
];

export function AdminTUI() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, generateLog()];
        if (newLogs.length > 220) return newLogs.slice(-220);
        return newLogs;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isPaused, speed]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, commandOutput]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(' ');

    if (parts[0] === 'help') {
      setCommandOutput(prev => [...prev, `> ${cmd}`, ...HELP_TEXT]);
    } else if (parts[0] === 'clear') {
      setLogs([]);
      setCommandOutput([]);
    } else if (parts[0] === 'pause') {
      setIsPaused(true);
      setCommandOutput(prev => [...prev, `> ${cmd}`, '[SYSTEM] Log stream paused']);
    } else if (parts[0] === 'resume') {
      setIsPaused(false);
      setCommandOutput(prev => [...prev, `> ${cmd}`, '[SYSTEM] Log stream resumed']);
    } else if (parts[0] === 'speed' && parts[1]) {
      const ms = parseInt(parts[1], 10);
      if (!isNaN(ms) && ms >= 100) {
        setSpeed(ms);
        setCommandOutput(prev => [...prev, `> ${cmd}`, `[SYSTEM] Log speed set to ${ms}ms`]);
      } else {
        setCommandOutput(prev => [...prev, `> ${cmd}`, '[ERROR] Invalid speed. Minimum is 100ms']);
      }
    } else if (parts[0] === 'status') {
      setCommandOutput(prev => [
        ...prev,
        `> ${cmd}`,
        'System status:',
        '- Node: Online | Connected',
        '- Block: #18,234,567',
        '- Gas price: 12.4 Gwei',
        '- Uptime: 99.97% (30d)',
        '- Contracts: SSS-1 OK | SSS-2 OK',
        '- Minters: 3/5 active',
        '- Blacklisted: 2 addresses',
      ]);
    } else if (parts[0] === 'stats') {
      setCommandOutput(prev => [
        ...prev,
        `> ${cmd}`,
        'Token statistics:',
        '- SSS-1 supply: 1,000,000,000 | circulating: 750,000,000 | burned: 50,000,000',
        '- SSS-2 supply: 500,000,000 | circulating: 320,000,000 | burned: 30,000,000 | frozen: 15,000,000',
      ]);
    } else if (parts[0] === 'minters') {
      setCommandOutput(prev => [
        ...prev,
        `> ${cmd}`,
        'Active minters:',
        '- 0x7a23...F4c1 | Treasury Vault | active',
        '- 0xB891...A3d7 | Reserve Pool | active',
        '- 0x1fE3...9Bc0 | Liquidity Bridge | active',
        '- 0xCd42...7E18 | Partner Allocation | paused',
        '- 0x9A07...D5f2 | Dev Fund | revoked',
      ]);
    } else if (parts[0] === 'blacklist') {
      setCommandOutput(prev => [
        ...prev,
        `> ${cmd}`,
        'Blacklist registry:',
        '- 0xDEAD...1337 | Exploit - Flash loan | BLOCKED',
        '- 0xBAD0...F00D | Sanctions - OFAC | BLOCKED',
        '- 0xFA1L...CAFE | Rug pull linked | REMOVED',
      ]);
    } else if (trimmed === '') {
      return;
    } else {
      setCommandOutput(prev => [...prev, `> ${cmd}`, `[ERROR] Unknown command: "${trimmed}". Type "help" for available commands.`]);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(commandInput);
      setCommandInput('');
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return 'text-cyan-300';
      case 'WARN':
        return 'text-amber-300';
      case 'ERROR':
        return 'text-rose-300';
      case 'SUCCESS':
        return 'text-emerald-300';
      case 'SYSTEM':
        return 'text-fuchsia-300';
    }
  };

  const getModuleColor = (mod: string) => {
    const colors: Record<string, string> = {
      MINT: 'text-emerald-400',
      BURN: 'text-orange-400',
      FREEZE: 'text-cyan-400',
      SEIZE: 'text-rose-400',
      BLACKLIST: 'text-red-400',
      TRANSFER: 'text-sky-400',
      ORACLE: 'text-amber-400',
      BRIDGE: 'text-indigo-300',
      AUDIT: 'text-pink-300',
      SYNC: 'text-slate-400',
    };
    return colors[mod] || 'text-slate-300';
  };

  const statCards = [
    { label: 'Events Captured', value: logs.length, tone: 'text-cyan-400' },
    { label: 'Errors', value: logs.filter(l => l.level === 'ERROR').length, tone: 'text-rose-400' },
    { label: 'Warnings', value: logs.filter(l => l.level === 'WARN').length, tone: 'text-amber-400' },
    { label: 'Success Ops', value: logs.filter(l => l.level === 'SUCCESS').length, tone: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
              <Terminal className="h-6 w-6 text-emerald-500" />
              Admin Terminal
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Real-time operations stream with interactive command line controls.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className={`status-dot ${isPaused ? 'warn' : 'live'}`} />
              {isPaused ? 'Paused' : 'Live'}
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="rounded-xl border border-slate-300/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600/80 dark:bg-slate-800/65 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl border border-slate-300/80 bg-white/70 p-1.5 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600/80 dark:bg-slate-800/65 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>

      <section className={`${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-700/75 bg-slate-950/95 font-mono text-xs shadow-[0_28px_76px_-36px_rgba(2,6,23,0.96)]"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center gap-2 border-b border-slate-800/90 bg-slate-900/90 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <span className="ml-2 text-slate-400">sss-admin@command-center:~</span>
            <span className="ml-auto text-[11px] text-slate-500">{logs.length} events | {speed}ms interval</span>
          </div>

          <div ref={scrollRef} className={`overflow-y-auto p-4 ${isFullscreen ? 'h-[calc(100vh-11rem)]' : 'h-[620px]'}`} style={{ scrollBehavior: 'smooth' }}>
            <pre className="mb-4 text-[10px] leading-tight text-emerald-400">{BANNER}</pre>

            <div className="mb-4 text-slate-500">
              ----------------------------------------------------------------
              <br />
              Type <span className="text-emerald-400">"help"</span> for available commands. Log stream is{' '}
              {isPaused ? <span className="text-amber-300">PAUSED</span> : <span className="text-emerald-300">ACTIVE</span>}.
              <br />
              ----------------------------------------------------------------
            </div>

            {commandOutput.map((line, i) => (
              <div
                key={`cmd-${i}`}
                className={`whitespace-pre ${
                  line.startsWith('>')
                    ? 'text-emerald-400'
                    : line.includes('[ERROR]')
                      ? 'text-rose-300'
                      : line.includes('[SYSTEM]')
                        ? 'text-fuchsia-300'
                        : line.endsWith(':')
                          ? 'text-cyan-300'
                          : 'text-slate-300'
                }`}
              >
                {line}
              </div>
            ))}

            {logs.map((log, i) => (
              <div key={`log-${i}`} className="flex gap-2 leading-5 hover:bg-slate-900/60">
                <span className="text-slate-600">[{log.timestamp}]</span>
                <span className={`${getLevelColor(log.level)} w-16 flex-shrink-0`}>[{log.level.padEnd(7)}]</span>
                <span className={`${getModuleColor(log.module)} w-20 flex-shrink-0`}>{log.module.padEnd(9)}</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}

            <div className="mt-2 flex items-center gap-2">
              <span className="text-emerald-500">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-emerald-300 outline-none caret-emerald-300"
                placeholder="Enter command..."
                autoFocus
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${isFullscreen ? 'pointer-events-none opacity-0' : 'opacity-100'} transition-opacity`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map(s => (
            <div key={s.label} className="glass-panel rounded-2xl p-3 text-center">
              <p className={`text-xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
