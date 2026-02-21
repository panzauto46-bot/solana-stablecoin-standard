# 🚔 SSS-2 Specification (Compliant Stablecoin)

A legal standard for global financial institutions governed by **KYC**, **AML** (Anti-Money Laundering) policies, and criminal fund seizure rulings originating from *Court Orders*. SSS-2 is optimized for fiat-pegged coins (e.g., USDC, BUSD).

## 1. Strictly Enforced Extensions
Mandates a high level of authorization (RBAC) to mitigate malicious actions internal to the stablecoin issuer. All assets can **ONLY** be minted and transferred if verified by the *Transfer Hook*:

*   `Mint Authority` & `Freeze Authority`: Managed by the `Minter` and `Pauser` Roles.
*   `Permanent Delegate`: Grants eternal jurisdiction to the `Seizer` Role to confiscate fiat coins from any entity's wallet.
*   `Transfer Hook`: (Automatic) Intercepts every movement of funds on the Token-2022 extension. Reads external PDA (*Program Derived Address*) *Blacklists* prior to a successful *Transfer*.
*   `Default Account State`: (Optional) If enabled as *Frozen*, users under regulatory surveillance cannot interact with money transfers before being *Approved/KYC-verified* (Thaw).

## 2. Specific Authority Levels (Role-Based Access)
SSS-2 asset managers are strictly prohibited from being controlled by a single individual (SPOF - *Single Point of Failure*).

| Role | Regulatory Specialization / Operability |
| :--- | :--- |
| **Master** | Supreme Configurator, the only role capable of assigning members to other Roles. Cannot Mint/Burn. |
| **Minter/Burner** | Controls *Supply* circulation in accordance with real-world Fiat availability. |
| **Pauser** | Emergency reaction to suspend account transactions (Freezing an individual wallet). |
| **Blacklister** | Records hacker or criminal fugitive wallets into the *Transfer Hook* blocking list. |
| **Seizer** | Law enforcement; rarely utilized unless ordered by an International High Court in emergencies. Assumes ownership rights of a wallet. |

## 3. SSS-2 Code Implementation

```typescript
import { SolanaStablecoin } from '@stbr/sss-token';
const sdk = await SolanaStablecoin.create(conn, wallet, programId);

// Initialize an SSS-2 token complete with Delegate, state, and Hook Authorities configurations
const fiatMintAddress = await sdk.initMint('sss-2', 'Institutional Fiat', 'USD+');
```
