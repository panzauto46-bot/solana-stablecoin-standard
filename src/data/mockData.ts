export interface Minter {
  id: string;
  address: string;
  label: string;
  mintedTotal: number;
  status: 'active' | 'paused' | 'revoked';
  lastActivity: string;
}

export interface TokenStats {
  name: string;
  symbol: string;
  totalSupply: number;
  circulatingSupply: number;
  burned: number;
  frozen: number;
  holders: number;
  transactions24h: number;
  type: 'SSS-1' | 'SSS-2';
}

export interface BlacklistEntry {
  address: string;
  reason: string;
  addedAt: string;
  addedBy: string;
  status: 'active' | 'removed';
}

export interface TxLog {
  id: string;
  timestamp: string;
  type: 'mint' | 'burn' | 'freeze' | 'unfreeze' | 'seize' | 'blacklist' | 'transfer';
  from: string;
  to: string;
  amount: number;
  token: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export const tokenStats: TokenStats[] = [
  {
    name: 'SSS Standard Token',
    symbol: 'SSS-1',
    totalSupply: 1_000_000_000,
    circulatingSupply: 750_000_000,
    burned: 50_000_000,
    frozen: 0,
    holders: 24_531,
    transactions24h: 12_847,
    type: 'SSS-1',
  },
  {
    name: 'SSS Security Token',
    symbol: 'SSS-2',
    totalSupply: 500_000_000,
    circulatingSupply: 320_000_000,
    burned: 30_000_000,
    frozen: 15_000_000,
    holders: 8_712,
    transactions24h: 3_291,
    type: 'SSS-2',
  },
];

export const minters: Minter[] = [
  { id: '1', address: '0x7a23...F4c1', label: 'Treasury Vault', mintedTotal: 250_000_000, status: 'active', lastActivity: '2 min ago' },
  { id: '2', address: '0xB891...A3d7', label: 'Reserve Pool', mintedTotal: 180_000_000, status: 'active', lastActivity: '15 min ago' },
  { id: '3', address: '0x1fE3...9Bc0', label: 'Liquidity Bridge', mintedTotal: 95_000_000, status: 'active', lastActivity: '1 hr ago' },
  { id: '4', address: '0xCd42...7E18', label: 'Partner Allocation', mintedTotal: 45_000_000, status: 'paused', lastActivity: '3 days ago' },
  { id: '5', address: '0x9A07...D5f2', label: 'Dev Fund', mintedTotal: 30_000_000, status: 'revoked', lastActivity: '12 days ago' },
];

export const blacklist: BlacklistEntry[] = [
  { address: '0xDEAD...1337', reason: 'Exploit — Flash loan attack', addedAt: '2024-01-15 09:32', addedBy: 'Admin', status: 'active' },
  { address: '0xBAD0...F00D', reason: 'Sanctions — OFAC flagged entity', addedAt: '2024-02-03 14:21', addedBy: 'Compliance', status: 'active' },
  { address: '0xFA1L...CAFE', reason: 'Rug pull linked wallet', addedAt: '2024-03-10 08:45', addedBy: 'Admin', status: 'removed' },
];

export const txLogs: TxLog[] = [
  { id: '1', timestamp: '2024-06-15 14:32:01', type: 'mint', from: 'Treasury', to: '0x7a23...F4c1', amount: 5_000_000, token: 'SSS-1', status: 'confirmed' },
  { id: '2', timestamp: '2024-06-15 14:28:45', type: 'burn', from: '0xB891...A3d7', to: '0x0000...0000', amount: 1_200_000, token: 'SSS-1', status: 'confirmed' },
  { id: '3', timestamp: '2024-06-15 14:25:12', type: 'freeze', from: 'Admin', to: '0xDEAD...1337', amount: 0, token: 'SSS-2', status: 'confirmed' },
  { id: '4', timestamp: '2024-06-15 14:20:33', type: 'seize', from: '0xBAD0...F00D', to: 'Treasury', amount: 850_000, token: 'SSS-2', status: 'confirmed' },
  { id: '5', timestamp: '2024-06-15 14:18:07', type: 'mint', from: 'Reserve', to: '0x1fE3...9Bc0', amount: 10_000_000, token: 'SSS-2', status: 'pending' },
  { id: '6', timestamp: '2024-06-15 14:15:44', type: 'blacklist', from: 'Compliance', to: '0xFA1L...CAFE', amount: 0, token: 'SSS-2', status: 'confirmed' },
  { id: '7', timestamp: '2024-06-15 14:10:22', type: 'transfer', from: '0xCd42...7E18', to: '0x9A07...D5f2', amount: 500_000, token: 'SSS-1', status: 'confirmed' },
  { id: '8', timestamp: '2024-06-15 14:05:18', type: 'burn', from: '0x9A07...D5f2', to: '0x0000...0000', amount: 250_000, token: 'SSS-2', status: 'failed' },
];

export const supplyHistory = [
  { date: 'Jan', sss1: 800_000_000, sss2: 400_000_000 },
  { date: 'Feb', sss1: 850_000_000, sss2: 420_000_000 },
  { date: 'Mar', sss1: 880_000_000, sss2: 440_000_000 },
  { date: 'Apr', sss1: 920_000_000, sss2: 460_000_000 },
  { date: 'May', sss1: 960_000_000, sss2: 480_000_000 },
  { date: 'Jun', sss1: 1_000_000_000, sss2: 500_000_000 },
];
