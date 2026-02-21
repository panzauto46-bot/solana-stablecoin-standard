<div align="center">

# 💎 SSS Forge
**Solana Stablecoin Standard (SSS) Creation Protocol - Token-2022**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet--Live-green?logo=solana)](https://explorer.solana.com/address/sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA?cluster=devnet)
[![Anchor v0.30.1](https://img.shields.io/badge/Anchor-v0.30.1-blue)](#)

*An innovative protocol for launching next-generation stablecoins on Solana, fully compliant with the new spl-token-2022 standard and advanced extensions.*

</div>

---

## 🚀 Devnet Proof of Deployment

SSS Forge Smart Contract is live on Solana Devnet!
*   **Program ID:** [`sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA`](https://explorer.solana.com/address/sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA?cluster=devnet)
*   *Use the Solana Explorer link above to verify our Program Deployment and associated transactions.*

---

## 📖 Overview

**SSS Forge** is an all-in-one Smart Contract architecture and Watchtower ecosystem designed to generate, manage, and regulate stablecoins on the Solana blockchain. By fully leveraging the modern **Token-2022** program extensions, SSS Forge provides two powerful tiers of stablecoin creation tailored for different economic use cases:

**(Comprehensive Project Documentation Suite):**
*   🧭 **Architecture Deep Dive:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
*   💎 **SSS-1 Minimal Spec:** [`docs/SSS-1.md`](docs/SSS-1.md)
*   🚔 **SSS-2 Compliant Spec:** [`docs/SSS-2.md`](docs/SSS-2.md)
*   💻 **SDK & Integration Guide:** [`docs/SDK.md`](docs/SDK.md)
*   🛠️ **Terminal CLI Operations:** [`docs/OPERATIONS.md`](docs/OPERATIONS.md)
*   🛡️ **Regulation & Compliance Rules:** [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md)
*   🌐 **Watchtower API Reference:** [`docs/API.md`](docs/API.md)

---

## ✨ Key Features & Technical Specifications

### 🔐 1. Advanced Role-Based Access Control (RBAC)
To ensure absolute security and decentralization of power, the protocol configuration defines multiple distinct roles:
*   👑 `Master`: Supreme configurator. Updates authorities but cannot mint or burn.
*   🖨️ `Minter`: Authorized to mint new tokens corresponding to fiat reserves.
*   🔥 `Burner`: Authorized to burn tokens from the protocol treasury.
*   ⏸️ `Pauser`: Authorized to freeze specific addresses (emergency halt).
*   🚫 `Blacklister`: Authorized to add/remove addresses from the global Transfer Hook blacklist.
*   🚔 `Seizer`: Authorized to forcefully seize assets from compromised wallets (*SSS-2 Compliant tokens only*).

### 🪝 2. Transfer Hooks (Auto-Enforced AML)
Using `spl-transfer-hook-interface`, every transaction of a Compliant Token (SSS-2) is automatically routed through our custom on-chain program.
*   If the sender OR the receiver is recorded in the `BlacklistEntry` state PDA, the transfer instruction is **rejected** at the program level.
*   Requires zero off-chain indexing manipulation; 100% enforced by Solana validators.

### 🛡️ 3. Native Compliance (Seize Funds)
Regulated stablecoin issuers must comply with court orders to seize funds from hackers or sanctioned entities.
*   Utilizing the Token-2022 `Permanent Delegate` extension.
*   The `Seizer` wallet can execute a CPI call to gracefully withdraw tokens from an arbitrary wallet into the treasury without the owner's signature.

### 🚥 4. Graceful Failure Mechanism
Designed to be robust and developer-friendly. If the `Seizer` attempts to seize funds from an **SSS-1 Minimal Token** (which intentionally lacks a Permanent Delegate), the program avoids panicking. Instead, it inspects the Mint extensions and returns a clean, custom error code: `NotSSS2Compliant`.

---

## 📁 Project Structure

The codebase is highly modular, separating the Protocol (Rust), Integration (TypeScript), and Operations (Node Backend).

```text
SSS-Forge/
│
├── programs/sss_forge/src/     # [LAYER 1] Smart Contracts (Rust / Anchor)
│   ├── lib.rs                  # Main program entrypoint
│   ├── state.rs                # On-chain data structures (Config, Blacklist)
│   ├── errors.rs               # Custom ProgramError enums (Graceful Failures)
│   └── instructions/           # Business logic modules (RBAC, Seize, Blacklist, Hook)
│
├── sdk/                        # [LAYER 2] TypeScript SDK & CLI Tooling
│   ├── src/index.ts            # High-level OOP SolanaStablecoin Class
│   ├── src/cli.ts              # Command Line Interface (Commander)
│   └── package.json            # @stbr/sss-token NPM config
│
├── backend/                    # [LAYER 3] Watchtower API & Indexer (Node.js)
│   ├── src/index.ts            # Express server entrypoint
│   ├── src/services/           # Core services (Indexer, Webhook, Compliance, MintBurn)
│   ├── Dockerfile              # Containerization for production
│   └── .env.example            # Environment variables template
│
├── docs/                       # Project Documentation Suite
├── tests/                      # Integration Test Suites (Mocha / Chai)
├── docker-compose.yml          # One-click deployment for the Watchtower Backend
└── README.md                   # You are here
```

---

## 🗺️ Roadmap

- [x] **Phase 1:** UI/UX Dashboard Concept Design.
- [x] **Phase 2:** Smart Contract Architecture (Rust/Anchor) with Token-2022 Extensions.
- [x] **Phase 3:** TypeScript SDK and CLI Operator Panel (`@stbr/sss-token`).
- [x] **Phase 4:** Watchtower Backend Services (Indexer, Webhooks) & Docker Containerization.
- [x] **Phase 5:** Grand Documentation Suite & Integration Testing.
- [ ] **Phase 6:** Mainnet Deployment & Third-Party Security Audits.
- [ ] **Phase 7:** Web Interface Release (Dashboard interacting directly with SDK).

---

## 🛠️ Tech Stack
*   **Smart Contracts:** Rust, Anchor Framework `v0.30.1`
*   **Solana Programs:** `spl-token-2022`, `spl-transfer-hook-interface`
*   **Integration SDK:** TypeScript, Node.js, Commander
*   **Backend Services:** Express.js, Winston, Docker Compose
*   **Testing:** Mocha, Chai, Anchor Localnet

---

## 📜 License
This project is licensed under the **MIT License**.
Copyright © 2026 Pandu Dargah. See the `LICENSE` file for more details.

---
<div align="center">
  <i>Built with ❤️ for the Web3 Ecosystem.</i>
</div>
