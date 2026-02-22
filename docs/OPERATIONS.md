# OPERATIONS.md

Operator runbook for `sss-token` CLI.

## Setup

```bash
cd sdk
npm install
npm run build
npm link
```

Optional environment:

```bash
set SSS_RPC_URL=https://api.devnet.solana.com
set SSS_PROGRAM_ID=<YOUR_DEPLOYED_PROGRAM_ID>
```

## Configure Runtime

```bash
sss-token configure --rpc https://api.devnet.solana.com --program-id <YOUR_DEPLOYED_PROGRAM_ID>
```

## Initialize Token

Preset mode:

```bash
sss-token init --preset sss-1 --name "Minimal Stable" --symbol "MUSD"
sss-token init --preset sss-2 --name "Compliant Stable" --symbol "CUSD"
```

Custom file mode:

```bash
sss-token init --custom config.toml
sss-token init --custom config.json
```

## Core Supply Operations

```bash
sss-token mint <recipient> <amount>
sss-token burn <amount> [--from <source>]
sss-token freeze <address>
sss-token thaw <address>
sss-token pause
sss-token unpause
sss-token supply
sss-token status
```

## SSS-2 Compliance Operations

```bash
sss-token blacklist add <address> --reason "OFAC match"
sss-token blacklist remove <address>
sss-token seize <address> --to <treasury> [--amount <value>]
```

## Management Commands

```bash
sss-token minters list
sss-token minters add <address>
sss-token minters remove <address>
sss-token holders [--min-balance <amount>]
sss-token audit-log [--action <type>]
sss-token transfer-authority <new-authority>
```

## Notes

- CLI state is persisted in `.sss-token-state.json` in current working directory.
- `audit-log` reads local operator events recorded by CLI.
