import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Maximize2, Minimize2 } from 'lucide-react';

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
  const ts = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  const mod = MODULES[Math.floor(Math.random() * MODULES.length)];
  const level: LogEntry['level'] = (['INFO', 'INFO', 'INFO', 'SUCCESS', 'WARN', 'ERROR', 'SYSTEM'] as const)[Math.floor(Math.random() * 7)];
  const addr = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)];
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const amount = (Math.floor(Math.random() * 10000) * 100).toLocaleString();

  const messages: Record<string, string[]> = {
    MINT: [`Minted ${amount} ${token} → ${addr}`, `Mint request queued for ${addr} (${amount} ${token})`, `Minter role verified for ${addr}`],
    BURN: [`Burned ${amount} ${token} from ${addr}`, `Burn confirmation pending — ${amount} ${token}`, `Supply reduction: -${amount} ${token}`],
    FREEZE: [`Account ${addr} frozen — compliance hold`, `Freeze lifted for ${addr}`, `Freeze scan: ${Math.floor(Math.random() * 50)} accounts flagged`],
    SEIZE: [`Seized ${amount} ${token} from ${addr} → Treasury`, `Seizure order executed — block #${Math.floor(Math.random() * 1000000)}`, `Asset recovery: ${amount} ${token} reclaimed`],
    BLACKLIST: [`${addr} added to blacklist — reason: sanctions`, `Blacklist check passed for ${addr}`, `Blacklist sync: ${Math.floor(Math.random() * 200)} entries active`],
    TRANSFER: [`Transfer ${amount} ${token}: ${addr} → ${ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]}`, `Transfer validated — gas: ${(Math.random() * 0.01).toFixed(6)} ETH`],
    ORACLE: [`Price feed updated: ${token} = $${(Math.random() * 2 + 0.5).toFixed(4)}`, `Oracle heartbeat OK — latency ${Math.floor(Math.random() * 50)}ms`, `Price deviation alert: ${token} ±${(Math.random() * 5).toFixed(2)}%`],
    BRIDGE: [`Cross-chain bridge: ${amount} ${token} locked on L1`, `Bridge relay confirmed — ${Math.floor(Math.random() * 12)} confirmations`, `Bridge liquidity: ${(Math.random() * 100).toFixed(1)}M ${token} available`],
    AUDIT: [`Audit log entry #${Math.floor(Math.random() * 99999)} recorded`, `Compliance report generated — ${new Date().toLocaleDateString()}`, `Role change: ${addr} permissions updated`],
    SYNC: [`Block sync: #${(18_000_000 + Math.floor(Math.random() * 100000)).toLocaleString()} processed`, `Mempool scan: ${Math.floor(Math.random() * 500)} pending txns`, `Node peers: ${Math.floor(Math.random() * 50 + 10)} connected`],
  };

  const modMessages = messages[mod] || [`Operation completed on ${addr}`];
  const message = modMessages[Math.floor(Math.random() * modMessages.length)];

  return { timestamp: ts, level, module: mod, message };
}

const BANNER = `
 ███████╗███████╗███████╗    ████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗
 ██╔════╝██╔════╝██╔════╝    ╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
 ███████╗███████╗███████╗       ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
 ╚════██║╚════██║╚════██║       ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
 ███████║███████║███████║       ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║
 ╚══════╝╚══════╝╚══════╝       ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
                    COMMAND CENTER v2.1.0 — ADMIN TERMINAL
`;

const HELP_TEXT = `
Available Commands:
  help          — Show this help message
  status        — Show system status
  stats         — Show token statistics
  minters       — List active minters
  blacklist     — Show blacklisted addresses
  clear         — Clear terminal
  pause         — Pause log stream
  resume        — Resume log stream
  speed <ms>    — Set log interval (default: 1500ms)
`;

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
        if (newLogs.length > 200) return newLogs.slice(-200);
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
      setCommandOutput(prev => [...prev, `> ${cmd}`, HELP_TEXT]);
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
      const ms = parseInt(parts[1]);
      if (!isNaN(ms) && ms >= 100) {
        setSpeed(ms);
        setCommandOutput(prev => [...prev, `> ${cmd}`, `[SYSTEM] Log speed set to ${ms}ms`]);
      } else {
        setCommandOutput(prev => [...prev, `> ${cmd}`, '[ERROR] Invalid speed. Min: 100ms']);
      }
    } else if (parts[0] === 'status') {
      setCommandOutput(prev => [...prev, `> ${cmd}`,
        '┌─────────────────────────────────────────┐',
        '│  SYSTEM STATUS                          │',
        '│  Node:        Online ● Connected        │',
        '│  Block:       #18,234,567               │',
        '│  Gas Price:   12.4 Gwei                 │',
        '│  Uptime:      99.97% (30d)              │',
        '│  Contracts:   SSS-1 ✓  SSS-2 ✓          │',
        '│  Minters:     3/5 Active                │',
        '│  Blacklisted: 2 Addresses               │',
        '└─────────────────────────────────────────┘',
      ]);
    } else if (parts[0] === 'stats') {
      setCommandOutput(prev => [...prev, `> ${cmd}`,
        '┌────────────────────────────────────────────────┐',
        '│  TOKEN STATISTICS                              │',
        '│                                                │',
        '│  SSS-1 Standard Token                          │',
        '│    Supply:      1,000,000,000                  │',
        '│    Circulating:   750,000,000                  │',
        '│    Burned:         50,000,000                  │',
        '│    Holders:            24,531                  │',
        '│                                                │',
        '│  SSS-2 Security Token                          │',
        '│    Supply:        500,000,000                  │',
        '│    Circulating:   320,000,000                  │',
        '│    Burned:         30,000,000                  │',
        '│    Frozen:         15,000,000                  │',
        '│    Holders:             8,712                  │',
        '└────────────────────────────────────────────────┘',
      ]);
    } else if (parts[0] === 'minters') {
      setCommandOutput(prev => [...prev, `> ${cmd}`,
        '┌───────────────────────────────────────────────────────┐',
        '│  ACTIVE MINTERS                                      │',
        '│  1. 0x7a23...F4c1  Treasury Vault    ● Active        │',
        '│  2. 0xB891...A3d7  Reserve Pool      ● Active        │',
        '│  3. 0x1fE3...9Bc0  Liquidity Bridge  ● Active        │',
        '│  4. 0xCd42...7E18  Partner Alloc     ○ Paused        │',
        '│  5. 0x9A07...D5f2  Dev Fund          ✕ Revoked       │',
        '└───────────────────────────────────────────────────────┘',
      ]);
    } else if (parts[0] === 'blacklist') {
      setCommandOutput(prev => [...prev, `> ${cmd}`,
        '┌──────────────────────────────────────────────────────────┐',
        '│  BLACKLIST REGISTRY                                     │',
        '│  1. 0xDEAD...1337  Exploit — Flash loan    [BLOCKED]   │',
        '│  2. 0xBAD0...F00D  Sanctions — OFAC        [BLOCKED]   │',
        '│  3. 0xFA1L...CAFE  Rug pull linked         [REMOVED]   │',
        '└──────────────────────────────────────────────────────────┘',
      ]);
    } else if (trimmed === '') {
      // do nothing
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
      case 'INFO': return 'text-cyan-400';
      case 'WARN': return 'text-yellow-400';
      case 'ERROR': return 'text-red-400';
      case 'SUCCESS': return 'text-green-400';
      case 'SYSTEM': return 'text-purple-400';
    }
  };

  const getModuleColor = (mod: string) => {
    const colors: Record<string, string> = {
      MINT: 'text-green-500',
      BURN: 'text-orange-500',
      FREEZE: 'text-cyan-500',
      SEIZE: 'text-red-500',
      BLACKLIST: 'text-red-400',
      TRANSFER: 'text-blue-400',
      ORACLE: 'text-yellow-500',
      BRIDGE: 'text-purple-500',
      AUDIT: 'text-pink-400',
      SYNC: 'text-gray-400',
    };
    return colors[mod] || 'text-gray-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-green-500" />
            Admin Terminal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time operations monitor — Interactive CLI</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{isPaused ? 'Paused' : 'Live'}</span>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div
        className={`bg-gray-950 rounded-xl border border-gray-800 overflow-hidden font-mono text-xs transition-all ${
          isFullscreen ? 'fixed inset-4 z-50' : ''
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border-b border-gray-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs ml-2">sss-admin@command-center:~</span>
          <span className="ml-auto text-gray-600 text-xs">{logs.length} events • {speed}ms interval</span>
        </div>

        {/* Terminal Content */}
        <div
          ref={scrollRef}
          className={`overflow-y-auto p-4 ${isFullscreen ? 'h-[calc(100%-80px)]' : 'h-[600px]'}`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Banner */}
          <pre className="text-green-500 mb-4 text-[10px] leading-tight">{BANNER}</pre>
          <div className="text-gray-500 mb-4">
            ─────────────────────────────────────────────────────────────────
            <br />
            Type <span className="text-green-400">"help"</span> for available commands. Log stream is {isPaused ? <span className="text-yellow-400">PAUSED</span> : <span className="text-green-400">ACTIVE</span>}.
            <br />
            ─────────────────────────────────────────────────────────────────
          </div>

          {/* Command outputs */}
          {commandOutput.map((line, i) => (
            <div key={`cmd-${i}`} className={`${
              line.startsWith('>') ? 'text-green-400' :
              line.includes('[ERROR]') ? 'text-red-400' :
              line.includes('[SYSTEM]') ? 'text-purple-400' :
              line.includes('─') || line.includes('│') || line.includes('┌') || line.includes('└') || line.includes('┐') || line.includes('┘') ? 'text-cyan-400' :
              'text-gray-300'
            } whitespace-pre`}>
              {line}
            </div>
          ))}

          {/* Log entries */}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 leading-5 hover:bg-gray-900/50">
              <span className="text-gray-600">[{log.timestamp}]</span>
              <span className={`${getLevelColor(log.level)} w-16 flex-shrink-0`}>[{log.level.padEnd(7)}]</span>
              <span className={`${getModuleColor(log.module)} w-20 flex-shrink-0`}>{log.module.padEnd(9)}</span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}

          {/* Command Input */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-500">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
              placeholder=""
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Events Captured', value: logs.length, color: 'text-cyan-500' },
          { label: 'Errors', value: logs.filter(l => l.level === 'ERROR').length, color: 'text-red-500' },
          { label: 'Warnings', value: logs.filter(l => l.level === 'WARN').length, color: 'text-yellow-500' },
          { label: 'Success Ops', value: logs.filter(l => l.level === 'SUCCESS').length, color: 'text-green-500' },
        ].map(s => (
          <div key={s.label} className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
