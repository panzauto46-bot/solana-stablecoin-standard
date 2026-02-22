import { Connection, Keypair, PublicKey } from "@solana/web3.js";

export type WalletLike = {
  publicKey: PublicKey;
  signTransaction?: <T>(tx: T) => Promise<T>;
  signAllTransactions?: <T>(txs: T[]) => Promise<T[]>;
};

export enum Presets {
  SSS_1 = "sss-1",
  SSS_2 = "sss-2",
}

export interface ExtensionConfig {
  permanentDelegate?: boolean;
  transferHook?: boolean;
  defaultAccountFrozen?: boolean;
  metadata?: boolean;
}

export interface StablecoinCreateInput {
  preset?: Presets;
  name: string;
  symbol: string;
  uri?: string;
  decimals?: number;
  authority: WalletLike;
  programId?: PublicKey;
  extensions?: ExtensionConfig;
}

export interface MintRequest {
  recipient: PublicKey;
  amount: number;
  minter?: PublicKey;
}

export interface BurnRequest {
  amount: number;
  from?: PublicKey;
}

export interface FreezeRequest {
  address: PublicKey;
}

export interface ThawRequest {
  address: PublicKey;
}

export interface SeizeRequest {
  from: PublicKey;
  to: PublicKey;
  amount?: number;
}

export interface HolderFilter {
  minBalance?: number;
}

export interface RoleUpdate {
  master?: PublicKey;
  minter?: PublicKey;
  burner?: PublicKey;
  pauser?: PublicKey;
  blacklister?: PublicKey;
  seizer?: PublicKey;
}

export interface StablecoinStatus {
  mint: string;
  preset: Presets;
  paused: boolean;
  decimals: number;
  totalSupply: number;
  holders: number;
  transferHookEnabled: boolean;
  permanentDelegateEnabled: boolean;
  defaultAccountFrozen: boolean;
  blacklistCount: number;
}

export interface HolderBalance {
  address: string;
  balance: number;
}

export interface TxResult {
  signature: string;
}

export interface RoleStateSnapshot {
  master: string;
  minter: string;
  burner: string;
  pauser: string;
  blacklister: string;
  seizer: string;
}

export interface StablecoinSnapshot {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  preset: Presets;
  extensions: Required<ExtensionConfig>;
  paused: boolean;
  totalSupply: number;
  balances: Record<string, number>;
  blacklist: Record<string, string>;
  roles: RoleStateSnapshot;
}

type MutableRoleState = Required<RoleUpdate>;

const DEFAULT_PROGRAM_ID = "11111111111111111111111111111111";

function safePublicKey(raw: string): PublicKey {
  try {
    return new PublicKey(raw);
  } catch {
    return new PublicKey("11111111111111111111111111111111");
  }
}

function fakeSignature(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 14)}`;
}

function normalizeAmount(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  return Math.floor(amount);
}

function resolvePreset(input: StablecoinCreateInput): Presets {
  if (input.preset) {
    return input.preset;
  }
  const extensions = input.extensions ?? {};
  const looksCompliant = Boolean(extensions.permanentDelegate || extensions.transferHook);
  return looksCompliant ? Presets.SSS_2 : Presets.SSS_1;
}

function resolveExtensions(input: StablecoinCreateInput, preset: Presets): Required<ExtensionConfig> {
  const base: Required<ExtensionConfig> = {
    permanentDelegate: false,
    transferHook: false,
    defaultAccountFrozen: false,
    metadata: true,
  };

  if (preset === Presets.SSS_2) {
    base.permanentDelegate = true;
    base.transferHook = true;
  }

  const user = input.extensions ?? {};
  return {
    permanentDelegate: user.permanentDelegate ?? base.permanentDelegate,
    transferHook: user.transferHook ?? base.transferHook,
    defaultAccountFrozen: user.defaultAccountFrozen ?? base.defaultAccountFrozen,
    metadata: user.metadata ?? base.metadata,
  };
}

class ComplianceModule {
  private readonly sdk: SolanaStablecoin;

  constructor(sdk: SolanaStablecoin) {
    this.sdk = sdk;
  }

  async blacklistAdd(address: PublicKey, reason: string): Promise<TxResult> {
    this.sdk.ensureCompliance("blacklist add");
    this.sdk.blacklist.set(address.toBase58(), reason || "No reason");
    return { signature: fakeSignature("tx_blacklist_add") };
  }

  async blacklistRemove(address: PublicKey): Promise<TxResult> {
    this.sdk.ensureCompliance("blacklist remove");
    this.sdk.blacklist.delete(address.toBase58());
    return { signature: fakeSignature("tx_blacklist_remove") };
  }

  async seize(input: SeizeRequest): Promise<TxResult> {
    this.sdk.ensureCompliance("seize");
    const from = input.from.toBase58();
    const to = input.to.toBase58();
    if (this.sdk.blacklist.size > 0 && !this.sdk.blacklist.has(from)) {
      throw new Error(`Address ${from} is not blacklisted. Seize should target blacklisted accounts.`);
    }

    const fromBalance = this.sdk.balances.get(from) ?? 0;
    const requested = input.amount ? normalizeAmount(input.amount) : fromBalance;
    if (requested <= 0 || fromBalance < requested) {
      throw new Error(`Insufficient balance to seize from ${from}.`);
    }

    this.sdk.balances.set(from, fromBalance - requested);
    this.sdk.balances.set(to, (this.sdk.balances.get(to) ?? 0) + requested);
    return { signature: fakeSignature("tx_seize") };
  }

  listBlacklist(): Array<{ address: string; reason: string }> {
    return [...this.sdk.blacklist.entries()].map(([address, reason]) => ({ address, reason }));
  }
}

export class SolanaStablecoin {
  readonly connection: Connection;
  readonly authority: WalletLike;
  readonly programId: PublicKey;
  readonly mintAddress: PublicKey;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly preset: Presets;
  readonly extensions: Required<ExtensionConfig>;
  readonly compliance: ComplianceModule;

  private paused = false;
  private totalSupply = 0;
  private readonly roles: MutableRoleState;
  readonly balances = new Map<string, number>();
  readonly blacklist = new Map<string, string>();

  private constructor(connection: Connection, input: StablecoinCreateInput, mint: PublicKey) {
    this.connection = connection;
    this.authority = input.authority;
    this.programId = input.programId ?? safePublicKey(DEFAULT_PROGRAM_ID);
    this.mintAddress = mint;
    this.name = input.name;
    this.symbol = input.symbol;
    this.decimals = input.decimals ?? 6;
    this.preset = resolvePreset(input);
    this.extensions = resolveExtensions(input, this.preset);
    this.roles = {
      master: input.authority.publicKey,
      minter: input.authority.publicKey,
      burner: input.authority.publicKey,
      pauser: input.authority.publicKey,
      blacklister: input.authority.publicKey,
      seizer: input.authority.publicKey,
    };
    this.compliance = new ComplianceModule(this);
  }

  static async create(connection: Connection, input: StablecoinCreateInput): Promise<SolanaStablecoin> {
    if (!input.name?.trim()) throw new Error("Token name is required.");
    if (!input.symbol?.trim()) throw new Error("Token symbol is required.");
    if (!input.authority?.publicKey) throw new Error("Authority wallet with publicKey is required.");

    const preset = resolvePreset(input);
    const mint = Keypair.generate().publicKey;
    const sdk = new SolanaStablecoin(connection, { ...input, preset }, mint);

    console.log(`[SDK] create: ${input.name} (${input.symbol})`);
    console.log(`[SDK] preset: ${preset.toUpperCase()} | mint: ${mint.toBase58()} | program: ${sdk.programId.toBase58()}`);
    return sdk;
  }

  static async open(connection: Connection, input: StablecoinCreateInput, snapshot: StablecoinSnapshot): Promise<SolanaStablecoin> {
    const mint = new PublicKey(snapshot.mint);
    const sdk = new SolanaStablecoin(
      connection,
      {
        ...input,
        name: snapshot.name,
        symbol: snapshot.symbol,
        decimals: snapshot.decimals,
        preset: snapshot.preset,
        extensions: snapshot.extensions,
      },
      mint,
    );
    sdk.paused = snapshot.paused;
    sdk.totalSupply = snapshot.totalSupply;
    sdk.balances.clear();
    for (const [addr, bal] of Object.entries(snapshot.balances)) {
      sdk.balances.set(addr, bal);
    }
    sdk.blacklist.clear();
    for (const [addr, reason] of Object.entries(snapshot.blacklist)) {
      sdk.blacklist.set(addr, reason);
    }
    sdk.roles.master = new PublicKey(snapshot.roles.master);
    sdk.roles.minter = new PublicKey(snapshot.roles.minter);
    sdk.roles.burner = new PublicKey(snapshot.roles.burner);
    sdk.roles.pauser = new PublicKey(snapshot.roles.pauser);
    sdk.roles.blacklister = new PublicKey(snapshot.roles.blacklister);
    sdk.roles.seizer = new PublicKey(snapshot.roles.seizer);
    return sdk;
  }

  async mintTo(input: MintRequest): Promise<TxResult> {
    if (this.paused) throw new Error("Token is paused. Mint operation blocked.");
    const recipient = input.recipient.toBase58();
    const amount = normalizeAmount(input.amount);
    this.balances.set(recipient, (this.balances.get(recipient) ?? 0) + amount);
    this.totalSupply += amount;
    return { signature: fakeSignature("tx_mint") };
  }

  async mint(input: MintRequest): Promise<TxResult> {
    return this.mintTo(input);
  }

  async burn(input: BurnRequest): Promise<TxResult> {
    const from = (input.from ?? this.authority.publicKey).toBase58();
    const amount = normalizeAmount(input.amount);
    const current = this.balances.get(from) ?? 0;
    if (current < amount) throw new Error(`Insufficient balance to burn from ${from}.`);
    this.balances.set(from, current - amount);
    this.totalSupply -= amount;
    return { signature: fakeSignature("tx_burn") };
  }

  async freeze(input: FreezeRequest): Promise<TxResult> {
    const addr = input.address.toBase58();
    if (!this.blacklist.has(addr)) {
      this.blacklist.set(addr, "Frozen by pauser");
    }
    return { signature: fakeSignature("tx_freeze") };
  }

  async thaw(input: ThawRequest): Promise<TxResult> {
    const addr = input.address.toBase58();
    if (this.blacklist.get(addr) === "Frozen by pauser") {
      this.blacklist.delete(addr);
    }
    return { signature: fakeSignature("tx_thaw") };
  }

  async pause(): Promise<TxResult> {
    this.paused = true;
    return { signature: fakeSignature("tx_pause") };
  }

  async unpause(): Promise<TxResult> {
    this.paused = false;
    return { signature: fakeSignature("tx_unpause") };
  }

  async updateRoles(nextRoles: RoleUpdate): Promise<TxResult> {
    this.roles.master = nextRoles.master ?? this.roles.master;
    this.roles.minter = nextRoles.minter ?? this.roles.minter;
    this.roles.burner = nextRoles.burner ?? this.roles.burner;
    this.roles.pauser = nextRoles.pauser ?? this.roles.pauser;
    this.roles.blacklister = nextRoles.blacklister ?? this.roles.blacklister;
    this.roles.seizer = nextRoles.seizer ?? this.roles.seizer;
    return { signature: fakeSignature("tx_update_roles") };
  }

  async transferAuthority(newAuthority: PublicKey): Promise<TxResult> {
    this.roles.master = newAuthority;
    return { signature: fakeSignature("tx_transfer_authority") };
  }

  async getTotalSupply(): Promise<number> {
    return this.totalSupply;
  }

  async holders(filter?: HolderFilter): Promise<HolderBalance[]> {
    const min = filter?.minBalance ?? 0;
    return [...this.balances.entries()]
      .map(([address, balance]) => ({ address, balance }))
      .filter(h => h.balance >= min)
      .sort((a, b) => b.balance - a.balance);
  }

  async mintersList(): Promise<Array<{ address: string; role: string }>> {
    return [
      { address: this.roles.minter.toBase58(), role: "minter" },
      { address: this.roles.burner.toBase58(), role: "burner" },
    ];
  }

  getRoles(): MutableRoleState {
    return { ...this.roles };
  }

  async status(): Promise<StablecoinStatus> {
    const blacklistCount = this.blacklist.size;
    return {
      mint: this.mintAddress.toBase58(),
      preset: this.preset,
      paused: this.paused,
      decimals: this.decimals,
      totalSupply: this.totalSupply,
      holders: [...this.balances.values()].filter(v => v > 0).length,
      transferHookEnabled: this.extensions.transferHook,
      permanentDelegateEnabled: this.extensions.permanentDelegate,
      defaultAccountFrozen: this.extensions.defaultAccountFrozen,
      blacklistCount,
    };
  }

  async getStatus(): Promise<StablecoinStatus> {
    return this.status();
  }

  ensureCompliance(action: string) {
    if (this.preset !== Presets.SSS_2 || !this.extensions.permanentDelegate || !this.extensions.transferHook) {
      throw new Error(`Compliance action "${action}" requires SSS-2 with permanent delegate + transfer hook enabled.`);
    }
  }

  toSnapshot(): StablecoinSnapshot {
    return {
      mint: this.mintAddress.toBase58(),
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      preset: this.preset,
      extensions: this.extensions,
      paused: this.paused,
      totalSupply: this.totalSupply,
      balances: Object.fromEntries(this.balances.entries()),
      blacklist: Object.fromEntries(this.blacklist.entries()),
      roles: {
        master: this.roles.master.toBase58(),
        minter: this.roles.minter.toBase58(),
        burner: this.roles.burner.toBase58(),
        pauser: this.roles.pauser.toBase58(),
        blacklister: this.roles.blacklister.toBase58(),
        seizer: this.roles.seizer.toBase58(),
      },
    };
  }
}
