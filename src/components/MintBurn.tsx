import { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Coins, Flame, History, Send, Sparkles } from 'lucide-react';

interface TxResult {
  type: 'mint' | 'burn';
  token: string;
  address: string;
  amount: string;
  timestamp: string;
}

export function MintBurn() {
  const [mintToken, setMintToken] = useState<'SSS-1' | 'SSS-2'>('SSS-1');
  const [mintAddress, setMintAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [burnToken, setBurnToken] = useState<'SSS-1' | 'SSS-2'>('SSS-1');
  const [burnAmount, setBurnAmount] = useState('');
  const [burnFrom, setBurnFrom] = useState('');
  const [history, setHistory] = useState<TxResult[]>([]);
  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [showBurnSuccess, setShowBurnSuccess] = useState(false);

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !mintAmount) return;
    const tx: TxResult = {
      type: 'mint',
      token: mintToken,
      address: mintAddress,
      amount: mintAmount,
      timestamp: new Date().toLocaleTimeString(),
    };
    setHistory(prev => [tx, ...prev]);
    setShowMintSuccess(true);
    setTimeout(() => setShowMintSuccess(false), 2600);
    setMintAddress('');
    setMintAmount('');
  };

  const handleBurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!burnAmount) return;
    const tx: TxResult = {
      type: 'burn',
      token: burnToken,
      address: burnFrom || 'Treasury',
      amount: burnAmount,
      timestamp: new Date().toLocaleTimeString(),
    };
    setHistory(prev => [tx, ...prev]);
    setShowBurnSuccess(true);
    setTimeout(() => setShowBurnSuccess(false), 2600);
    setBurnAmount('');
    setBurnFrom('');
  };

  return (
    <div className="space-y-7">
      <section className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Supply Controls
            </p>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">Minting and Burning</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage token supply through controlled issuance and irreversible burn operations.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div className="rounded-2xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300">
              <p className="font-semibold uppercase tracking-[0.12em]">Mint Window</p>
              <p className="mt-1 text-base font-bold">Open</p>
            </div>
            <div className="rounded-2xl border border-orange-400/35 bg-orange-500/10 px-3 py-2 text-orange-700 dark:text-orange-300">
              <p className="font-semibold uppercase tracking-[0.12em]">Burn Guard</p>
              <p className="mt-1 text-base font-bold">Enabled</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-5 rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/18 to-sky-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/20 p-2.5">
                <Coins className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Mint Tokens</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">Create new supply and dispatch directly to target address.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Token Standard</label>
              <div className="flex gap-2">
                {(['SSS-1', 'SSS-2'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMintToken(t)}
                    className={`modern-chip flex-1 px-3 py-2 text-sm font-semibold ${mintToken === t ? 'active' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Recipient Address</label>
              <input
                type="text"
                value={mintAddress}
                onChange={e => setMintAddress(e.target.value)}
                placeholder="0x..."
                className="modern-input px-4 py-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Amount</label>
              <input
                type="number"
                value={mintAmount}
                onChange={e => setMintAmount(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                className="modern-input px-4 py-2.5 text-sm"
              />
            </div>

            {showMintSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Mint transaction submitted successfully.</span>
              </div>
            )}

            <button type="submit" disabled={!mintAddress || !mintAmount} className="modern-button flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold">
              <Send className="h-4 w-4" />
              Mint {mintToken} Tokens
            </button>
          </form>
        </article>

        <article className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-5 rounded-2xl border border-orange-500/35 bg-gradient-to-r from-orange-500/20 to-rose-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/20 p-2.5">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Burn Tokens</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">Permanently remove tokens and reduce circulating supply.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleBurn} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Token Standard</label>
              <div className="flex gap-2">
                {(['SSS-1', 'SSS-2'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBurnToken(t)}
                    className={`modern-chip flex-1 px-3 py-2 text-sm font-semibold ${burnToken === t ? 'active' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Burn From (optional)</label>
              <input
                type="text"
                value={burnFrom}
                onChange={e => setBurnFrom(e.target.value)}
                placeholder="Leave empty to burn from treasury"
                className="modern-input px-4 py-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Amount</label>
              <input
                type="number"
                value={burnAmount}
                onChange={e => setBurnAmount(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                className="modern-input px-4 py-2.5 text-sm"
              />
            </div>

            <div className="flex items-start gap-2 rounded-2xl border border-amber-400/35 bg-amber-500/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                Warning: burning tokens is irreversible. Verify source wallet and amount before submitting.
              </span>
            </div>

            {showBurnSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Burn transaction submitted successfully.</span>
              </div>
            )}

            <button type="submit" disabled={!burnAmount} className="modern-button modern-button-warn flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold">
              <Flame className="h-4 w-4" />
              Burn {burnToken} Tokens
            </button>
          </form>
        </article>
      </section>

      {history.length > 0 && (
        <section className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Session History</h3>
            <span className="ml-auto rounded-full border border-slate-300/70 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-600/80 dark:text-slate-300">
              {history.length} operations
            </span>
          </div>
          <div className="space-y-2.5">
            {history.map((tx, i) => (
              <div
                key={`${tx.timestamp}-${i}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/75 bg-white/65 p-3 sm:flex-row sm:items-center dark:border-slate-700/75 dark:bg-slate-800/45"
              >
                <div className={`rounded-xl p-2.5 ${tx.type === 'mint' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-orange-500/15 text-orange-500'}`}>
                  {tx.type === 'mint' ? <Coins className="h-4 w-4" /> : <Flame className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {tx.type === 'mint' ? 'Minted' : 'Burned'} {Number(tx.amount).toLocaleString()} {tx.token}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {tx.type === 'mint' ? 'To:' : 'From:'} {tx.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start text-xs text-slate-500 dark:text-slate-400 sm:self-auto">
                  <ArrowRight className="h-4 w-4" />
                  <span>{tx.timestamp}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="status-dot live" />
                    Submitted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
