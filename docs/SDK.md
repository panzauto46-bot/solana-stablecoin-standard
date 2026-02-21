# 💻 @stbr/sss-token: SDK Installation & Usage

This TypeScript library compiles the intricacies of _Token-2022 Extensions_, _Anchor CPIs_, and _Transfer Hooks_ into a straightforward Object-Oriented API for `SolanaStablecoin`.

## Installation
```bash
npm install @stbr/sss-token
yarn add @stbr/sss-token
```

## Quick Start (SDK Init)
The SDK requires a valid _Wallet_ and an RPC _Connection_ URL (Mainnet, Devnet, or Local). 
It is recommended to place the `Mint Authority`'s *Private Key* in _Environment Variables_.

```typescript
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SolanaStablecoin } from "@stbr/sss-token";

// Solana Devnet Smart Contract Program ID (Anchor)
const PROGRAM_ID = new PublicKey("sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA");

async function main() {
    const conn = new Connection("https://api.devnet.solana.com", "confirmed");
    // Simulated keypair - IN PRODUCTION USE process.env.PRIVATE_KEY
    const operatorWallet = Keypair.generate(); 

    // Instantiate Control Panel (Bridge) to Protocol
    const protocol = await SolanaStablecoin.create(conn, operatorWallet, PROGRAM_ID);

    // Create an SSS-2 compliancy standard Fiat Asset
    const fiatToken = await protocol.initMint('sss-2', 'XYZ Dollar', 'XYZD');
    
    // Allocate New Funds post-KYC
    await protocol.mint(fiatToken, new PublicKey('USER_ADDRESS'), 50000000); 

    console.log("Deployed Mint:", fiatToken.toBase58());
}

main();
```

## Core Methods Reference
*   `protocol.initMint(preset, name, symbol)`: Creates a _Token-2022 Stablecoin_ on Devnet.
*   `protocol.mint(mintAddress, targetPubKey, amount_raw)`: Increases coin circulation to a user.
*   `protocol.burn(mintAddress, sourcePubKey, amount_raw)`: Reduces / Destroys coin circulation from the *(Treasury)* wallet.
*   `protocol.freeze(mintAddress, userAccount)`: Emergency status to freeze a specific wallet.
*   `protocol.thaw(mintAddress, userAccount)`: Revokes the frozen status of a user's wallet.
*   **(Compliance Actions)**
    *   `protocol.blacklistAdd(hackerAddress)`: Inspects and automatically Rejects (_Reverts_) any `Transfer` by this wallet at the *hook* level.
    *   `protocol.seize(mintAddress, hackerAddress, treasuryAddress)`: Forces the `Permanent Delegate` to drain fiat coins back to the SSS-Forge developers' regulatory wallet.
