# 🛡️ API.md (Watchtower Backend)
An HTTP broadcasting system designed for interaction with "Client-Side Devices" and "Core Banking Systems". Every Token interaction must be reported here to guarantee Off-Chain Integrity.

## A. Service Lifecycle (Health)
> Exposes and reports the heartbeat status of the _Solana Indexer Service_ and _Bots_ to confirm all nodes are active and accepting _Mint_ instructions to _Devnet/Mainnet_.

*   **Endpoint Server URL:** `http://localhost:3000` (or Port configured via _Docker_ \`.env\`).
*   **Method Check:**
    ```json
    GET /health
    {
      "status": "OK",
      "message": "SSS Watchtower Backend is Healthy! 🟢"
    }
    ```

## B. Core Operations (Coordinator Services)

### 1. `POST /api/mint`
Aimed at the Core Banking System API after a valid "Fiat U.S. Client" deposit confirmation. This SSS-Forge Backend service triggers the Token-2022 Contract to execute new token printing (Augmenting Digital Balances).

**JSON _Payload_ Format:**
```json
{
  "amount": 999000,
  "destination": "Valid_Client_Pubkey_Address..."
}
```

### 2. `POST /api/burn`
Designed to reconcile *Claim Settlements* validating the combustion of user tokens in exchange for real-world bank withdrawals (_fiat withdrawal_). This diminishes the _Circulation Supply_ (Enforcing the Economic Law of the `Stablecoin Peg`).

**JSON _Payload_ Format:**
```json
{
  "amount": 1000,
  "source": "Operator_Treasury_Address..."
}
```

## C. Legal Investigation Interventions
### 1. `POST /api/compliance/blacklist`
Calls upon the Compliance Service to immediately mutate Solana's external `BlacklistEntry` PDA.
Outright denies all _Transfer Hook_ attempts on the targeted wallet, both "Send" and "Receive" actions. The _Webhook service_ is simultaneously awoken for asynchronous internal Slack/Discord reporting.

**JSON _Payload_ Format:**
```json
{
  "address": "Hacker_Wallet_Pubkey...",
  "reason": "Suspicious Algorithmic Money Mixing Pattern (AML Red Flag)"
}
```
