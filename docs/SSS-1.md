# 🔰 SSS-1 Specification (Minimal Stablecoin)

A lightweight Stablecoin standard in the Solana ecosystem based on Token-2022. Perfectly suited for algorithmic or *Decentralized Stablecoins* (similar to DAI).

## 1. Active Extensions
SSS-1 is initialized with the lowest functional threshold, maximizing usage flexibility in DeFi (AMMs, *Lending Vaults*). 

*   `Mint Authority`: Allows the *smart contract* protocol to inflate the supply.
*   `Freeze Authority`: Acts as an *Emergency Switch* to halt liquidity if a network exploit vulnerability is newly discovered.
*   `Metadata Pointer`: Pointers the *on-chain* token name decentrally to the Mint wallet address (eliminating reliance on third-party Token Lists).

## 2. Exclusions and Limitations
Since the target of SSS-1 is to be a *Trustless Decentralized stablecoin*, the following extensions are **PROHIBITED**:
*   🚫 `Transfer Hook` (Must not be spied on or hindered).
*   🚫 `Permanent Delegate` (Minted money is the absolute property of the user; it cannot be confiscated via behind-the-scenes *Governance*).
*   🚫 `Default Account State` Frozen (Any account opening a new *associated token account* can immediately transfer/receive assets).

## 3. Code Implementation
To instantiate an SSS-1 token type:
```typescript
import { SolanaStablecoin } from '@stbr/sss-token';
const sdk = await SolanaStablecoin.create(conn, wallet, programId);

// Initialize an SSS-1 token 
const mintAddress = await sdk.initMint('sss-1', 'My Algo Stable', 'ALGOS');
```
