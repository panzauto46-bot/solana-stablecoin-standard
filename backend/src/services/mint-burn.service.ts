import { Connection } from "@solana/web3.js";
import { logger } from "../utils/logger";

export interface HolderEntry {
  address: string;
  balance: number;
}

export interface MintBurnAuditEntry {
  timestamp: string;
  action: "mint" | "burn" | "minter_add" | "minter_remove";
  details: string;
  txId?: string;
}

export class MintBurnService {
  private readonly connection: Connection;
  private readonly balances = new Map<string, number>();
  private readonly minters = new Set<string>();
  private readonly auditLog: MintBurnAuditEntry[] = [];

  constructor(connection: Connection) {
    this.connection = connection;
    this.minters.add("Hn1V...7kRq");
    this.minters.add("Fa8Z...P21s");
  }

  public async requestMint(amount: number, destination: string) {
    logger.info(`[MINT REQUEST] amount=${amount} destination=${destination}`);
    await this.verifyFiatDeposit(amount, destination);

    const normalized = this.normalizeAmount(amount);
    this.balances.set(destination, (this.balances.get(destination) ?? 0) + normalized);
    const txId = `mock_mint_tx_${Math.random().toString(36).substring(2, 12)}`;
    this.pushAudit("mint", `Minted ${normalized} to ${destination}`, txId);

    return {
      status: "success",
      amount: normalized,
      destination,
      txId,
      totalSupply: this.getTotalSupply(),
    };
  }

  public async requestBurn(amount: number, source: string) {
    logger.info(`[BURN REQUEST] amount=${amount} source=${source}`);
    const normalized = this.normalizeAmount(amount);
    const current = this.balances.get(source) ?? 0;
    if (current < normalized) {
      throw new Error(`Insufficient balance in source account ${source}`);
    }

    this.balances.set(source, current - normalized);
    const txId = `mock_burn_tx_${Math.random().toString(36).substring(2, 12)}`;
    this.pushAudit("burn", `Burned ${normalized} from ${source}`, txId);

    return {
      status: "success",
      amount: normalized,
      source,
      txId,
      totalSupply: this.getTotalSupply(),
    };
  }

  public getTotalSupply(): number {
    let sum = 0;
    for (const value of this.balances.values()) {
      sum += value;
    }
    return sum;
  }

  public getHolders(minBalance = 0): HolderEntry[] {
    return [...this.balances.entries()]
      .map(([address, balance]) => ({ address, balance }))
      .filter(h => h.balance >= minBalance)
      .sort((a, b) => b.balance - a.balance);
  }

  public listMinters(): string[] {
    return [...this.minters.values()];
  }

  public addMinter(address: string) {
    this.minters.add(address);
    this.pushAudit("minter_add", `Added minter ${address}`);
    return { status: "success", address };
  }

  public removeMinter(address: string) {
    if (!this.minters.has(address)) {
      throw new Error(`Minter ${address} not found.`);
    }
    this.minters.delete(address);
    this.pushAudit("minter_remove", `Removed minter ${address}`);
    return { status: "success", address };
  }

  public getAuditLog(action?: MintBurnAuditEntry["action"]): MintBurnAuditEntry[] {
    if (!action) return this.auditLog;
    return this.auditLog.filter(e => e.action === action);
  }

  private async verifyFiatDeposit(amount: number, destination: string): Promise<boolean> {
    logger.info(`[FIAT VERIFY] Checking collateral for destination=${destination}, amount=${amount}`);
    return new Promise(resolve => setTimeout(() => resolve(true), 800));
  }

  private normalizeAmount(amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    return Math.floor(amount);
  }

  private pushAudit(action: MintBurnAuditEntry["action"], details: string, txId?: string) {
    this.auditLog.unshift({
      timestamp: new Date().toISOString(),
      action,
      details,
      txId,
    });
    this.auditLog.splice(500);
  }
}
