# 🏗️ SSS-Forge System Architecture

Sistem SSS-Forge merupakan arsitektur 3-Layer (Smart Contract, TypeScript SDK, dan Watchtower Backend) yang dirancang untuk pengembang dan operator keuangan agar dapat menerbitkan serta mengelola stablecoin di Solana (menggunakan *Token-2022*).

## 1. Protocol Layer (Solana Smart Contract - Rust/Anchor)
Lapisan inti dari keamanan SSS-Forge. Terdiri dari *instructions* yang mengaktifkan ekstensi Token-2022.

*   **Penyimpanan State:** Mencakup konfigurasi **Role Default (RBAC)** dan Global Blacklist data (disimpan *on-chain* menggunakan PDA - Program Derived Address).
*   **Transfer Hook:** Program perantara (interceptor) mandiri yang memvalidasi metadata tambahan *(ExtraAccountMetaList)* sebelum dana berpindah tangan.

## 2. Integration Layer (TypeScript SDK & CLI)
Solusi *middle-man* yang bertugas membangun instruksi (TX) rumit atau *Cross-Program Invocation* ke Token-2022 agar bisa digunakan layaknya fungsi JavaScript biasa.

*   `SolanaStablecoin` Core Class: Modul abstrak dari operasi rumit.
*   CLI Interface: Digunakan oleh *operator* untuk mengeksekusi perintah manajemen protokol, contohnya `sss-token mint` atau `sss-token freeze`.

## 3. Operations Layer (Watchtower Backend - Node.js/Docker)
Layanan yang harus selalu hidup (24/7) untuk melakukan otomatisasi tugas *off-chain* yang mahal, pemantauan *compliance*, dan pelaporan jembatan _Fiat-to-Crypto_.

*   **Indexer Service:** WebSocket _Listener_ ke Solana RPC. Otomatis menarik _Instruction Data_ jika ada transaksi `Mint`, `Burn`, `Seize`.
*   **Mint/Burn Coordinator:** Menahan siklus perputaran suplai token yang tidak tercetak jika uang *fiat (dunia nyata)* pengguna belum berhasil masuk ke Bank.
*   **Compliance Alerts:** Jika ada tindakan penyitaan (_Seize_), layanan ini akan menembakkan pesan Webhook ke grup internal Slack/Discord regulator dalam hitungan milidetik.

---

### Data Flow Diagram (Siklus Seize)
1. Peretas melakukan serangan ke protokol DeFi klien, dana dipindahkan secara tidak sah.
2. Watchtower Backend **[Operations Layer]** mendeteksi *Pattern* tidak terduga dan membunyikan alarm ke Discord/Slack Webhook.
3. Petugas Regulasi (Yang memiliki DOMPET dengan aksi otorisasi *Seizer*) membuka CLI `sss-token seize <hacker_address> --to <treasury>` **[Integration Layer]**.
4. Instruksi dikirim ke Solana RPC. *Smart Contract* SSS-Forge **[Protocol Layer]** memvalidasi *signature* `Seizer`.
5. Karena Token SSS-2 memiliki ekstensi **Permanent Delegate**, Contract secara instan memaksa transfer saldo peretas kembali ke *Treasury* tanpa perlu izin kunci peretas! 
