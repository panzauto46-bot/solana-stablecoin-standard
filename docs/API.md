# 🛡️ API.md (Watchtower Backend)
Sistem penyebaran HTTP untuk interaksi "Perangkat Sisi Klien" maupun "Core Banking System". Seluruh interaksi Token harus dilaporkan di sini demi menjamin Integritas Off-Chain.

## A. Service Lifecycle (Kesehatan)
> Mengekspos dan melaporkan status detak server _Solana Indexer Service_ dan _Bot_ untuk memastikan seluruh node aktif menerima instruksi _Mint_ ke _Devnet/Mainnet_.

*   **URL Endpoint Server:** `http://localhost:3000` (atau Port yang sudah Disesuaikan oleh _Docker_ \`.env\`).
*   **Method Check:**
    ```json
    GET /health
    {
      "status": "OK",
      "message": "SSS Watchtower Backend is Healthy! \uD83D\uDFE2"
    }
    ```

## B. Operasional Utama (Coordinator Services)

### 1. `POST /api/mint`
Ditujukan ke API Core Banking System setelah validasi deposit "Klien Uang _Fiat_". Layanan SSS-Forge Backend ini mengeksekusi Token-2022 Contract untuk memvalidasi pencetakan token baru (Menambah Saldo Digital).

**Format _Payload_ JSON:**
```json
{
  "amount": 999000,
  "destination": "Pubkey_Address_Klien_Valid..."
}
```

### 2. `POST /api/burn`
Ditujukan untuk mencocokkan *Claim Settlement* yang memvalidasi pembakaran token pengguna dengan imbalan penarikan dana (_fiat withdrawal_) di Bank reguler. Ini menurunkan _Circulation Supply_ (Pengendalian Hukum Ekonomi `Stablecoin Peg`).

**Format _Payload_ JSON:**
```json
{
  "amount": 1000,
  "source": "Treasury_Address_Operator..."
}
```

## C. Tindakan Investigasi Hukum
### 1. `POST /api/compliance/blacklist`
Memanggil Layanan Kepatuhan yang segera mengubah PDA eksternal `BlacklistEntry` milik Solana.
Menolak langsung segala upaya _Transfer Hook_ di dompet tertarget, baik dalam bentuk "Kirim", maupun "Terima". _Webhook service_ pun dibangkitkan untuk laporan internal Slack/Discord secara asinkron.

**Format _Payload_ JSON:**
```json
{
  "address": "Pubkey_Dompet_Peretas...",
  "reason": "Suspicious Algorithmic Money Mixing Pattern (AML Red Flag)"
}
```
