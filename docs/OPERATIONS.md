# ⚙️ OPERATIONS.md (Terminal Control Manual)

A Quick Guide for Operators (or "Generals") of the SSS Protocol on executing Command Line Interface (CLI) features. Utilized for deploying, managing, and _Querying_ blockchain data.

### Preparation
1. Navigate your *Terminal* to the source code's `/sdk` directory.
2. Install dependencies using `npm`.
    ```bash
    npm install
    npm run build
    npm link
    ```
3. Test `sss-token -V` (Version 1.0.0).

---

## 1. Init (Initial Asset Manufacturing)
This command mints the initial SSS *Mint Account* via your Devnet SSS-Forge Program.

1.  **Deploying SSS-1 (Standard/Minimal)**
    ```bash
    sss-token init --preset sss-1 --name "Minimal Coin" --symbol "MCOIN"
    ```
2.  **Deploying SSS-2 (Regulatory/Legal Compliance)**
    ```bash
    sss-token init --preset sss-2 --name "Institutional USD" --symbol "IUSD"
    ```

## 2. Supply Circulation
Routinely performed by an authenticated `Minter` (correlating fiat money receipts via the *Backend*).
*   **Mint (Print Assets to User)**
    ```bash
    sss-token mint --mint 11111111111... --to USER_ADDRESS... --amount 150000000 
    ```
*   **Burn (Destroy Assets in Treasury upon user withdrawal)**
    ```bash
    sss-token burn --mint 11111111111... --from OPERATOR_ADDRESS... --amount 1000000
    ```

## 3. Emergency & Legal Compliance (SSS-2 Exclusive)
1.  **Freezing and Restoring a Single Wallet**
    ```bash
    sss-token freeze --mint MINT_ADDRESS --target USER_ADDRESS
    sss-token thaw --mint MINT_ADDRESS --target USER_ADDRESS
    ```

2.  **Blacklist (Permanent Transaction Interception)**
    ```bash
    sss-token blacklist add HACKER_ADDRESS_123xyZ...
    ```

3.  **Seize (Executing `Seizer` Intervention to Secure Stolen Funds)**
    ```bash
    # Forcibly transfers 50,000 funds from targeted wallet (Without their signature!)
    sss-token seize HACKER_ADDRESS_123xyZ... --mint MINT_ADDRESS --to TREASURY_ADDRESS
    ```

## 4. Network Query / Audit
*   Network Activity Report: `sss-token status`
*   Liquidity Monitor: `sss-token supply --mint MINT_ADDRESS`
*   Registered Accounts Informant: `sss-token minters list`
