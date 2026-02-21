# ⚙️ OPERATIONS.md (Terminal Control Manual)

Panduan Cepat menjalankan fitur Command Line Interface (CLI) untuk Operator (atau "Jenderal") dari Protokol SSS. Digunakan untuk mendeploy, mengatur dan _Query_ data blockchain.

### Persiapan
1. Arahkan *Terminal* ke direktori `/sdk` dari *source code*.
2. Lakukan Instalasi dependencies menggunakan `npm`.
    ```bash
    npm install
    npm run build
    npm link
    ```
3. Uji `sss-token -V` (Versi 1.0.0).

---

## 1. Init (Manufaktur Aset Awal)
Perintah ini akan mencetak *Mint Account* SSS dengan Program SSS-Forge Devnet dari Anda.

1.  **Mendeploy SSS-1 (Standard/Minimal)**
    ```bash
    sss-token init --preset sss-1 --name "Minimal Coin" --symbol "MCOIN"
    ```
2.  **Mendeploy SSS-2 (Regulasi/Kepatuhan Hukum)**
    ```bash
    sss-token init --preset sss-2 --name "Institusional USD" --symbol "IUSD"
    ```

## 2. Sirkulasi Suplai
Biasa dilakukan oleh `Minter` yang ter-autentikasi (mencocokkan penerimaan uang Fiat via *Backend*).
*   **Mint (Cetak Aset ke Pengguna)**
    ```bash
    sss-token mint --mint 11111111111... --to USER_ADDRESS... --amount 150000000 
    ```
*   **Burn (Hancurkan Aset di Treasury saat pengguna menarik uang)**
    ```bash
    sss-token burn --mint 11111111111... --from OPERATOR_ADDRESS... --amount 1000000
    ```

## 3. Darurat & Kepatuhan Hukum (SSSS-2 Khusus)
1.  **Membekukan dan Memulihkan Wallet Tunggal**
    ```bash
    sss-token freeze --mint MINT_ADDRESS --target USER_ADDRESS
    sss-token thaw --mint MINT_ADDRESS --target USER_ADDRESS
    ```

2.  **Blacklist (Mencegat Transaksi Permanen)**
    ```bash
    sss-token blacklist add HACKER_ADDRESS_123xyZ...
    ```

3.  **Seize (Eksekusi Turun Tangan `Seizer` Mengamankan Dana Curian)**
    ```bash
    # Memaksa transfer 50.000 dana dari wallet tertarget (Tanpa signature mereka!)
    sss-token seize HACKER_ADDRESS_123xyZ... --mint MINT_ADDRESS --to TREASURY_ADDRESS
    ```

## 4. Query / Audit Jaringan
*   Laporan Aktivitas Jaringan: `sss-token status`
*   Pemantau Likuiditas: `sss-token supply --mint MINT_ADDRESS`
*   Informan Akun Terdaftar: `sss-token minters list`
