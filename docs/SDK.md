# SDK.md

`@stbr/sss-token` exposes a preset-first API and custom extension config API for SSS-1 and SSS-2 flows.

## Install

```bash
cd sdk
npm install
npm run build
```

## Preset Init

```ts
import { Connection, Keypair } from "@solana/web3.js";
import { SolanaStablecoin, Presets } from "@stbr/sss-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const authority = { publicKey: Keypair.generate().publicKey };

const stable = await SolanaStablecoin.create(connection, {
  preset: Presets.SSS_2,
  name: "My Stablecoin",
  symbol: "MYUSD",
  decimals: 6,
  authority,
});
```

## Custom Init

```ts
const custom = await SolanaStablecoin.create(connection, {
  name: "Custom Stable",
  symbol: "CUSD",
  authority,
  extensions: {
    permanentDelegate: true,
    transferHook: true,
    defaultAccountFrozen: false,
  },
});
```

## Core Operations

```ts
await stable.mint({ recipient, amount: 1_000_000, minter: authority.publicKey });
await stable.burn({ amount: 250_000 });
await stable.freeze({ address: suspiciousAccount });
await stable.thaw({ address: suspiciousAccount });
await stable.pause();
await stable.unpause();

const supply = await stable.getTotalSupply();
const holders = await stable.holders({ minBalance: 100_000 });
const status = await stable.status();
```

## Compliance Namespace (SSS-2)

```ts
await stable.compliance.blacklistAdd(address, "Sanctions screening match");
await stable.compliance.blacklistRemove(address);
await stable.compliance.seize({
  from: blacklistedAccount,
  to: treasuryAccount,
  amount: 500_000,
});
```

## Role and Authority Management

```ts
await stable.updateRoles({
  minter: newMinter,
  pauser: newPauser,
  blacklister: newBlacklister,
});

await stable.transferAuthority(newMasterAuthority);
const minters = await stable.mintersList();
```

## Snapshot / Restore

The SDK supports local runtime state snapshots for CLI workflows:

```ts
const snapshot = stable.toSnapshot();
const restored = await SolanaStablecoin.open(connection, {
  name: snapshot.name,
  symbol: snapshot.symbol,
  authority,
  preset: snapshot.preset,
  decimals: snapshot.decimals,
  extensions: snapshot.extensions,
}, snapshot);
```
