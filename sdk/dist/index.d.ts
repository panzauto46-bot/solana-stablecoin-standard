import { Connection, PublicKey } from "@solana/web3.js";
export declare class SolanaStablecoin {
    connection: Connection;
    wallet: any;
    programId: PublicKey;
    private constructor();
    /**
     * Initialize a new instance of the SDK
     */
    static create(connection: Connection, wallet: any, programId: PublicKey): Promise<SolanaStablecoin>;
    /**
     * Initializes a brand new Stablecoin Mint
     * @param preset 'sss-1' (Minimal) or 'sss-2' (Compliant with Transfer Hooks & Delegates)
     * @param name Name of the Token
     * @param symbol Symbol of the Token
     */
    initMint(preset: 'sss-1' | 'sss-2', name: string, symbol: string, decimals?: number): Promise<PublicKey>;
    /**
     * Mint tokens to a given destination
     */
    mint(mintAddress: PublicKey, destination: PublicKey, amount: number): Promise<string>;
    /**
     * Burn tokens from the connected wallet (Treasury)
     */
    burn(mintAddress: PublicKey, targetAccount: PublicKey, amount: number): Promise<string>;
    /**
     * Freeze a suspicious user token account
     */
    freeze(mintAddress: PublicKey, targetAccount: PublicKey): Promise<string>;
    /**
     * Thaw previously frozen user account
     */
    thaw(mintAddress: PublicKey, targetAccount: PublicKey): Promise<string>;
    /**
     * (SSS-2 Only) Add a wallet address to the global Transfer Hook blacklist
     */
    blacklistAdd(address: PublicKey): Promise<string>;
    /**
     * (SSS-2 Only) Forcefully seize assets via the Permanent Delegate extension
     */
    seize(mintAddress: PublicKey, targetAccount: PublicKey, destinationTreasury: PublicKey): Promise<string>;
    /**
     * Protocol Status Monitoring
     */
    getStatus(): Promise<any>;
}
