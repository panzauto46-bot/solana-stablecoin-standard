import { Connection, PublicKey } from "@solana/web3.js";
export type WalletLike = {
    publicKey: PublicKey;
    signTransaction?: <T>(tx: T) => Promise<T>;
    signAllTransactions?: <T>(txs: T[]) => Promise<T[]>;
};
export declare enum Presets {
    SSS_1 = "sss-1",
    SSS_2 = "sss-2"
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
declare class ComplianceModule {
    private readonly sdk;
    constructor(sdk: SolanaStablecoin);
    blacklistAdd(address: PublicKey, reason: string): Promise<TxResult>;
    blacklistRemove(address: PublicKey): Promise<TxResult>;
    seize(input: SeizeRequest): Promise<TxResult>;
    listBlacklist(): Array<{
        address: string;
        reason: string;
    }>;
}
export declare class SolanaStablecoin {
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
    private paused;
    private totalSupply;
    private readonly roles;
    readonly balances: Map<string, number>;
    readonly blacklist: Map<string, string>;
    private constructor();
    static create(connection: Connection, input: StablecoinCreateInput): Promise<SolanaStablecoin>;
    static open(connection: Connection, input: StablecoinCreateInput, snapshot: StablecoinSnapshot): Promise<SolanaStablecoin>;
    mintTo(input: MintRequest): Promise<TxResult>;
    mint(input: MintRequest): Promise<TxResult>;
    burn(input: BurnRequest): Promise<TxResult>;
    freeze(input: FreezeRequest): Promise<TxResult>;
    thaw(input: ThawRequest): Promise<TxResult>;
    pause(): Promise<TxResult>;
    unpause(): Promise<TxResult>;
    updateRoles(nextRoles: RoleUpdate): Promise<TxResult>;
    transferAuthority(newAuthority: PublicKey): Promise<TxResult>;
    getTotalSupply(): Promise<number>;
    holders(filter?: HolderFilter): Promise<HolderBalance[]>;
    mintersList(): Promise<Array<{
        address: string;
        role: string;
    }>>;
    getRoles(): MutableRoleState;
    status(): Promise<StablecoinStatus>;
    getStatus(): Promise<StablecoinStatus>;
    ensureCompliance(action: string): void;
    toSnapshot(): StablecoinSnapshot;
}
export {};
