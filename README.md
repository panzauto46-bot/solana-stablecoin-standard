<div align="center">

# 💎 SSS Forge
**Solana Stablecoin Standard (SSS) Creation Protocol - Token-2022**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet--Live-green?logo=solana)](https://explorer.solana.com/address/sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA?cluster=devnet)
[![Anchor](https://img.shields.io/badge/Anchor-v0.30.1-blue)](#)

*An innovative protocol for launching next-generation stablecoins on Solana, fully compliant with the new spl-token-2022 standard and advanced extensions.*

</div>

---

## 🚀 Devnet Proof of Deployment

SSS Forge Smart Contract is live on Solana Devnet!
*   **Program ID:** [`sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA`](https://explorer.solana.com/address/sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA?cluster=devnet)
*   *Use the Solana Explorer link above to verify our Program Deployment and associated transactions.*

---

## 📖 Overview

**SSS Forge** is an all-in-one Smart Contract architecture and Dashboard interface designed to generate, manage, and regulate stablecoins on the Solana blockchain. By fully leveraging the modern **Token-2022** extensions, SSS Forge provides two powerful tiers of stablecoin creation:

**(See Core Overviews in our Comprehensive Project Kit):**
*  🧭 **Architecture Deep Dive:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
*  🌐 **Watchtower API Reference:** [`docs/API.md`](docs/API.md)
*  🛡️ **Regulation & Compliance Rules:** [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md)
*  🛠️ **Terminal CLI Guide:** [`docs/OPERATIONS.md`](docs/OPERATIONS.md)

1.  **SSS-1: Minimal Stablecoin** *(Spec: [`docs/SSS-1.md`](docs/SSS-1.md))*
    *   Designed for algorithmic or decentralized stablecoins.
    *   Features: Mint Authority, Freeze Authority, and Metadata Pointer.
2.  **SSS-2: Compliant Stablecoin** *(Spec: [`docs/SSS-2.md`](docs/SSS-2.md))*
    *   Designed for fiat-backed or regulated stablecoins.
    *   Features everything in SSS-1, *plus*:
        *   **Permanent Delegate:** Absolute authority to move or seize assets for compliance.
        *   **Transfer Hooks:** On-chain interception of transactions to enforce AML (Anti-Money Laundering) or Blacklisting automatically.
        *   **Default Account State:** Automatic freezing of new accounts pending KYC verification (if enabled).

This project demonstrates deep understanding of Rust, Anchor, and Solana's latest token program capabilities, built with an emphasis on **Role-Based Access Control (RBAC)** to eliminate single points of failure.

---

## ✨ Key Features & Technical Specifications

### 🔐 1. Advanced Role-Based Access Control (RBAC)
To ensure absolute security and decentralization of power, the protocol configuration defines multiple distinct roles:
*   👑 `Master`: Can only update the authorities of other roles, cannot mint or burn.
*   🖨️ `Minter`: Authorized to mint new tokens.
*   🔥 `Burner`: Authorized to burn tokens from the protocol treasury.
*   ⏸️ `Pauser`: Authorized to freeze specific addresses (if malicious activity is suspected).
*   🚫 `Blacklister`: Authorized to add or remove addresses from the global Transfer Hook blacklist.
*   🚔 `Seizer`: Authorized to forcibly seize assets from compromised or sanctioned wallets (only applies to *SSS-2 Compliant* tokens).

### 🪝 2. Transfer Hooks (Auto-Enforced Blacklist)
Using `spl-transfer-hook-interface`, every transaction of a Compliant Token (SSS-2) is automatically routed through our custom on-chain program.
*   If the sender OR the receiver is recorded in the `BlacklistEntry` state PDA, the transfer instruction is **rejected**.
*   Requires zero off-chain indexing; 100% enforced by the Solana validator level.

### 🛡️ 3. Native Compliance (Seize Funds)
Regulated stablecoin issuers must comply with court orders to seize funds from peretas (hackers) or sanctioned entities. 
*   Utilize the Token-2022 `Permanent Delegate` extension.
*   The `Seizer` can execute a CPI call to forcefully withdraw tokens from an arbitrary wallet into the treasury without needing the wallet owner's signature.

### 🚥 4. Graceful Failure Mechanism
Designed to be robust and developer-friendly. If the `Seizer` attempts to seize funds from an **SSS-1 Minimal Token** (which does not have a Permanent Delegate by design), the program does not violently crash `(panic!)`. Instead, it checks the Mint extensions beforehand and returns a clean, custom error code: `NotSSS2Compliant`.

---

## 📁 Project Structure

The codebase is highly modular, separating state, errors, and logic for maximum readability and security auditing.

```text
SSS-Forge/
│
├── programs/sss_forge/src/
│   ├── lib.rs                  # Main program entrypoint & declaration
│   ├── state.rs                # On-chain data structures (Config, Blacklist)
│   ├── errors.rs               # Custom ProgramError enums (Graceful Failures)
│   └── instructions/           # Business logic modules
│       ├── mod.rs              # Instruction exports
│       ├── initialize_config.rs# Setup RBAC authorities
│       ├── update_config.rs    # Update RBAC roles (Master only)
│       ├── initialize_sss1.rs  # Mint creation (Minimal features)
│       ├── initialize_sss2.rs  # Mint creation (Compliant features)
│       ├── blacklist.rs        # Add/remove addresses to PDA Blacklist
│       ├── transfer_hook.rs    # Transfer interception logic
│       └── seize.rs            # Compliance fund seizure via Permanent Delegate
│
├── src/                        # Frontend UI Dashboard (React + Vite + Tailwind)
│   ├── components/             # Reusable UI Blocks
│   ├── hooks/                  # Custom React Hooks
│   ├── data/                   # Mock integrations
│   ├── main.tsx                # App Entry point
│   └── index.css               # Global Styling
│
├── Anchor.toml                 # Anchor framework configuration
├── Cargo.toml                  # Rust Workspace and Dependencies
└── README.md                   # Project Documentation
```

---

## 🛠️ Tech Stack
*   **Smart Contracts:** Rust, Anchor Framework `v0.30.1`
*   **Solana Programs:** `spl-token-2022`, `spl-transfer-hook-interface`
*   **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
*   **Web3 Integration:** `@solana/web3.js` (Target)

---

## 📜 License
This project is licensed under the **MIT License**.
Copyright © 2026 Pandu Dargah. See the `LICENSE` file for more details.

---
<div align="center">
  <i>Built with ❤️ for the Web3 Ecosystem.</i>
</div>
