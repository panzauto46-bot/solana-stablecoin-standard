# 🏗️ SSS-Forge System Architecture

The SSS-Forge system is a 3-Layer architecture (Smart Contract, TypeScript SDK, and Watchtower Backend) designed for developers and financial operators to issue and manage stablecoins on Solana (leveraging *Token-2022*).

## 1. Protocol Layer (Solana Smart Contract - Rust/Anchor)
The core security layer of SSS-Forge. It consists of *instructions* that activate Token-2022 extensions.

*   **State Storage:** Encompasses **Default Role configurations (RBAC)** and Global Blacklist data (stored *on-chain* utilizing PDAs - Program Derived Addresses).
*   **Transfer Hook:** An independent interceptor program that validates auxiliary metadata *(ExtraAccountMetaList)* before funds change ownership.

## 2. Integration Layer (TypeScript SDK & CLI)
The *middle-man* solution tasked with abstracting complex instructions (TXs) or *Cross-Program Invocations* to Token-2022, enabling them to be utilized like standard JavaScript functions.

*   `SolanaStablecoin` Core Class: An abstraction module for complex operations.
*   CLI Interface: Utilized by *operators* to execute protocol management commands, such as `sss-token mint` or `sss-token freeze`.

## 3. Operations Layer (Watchtower Backend - Node.js/Docker)
An always-online (24/7) service to automate expensive *off-chain* tasks, monitor *compliance*, and report on the _Fiat-to-Crypto_ bridge.

*   **Indexer Service:** A WebSocket _Listener_ connected to the Solana RPC. Automatically fetches _Instruction Data_ upon transactions like `Mint`, `Burn`, or `Seize`.
*   **Mint/Burn Coordinator:** Manages the supply circulation cycle, ensuring unminted tokens are held if the user's *real-world fiat* hasn't successfully reached the Bank.
*   **Compliance Alerts:** In the event of an asset seizure action (_Seize_), this service fires a Webhook message to the regulators' internal Slack/Discord groups in under a millisecond.

---

### Data Flow Diagram (Seize Cycle)
1. A hacker attacks a client's DeFi protocol, and funds are moved illegitimately.
2. The Watchtower Backend **[Operations Layer]** detects anomalous *Patterns* and triggers an alarm to the Discord/Slack Webhook.
3. The Regulatory Officer (holding a WALLET with *Seizer* authorization) boots the CLI `sss-token seize <hacker_address> --to <treasury>` **[Integration Layer]**.
4. The instruction is transmitted to the Solana RPC. The SSS-Forge *Smart Contract* **[Protocol Layer]** validates the `Seizer`'s *signature*.
5. Because the SSS-2 Token possesses the **Permanent Delegate** extension, the Contract instantly forces the transfer of the hacker's balance back to the *Treasury* without requiring the hacker's key signature!
