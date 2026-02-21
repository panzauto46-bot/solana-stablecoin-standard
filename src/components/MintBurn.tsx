import { useState } from 'react';
import { Coins, Flame, Send, AlertTriangle, CheckCircle2, ArrowRight, History } from 'lucide-react';

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
    setTimeout(() => setShowMintSuccess(false), 3000);
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
    setTimeout(() => setShowBurnSuccess(false), 3000);
    setBurnAmount('');
    setBurnFrom('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minting & Burning</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage token supply through minting and burning operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mint Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Mint Tokens</h2>
              <p className="text-emerald-100 text-xs">Create new tokens and send to address</p>
            </div>
          </div>
          <form onSubmit={handleMint} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Token Standard</label>
              <div className="flex gap-2">
                {(['SSS-1', 'SSS-2'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMintToken(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      mintToken === t
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Recipient Address</label>
              <input
                type="text"
                value={mintAddress}
                onChange={e => setMintAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
              <input
                type="number"
                value={mintAmount}
                onChange={e => setMintAmount(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            {showMintSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Mint transaction submitted successfully!</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!mintAddress || !mintAmount}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-emerald-500/25"
            >
              <Send className="w-4 h-4" />
              Mint {mintToken} Tokens
            </button>
          </form>
        </div>

        {/* Burn Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Burn Tokens</h2>
              <p className="text-orange-100 text-xs">Permanently remove tokens from circulation</p>
            </div>
          </div>
          <form onSubmit={handleBurn} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Token Standard</label>
              <div className="flex gap-2">
                {(['SSS-1', 'SSS-2'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBurnToken(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      burnToken === t
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Burn From (optional)</label>
              <input
                type="text"
                value={burnFrom}
                onChange={e => setBurnFrom(e.target.value)}
                placeholder="Leave empty to burn from treasury"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
              <input
                type="number"
                value={burnAmount}
                onChange={e => setBurnAmount(e.target.value)}
                placeholder="Enter amount..."
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-amber-700 dark:text-amber-300">Warning: Burning tokens is irreversible. Ensure the amount and source are correct before proceeding.</span>
            </div>
            {showBurnSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Burn transaction submitted successfully!</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!burnAmount}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-orange-500/25"
            >
              <Flame className="w-4 h-4" />
              Burn {burnToken} Tokens
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Session History</h3>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{history.length} operations</span>
          </div>
          <div className="space-y-2">
            {history.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className={`p-2 rounded-lg ${tx.type === 'mint' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                  {tx.type === 'mint' ? <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {tx.type === 'mint' ? 'Minted' : 'Burned'} <span className="font-bold">{Number(tx.amount).toLocaleString()}</span> {tx.token}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1">
                    {tx.type === 'mint' ? 'To:' : 'From:'} {tx.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{tx.timestamp}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Submitted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
